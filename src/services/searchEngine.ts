import MiniSearch, { SearchResult } from 'minisearch';
import { EmailMessage, SearchFilter } from '../types/mail';

export class EmailSearchEngine {
  private miniSearch: MiniSearch<EmailMessage>;
  private indexedMessages: Map<string, EmailMessage> = new Map();

  constructor() {
    this.miniSearch = new MiniSearch<EmailMessage>({
      fields: ['subject', 'bodyText', 'fromName', 'fromEmail', 'snippet', 'attachmentNames', 'labelsStr', 'accountName'],
      storeFields: ['id', 'threadId', 'accountId', 'folderType', 'subject', 'snippet', 'date', 'isRead', 'isStarred', 'hasAttachments'],
      extractField: (document: any, fieldName: string) => {
        if (fieldName === 'fromName') return document.from?.name || '';
        if (fieldName === 'fromEmail') return document.from?.email || '';
        if (fieldName === 'attachmentNames') {
          return (document.attachments || []).map((a: any) => a.filename).join(' ');
        }
        if (fieldName === 'labelsStr') {
          return (document.labels || []).join(' ');
        }
        if (fieldName === 'accountName') {
          return document.accountName || '';
        }
        return document[fieldName];
      },
      searchOptions: {
        boost: { subject: 3, fromName: 2.5, fromEmail: 2, snippet: 1.5, attachmentNames: 2, bodyText: 1 },
        fuzzy: 0.2,
        prefix: true,
      },
    });
  }

  public indexAll(messages: EmailMessage[], accountMap?: Map<string, string>) {
    this.miniSearch.removeAll();
    this.indexedMessages.clear();

    const docs = messages.map(msg => {
      this.indexedMessages.set(msg.id, msg);
      return {
        ...msg,
        accountName: accountMap ? accountMap.get(msg.accountId) || '' : '',
      };
    });

    this.miniSearch.addAll(docs);
  }

  public addOrUpdate(message: EmailMessage, accountName?: string) {
    if (this.miniSearch.has(message.id)) {
      this.miniSearch.discard(message.id);
    }
    this.indexedMessages.set(message.id, message);
    this.miniSearch.add({
      ...message,
      accountName: accountName || '',
    });
  }

  public remove(messageId: string) {
    if (this.miniSearch.has(messageId)) {
      this.miniSearch.discard(messageId);
    }
    this.indexedMessages.delete(messageId);
  }

  /**
   * Universal search with token parsing across ALL INBOXES or scoped account
   * Supports:
   *  - regular text queries ("roadmap", "flight")
   *  - has:attachment, has:file
   *  - is:unread, is:read, is:starred, is:flagged
   *  - from:name_or_email
   *  - to:name_or_email
   *  - account:name_or_id
   *  - in:folder
   */
  public search(filter: SearchFilter): { messageIds: Set<string>; matchedCount: number; scores: Map<string, number> } {
    const rawQuery = filter.query.trim();
    let textQuery = rawQuery;

    const tokens: {
      hasAttachment?: boolean;
      isUnread?: boolean;
      isStarred?: boolean;
      from?: string;
      to?: string;
      account?: string;
      folder?: string;
    } = {};

    // Token extraction regex
    const tokenRegex = /(has:attachment|has:file|is:unread|is:read|is:starred|is:flagged|from:[^\s]+|to:[^\s]+|account:[^\s]+|in:[^\s]+)/gi;
    const matches = rawQuery.match(tokenRegex);

    if (matches) {
      matches.forEach(token => {
        const lower = token.toLowerCase();
        if (lower === 'has:attachment' || lower === 'has:file') tokens.hasAttachment = true;
        else if (lower === 'is:unread') tokens.isUnread = true;
        else if (lower === 'is:read') tokens.isUnread = false;
        else if (lower === 'is:starred' || lower === 'is:flagged') tokens.isStarred = true;
        else if (lower.startsWith('from:')) tokens.from = token.slice(5).toLowerCase();
        else if (lower.startsWith('to:')) tokens.to = token.slice(3).toLowerCase();
        else if (lower.startsWith('account:')) tokens.account = token.slice(8).toLowerCase();
        else if (lower.startsWith('in:')) tokens.folder = token.slice(3).toLowerCase();

        textQuery = textQuery.replace(token, '');
      });
      textQuery = textQuery.trim();
    }

    // Merge manual filter options
    if (filter.hasAttachment !== undefined) tokens.hasAttachment = filter.hasAttachment;
    if (filter.isUnread !== undefined) tokens.isUnread = filter.isUnread;
    if (filter.isStarred !== undefined) tokens.isStarred = filter.isStarred;
    if (filter.from) tokens.from = filter.from.toLowerCase();
    if (filter.to) tokens.to = filter.to.toLowerCase();
    if (filter.accountId && filter.accountId !== 'all') tokens.account = filter.accountId.toLowerCase();
    if (filter.folderType && filter.folderType !== 'all') tokens.folder = filter.folderType.toLowerCase();

    let candidateMessages: EmailMessage[] = [];
    const scores = new Map<string, number>();

    if (textQuery.length > 0) {
      try {
        const results: SearchResult[] = this.miniSearch.search(textQuery, {
          prefix: true,
          fuzzy: 0.2,
          combineWith: 'AND',
        });
        results.forEach(res => {
          const doc = this.indexedMessages.get(res.id);
          if (doc) {
            candidateMessages.push(doc);
            scores.set(doc.id, res.score);
          }
        });
      } catch (err) {
        // Fallback to in-memory substring match
        this.indexedMessages.forEach(doc => {
          if (
            doc.subject.toLowerCase().includes(textQuery.toLowerCase()) ||
            doc.bodyText.toLowerCase().includes(textQuery.toLowerCase()) ||
            doc.from.name.toLowerCase().includes(textQuery.toLowerCase()) ||
            doc.from.email.toLowerCase().includes(textQuery.toLowerCase())
          ) {
            candidateMessages.push(doc);
            scores.set(doc.id, 1);
          }
        });
      }
    } else {
      // If no text query, start with all indexed messages
      candidateMessages = Array.from(this.indexedMessages.values());
    }

    // Apply tokens / criteria filters
    const matchedIds = new Set<string>();

    candidateMessages.forEach(msg => {
      if (tokens.hasAttachment !== undefined && msg.hasAttachments !== tokens.hasAttachment) return;
      if (tokens.isUnread !== undefined && (tokens.isUnread ? msg.isRead : !msg.isRead)) return;
      if (tokens.isStarred !== undefined && msg.isStarred !== tokens.isStarred) return;
      if (tokens.folder && msg.folderType.toLowerCase() !== tokens.folder) return;
      if (tokens.account && !msg.accountId.toLowerCase().includes(tokens.account)) return;
      if (tokens.from) {
        const fromMatch = msg.from.name.toLowerCase().includes(tokens.from) || msg.from.email.toLowerCase().includes(tokens.from);
        if (!fromMatch) return;
      }
      if (tokens.to) {
        const toMatch = msg.to.some(t => t.name.toLowerCase().includes(tokens.to!) || t.email.toLowerCase().includes(tokens.to!));
        if (!toMatch) return;
      }
      if (filter.category && filter.category !== 'all' && msg.category !== filter.category) return;

      // Date range filter
      if (filter.dateRange && filter.dateRange !== 'all') {
        const msgTime = new Date(msg.date).getTime();
        const now = Date.now();
        if (filter.dateRange === 'today' && now - msgTime > 24 * 60 * 60 * 1000) return;
        if (filter.dateRange === 'week' && now - msgTime > 7 * 24 * 60 * 60 * 1000) return;
        if (filter.dateRange === 'month' && now - msgTime > 30 * 24 * 60 * 60 * 1000) return;
        if (filter.dateRange === 'year' && now - msgTime > 365 * 24 * 60 * 60 * 1000) return;
      }

      matchedIds.add(msg.id);
    });

    return {
      messageIds: matchedIds,
      matchedCount: matchedIds.size,
      scores,
    };
  }
}

export const globalSearchEngine = new EmailSearchEngine();

import { globalSearchEngine } from '../src/services/searchEngine';
import { INITIAL_ACCOUNTS, INITIAL_MESSAGES, buildThreadsFromMessages } from '../src/data/mockData';

function runVerificationTests() {
  console.log('🧪 Starting MacMail Multi-Account & Search Verification Suite...\n');

  // Test 1: Accounts and Threads aggregation
  console.log('1️⃣ Testing Multi-Account Aggregation in "All Inboxes"...');
  const threads = buildThreadsFromMessages(INITIAL_MESSAGES, INITIAL_ACCOUNTS);
  console.log(`✓ Aggregated ${INITIAL_MESSAGES.length} messages into ${threads.length} threads across ${INITIAL_ACCOUNTS.length} accounts.`);
  if (threads.length === 0) throw new Error('Failed to build threads');

  // Verify accounts present
  const accountIds = new Set(threads.map(t => t.accountId));
  console.log(`✓ Accounts active in All Inboxes: ${Array.from(accountIds).join(', ')}`);
  if (!accountIds.has('acc_work') || !accountIds.has('acc_personal') || !accountIds.has('acc_consulting')) {
    throw new Error('Missing accounts in All Inboxes view');
  }

  // Test 2: Search Indexing across all accounts
  console.log('\n2️⃣ Testing Full-Text Indexing across all accounts...');
  const accountMap = new Map<string, string>();
  INITIAL_ACCOUNTS.forEach(a => accountMap.set(a.id, a.name));
  
  const startTime = performance.now();
  globalSearchEngine.indexAll(INITIAL_MESSAGES, accountMap);
  const indexDuration = performance.now() - startTime;
  console.log(`✓ Indexed all messages across accounts in ${indexDuration.toFixed(2)}ms`);

  // Test 3: Universal text search across all inboxes
  console.log('\n3️⃣ Testing Universal Search across All Inboxes...');
  const res1 = globalSearchEngine.search({ query: 'MacBook' });
  console.log(`✓ Query "MacBook" matched ${res1.matchedCount} emails in personal/iCloud inbox.`);
  if (res1.matchedCount === 0) throw new Error('Expected search to find MacBook order');

  const res2 = globalSearchEngine.search({ query: 'Roadmap' });
  console.log(`✓ Query "Roadmap" matched ${res2.matchedCount} emails in work/Gmail inbox.`);
  if (res2.matchedCount === 0) throw new Error('Expected search to find Roadmap review');

  const res3 = globalSearchEngine.search({ query: 'Advisory' });
  console.log(`✓ Query "Advisory" matched ${res3.matchedCount} emails in consulting/Outlook inbox.`);
  if (res3.matchedCount === 0) throw new Error('Expected search to find Advisory agreement');

  // Test 4: Token filtering
  console.log('\n4️⃣ Testing Search Tokens & Filters (has:attachment, is:unread, is:starred)...');
  const resAttach = globalSearchEngine.search({ query: 'has:attachment' });
  console.log(`✓ Filter "has:attachment" matched ${resAttach.matchedCount} emails across all accounts.`);
  if (resAttach.matchedCount === 0) throw new Error('Expected attachments query to find emails');

  const resUnread = globalSearchEngine.search({ query: 'is:unread' });
  console.log(`✓ Filter "is:unread" matched ${resUnread.matchedCount} unread emails.`);
  if (resUnread.matchedCount === 0) throw new Error('Expected unread query to find unread emails');

  const resFrom = globalSearchEngine.search({ query: 'from:elena' });
  console.log(`✓ Filter "from:elena" matched ${resFrom.matchedCount} emails from Elena Rostova.`);
  if (resFrom.matchedCount === 0) throw new Error('Expected from:elena to find Elena Rostova emails');

  console.log('\n🎉 ALL VERIFICATION TESTS PASSED SUCCESSFULLY!\n');
}

runVerificationTests();

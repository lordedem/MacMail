import { Account, EmailMessage, EmailThread } from '../types/mail';

export const INITIAL_ACCOUNTS: Account[] = [
  {
    id: 'acc_work',
    name: 'Alex Rivers (Work)',
    email: 'alex.rivers@acmecorp.io',
    provider: 'gmail',
    color: '#2563eb', // Blue
    badgeColor: 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30',
    isEnabled: true,
    unreadCount: 4,
    lastSyncTime: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
    signature: 'Best regards,\nAlex Rivers\nHead of Engineering | Acme Corp\n+1 (555) 234-5678',
    isDefault: true,
  },
  {
    id: 'acc_personal',
    name: 'Alex Rivers (Personal)',
    email: 'alex.rivers@icloud.com',
    provider: 'icloud',
    color: '#059669', // Emerald
    badgeColor: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
    isEnabled: true,
    unreadCount: 2,
    lastSyncTime: new Date(Date.now() - 7 * 60 * 1000).toISOString(),
    signature: '— Alex\nSent from MacMail',
    isDefault: false,
  },
  {
    id: 'acc_consulting',
    name: 'Rivers Advisory',
    email: 'alex@rivers-advisory.com',
    provider: 'outlook',
    color: '#7c3aed', // Purple
    badgeColor: 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30',
    isEnabled: true,
    unreadCount: 1,
    lastSyncTime: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    signature: 'Alex Rivers\nManaging Partner | Rivers Advisory\nwww.rivers-advisory.com',
    isDefault: false,
  },
];

export const INITIAL_MESSAGES: EmailMessage[] = [
  // ================= WORK ACCOUNT (Gmail) =================
  {
    id: 'msg_w1',
    threadId: 'th_w1',
    accountId: 'acc_work',
    folderType: 'inbox',
    from: { name: 'Elena Rostova', email: 'elena.rostova@acmecorp.io', avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80' },
    to: [{ name: 'Alex Rivers', email: 'alex.rivers@acmecorp.io' }],
    cc: [{ name: 'Marcus Chen', email: 'marcus.chen@acmecorp.io' }, { name: 'Product Team', email: 'product-team@acmecorp.io' }],
    subject: '🚀 Q4 Product Roadmap & AI Engine Architecture Review',
    snippet: 'Hey Alex, I attached the revised specs for the vector search and real-time streaming pipeline. Can you review before our 2 PM sync?',
    bodyText: 'Hey Alex,\n\nI attached the revised specs for the vector search and real-time streaming pipeline. We incorporated all the feedback from yesterday\'s architecture review.\n\nKey updates:\n1. Replaced the polling mechanism with WebSockets + Server-Sent Events.\n2. Added SQLite FTS5 fallback for offline client indexing.\n3. Latency benchmarks dropped from 140ms to 18ms under load testing.\n\nLet me know your thoughts before our 2 PM sync!\n\nElena',
    bodyHtml: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #2d3748;">
        <p>Hey Alex,</p>
        <p>I attached the revised technical specifications for the <strong>vector search and real-time streaming pipeline</strong>. We incorporated all the feedback from yesterday's architecture review.</p>
        <div style="background: #f7fafc; border-left: 4px solid #3182ce; padding: 12px 16px; margin: 16px 0; border-radius: 0 6px 6px 0;">
          <h4 style="margin: 0 0 8px 0; color: #2b6cb0;">Key Updates in v2.4:</h4>
          <ul style="margin: 0; padding-left: 20px;">
            <li>Replaced polling mechanism with <strong>WebSockets + Server-Sent Events</strong>.</li>
            <li>Added <strong>SQLite FTS5 + MiniSearch</strong> fallback for instantaneous offline client search indexing.</li>
            <li>Latency benchmarks dropped from <strong>140ms down to 18ms</strong> under 5k concurrent queries.</li>
          </ul>
        </div>
        <p>Please take a look at the attached benchmark diagram and architecture PDF before our <strong>2:00 PM</strong> review sync.</p>
        <br/>
        <p style="color: #718096; font-size: 14px;">Best,<br/><strong>Elena Rostova</strong><br/>Principal Systems Architect</p>
      </div>
    `,
    date: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    isRead: false,
    isStarred: true,
    hasAttachments: true,
    attachments: [
      { id: 'att_w1_1', filename: 'Q4_AI_Architecture_v2.pdf', size: 3450000, contentType: 'application/pdf' },
      { id: 'att_w1_2', filename: 'Latency_Benchmarks.png', size: 840000, contentType: 'image/png' }
    ],
    labels: ['Engineering', 'High Priority'],
    category: 'primary',
    priority: 'high',
  },
  {
    id: 'msg_w2',
    threadId: 'th_w2',
    accountId: 'acc_work',
    folderType: 'inbox',
    from: { name: 'Stripe Billing', email: 'notifications@stripe.com' },
    to: [{ name: 'Acme Corp Finance', email: 'finance@acmecorp.io' }, { name: 'Alex Rivers', email: 'alex.rivers@acmecorp.io' }],
    subject: 'Payout of $48,250.00 is on its way to your bank account',
    snippet: 'Your daily payout of $48,250.00 USD has been initiated and should arrive in your Silicon Valley Bank account ending in 4109 by tomorrow.',
    bodyText: 'Your daily payout of $48,250.00 USD has been initiated and should arrive in your Silicon Valley Bank account ending in 4109 by tomorrow.\n\nSummary:\nGross volume: $49,890.00\nFees: $1,640.00\nNet payout: $48,250.00\n\nView payout in dashboard.',
    bodyHtml: `
      <div style="font-family: -apple-system, sans-serif; color: #1a1f36; max-width: 600px; padding: 20px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h2 style="color: #635bff; margin: 0;">stripe</h2>
        </div>
        <div style="background: #f8f9fc; border-radius: 8px; padding: 24px; border: 1px solid #e3e8ee;">
          <h3 style="margin-top: 0; color: #0a2540;">Payout on the way</h3>
          <p style="font-size: 28px; font-weight: bold; color: #0a2540; margin: 12px 0;">$48,250.00 <span style="font-size: 16px; font-weight: normal; color: #4f566b;">USD</span></p>
          <p style="color: #4f566b; font-size: 14px;">Estimated arrival: <strong>Tomorrow, August 15</strong> to <strong>Silicon Valley Bank •••• 4109</strong>.</p>
          <hr style="border: none; border-top: 1px solid #e3e8ee; margin: 20px 0;" />
          <table style="width: 100%; font-size: 14px; color: #4f566b;">
            <tr><td>Gross Charges</td><td style="text-align: right; color: #0a2540; font-weight: 500;">$49,890.00</td></tr>
            <tr><td>Stripe Processing Fees</td><td style="text-align: right; color: #e22d60;">-$1,640.00</td></tr>
            <tr style="font-weight: bold; color: #0a2540;"><td>Total Payout Amount</td><td style="text-align: right; color: #00875a; font-size: 16px;">$48,250.00</td></tr>
          </table>
        </div>
      </div>
    `,
    date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    isRead: false,
    isStarred: false,
    hasAttachments: true,
    attachments: [
      { id: 'att_w2_1', filename: 'Payout_Summary_August_14.pdf', size: 125000, contentType: 'application/pdf' }
    ],
    labels: ['Finance', 'Receipts'],
    category: 'receipts',
  },
  {
    id: 'msg_w3',
    threadId: 'th_w3',
    accountId: 'acc_work',
    folderType: 'inbox',
    from: { name: 'Linear App', email: 'notifications@linear.app' },
    to: [{ name: 'Alex Rivers', email: 'alex.rivers@acmecorp.io' }],
    subject: '[ENG-892] Fixed memory leak in unified IMAP socket connection pool',
    snippet: 'David Kim closed issue ENG-892: Memory usage now stabilizes at 45MB under continuous streaming.',
    bodyText: 'David Kim closed issue ENG-892: Fixed memory leak in unified IMAP socket connection pool.\n\nBranch: fix/imap-pool-drain\nMerged into: main',
    bodyHtml: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #333; line-height: 1.5;">
        <div style="display: inline-block; background: #5e6ad2; color: #fff; border-radius: 4px; padding: 2px 8px; font-size: 12px; font-weight: 600; margin-bottom: 8px;">ENG-892</div>
        <h3 style="margin: 4px 0 12px 0;">Fixed memory leak in unified IMAP socket connection pool</h3>
        <p><strong>David Kim</strong> closed this issue via pull request <a href="#" style="color: #5e6ad2; text-decoration: none;">#402</a>.</p>
        <blockquote style="border-left: 3px solid #e2e8f0; margin: 12px 0; padding-left: 12px; color: #64748b;">
          "Cleaned up event listeners and added auto-drain on socket timeout. Memory profile tested over 48 hours without unbounded growth."
        </blockquote>
      </div>
    `,
    date: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    isRead: true,
    isStarred: false,
    hasAttachments: false,
    attachments: [],
    labels: ['Linear', 'Engineering'],
    category: 'updates',
  },
  {
    id: 'msg_w4',
    threadId: 'th_w4',
    accountId: 'acc_work',
    folderType: 'inbox',
    from: { name: 'Sarah Jenkins', email: 'sarah.jenkins@acmecorp.io', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80' },
    to: [{ name: 'Alex Rivers', email: 'alex.rivers@acmecorp.io' }],
    subject: 'Design Tokens & macOS Liquid Glass Visual Specs',
    snippet: 'Here is the Figma link for the new Mac desktop client design system with dark mode tokens and frosted glass sidebar.',
    bodyText: 'Hey Alex,\n\nWe finalized the desktop design tokens for MacMail. The glassmorphism and subtle border tokens match macOS Tahoe specifications.\n\nTake a look and let me know if the typography line-heights work for the message list!\n\nSarah',
    bodyHtml: `
      <div style="font-family: -apple-system, sans-serif; color: #2d3748; line-height: 1.6;">
        <p>Hey Alex,</p>
        <p>We just finalized the design specs for the macOS desktop client. Highlights include:</p>
        <ul>
          <li><strong>Frosted Glass Sidebar</strong> with system vibrancy blur</li>
          <li><strong>Inter & SF Pro Display</strong> typographic pairing</li>
          <li><strong>High contrast dark mode</strong> with neutral zinc elevation</li>
        </ul>
        <p>Figma file is ready for engineering handoff!</p>
      </div>
    `,
    date: new Date(Date.now() - 22 * 60 * 60 * 1000).toISOString(),
    isRead: false,
    isStarred: true,
    hasAttachments: false,
    attachments: [],
    labels: ['Design', 'UI/UX'],
    category: 'primary',
  },
  {
    id: 'msg_w5',
    threadId: 'th_w1',
    accountId: 'acc_work',
    folderType: 'sent',
    from: { name: 'Alex Rivers', email: 'alex.rivers@acmecorp.io' },
    to: [{ name: 'Elena Rostova', email: 'elena.rostova@acmecorp.io' }],
    subject: 'Re: 🚀 Q4 Product Roadmap & AI Engine Architecture Review',
    snippet: 'Thanks Elena! I took a look at the benchmark figures. 18ms query time is incredible. Let\'s review in the sync.',
    bodyText: 'Thanks Elena!\n\nI took a look at the benchmark figures. 18ms query time is incredible. Let\'s review in the sync.\n\nAlex',
    bodyHtml: `<p>Thanks Elena!</p><p>I took a look at the benchmark figures. 18ms query time is incredible. Let's review in the sync.</p>`,
    date: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    isRead: true,
    isStarred: false,
    hasAttachments: false,
    attachments: [],
    labels: ['Engineering'],
    category: 'primary',
  },

  // ================= PERSONAL ACCOUNT (iCloud) =================
  {
    id: 'msg_p1',
    threadId: 'th_p1',
    accountId: 'acc_personal',
    folderType: 'inbox',
    from: { name: 'Apple Store', email: 'order-update@orders.apple.com' },
    to: [{ name: 'Alex Rivers', email: 'alex.rivers@icloud.com' }],
    subject: 'Your Apple order #W109283746 has shipped!',
    snippet: 'Your order consisting of MacBook Pro 16" (M4 Max, 64GB RAM, 2TB SSD - Space Black) is on its way with FedEx Express.',
    bodyText: 'Your order consisting of MacBook Pro 16" (M4 Max, 64GB RAM, 2TB SSD - Space Black) is on its way with FedEx Express.\nTracking number: 789234812349\nEstimated delivery: Tomorrow by 10:30 AM.',
    bodyHtml: `
      <div style="font-family: -apple-system, Helvetica, Arial, sans-serif; max-width: 600px; color: #333;">
        <div style="text-align: center; padding: 20px 0;">
          <svg width="36" height="44" viewBox="0 0 170 170" fill="#000"><path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.6-7.85-11.75-14.43-6.2-9.84-11.05-21.2-14.54-34.07-3.48-12.87-5.23-24.87-5.23-35.98 0-15.65 4.13-28.7 12.39-39.16 8.27-10.45 18.66-15.79 31.18-16.02 4.13 0 9.07 1.13 14.81 3.39 5.74 2.26 9.42 3.44 11.05 3.54 1.3 0 5.1-1.22 11.41-3.66 6.3-2.44 11.41-3.55 15.34-3.34 11.42.76 20.89 5.06 28.43 12.89-9.88 5.99-14.71 14.3-14.5 24.93.22 8.37 3.42 15.44 9.61 21.21 6.18 5.76 13.56 9.06 22.13 9.9-2.07 6.1-4.68 12.52-7.83 19.26zM119.22 33.64c0-7.39 2.66-14.16 7.97-20.31 5.31-6.15 11.96-9.98 19.96-11.49.21 1.09.32 2.18.32 3.27 0 7.4-2.77 14.28-8.31 20.65-5.54 6.37-12.28 10.15-20.22 11.34-.43-1.09-.64-2.25-.72-3.46z"/></svg>
        </div>
        <div style="background: #f5f5f7; border-radius: 12px; padding: 24px;">
          <h2 style="margin: 0 0 8px 0; font-size: 22px;">We've shipped your order.</h2>
          <p style="color: #666; font-size: 14px; margin-top: 0;">Order #W109283746</p>
          <div style="background: #fff; border-radius: 8px; padding: 16px; margin: 16px 0;">
            <p style="margin: 0; font-weight: 600; font-size: 16px;">16-inch MacBook Pro - Space Black</p>
            <p style="margin: 4px 0 0 0; color: #666; font-size: 14px;">Apple M4 Max with 16-core CPU, 40-core GPU, 64GB Unified Memory, 2TB SSD</p>
            <p style="margin: 12px 0 0 0; font-weight: bold; color: #0071e3;">Delivering Tomorrow by 10:30 AM via FedEx Express</p>
          </div>
        </div>
      </div>
    `,
    date: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    isRead: false,
    isStarred: true,
    hasAttachments: true,
    attachments: [
      { id: 'att_p1_1', filename: 'Apple_Store_Invoice_W109283.pdf', size: 218000, contentType: 'application/pdf' }
    ],
    labels: ['Apple', 'Receipts'],
    category: 'receipts',
  },
  {
    id: 'msg_p2',
    threadId: 'th_p2',
    accountId: 'acc_personal',
    folderType: 'inbox',
    from: { name: 'Delta Air Lines', email: 'ticketreceipt@delta.com' },
    to: [{ name: 'Alex Rivers', email: 'alex.rivers@icloud.com' }],
    subject: 'Flight Confirmation: San Francisco (SFO) to Zurich (ZRH) - Confirmation #K89J2P',
    snippet: 'Your upcoming flight to Zurich is confirmed for September 12. Seat 4A (Delta One Suites).',
    bodyText: 'Confirmation: K89J2P\nPassenger: Alex Rivers\nFlight: DL 138 (SFO -> ZRH)\nDeparture: Sept 12, 4:45 PM\nSeat: 4A (Delta One)',
    bodyHtml: `
      <div style="font-family: -apple-system, sans-serif; color: #111; max-width: 600px;">
        <div style="background: #002244; color: white; padding: 16px 20px; border-radius: 8px 8px 0 0;">
          <h3 style="margin: 0;">DELTA AIR LINES</h3>
        </div>
        <div style="border: 1px solid #ddd; border-top: none; padding: 20px; border-radius: 0 0 8px 8px;">
          <p style="font-size: 18px; font-weight: bold; margin: 0 0 12px 0;">Flight Confirmation #K89J2P</p>
          <div style="display: flex; justify-content: space-between; background: #f9f9f9; padding: 12px; border-radius: 6px;">
            <div>
              <strong>SFO (San Francisco)</strong><br/>
              <span style="color: #666; font-size: 13px;">Sept 12 • 4:45 PM</span>
            </div>
            <div style="text-align: center; color: #002244; font-weight: bold;">✈ Nonstop</div>
            <div style="text-align: right;">
              <strong>ZRH (Zurich)</strong><br/>
              <span style="color: #666; font-size: 13px;">Sept 13 • 12:30 PM</span>
            </div>
          </div>
          <p style="margin-top: 14px; font-size: 14px;"><strong>Seat:</strong> 4A (Delta One Suite) | <strong>SkyMiles:</strong> 982347102</p>
        </div>
      </div>
    `,
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    isRead: true,
    isStarred: true,
    hasAttachments: true,
    attachments: [
      { id: 'att_p2_1', filename: 'Delta_E-Ticket_K89J2P.pdf', size: 450000, contentType: 'application/pdf' },
      { id: 'att_p2_2', filename: 'BoardingPass_Passbook.pkpass', size: 85000, contentType: 'application/vnd.apple.pkpass' }
    ],
    labels: ['Travel', 'Flights'],
    category: 'updates',
  },
  {
    id: 'msg_p3',
    threadId: 'th_p3',
    accountId: 'acc_personal',
    folderType: 'inbox',
    from: { name: 'Sophie Laurent', email: 'sophie.laurent@gmail.com', avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80' },
    to: [{ name: 'Alex Rivers', email: 'alex.rivers@icloud.com' }],
    subject: 'Tahoe Cabin Photos & Trail Map 🌲🏔️',
    snippet: 'Hey Alex! Look at the view from the deck this morning. I sent over the trail map for Mount Tallac for Saturday.',
    bodyText: 'Hey Alex,\n\nLook at the view from the deck this morning! The lake is totally clear. I attached the trail map for Mount Tallac for our hike on Saturday.\n\nDon\'t forget to pack plenty of water and your hiking boots!\n\nSophie',
    bodyHtml: `
      <div style="font-family: -apple-system, sans-serif; color: #2d3748; line-height: 1.6;">
        <p>Hey Alex!</p>
        <p>Look at the view from the deck this morning! The lake is completely crystal clear 🏔️🌲</p>
        <p>I attached the high-res trail map for <strong>Mount Tallac</strong> for Saturday's hike. Elevation gain is about 3,200 ft so let's start early around 7:30 AM.</p>
        <p>See you Friday afternoon!</p>
        <p style="color: #718096;">Sophie</p>
      </div>
    `,
    date: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    isRead: false,
    isStarred: false,
    hasAttachments: true,
    attachments: [
      { id: 'att_p3_1', filename: 'Tahoe_Morning_View.jpg', size: 4200000, contentType: 'image/jpeg' },
      { id: 'att_p3_2', filename: 'Mount_Tallac_Trail_Map.pdf', size: 1800000, contentType: 'application/pdf' }
    ],
    labels: ['Personal', 'Photos'],
    category: 'primary',
  },

  // ================= CONSULTING ACCOUNT (Outlook) =================
  {
    id: 'msg_c1',
    threadId: 'th_c1',
    accountId: 'acc_consulting',
    folderType: 'inbox',
    from: { name: 'Jonathan Sterling', email: 'j.sterling@vertexcapital.vc', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80' },
    to: [{ name: 'Alex Rivers', email: 'alex@rivers-advisory.com' }],
    cc: [{ name: 'Legal Team', email: 'legal@vertexcapital.vc' }],
    subject: 'Executed Advisory Agreement & Technical Due Diligence Memo',
    snippet: 'Alex, pleased to share the fully executed advisory contract for the AI Infrastructure Fund. We have also wired the initial retainer.',
    bodyText: 'Alex,\n\nPleased to share the fully executed advisory contract for the AI Infrastructure Fund. We have also wired the initial retainer to your account.\n\nLooking forward to your technical analysis on the distributed database portfolio company.\n\nBest,\nJonathan Sterling\nManaging Director | Vertex Capital',
    bodyHtml: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1e293b; line-height: 1.6;">
        <p>Dear Alex,</p>
        <p>Pleased to share the fully executed <strong>Advisory & Technical Due Diligence Agreement</strong> for Vertex Capital's AI Infrastructure Fund.</p>
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 16px 0;">
          <h4 style="margin: 0 0 8px 0; color: #334155;">Engagement Highlights:</h4>
          <ul style="margin: 0; padding-left: 20px; color: #475569;">
            <li>Term: 12-Month Senior Technical Advisory</li>
            <li>Focus: Distributed Systems, Multi-Agent Swarms, and Vector Database Pipelines</li>
            <li>Initial Retainer: Wire transfer confirmed ($25,000.00 USD)</li>
          </ul>
        </div>
        <p>Please find the countersigned PDF document attached. Let's schedule our kick-off call for next Tuesday.</p>
        <br/>
        <p style="color: #64748b; font-size: 14px;">Sincerely,<br/><strong>Jonathan Sterling</strong><br/>Managing Director, Vertex Capital</p>
      </div>
    `,
    date: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    isRead: false,
    isStarred: true,
    hasAttachments: true,
    attachments: [
      { id: 'att_c1_1', filename: 'Vertex_Advisory_Agreement_Executed.pdf', size: 1450000, contentType: 'application/pdf' },
      { id: 'att_c1_2', filename: 'Wire_Transfer_Receipt_25k.pdf', size: 190000, contentType: 'application/pdf' }
    ],
    labels: ['Contracts', 'Retainer'],
    category: 'primary',
    priority: 'high',
  },
  {
    id: 'msg_c2',
    threadId: 'th_c2',
    accountId: 'acc_consulting',
    folderType: 'inbox',
    from: { name: 'Kavita Patel', email: 'kavita@nexuscloud.tech', avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80' },
    to: [{ name: 'Alex Rivers', email: 'alex@rivers-advisory.com' }],
    subject: 'Architecture Deck for Series A Technical Deep Dive',
    snippet: 'Hi Alex, here is the updated system architecture slide deck incorporating your suggestions on sharding and caching.',
    bodyText: 'Hi Alex,\n\nHere is the updated system architecture slide deck incorporating your suggestions on sharding and multi-region replication.\n\nLet me know if we are ready for the investor technical audit.\n\nKavita',
    bodyHtml: `
      <div style="font-family: -apple-system, sans-serif; color: #333; line-height: 1.5;">
        <p>Hi Alex,</p>
        <p>Attached is the updated presentation for the upcoming technical deep dive. We added the multi-region failover benchmarks you recommended.</p>
        <p>Thanks again for your guidance!</p>
      </div>
    `,
    date: new Date(Date.now() - 28 * 60 * 60 * 1000).toISOString(),
    isRead: true,
    isStarred: false,
    hasAttachments: true,
    attachments: [
      { id: 'att_c2_1', filename: 'NexusCloud_SeriesA_Tech_Deck.pdf', size: 8900000, contentType: 'application/pdf' }
    ],
    labels: ['Advisory', 'Clients'],
    category: 'primary',
  },
  {
    id: 'msg_c3',
    threadId: 'th_c3',
    accountId: 'acc_consulting',
    folderType: 'archive',
    from: { name: 'AWS Activate', email: 'activate-support@amazon.com' },
    to: [{ name: 'Alex Rivers', email: 'alex@rivers-advisory.com' }],
    subject: 'Approved: $100,000 in AWS Cloud Credits for Rivers Advisory Portfolio',
    snippet: 'Congratulations! Your portfolio companies are now eligible for up to $100,000 in AWS Promotional Credits.',
    bodyText: 'Congratulations! Your portfolio companies are now eligible for up to $100,000 in AWS Promotional Credits under the AWS Activate Provider Program.',
    bodyHtml: `<p>Congratulations! Your application has been approved.</p>`,
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    isRead: true,
    isStarred: false,
    hasAttachments: false,
    attachments: [],
    labels: ['AWS', 'Credits'],
    category: 'updates',
  }
];

export function buildThreadsFromMessages(messages: EmailMessage[], accounts: Account[]): EmailThread[] {
  const threadMap = new Map<string, EmailMessage[]>();
  const accountMap = new Map<string, Account>();
  accounts.forEach(acc => accountMap.set(acc.id, acc));

  messages.forEach(msg => {
    const list = threadMap.get(msg.threadId) || [];
    list.push(msg);
    threadMap.set(msg.threadId, list);
  });

  const threads: EmailThread[] = [];

  threadMap.forEach((msgs, threadId) => {
    // Sort chronological
    msgs.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const lastMsg = msgs[msgs.length - 1];
    const acc = accountMap.get(lastMsg.accountId) || accounts[0];

    const participants: { name: string; email: string; avatarUrl?: string }[] = [];
    const seenEmails = new Set<string>();

    msgs.forEach(m => {
      if (!seenEmails.has(m.from.email)) {
        seenEmails.add(m.from.email);
        participants.push(m.from);
      }
    });

    const isRead = msgs.every(m => m.isRead);
    const isStarred = msgs.some(m => m.isStarred);
    const hasAttachments = msgs.some(m => m.hasAttachments);
    const allLabels = Array.from(new Set(msgs.flatMap(m => m.labels)));

    threads.push({
      id: threadId,
      accountId: lastMsg.accountId,
      accountName: acc.name,
      accountColor: acc.color,
      subject: lastMsg.subject.replace(/^Re:\s*/i, ''),
      lastMessageDate: lastMsg.date,
      messageCount: msgs.length,
      messages: msgs,
      participants,
      isRead,
      isStarred,
      hasAttachments,
      labels: allLabels,
      snippet: lastMsg.snippet,
      folderType: lastMsg.folderType,
      category: lastMsg.category,
    });
  });

  // Sort threads newest first
  return threads.sort((a, b) => new Date(b.lastMessageDate).getTime() - new Date(a.lastMessageDate).getTime());
}

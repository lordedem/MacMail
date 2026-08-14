import React, { useRef, useEffect } from 'react';
import DOMPurify from 'dompurify';
import { apiBridge } from '../../services/apiBridge';

interface IframeHtmlBodyProps {
  htmlContent: string;
  allowExternalImages?: boolean;
}

export const IframeHtmlBody: React.FC<IframeHtmlBodyProps> = ({
  htmlContent,
  allowExternalImages = true,
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    let sanitizedHtml = DOMPurify.sanitize(htmlContent, {
      WHOLE_DOCUMENT: false,
      ADD_ATTR: ['target', 'style', 'class'],
    });

    if (!allowExternalImages) {
      // Strip or replace external img src with placeholder
      sanitizedHtml = sanitizedHtml.replace(/<img\s+[^>]*src="http[^"]*"[^>]*>/gi, '<div style="background:#eee;padding:8px;border-radius:4px;display:inline-block;font-size:11px;color:#888;">[Remote Image Blocked]</div>');
    }

    const isDark = document.documentElement.classList.contains('dark');

    const documentContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
              font-size: 14px;
              line-height: 1.6;
              color: ${isDark ? '#e2e8f0' : '#1e293b'};
              background: transparent;
              margin: 0;
              padding: 0;
              word-wrap: break-word;
              overflow-x: hidden;
            }
            a {
              color: #3b82f6;
              text-decoration: underline;
            }
            p { margin: 0 0 1em 0; }
            img { max-width: 100%; height: auto; border-radius: 6px; }
            table { max-width: 100%; border-collapse: collapse; }
            blockquote {
              border-left: 3px solid ${isDark ? '#334155' : '#cbd5e1'};
              margin: 1em 0;
              padding-left: 12px;
              color: ${isDark ? '#94a3b8' : '#64748b'};
            }
            pre, code {
              font-family: "JetBrains Mono", monospace;
              font-size: 13px;
              background: ${isDark ? '#1e293b' : '#f1f5f9'};
              padding: 2px 5px;
              border-radius: 4px;
            }
          </style>
        </head>
        <body>
          <div id="email-content-wrapper">${sanitizedHtml}</div>
          <script>
            // Intercept link clicks to open safely outside iframe
            document.addEventListener('click', (e) => {
              const target = e.target.closest('a');
              if (target && target.href) {
                e.preventDefault();
                window.parent.postMessage({ type: 'OPEN_URL', url: target.href }, '*');
              }
            });

            // Adjust height
            function updateHeight() {
              const height = document.documentElement.scrollHeight || document.body.scrollHeight;
              window.parent.postMessage({ type: 'RESIZE_IFRAME', height }, '*');
            }
            window.addEventListener('load', updateHeight);
            setTimeout(updateHeight, 100);
            setTimeout(updateHeight, 500);
          </script>
        </body>
      </html>
    `;

    const doc = iframe.contentWindow?.document;
    if (doc) {
      doc.open();
      doc.write(documentContent);
      doc.close();
    }
  }, [htmlContent, allowExternalImages]);

  // Handle messages from iframe
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data?.type === 'RESIZE_IFRAME' && iframeRef.current) {
        iframeRef.current.style.height = `${e.data.height + 20}px`;
      }
      if (e.data?.type === 'OPEN_URL' && e.data.url) {
        apiBridge.openExternalUrl(e.data.url);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <iframe
      ref={iframeRef}
      sandbox="allow-same-origin allow-scripts"
      className="w-full border-0 transition-all"
      style={{ minHeight: '80px', height: '140px' }}
      title="Email content"
    />
  );
};

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
      sanitizedHtml = sanitizedHtml.replace(
        /<img\s+[^>]*src="http[^"]*"[^>]*>/gi,
        '<div style="background:#eee;padding:8px;border-radius:4px;display:inline-block;font-size:11px;color:#888;">[Remote Image Blocked]</div>'
      );
    }

    const isDark = document.documentElement.classList.contains('dark');

    const darkStyles = `
      body {
        color: #e3e3e3 !important;
        background: transparent !important;
      }
      body p, body div, body span, body h1, body h2, body h3, body h4, body h5, body h6, body li, body td, body th, body strong, body b, body em {
        color: #e3e3e3 !important;
      }
      body a {
        color: #a8c7fa !important;
        text-decoration: underline;
      }
      div[style*="background"], table[style*="background"], td[style*="background"], section[style*="background"] {
        background-color: #28292a !important;
        border-color: #444746 !important;
      }
      div[style*="border"], table[style*="border"], td[style*="border"] {
        border-color: #444746 !important;
      }
      svg path, svg {
        fill: #e3e3e3 !important;
      }
      blockquote {
        border-left: 3px solid #004a77 !important;
        color: #c4c7c5 !important;
      }
      pre, code {
        background: #282a2c !important;
        color: #c2e7ff !important;
      }
    `;

    const lightStyles = `
      body {
        color: #1f1f1f;
        background: transparent;
      }
      a {
        color: #0b57d0;
        text-decoration: underline;
      }
      blockquote {
        border-left: 3px solid #d3e3fd;
        color: #444746;
      }
      pre, code {
        background: #f1f5f9;
        color: #041e49;
      }
    `;

    const documentContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Google Sans", Helvetica, Arial, sans-serif;
              font-size: 14px;
              line-height: 1.6;
              margin: 0;
              padding: 0;
              word-wrap: break-word;
              overflow-x: hidden;
            }
            p { margin: 0 0 1em 0; }
            img { max-width: 100%; height: auto; border-radius: 6px; }
            table { max-width: 100%; border-collapse: collapse; }
            pre, code {
              font-family: "JetBrains Mono", monospace;
              font-size: 13px;
              padding: 2px 5px;
              border-radius: 4px;
            }
            ${isDark ? darkStyles : lightStyles}
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

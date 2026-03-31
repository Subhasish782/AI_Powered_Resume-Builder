"use client";

// global-error.tsx catches errors in the ROOT layout.
// It MUST include <html> and <body> tags.
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <head>
        <title>Something went wrong — ResumeAI</title>
        <style>{`
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body {
            font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 24px;
            color: #f1f5f9;
          }
          .card {
            background: rgba(255,255,255,0.05);
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 20px;
            padding: 48px 40px;
            max-width: 460px;
            width: 100%;
            text-align: center;
            backdrop-filter: blur(12px);
          }
          .icon-ring {
            width: 80px; height: 80px;
            border-radius: 50%;
            background: rgba(239, 68, 68, 0.15);
            border: 2px solid rgba(239, 68, 68, 0.3);
            display: flex; align-items: center; justify-content: center;
            margin: 0 auto 24px;
          }
          h1 { font-size: 24px; font-weight: 700; margin-bottom: 10px; }
          .subtitle { color: #94a3b8; font-size: 14px; line-height: 1.7; margin-bottom: 20px; }
          .error-box {
            background: rgba(0,0,0,0.3);
            border: 1px solid rgba(255,255,255,0.08);
            border-radius: 8px;
            padding: 10px 14px;
            font-family: 'Courier New', monospace;
            font-size: 12px;
            color: #f87171;
            margin-bottom: 28px;
            text-align: left;
            word-break: break-all;
          }
          .btn-row { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
          .btn-primary {
            display: inline-flex; align-items: center; gap-8px;
            background: #2563eb; color: white;
            border: none; border-radius: 10px;
            padding: 10px 22px; font-size: 14px; font-weight: 600;
            cursor: pointer; transition: background 0.2s;
            text-decoration: none; gap: 8px;
          }
          .btn-primary:hover { background: #1d4ed8; }
          .btn-outline {
            display: inline-flex; align-items: center; gap: 8px;
            background: transparent; color: #94a3b8;
            border: 1px solid rgba(255,255,255,0.15); border-radius: 10px;
            padding: 10px 22px; font-size: 14px; font-weight: 500;
            cursor: pointer; transition: all 0.2s;
            text-decoration: none;
          }
          .btn-outline:hover { background: rgba(255,255,255,0.07); color: #f1f5f9; }
          .logo { display: flex; align-items: center; gap: 10px; justify-content: center; margin-bottom: 32px; }
          .logo-icon {
            width: 36px; height: 36px; border-radius: 10px;
            background: linear-gradient(135deg, #1e40af, #2563eb);
            display: flex; align-items: center; justify-content: center;
          }
          .logo-text { font-size: 18px; font-weight: 700; }
        `}</style>
      </head>
      <body>
        <div className="card" style={{
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "20px",
          padding: "48px 40px",
          maxWidth: "460px",
          width: "100%",
          textAlign: "center",
          backdropFilter: "blur(12px)",
        }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", justifyContent: "center", marginBottom: "32px" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "linear-gradient(135deg, #1e40af, #2563eb)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="20" height="20" viewBox="0 0 40 40" fill="none">
                <rect x="8" y="8" width="14" height="2.5" rx="1.25" fill="white"/>
                <rect x="8" y="14" width="20" height="2.5" rx="1.25" fill="white" opacity="0.8"/>
                <rect x="8" y="20" width="16" height="2.5" rx="1.25" fill="white" opacity="0.6"/>
                <circle cx="30" cy="30" r="7" fill="#10b981"/>
                <path d="M27 30l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span style={{ fontSize: "18px", fontWeight: 700 }}>ResumeAI</span>
          </div>

          {/* Error Icon */}
          <div style={{ width: "72px", height: "72px", borderRadius: "50%", background: "rgba(239, 68, 68, 0.15)", border: "2px solid rgba(239, 68, 68, 0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>

          <h1 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "10px" }}>Something went wrong</h1>
          <p style={{ color: "#94a3b8", fontSize: "14px", lineHeight: 1.7, marginBottom: "20px" }}>
            An unexpected error occurred. Your resume data is safe — try refreshing the page.
          </p>

          {error?.message && (
            <div style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", padding: "10px 14px", fontFamily: "monospace", fontSize: "12px", color: "#f87171", marginBottom: "28px", textAlign: "left", wordBreak: "break-all" }}>
              {error.message}
            </div>
          )}

          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <button
              onClick={reset}
              style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "#2563eb", color: "white", border: "none", borderRadius: "10px", padding: "10px 22px", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
              </svg>
              Try Again
            </button>
            <a
              href="/dashboard"
              style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "transparent", color: "#94a3b8", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "10px", padding: "10px 22px", fontSize: "14px", fontWeight: 500, textDecoration: "none" }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
              Go to Dashboard
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}

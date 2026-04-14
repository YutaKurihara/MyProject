"use client";

import { useEffect, useState } from "react";

export default function CodeBlock({ src, label }: { src: string; label: string }) {
  const [code, setCode] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    fetch(src)
      .then((r) => r.text())
      .then((t) => {
        setCode(t);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [src]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const ta = document.createElement("textarea");
      ta.value = code;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="my-4 overflow-hidden rounded-lg border border-border bg-[#1e293b]">
      <div className="flex items-center justify-between border-b border-[#334155] bg-[#0f172a] px-4 py-2">
        <span className="font-mono text-xs text-[#94a3b8]">{label}</span>
        <div className="flex gap-2">
          <button
            onClick={() => setExpanded(!expanded)}
            className="rounded bg-[#334155] px-3 py-1 text-xs font-medium text-white hover:bg-[#475569]"
          >
            {expanded ? "折りたたむ" : "展開"}
          </button>
          <a
            href={src}
            download
            className="rounded bg-[#334155] px-3 py-1 text-xs font-medium text-white hover:bg-[#475569]"
          >
            ダウンロード
          </a>
          <button
            onClick={copy}
            disabled={loading || !code}
            className={`rounded px-3 py-1 text-xs font-medium text-white transition-colors ${
              copied ? "bg-green-600" : "bg-accent hover:opacity-90"
            }`}
          >
            {copied ? "✓ コピー済" : "コピー"}
          </button>
        </div>
      </div>
      <div
        className={`overflow-auto ${
          expanded ? "max-h-[600px]" : "max-h-[280px]"
        }`}
      >
        <pre className="p-4 text-[11px] leading-relaxed text-[#e2e8f0]">
          <code>{loading ? "読み込み中..." : code}</code>
        </pre>
      </div>
    </div>
  );
}

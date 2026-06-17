import Link from "next/link";

const tools = [
  {
    id: "sar-dat",
    title: "災害被害範囲可視化ツール",
    subtitle: "SAR-DAT",
    period: "第9期（2022年）",
    description:
      "Google Earth Engine上でSAR衛星画像を用いて、過去の洪水・土砂崩れ・建物被害を可視化するツール。UIパネルから操作でき、コード不要。",
    status: "available" as const,
    href: "/sar-dat",
  },
  {
    id: "flood-damage-tool",
    title: "洪水直接被害計算ツール",
    subtitle: "Flood Direct Damage Estimation",
    period: "第10期（2023年）",
    description:
      "SAR-DATを発展させ、浸水深の推定（FwDET）と建物・農作物の直接被害額算定を追加。フィリピンを対象に、現地調査なしで被害額を推定する。2つのスクリプトで構成: (1) 土地利用図作成（Random Forest）、(2) 洪水被害額計算（FwDET + 被害曲線）。",
    status: "available" as const,
    href: "/flood-damage",
  },
  {
    id: "gcm-tool",
    title: "GCM ダウンスケーリングツール",
    subtitle: "Climate Change Impact Assessment",
    period: "第11期（2024年）",
    description:
      "NASA NEX-GDDP-CMIP6のGCMデータをGSMaPまたは地上観測データで補正する順序統計量補正手法。CMIP6の全球気候モデル精度評価からダウンロード、バイアス補正までをPythonノートブックで提供。",
    status: "available" as const,
    href: "/gcm-downscaling",
  },
  {
    id: "dsge-model",
    title: "経済被害評価DSGEモデル",
    subtitle: "Macroeconomic Disaster Impact",
    period: "第13期（2025年）",
    description:
      "IMFのDIGNADモデルをベースに、洪水被害がGDP・税収・家計に与える長期的な経済影響をシミュレーションする。",
    status: "available" as const,
    href: "/dsge",
  },
];

function ToolCard({ tool }: { tool: (typeof tools)[number] }) {
  const cardClass = `block rounded-xl border bg-card-bg p-6 transition-shadow ${
    tool.status === "available"
      ? "border-accent/30 hover:shadow-lg cursor-pointer"
      : "border-border opacity-70 cursor-not-allowed"
  }`;

  const content = (
    <>
      <div className="mb-1 flex items-center gap-2">
        <h2 className="text-base font-bold">{tool.title}</h2>
        <span
          className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
            tool.status === "available"
              ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
              : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
          }`}
        >
          {tool.status === "available" ? "Available" : "Coming Soon"}
        </span>
      </div>
      <p className="mb-1 text-xs font-medium text-accent">{tool.subtitle}</p>
      <p className="mb-3 text-[11px] text-muted">{tool.period}</p>
      <p className="text-sm leading-relaxed text-muted">{tool.description}</p>
      {tool.status === "available" && (
        <p className="mt-4 text-xs font-medium text-accent">
          Manualを見る &rarr;
        </p>
      )}
    </>
  );

  if (tool.href) {
    return (
      <Link href={tool.href} className={cardClass}>
        {content}
      </Link>
    );
  }
  return <div className={cardClass}>{content}</div>;
}

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-hero-from to-hero-to py-20 text-white">
        <div className="mx-auto max-w-5xl px-6">
          <h1 className="mb-3 text-3xl font-bold md:text-4xl">MyProject</h1>
          <p className="max-w-2xl text-sm leading-relaxed text-accent-light">
            プランニング事業部のマイプロジェクトにて作成された、途上国の防災・減災を支援するオープンツール集。
            衛星画像による被害可視化から気候変動影響評価、マクロ経済モデルまで、
            様々な災害リスクの全体像を捉えるツールを開発しました。
          </p>
        </div>
      </section>

      {/* Tools */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="grid gap-6 md:grid-cols-2">
          {tools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </section>
    </div>
  );
}

import Link from "next/link";

const tools = [
  {
    id: "sar-dat",
    num: "01",
    title: "災害被害範囲可視化ツール",
    subtitle: "SAR-DAT",
    period: "第9期（2022年）",
    description:
      "Google Earth Engine上でSAR衛星画像を用いて、過去の洪水・土砂崩れ・建物被害を可視化するツール。UIパネルから操作でき、コード不要。",
    icon: "🛰️",
    status: "available" as const,
    toolLink:
      "https://code.earthengine.google.com/?accept_repo=users/kurihara-yt/MyProject1",
    docLink: "/sar-dat",
  },
  {
    id: "flood-damage-tool",
    num: "02",
    title: "洪水直接被害計算ツール",
    subtitle: "Flood Direct Damage Estimation",
    period: "第10期（2023年）",
    description:
      "SAR-DATを発展させ、浸水深の推定（FwDET）と建物・農作物の直接被害額算定を追加。フィリピンを対象に、現地調査なしで被害額を推定する。",
    icon: "🌊",
    status: "coming" as const,
    toolLink: null,
    docLink: null,
  },
  {
    id: "gcm-tool",
    num: "03",
    title: "GCM ダウンスケーリングツール",
    subtitle: "Climate Change Impact Assessment",
    period: "第11期（2024年）",
    description:
      "GCMデータのダウンスケーリングと将来の土地利用変化予測を組み合わせ、気候変動下の将来洪水被害を評価するツール。",
    icon: "🌍",
    status: "coming" as const,
    toolLink: null,
    docLink: null,
  },
  {
    id: "dsge-model",
    num: "04",
    title: "経済被害評価DSGEモデル",
    subtitle: "Macroeconomic Disaster Impact",
    period: "第13期（2025年）",
    description:
      "IMFのDIGNADモデルをベースに、洪水被害がGDP・税収・家計に与える長期的な経済影響をシミュレーションする。",
    icon: "📊",
    status: "coming" as const,
    toolLink: null,
    docLink: null,
  },
];

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-hero-from to-hero-to py-20 text-white">
        <div className="mx-auto max-w-5xl px-6">
          <p className="mb-2 text-xs font-medium uppercase tracking-widest text-teal-200">
            Oriental Consultants Global — Water Resources &amp; Disaster Prevention
          </p>
          <h1 className="mb-3 text-3xl font-bold md:text-4xl">MyProject</h1>
          <p className="max-w-2xl text-sm leading-relaxed text-teal-100">
            途上国の防災・減災を支援するオープンツール集。
            衛星画像による被害可視化から気候変動影響評価、マクロ経済モデルまで、
            災害リスクの全体像を捉えるツールを開発しています。
          </p>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="grid gap-6 md:grid-cols-2">
          {tools.map((tool) => (
            <div
              key={tool.id}
              className={`group relative overflow-hidden rounded-xl border bg-card-bg p-6 transition-shadow hover:shadow-lg ${
                tool.status === "available"
                  ? "border-accent/30"
                  : "border-border"
              }`}
            >
              {/* Number badge */}
              <span className="absolute right-4 top-4 text-4xl font-black text-border/50">
                {tool.num}
              </span>

              <span className="text-2xl">{tool.icon}</span>

              <div className="mt-3 mb-1 flex items-center gap-2">
                <h2 className="text-base font-bold">{tool.title}</h2>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                    tool.status === "available"
                      ? "bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300"
                      : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                  }`}
                >
                  {tool.status === "available" ? "Available" : "Coming Soon"}
                </span>
              </div>

              <p className="mb-1 text-xs font-medium text-accent">
                {tool.subtitle}
              </p>
              <p className="mb-3 text-[11px] text-muted">{tool.period}</p>
              <p className="text-sm leading-relaxed text-muted">
                {tool.description}
              </p>

              {(tool.toolLink || tool.docLink) && (
                <div className="mt-4 flex gap-3">
                  {tool.toolLink && (
                    <a
                      href={tool.toolLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg bg-accent px-4 py-2 text-xs font-medium text-white transition-opacity hover:opacity-90"
                    >
                      Open Tool &rarr;
                    </a>
                  )}
                  {tool.docLink && (
                    <Link
                      href={tool.docLink}
                      className="rounded-lg border border-accent px-4 py-2 text-xs font-medium text-accent transition-colors hover:bg-accent-light"
                    >
                      Manual
                    </Link>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Flow */}
      <section className="border-t border-border bg-card-bg py-16">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="mb-8 text-center text-lg font-bold">
            ツール間の連携
          </h2>
          <div className="flex flex-col items-center gap-2 text-sm sm:flex-row sm:justify-center sm:gap-0">
            {[
              { label: "災害被害範囲\n可視化", color: "bg-teal-600" },
              { label: "洪水直接被害\n計算", color: "bg-teal-600" },
              { label: "GCM\nダウンスケーリング", color: "bg-teal-600" },
              { label: "経済被害評価\nDSGEモデル", color: "bg-teal-600" },
            ].map((step, i) => (
              <div key={i} className="flex items-center gap-2">
                <div
                  className={`flex h-20 w-36 items-center justify-center rounded-lg ${step.color} p-2 text-center text-xs font-medium leading-tight text-white whitespace-pre-line`}
                >
                  {step.label}
                </div>
                {i < 3 && (
                  <span className="hidden text-lg text-muted sm:block">
                    &rarr;
                  </span>
                )}
              </div>
            ))}
          </div>
          <p className="mt-6 text-center text-xs text-muted">
            第9期〜第13期にかけて段階的に開発。各ツールの出力が次のツールのインプットとなる統合的なフレームワーク。
          </p>
        </div>
      </section>
    </div>
  );
}

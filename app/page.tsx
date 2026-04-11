import Link from "next/link";

const tools = [
  {
    id: "sar-dat",
    title: "SAR-DAT",
    period: "第9期（2022年）",
    description:
      "Google Earth Engine上でSAR衛星画像を用いて、過去の洪水・土砂崩れ・建物被害を可視化するツール。UIパネルから操作でき、コード不要。",
    status: "available" as const,
    toolLink: "https://code.earthengine.google.com/?accept_repo=users/kurihara-yt/MyProject1",
    docLink: "/sar-dat",
  },
  {
    id: "flood-damage-tool",
    title: "洪水直接被害計算ツール",
    period: "第10期（2023年）",
    description:
      "SAR-DATを発展させ、浸水深の推定（FwDET）と建物・農作物の直接被害額算定を追加。フィリピンを対象に、現地調査なしで被害額を推定する。",
    status: "coming" as const,
    toolLink: null,
    docLink: null,
  },
  {
    id: "gcm-tool",
    title: "GCM Downscaling Tool",
    period: "第11期（2024年）",
    description:
      "GCMデータのダウンスケーリングと将来の土地利用変化予測を組み合わせ、気候変動下の将来洪水被害を評価するツール。",
    status: "coming" as const,
    toolLink: null,
    docLink: null,
  },
  {
    id: "dsge-model",
    title: "DSGE Economic Impact Model",
    period: "第13期（2025年）",
    description:
      "IMFのDIGNADモデルをベースに、洪水被害がGDP・税収・家計に与える長期的な経済影響をシミュレーションする。",
    status: "coming" as const,
    toolLink: null,
    docLink: null,
  },
];

export default function Home() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="mb-1 text-2xl font-bold">MyProject</h1>
      <p className="mb-10 text-sm text-muted">
        オリエンタルコンサルタンツグローバル マイプロジェクト成果品
      </p>

      <div className="space-y-4">
        {tools.map((tool) => (
          <div
            key={tool.id}
            className="rounded-lg border border-border bg-card-bg p-5"
          >
            <div className="mb-2 flex items-center gap-3">
              <h2 className="font-bold">{tool.title}</h2>
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                  tool.status === "available"
                    ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                    : "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300"
                }`}
              >
                {tool.status === "available" ? "Available" : "Coming Soon"}
              </span>
            </div>
            <p className="mb-2 text-xs text-muted">{tool.period}</p>
            <p className="text-sm text-muted">{tool.description}</p>

            {(tool.toolLink || tool.docLink) && (
              <div className="mt-3 flex gap-4">
                {tool.toolLink && (
                  <a
                    href={tool.toolLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-md bg-accent px-3 py-1.5 text-xs font-medium text-white hover:opacity-90"
                  >
                    Open Tool &rarr;
                  </a>
                )}
                {tool.docLink && (
                  <Link
                    href={tool.docLink}
                    className="rounded-md border border-accent px-3 py-1.5 text-xs font-medium text-accent hover:bg-accent-light"
                  >
                    Manual
                  </Link>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

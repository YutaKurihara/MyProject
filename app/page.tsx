const tools = [
  {
    id: "sar-dat",
    title: "SAR-DAT",
    subtitle: "SAR Satellite Disaster Analysis Tool",
    period: "第9期・第10期",
    description:
      "Google Earth Engine上で動作する洪水被害分析ツール。Sentinel-1 SAR衛星画像から浸水範囲を自動検出し、DEMデータと組み合わせて浸水深を推定。建物・農地の直接被害額を算定します。",
    features: [
      "SAR画像による浸水域の自動検出",
      "FwDET-GEEによる浸水深推定",
      "Random Forestによる土地利用分類",
      "被害曲線を用いた直接被害額の算定",
    ],
    status: "available" as const,
    link: "https://code.earthengine.google.com/", // placeholder
  },
  {
    id: "gcm-tool",
    title: "GCM Downscaling Tool",
    subtitle: "Climate Change Impact Assessment",
    period: "第11期",
    description:
      "GCM（全球気候モデル）データのダウンスケーリングツール。DIASの気候データとPAGASA観測データを用いて、将来の気候変動シナリオ下での降水量変化を地域スケールで予測します。",
    features: [
      "GCMデータの統計的ダウンスケーリング",
      "PAGASA観測データとの統合",
      "将来の土地利用変化のAI予測",
      "RRIモデルとの連携による将来洪水シミュレーション",
    ],
    status: "available" as const,
    link: null,
  },
  {
    id: "dsge-model",
    title: "DSGE Economic Impact Model",
    subtitle: "Macroeconomic Disaster Impact Assessment",
    period: "第13期",
    description:
      "IMFのDIGNADモデルをベースとした、洪水災害のマクロ経済影響評価ツール。直接被害推定の結果をインプットとして、GDP・税収・家計への長期的な経済影響をシミュレーションします。",
    features: [
      "DSGE（動学的確率的一般均衡）モデル",
      "GDP・税収への長期影響シミュレーション",
      "気候変動シナリオとの連携",
      "水インフラ投資の費用対効果分析",
    ],
    status: "coming" as const,
    link: null,
  },
];

export default function Home() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="mb-1 text-2xl font-bold">Opendata</h1>
      <p className="mb-10 text-sm text-muted">
        防災・気候変動分野のオープンツール集
      </p>

      <div className="space-y-6">
        {tools.map((tool) => (
          <div
            key={tool.id}
            className="rounded-xl border border-border bg-card-bg p-6"
          >
            <div className="mb-3 flex items-center gap-3">
              <h2 className="text-lg font-bold">{tool.title}</h2>
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
            <p className="mb-1 text-sm text-accent">{tool.subtitle}</p>
            <p className="mb-1 text-xs text-muted">{tool.period}</p>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              {tool.description}
            </p>
            <ul className="mt-3 ml-4 list-disc space-y-1 text-xs text-muted">
              {tool.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
            {tool.link && (
              <a
                href={tool.link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block text-sm text-accent hover:underline"
              >
                Open Tool &rarr;
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

const tools = [
  {
    id: "sar-dat",
    title: "SAR-DAT",
    subtitle: "SAR衛星画像を活用した災害履歴の可視化手法の提案",
    period: "第9期（2022年）",
    description:
      "新興国の地方防災計画策定では、過去の災害情報の把握が困難であり、データの信頼性・均一性にも課題がある。本ツールはGoogle Earth Engine上でSAR衛星画像（Sentinel-1, ALOS-2）を用いて、過去の災害被害を可視化するツール。UIパネルによりコードを触らずに操作可能。",
    features: [
      "洪水範囲の可視化: SAR画像の反射強度変化（δa/δb < 1.15）により浸水域を自動検出",
      "土砂崩れの可視化: 反射強度差分（δa - δb < 1.9）による土砂崩れ判定",
      "建物被害の可視化: 反射強度変化（|Δ| > 1）による倒壊建物検出",
      "洪水履歴の可視化: MODIS光学衛星データから過去の全洪水氾濫域を重ね合わせ、人口データと結合",
      "UIパネルによる操作: 災害種・日付・解析範囲を指定するだけで解析実行可能",
      "コード共有: GEE上でコードをコピーして他のユーザーと共有可能",
    ],
    status: "available" as const,
  },
  {
    id: "flood-damage-tool",
    title: "洪水直接被害計算ツール",
    subtitle: "SAR衛星画像を活用した洪水の直接被害推定手法の確立",
    period: "第10期（2023年）",
    description:
      "第9期のSAR-DATを発展させ、浸水範囲に浸水深を付加し、建物・農作物の直接被害額を推定するツール。災害発生後の迅速な復旧・復興の意思決定に必要な被害額情報を、現地調査なしで提供する。フィリピンを対象地域としたSite-Specificなツール。",
    features: [
      "FwDET（Floodwater Depth Estimation Tool）: 浸水範囲にDEMデータを組み合わせて浸水深を推定",
      "建物被害額推定: Open Buildings V3の建物フットプリント × 脆弱性カーブ（GMMA-RAP） × 建築単価（10,000 PhP/m²）",
      "農作物マップ作成: Sentinel-1/2、光学衛星バンド等61変数を用いたRandom Forest分類（精度90%）",
      "農作物被害額推定: 作成した土地利用図 × 被害率カーブ × 販売価格（コメ69.9 PhP/m², トウモロコシ46.9 PhP/m²）",
      "洪水常襲マップ: 過去の全洪水を重ね合わせ、ハザードマップ内外の浸水リスクを評価",
      "検証: EM-DAT、UN-OCHA、RRIモデル、HEC-RASモデルとの比較検証済",
    ],
    status: "available" as const,
  },
  {
    id: "gcm-tool",
    title: "GCM Downscaling Tool",
    subtitle: "社会変化と気候変動を考慮した洪水直接被害アセスメント手法の確立",
    period: "第11期（2024年）",
    description:
      "GCM（全球気候モデル）データのダウンスケーリングツール。DIASの気候データとPAGASA観測データを用いて、将来の気候変動シナリオ下での降水量変化を地域スケールで予測する。将来の土地利用変化予測と組み合わせ、将来の洪水直接被害を評価する。",
    features: [
      "GCMデータの統計的ダウンスケーリング",
      "PAGASA観測データとの統合",
      "AIおよび統計的手法による将来の土地利用変化予測",
      "RRI洪水モデルとの連携による将来洪水シミュレーション",
    ],
    status: "available" as const,
  },
  {
    id: "dsge-model",
    title: "DSGE Economic Impact Model",
    subtitle:
      "DSGEモデルを用いた頻発する洪水被害が与える地域社会の長期経済に対する影響評価",
    period: "第13期（2025年）",
    description:
      "IMFのDIGNAD（Debt-Investment-Growth-Natural-Disasters）モデルをベースとした、洪水災害のマクロ経済影響評価ツール。第10〜12期で推定した直接被害額をインプットとして、GDP・税収・家計への長期的な経済影響をシミュレーションする。直接被害だけでは見えない経済の抑制効果を定量化し、水インフラ投資の正当性を示す。",
    features: [
      "DSGE（動学的確率的一般均衡）モデルによるマクロ経済シミュレーション",
      "GDP・税収・家計/企業損失への長期影響評価",
      "気候変動シナリオとの連携",
      "水インフラ投資の費用対効果分析",
    ],
    status: "coming" as const,
  },
];

export default function Home() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="mb-1 text-2xl font-bold">MyProject</h1>
      <p className="mb-10 text-sm text-muted">
        オリエンタルコンサルタンツグローバル マイプロジェクト成果品
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
            <p className="mb-1 text-sm font-medium">{tool.subtitle}</p>
            <p className="mb-1 text-xs text-muted">{tool.period}</p>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              {tool.description}
            </p>
            <ul className="mt-3 ml-4 list-disc space-y-1 text-xs text-muted">
              {tool.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

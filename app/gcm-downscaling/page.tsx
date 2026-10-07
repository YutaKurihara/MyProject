import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GCM ダウンスケーリングツール Manual | MyProject",
};

const BP = process.env.__NEXT_ROUTER_BASEPATH || "";

const NOTEBOOKS = [
  "1_GCMsSelection.ipynb",
  "2_DataDownload.ipynb",
  "3_GSMaPDownload.ipynb",
  "4a_Downscaling_GSMaP.ipynb",
  "4b_Downscaling_Observation.ipynb",
  "5_ResultAnalysis.ipynb",
];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8 rounded-lg border border-border bg-card-bg p-6 shadow-sm">
      <h2 className="mb-4 border-b-2 border-accent-light pb-2 text-lg font-bold text-[#1e3a5f] dark:text-accent">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Step({ num, title, children }: { num: number; title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h3 className="mb-2 flex items-center gap-2 text-sm font-bold text-accent">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent text-xs text-white">
          {num}
        </span>
        {title}
      </h3>
      <div className="ml-8 text-sm leading-relaxed text-muted">{children}</div>
    </div>
  );
}

function Tip({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-3 rounded-md border-l-4 border-accent bg-accent-light/50 p-3 text-xs text-muted">
      <span className="font-bold text-accent">Tip: </span>
      {children}
    </div>
  );
}

function H4({ children }: { children: React.ReactNode }) {
  return <h4 className="mb-2 mt-5 font-semibold text-foreground">{children}</h4>;
}

function C({ children }: { children: React.ReactNode }) {
  return <code className="rounded bg-[#f3f4f6] px-1 text-xs dark:bg-[#334155]">{children}</code>;
}

function Code({ children }: { children: string }) {
  return <pre className="my-2 overflow-x-auto rounded-md bg-[#1e293b] p-3 text-xs text-[#e2e8f0]">{children}</pre>;
}

function List({ children }: { children: React.ReactNode }) {
  return <ul className="ml-4 list-disc space-y-1.5 text-sm text-muted">{children}</ul>;
}

function Table({ head, rows }: { head: string[]; rows: React.ReactNode[][] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-xs">
        <thead>
          <tr>
            {head.map((h) => (
              <th key={h} className="border border-border bg-[#1e3a5f] px-3 py-2 text-left text-white">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className={i % 2 === 1 ? "bg-[#f0f4f8] dark:bg-[#1e293b]" : ""}>
              {r.map((c, j) => (
                <td key={j} className={`border border-border px-3 py-2 ${j === 0 ? "font-medium" : "text-muted"}`}>
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const S = ({ children }: { children: React.ReactNode }) => <strong className="text-foreground">{children}</strong>;

function Notebook({
  title,
  what,
  settings,
  outputs,
  children,
}: {
  title: string;
  what: React.ReactNode;
  settings: React.ReactNode;
  outputs: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <Section title={title}>
      <p className="text-sm text-muted">{what}</p>
      <H4>主な設定</H4>
      <List>{settings}</List>
      {children}
      <H4>出力（OUTPUT_DIR 内）</H4>
      <List>{outputs}</List>
    </Section>
  );
}

export default function GcmDownscalingPage() {
  return (
    <div className="mx-auto max-w-[960px] px-4 py-10">
      <header className="mb-10 border-b-[3px] border-accent pb-4 text-center">
        <h1 className="mb-1 text-2xl font-bold text-[#1e3a5f] dark:text-accent">
          GCM ダウンスケーリングツール 使用マニュアル
        </h1>
        <p className="text-sm text-muted">GCM Downscaling Tool (ver.1, 2026年10月更新)</p>
        <p className="mt-1 text-xs text-muted">オリエンタルコンサルタンツグローバル プランニング事業部</p>
      </header>

      <Section title="本ツールの位置づけ">
        <p className="text-sm text-muted">
          本ツールは、
          <S>
            「フィリピン・カガヤンバレー地域における気候変動と土地利用の変化を考慮した将来の洪水リスク評価のためのAIと統計の統合フレームワーク」
          </S>
          （第11期マイプロジェクト）の一部として開発したものです。
          CMIP6 の GCM（全球気候モデル）の降水量を、衛星観測（GSMaP）または地上観測で補正し、
          将来の流域平均雨量と確率雨量の変化を評価します。Google Colaboratory 上で動く6つのノートブックで構成されています。
        </p>
      </Section>

      <Section title="ツールのダウンロード">
        <div className="mb-4 flex flex-wrap gap-3">
          <a
            href={`${BP}/notebooks/gcm-downscaling.zip`}
            download
            className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            全ノートブックをZIPでダウンロード (69 KB)
          </a>
        </div>
        <p className="mb-2 text-xs font-medium text-foreground">個別ダウンロード:</p>
        <div className="flex flex-wrap gap-2">
          {NOTEBOOKS.map((f) => (
            <a
              key={f}
              href={`${BP}/notebooks/gcm-downscaling/${f}`}
              download
              className="rounded border border-accent px-3 py-1.5 text-xs text-accent hover:bg-accent-light"
            >
              {f}
            </a>
          ))}
        </div>
      </Section>

      <Section title="ツールセットアップ">
        <Step num={1} title="ノートブックをGoogle Driveに保存">
          <p>
            6つのノートブックを Google Drive に保存し、Google Colaboratory で開きます
            （ファイルを右クリック →「アプリで開く」→「Colaboratory」。初回はアプリの追加が必要です）。
          </p>
        </Step>
        <Step num={2} title="環境設定">
          <p>
            各ノートブックの最初のセルで Google Drive をマウントします。Earth Engine を使う Notebook 1 と 3 では
            <C>GEE_PROJECT</C> にご自身のプロジェクトIDを設定します。
          </p>
          <Code>{`os.environ['GEE_PROJECT'] = 'your-ee-project-id'                         # Notebook 1, 3
os.environ['OUTPUT_DIR']  = '/content/drive/MyDrive/Downscaling/Output'  # 全ノートブック共通`}</Code>
          <Tip>
            全ノートブックが同じ <C>OUTPUT_DIR</C> を使い、前のノートブックの出力を自動で読み込みます。
            ファイルを手でアップロードする必要はありません。
          </Tip>
        </Step>
        <Step num={3} title="設定セルを編集して、上から順に実行">
          <p>各ノートブックの設定セル（<C>(edit these)</C> と書かれたセル）を対象地域に合わせて編集し、順に実行します。</p>
        </Step>
        <Step num={4} title="GCP権限エラーの対処">
          <p>Earth Engine の初期化でエラーになる場合は、Google Cloud Console の「IAMと管理」→「IAM」で、ご自身のアカウントに「オーナー」ロールを付与してください。</p>
        </Step>
      </Section>

      <Notebook
        title="1. GCMsSelection.ipynb — GCM精度評価"
        what={
          <>
            評価領域内で、観測と各 GCM の降水量・気温・放射・風速の気候値を比較し（空間相関と RMSE）、
            モデルごとの総合スコア <C>total_score</C> を算出します。上位のモデルを Notebook 2 で使います。
          </>
        }
        settings={
          <>
            <li>
              <C>region</C>：評価領域 <C>[西経度, 南緯度, 東経度, 北緯度]</C>。GCM 格子（0.25°）が多数入るよう、
              <S>2°×2°以上</S>にします。
            </li>
            <li><C>target_region</C>：地図に表示する流域の範囲（任意）</li>
            <li><C>start_date</C> / <C>end_date</C>：評価期間</li>
            <li><C>OBS_PR_SOURCE</C>：降水の観測（<C>&apos;ERA5&apos;</C> または <C>&apos;GSMaP&apos;</C>）</li>
          </>
        }
        outputs={<li><C>GCMs_Evaluation.csv</C> — モデル別の評価結果とスコア</li>}
      >
        <Code>{`region = ee.Geometry.Rectangle([71.0, 17.0, 75.0, 20.0])   # 例
target_region = None
start_date, end_date = '1985-01-01', '2015-01-01'`}</Code>
      </Notebook>

      <Notebook
        title="2. DataDownload.ipynb — GCMデータ取得"
        what={
          <>
            流域シェープファイルと重なる GCM 格子を抽出し、選んだモデルのヒストリカル・将来シナリオの日降水量を
            NASA NEX-GDDP-CMIP6 から格子ごとに取得します。
          </>
        }
        settings={
          <>
            <li><C>SELECTED_MODELS</C>：使うモデル（Notebook 1 の上位モデル）</li>
            <li>流域：シェープファイル一式（.shp / .dbf / .shx / .prj）をアップロード</li>
            <li><C>HIST_START</C> / <C>HIST_LENGTH</C>：ヒストリカル期間（例：1995年から20年）</li>
            <li><C>FUT_START</C> / <C>FUT_MULTIPLIER</C>：将来期間（ヒストリカルの長さの整数倍）</li>
            <li><C>ssp_scenarios</C>：SSP シナリオ（ssp126 / ssp245 / ssp370 / ssp585）</li>
          </>
        }
        outputs={
          <>
            <li><C>his_orig/his_id_*.csv</C>、<C>{"{ssp}"}_orig/fut_{"{ssp}"}_id_*.csv</C> — 格子ごとの日降水量（列＝モデル）</li>
            <li><C>gcm_grid_shp/</C> — GCM 格子と中心点のシェープファイル（Notebook 3・4b・5 が使用）</li>
          </>
        }
      >
        <Code>{`SELECTED_MODELS = ["ACCESS-CM2", "CanESM5", "EC-Earth3-Veg-LR"]   # 例
HIST_START, HIST_LENGTH = 1995, 20
FUT_START, FUT_MULTIPLIER = 2021, 4      # 2021〜2100年
ssp_scenarios = ["ssp126", "ssp245", "ssp370", "ssp585"]`}</Code>
      </Notebook>

      <Notebook
        title="3. GSMaPDownload.ipynb — 衛星降水観測データ取得"
        what={<>JAXA GSMaP v8 の日降水量を Earth Engine で取得し、Notebook 2 の GCM 格子ごとに集計します。Notebook 4a の観測データになります。</>}
        settings={
          <li>
            <C>years</C>：取得期間（例：1998〜2017年）。Notebook 2 のヒストリカル期間と<S>同じ年数</S>にします。GSMaP は1998年以降のみです。
          </li>
        }
        outputs={<li><C>his_GSMaP_orig/his_GSMaP_id_*.csv</C> — 格子ごとの GSMaP 日降水量</li>}
      />

      <Section title="4. Downscaling — バイアス補正（4a / 4b）">
        <p className="text-sm text-muted">
          観測を用いて、<S>順序統計量補正法（Quantile Mapping）</S>で GCM の降水量を補正します。
          上位10%の極端降水は全期間の補正係数、それ以外は月別の補正係数で補正し、無降水日数も観測に合わせます。
          将来期間はヒストリカルと同じ長さに区切って補正します。
        </p>
        <Code>{`補正係数(順位i) = 観測(順位i) / GCMヒストリカル(順位i)
補正後GCM(値x) = GCM(値x) × 補正係数(xの順位)`}</Code>
        <Table
          head={["ノートブック", "観測", "主な設定"]}
          rows={[
            ["4a_Downscaling_GSMaP", "GSMaP（Notebook 3）", <><code>ssp_list</code>：補正するシナリオ</>],
            [
              "4b_Downscaling_Observation",
              "地上雨量計",
              <>
                観測雨量 CSV をアップロード（各 GCM 格子に最寄りの観測所を割り当て）、<code>OBS_PERIOD</code>：補正に使う観測期間、
                <code>ssp_list</code>
              </>,
            ],
          ]}
        />
        <H4>観測雨量CSVの形式（4b）</H4>
        <p className="text-sm text-muted">1行目に観測所数、2行目に緯度、3行目に経度、4行目以降に日付と各観測所の雨量を並べます。</p>
        <div className="my-3">
          <a
            href={`${BP}/templates/observation_rainfall_template.csv`}
            download
            className="inline-block rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            観測雨量CSVテンプレートをダウンロード
          </a>
        </div>
        <Tip>補正に使う観測と GCM ヒストリカルは、同じ日数（既定では20年）にしてください。</Tip>
        <H4>出力（OUTPUT_DIR 内）</H4>
        <List>
          <li><C>his_corr/his_id_*_corrected.csv</C> — 補正後ヒストリカル</li>
          <li><C>{"{ssp}"}_corr/fut_{"{ssp}"}_id_*_corrected.csv</C> — 補正後将来シナリオ</li>
        </List>
      </Section>

      <Notebook
        title="5. ResultAnalysis.ipynb — 結果解析（確率雨量）"
        what={
          <>
            補正後の降水量から流域平均雨量を求め、年平均・年最大雨量の推移と傾向（Mann–Kendall 検定）、
            年最大日雨量の<S>確率雨量</S>をシナリオごとに算定します。確率雨量は GCM ごとに算定し、
            GCM 間の平均・中央値・範囲で示します。分布の選定は「水文統計ユーティリティ」（国土技術政策総合研究所）に準じます（SLSC・ジャックナイフ法）。
          </>
        }
        settings={<li>設定は不要です（補正に使った観測は自動で判定します）。</li>}
        outputs={
          <>
            <li><C>analysis/</C> — 年平均・年最大雨量のグラフ、確率紙プロット、確率雨量の表（CSV・Excel）</li>
          </>
        }
      />

      <Section title="推奨ワークフロー">
        <ol className="ml-4 list-decimal space-y-2 text-sm text-muted">
          <li><S>Notebook 1</S> で GCM を選定</li>
          <li><S>Notebook 2</S> で選定モデルのデータを取得</li>
          <li>
            観測に応じてバイアス補正：衛星観測は <S>Notebook 3 → 4a</S>、地上観測は <S>Notebook 4b</S>
          </li>
          <li><S>Notebook 5</S> で流域平均雨量と確率雨量の変化を評価</li>
          <li>補正後の雨量を水文モデル（RRI 等）の入力として、将来の洪水を評価</li>
        </ol>
      </Section>

      <Section title="実行上の注意点">
        <List>
          <li><S>実行環境</S>：Google Colab を推奨します。</li>
          <li><S>GSMaP の期間</S>：1998年以降のみ利用できます。</li>
          <li>
            <S>定常性の仮定</S>：順序統計量補正は、過去の観測と GCM ヒストリカルの関係が将来も成り立つと仮定しています。
          </li>
        </List>
      </Section>

      <Section title="使用データソース">
        <Table
          head={["データ", "解像度", "用途"]}
          rows={[
            ["NASA NEX-GDDP-CMIP6", "0.25°（約28km）", "GCM精度評価（Notebook 1）／ヒストリカル・将来データ（Notebook 2）"],
            ["ERA5-Land Daily Aggregated", "0.1°（約9km）", "観測リファレンス（Notebook 1）"],
            ["JAXA GSMaP v8 Operational", "0.1°（約11km）", "衛星降水量（Notebook 1・3）"],
            ["地上観測雨量計", "地点", "地上観測降水量（Notebook 4b）"],
          ]}
        />
      </Section>

      <div className="text-center">
        <a href="/MyProject/" className="text-sm text-accent hover:underline">
          &larr; MyProject トップへ戻る
        </a>
      </div>
    </div>
  );
}

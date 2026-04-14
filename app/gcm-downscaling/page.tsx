import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GCM ダウンスケーリングツール Manual | MyProject",
};

const BP = process.env.__NEXT_ROUTER_BASEPATH || "";

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

export default function GcmDownscalingPage() {
  return (
    <div className="mx-auto max-w-[960px] px-4 py-10">
      <header className="mb-10 border-b-[3px] border-accent pb-4 text-center">
        <h1 className="mb-1 text-2xl font-bold text-[#1e3a5f] dark:text-accent">
          GCM ダウンスケーリングツール 使用マニュアル
        </h1>
        <p className="text-sm text-muted">
          GCM Downscaling Tool for Climate Change Impact Assessment
        </p>
        <p className="mt-1 text-xs text-muted">
          オリエンタルコンサルタンツグローバル プランニング事業部
        </p>
      </header>

      {/* ===== 研究背景 ===== */}
      <Section title="本ツールの位置づけ">
        <p className="mb-3 text-sm text-muted">
          本ツールは、
          <strong className="text-foreground">
            「フィリピン・カガヤンバレー地域における気候変動と土地利用の変化を考慮した将来の洪水リスク評価のためのAIと統計の統合フレームワーク」
          </strong>
          （第11期マイプロジェクト）の一部として開発されたものです。
          将来の洪水リスク評価を行うためには、GCM（全球気候モデル）の降水量データを
          対象地域のスケールに合わせてダウンスケーリングし、バイアスを補正する必要があります。
        </p>
        <p className="mb-3 text-sm text-muted">
          本マニュアルでは、CMIP6の複数のGCMから精度の高いモデルを選定し、
          <strong className="text-foreground">NASA NEX-GDDP-CMIP6</strong>
          のデータをダウンロード、GSMaP衛星観測または地上観測データを用いて
          バイアス補正するまでの一連のワークフローを解説します。
        </p>
        <p className="text-sm text-muted">
          補正後のデータは、水文モデル（RRI等）に入力することで、
          将来の降水量・流量・浸水域の変化を評価できます。
          プロジェクトではこの結果を用いて、100年確率洪水の流量が気候変動で
          <strong className="text-foreground">56%増加</strong>、
          浸水面積が<strong className="text-foreground">65%増加</strong>
          することを示しました。
        </p>
      </Section>

      {/* ===== 概要 ===== */}
      <Section title="ツールの構成">
        <p className="mb-3 text-sm text-muted">
          5つのJupyter Notebookで構成されています。
          実行順序は以下の通りです。
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { name: "1_GCMsSelection", desc: "CMIP6 GCMの精度評価（ERA5との相関・RMSE）" },
            { name: "2_DataDownload", desc: "GCMヒストリカル・将来データのダウンロード（S3）" },
            { name: "3_GSMaPDownload", desc: "GSMaP衛星降水データの取得（GEE経由）" },
            { name: "4a_Downscaling_GSMaP", desc: "GSMaPでGCMをバイアス補正" },
            { name: "4b_Downscaling_Observation", desc: "地上観測でGCMをバイアス補正" },
          ].map((item) => (
            <div key={item.name} className="rounded-md border border-border p-3">
              <p className="text-sm font-bold">{item.name}</p>
              <p className="text-xs text-muted">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {[
            "1_GCMsSelection.ipynb",
            "2_DataDownload.ipynb",
            "3_GSMaPDownload.ipynb",
            "4a_Downscaling_GSMaP.ipynb",
            "4b_Downscaling_Observation.ipynb",
          ].map((f) => (
            <a
              key={f}
              href={`${BP}/notebooks/gcm-downscaling/${f}`}
              download
              className="rounded-md bg-accent px-3 py-1.5 text-xs font-medium text-white hover:opacity-90"
            >
              {f}
            </a>
          ))}
        </div>
      </Section>

      {/* ===== 事前準備 ===== */}
      <Section title="事前準備">
        <Step num={1} title="必要なライブラリ">
          <p>Python環境（推奨: Google Colab）で以下のライブラリが必要です。</p>
          <pre className="my-2 overflow-x-auto rounded-md bg-[#1e293b] p-3 text-xs text-[#e2e8f0]">
{`pip install earthengine-api geemap xarray rioxarray geopandas cftime s3fs`}
          </pre>
        </Step>

        <Step num={2} title="環境変数の設定">
          <p>
            各ノートブックの冒頭に共通の環境設定セルがあります。
            初回実行時に以下の2つの環境変数を設定してください。
          </p>
          <pre className="my-2 overflow-x-auto rounded-md bg-[#1e293b] p-3 text-xs text-[#e2e8f0]">
{`import os
os.environ['GEE_PROJECT'] = 'your-ee-project-id'
os.environ['OUTPUT_DIR'] = '/content/drive/MyDrive/Downscaling'  # または任意のパス`}
          </pre>
          <Tip>
            ハードコードされたGEEプロジェクトIDやColabパスは環境変数化されているため、
            ご自身の環境に合わせて変更するだけで動作します。
          </Tip>
        </Step>

        <Step num={3} title="Earth Engineの認証">
          <p>Notebook 1 と 3 はGoogle Earth Engineを使用します。</p>
          <pre className="my-2 overflow-x-auto rounded-md bg-[#1e293b] p-3 text-xs text-[#e2e8f0]">
{`import ee
ee.Authenticate()
ee.Initialize(project=GEE_PROJECT)`}
          </pre>
        </Step>

        <Step num={4} title="対象地域の定義">
          <p>
            Notebook 2では、解析対象地域をGeoJSON形式で指定します。
            QGIS等で対象地域のポリゴンを作成し、GeoJSONとしてエクスポートしてください。
          </p>
        </Step>
      </Section>

      {/* ===== Notebook 1 ===== */}
      <Section title="Notebook 1: GCMs Selection（GCM精度評価）">
        <p className="mb-4 text-sm text-muted">
          CMIP6の複数GCMの中から、対象地域で精度の高いモデルを選定します。
          ERA5再解析データ（1986〜2006年）をリファレンスとして、
          各GCMヒストリカルランとの相関係数とRMSEを計算します。
        </p>

        <Step num={1} title="入力データ">
          <ul className="ml-4 list-disc space-y-1">
            <li>ERA5-Land月次降水量（観測リファレンス）</li>
            <li>NASA GDDP-CMIP6 Historical（各GCMモデル）</li>
            <li>対象地域ポリゴン</li>
          </ul>
        </Step>

        <Step num={2} title="評価指標（第11期プロジェクトで採用）">
          <p>プロジェクトではスコアリング方式で複数指標を総合評価しています。</p>
          <ul className="ml-4 mt-1 list-disc space-y-1">
            <li><strong className="text-foreground">相関係数</strong>（CF）</li>
            <li><strong className="text-foreground">平均誤差</strong>（MAE）</li>
            <li><strong className="text-foreground">RMSE</strong></li>
            <li>年最大降水量、月別降水パターン等の指標も組み合わせ</li>
          </ul>
        </Step>

        <Step num={3} title="出力と選定例">
          <p>
            <code className="rounded bg-[#f3f4f6] px-1 text-xs dark:bg-[#334155]">GCMs_Evaluation.csv</code>
            に各モデルのスコアが出力されます。
          </p>
          <p className="mt-2">
            カガヤンバレー地域でスコア9以上を記録した3モデルが選定されました：
          </p>
          <ul className="ml-4 mt-1 list-disc space-y-1">
            <li><strong className="text-foreground">ACCESS-CM2</strong>（豪州CSIRO）</li>
            <li><strong className="text-foreground">CanESM5</strong>（カナダ CCCma）</li>
            <li><strong className="text-foreground">EC-Earth3-Veg-LR</strong>（欧州 EC-Earth Consortium）</li>
          </ul>
          <Tip>
            単一モデルではなく複数モデルのアンサンブル平均を使うことで、
            モデル間の不確実性を低減できます。
          </Tip>
        </Step>
      </Section>

      {/* ===== Notebook 2 ===== */}
      <Section title="Notebook 2: Data Download（GCMデータ取得）">
        <p className="mb-4 text-sm text-muted">
          NASA NEX-GDDP-CMIP6のデータをAWS S3から直接ダウンロードし、
          対象地域のグリッドセルごとに時系列CSVに整理します。
        </p>

        <Step num={1} title="対象期間とシナリオ">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-xs">
              <thead>
                <tr>
                  <th className="border border-border bg-[#1e3a5f] px-3 py-2 text-left text-white">期間</th>
                  <th className="border border-border bg-[#1e3a5f] px-3 py-2 text-left text-white">シナリオ</th>
                  <th className="border border-border bg-[#1e3a5f] px-3 py-2 text-left text-white">用途</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-border px-3 py-2 font-medium">1950-2014</td>
                  <td className="border border-border px-3 py-2">Historical</td>
                  <td className="border border-border px-3 py-2 text-muted">バイアス補正の基準</td>
                </tr>
                <tr className="bg-[#f0f4f8] dark:bg-[#1e293b]">
                  <td className="border border-border px-3 py-2 font-medium">2015-2100</td>
                  <td className="border border-border px-3 py-2">SSP1-2.6（低排出）</td>
                  <td className="border border-border px-3 py-2 text-muted">楽観的シナリオ</td>
                </tr>
                <tr>
                  <td className="border border-border px-3 py-2 font-medium">2015-2100</td>
                  <td className="border border-border px-3 py-2">SSP2-4.5（中排出）</td>
                  <td className="border border-border px-3 py-2 text-muted">標準シナリオ</td>
                </tr>
                <tr className="bg-[#f0f4f8] dark:bg-[#1e293b]">
                  <td className="border border-border px-3 py-2 font-medium">2015-2100</td>
                  <td className="border border-border px-3 py-2">SSP5-8.5（高排出）</td>
                  <td className="border border-border px-3 py-2 text-muted">悲観的シナリオ</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Step>

        <Step num={2} title="グリッド作成">
          <p>
            GCMの0.25度（約28km）解像度に合わせて対象地域内のグリッドセルを自動生成。
            各セルにIDを付与してSHP形式で保存します。
            第11期プロジェクトでは、カガヤンバレー地域に<strong className="text-foreground">36グリッド</strong>
            が生成されました。
          </p>
        </Step>

        <Step num={3} title="データダウンロード">
          <p>
            AWS S3からNetCDFファイルを取得し、
            グリッドセルごとに抽出してCSVに保存します。
          </p>
          <Tip>
            29モデルすべてをダウンロードすると時間・容量が膨大になります。
            Notebook 1で選定した上位3モデルのみに絞ることを推奨します。
          </Tip>
        </Step>

        <Step num={4} title="出力">
          <ul className="ml-4 list-disc space-y-1">
            <li><code className="rounded bg-[#f3f4f6] px-1 text-xs dark:bg-[#334155]">his_id_*.csv</code> — ヒストリカル時系列（セル別）</li>
            <li><code className="rounded bg-[#f3f4f6] px-1 text-xs dark:bg-[#334155]">fut_ssp*_id_*.csv</code> — 将来シナリオ時系列（セル別）</li>
            <li>グリッドSHPファイル</li>
          </ul>
        </Step>
      </Section>

      {/* ===== Notebook 3 ===== */}
      <Section title="Notebook 3: GSMaP Download（観測データ取得）">
        <p className="mb-4 text-sm text-muted">
          JAXA GSMaP v8（Global Satellite Mapping of Precipitation）の衛星降水データを
          Earth Engine経由で取得し、GCMグリッドに合わせて整理します。
        </p>

        <Step num={1} title="GSMaPを使う理由">
          <p>
            第11期プロジェクトでは、6つの衛星降水データと1つの再解析データを比較し、
            台風Ulysses（2020年11月）期間の地上観測との一致度で評価した結果、
            <strong className="text-foreground">GSMaP v8 MVKが最高精度</strong>
            を示しました。
          </p>
        </Step>

        <Step num={2} title="GSMaPデータの取得">
          <p>
            Earth Engineの <code className="rounded bg-[#f3f4f6] px-1 text-xs dark:bg-[#334155]">JAXA/GPM_L3/GSMaP/v8/operational</code>
            から日別降水量を取得。GCMグリッドの中心点でサンプリングします。
          </p>
        </Step>

        <Step num={3} title="GSMaPの補正">
          <p>
            プロジェクトでは、GSMaPデータをさらに地上観測で補正するため、
            <strong className="text-foreground">逆距離加重法（IDW）</strong>
            で補正係数メッシュを作成しています。
            これにより、地上観測と整合のとれた高精度な降水量グリッドを構築できます。
          </p>
        </Step>

        <Step num={4} title="出力">
          <p>
            <code className="rounded bg-[#f3f4f6] px-1 text-xs dark:bg-[#334155]">his_GSMaP_id_*.csv</code>
            — 各GCMグリッドセルの日別GSMaP降水量時系列。
          </p>
          <Tip>
            GSMaPは2000年3月以降のデータしか利用できません。
            Notebook 4aで補正に使用する期間を、GSMaPが利用可能な期間に合わせて設定してください。
          </Tip>
        </Step>
      </Section>

      {/* ===== Notebook 4a ===== */}
      <Section title="Notebook 4a: Downscaling (GSMaP)">
        <p className="mb-4 text-sm text-muted">
          GSMaP観測データを用いて、GCMの降水量バイアスを補正します。
          <strong className="text-foreground">順序統計量補正法（Quantile Mapping）</strong>
          により、GCMの降水分布を観測の分布に合わせます。
        </p>

        <Step num={1} title="補正手法の概要">
          <p>
            各月ごとに、GCMヒストリカルとGSMaP観測の日別降水量を昇順にソートし、
            同じ順位の値の比率（補正係数）を計算します。
            この係数を将来シナリオのGCMデータに適用することで、
            将来予測値をバイアス補正します。
          </p>
          <pre className="my-2 overflow-x-auto rounded-md bg-[#1e293b] p-3 text-xs text-[#e2e8f0]">
{`補正係数(順位i) = 観測(順位i) / GCMヒストリカル(順位i)
補正後GCM(値x) = GCM(値x) × 補正係数(xの順位)`}
          </pre>
        </Step>

        <Step num={2} title="補正係数の種類">
          <ul className="ml-4 list-disc space-y-1">
            <li><strong className="text-foreground">df_corr1</strong>: 全期間の補正係数（上位90%の降水に適用）</li>
            <li><strong className="text-foreground">df_corr2</strong>: 月別の補正係数（下位10%の降水に適用）</li>
          </ul>
          <p className="mt-2">
            極端降水と平常降水を別々の係数で補正することで、
            極値の再現性を保ちながら日常的な降水パターンも正しく補正できます。
          </p>
        </Step>

        <Step num={3} title="ゼロ日処理（drizzle problem対策）">
          <p>
            観測で降水ゼロの日数をカウントし、
            GCMの降水量分布の下位を観測ゼロ日数分だけゼロにリセットします。
            これにより、GCMが過剰に小雨を予測する問題（drizzle problem）を解消します。
          </p>
        </Step>

        <Step num={4} title="出力">
          <ul className="ml-4 list-disc space-y-1">
            <li><code className="rounded bg-[#f3f4f6] px-1 text-xs dark:bg-[#334155]">his_id_*_corrected.csv</code> — 補正後ヒストリカル時系列</li>
            <li><code className="rounded bg-[#f3f4f6] px-1 text-xs dark:bg-[#334155]">fut_ssp*_id_*_corrected.csv</code> — 補正後将来シナリオ時系列</li>
          </ul>
        </Step>
      </Section>

      {/* ===== Notebook 4b ===== */}
      <Section title="Notebook 4b: Downscaling (Observation)">
        <p className="mb-4 text-sm text-muted">
          GSMaPの代わりに地上観測降水データ（雨量計等）を用いてGCMを補正します。
          手法はNotebook 4aと同じ順序統計量補正法ですが、
          地上観測の方が地域ごとの降水特性をより正確に反映できます。
        </p>

        <Step num={1} title="入力データ">
          <ul className="ml-4 list-disc space-y-1">
            <li>地上観測日別降水量（雨量計データをCSV化）</li>
            <li>GCMヒストリカルデータ（Notebook 2の出力）</li>
          </ul>
          <Tip>
            地上観測データの形式はGCMグリッドIDに対応したCSV
            （<code className="rounded bg-[#f3f4f6] px-1 text-xs dark:bg-[#334155]">his_obs_id_*.csv</code>）である必要があります。
            観測地点とGCMグリッドのマッピングは事前に実施しておきます。
          </Tip>
        </Step>

        <Step num={2} title="複数SSPシナリオへの対応">
          <p>
            Notebook 4bは複数の将来シナリオ（SSP1-2.6, SSP2-4.5, SSP3-7.0, SSP5-8.5）に
            一括対応しており、バッチ処理で全シナリオを補正できます。
          </p>
        </Step>

        <Step num={3} title="出力">
          <p>Notebook 4aと同じ形式で補正後ファイルが出力されます。</p>
        </Step>
      </Section>

      {/* ===== 後段の解析 ===== */}
      <Section title="後段の解析（参考: 第11期プロジェクト）">
        <p className="mb-3 text-sm text-muted">
          本ツールで補正した降水量データは、第11期プロジェクトで以下の解析に使用されました。
          ツール自体には含まれませんが、参考情報として記載します。
        </p>

        <h3 className="mb-2 mt-4 font-semibold">1. 降雨確率解析</h3>
        <p className="text-sm text-muted">
          補正後の日別降水量から年最大値を抽出し、
          <strong className="text-foreground">GEV（一般化極値分布）</strong>
          でフィッティングして確率降雨を算出。SLSC値とジャックナイフ法で分布選定。
        </p>

        <h3 className="mb-2 mt-4 font-semibold">2. 水文モデル（RRI）への入力</h3>
        <p className="text-sm text-muted">
          補正降雨データを<strong className="text-foreground">RRI（Rainfall-Runoff-Inundation）</strong>
          モデルに入力し、流量・浸水域を計算。Buntun Bridge等の観測点で検証済み。
        </p>

        <h3 className="mb-2 mt-4 font-semibold">3. 気候変動影響の定量化</h3>
        <p className="text-sm text-muted">
          現在と将来（2060-2080）の確率降雨を比較し、100年確率洪水で：
        </p>
        <ul className="ml-4 mt-1 list-disc space-y-1 text-sm text-muted">
          <li>降雨量: <strong className="text-foreground">3%増加</strong></li>
          <li>流量: <strong className="text-foreground">56%増加</strong></li>
          <li>浸水面積: <strong className="text-foreground">65%増加</strong></li>
        </ul>

        <h3 className="mb-2 mt-4 font-semibold">4. ベイズ推定による不確実性評価</h3>
        <p className="text-sm text-muted">
          頻度論的な確率降雨推定は20年のデータでは不確実性が大きいため、
          第11期プロジェクトではベイズ推定を併用し、
          95%信用区間付きの確率降雨を算出しています。
        </p>
      </Section>

      {/* ===== 推奨ワークフロー ===== */}
      <Section title="推奨ワークフロー">
        <ol className="ml-4 list-decimal space-y-2 text-sm text-muted">
          <li>
            <strong className="text-foreground">Notebook 1</strong> で対象地域に適したGCMモデルを選定
          </li>
          <li>
            <strong className="text-foreground">Notebook 2</strong> で選定モデルのヒストリカル・将来データをダウンロード
          </li>
          <li>
            観測データの種類に応じて：
            <ul className="ml-4 mt-1 list-disc space-y-1">
              <li>
                <strong className="text-foreground">衛星観測のみ</strong>:
                Notebook 3 → Notebook 4a
              </li>
              <li>
                <strong className="text-foreground">地上観測あり</strong>:
                Notebook 4b（より高精度、推奨）
              </li>
            </ul>
          </li>
          <li>
            補正後データを水文モデル（RRI、HEC-HMS等）の入力として使用し、将来洪水を評価
          </li>
        </ol>
      </Section>

      {/* ===== 実行上の注意点 ===== */}
      <Section title="実行上の注意点">
        <ul className="ml-4 list-disc space-y-2 text-sm text-muted">
          <li>
            <strong className="text-foreground">実行環境</strong>:
            Google Colab推奨。ローカル実行も可能。いずれも冒頭の設定セルで
            <code className="rounded bg-[#f3f4f6] px-1 text-xs dark:bg-[#334155]">OUTPUT_DIR</code>
            を設定してください。
          </li>
          <li>
            <strong className="text-foreground">GEEプロジェクトID</strong>:
            <code className="rounded bg-[#f3f4f6] px-1 text-xs dark:bg-[#334155]">GEE_PROJECT</code>
            環境変数でご自身のIDに設定。
          </li>
          <li>
            <strong className="text-foreground">S3アクセス</strong>:
            NASA NEX-GDDP-CMIP6はAWS S3から匿名アクセス可能ですが、
            ネットワーク環境によってはタイムアウトが発生することがあります。
          </li>
          <li>
            <strong className="text-foreground">メモリ使用量</strong>:
            全GCM × 全SSPを一括処理するとColabの無料枠を超過することがあります。
            モデル・シナリオを絞って順次実行してください。
          </li>
          <li>
            <strong className="text-foreground">GSMaPの期間制限</strong>:
            Notebook 4aで使用するGSMaPは2000年3月以降のデータのみ。
            ヒストリカル補正期間もこれに合わせる必要があります。
          </li>
          <li>
            <strong className="text-foreground">定常性の仮定</strong>:
            順序統計量補正は過去の観測とGCMのヒストリカルの関係が将来も成立する
            （定常性）と仮定しています。気候変動で降水パターンが大きく変化する場合、
            この仮定は完全には成立しない点に注意してください。
          </li>
        </ul>
      </Section>

      {/* ===== データソース ===== */}
      <Section title="使用データソース">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr>
                <th className="border border-border bg-[#1e3a5f] px-3 py-2 text-left text-white">データ</th>
                <th className="border border-border bg-[#1e3a5f] px-3 py-2 text-left text-white">解像度</th>
                <th className="border border-border bg-[#1e3a5f] px-3 py-2 text-left text-white">用途</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["NASA NEX-GDDP-CMIP6", "0.25°（約28km）", "GCM ヒストリカル・将来シナリオ降水量"],
                ["ERA5-Land", "0.1°", "GCMモデル精度評価のリファレンス"],
                ["JAXA GSMaP v8 MVK", "0.1°", "衛星観測降水量（補正リファレンス）"],
                ["地上観測雨量計（PAGASA等）", "地点", "地上観測降水量（補正リファレンス、Notebook 4b）"],
              ].map(([name, res, use], i) => (
                <tr key={name} className={i % 2 === 0 ? "bg-[#f0f4f8] dark:bg-[#1e293b]" : ""}>
                  <td className="border border-border px-3 py-2 font-medium">{name}</td>
                  <td className="border border-border px-3 py-2 text-muted">{res}</td>
                  <td className="border border-border px-3 py-2 text-muted">{use}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <div className="text-center">
        <a href="/MyProject/" className="text-sm text-accent hover:underline">
          &larr; MyProject トップへ戻る
        </a>
      </div>
    </div>
  );
}

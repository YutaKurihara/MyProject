import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GCM ダウンスケーリングツール Manual | MyProject",
};

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
          オリエンタルコンサルタンツグローバル 水資源・防災部
        </p>
      </header>

      {/* ===== 概要 ===== */}
      <Section title="概要">
        <p className="mb-3 text-sm text-muted">
          NASA NEX-GDDP-CMIP6のGCM（全球気候モデル）データを、
          GSMaP衛星観測または地上観測データを用いて
          <strong className="text-foreground">順序統計量補正法（Quantile Mapping）</strong>
          でバイアス補正するツールです。
          将来気候シナリオ（SSP2-4.5、SSP5-8.5等）における降水量予測を
          対象地域に合わせて高精度化します。
        </p>
        <p className="mb-3 text-sm text-muted">
          5つのJupyter Notebookで構成され、
          GCMモデルの精度評価からデータダウンロード、補正までを一貫して実行できます。
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { name: "1. GCMsSelection", desc: "CMIP6 GCMの精度評価（ERA5との相関・RMSE）" },
            { name: "2. DataDownload", desc: "GCMヒストリカル・将来データのダウンロード（S3）" },
            { name: "3. GSMaPDownload", desc: "GSMaP衛星降水データの取得（GEE経由）" },
            { name: "4a. Downscaling (GSMaP)", desc: "GSMaPでGCMをバイアス補正" },
            { name: "4b. Downscaling (Observation)", desc: "地上観測でGCMをバイアス補正" },
          ].map((item) => (
            <div key={item.name} className="rounded-md border border-border p-3">
              <p className="text-sm font-bold">{item.name}</p>
              <p className="text-xs text-muted">{item.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ===== 事前準備 ===== */}
      <Section title="事前準備">
        <Step num={1} title="必要なライブラリ">
          <p>Python環境（推奨: Google Colab）で以下のライブラリが必要です。</p>
          <ul className="ml-4 mt-1 list-disc space-y-1">
            <li>earthengine-api（Notebook 1, 3）</li>
            <li>xarray, rioxarray, rasterio（Notebook 2）</li>
            <li>geopandas, shapely（Notebook 2, 3）</li>
            <li>pandas, numpy, matplotlib（Notebook 4a, 4b）</li>
            <li>cftime（Notebook 2）</li>
          </ul>
        </Step>

        <Step num={2} title="Earth Engineの認証">
          <p>
            Notebook 1 と 3 はGoogle Earth Engineを使用します。
            実行前に以下で認証してください：
          </p>
          <pre className="my-2 overflow-x-auto rounded-md bg-[#1e293b] p-3 text-xs text-[#e2e8f0]">
{`import ee
ee.Authenticate()
ee.Initialize(project='your-project-id')`}
          </pre>
          <Tip>
            コード内では <code className="rounded bg-[#f3f4f6] px-1 text-xs dark:bg-[#334155]">project=&apos;ee-kurihara-yt&apos;</code> とハードコードされている箇所があります。
            実行時にご自身のGEEプロジェクトIDに置き換えてください。
          </Tip>
        </Step>

        <Step num={3} title="対象地域の定義">
          <p>
            Notebook 2では、解析対象地域をGeoJSON形式で指定します。
            QGIS等で対象地域のポリゴンを作成し、GeoJSONとしてエクスポートしてください。
          </p>
        </Step>
      </Section>

      {/* ===== Notebook 1 ===== */}
      <Section title="Notebook 1: GCMs Selection（GCM精度評価）">
        <p className="mb-4 text-sm text-muted">
          CMIP6の複数のGCMモデルの中から、対象地域で精度の高いモデルを選定します。
          ERA5再解析データ（1986〜2006年）をリファレンスとして、
          各GCMヒストリカルランとの相関係数とRMSEを計算します。
        </p>

        <Step num={1} title="入力データ">
          <ul className="ml-4 list-disc space-y-1">
            <li>ERA5-Land降水量（観測リファレンス）</li>
            <li>NASA GDDP-CMIP6 Historical（各GCMモデル）</li>
            <li>対象地域ポリゴン</li>
          </ul>
        </Step>

        <Step num={2} title="処理内容">
          <p>
            Earth Engine上で各GCMデータをERA5の0.25度グリッドにリサンプリングし、
            月次降水量の時系列を取得。対象地域内の全ピクセルについて相関係数とRMSEを計算します。
          </p>
        </Step>

        <Step num={3} title="出力">
          <p>
            <code className="rounded bg-[#f3f4f6] px-1 text-xs dark:bg-[#334155]">GCMs_Evaluation.csv</code>
            — 各モデルの精度指標（相関係数、RMSE）が表形式で出力されます。
          </p>
          <Tip>
            相関係数が高くRMSEが低いモデルを次のステップ（Notebook 2）で使用します。
            一般的には複数モデルのアンサンブル平均を使うのが推奨されます。
          </Tip>
        </Step>
      </Section>

      {/* ===== Notebook 2 ===== */}
      <Section title="Notebook 2: Data Download（GCMデータ取得）">
        <p className="mb-4 text-sm text-muted">
          NASA NEX-GDDP-CMIP6のデータをS3から直接ダウンロードし、
          対象地域のグリッドセルごとに時系列CSVに整理します。
        </p>

        <Step num={1} title="対象期間とシナリオ">
          <ul className="ml-4 list-disc space-y-1">
            <li><strong className="text-foreground">Historical</strong>: 1950〜2014年</li>
            <li><strong className="text-foreground">Future</strong>: 2015〜2100年（SSP2-4.5, SSP5-8.5等）</li>
          </ul>
        </Step>

        <Step num={2} title="グリッド作成">
          <p>
            GCMの0.25度解像度に合わせて対象地域内のグリッドセルを自動生成。
            各セルにIDを付与してSHP形式で保存します。
          </p>
        </Step>

        <Step num={3} title="データダウンロード">
          <p>
            各GCMモデル × シナリオ × 変数（降水量・気温等）について、
            AWS S3からNetCDFファイルをダウンロードし、
            グリッドセルごとに抽出してCSVに保存します。
          </p>
          <Tip>
            29モデルすべてをダウンロードすると時間・容量が膨大になります。
            Notebook 1で選定した上位モデルのみに絞ることを推奨します。
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
          JAXA GSMaP（Global Satellite Mapping of Precipitation）の衛星降水データを
          Earth Engine経由で取得し、GCMグリッドに合わせて整理します。
        </p>

        <Step num={1} title="GSMaPデータの取得">
          <p>
            Earth Engineの <code className="rounded bg-[#f3f4f6] px-1 text-xs dark:bg-[#334155]">JAXA/GPM_L3/GSMaP/v8/operational</code>
            から日別降水量を取得。GCMグリッドの中心点でサンプリングします。
          </p>
        </Step>

        <Step num={2} title="出力">
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
          により、GCMの分布を観測の分布に合わせます。
        </p>

        <Step num={1} title="補正手法の概要">
          <p>
            各月ごとに、GCMヒストリカルとGSMaP観測の日別降水量を昇順にソートし、
            同じ順位の値の比率（補正係数）を計算します。
            この係数を将来シナリオのGCMデータに適用することで、
            将来予測値をバイアス補正します。
          </p>
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

        <Step num={3} title="ゼロ日処理">
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

      {/* ===== ワークフロー ===== */}
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

      {/* ===== 注意点 ===== */}
      <Section title="実行上の注意点">
        <ul className="ml-4 list-disc space-y-2 text-sm text-muted">
          <li>
            <strong className="text-foreground">実行環境</strong>:
            Google Colab推奨。ローカル実行の場合は
            <code className="rounded bg-[#f3f4f6] px-1 text-xs dark:bg-[#334155]">/content/</code>
            のパスをローカルパスに変更してください。
          </li>
          <li>
            <strong className="text-foreground">GEEプロジェクトID</strong>:
            Notebook 1, 3 のハードコード部分（
            <code className="rounded bg-[#f3f4f6] px-1 text-xs dark:bg-[#334155]">ee-kurihara-yt</code>
            ）をご自身のIDに置き換えてください。
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
                ["NASA NEX-GDDP-CMIP6", "0.25°", "GCM ヒストリカル・将来シナリオ降水量"],
                ["ERA5-Land", "0.1°", "GCMモデル精度評価のリファレンス"],
                ["JAXA GSMaP v8", "0.1°", "衛星観測降水量（補正リファレンス）"],
                ["地上観測雨量計", "地点", "地上観測降水量（補正リファレンス、Notebook 4b）"],
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

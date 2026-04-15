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
          GCM Downscaling Tool (ver.0)
        </p>
        <p className="mt-1 text-xs text-muted">
          オリエンタルコンサルタンツグローバル プランニング事業部
        </p>
      </header>

      {/* ===== 本ツールの位置づけ ===== */}
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
        <p className="text-sm text-muted">
          プロジェクトではこの結果を用いて、100年確率洪水の流量が気候変動で
          <strong className="text-foreground">56%増加</strong>、
          浸水面積が<strong className="text-foreground">65%増加</strong>
          することを示しました。
        </p>
      </Section>

      {/* ===== ツールのダウンロード ===== */}
      <Section title="ツールのダウンロード">
        <p className="mb-3 text-sm text-muted">
          以下のボタンから修正版ノートブックをダウンロードできます。
          ハードコードされた個人情報（GEEプロジェクトID、Colabパス）を環境変数化し、
          非推奨APIの修正やファイル名のスペル修正を行った改良版です。
        </p>

        <div className="mb-4 flex flex-wrap gap-3">
          <a
            href={`${BP}/notebooks/gcm-downscaling.zip`}
            download
            className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            全ノートブックをZIPでダウンロード (166 KB)
          </a>
        </div>

        <p className="mb-2 text-xs font-medium text-foreground">個別ダウンロード:</p>
        <div className="flex flex-wrap gap-2">
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
              className="rounded border border-accent px-3 py-1.5 text-xs text-accent hover:bg-accent-light"
            >
              {f}
            </a>
          ))}
        </div>

      </Section>

      {/* ===== セットアップ ===== */}
      <Section title="ツールセットアップ">
        <Step num={1} title="ノートブックをGoogle Driveに保存">
          <p>
            上記ボタンからダウンロードした5つのJupyter Notebook
            （<code className="rounded bg-[#f3f4f6] px-1 text-xs dark:bg-[#334155]">.ipynb</code>ファイル）を、
            ご自身のGoogle アカウントのGoogle Driveに保存します。
          </p>
          <Tip>
            DriveのMyDrive直下に専用フォルダ（例: <code>Downscaling</code>）を作成して
            その中に5ファイルを配置することを推奨します。
          </Tip>
        </Step>

        <Step num={2} title="Google Colaboratoryをインストール">
          <p>
            ファイルを右クリック →「アプリで開く」→「アプリを追加」→
            検索ボックスに「Colaboratory」と入力し、インストールします。
            一度インストールすれば次回以降は不要です。
          </p>
        </Step>

        <Step num={3} title="Colabでノートブックを開く">
          <p>
            Google Driveで <code className="rounded bg-[#f3f4f6] px-1 text-xs dark:bg-[#334155]">1_GCMsSelection.ipynb</code>
            をダブルクリックすると、Colaboratoryで開きます。
            コードエディタ画面が表示されれば成功です。
          </p>
        </Step>

        <Step num={4} title="環境変数の設定">
          <p>
            各ノートブックの冒頭にある環境設定セルで、
            <code className="rounded bg-[#f3f4f6] px-1 text-xs dark:bg-[#334155]">GEE_PROJECT</code>
            と<code className="rounded bg-[#f3f4f6] px-1 text-xs dark:bg-[#334155]">OUTPUT_DIR</code>
            を設定します。
          </p>
          <pre className="my-2 overflow-x-auto rounded-md bg-[#1e293b] p-3 text-xs text-[#e2e8f0]">
{`import os
os.environ['GEE_PROJECT'] = 'your-ee-project-id'
os.environ['OUTPUT_DIR'] = '/content/drive/MyDrive/Downscaling'`}
          </pre>
          <Tip>
            <code>GEE_PROJECT</code>は、Earth Engineに登録したプロジェクトIDです。
            <a
              href="https://console.cloud.google.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent underline"
            >
              Google Cloud Console
            </a>
            の「プロジェクトの選択」から確認できます。
          </Tip>
        </Step>

        <Step num={5} title="すべてのセルを実行">
          <p>
            「ランタイム」→「すべてのセルを実行」をクリックします。
            Googleアカウントでの認証が求められれば、ログインして認証してください。
          </p>
        </Step>

        <Step num={6} title="GCP権限エラーの対処">
          <p>
            STEP2以降のセルが実行されない場合、GCPの権限設定が必要な可能性があります:
          </p>
          <ol className="ml-4 mt-1 list-decimal space-y-1">
            <li>GEEに登録したGoogleアカウントから「Google Cloud Console」を開く</li>
            <li>「IAMと管理」→「IAM」を選択</li>
            <li>「フィルタ」の右端の編集マークをクリック</li>
            <li>「ロールを選択」から「オーナー」を選択</li>
            <li>「新しいプリンシパル」欄に個人のGoogleアカウントアドレスを入力</li>
            <li>ロールが「オーナー」になっていればOK</li>
          </ol>
        </Step>
      </Section>

      {/* ===== Notebook 1 ===== */}
      <Section title="1. GCMsSelection — GCM精度評価">
        <p className="mb-4 text-sm text-muted">
          対象地域の観測データとCMIP6の各GCMを、メッシュ単位で比較してGCMの精度評価を行います。
          <strong className="text-foreground">34モデル × 5指標 × 2評価方法 = 340の計算結果</strong>
          を算出し、総合スコアの高いモデルを後段で使用します。
        </p>

        <h3 className="mb-2 mt-4 font-semibold text-foreground">評価対象の気象指標（5種類）</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr>
                <th className="border border-border bg-[#1e3a5f] px-3 py-2 text-left text-white">変数名</th>
                <th className="border border-border bg-[#1e3a5f] px-3 py-2 text-left text-white">意味</th>
                <th className="border border-border bg-[#1e3a5f] px-3 py-2 text-left text-white">観測リファレンス</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-3 py-2 font-medium"><code>pr</code></td>
                <td className="border border-border px-3 py-2">降雨量</td>
                <td className="border border-border px-3 py-2 text-muted">GSMaP</td>
              </tr>
              <tr className="bg-[#f0f4f8] dark:bg-[#1e293b]">
                <td className="border border-border px-3 py-2 font-medium"><code>tas</code></td>
                <td className="border border-border px-3 py-2">地表の気温</td>
                <td className="border border-border px-3 py-2 text-muted">ERA5</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2 font-medium"><code>rlds</code></td>
                <td className="border border-border px-3 py-2">長波放射</td>
                <td className="border border-border px-3 py-2 text-muted">ERA5</td>
              </tr>
              <tr className="bg-[#f0f4f8] dark:bg-[#1e293b]">
                <td className="border border-border px-3 py-2 font-medium"><code>rsds</code></td>
                <td className="border border-border px-3 py-2">短波放射</td>
                <td className="border border-border px-3 py-2 text-muted">ERA5</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2 font-medium"><code>sfcWind</code></td>
                <td className="border border-border px-3 py-2">平均風速</td>
                <td className="border border-border px-3 py-2 text-muted">ERA5</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="mb-2 mt-5 font-semibold text-foreground">評価指標（2種類）</h3>
        <ul className="ml-4 list-disc space-y-1 text-sm text-muted">
          <li><strong className="text-foreground">空間相関係数 (corr)</strong>: 1に近いほど強い正の相関</li>
          <li><strong className="text-foreground">平均二乗誤差 (rmse)</strong>: 値が小さいほど正確</li>
        </ul>

        <h3 className="mb-2 mt-5 font-semibold text-foreground">スコアリング方式</h3>
        <p className="text-sm text-muted">
          全モデルの平均より良い評価だった場合は
          <strong className="text-foreground">+1点</strong>、
          悪い評価だった場合は<strong className="text-foreground">0点</strong>を加算し、
          全指標の評価の合計得点を算出します。最大スコアは10点（5指標 × 2評価）。
        </p>

        <h3 className="mb-2 mt-5 font-semibold text-foreground">実行手順</h3>

        <Step num={1} title="解析範囲（AOI）を設定">
          <p>
            STEP2セル内の <code className="rounded bg-[#f3f4f6] px-1 text-xs dark:bg-[#334155]">region</code> を編集します:
          </p>
          <pre className="my-2 overflow-x-auto rounded-md bg-[#1e293b] p-3 text-xs text-[#e2e8f0]">
{`region = ee.Geometry.Rectangle([経度1, 緯度1, 経度2, 緯度2])`}
          </pre>
          <Tip>
            AOIの目安は一辺 <strong className="text-foreground">2.5°程度</strong>。
            1メッシュ = 0.25°なので、縦10 × 横10メッシュ程度が収まる範囲にします。
            本GCMは陸域データのみのため、AOIはなるべく陸域を多く含むよう設定してください。
          </Tip>
        </Step>

        <Step num={2} title="評価変数を確認">
          <p>
            デフォルトでは5変数すべてを評価します:
          </p>
          <pre className="my-2 overflow-x-auto rounded-md bg-[#1e293b] p-3 text-xs text-[#e2e8f0]">
{`variables = ['pr', 'tas', 'rlds', 'rsds', 'sfcWind']`}
          </pre>
          <Tip>
            出力結果の相関係数を確認し、相関が負の指標は
            <strong className="text-foreground">評価対象から除外（重み0）</strong>
            することを推奨します。
            これは、その要素の元データがどのGCMでも観測値と一致しないことを意味するためです。
          </Tip>
        </Step>

        <Step num={3} title="STEP3-STEP5 を順に実行">
          <ul className="ml-4 list-disc space-y-1">
            <li><strong className="text-foreground">STEP3</strong>: 観測データ読み込み（雨量=GSMaP、その他=ERA5）</li>
            <li><strong className="text-foreground">STEP4</strong>: CMIP6からGCMモデルリストを読み込み</li>
            <li><strong className="text-foreground">STEP5</strong>: Region boundary設定（AOIが自動指定される）</li>
          </ul>
        </Step>

        <Step num={4} title="解析を実行（STEP6）">
          <p>
            34モデルすべてについて、5指標 × 2評価（corr, rmse）= 10項目を計算します。
            結果はExcelファイル（CSV）に出力されます。
          </p>
        </Step>

        <Step num={5} title="モデル選定">
          <p>
            出力されたCSVで以下のような式でスコアを集計します:
          </p>
          <pre className="my-2 overflow-x-auto rounded-md bg-[#1e293b] p-3 text-xs text-[#e2e8f0]">
{`Corr のスコア: =IF(B2>AVERAGE(B$2:B$35), 2, 0)
Rmse のスコア: =IF(C2<AVERAGE(C$2:C$35), 2, 0)`}
          </pre>
          <p className="mt-2">
            合計スコアを<strong className="text-foreground">Total列</strong>に表示し、
            上位モデルを選定します。
          </p>
          <Tip>
            降雨の精度（<code>pr_corr</code>、<code>pr_rmse</code>）が特に重要。
            スコアが並んだ場合は降雨の点数が高いモデルを選ぶと良いでしょう。
            カガヤンバレー地域の事例では、スコア9以上の3モデル
            （<strong className="text-foreground">ACCESS-CM2</strong>、
            <strong className="text-foreground">CanESM5</strong>、
            <strong className="text-foreground">EC-Earth3-Veg-LR</strong>）が選定されました。
          </Tip>
        </Step>
      </Section>

      {/* ===== Notebook 2 ===== */}
      <Section title="2. DataDownload — GCMデータ取得">
        <p className="mb-4 text-sm text-muted">
          NASA NEX-GDDP-CMIP6のGCMデータをAWS S3から取得し、
          グリッドセルごとの時系列CSVに整理します。
        </p>

        <Step num={1} title="対象GCMモデルをチェックボックスで選択">
          <p>
            セル2の <code className="rounded bg-[#f3f4f6] px-1 text-xs dark:bg-[#334155]">MODEL_CFG</code>
            には全34モデルが登録されています。セルを実行すると、各モデルのチェックボックスが
            3列で表示されます。
          </p>
          <p className="mt-2">
            プリセットボタン:
          </p>
          <ul className="ml-4 mt-1 list-disc space-y-1">
            <li>
              <strong className="text-foreground">Default (3 models)</strong>:
              Notebook 1で精度が高かった3モデル（ACCESS-CM2、CanESM5、EC-Earth3-Veg-LR）をチェック
            </li>
            <li>
              <strong className="text-foreground">Select All</strong>: 全34モデルをチェック
            </li>
            <li>
              <strong className="text-foreground">Clear All</strong>: チェックをクリア
            </li>
          </ul>
          <p className="mt-2">
            チェック後、<strong className="text-foreground">「Run」ボタン</strong>
            を押すと次のセルに進みます。
            Run all（すべてのセルを実行）で起動した場合でも、
            このセルはRunボタンが押されるまで実行を一時停止します。
          </p>
          <Tip>
            5つ以下のモデルに絞ることを推奨します。多すぎるとダウンロード時間・容量が膨大になります。
          </Tip>
        </Step>

        <Step num={2} title="期間レンジを設定">
          <p>
            現在所有している観測データ（GSMaPや地上観測）の期間に合わせて、
            ヒストリカル期間を設定します。
          </p>
        </Step>

        <Step num={3} title="将来シナリオを選択（SSP）">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-xs">
              <thead>
                <tr>
                  <th className="border border-border bg-[#1e3a5f] px-3 py-2 text-left text-white">シナリオ</th>
                  <th className="border border-border bg-[#1e3a5f] px-3 py-2 text-left text-white">意味</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-border px-3 py-2 font-medium">SSP1-2.6</td>
                  <td className="border border-border px-3 py-2 text-muted">持続可能（低排出）</td>
                </tr>
                <tr className="bg-[#f0f4f8] dark:bg-[#1e293b]">
                  <td className="border border-border px-3 py-2 font-medium">SSP2-4.5</td>
                  <td className="border border-border px-3 py-2 text-muted">中間的（中排出）</td>
                </tr>
                <tr>
                  <td className="border border-border px-3 py-2 font-medium">SSP3-7.0</td>
                  <td className="border border-border px-3 py-2 text-muted">地域的対立（中〜高排出）</td>
                </tr>
                <tr className="bg-[#f0f4f8] dark:bg-[#1e293b]">
                  <td className="border border-border px-3 py-2 font-medium">SSP5-8.5</td>
                  <td className="border border-border px-3 py-2 text-muted">化石燃料依存（高排出）</td>
                </tr>
              </tbody>
            </table>
          </div>
          <Tip>
            SSPは将来の温室効果ガス排出量や地球温暖化の度合いを示す経路で、
            社会経済経路と放射強制力を組み合わせたものです。
          </Tip>
        </Step>

        <Step num={4} title="流域ポリゴンを読み込み">
          <p>
            QGIS等で作成した対象流域のGeoJsonファイルをColabのランタイムにアップロードし、
            コードから読み込みます。
          </p>
        </Step>

        <Step num={5} title="実行">
          <p>
            セルを順に実行すると、GCMデータがS3からダウンロードされ、
            グリッドセルごとのCSVファイルが生成されます。
          </p>
        </Step>
      </Section>

      {/* ===== Notebook 3 ===== */}
      <Section title="3. GSMaPDownload — 観測データ取得">
        <p className="mb-4 text-sm text-muted">
          JAXA GSMaP v8（Global Satellite Mapping of Precipitation）の衛星降水データを
          Earth Engine経由で取得します。
          Notebook 2で作成したGCMグリッドの各中心点でサンプリングし、
          日別降水量時系列をCSV化します。
        </p>

        <Step num={1} title="GCMグリッド中心点をGEE Assetにアップロード">
          <p>
            Notebook 2で生成されたGCMグリッド中心点のShapefile
            （<code className="rounded bg-[#f3f4f6] px-1 text-xs dark:bg-[#334155]">gcm_grid_centroid.shp</code>）を、
            GEEの「Assets」→「New」→「Shape files」からアップロードします。
          </p>
          <ol className="ml-4 mt-1 list-decimal space-y-1">
            <li>Assetsタブの <strong className="text-foreground">New</strong> ボタン → <strong className="text-foreground">Shape files</strong></li>
            <li><strong className="text-foreground">Select</strong>ボタンで<code>gcm_grid_centroid</code>の全ファイル（.shp, .shx, .dbf, .prj）を選択</li>
            <li><strong className="text-foreground">UPLOAD</strong>をクリックし、Google Cloudにアップロード</li>
          </ol>
        </Step>

        <Step num={2} title="Asset IDをコードに反映">
          <p>
            Taskタブでアップロード完了を確認後、Asset名をコピーし、
            ノートブック内の該当箇所に貼り付けます。
          </p>
        </Step>

        <Step num={3} title="GSMaPデータ取得を実行">
          <p>
            Earth Engineの
            <code className="rounded bg-[#f3f4f6] px-1 text-xs dark:bg-[#334155]">JAXA/GPM_L3/GSMaP/v8/operational</code>
            から日別降水量を取得し、各GCMグリッド中心点でサンプリングします。
          </p>
          <Tip>
            GSMaPは2000年3月以降のデータのみ利用可能です。
            ヒストリカル補正期間もこれに合わせてください。
          </Tip>
        </Step>
      </Section>

      {/* ===== Notebook 4 ===== */}
      <Section title="4. Downscaling — バイアス補正">
        <p className="mb-4 text-sm text-muted">
          観測データ（Notebook 3のGSMaP、または地上観測）を用いて、
          <strong className="text-foreground">順序統計量補正法（Quantile Mapping）</strong>
          でGCMのバイアスを補正します。
          用途に応じて <code>4a_Downscaling_GSMaP.ipynb</code> または
          <code>4b_Downscaling_Observation.ipynb</code> を使い分けます。
        </p>

        <Step num={1} title="ファイルのアップロード">
          <p>
            Colab左パネルの「ファイル」タブで、新しいフォルダ
            <code className="rounded bg-[#f3f4f6] px-1 text-xs dark:bg-[#334155]">content</code> を作成し、
            その中に Notebook 2 の出力である
            <code className="rounded bg-[#f3f4f6] px-1 text-xs dark:bg-[#334155]">future_ssp_csvs</code> フォルダの中身をコピーします。
          </p>
        </Step>

        <Step num={2} title="補正手法の概要">
          <p>
            各月ごとに、GCMヒストリカルと観測の日別降水量を昇順にソートし、
            同じ順位の値の比率を補正係数として算出します。
          </p>
          <pre className="my-2 overflow-x-auto rounded-md bg-[#1e293b] p-3 text-xs text-[#e2e8f0]">
{`補正係数(順位i) = 観測(順位i) / GCMヒストリカル(順位i)
補正後GCM(値x) = GCM(値x) × 補正係数(xの順位)`}
          </pre>
        </Step>

        <Step num={3} title="補正係数の二重構造">
          <ul className="ml-4 list-disc space-y-1">
            <li><strong className="text-foreground">df_corr1</strong>: 全期間の補正係数（上位10%の極端降水に適用）</li>
            <li><strong className="text-foreground">df_corr2</strong>: 月別の補正係数（下位90%の平常降水に適用）</li>
          </ul>
          <p className="mt-2">
            極端降水と平常降水を別々の係数で補正することで、
            極値の再現性を保ちながら日常的な降水パターンも正しく補正できます。
          </p>
        </Step>

        <Step num={4} title="ゼロ日処理（drizzle problem対策）">
          <p>
            観測で降水ゼロの日数をカウントし、
            GCMの降水量分布の下位を観測ゼロ日数分だけゼロにリセットします。
            これにより、GCMが過剰に小雨を予測する問題（drizzle problem）を解消します。
          </p>
        </Step>

        <Step num={5} title="実行と結果確認">
          <p>
            セルを順に実行すると、補正後のCSVが
            <code className="rounded bg-[#f3f4f6] px-1 text-xs dark:bg-[#334155]">OUTPUT_DIR</code> に出力されます。
            最後のセル「上位10%描画」で補正前後の上位10%降水の比較プロットが表示されます。
          </p>
          <ul className="ml-4 mt-1 list-disc space-y-1">
            <li><code className="rounded bg-[#f3f4f6] px-1 text-xs dark:bg-[#334155]">his_id_*_corrected.csv</code> — 補正後ヒストリカル時系列</li>
            <li><code className="rounded bg-[#f3f4f6] px-1 text-xs dark:bg-[#334155]">fut_ssp*_id_*_corrected.csv</code> — 補正後将来シナリオ時系列</li>
          </ul>
        </Step>

        <h3 className="mt-5 mb-2 font-semibold text-foreground">4a vs 4b の使い分け</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr>
                <th className="border border-border bg-[#1e3a5f] px-3 py-2 text-left text-white">ノートブック</th>
                <th className="border border-border bg-[#1e3a5f] px-3 py-2 text-left text-white">観測ソース</th>
                <th className="border border-border bg-[#1e3a5f] px-3 py-2 text-left text-white">特徴</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-3 py-2 font-medium">4a (GSMaP)</td>
                <td className="border border-border px-3 py-2 text-muted">JAXA GSMaP v8</td>
                <td className="border border-border px-3 py-2 text-muted">全球カバー、2000年以降のみ</td>
              </tr>
              <tr className="bg-[#f0f4f8] dark:bg-[#1e293b]">
                <td className="border border-border px-3 py-2 font-medium">4b (Observation)</td>
                <td className="border border-border px-3 py-2 text-muted">地上観測雨量計</td>
                <td className="border border-border px-3 py-2 text-muted">高精度、複数SSP一括処理対応</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      {/* ===== 推奨ワークフロー ===== */}
      <Section title="推奨ワークフロー">
        <ol className="ml-4 list-decimal space-y-2 text-sm text-muted">
          <li>
            <strong className="text-foreground">Notebook 1</strong> で対象地域に適したGCMモデルを選定（3〜5モデル）
          </li>
          <li>
            <strong className="text-foreground">Notebook 2</strong> で選定モデルのヒストリカル・将来データをダウンロード
          </li>
          <li>
            観測データの種類に応じて：
            <ul className="ml-4 mt-1 list-disc space-y-1">
              <li><strong className="text-foreground">衛星観測のみ</strong>: Notebook 3 → Notebook 4a</li>
              <li><strong className="text-foreground">地上観測あり</strong>: Notebook 4b（より高精度、推奨）</li>
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
            Google Colab推奨。ローカル実行の場合は
            <code className="rounded bg-[#f3f4f6] px-1 text-xs dark:bg-[#334155]">OUTPUT_DIR</code>
            をローカルパスに設定してください。
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
            2000年3月以降のデータのみ。ヒストリカル補正期間もこれに合わせる必要があります。
          </li>
          <li>
            <strong className="text-foreground">定常性の仮定</strong>:
            順序統計量補正は、過去の観測とGCMヒストリカルの関係が将来も成立する
            （定常性）と仮定しています。気候変動で降水パターンが非線形に変化する場合、
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
                ["CMIP6 Full Collection", "〜1°", "34モデル精度評価"],
                ["ERA5-Land", "0.1°", "気温・放射・風速のリファレンス"],
                ["JAXA GSMaP v8 MVK", "0.1°", "降雨観測のリファレンス"],
                ["地上観測雨量計（PAGASA等）", "地点", "地上観測降水量（Notebook 4b）"],
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

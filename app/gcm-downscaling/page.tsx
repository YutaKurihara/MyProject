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
        <p className="text-sm text-muted">
          本ツールは、
          <strong className="text-foreground">
            「フィリピン・カガヤンバレー地域における気候変動と土地利用の変化を考慮した将来の洪水リスク評価のためのAIと統計の統合フレームワーク」
          </strong>
          （第11期マイプロジェクト）の一部として開発されたものです。
          将来の洪水リスク評価を行うためには、GCM（全球気候モデル）の降水量データを
          対象地域のスケールに合わせてダウンスケーリングし、バイアスを補正する必要があります。
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
      <Section title="1. GCMsSelection.ipynb — GCM精度評価">
        <h3 className="mb-3 rounded bg-accent px-3 py-1.5 text-sm font-bold text-white">■ 説明</h3>
        <p className="mb-4 text-sm text-muted">
          対象地域の観測データとCMIP6の各GCMを、メッシュ単位で比較してGCMの精度評価を行います。
          <strong className="text-foreground">34モデル × 5指標 × 2評価方法 = 340の計算結果</strong>
          を算出し、総合スコアの高いモデルを後段で使用します。
        </p>

        <h4 className="mb-2 mt-4 font-semibold text-foreground">評価対象の気象指標（5種類）</h4>
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

        <h4 className="mb-2 mt-5 font-semibold text-foreground">評価指標（2種類）</h4>
        <ul className="ml-4 list-disc space-y-1 text-sm text-muted">
          <li><strong className="text-foreground">空間相関係数 (corr)</strong>: 1に近いほど強い正の相関</li>
          <li><strong className="text-foreground">平均二乗誤差 (rmse)</strong>: 値が小さいほど正確</li>
        </ul>

        <h4 className="mb-2 mt-5 font-semibold text-foreground">スコアリング方式</h4>
        <p className="text-sm text-muted">
          全モデルの平均より良い評価だった場合は
          <strong className="text-foreground">+1点</strong>、
          悪い評価だった場合は<strong className="text-foreground">0点</strong>を加算し、
          全指標の評価の合計得点を算出します。最大スコアは10点（5指標 × 2評価）。
        </p>

        <h4 className="mb-2 mt-5 font-semibold text-foreground">セル別処理</h4>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr>
                <th className="border border-border bg-[#1e3a5f] px-3 py-2 text-left text-white">Cell</th>
                <th className="border border-border bg-[#1e3a5f] px-3 py-2 text-left text-white">処理内容</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-3 py-2 font-medium">Cell 1 (環境設定)</td>
                <td className="border border-border px-3 py-2 text-muted">
                  <code>GEE_PROJECT</code> と <code>OUTPUT_DIR</code> を環境変数から読み込み
                </td>
              </tr>
              <tr className="bg-[#f0f4f8] dark:bg-[#1e293b]">
                <td className="border border-border px-3 py-2 font-medium">Cell 2 (STEP 1)</td>
                <td className="border border-border px-3 py-2 text-muted">
                  Earth Engine認証・初期化、ライブラリimport
                </td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2 font-medium">Cell 3 (STEP 2)</td>
                <td className="border border-border px-3 py-2 text-muted">
                  <strong className="text-foreground">パラメータ設定</strong>（
                  <code>region</code>=解析範囲、<code>start_date</code>/<code>end_date</code>=評価期間、<code>variables</code>=評価変数）
                </td>
              </tr>
              <tr className="bg-[#f0f4f8] dark:bg-[#1e293b]">
                <td className="border border-border px-3 py-2 font-medium">Cell 4 (STEP 3)</td>
                <td className="border border-border px-3 py-2 text-muted">
                  観測データ読み込み（降雨=GSMaPまたはERA5、その他=ERA5）を5変数ぶん <code>obs_dict</code> に格納
                </td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2 font-medium">Cell 5 (STEP 4)</td>
                <td className="border border-border px-3 py-2 text-muted">
                  <code>NASA/GDDP-CMIP6</code> からGCMモデル一覧を自動取得
                </td>
              </tr>
              <tr className="bg-[#f0f4f8] dark:bg-[#1e293b]">
                <td className="border border-border px-3 py-2 font-medium">Cell 6 (STEP 6)</td>
                <td className="border border-border px-3 py-2 text-muted">
                  各モデル × 各変数について <code>region</code> 内をGCM投影にリサンプリングし、空間的な相関係数とRMSEを計算
                </td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2 font-medium">Cell 7 (STEP 7)</td>
                <td className="border border-border px-3 py-2 text-muted">
                  <code>GCMs_Evaluation.csv</code> を生成してダウンロード
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <h4 className="mb-2 mt-5 font-semibold text-foreground">変更するとよい箇所</h4>
        <ul className="ml-4 list-disc space-y-2 text-sm text-muted">
          <li>
            <strong className="text-foreground">対象地域を変える</strong> → Cell 3 の
            <code>region = ee.Geometry.Rectangle([lon1, lat1, lon2, lat2])</code>
            を書き換える。AOIの目安は一辺 2.5°（10×10セル）程度。
          </li>
          <li>
            <strong className="text-foreground">評価期間を変える</strong> → Cell 3 の
            <code>start_date</code> / <code>end_date</code> を変更。20年程度の期間を推奨。
          </li>
          <li>
            <strong className="text-foreground">評価変数を減らす/増やす</strong> → Cell 3 の
            <code>variables</code> リストを編集（例: 降雨のみ評価する場合は <code>[&apos;pr&apos;]</code>）。
          </li>
          <li>
            <strong className="text-foreground">降雨の観測リファレンスをGSMaPに切替</strong> →
            Cell 4 の冒頭のGSMaPコードのコメントアウトを外し、ERA5の <code>OBS_pr</code> をコメントアウト。
          </li>
        </ul>

        <h3 className="mb-3 mt-8 rounded bg-accent px-3 py-1.5 text-sm font-bold text-white">■ 操作手順</h3>

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
      <Section title="2. DataDownload.ipynb — GCMデータ取得">
        <h3 className="mb-3 rounded bg-accent px-3 py-1.5 text-sm font-bold text-white">■ 説明</h3>
        <p className="mb-4 text-sm text-muted">
          選定モデルのヒストリカル・将来シナリオデータを NASA NEX-GDDP-CMIP6 の AWS S3 から取得し、
          対象地域のGCMグリッドセルごとの時系列CSVにまとめます。
        </p>

        <h4 className="mb-2 mt-4 font-semibold text-foreground">セル別処理</h4>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr>
                <th className="border border-border bg-[#1e3a5f] px-3 py-2 text-left text-white">Cell</th>
                <th className="border border-border bg-[#1e3a5f] px-3 py-2 text-left text-white">処理内容</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-3 py-2 font-medium">Cell 1-2</td>
                <td className="border border-border px-3 py-2 text-muted">環境設定 + ライブラリインストール</td>
              </tr>
              <tr className="bg-[#f0f4f8] dark:bg-[#1e293b]">
                <td className="border border-border px-3 py-2 font-medium">Cell 3</td>
                <td className="border border-border px-3 py-2 text-muted">
                  <strong className="text-foreground">GCMモデル設定</strong> (<code>MODEL_CFG</code>)
                  — デフォルト3モデル、他31モデルはコメントアウト
                </td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2 font-medium">Cell 4</td>
                <td className="border border-border px-3 py-2 text-muted">
                  GeoJSONアップロードで対象地域ポリゴンを読み込み
                </td>
              </tr>
              <tr className="bg-[#f0f4f8] dark:bg-[#1e293b]">
                <td className="border border-border px-3 py-2 font-medium">Cell 5</td>
                <td className="border border-border px-3 py-2 text-muted">
                  GCMグリッド生成（ACCESS-CM2 2000年のNCを参照して0.25°メッシュを作成）→ポリゴン内部のセルを抽出
                </td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2 font-medium">Cell 6</td>
                <td className="border border-border px-3 py-2 text-muted">
                  <code>fetch_model_data()</code> 関数定義 — 年ごとにS3のNCを開き、各グリッドセルで降水時系列を抽出
                </td>
              </tr>
              <tr className="bg-[#f0f4f8] dark:bg-[#1e293b]">
                <td className="border border-border px-3 py-2 font-medium">Cell 7</td>
                <td className="border border-border px-3 py-2 text-muted">
                  ヒストリカル期間 (<code>historical_years</code>) のダウンロード → <code>his_id_*.csv</code>
                </td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2 font-medium">Cell 8</td>
                <td className="border border-border px-3 py-2 text-muted">
                  SSPシナリオ (<code>ssp_scenarios</code>) × <code>future_years</code> のダウンロード → <code>fut_ssp*_id_*.csv</code>
                </td>
              </tr>
              <tr className="bg-[#f0f4f8] dark:bg-[#1e293b]">
                <td className="border border-border px-3 py-2 font-medium">Cell 9</td>
                <td className="border border-border px-3 py-2 text-muted">
                  時系列CSVを <code>future_ssp_csvs.zip</code> にまとめてダウンロード
                </td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2 font-medium">Cell 10</td>
                <td className="border border-border px-3 py-2 text-muted">
                  グリッドメッシュSHP (<code>gcm_grid_mesh.shp</code>) とセントロイドSHPを <code>gcm_grid_shapefile.zip</code> に
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <h4 className="mb-2 mt-5 font-semibold text-foreground">変更するとよい箇所</h4>
        <ul className="ml-4 list-disc space-y-2 text-sm text-muted">
          <li>
            <strong className="text-foreground">対象地域を変える</strong> → Cell 4 でアップロードするGeoJSONを差し替える
            （QGIS等で対象流域ポリゴンを作成）。グリッドは自動生成されるので他は不要。
          </li>
          <li>
            <strong className="text-foreground">使うGCMを増やす/減らす</strong> → Cell 3 の
            <code>MODEL_CFG</code> 内の該当行のコメントアウトを外す/付ける。
          </li>
          <li>
            <strong className="text-foreground">ヒストリカル期間を変える</strong> → Cell 7 直前で
            <code>historical_years = list(range(1995, 2015))</code> のように定義を編集。
            GSMaPと合わせる場合は2000年以降を推奨。
          </li>
          <li>
            <strong className="text-foreground">将来期間を変える</strong> →
            <code>future_years = list(range(2060, 2081))</code> を編集。
            一般的には20年程度（2041-2060、2061-2080など）を推奨。
          </li>
          <li>
            <strong className="text-foreground">SSPシナリオを変える</strong> →
            <code>ssp_scenarios = [&apos;ssp126&apos;, &apos;ssp245&apos;, &apos;ssp585&apos;]</code> を編集。
            SSP1-2.6（低排出）、SSP2-4.5（中間）、SSP3-7.0（高）、SSP5-8.5（非常に高）から選択。
          </li>
          <li>
            <strong className="text-foreground">取得変数を変える</strong>（降水以外も必要な場合）→
            Cell 6 の <code>fetch_model_data()</code> 内で
            <code>/pr/</code> を <code>/tas/</code> や <code>/tasmax/</code> に置き換える。
            単位変換（ <code>ds[&quot;pr&quot;] * 86400</code>）も変更する。
          </li>
        </ul>

        <h3 className="mb-3 mt-8 rounded bg-accent px-3 py-1.5 text-sm font-bold text-white">■ 操作手順</h3>

        <Step num={1} title="対象GCMモデルを選択">
          <p>
            セル2の <code className="rounded bg-[#f3f4f6] px-1 text-xs dark:bg-[#334155]">MODEL_CFG</code>
            で、使用するモデルのコメントアウトを外します。
            デフォルトではNotebook 1で精度が高かった3モデル
            （ACCESS-CM2、CanESM5、EC-Earth3-Veg-LR）が有効になっています。
          </p>
          <pre className="my-2 overflow-x-auto rounded-md bg-[#1e293b] p-3 text-xs text-[#e2e8f0]">
{`MODEL_CFG = {
    # === Default: Top 3 models from 1_GCMsSelection ===
    "ACCESS-CM2": ("r1i1p1f1", "gn"),
    "CanESM5": ("r1i1p1f1", "gn"),
    "EC-Earth3-Veg-LR": ("r1i1p1f1", "gr"),

    # === Other available models (uncomment to use) ===
    # "ACCESS-ESM1-5": ("r1i1p1f1", "gn"),
    # "BCC-CSM2-MR": ("r1i1p1f1", "gn"),
    # ...
}`}
          </pre>
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
      <Section title="3. GSMaPDownload.ipynb — 衛星降水観測データ取得">
        <h3 className="mb-3 rounded bg-accent px-3 py-1.5 text-sm font-bold text-white">■ 説明</h3>
        <p className="mb-4 text-sm text-muted">
          JAXA GSMaP v8（Global Satellite Mapping of Precipitation）の衛星降水データを
          Earth Engine経由で取得します。
          Notebook 2で作成したGCMグリッドの各中心点でサンプリングし、
          日別降水量時系列をCSV化します。
        </p>

        <h4 className="mb-2 mt-4 font-semibold text-foreground">セル別処理</h4>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr>
                <th className="border border-border bg-[#1e3a5f] px-3 py-2 text-left text-white">Cell</th>
                <th className="border border-border bg-[#1e3a5f] px-3 py-2 text-left text-white">処理内容</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-3 py-2 font-medium">Cell 1-2</td>
                <td className="border border-border px-3 py-2 text-muted">環境設定 + GEE認証</td>
              </tr>
              <tr className="bg-[#f0f4f8] dark:bg-[#1e293b]">
                <td className="border border-border px-3 py-2 font-medium">Cell 3</td>
                <td className="border border-border px-3 py-2 text-muted">
                  <strong className="text-foreground">Earth Engine Assetから</strong>
                  <code>gcm_grid_centroid</code> を読み込み（事前にアップロード必要）
                </td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2 font-medium">Cell 4</td>
                <td className="border border-border px-3 py-2 text-muted">
                  対象年 (<code>years</code>) の設定、GCMの投影情報を取得
                </td>
              </tr>
              <tr className="bg-[#f0f4f8] dark:bg-[#1e293b]">
                <td className="border border-border px-3 py-2 font-medium">Cell 5</td>
                <td className="border border-border px-3 py-2 text-muted">
                  年ごとに日別GSMaP画像を生成（時別 → 日積算、GCM投影にリサンプリング）
                </td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2 font-medium">Cell 6</td>
                <td className="border border-border px-3 py-2 text-muted">
                  全年の画像を1つのImageCollectionに統合
                </td>
              </tr>
              <tr className="bg-[#f0f4f8] dark:bg-[#1e293b]">
                <td className="border border-border px-3 py-2 font-medium">Cell 7</td>
                <td className="border border-border px-3 py-2 text-muted">
                  各グリッドセントロイドで日別値をサンプリング
                </td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2 font-medium">Cell 8</td>
                <td className="border border-border px-3 py-2 text-muted">
                  グリッドIDごとに <code>his_GSMaP_id_*.csv</code> として Google Drive にExport
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <h4 className="mb-2 mt-5 font-semibold text-foreground">変更するとよい箇所</h4>
        <ul className="ml-4 list-disc space-y-2 text-sm text-muted">
          <li>
            <strong className="text-foreground">対象地域（GCMグリッドセントロイド）を変える</strong> →
            Cell 3 の <code>sample_points</code> の Asset IDを、2_DataDownloadで生成された
            <code>gcm_grid_centroid.shp</code> をEarth Engine Assetsにアップロードしたパスに差し替え。
          </li>
          <li>
            <strong className="text-foreground">期間を変える</strong> → Cell 4 の
            <code>years = list(range(2000, 2015))</code> のように編集。
            <strong className="text-foreground">GSMaPは2000年3月以降のみ有効</strong>な点に注意。
          </li>
          <li>
            <strong className="text-foreground">別の衛星降水データを使う</strong> → Cell 5 の
            <code>JAXA/GPM_L3/GSMaP/v8/operational</code> を
            <code>NASA/GPM_L3/IMERG_V07</code> 等に差し替え、バンド名とスケールを調整。
          </li>
        </ul>

        <h3 className="mb-3 mt-8 rounded bg-accent px-3 py-1.5 text-sm font-bold text-white">■ 操作手順</h3>

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

      {/* ===== Notebook 4 Overview ===== */}
      <Section title="4. Downscaling — バイアス補正（概要）">
        <p className="mb-4 text-sm text-muted">
          観測データ（GSMaPまたは地上観測）を用いて、
          <strong className="text-foreground">順序統計量補正法（Quantile Mapping）</strong>
          でGCMの降水量バイアスを補正します。
          用途に応じて <code>4a_Downscaling_GSMaP.ipynb</code> または
          <code>4b_Downscaling_Observation.ipynb</code> を使い分けます。
        </p>

        <h4 className="mb-2 mt-4 font-semibold text-foreground">共通する補正手法の考え方</h4>
        <p className="text-sm text-muted">
          各月ごとに、GCMヒストリカルと観測の日別降水量を昇順にソートし、
          同じ順位の値の比率を補正係数として算出します。
        </p>
        <pre className="my-2 overflow-x-auto rounded-md bg-[#1e293b] p-3 text-xs text-[#e2e8f0]">
{`補正係数(順位i) = 観測(順位i) / GCMヒストリカル(順位i)
補正後GCM(値x) = GCM(値x) × 補正係数(xの順位)`}
        </pre>
        <ul className="mt-3 ml-4 list-disc space-y-1 text-sm text-muted">
          <li>
            <strong className="text-foreground">df_corr1</strong>:
            全期間の補正係数（上位10%の極端降水に適用）
          </li>
          <li>
            <strong className="text-foreground">df_corr2</strong>:
            月別の補正係数（下位90%の平常降水に適用）
          </li>
          <li>
            <strong className="text-foreground">ゼロ日処理</strong>:
            観測の降水ゼロ日数分、GCMの下位をゼロにリセットしdrizzle problemを解消
          </li>
        </ul>

        <h4 className="mb-2 mt-5 font-semibold text-foreground">4a vs 4b の使い分け</h4>
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

      {/* ===== Notebook 4a ===== */}
      <Section title="4a. Downscaling_GSMaP.ipynb — GSMaPによるバイアス補正">
        <h3 className="mb-3 rounded bg-accent px-3 py-1.5 text-sm font-bold text-white">■ 説明</h3>
        <p className="mb-4 text-sm text-muted">
          GSMaPを観測リファレンスとして、GCM降水量を順序統計量補正法（Quantile Mapping）で
          バイアス補正します。全球カバーのため任意地域で実行可能ですが、GSMaPの観測可能期間は
          2000年3月以降に限られます。
        </p>

        <h4 className="mb-2 mt-4 font-semibold text-foreground">セル別処理</h4>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr>
                <th className="border border-border bg-[#1e3a5f] px-3 py-2 text-left text-white">Cell</th>
                <th className="border border-border bg-[#1e3a5f] px-3 py-2 text-left text-white">処理内容</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-3 py-2 font-medium">Cell 1-2</td>
                <td className="border border-border px-3 py-2 text-muted">環境設定 + ライブラリimport</td>
              </tr>
              <tr className="bg-[#f0f4f8] dark:bg-[#1e293b]">
                <td className="border border-border px-3 py-2 font-medium">Cell 3</td>
                <td className="border border-border px-3 py-2 text-muted">
                  <code>compute_correction_factors()</code> — 昇順ソート比率による補正係数算出。
                  <strong className="text-foreground">df_corr1</strong>（全期間ランク）と
                  <strong className="text-foreground">df_corr2</strong>（月別ランク）を計算、ゼロ日閾値も設定
                </td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2 font-medium">Cell 4</td>
                <td className="border border-border px-3 py-2 text-muted">
                  <code>apply_correction()</code> — GCM時系列に補正係数を適用。
                  上位10%は <code>df_corr1</code>、下位90%は月別の <code>df_corr2</code>
                </td>
              </tr>
              <tr className="bg-[#f0f4f8] dark:bg-[#1e293b]">
                <td className="border border-border px-3 py-2 font-medium">Cell 5</td>
                <td className="border border-border px-3 py-2 text-muted">
                  SSPリストと全グリッドセルをループしてヒストリカル・将来の両方を補正
                </td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2 font-medium">Cell 6</td>
                <td className="border border-border px-3 py-2 text-muted">
                  上位10%描画関数と補正前後の比較プロット
                </td>
              </tr>
              <tr className="bg-[#f0f4f8] dark:bg-[#1e293b]">
                <td className="border border-border px-3 py-2 font-medium">Cell 7</td>
                <td className="border border-border px-3 py-2 text-muted">
                  <code>his_corr/</code>, <code>ssp*_corr/</code> をZIPでダウンロード
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <h4 className="mb-2 mt-5 font-semibold text-foreground">変更するとよい箇所</h4>
        <ul className="ml-4 list-disc space-y-2 text-sm text-muted">
          <li>
            <strong className="text-foreground">処理対象のSSPシナリオ</strong> → Cell 5 の
            <code>ssp_list = [&quot;ssp126&quot;, &quot;ssp585&quot;]</code> に
            ssp245やssp370を追加/削除。
          </li>
          <li>
            <strong className="text-foreground">極端値とゆるやかな値の境界</strong>
            （デフォルト上位10% / 下位90%）→ <code>apply_correction</code> 内の
            <code>int(0.10 * ...)</code> を <code>0.05</code>（上位5%）などに変更。
          </li>
          <li>
            <strong className="text-foreground">観測カラム名</strong>を変える場合 →
            <code>compute_correction_factors</code> 冒頭の
            <code>rename(columns=&#123;&quot;GSMaP&quot;: &quot;obs&quot;&#125;)</code> を調整。
          </li>
        </ul>

        <h3 className="mb-3 mt-8 rounded bg-accent px-3 py-1.5 text-sm font-bold text-white">■ 操作手順</h3>

        <Step num={1} title="ファイルのアップロード">
          <p>
            Colab左パネルの「ファイル」タブで、新しいフォルダ
            <code className="rounded bg-[#f3f4f6] px-1 text-xs dark:bg-[#334155]">content</code> を作成し、
            その中に Notebook 2 の出力である
            <code className="rounded bg-[#f3f4f6] px-1 text-xs dark:bg-[#334155]">future_ssp_csvs</code>
            と、Notebook 3 で生成した GSMaP 時系列 CSV をコピーします。
          </p>
        </Step>

        <Step num={2} title="セルを順番に実行">
          <p>
            「ランタイム」→「すべてのセルを実行」で、グリッドセルごとに補正係数を計算し、
            ヒストリカルと全SSPの補正を一括処理します。
          </p>
        </Step>

        <Step num={3} title="結果確認とダウンロード">
          <p>
            最後のセルで上位10%降水の補正前後比較プロットが表示されます。
            出力CSVは以下の命名で <code>OUTPUT_DIR</code> に保存されます:
          </p>
          <ul className="ml-4 mt-1 list-disc space-y-1">
            <li><code className="rounded bg-[#f3f4f6] px-1 text-xs dark:bg-[#334155]">his_id_*_corrected.csv</code> — 補正後ヒストリカル時系列</li>
            <li><code className="rounded bg-[#f3f4f6] px-1 text-xs dark:bg-[#334155]">fut_ssp*_id_*_corrected.csv</code> — 補正後将来シナリオ時系列</li>
          </ul>
        </Step>
      </Section>

      {/* ===== Notebook 4b ===== */}
      <Section title="4b. Downscaling_Observation.ipynb — 地上観測によるバイアス補正">
        <h3 className="mb-3 rounded bg-accent px-3 py-1.5 text-sm font-bold text-white">■ 説明</h3>
        <p className="mb-4 text-sm text-muted">
          地上観測雨量計の時別降水データを使って、4aと同じ順序統計量補正法を適用します。
          複数SSPシナリオの一括処理に対応し、Step Aで
          <strong className="text-foreground">観測雨量CSVテンプレートの自動変換</strong>もサポートします。
          手動で観測地点とGCMグリッドの対応付けを行う必要はありません。
        </p>

        <h4 className="mb-2 mt-5 font-semibold text-foreground">観測雨量CSVテンプレート</h4>
        <p className="text-sm text-muted">
          Step A が読み込む入力形式です。1行目に観測点数、2行目に緯度、3行目に経度、
          4行目以降に <code>YYYY/M/D H:MM, val, val, ...</code> という時別値を並べた
          マルチステーション時別雨量CSVです。
        </p>
        <div className="my-3">
          <a
            href={`${BP}/templates/observation_rainfall_template.csv`}
            download
            className="inline-block rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            観測雨量CSVテンプレートをダウンロード
          </a>
        </div>
        <p className="mt-2 text-sm text-muted">Step Aの入力:</p>
        <ul className="ml-4 mt-1 list-disc space-y-1 text-sm text-muted">
          <li>
            <strong className="text-foreground">観測雨量CSVテンプレート</strong>
            に沿った雨量CSV（上のテンプレートを埋めて使用）
          </li>
          <li>
            <strong className="text-foreground">gcm_grid_shapefile.zip</strong>
            — <code>2_DataDownload</code>で生成されたグリッドメッシュSHP
          </li>
        </ul>
        <p className="mt-3 text-sm text-muted">Step Aの処理内容:</p>
        <ol className="ml-4 mt-1 list-decimal space-y-1 text-sm text-muted">
          <li>観測雨量CSVを解析（観測点ごとの緯度経度 + 時間毎時系列）</li>
          <li>時別値を日降水量に集約</li>
          <li>各観測点を <code>gcm_grid_mesh.shp</code> に空間結合（<code>within</code>判定）</li>
          <li>同一グリッド内の複数観測点の値を平均して <code>his_obs_id_&#123;GRID_ID&#125;.csv</code> を出力</li>
        </ol>
        <Tip>
          グリッドIDは<code>2_DataDownload</code>と全く同じSHPを使用するため、
          <strong className="text-foreground">観測データのグリッドIDとGCMデータのグリッドIDは完全に一致</strong>
          します。ユーザーがIDのマッピングを意識する必要はありません。
        </Tip>

        <h4 className="mb-2 mt-5 font-semibold text-foreground">セル別処理</h4>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr>
                <th className="border border-border bg-[#1e3a5f] px-3 py-2 text-left text-white">Cell</th>
                <th className="border border-border bg-[#1e3a5f] px-3 py-2 text-left text-white">処理内容</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-3 py-2 font-medium">Cell 1-2</td>
                <td className="border border-border px-3 py-2 text-muted">環境設定 + ライブラリimport</td>
              </tr>
              <tr className="bg-[#f0f4f8] dark:bg-[#1e293b]">
                <td className="border border-border px-3 py-2 font-medium">Cell 3 (Step A)</td>
                <td className="border border-border px-3 py-2 text-muted">
                  <strong className="text-foreground">観測雨量CSVテンプレート + gcm_grid_mesh.shp → his_obs_id_*.csv 自動生成</strong>
                  （空間結合により観測点とGCMグリッドを紐付け）
                </td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2 font-medium">Cell 4</td>
                <td className="border border-border px-3 py-2 text-muted">
                  <code>normalize_daily_index()</code> — 日付重複時の集約
                </td>
              </tr>
              <tr className="bg-[#f0f4f8] dark:bg-[#1e293b]">
                <td className="border border-border px-3 py-2 font-medium">Cell 5</td>
                <td className="border border-border px-3 py-2 text-muted">
                  <code>compute_correction_factors()</code> — 地上観測用のQuantile Mapping計算
                </td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2 font-medium">Cell 6</td>
                <td className="border border-border px-3 py-2 text-muted">
                  <code>apply_correction()</code> — 補正適用
                </td>
              </tr>
              <tr className="bg-[#f0f4f8] dark:bg-[#1e293b]">
                <td className="border border-border px-3 py-2 font-medium">Cell 7</td>
                <td className="border border-border px-3 py-2 text-muted">
                  <code>detect_ids_under_content()</code> — 観測CSVとGCM CSVで共通IDを検出 → 全グリッド・全SSPをバッチ処理
                </td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2 font-medium">Cell 8</td>
                <td className="border border-border px-3 py-2 text-muted">
                  補正済みファイルをZIPでダウンロード
                </td>
              </tr>
              <tr className="bg-[#f0f4f8] dark:bg-[#1e293b]">
                <td className="border border-border px-3 py-2 font-medium">Cell 9</td>
                <td className="border border-border px-3 py-2 text-muted">
                  補正前後の上位10%比較プロット
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <h4 className="mb-2 mt-5 font-semibold text-foreground">変更するとよい箇所</h4>
        <ul className="ml-4 list-disc space-y-2 text-sm text-muted">
          <li>
            <strong className="text-foreground">観測データ形式</strong>
            — テンプレートに沿わない場合は Step A のセルをスキップし、
            事前に <code>his_obs_id_&#123;ID&#125;.csv</code>（列: <code>date</code>, <code>Rain</code>）を用意。
          </li>
          <li>
            <strong className="text-foreground">処理対象のSSPシナリオ</strong> → Cell 7 の
            <code>ssp_list = [&quot;ssp126&quot;, &quot;ssp245&quot;, &quot;ssp370&quot;, &quot;ssp585&quot;]</code> を編集。
          </li>
          <li>
            <strong className="text-foreground">観測の集約方法</strong>
            （同一グリッド内の複数観測点） → Step Aの最後の
            <code>daily_grid = df_daily[cols].mean(axis=1)</code> を
            <code>.median()</code> や <code>.sum()</code> 等に変更。
          </li>
          <li>
            <strong className="text-foreground">時別→日別の集約方法</strong> → Step Aの
            <code>df_hourly.resample(&apos;1D&apos;).sum()</code>。降水以外（気温等）なら
            <code>.mean()</code> に変更。
          </li>
        </ul>

        <h3 className="mb-3 mt-8 rounded bg-accent px-3 py-1.5 text-sm font-bold text-white">■ 操作手順</h3>

        <Step num={1} title="入力ファイルのアップロード">
          <p>
            Colab左パネルの「ファイル」タブで <code>content</code> フォルダを作成し、
            以下をアップロードします:
          </p>
          <ul className="ml-4 mt-1 list-disc space-y-1">
            <li>Notebook 2 の <code>future_ssp_csvs</code> の中身</li>
            <li>上記テンプレートに沿って作成した観測雨量CSV</li>
            <li>Notebook 2 が出力した <code>gcm_grid_shapefile.zip</code></li>
          </ul>
        </Step>

        <Step num={2} title="Step A を実行（自動前処理）">
          <p>
            Step A のセルを実行すると、観測雨量CSVが自動で解析され、
            GCMグリッドと空間結合された <code>his_obs_id_*.csv</code> が生成されます。
          </p>
        </Step>

        <Step num={3} title="全セルを実行して補正">
          <p>
            残りのセルを順に実行すると、全グリッド・全SSPのバイアス補正がバッチ処理されます。
          </p>
        </Step>

        <Step num={4} title="結果確認とダウンロード">
          <p>
            最後のセルで補正前後の比較プロットが表示され、補正済みファイルをZIPでダウンロードできます。
          </p>
        </Step>
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
            補正後データを水文モデルの入力として使用し、将来洪水を評価
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

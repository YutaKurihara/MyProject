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

function Band({ children }: { children: React.ReactNode }) {
  return <h3 className="mb-3 mt-8 rounded bg-accent px-3 py-1.5 text-sm font-bold text-white first:mt-0">{children}</h3>;
}

function H4({ children }: { children: React.ReactNode }) {
  return <h4 className="mb-2 mt-5 font-semibold text-foreground">{children}</h4>;
}

function C({ children }: { children: React.ReactNode }) {
  return <code className="rounded bg-[#f3f4f6] px-1 text-xs dark:bg-[#334155]">{children}</code>;
}

function Code({ children }: { children: string }) {
  return (
    <pre className="my-2 overflow-x-auto rounded-md bg-[#1e293b] p-3 text-xs text-[#e2e8f0]">{children}</pre>
  );
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

      {/* ===== 本ツールの位置づけ ===== */}
      <Section title="本ツールの位置づけ">
        <p className="text-sm text-muted">
          本ツールは、
          <S>
            「フィリピン・カガヤンバレー地域における気候変動と土地利用の変化を考慮した将来の洪水リスク評価のためのAIと統計の統合フレームワーク」
          </S>
          （第11期マイプロジェクト）の一部として開発したものです。
          将来の洪水リスク評価を行うためには、GCM（全球気候モデル）の降水量データを対象地域のスケールに合わせてダウンスケーリングし、
          バイアスを補正したうえで、確率雨量の変化を評価する必要があります。本ツールはこの一連の作業を、
          Google Colaboratory 上で動く6つのノートブックで行います。
        </p>
        <p className="mt-3 text-sm text-muted">
          2026年9〜10月の改修で、計算方法の誤りを修正し、データ取得の高速化と再開機能、確率雨量の解析（Notebook 5）を追加しました。
          各ノートブックの既定値は、改修時に検討した<S>鶴見川（神奈川県・東京都）</S>の設定例になっています。
          ほかの地域で使う場合は、各ノートブックの設定セル（<C>edit these</C> と書かれたセル）を書き換えてください。
        </p>
      </Section>

      {/* ===== ツールのダウンロード ===== */}
      <Section title="ツールのダウンロード">
        <p className="mb-3 text-sm text-muted">
          以下のボタンからノートブックをダウンロードできます。出力セルは空の状態で配布しています。
        </p>
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

        <H4>2026年9〜10月の主な改修内容</H4>
        <ul className="ml-4 list-disc space-y-1 text-sm text-muted">
          <li>
            <S>全ノートブックが Google Drive の同じ出力フォルダ</S>（<C>OUTPUT_DIR</C>、既定
            <C>/content/drive/MyDrive/Downscaling/Output</C>）を読み書きし、前段の結果を自動で読み込みます。
            ファイルを手でアップロード・コピーする作業や、Earth Engine Asset へのアップロードは不要になりました。
          </li>
          <li>
            <S>GCMデータの取得（Notebook 2）</S>は、NASA NCCS の OPeNDAP で対象グリッドだけを取り出す方式を既定にしました
            （1モデル・1年あたり約10 kB。従来の S3 一括ダウンロードは約200 MB）。途中で切断されても続きから再開できます。
          </li>
          <li>
            <S>GCM精度評価（Notebook 1）</S>：風速・短波放射の観測値の計算誤りを修正し、観測を GCM 格子へ面積平均してから比較するようにしました。
          </li>
          <li>
            <S>バイアス補正（Notebook 4a/4b）</S>：観測の欠測を検出して停止する仕組み、観測期間の指定（4b）、補正前後の比較表を追加しました。
          </li>
          <li>
            <S>結果解析（Notebook 5）</S>を追加しました。流域平均雨量の年最大値から、GCM ごとに確率雨量を算定します。
          </li>
          <li>地図の背景は、APIキー不要で全世界同じ表示になる CyclOSM に変更しました。</li>
        </ul>
      </Section>

      {/* ===== セットアップ ===== */}
      <Section title="ツールセットアップ">
        <Step num={1} title="ノートブックをGoogle Driveに保存">
          <p>
            ダウンロードした6つのノートブック（<C>.ipynb</C>）を、ご自身の Google Drive に保存します。
          </p>
          <Tip>
            MyDrive 直下に専用フォルダ（例: <C>Downscaling</C>）を作成し、その中に6ファイルを置くことを推奨します。
            計算結果は既定で <C>Downscaling/Output</C> に保存されます。
          </Tip>
        </Step>

        <Step num={2} title="Google Colaboratoryをインストール">
          <p>
            ファイルを右クリック →「アプリで開く」→「アプリを追加」→ 検索ボックスに「Colaboratory」と入力し、インストールします。
            一度インストールすれば次回以降は不要です。
          </p>
        </Step>

        <Step num={3} title="Colabでノートブックを開き、環境設定セルを実行">
          <p>
            各ノートブックの最初のセル（<C>Environment Setup</C>）が Google Drive をマウントし、出力フォルダを決めます。
            Earth Engine を使う Notebook 1 と 3 では、<C>GEE_PROJECT</C> にご自身のプロジェクトIDを設定します。
          </p>
          <Code>{`import os
os.environ['GEE_PROJECT'] = 'your-ee-project-id'                     # Notebook 1, 3
os.environ['OUTPUT_DIR']  = '/content/drive/MyDrive/Downscaling/Output'  # 全ノートブック共通（既定値）`}</Code>
          <Tip>
            <C>OUTPUT_DIR</C> は<S>すべてのノートブックで同じフォルダ</S>にしてください。後段のノートブックは、前段がこのフォルダに書いたファイルを読みます。
            <C>GEE_PROJECT</C> は Earth Engine に登録したプロジェクトIDで、
            <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" className="text-accent underline">
              Google Cloud Console
            </a>
            の「プロジェクトの選択」から確認できます。
          </Tip>
        </Step>

        <Step num={4} title="設定セルを編集して、セルを順に実行">
          <p>
            各ノートブックの「<C>(edit these)</C>」などと書かれた設定セルを対象地域に合わせて編集し、上から順に実行します。
            Google アカウントでの認証を求められた場合は、ログインして許可してください。
          </p>
        </Step>

        <Step num={5} title="GCP権限エラーの対処">
          <p>Earth Engine の初期化でエラーになる場合は、GCP の権限設定が必要な可能性があります:</p>
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
        <Band>■ 説明</Band>
        <p className="mb-4 text-sm text-muted">
          評価領域内の GCM 格子（0.25°）ごとに、観測と CMIP6 の各 GCM の気候値（期間平均）を比較し、GCM の精度を評価します。
          <S>全モデル × 5変数 × 2指標（空間相関・RMSE）</S>を計算し、総合スコアの高いモデルを Notebook 2 で使います。
        </p>

        <H4>評価対象の気象変数（5種類）</H4>
        <Table
          head={["変数名", "意味", "観測リファレンス"]}
          rows={[
            [<code key="a">pr</code>, "降水量", "ERA5-Land（既定）または GSMaP v8"],
            [<code key="a">tas</code>, "地上気温", "ERA5-Land"],
            [<code key="a">rlds</code>, "下向き長波放射", "ERA5-Land"],
            [<code key="a">rsds</code>, "下向き短波放射", "ERA5-Land（下向き放射。正味放射ではない）"],
            [<code key="a">sfcWind</code>, "地上風速", "ERA5-Land（日別風速の平均）"],
          ]}
        />

        <H4>評価とスコアリング</H4>
        <ul className="ml-4 list-disc space-y-1 text-sm text-muted">
          <li>観測の気候値を GCM 格子へ<S>面積平均</S>し、評価領域内の各セルで GCM と比較します（観測のない海域セルは除外）。</li>
          <li><S>空間相関（*_corr）</S>：全モデル平均以上なら +1、未満なら −1。</li>
          <li><S>RMSE（*_rmse）</S>：全モデル平均より小さければ +1、そうでなければ −1。</li>
          <li><S>total_score</S> は10項目の合計（−10〜+10）。指標が欠けたモデルは採点せず、表の末尾に置きます。</li>
        </ul>

        <H4>処理の流れ</H4>
        <Table
          head={["STEP", "処理内容"]}
          rows={[
            ["環境設定・EE初期化", <>Drive のマウント、<code>GEE_PROJECT</code> での Earth Engine 初期化</>],
            ["STEP 2（設定）", <><strong className="text-foreground">評価領域 <code>region</code></strong>、地図に描く流域 <code>target_region</code>、評価期間 <code>start_date</code> / <code>end_date</code>。地図で範囲を確認できます</>],
            ["STEP 3（観測）", <>降水の観測源 <code>OBS_PR_SOURCE</code>（<code>&apos;ERA5&apos;</code> / <code>&apos;GSMaP&apos;</code>）を選び、5変数の観測気候値を作成</>],
            ["STEP 4（モデル一覧）", <><code>NASA/GDDP-CMIP6</code> からモデル一覧を取得。2015年以降を評価する場合は <code>EXTEND_SCENARIO</code>（既定 ssp245）で延長</>],
            ["STEP 5（評価）", "モデルごとに相関・RMSE を並列計算。設定が同じなら前回の結果を再利用（設定を変えると自動で再計算）"],
            ["STEP 6（採点・出力）", <><code>GCMs_Evaluation.csv</code>（最終行は全モデル平均）と設定記録 <code>GCMs_Evaluation.meta.json</code> を出力</>],
            ["STEP 7（任意）", "観測と上位モデルの降水気候値を並べた地図（PNG）を作成"],
          ]}
        />

        <H4>変更するとよい箇所</H4>
        <ul className="ml-4 list-disc space-y-2 text-sm text-muted">
          <li>
            <S>評価領域を変える</S> → STEP 2 の <C>region = ee.Geometry.Rectangle([西経度, 南緯度, 東経度, 北緯度])</C>。
            指標はセル間の空間的なばらつきで計算するため、<S>陸域セルが50以上（おおむね2°×2°以上）</S>の範囲にします。
            流域程度の小さな範囲ではセルが1〜2個しかなく、評価になりません。既定値は中部日本（関東・東海・甲信越・南東北）です。
          </li>
          <li>
            <S>評価期間を変える</S> → STEP 2 の <C>start_date</C> / <C>end_date</C>（<C>end_date</C> は含まない）。既定は1985〜2014年の30年。
            GSMaP を使う場合は1998年以降にします。
          </li>
          <li>
            <S>降水の観測を GSMaP にする</S> → STEP 3 の <C>OBS_PR_SOURCE = &apos;GSMaP&apos;</C>。
          </li>
        </ul>

        <Band>■ 操作手順</Band>
        <Step num={1} title="評価領域と期間を設定（STEP 2）">
          <Code>{`region = ee.Geometry.Rectangle([137.0, 33.5, 142.0, 38.0])          # 評価領域（中部日本の例）
target_region = ee.Geometry.Rectangle([139.375, 35.46, 139.71, 35.635])  # 地図に描く流域（None で非表示）
start_date = '1985-01-01'
end_date   = '2015-01-01'`}</Code>
          <p>次のセルで地図が表示されるので、評価領域（赤枠）が対象地域を十分に含むことを確認します。</p>
        </Step>
        <Step num={2} title="観測源を選び、STEP 3〜6 を実行">
          <p>
            モデルは並列で評価されます。結果は <C>OUTPUT_DIR/GCMs_Evaluation.csv</C> に保存されます。
          </p>
        </Step>
        <Step num={3} title="モデルを選定">
          <p>
            <C>total_score</C> の上位モデルを、Notebook 2 の <C>SELECTED_MODELS</C> に書きます。
            <C>n_cells</C>（比較したセル数）が数十以上あることも確認してください。
          </p>
          <Tip>
            降水の指標（<C>pr_corr</C>、<C>pr_rmse</C>）は特に重要です。相関が全モデルで負になる変数は、元データがどの GCM でも観測と合わないことを意味するため、
            評価から除くことも検討してください。鶴見川の例では中部日本で評価し、上位10モデルを選びました（Notebook 2 の既定値）。
            カガヤンバレー地域の例では ACCESS-CM2、CanESM5、EC-Earth3-Veg-LR が選ばれています。
          </Tip>
        </Step>
      </Section>

      {/* ===== Notebook 2 ===== */}
      <Section title="2. DataDownload.ipynb — GCMデータ取得">
        <Band>■ 説明</Band>
        <p className="mb-4 text-sm text-muted">
          選定モデルのヒストリカル・将来シナリオの日降水量を NASA NEX-GDDP-CMIP6 から取得し、
          流域と重なる GCM 格子セルごとの時系列 CSV にまとめます。
          既定では NASA NCCS の <S>OPeNDAP</S> で対象セルだけを取り出すため、データ量は全体で約30 MB です
          （10モデル×（ヒストリカル20年＋将来80年×4シナリオ）の例）。取得は数時間かかりますが、途中で切れても続きから再開できます。
        </p>

        <H4>処理の流れ</H4>
        <Table
          head={["セル", "処理内容"]}
          rows={[
            ["環境設定・インストール", "Drive のマウント、cftime / netCDF4 のインストール"],
            ["GCMモデル設定", <><code>SELECTED_MODELS</code> に使うモデル名を並べる（<code>ALL_MODELS</code> は全モデルの一覧）</>],
            ["対象地域", <>流域の<strong className="text-foreground">シェープファイル一式</strong>（.shp / .dbf / .shx / .prj）をアップロード。<code>BASIN_SHP_PATH</code> に Drive 上のパスを書けばアップロード不要。座標系は自動で WGS84 に変換</>],
            ["GCM格子の作成・確認", <>流域と重なる0.25°セルを抽出し、地図で確認。各セルの流域内割合 <code>frac_cell</code>・流域に占める割合 <code>frac_basin</code> を計算</>],
            ["格子SHPの出力", <><code>gcm_grid_shp/</code> に格子（mesh）・中心点（centroid）・一覧表（CSV）を出力（Notebook 3・4b・5 が使用）</>],
            ["期間・出力の設定", <><code>HIST_START</code> / <code>HIST_LENGTH</code> / <code>FUT_START</code> / <code>FUT_MULTIPLIER</code> / <code>ssp_scenarios</code> / <code>QUICK_TEST</code></>],
            ["取得（ヒストリカル・SSP）", <>年ごとに最新版のファイル（<code>_v2.0</code> &gt; <code>_v1.1</code> &gt; 原版）を選んで取得し、<code>his_orig/</code>・<code>{"{ssp}"}_orig/</code> にセル別 CSV を出力。取得記録は <code>download_manifest.csv</code></>],
          ]}
        />

        <H4>変更するとよい箇所</H4>
        <ul className="ml-4 list-disc space-y-2 text-sm text-muted">
          <li><S>使うGCM</S> → <C>SELECTED_MODELS</C> にモデル名を並べる（コメントの付け外しは不要）。既定は鶴見川で選定した10モデル。</li>
          <li><S>対象地域</S> → アップロードするシェープファイルを差し替える（QGIS / ArcGIS からの出力、HydroBASINS など）。</li>
          <li>
            <S>ヒストリカル期間</S> → <C>HIST_START</C>・<C>HIST_LENGTH</C>（既定 1995年から20年）。観測が存在する期間にします
            （ERA5-Land は1950年〜、GSMaP は1998年〜）。
          </li>
          <li>
            <S>将来期間</S> → <C>FUT_START</C>（既定2021年）と <C>FUT_MULTIPLIER</C>（既定4）。将来期間の長さはヒストリカルの整数倍に固定されます
            （既定で2021〜2100年の80年）。バイアス補正で将来を20年ずつ区切って補正するためです。
          </li>
          <li><S>SSPシナリオ</S> → <C>ssp_scenarios</C>（ssp126 / ssp245 / ssp370 / ssp585）。</li>
          <li><S>まず動作確認したい</S> → <C>QUICK_TEST = True</C> で、2モデル×各期間1年だけを数分で取得できます。</li>
          <li><S>取得方式</S> → 既定は <C>DATA_SOURCE = &apos;opendap&apos;</C>。<C>&apos;s3&apos;</C> は年ごとに全球ファイル（約200 MB）を丸ごと取得する従来方式です。</li>
        </ul>

        <H4>SSPシナリオ</H4>
        <Table
          head={["シナリオ", "意味"]}
          rows={[
            ["SSP1-2.6", "持続可能（低排出）"],
            ["SSP2-4.5", "中間的（中排出）"],
            ["SSP3-7.0", "地域的対立（中〜高排出）"],
            ["SSP5-8.5", "化石燃料依存（高排出）"],
          ]}
        />

        <Band>■ 操作手順</Band>
        <Step num={1} title="モデルと期間を設定">
          <Code>{`SELECTED_MODELS = ["NorESM2-LM", "CMCC-ESM2", "TaiESM1", ...]   # Notebook 1 の上位モデル
HIST_START, HIST_LENGTH = 1995, 20
FUT_START, FUT_MULTIPLIER = 2021, 4
ssp_scenarios = ["ssp126", "ssp245", "ssp370", "ssp585"]`}</Code>
        </Step>
        <Step num={2} title="流域シェープファイルを読み込み、格子を確認">
          <p>
            アップロード画面で .shp・.dbf・.shx・.prj を<S>まとめて選択</S>します。地図で流域（青）と GCM セル（赤）を確認し、
            流域にほとんど掛からないセルを除く場合は <C>MIN_CELL_COVER</C> を設定します。
          </p>
        </Step>
        <Step num={3} title="取得を実行">
          <p>
            ヒストリカルと SSP の取得セルを実行します。進捗は約2分ごとに表示されます。
            Colab が切断された場合は、最初から実行し直せば取得済みの年は読み飛ばされます。
          </p>
          <Tip>
            無料版の Colab は、操作がない状態が約90分続くか、12時間を超えると切断されます。タブを開いたままにするか、
            <C>ssp_scenarios</C> を1シナリオずつにして実行してください。
          </Tip>
        </Step>
      </Section>

      {/* ===== Notebook 3 ===== */}
      <Section title="3. GSMaPDownload.ipynb — 衛星降水観測データ取得">
        <Band>■ 説明</Band>
        <p className="mb-4 text-sm text-muted">
          JAXA GSMaP v8（Global Satellite Mapping of Precipitation）の日降水量を Earth Engine で取得し、
          Notebook 2 の GCM 格子へ<S>面積平均</S>してセル別の CSV にします。Notebook 4a の観測データになります。
          格子の中心点は Drive から自動で読み込むため、Earth Engine Asset へのアップロードは不要です。
        </p>

        <H4>処理の流れ</H4>
        <Table
          head={["セル", "処理内容"]}
          rows={[
            ["環境設定・EE初期化", <>Drive のマウント、<code>GEE_PROJECT</code> での初期化</>],
            ["格子中心点の読込", <><code>OUTPUT_DIR/gcm_grid_shp/gcm_grid_centroid.shp</code> を読み込み</>],
            ["期間の設定", <><code>years</code>（既定 1998〜2017年の20年）</>],
            ["補正ラスタ（任意）", <>GSMaP の補正係数ラスタ（約0.1°の GeoTIFF）がある場合は <code>UPLOAD_CORRECTION_RASTER = True</code></>],
            ["日別画像の作成", "時別を日積算し、0.1°のまま補正したうえで0.25°の GCM 格子へ面積平均"],
            ["STEP 7（出力・分割）", <>Earth Engine の出力タスクを1件実行し、完了後にセル別の <code>his_GSMaP_orig/his_GSMaP_id_*.csv</code> へ分割（10〜30分程度）</>],
          ]}
        />

        <H4>変更するとよい箇所</H4>
        <ul className="ml-4 list-disc space-y-2 text-sm text-muted">
          <li>
            <S>期間</S> → <C>years = list(range(1998, 2018))</C>。<S>Notebook 2 のヒストリカル期間と同じ年数</S>にしてください。
            4a は観測と GCM を値の順位で対応させるため、暦年が違っても日数が同じであれば補正できます
            （既定の GSMaP 1998〜2017年と GCM 1995〜2014年はどちらも7,305日）。GSMaP v8 は1998年1月1日以降のみです。
          </li>
          <li><S>作り直したい</S> → STEP 7 の <C>FORCE_REGENERATE = True</C>（通常は、同じ格子・期間の出力があれば自動で省略します）。</li>
        </ul>
      </Section>

      {/* ===== Notebook 4 Overview ===== */}
      <Section title="4. Downscaling — バイアス補正（概要）">
        <p className="mb-4 text-sm text-muted">
          観測データ（GSMaP または地上観測）を用いて、<S>順序統計量補正法（Quantile Mapping）</S>で GCM の降水量バイアスを補正します。
          観測の種類に応じて <C>4a_Downscaling_GSMaP.ipynb</C> または <C>4b_Downscaling_Observation.ipynb</C> を使います。
          どちらも入力を Drive の <C>OUTPUT_DIR</C> から自動で読み込み、補正結果を同じフォルダへ書き出します。
        </p>

        <H4>補正手法の考え方</H4>
        <p className="text-sm text-muted">
          GCM ヒストリカルと観測の日降水量をそれぞれ昇順に並べ、同じ順位の値の比を補正係数とします。
        </p>
        <Code>{`補正係数(順位i) = 観測(順位i) / GCMヒストリカル(順位i)
補正後GCM(値x) = GCM(値x) × 補正係数(xの順位)`}</Code>
        <ul className="mt-3 ml-4 list-disc space-y-1 text-sm text-muted">
          <li><S>df_corr1</S>：全期間の補正係数（上位10%の極端降水に適用）</li>
          <li><S>df_corr2</S>：月別の補正係数（下位90%の降水に適用）</li>
          <li><S>無降水日の処理</S>：観測の無降水日数に合わせて GCM の下位をゼロにし、弱い雨が続く GCM の偏り（drizzle problem）を解消</li>
          <li>
            <S>将来期間</S>：ヒストリカルと同じ長さ（既定20年）に区切って補正します。観測と GCM ヒストリカルは
            <S>同じ日数</S>である必要があります。
          </li>
          <li>観測の欠測日は0として補い、欠測が2%を超える場合は停止して知らせます。</li>
        </ul>

        <H4>4a と 4b の使い分け</H4>
        <Table
          head={["ノートブック", "観測ソース", "特徴"]}
          rows={[
            ["4a (GSMaP)", "JAXA GSMaP v8（Notebook 3）", "全球で利用可。1998年以降"],
            ["4b (Observation)", "地上雨量計", "地点の観測で補正。各 GCM セルに最寄りの観測所を割り当て"],
          ]}
        />
      </Section>

      {/* ===== Notebook 4a ===== */}
      <Section title="4a. Downscaling_GSMaP.ipynb — GSMaPによるバイアス補正">
        <Band>■ 説明</Band>
        <p className="mb-4 text-sm text-muted">
          GSMaP を観測として、GCM 降水量を補正します。入力は Notebook 2・3 が Drive に書いたファイルで、手作業のアップロードは不要です。
        </p>
        <Table
          head={["入力（OUTPUT_DIR 内）", "作成元"]}
          rows={[
            [<code key="a">his_orig/his_id_*.csv</code>, "Notebook 2（GCM ヒストリカル）"],
            [<code key="a">{"{ssp}"}_orig/fut_{"{ssp}"}_id_*.csv</code>, "Notebook 2（GCM 将来シナリオ）"],
            [<code key="a">his_GSMaP_orig/his_GSMaP_id_*.csv</code>, "Notebook 3（GSMaP）"],
          ]}
        />
        <H4>変更するとよい箇所</H4>
        <ul className="ml-4 list-disc space-y-2 text-sm text-muted">
          <li><S>補正するSSP</S> → 補正ループのセルの <C>ssp_list</C>。Notebook 2 で取得したシナリオに合わせます。</li>
          <li><S>極端降水の境界</S>（既定 上位10%）→ <C>apply_correction</C> 内の <C>0.10</C>。</li>
        </ul>
        <Band>■ 操作手順</Band>
        <Step num={1} title="ssp_list を設定して全セルを実行">
          <p>補正するセルは、GCM と GSMaP の両方のファイルがあるセルが自動で選ばれます。</p>
        </Step>
        <Step num={2} title="結果を確認">
          <p>最後のセルで、観測・補正前・補正後の上位10%の降水を並べたグラフと、年平均・雨日率・99%値・最大値の比較表が表示されます。</p>
          <ul className="ml-4 mt-1 list-disc space-y-1">
            <li><C>his_corr/his_id_*_corrected.csv</C> — 補正後ヒストリカル</li>
            <li><C>{"{ssp}"}_corr/fut_{"{ssp}"}_id_*_corrected.csv</C> — 補正後将来シナリオ</li>
          </ul>
        </Step>
      </Section>

      {/* ===== Notebook 4b ===== */}
      <Section title="4b. Downscaling_Observation.ipynb — 地上観測によるバイアス補正">
        <Band>■ 説明</Band>
        <p className="mb-4 text-sm text-muted">
          地上雨量計の観測で、4a と同じ方法の補正を行います。Step A で観測雨量 CSV を読み込み、
          <S>各 GCM セルに最寄りの観測所を割り当て</S>（ティーセン分割）、セル別の観測データ <C>his_obs_orig/his_obs_id_*.csv</C> を作成します。
          GCM 格子は Notebook 2 が Drive に書いたものを使うため、観測と GCM のセル番号は自動で一致します。
        </p>

        <H4>観測雨量CSVの形式</H4>
        <p className="text-sm text-muted">
          1行目に観測所数、2行目に緯度、3行目に経度、4行目以降に日付と各観測所の雨量を並べます
          （RRI モデルの雨量ファイルと同じ形式）。時別データ（<C>YYYY/M/D H:MM</C>）でも日別データでもよく、日ごとに合計されます。
          空欄は0として扱います。
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

        <H4>処理の流れ</H4>
        <Table
          head={["セル", "処理内容"]}
          rows={[
            ["Step A（観測の前処理）", <>観測雨量 CSV をアップロード（または <code>OBS_CSV_PATH</code> に Drive 上のパス）。<code>gcm_grid_shp/gcm_grid_mesh.shp</code> を Drive から読み、各セルに最寄りの観測所を割り当てて <code>his_obs_id_*.csv</code> を出力</>],
            ["ティーセン分割の地図", "どのセルがどの観測所に割り当てられたかを色分けして表示（観測所は赤点）"],
            ["補正ループ", <><code>ssp_list</code> と <code>OBS_PERIOD</code> を設定し、全セル・全シナリオを補正</>],
            ["比較グラフ・表", "観測・補正前・補正後の上位10%の降水と、年平均・雨日率・99%値・最大値の比較"],
          ]}
        />

        <H4>変更するとよい箇所</H4>
        <ul className="ml-4 list-disc space-y-2 text-sm text-muted">
          <li>
            <S>観測期間</S> → <C>OBS_PERIOD = (&apos;1995-01-01&apos;, &apos;2014-12-31&apos;)</C> のように、補正に使う期間を切り出します。
            GCM ヒストリカルと<S>同じ日数</S>にしてください（<C>None</C> は全期間）。
          </li>
          <li><S>補正するSSP</S> → <C>ssp_list</C>。</li>
          <li>
            <S>観測データが別形式</S>の場合 → Step A を飛ばし、<C>his_obs_orig/his_obs_id_{"{ID}"}.csv</C>（列: <C>date</C>, <C>Rain</C>）を用意します。
          </li>
        </ul>

        <Band>■ 操作手順</Band>
        <Step num={1} title="Step A を実行（観測の前処理）">
          <p>観測雨量 CSV を選ぶと、セル別の観測ファイルが作成されます。地図で割り当てが妥当か確認します。</p>
        </Step>
        <Step num={2} title="OBS_PERIOD と ssp_list を設定して補正">
          <p>補正前に観測と GCM の期間・日数が表示されるので、一致していることを確認します。</p>
        </Step>
        <Step num={3} title="結果を確認">
          <p>出力は 4a と同じく <C>his_corr/</C> と <C>{"{ssp}"}_corr/</C> に保存されます。</p>
        </Step>
      </Section>

      {/* ===== Notebook 5 ===== */}
      <Section title="5. ResultAnalysis.ipynb — 結果解析（確率雨量）">
        <Band>■ 説明</Band>
        <p className="mb-4 text-sm text-muted">
          補正後のセル別 CSV（4a または 4b の出力）から<S>流域平均雨量</S>を求め、年平均・年最大の推移と傾向、
          <S>年最大日雨量の確率雨量</S>をシナリオごとに算定します。結果は <C>OUTPUT_DIR/analysis/</C> に保存されます。
        </p>

        <H4>処理の流れ</H4>
        <Table
          head={["セクション", "処理内容"]}
          rows={[
            ["1. 流域平均", <>セル別の補正後雨量を、各セルが流域に占める割合（<code>frac_basin</code>）で重み付けして流域平均。補正に使った観測（GSMaP か地上観測か）は自動で判定</>],
            ["2. 年平均・年最大", "GCM ごとの年平均・年最大雨量の推移（灰色：各GCM、黒：GCM平均、赤：観測）と Mann–Kendall 検定による傾向"],
            ["3. 確率雨量", "GCM ごとの年最大日雨量に10種類の確率分布を当てはめ、適合度で選んだ分布から再現期間2〜400年の確率雨量を算定"],
          ]}
        />

        <H4>確率雨量の算定方法</H4>
        <ul className="ml-4 list-disc space-y-1 text-sm text-muted">
          <li>
            <S>GCM ごとに</S>年最大値の系列を作り、確率雨量を算定したうえで、GCM 間の平均・中央値・最小・最大を示します。
            全 GCM の年最大値をまとめた標本（プール）での算定も併記します。
          </li>
          <li>
            推定は国土技術政策総合研究所の「水文統計ユーティリティ」に準じます：プロット位置は Cunnane 式、
            適合度は SLSC（0.04以下を採択）、採択した分布のうち100年確率雨量のジャックナイフ推定誤差が最小のものを選びます。
          </li>
          <li>
            候補分布：指数、Gumbel、平方根指数型最大値、一般化極値（GEV）、対数正規（2母数・3母数）、対数ピアソンIII型、岩井法。
            石原・高瀬法は含みません。
          </li>
        </ul>
        <Tip>
          複数の GCM の日雨量を先に平均してから年最大値を取ると、GCM ごとに大雨の日が異なるため極端値が打ち消され、確率雨量が大幅に小さくなります
          （改修前の版で生じていた問題です）。本ノートブックは各 GCM の年最大値で算定し、GCM 間の統計は確率雨量の値でとります。
        </Tip>

        <H4>主な出力（analysis/）</H4>
        <ul className="ml-4 list-disc space-y-1 text-sm text-muted">
          <li><C>basin_avg_{"{scenario}"}.csv</C> — 流域平均の日雨量（日付 × GCM）</li>
          <li><C>annual_mean_all.png/.pdf</C>、<C>annual_max_all.png/.pdf</C>、<C>mk_trends.csv</C> — 年平均・年最大と傾向</li>
          <li><C>prob_plot_{"{scenario}"}.png/.pdf</C> — 確率紙（Gumbel）上のプロット</li>
          <li><C>return_periods_by_model.csv</C>、<C>return_periods_summary.csv</C>、<C>fit_scores.csv</C>、<C>return_periods.xlsx</C> — 確率雨量と適合度の表</li>
        </ul>
      </Section>

      {/* ===== 推奨ワークフロー ===== */}
      <Section title="推奨ワークフロー">
        <ol className="ml-4 list-decimal space-y-2 text-sm text-muted">
          <li><S>Notebook 1</S> で対象地域に適した GCM を選定</li>
          <li><S>Notebook 2</S> で流域シェープファイルを読み込み、選定モデルのヒストリカル・将来データを取得（まず <C>QUICK_TEST</C> で動作確認）</li>
          <li>
            観測データの種類に応じて：
            <ul className="ml-4 mt-1 list-disc space-y-1">
              <li><S>衛星観測</S>：Notebook 3 → Notebook 4a</li>
              <li><S>地上観測あり</S>：Notebook 4b</li>
            </ul>
          </li>
          <li><S>Notebook 5</S> で流域平均雨量の傾向と確率雨量の変化を評価</li>
          <li>補正後の雨量を水文モデル（RRI 等）の入力として使い、将来の洪水を評価</li>
        </ol>
      </Section>

      {/* ===== 実行上の注意点 ===== */}
      <Section title="実行上の注意点">
        <ul className="ml-4 list-disc space-y-2 text-sm text-muted">
          <li>
            <S>実行環境</S>：Google Colab を推奨します。ローカルで実行する場合は、<C>OUTPUT_DIR</C> をローカルのパスにし、
            ファイルのアップロード画面の代わりに <C>BASIN_SHP_PATH</C>（Notebook 2）・<C>OBS_CSV_PATH</C>（Notebook 4b）を設定します。
          </li>
          <li>
            <S>出力フォルダの共有</S>：前の解析で作ったファイル（例：セル数の多い別流域の <C>his_id_3.csv</C>）が残っていると、
            後段のノートブックがそれも読み込みます。Notebook 2 は残っているファイルを警告するので、不要なら削除してください。
          </li>
          <li>
            <S>データ取得の時間</S>：OPeNDAP はサーバー側で全球ファイルを読むため、1年分の取得に5〜30秒かかり、全体では数時間になります。
            途中で切れても再実行で続きから取得します。
          </li>
          <li>
            <S>暦</S>：360日暦・閏年なし暦のモデルはグレゴリオ暦に合わせて補います（年合計への影響は小さく、補正で相殺されます）。
          </li>
          <li><S>GSMaP の期間</S>：1998年1月1日以降のみ利用できます。</li>
          <li>
            <S>定常性の仮定</S>：順序統計量補正は、過去の観測と GCM ヒストリカルの関係が将来も成り立つ（定常性）と仮定しています。
            降水の特性が大きく変わる場合、この仮定は完全には成り立たない点に注意してください。
          </li>
        </ul>
      </Section>

      {/* ===== データソース ===== */}
      <Section title="使用データソース">
        <Table
          head={["データ", "解像度", "用途"]}
          rows={[
            ["NASA NEX-GDDP-CMIP6", "0.25°（約28km）", "GCM精度評価（Notebook 1、Earth Engine）／ヒストリカル・将来データ取得（Notebook 2、NASA NCCS OPeNDAP または AWS S3）"],
            ["ERA5-Land Daily Aggregated", "0.1°（約9km）", "降水・気温・放射・風速の観測リファレンス（Notebook 1）"],
            ["JAXA GSMaP v8 Operational", "0.1°（約11km）", "衛星降水量の観測リファレンス（Notebook 1・3）、1998年〜"],
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

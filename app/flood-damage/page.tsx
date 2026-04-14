import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "洪水直接被害計算ツール Manual | MyProject",
};

const IMG = process.env.__NEXT_ROUTER_BASEPATH || "";
const img = (name: string) => `${IMG}/images/flood-damage/${name}`;

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

function Screenshot({
  src,
  alt,
  narrow,
}: {
  src: string;
  alt: string;
  narrow?: boolean;
}) {
  return (
    <figure className={`my-4 ${narrow ? "mx-auto max-w-xs" : ""}`}>
      <Image
        src={src}
        alt={alt}
        width={narrow ? 400 : 900}
        height={narrow ? 600 : 600}
        className="w-full rounded-lg border border-border"
      />
      <figcaption className="mt-1 text-xs text-muted">{alt}</figcaption>
    </figure>
  );
}

export default function FloodDamagePage() {
  return (
    <div className="mx-auto max-w-[960px] px-4 py-10">
      <header className="mb-10 border-b-[3px] border-accent pb-4 text-center">
        <h1 className="mb-1 text-2xl font-bold text-[#1e3a5f] dark:text-accent">
          洪水直接被害計算ツール 使用マニュアル
        </h1>
        <p className="text-sm text-muted">
          Flood Direct Damage Estimation Tool (ver.0)
        </p>
        <p className="mt-1 text-xs text-muted">
          オリエンタルコンサルタンツグローバル 水資源・防災部
        </p>
      </header>

      {/* ===== 概要 ===== */}
      <Section title="概要">
        <p className="mb-3 text-sm text-muted">
          本ツールは、SAR-DATを発展させたもので、Google Earth Engine（GEE）上で
          洪水の浸水深を推定し、建物・農作物の直接被害額を算定します。
          フィリピンを対象に、現地調査を行わずに洪水被害額を迅速に評価できます。
        </p>
        <p className="mb-3 text-sm text-muted">
          ツールは以下の2つのスクリプトで構成されています。
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            {
              name: "01 LandUseMapping",
              desc: "全国教師データを用いたランダムフォレストによる土地利用図の作成",
            },
            {
              name: "02 FloodDirectDamage",
              desc: "浸水深推定 (FwDET) と建物・農作物の被害額算定",
            },
          ].map((item) => (
            <div key={item.name} className="rounded-md border border-border p-3 text-center">
              <p className="text-sm font-bold">{item.name}</p>
              <p className="text-xs text-muted">{item.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ===== セットアップ ===== */}
      <Section title="セットアップ">
        <Step num={1} title="Google Earth Engineに登録">
          <p>
            <a
              href="https://earthengine.google.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent underline"
            >
              earthengine.google.com
            </a>
            からGoogleアカウントでGEEに登録します。
          </p>
        </Step>
        <Step num={2} title="ツールのコードを取得">
          <p>以下のリンクをクリックすると、ScriptsのReaderに洪水直接被害計算ツールが追加されます。</p>
          <a
            href="https://code.earthengine.google.com/?accept_repo=users/kurihara-yt/MyProject10"
            target="_blank"
            rel="noopener noreferrer"
            className="my-2 inline-block rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            ツールを取得 &rarr;
          </a>
          <Screenshot
            src={img("setup_01_add_repo.jpg")}
            alt="Add repository ダイアログ: Accept を押してリポジトリを追加"
          />
          <Screenshot
            src={img("setup_02_scripts_panel.jpg")}
            alt="Scriptsパネルの Reader に users/kurihara-yt/MyProject10 が追加され、FloodDirectDamage と LandUseMapping の2つのスクリプトが表示される"
            narrow
          />
          <Tip>権限がない場合は kurihara-yt@ocglobal.jp まで連絡してください。</Tip>
        </Step>
      </Section>

      {/* ===== 01 LULC ===== */}
      <Section title="01 LandUseMapping（土地利用図作成）">
        <p className="mb-4 text-sm text-muted">
          Random Forestを用いてフィリピンの土地利用図を作成するスクリプトです。
          6分類（水田・トウモロコシ・森林・裸地・都市・水域）に分類します。
          全国360ポイントの教師データが組み込まれているため、
          ユーザー自身で教師データを用意する必要はありません。
        </p>

        <Step num={1} title="スクリプトを開く">
          <p>
            左のScriptsパネルから
            <code className="rounded bg-[#f3f4f6] px-1 text-xs dark:bg-[#334155]">users/kurihara-yt/MyProject10/LandUseMapping</code>
            を開くと、UIパネルが表示されます。
          </p>
          <Screenshot
            src={img("lulc_01_ui.jpg")}
            alt="LandUseMappingの初期UI画面。地域選択・解析年・雲被覆率閾値・実行ボタンが表示される"
          />
        </Step>

        <Step num={2} title="解析地域を選択">
          <p>ドロップダウンからフィリピンの行政地域を選びます。</p>
          <Screenshot
            src={img("lulc_02_region_list.jpg")}
            alt="Region選択ドロップダウン: 16地域 + Custom (Draw on map)"
            narrow
          />
          <ul className="ml-4 mt-1 list-disc space-y-1">
            <li>Region I〜XIII、BARMM、CAR、NCRから選択可能</li>
            <li>「Custom (Draw on map)」を選ぶと地図上にジオメトリを描画できる</li>
          </ul>
        </Step>

        <Step num={3} title="解析年と雲被覆率を設定">
          <p>
            解析年は2017〜2025年、雲被覆率閾値は5〜50%の範囲でスライダーから選びます。
            雲被覆率の推奨値は20%です。
          </p>
        </Step>

        <Step num={4} title="実行ボタンを押す">
          <p>
            「実行」ボタンを押すと、分類処理が開始されます。
            Sentinel-1 SAR + Landsat-8の季節別データで特徴量を構築し、
            500本の決定木でRandom Forestを学習、選択地域のみに分類結果をクリップして表示します。
          </p>
          <Screenshot
            src={img("lulc_03_result.jpg")}
            alt="LULC分類結果: Region II Cagayan Valley の6分類マップ。UIパネルに全体精度・カッパ係数・各クラスの分類精度が表示される"
          />
        </Step>

        <Step num={5} title="Tasksタブでエクスポートを実行">
          <p>
            画面右の<strong className="text-foreground">Tasks</strong>タブを開き、
            <code className="rounded bg-[#f3f4f6] px-1 text-xs dark:bg-[#334155]">LULC</code>
            の<strong className="text-foreground">RUN</strong>ボタンを押します。
          </p>
          <Screenshot
            src={img("lulc_04_tasks.jpg")}
            alt="Tasksタブに LULC のエクスポートタスクが表示される"
            narrow
          />
          <p className="mt-2">
            エクスポート設定ダイアログで、スケール30m・GeoTIFF形式・Drive出力を確認して
            <strong className="text-foreground">RUN</strong>を押します。
          </p>
          <Screenshot
            src={img("lulc_05_export_dialog.jpg")}
            alt="Initiate image export ダイアログ: Task name=LULC, Scale=30, File format=GEO_TIFF"
            narrow
          />
        </Step>

        <div className="mt-4 rounded-md border border-border bg-[#f3f4f6] p-4 dark:bg-[#1e293b]">
          <p className="mb-1 text-xs font-bold">説明変数（計42変数）</p>
          <p className="text-xs text-muted">
            Sentinel-1（VV/VH × 3季節 = 6）、Landsat-8（SR_B1-B7 + NDVI/EVI/NDWI/MNDWI × 3季節 = 33）、
            MERIT Hydro地形（標高・傾斜・集水面積 = 3）
          </p>
        </div>
      </Section>

      {/* ===== Assetへのアップロード ===== */}
      <Section title="土地利用図をAssetにアップロード">
        <p className="mb-4 text-sm text-muted">
          エクスポートしたLULCマップは、02のスクリプトで参照するために
          GEE Assetにアップロードする必要があります。
        </p>

        <Step num={1} title="Assetsタブを開いて NEW をクリック">
          <p>
            画面左の<strong className="text-foreground">Assets</strong>タブを開き、
            赤い<strong className="text-foreground">NEW</strong>ボタンから
            <strong className="text-foreground">GeoTIFF</strong>を選択します。
          </p>
          <Screenshot
            src={img("asset_01_new.jpg")}
            alt="Assetsタブの NEW ボタンから GeoTIFF を選択"
            narrow
          />
        </Step>

        <Step num={2} title="ファイルを選択">
          <p>Upload画面で SELECT ボタンを押し、先ほどDriveからダウンロードしたLULC.tifを指定します。</p>
          <Screenshot
            src={img("asset_02_upload.jpg")}
            alt="Upload a new image asset 画面の SELECT ボタン"
            narrow
          />
          <Screenshot
            src={img("asset_03_file_select.jpg")}
            alt="ファイル選択ダイアログで LULC.tif を選ぶ"
          />
        </Step>

        <Step num={3} title="Asset IDを設定してUPLOAD">
          <p>
            Asset IDの「Asset Name」欄に
            <code className="rounded bg-[#f3f4f6] px-1 text-xs dark:bg-[#334155]">LULC</code>
            と入力し、<strong className="text-foreground">UPLOAD</strong>を押します。
            Asset IDは
            <code className="rounded bg-[#f3f4f6] px-1 text-xs dark:bg-[#334155]">projects/ee-<span className="font-bold">[user-id]</span>/assets/LULC</code>
            の形式になります。
          </p>
          <Screenshot
            src={img("asset_04_asset_id.jpg")}
            alt="Asset ID の設定と UPLOAD ボタン"
            narrow
          />
        </Step>

        <Step num={4} title="アップロード完了を確認">
          <p>AssetsタブのCLOUD ASSETS配下に LULC が表示されれば完了です。</p>
          <Screenshot
            src={img("asset_05_uploaded.jpg")}
            alt="CLOUD ASSETS に LULC がアップロードされた状態"
            narrow
          />
          <Tip>
            自分のuser-idは、画面右上のGoogleアカウントアイコンの隣に表示されています。
          </Tip>
        </Step>
      </Section>

      {/* ===== 02 Flood Direct Damage ===== */}
      <Section title="02 FloodDirectDamage（洪水被害額計算）">
        <p className="mb-4 text-sm text-muted">
          SAR画像から浸水範囲を検出し、FwDETで浸水深を推定、
          建物・農作物の直接被害額を算定するスクリプトです。
          01で作成した土地利用図をAsset経由で参照します。
        </p>

        <Step num={1} title="スクリプトを開く">
          <p>
            <code className="rounded bg-[#f3f4f6] px-1 text-xs dark:bg-[#334155]">users/kurihara-yt/MyProject10/FloodDirectDamage</code>
            を開きます。
          </p>
          <Screenshot
            src={img("fdd_01_ui.jpg")}
            alt="FloodDirectDamage の UI パネル: 浸水データ入力、洪水発生日、比較画像日、衛星軌道、偏波、洪水検出閾値"
            narrow
          />
        </Step>

        <Step num={2} title="日付・SARパラメータを設定">
          <ul className="ml-4 list-disc space-y-1">
            <li><strong className="text-foreground">浸水データ入力</strong>: 「SAR画像から自動生成」か「Assetから読み込み」を選択</li>
            <li><strong className="text-foreground">洪水発生日 (After)</strong>: 解析対象の災害日</li>
            <li><strong className="text-foreground">比較画像日 (Before)</strong>: 災害前の基準日（雨が降っていない日を推奨）</li>
            <li><strong className="text-foreground">衛星軌道</strong>: ASCENDING / DESCENDING</li>
            <li><strong className="text-foreground">偏波</strong>: VV（推奨）/ VH</li>
            <li><strong className="text-foreground">洪水検出閾値</strong>: 推奨 1.15</li>
          </ul>
        </Step>

        <Step num={3} title="土地利用図Asset IDと解析範囲を設定">
          <p>
            前のセクションでアップロードしたLULC AssetのIDを入力します。
            解析範囲は行政区域（Region → Province → Municipality）から選択するか、
            地図上にジオメトリを描画します。
          </p>
          <Screenshot
            src={img("fdd_02_admin.jpg")}
            alt="土地利用図 Asset ID と 解析範囲の選択 (Region / Province / Municipality)"
            narrow
          />
          <Tip>
            自分のuser-idはScreenshotのように画面右上で確認できます。
            Asset IDの user-id の部分を自分のIDに差し替えてください。
          </Tip>
          <Screenshot
            src={img("fdd_03_userid.jpg")}
            alt="画面右上に表示されるuser-id"
            narrow
          />
        </Step>

        <Step num={4} title="実行ボタンを押す">
          <p>「実行」ボタンを押すと、以下が自動で処理されます。</p>
          <ul className="ml-4 mt-1 list-disc space-y-1">
            <li>SAR画像から浸水範囲の検出（NDFI + 恒常水域除外 + 傾斜フィルタ）</li>
            <li>FwDETによる浸水深推定</li>
            <li>Open Buildings V3から建物ポリゴン取得、浸水深で被害率計算</li>
            <li>土地利用図から水田・トウモロコシ畑を抽出し、被害曲線適用</li>
            <li>被害額を集計し、バーチャート・パイチャートで表示</li>
          </ul>
        </Step>

        <Step num={5} title="結果を確認">
          <p>
            UIパネル、マップ左下のチャートパネル、マップ右下の浸水深凡例に結果が表示されます。
          </p>
          <Screenshot
            src={img("fdd_04_result.jpg")}
            alt="解析結果画面: 浸水深マップ（青）、土地利用別浸水面積バーチャート、セクター別被害額パイチャート、合計被害額、浸水面積、各セクターの被害額"
          />
          <ul className="ml-4 mt-1 list-disc space-y-1">
            <li>浸水面積、住宅被害、コメ被害、トウモロコシ被害、合計被害額</li>
            <li>土地利用別浸水面積のバーチャート</li>
            <li>セクター別被害額のパイチャート</li>
          </ul>
        </Step>

        <Step num={6} title="結果をエクスポート">
          <p>Tasksタブから以下のファイルをダウンロードできます。</p>
          <ul className="ml-4 mt-1 list-disc space-y-1">
            <li><code className="rounded bg-[#f3f4f6] px-1 text-xs dark:bg-[#334155]">Flood_extent</code> — 浸水範囲（GeoTIFF）</li>
            <li><code className="rounded bg-[#f3f4f6] px-1 text-xs dark:bg-[#334155]">Flood_depth</code> — 浸水深（GeoTIFF）</li>
            <li><code className="rounded bg-[#f3f4f6] px-1 text-xs dark:bg-[#334155]">Flood_extent_vector</code> — 浸水範囲（KML）</li>
            <li><code className="rounded bg-[#f3f4f6] px-1 text-xs dark:bg-[#334155]">AOI</code> — 解析範囲（SHP）</li>
          </ul>
        </Step>
      </Section>

      {/* ===== 被害曲線 ===== */}
      <Section title="被害曲線">
        <p className="mb-3 text-sm text-muted">
          本ツールで使用している被害曲線は、浸水深と被害率の関係を示すシグモイド関数です。
          住宅、コメ、トウモロコシのそれぞれに対して、文献に基づいて調整されています。
        </p>
        <Screenshot
          src={img("damage_curve.jpg")}
          alt="住宅（赤）、コメ（黄緑）、トウモロコシ（黄）の被害曲線。横軸: 浸水深 (m)、縦軸: 被害率"
        />
        <ul className="mt-3 ml-4 list-disc space-y-1 text-xs text-muted">
          <li><strong className="text-foreground">住宅</strong>: GMMA-RAP (2014) シグモイド関数 × 10,300 PhP/m²</li>
          <li><strong className="text-foreground">コメ</strong>: Shrestha et al. (2016) × 69.6 千PhP/ha</li>
          <li><strong className="text-foreground">トウモロコシ</strong>: Tariq et al. (2021) × 45.9 千PhP/ha</li>
        </ul>
      </Section>

      {/* ===== データソース ===== */}
      <Section title="使用データソース">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr>
                <th className="border border-border bg-[#1e3a5f] px-3 py-2 text-left text-white">データ</th>
                <th className="border border-border bg-[#1e3a5f] px-3 py-2 text-left text-white">用途</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Sentinel-1 GRD", "SAR画像（浸水範囲・変数作成）"],
                ["Landsat-8 SR", "光学衛星画像（LULC変数）"],
                ["Copernicus DEM GLO-30", "浸水深推定（FwDET）"],
                ["WWF HydroSHEDS", "傾斜フィルタ"],
                ["JRC Global Surface Water", "恒常的水域の除外"],
                ["MERIT Hydro", "地形変数（標高・傾斜・集水面積）"],
                ["Open Buildings V3", "建物ポリゴン（住宅被害）"],
                ["ESA WorldCover", "参照土地被覆"],
                ["FAO GAUL Level2", "行政境界（Province）"],
                ["users/kurihara-yt/Philippines_MuniCities", "市町村境界"],
              ].map(([name, use], i) => (
                <tr key={name} className={i % 2 === 0 ? "bg-[#f0f4f8] dark:bg-[#1e293b]" : ""}>
                  <td className="border border-border px-3 py-2 font-medium">{name}</td>
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

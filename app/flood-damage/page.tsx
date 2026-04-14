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

function Screenshot({ src, alt, narrow }: { src: string; alt: string; narrow?: boolean }) {
  return (
    <figure className={`my-4 ${narrow ? "mx-auto max-w-xs" : ""}`}>
      <Image
        src={src}
        alt={alt}
        width={narrow ? 400 : 1200}
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
              name: "01 LULC Random Forest",
              desc: "全国教師データを用いたランダムフォレストによる土地利用図の作成",
            },
            {
              name: "02 Flood Direct Damage",
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
            <a href="https://earthengine.google.com/" target="_blank" rel="noopener noreferrer" className="text-accent underline">
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
          <p className="mt-2">
            ScriptsのReaderに <code className="rounded bg-[#f3f4f6] px-1.5 py-0.5 text-xs dark:bg-[#334155]">users/kurihara-yt/MyProject10</code> が表示されれば完了です。
            以下の2つのスクリプトが使用可能になります。
          </p>
          <ul className="ml-4 mt-2 list-disc space-y-1">
            <li><code className="rounded bg-[#f3f4f6] px-1 text-xs dark:bg-[#334155]">01_LULC_RandomForest</code></li>
            <li><code className="rounded bg-[#f3f4f6] px-1 text-xs dark:bg-[#334155]">02_Flood_DirectDamage</code></li>
          </ul>
          <Tip>
            権限がない場合は kurihara-yt@ocglobal.jp まで連絡してください。
          </Tip>
        </Step>
      </Section>

      {/* ===== 01 LULC ===== */}
      <Section title="01 LULC Random Forest（土地利用図作成）">
        <p className="mb-4 text-sm text-muted">
          Random Forestを用いてフィリピンの土地利用図を作成するスクリプトです。
          6分類（水田・トウモロコシ・森林・裸地・都市・水域）に分類します。
          全国360ポイントの教師データが組み込まれているため、
          ユーザー自身で教師データを用意する必要はありません。
        </p>

        <Step num={1} title="解析地域を選択">
          <p>左のUIパネルから、解析対象の地域を選びます。</p>
          <ul className="ml-4 mt-1 list-disc space-y-1">
            <li>フィリピンの16地域（Region I〜XIII、BARMM、CAR、NCR）から選択可能</li>
            <li>「Custom (Draw on map)」を選ぶと地図上にジオメトリを描画できる</li>
          </ul>
        </Step>

        <Step num={2} title="解析年を選択">
          <p>2017年〜2025年の範囲でスライダーから解析年を選びます。</p>
        </Step>

        <Step num={3} title="雲被覆率閾値を設定">
          <p>Sentinel-2光学画像の雲被覆率の上限（5〜50%）を設定します。デフォルトは20%です。</p>
        </Step>

        <Step num={4} title="実行ボタンを押す">
          <p>「実行」ボタンを押すと、分類処理が開始されます。</p>
          <ul className="ml-4 mt-1 list-disc space-y-1">
            <li>Sentinel-1 SAR + Landsat-8の季節別データで特徴量を構築</li>
            <li>500本の決定木でRandom Forestを学習</li>
            <li>選択地域のみに分類結果をクリップして表示</li>
          </ul>
        </Step>

        <Step num={5} title="結果を確認">
          <p>UIパネルに以下が表示されます。</p>
          <ul className="ml-4 mt-1 list-disc space-y-1">
            <li>全体精度（Overall Accuracy）</li>
            <li>カッパ係数（Kappa）</li>
            <li>各土地利用タイプの分類精度</li>
          </ul>
        </Step>

        <Step num={6} title="土地利用図をエクスポート">
          <p>
            Tasksタブから <code className="rounded bg-[#f3f4f6] px-1 text-xs dark:bg-[#334155]">LULC</code> をクリックし、
            Google DriveにGeoTIFF形式で保存します。
          </p>
          <Tip>
            エクスポートしたLULCマップは、Assetとしてアップロードし、02のスクリプトで参照して使用します。
            Asset ID は <code className="rounded bg-[#f3f4f6] px-1 text-xs dark:bg-[#334155]">projects/user-id/assets/LULC</code> の形式で指定します。
          </Tip>
        </Step>

        <div className="mt-4 rounded-md border border-border bg-[#f3f4f6] p-4 dark:bg-[#1e293b]">
          <p className="mb-1 text-xs font-bold">説明変数（計42変数）</p>
          <p className="text-xs text-muted">
            Sentinel-1（VV/VH × 3季節 = 6）、Landsat-8（SR_B1-B7 + NDVI/EVI/NDWI/MNDWI × 3季節 = 33）、
            MERIT Hydro地形（標高・傾斜・集水面積 = 3）
          </p>
        </div>
      </Section>

      {/* ===== 02 Flood Direct Damage ===== */}
      <Section title="02 Flood Direct Damage（洪水被害額計算）">
        <p className="mb-4 text-sm text-muted">
          SAR画像から浸水範囲を検出し、FwDETで浸水深を推定、
          建物・農作物の直接被害額を算定するスクリプトです。
          01で作成した土地利用図をAsset経由で参照します。
        </p>

        <Step num={1} title="浸水データの入力方式を選択">
          <p>2つの方式から選択します。</p>
          <ul className="ml-4 mt-1 list-disc space-y-1">
            <li><strong className="text-foreground">SAR画像から自動生成</strong> — Sentinel-1 SAR画像を解析して浸水範囲・浸水深を自動計算</li>
            <li><strong className="text-foreground">Assetから読み込み</strong> — 既に作成済みの浸水範囲・浸水深ラスタをAssetとして読み込み</li>
          </ul>
        </Step>

        <Step num={2} title="日付・パラメータを設定（SAR自動生成の場合）">
          <ul className="ml-4 list-disc space-y-1">
            <li><strong className="text-foreground">洪水発生日 (After)</strong> — 解析対象の災害日</li>
            <li><strong className="text-foreground">比較画像日 (Before)</strong> — 災害前の基準日（雨が降っていない日を推奨）</li>
            <li><strong className="text-foreground">衛星軌道</strong> — Ascending / Descending</li>
            <li><strong className="text-foreground">偏波</strong> — VV（推奨）/ VH</li>
            <li><strong className="text-foreground">洪水検出閾値</strong> — デフォルト1.15</li>
          </ul>
        </Step>

        <Step num={3} title="土地利用図Asset IDを入力">
          <p>
            01で作成した土地利用図のAsset IDを入力します。
            例: <code className="rounded bg-[#f3f4f6] px-1 text-xs dark:bg-[#334155]">projects/user-id/assets/LULC</code>
          </p>
        </Step>

        <Step num={4} title="解析範囲を指定">
          <p>2つの方式から選択します。</p>
          <ul className="ml-4 mt-1 list-disc space-y-1">
            <li><strong className="text-foreground">行政区域から選択</strong> — Region → Province → Municipality のドロップダウンで選択</li>
            <li><strong className="text-foreground">ジオメトリを描画</strong> — 地図上に任意の範囲を描画</li>
          </ul>
        </Step>

        <Step num={5} title="実行">
          <p>「実行」ボタンを押すと、以下が自動で実行されます。</p>
          <ul className="ml-4 mt-1 list-disc space-y-1">
            <li>SAR画像から浸水範囲の検出（NDFI + 恒常水域除外 + 傾斜フィルタ）</li>
            <li>FwDETによる浸水深推定</li>
            <li>Open Buildings V3から建物ポリゴン取得、浸水深で被害率計算</li>
            <li>土地利用図から水田・トウモロコシ畑を抽出し、被害曲線適用</li>
            <li>被害額を集計し、バーチャート・パイチャートで表示</li>
          </ul>
        </Step>

        <Step num={6} title="結果を確認">
          <p>UIパネルとマップ左下のメッセージパネルに以下が表示されます。</p>
          <ul className="ml-4 mt-1 list-disc space-y-1">
            <li>浸水面積</li>
            <li>住宅被害額</li>
            <li>コメ被害額</li>
            <li>トウモロコシ被害額</li>
            <li>合計被害額</li>
            <li>土地利用別浸水面積のバーチャート</li>
            <li>セクター別被害額のパイチャート</li>
          </ul>
        </Step>

        <Step num={7} title="結果をエクスポート">
          <p>Tasksタブから以下のファイルをダウンロードできます。</p>
          <ul className="ml-4 mt-1 list-disc space-y-1">
            <li><code className="rounded bg-[#f3f4f6] px-1 text-xs dark:bg-[#334155]">Flood_extent</code> — 浸水範囲（GeoTIFF）</li>
            <li><code className="rounded bg-[#f3f4f6] px-1 text-xs dark:bg-[#334155]">Flood_depth</code> — 浸水深（GeoTIFF）</li>
            <li><code className="rounded bg-[#f3f4f6] px-1 text-xs dark:bg-[#334155]">Flood_extent_vector</code> — 浸水範囲（KML）</li>
            <li><code className="rounded bg-[#f3f4f6] px-1 text-xs dark:bg-[#334155]">AOI</code> — 解析範囲（SHP）</li>
          </ul>
        </Step>

        <div className="mt-4 rounded-md border border-border bg-[#f3f4f6] p-4 dark:bg-[#1e293b]">
          <p className="mb-2 text-xs font-bold">被害曲線</p>
          <ul className="ml-4 list-disc space-y-1 text-xs text-muted">
            <li><strong className="text-foreground">住宅</strong>: GMMA-RAP (2014) シグモイド関数 × 10,300 PhP/m²</li>
            <li><strong className="text-foreground">水田</strong>: Shrestha et al. (2016) × 69.6 千PhP/ha</li>
            <li><strong className="text-foreground">トウモロコシ</strong>: Tariq et al. (2021) × 45.9 千PhP/ha</li>
          </ul>
        </div>
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
                ["WorldPop", "人口分布（被災人口推定）"],
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

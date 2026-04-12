import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "SAR-DAT Manual | MyProject",
};

const IMG = process.env.__NEXT_ROUTER_BASEPATH || "";
const img = (name: string) => `${IMG}/images/sar-dat/${name}`;

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

export default function SarDatPage() {
  return (
    <div className="mx-auto max-w-[960px] px-4 py-10">
      <header className="mb-10 border-b-[3px] border-accent pb-4 text-center">
        <h1 className="mb-1 text-2xl font-bold text-[#1e3a5f] dark:text-accent">
          SAR-DAT 使用マニュアル
        </h1>
        <p className="text-sm text-muted">
          SAR Satellite Disaster Analysis Tool (ver.0)
        </p>
        <p className="mt-1 text-xs text-muted">
          オリエンタルコンサルタンツグローバル 水資源・防災部
        </p>
      </header>

      {/* ===== 概要 ===== */}
      <Section title="概要">
        <p className="mb-3 text-sm text-muted">
          SAR-DAT（SAR Satellite Disaster Analysis Tool）は、Google Earth Engine（GEE）上でSAR衛星画像（Sentinel-1）を用いて、
          過去の災害被害を可視化するツールです。UIパネルから操作でき、コードの知識は不要です。
        </p>
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { name: "01 Flood Analysis", desc: "洪水範囲の検出" },
            { name: "02 Landslide Analysis", desc: "土砂崩れ範囲の検出" },
            { name: "03 Damage Analysis", desc: "建物被害範囲の検出" },
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
        <Step num={2} title="SAR-DATのコードを取得">
          <p>以下のリンクをクリックすると、ScriptsのReaderにSAR-DATが追加されます。</p>
          <a
            href="https://code.earthengine.google.com/?accept_repo=users/kurihara-yt/MyProject1"
            target="_blank"
            rel="noopener noreferrer"
            className="my-2 inline-block rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            SAR-DATを取得 &rarr;
          </a>
          <Screenshot
            src={img("slide04_0.jpg")}
            alt="Scriptsパネルに users/kurihara-yt/MyProject1 が追加された状態"
            narrow
          />
          <Tip>権限がない場合は kurihara-yt@ocglobal.jp まで連絡してください。</Tip>
        </Step>
      </Section>

      {/* ===== 基本操作 ===== */}
      <Section title="基本操作">
        <Screenshot
          src={img("slide06_0.jpg")}
          alt="GEE初期画面。左のScriptsパネルに3つの解析スクリプトが表示されている"
        />
        <Step num={1} title="解析ツールを選択">
          <p>左のScriptsパネルから使用する解析スクリプトをクリックして開きます。</p>
          <ul className="ml-4 mt-1 list-disc space-y-1">
            <li><code className="rounded bg-[#f3f4f6] px-1 text-xs dark:bg-[#334155]">01_Flood_Analysis</code></li>
            <li><code className="rounded bg-[#f3f4f6] px-1 text-xs dark:bg-[#334155]">02_Landslide_Analysis</code></li>
            <li><code className="rounded bg-[#f3f4f6] px-1 text-xs dark:bg-[#334155]">03_Damage_Analysis</code></li>
          </ul>
        </Step>
        <Step num={2} title="解析範囲を囲む">
          <p>地図上でポリゴンツールを使い、解析対象範囲を描画します。</p>
          <Tip>ジオメトリは1つまでです。</Tip>
        </Step>
        <Step num={3} title="Runを押す">
          <p>画面上部の<strong className="text-foreground">Run</strong>ボタンを押すと、UIパネルが表示されます。解析範囲を変更した場合は、毎回Runを押し直してください。</p>
        </Step>
      </Section>

      {/* ===== Flood Analysis ===== */}
      <Section title="01 Flood Analysis（洪水解析）">
        <Step num={1} title="パラメータを設定">
          <Screenshot
            src={img("slide07_0.jpg")}
            alt="Flood Analysis: パラメータ設定画面。左のUIパネルで日付・軌道・偏波・閾値を設定し、地図上にジオメトリで範囲を指定"
          />
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-xs">
              <thead>
                <tr>
                  <th className="border border-border bg-[#1e3a5f] px-3 py-2 text-left text-white">パラメータ</th>
                  <th className="border border-border bg-[#1e3a5f] px-3 py-2 text-left text-white">説明</th>
                  <th className="border border-border bg-[#1e3a5f] px-3 py-2 text-left text-white">推奨値</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["洪水発生日（After）", "解析対象の災害発生日", "-"],
                  ["比較画像日（Before）", "災害前の基準日。雨が降っていない日を選択", "-"],
                  ["衛星軌道", "Ascending / Descending（画像取得日時が異なるため両方試す）", "両方"],
                  ["偏波", "VV / VH", "VV"],
                  ["閾値（Threshold）", "洪水検出の感度。下げると範囲拡大", "1.15"],
                ].map(([p, d, r], i) => (
                  <tr key={p} className={i % 2 === 0 ? "bg-[#f0f4f8] dark:bg-[#1e293b]" : ""}>
                    <td className="border border-border px-3 py-2 font-medium">{p}</td>
                    <td className="border border-border px-3 py-2">{d}</td>
                    <td className="border border-border px-3 py-2">{r}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Step>
        <Step num={2} title="Applyを押して結果を確認">
          <Screenshot
            src={img("slide08_0.jpg")}
            alt="Flood Analysis 結果: フィリピンCagayan地域の洪水範囲（紫色）が地図上に表示。右側にResultsパネルで浸水面積・被災人口の概算値"
          />
          <p>マップ上に洪水範囲（紫色）が表示されます。右側のResultsパネルには浸水面積・被災人口などの概算値が表示されます。</p>
        </Step>
        <Step num={3} title="Consoleで使用データを確認">
          <Screenshot
            src={img("slide09_0.jpg")}
            alt="Console画面: Sentinel-1/2の撮影日・画像枚数など使用データのプロパティが確認できる"
            narrow
          />
          <p>Consoleタブで、解析に使用されたSentinel-1/2画像の撮影日・枚数等を確認できます。</p>
        </Step>
        <Step num={4} title="結果をエクスポート">
          <p>
            <strong className="text-foreground">Tasks</strong>タブからKML / GeoTIFF形式でダウンロード可能。Google Driveに自動保存されます。
          </p>
          <Tip>解像度は最大10mですが、解析範囲が広すぎると解像度が下がります。</Tip>
        </Step>

        <div className="mt-4 rounded-md border border-border bg-[#f3f4f6] p-4 dark:bg-[#1e293b]">
          <p className="mb-1 text-xs font-bold">検出アルゴリズム</p>
          <p className="font-mono text-xs text-muted">
            反射強度変化 = δ<sub>after</sub> / δ<sub>before</sub>
          </p>
          <p className="mt-1 text-xs text-muted">
            比率 &lt; 1.15（閾値）→ 洪水と判定。恒常的水域・傾斜5°以上は除外。
          </p>
        </div>
      </Section>

      {/* ===== Landslide Analysis ===== */}
      <Section title="02 Landslide Analysis（土砂崩れ解析）">
        <p className="mb-4 text-sm text-muted">
          光学衛星（Sentinel-2）の<strong className="text-foreground">NDVI（植生指数）の変化</strong>を利用して土砂崩れ範囲を検出します。
          土砂崩れが発生すると植生が失われNDVIが低下するため、災害前後のNDVI差分から崩壊箇所を特定します。
        </p>
        <Step num={1} title="パラメータを設定">
          <Screenshot
            src={img("slide10_0.jpg")}
            alt="Landslide Analysis: パラメータ設定画面。発生日・Slope・Curvature・雲被覆閾値を設定"
          />
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-xs">
              <thead>
                <tr>
                  <th className="border border-border bg-[#1e3a5f] px-3 py-2 text-left text-white">パラメータ</th>
                  <th className="border border-border bg-[#1e3a5f] px-3 py-2 text-left text-white">説明</th>
                  <th className="border border-border bg-[#1e3a5f] px-3 py-2 text-left text-white">推奨値</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["発生日", "土砂崩れ発生日", "-"],
                  ["Slope", "斜度閾値（°）。設定値以上の斜面のみ解析対象", "5"],
                  ["Curvature", "曲率半径（m）。上げると解析範囲が広がる", "200"],
                  ["Cloud Probability", "雲被覆率の閾値（%）。これ以上の画像は除外", "50"],
                ].map(([p, d, r], i) => (
                  <tr key={p} className={i % 2 === 0 ? "bg-[#f0f4f8] dark:bg-[#1e293b]" : ""}>
                    <td className="border border-border px-3 py-2 font-medium">{p}</td>
                    <td className="border border-border px-3 py-2">{d}</td>
                    <td className="border border-border px-3 py-2">{r}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Step>
        <Step num={2} title="Applyを押して結果を確認">
          <Screenshot
            src={img("slide11_0.jpg")}
            alt="Landslide Analysis 結果: 2018年北海道胆振東部地震による厚真町の土砂崩れ範囲（赤色）。光学衛星画像と重ねて表示"
          />
          <p>土砂崩れ範囲が赤色で表示されます。上の例は2018年北海道胆振東部地震による厚真町の土砂崩れです。</p>
        </Step>

        <div className="mt-4 rounded-md border border-border bg-[#f3f4f6] p-4 dark:bg-[#1e293b]">
          <p className="mb-2 text-xs font-bold">検出アルゴリズム</p>
          <p className="font-mono text-xs text-muted">
            NDVI差分 = NDVI<sub>after</sub> - NDVI<sub>before</sub>
          </p>
          <p className="mt-2 text-xs text-muted">
            災害前後各最長1年間のSentinel-2画像をモザイク合成し、雲を除去した上でNDVIを計算。
            NDVI差分 &gt; 0.25 の領域を土砂崩れ候補として抽出。さらに以下の条件でフィルタリング：
          </p>
          <ul className="ml-4 mt-1 list-disc text-xs text-muted">
            <li>森林域のみを対象（非森林域は除外）</li>
            <li>MNDWI &gt; 0（水域）または BSI &gt; 0.05（裸地）の場合、土砂崩れと判定</li>
            <li>Slope ≤ 5°、Curvature半径 ≤ 200m の領域は除外</li>
          </ul>
        </div>
      </Section>

      {/* ===== Damage Analysis ===== */}
      <Section title="03 Damage Analysis（建物被害解析）">
        <Step num={1} title="パラメータを設定">
          <Screenshot
            src={img("slide13_0.jpg")}
            alt="Damage Analysis: パラメータ設定画面。災害発生日・比較画像日・軌道・偏波・閾値を設定"
          />
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-xs">
              <thead>
                <tr>
                  <th className="border border-border bg-[#1e3a5f] px-3 py-2 text-left text-white">パラメータ</th>
                  <th className="border border-border bg-[#1e3a5f] px-3 py-2 text-left text-white">説明</th>
                  <th className="border border-border bg-[#1e3a5f] px-3 py-2 text-left text-white">推奨値</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["災害発生日（After）", "解析対象の日付", "-"],
                  ["比較画像日（Before）", "災害前の基準日", "-"],
                  ["衛星軌道", "両方試す（建物の両側面を観測するため）", "両方"],
                  ["偏波", "VV / VH", "VV"],
                  ["閾値", "検出感度。上げると範囲が狭まる", "2"],
                ].map(([p, d, r], i) => (
                  <tr key={p} className={i % 2 === 0 ? "bg-[#f0f4f8] dark:bg-[#1e293b]" : ""}>
                    <td className="border border-border px-3 py-2 font-medium">{p}</td>
                    <td className="border border-border px-3 py-2">{d}</td>
                    <td className="border border-border px-3 py-2">{r}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Step>
        <Step num={2} title="Applyを押して結果を確認">
          <Screenshot
            src={img("slide14_0.jpg")}
            alt="Damage Analysis 結果: 2023年トルコ・シリア地震によるKahramanmaras市の建物被害範囲。衛星画像と重ねて表示"
          />
          <p>
            建物被害範囲が表示されます。上の例は2023年トルコ・シリア地震によるKahramanmaras市の建物倒壊検出結果です。
            農地・湿地・森林は自動で除外されます。
          </p>
          <Tip>
            建物被害の場合、反射強度が上がることも下がることもあります（建物倒壊による二重散乱の変化）。
            Ascending・Descending両方で解析すると死角をなくせます。
          </Tip>
        </Step>

        <div className="mt-4 rounded-md border border-border bg-[#f3f4f6] p-4 dark:bg-[#1e293b]">
          <p className="mb-1 text-xs font-bold">検出アルゴリズム</p>
          <p className="font-mono text-xs text-muted">
            反射強度変化 = δ<sub>after</sub> / δ<sub>before</sub>
          </p>
          <p className="mt-1 text-xs text-muted">
            変化の絶対値が閾値（デフォルト2.0）を超えた場合、建物被害と判定。
          </p>
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
                ["Sentinel-1 GRD", "SAR画像（浸水域・土砂崩れ・建物被害の検出）"],
                ["Sentinel-2", "光学衛星画像（参照用）"],
                ["JRC Global Surface Water", "恒常的水域の除外"],
                ["HydroSHEDS DEM / SRTM", "傾斜・標高データ"],
                ["ESA WorldCover", "土地利用マップ"],
                ["WorldPop", "人口分布データ"],
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

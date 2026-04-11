import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SAR-DAT Manual | MyProject",
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
    <div className="mb-5">
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

      <Section title="概要">
        <p className="mb-3 text-sm text-muted">
          SAR-DATは、Google Earth Engine（GEE）上でSAR衛星画像（Sentinel-1）を用いて、
          過去の災害被害を可視化するツールです。以下の3種類の解析が可能です。
        </p>
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { name: "Flood Analysis", desc: "洪水範囲の検出" },
            { name: "Landslide Analysis", desc: "土砂崩れ範囲の検出" },
            { name: "Damage Analysis", desc: "建物被害範囲の検出" },
          ].map((item) => (
            <div key={item.name} className="rounded-md border border-border p-3 text-center">
              <p className="text-sm font-bold">{item.name}</p>
              <p className="text-xs text-muted">{item.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="セットアップ">
        <Step num={1} title="Google Earth Engineに登録する">
          <p>
            <a href="https://earthengine.google.com/" target="_blank" rel="noopener noreferrer" className="text-accent underline">
              https://earthengine.google.com/
            </a>
            {" "}からGoogleアカウントでGEEに登録します。
          </p>
        </Step>
        <Step num={2} title="SAR-DATのコードを取得する">
          <p>以下のURLをクリックすると、GEEのScriptsにSAR-DATが追加されます。</p>
          <a
            href="https://code.earthengine.google.com/?accept_repo=users/kurihara-yt/MyProject1"
            target="_blank"
            rel="noopener noreferrer"
            className="my-2 inline-block rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            SAR-DATを取得 &rarr;
          </a>
          <p className="mt-2">
            ScriptsのReaderに <code className="rounded bg-[#f3f4f6] px-1.5 py-0.5 text-xs dark:bg-[#334155]">users/kurihara-yt/MyProject1</code> が表示されれば完了です。
          </p>
          <Tip>
            権限がない場合は kurihara-yt@ocglobal.jp まで連絡してください。
          </Tip>
        </Step>
      </Section>

      <Section title="基本操作">
        <Step num={1} title="解析ツールを選択">
          <p>UIパネルから解析種類を選びます。</p>
          <ul className="ml-4 mt-1 list-disc space-y-1">
            <li><code className="rounded bg-[#f3f4f6] px-1 text-xs dark:bg-[#334155]">01 Flood Analysis</code> — 洪水解析</li>
            <li><code className="rounded bg-[#f3f4f6] px-1 text-xs dark:bg-[#334155]">02 Landslide Analysis</code> — 土砂崩れ解析</li>
            <li><code className="rounded bg-[#f3f4f6] px-1 text-xs dark:bg-[#334155]">03 Damage Analysis</code> — 建物被害解析</li>
          </ul>
        </Step>
        <Step num={2} title="解析範囲を囲む">
          <p>地図上でポリゴンツールを使い、解析対象範囲を描画します。</p>
          <Tip>ジオメトリは1つまでです。範囲を変更した場合は再度Runを押してください。</Tip>
        </Step>
        <Step num={3} title="Runを押す">
          <p>解析が開始されます。結果はマップ上にレイヤーとして表示されます。</p>
        </Step>
      </Section>

      <Section title="01 Flood Analysis（洪水解析）">
        <p className="mb-4 text-sm text-muted">
          災害前後のSAR画像の反射強度を比較し、著しく低下した領域を浸水域として検出します。
        </p>
        <Step num={1} title="パラメータを設定">
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
                <tr className="bg-[#f0f4f8] dark:bg-[#1e293b]">
                  <td className="border border-border px-3 py-2 font-medium">洪水発生日</td>
                  <td className="border border-border px-3 py-2">解析対象の災害発生日</td>
                  <td className="border border-border px-3 py-2">-</td>
                </tr>
                <tr>
                  <td className="border border-border px-3 py-2 font-medium">比較画像日</td>
                  <td className="border border-border px-3 py-2">災害前の基準日（雨が降っていない日を選択）</td>
                  <td className="border border-border px-3 py-2">-</td>
                </tr>
                <tr className="bg-[#f0f4f8] dark:bg-[#1e293b]">
                  <td className="border border-border px-3 py-2 font-medium">衛星軌道</td>
                  <td className="border border-border px-3 py-2">Ascending / Descending</td>
                  <td className="border border-border px-3 py-2">両方試す</td>
                </tr>
                <tr>
                  <td className="border border-border px-3 py-2 font-medium">偏波</td>
                  <td className="border border-border px-3 py-2">VV / VH</td>
                  <td className="border border-border px-3 py-2">VV</td>
                </tr>
                <tr className="bg-[#f0f4f8] dark:bg-[#1e293b]">
                  <td className="border border-border px-3 py-2 font-medium">閾値</td>
                  <td className="border border-border px-3 py-2">洪水検出の感度。下げると範囲が広がる</td>
                  <td className="border border-border px-3 py-2">1.15</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Step>
        <Step num={2} title="Applyを押す">
          <p>解析が実行され、マップ上に洪水範囲・土地利用・人口分布のレイヤーが表示されます。</p>
        </Step>
        <Step num={3} title="結果をエクスポート">
          <p>
            Tasksタブから解析結果をKMLまたはGeoTIFF形式でダウンロードできます。
            データはGoogle Driveに自動保存されます。
          </p>
          <Tip>解像度は最大10mですが、解析範囲が広すぎると解像度が下がります。</Tip>
        </Step>

        <div className="mt-4 rounded-md border border-border bg-[#f3f4f6] p-4 dark:bg-[#1e293b]">
          <p className="mb-1 text-xs font-bold">検出アルゴリズム</p>
          <p className="font-mono text-xs text-muted">
            反射強度変化 = δ<sub>after</sub> / δ<sub>before</sub>
          </p>
          <p className="mt-1 text-xs text-muted">
            反射強度変化 &lt; 1.15 の場合、洪水と判定。
            恒常的な水域および傾斜5°以上の領域は除外。
          </p>
        </div>
      </Section>

      <Section title="02 Landslide Analysis（土砂崩れ解析）">
        <p className="mb-4 text-sm text-muted">
          災害前後各最長1年間のSAR画像を平均化し、反射強度の差分から土砂崩れ範囲を検出します。
        </p>
        <Step num={1} title="パラメータを設定">
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
                <tr className="bg-[#f0f4f8] dark:bg-[#1e293b]">
                  <td className="border border-border px-3 py-2 font-medium">発生日</td>
                  <td className="border border-border px-3 py-2">土砂崩れ発生日</td>
                  <td className="border border-border px-3 py-2">-</td>
                </tr>
                <tr>
                  <td className="border border-border px-3 py-2 font-medium">偏波</td>
                  <td className="border border-border px-3 py-2">VV / VH</td>
                  <td className="border border-border px-3 py-2">VH</td>
                </tr>
                <tr className="bg-[#f0f4f8] dark:bg-[#1e293b]">
                  <td className="border border-border px-3 py-2 font-medium">Slope</td>
                  <td className="border border-border px-3 py-2">斜度閾値（度数）。上げると解析範囲が狭まる</td>
                  <td className="border border-border px-3 py-2">5</td>
                </tr>
                <tr>
                  <td className="border border-border px-3 py-2 font-medium">Curvature</td>
                  <td className="border border-border px-3 py-2">曲率半径（m）。上げると解析範囲が広がる</td>
                  <td className="border border-border px-3 py-2">200</td>
                </tr>
                <tr className="bg-[#f0f4f8] dark:bg-[#1e293b]">
                  <td className="border border-border px-3 py-2 font-medium">閾値</td>
                  <td className="border border-border px-3 py-2">検出感度。上げると範囲が狭まる</td>
                  <td className="border border-border px-3 py-2">1.9</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Step>
        <Step num={2} title="Applyを押して結果を確認">
          <p>
            災害前後各最長1年間のSAR画像をAscending・Descending両方から取得・平均化し、差分を計算します。
          </p>
        </Step>

        <div className="mt-4 rounded-md border border-border bg-[#f3f4f6] p-4 dark:bg-[#1e293b]">
          <p className="mb-1 text-xs font-bold">検出アルゴリズム</p>
          <p className="font-mono text-xs text-muted">
            反射強度差 = δ<sub>after</sub> - δ<sub>before</sub>
          </p>
          <p className="mt-1 text-xs text-muted">
            反射強度差 &lt; 1.9 の場合、土砂崩れと判定。
            Slope ≤ 5°、Curvature半径 ≤ 200m の領域は除外。
          </p>
        </div>
      </Section>

      <Section title="03 Damage Analysis（建物被害解析）">
        <p className="mb-4 text-sm text-muted">
          災害前後のSAR画像の反射強度変化から、倒壊建物の分布を検出します。
        </p>
        <Step num={1} title="パラメータを設定">
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
                <tr className="bg-[#f0f4f8] dark:bg-[#1e293b]">
                  <td className="border border-border px-3 py-2 font-medium">災害発生日</td>
                  <td className="border border-border px-3 py-2">解析対象の日付</td>
                  <td className="border border-border px-3 py-2">-</td>
                </tr>
                <tr>
                  <td className="border border-border px-3 py-2 font-medium">比較画像日</td>
                  <td className="border border-border px-3 py-2">災害前の基準日</td>
                  <td className="border border-border px-3 py-2">-</td>
                </tr>
                <tr className="bg-[#f0f4f8] dark:bg-[#1e293b]">
                  <td className="border border-border px-3 py-2 font-medium">衛星軌道</td>
                  <td className="border border-border px-3 py-2">両方試す（建物の側面を両方向から観測するため）</td>
                  <td className="border border-border px-3 py-2">両方</td>
                </tr>
                <tr>
                  <td className="border border-border px-3 py-2 font-medium">偏波</td>
                  <td className="border border-border px-3 py-2">VV / VH</td>
                  <td className="border border-border px-3 py-2">VV</td>
                </tr>
                <tr className="bg-[#f0f4f8] dark:bg-[#1e293b]">
                  <td className="border border-border px-3 py-2 font-medium">閾値</td>
                  <td className="border border-border px-3 py-2">検出感度。上げると範囲が狭まる</td>
                  <td className="border border-border px-3 py-2">2</td>
                </tr>
              </tbody>
            </table>
          </div>
          <Tip>
            建物被害の場合、反射強度が上がることも下がることもあります（二重散乱の変化）。
            Ascending・Descending両方で解析すると死角をなくせます。
          </Tip>
        </Step>
        <Step num={2} title="Applyを押して結果を確認">
          <p>農地・湿地・森林は自動で除外され、建物エリアのみが解析対象になります。</p>
        </Step>

        <div className="mt-4 rounded-md border border-border bg-[#f3f4f6] p-4 dark:bg-[#1e293b]">
          <p className="mb-1 text-xs font-bold">検出アルゴリズム</p>
          <p className="font-mono text-xs text-muted">
            反射強度変化 = δ<sub>after</sub> / δ<sub>before</sub>
          </p>
          <p className="mt-1 text-xs text-muted">
            反射強度変化の絶対値が閾値（デフォルト2.0）を超えた場合、建物被害と判定。
          </p>
        </div>
      </Section>

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
        <a
          href="/MyProject/"
          className="text-sm text-accent hover:underline"
        >
          &larr; MyProject トップへ戻る
        </a>
      </div>
    </div>
  );
}

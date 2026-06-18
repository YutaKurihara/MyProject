"use client";

import { useEffect, useMemo, useState } from "react";

const API_BASE = "https://dignad-api-wp3vw2gjra-an.a.run.app";

type RegionInfo = {
  label: string;
  g_run1: number;
  van_run1: number;
  g_run2: number;
  van_run2: number;
};

const REGIONS_FALLBACK: Record<string, RegionInfo> = {
  RegionII:   { label: "Region II (Cagayan Valley)",  g_run1: 0.0696, van_run1: 0.5045, g_run2: 0.0648, van_run2: 0.5583 },
  NCR:        { label: "NCR",                          g_run1: 0.0915, van_run1: 0.8284, g_run2: 0.0904, van_run2: 0.8307 },
  CAR:        { label: "CAR (Cordillera)",             g_run1: 0.0713, van_run1: 0.6454, g_run2: 0.0683, van_run2: 0.6873 },
  RegionI:    { label: "Region I (Ilocos)",            g_run1: 0.0900, van_run1: 0.5751, g_run2: 0.0868, van_run2: 0.6101 },
  RegionIII:  { label: "Region III (Central Luzon)",   g_run1: 0.1000, van_run1: 0.5280, g_run2: 0.0986, van_run2: 0.5603 },
  RegionIVA:  { label: "Region IV-A (CALABARZON)",     g_run1: 0.0899, van_run1: 0.4459, g_run2: 0.0861, van_run2: 0.4686 },
  MIMAROPA:   { label: "MIMAROPA",                     g_run1: 0.1000, van_run1: 0.4685, g_run2: 0.0995, van_run2: 0.5129 },
  RegionV:    { label: "Region V (Bicol)",             g_run1: 0.0998, van_run1: 0.5483, g_run2: 0.0983, van_run2: 0.5972 },
  RegionVI:   { label: "Region VI (Western Visayas)",  g_run1: 0.0915, van_run1: 0.6142, g_run2: 0.0910, van_run2: 0.6420 },
  RegionVII:  { label: "Region VII (Central Visayas)", g_run1: 0.0900, van_run1: 0.6759, g_run2: 0.0900, van_run2: 0.6858 },
  RegionVIII: { label: "Region VIII (Eastern Visayas)",g_run1: 0.0802, van_run1: 0.5568, g_run2: 0.0791, van_run2: 0.5851 },
  RegionIX:   { label: "Region IX (Zamboanga)",        g_run1: 0.1000, van_run1: 0.5462, g_run2: 0.1000, van_run2: 0.5807 },
  RegionX:    { label: "Region X (Northern Mindanao)", g_run1: 0.1000, van_run1: 0.5850, g_run2: 0.1000, van_run2: 0.5974 },
  RegionXI:   { label: "Region XI (Davao)",            g_run1: 0.0965, van_run1: 0.6060, g_run2: 0.0958, van_run2: 0.6167 },
  RegionXII:  { label: "Region XII (SOCCSKSARGEN)",    g_run1: 0.1000, van_run1: 0.4196, g_run2: 0.0956, van_run2: 0.4576 },
  RegionXIII: { label: "Region XIII (Caraga)",         g_run1: 0.1000, van_run1: 0.5230, g_run2: 0.1000, van_run2: 0.5591 },
  BARMM:      { label: "BARMM",                        g_run1: 0.1000, van_run1: 0.3682, g_run2: 0.0928, van_run2: 0.3974 },
};

type ApiResult = {
  elapsed_seconds: number;
  years: number[];
  gdp_pct_dev: (number | null)[];
  params: { region: string; g: number; VA_n: number; damage_run: string };
};

function GdpChart({ years, values }: { years: number[]; values: (number | null)[] }) {
  const pts = years.map((y, i) => ({ y, v: values[i] ?? 0 }));
  if (pts.length === 0) return null;

  const w = 720, h = 280;
  const padL = 56, padR = 16, padT = 20, padB = 36;
  const innerW = w - padL - padR;
  const innerH = h - padT - padB;

  const vals = pts.map(p => p.v);
  const minV = Math.min(...vals, 0);
  const maxV = Math.max(...vals, 0);
  const yrange = maxV - minV || 1;
  const yMin = minV - yrange * 0.1;
  const yMax = maxV + yrange * 0.1;

  const xFor = (i: number) => padL + (i / (pts.length - 1)) * innerW;
  const yFor = (v: number) => padT + ((yMax - v) / (yMax - yMin)) * innerH;

  const path = pts.map((p, i) => `${i === 0 ? "M" : "L"}${xFor(i).toFixed(1)},${yFor(p.v).toFixed(1)}`).join(" ");
  const areaPath = `${path} L${xFor(pts.length-1).toFixed(1)},${yFor(0).toFixed(1)} L${xFor(0).toFixed(1)},${yFor(0).toFixed(1)} Z`;

  // Y-axis ticks
  const yTicks = 5;
  const ticks = Array.from({ length: yTicks }, (_, i) => yMin + ((yMax - yMin) * i) / (yTicks - 1));

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto" role="img" aria-label="Real GDP percent deviation">
      {/* zero line */}
      <line x1={padL} y1={yFor(0)} x2={w - padR} y2={yFor(0)} stroke="#94a3b8" strokeDasharray="3 3" />
      {/* y ticks */}
      {ticks.map((t, i) => (
        <g key={i}>
          <line x1={padL} y1={yFor(t)} x2={w - padR} y2={yFor(t)} stroke="#e2e8f0" />
          <text x={padL - 6} y={yFor(t) + 4} textAnchor="end" fontSize="11" fill="#64748b">
            {t.toFixed(2)}%
          </text>
        </g>
      ))}
      {/* x labels */}
      {pts.map((p, i) => (
        i % 2 === 0 && (
          <text key={p.y} x={xFor(i)} y={h - padB + 18} textAnchor="middle" fontSize="11" fill="#64748b">
            {p.y}
          </text>
        )
      ))}
      {/* area */}
      <path d={areaPath} fill="rgba(29, 78, 216, 0.12)" />
      {/* line */}
      <path d={path} fill="none" stroke="#1d4ed8" strokeWidth="2" />
      {/* points */}
      {pts.map((p, i) => (
        <circle key={i} cx={xFor(i)} cy={yFor(p.v)} r="3" fill="#1d4ed8" />
      ))}
      {/* axis */}
      <line x1={padL} y1={padT} x2={padL} y2={h - padB} stroke="#475569" />
      <line x1={padL} y1={h - padB} x2={w - padR} y2={h - padB} stroke="#475569" />
    </svg>
  );
}

export default function DsgePage() {
  const [regions, setRegions] = useState<Record<string, RegionInfo>>(REGIONS_FALLBACK);
  const [region, setRegion] = useState("RegionII");
  const [damageRun, setDamageRun] = useState<"Run1" | "Run2">("Run1");
  const [g, setG] = useState(0.0696);
  const [vaN, setVaN] = useState(0.5045);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ApiResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch region defaults from API (optional; falls back to embedded)
  useEffect(() => {
    fetch(`${API_BASE}/regions`)
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(setRegions)
      .catch(() => {});
  }, []);

  // Update g, VA_n when region / damageRun changes
  useEffect(() => {
    const info = regions[region];
    if (!info) return;
    if (damageRun === "Run1") {
      setG(info.g_run1);
      setVaN(info.van_run1);
    } else {
      setG(info.g_run2);
      setVaN(info.van_run2);
    }
  }, [region, damageRun, regions]);

  const damageIdx = damageRun === "Run2" ? 2 : 1;
  const kpis = useMemo(() => {
    if (!result) return null;
    const at = (offset: number) => result.gdp_pct_dev[damageIdx + offset] ?? null;
    return {
      damage: at(0),
      year1:  at(1),
      year5:  at(5),
      year10: at(10),
      elapsed: result.elapsed_seconds,
    };
  }, [result, damageIdx]);

  const fmtPct = (v: number | null) =>
    v == null ? "—" : `${v >= 0 ? "+" : ""}${v.toFixed(2)}%`;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const resp = await fetch(`${API_BASE}/simulate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ region, damage_run: damageRun, g, VA_n: vaN }),
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error || `HTTP ${resp.status}`);
      setResult(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-[960px] px-4 py-10">
      <header className="mb-8 border-b-[3px] border-accent pb-4 text-center">
        <h1 className="mb-1 text-2xl font-bold text-[#1e3a5f] dark:text-accent">
          経済被害評価DSGEモデル
        </h1>
        <p className="text-sm text-muted">
          Macroeconomic Disaster Impact (DIGNAD on Octave 6.4 + Dynare 4.5.6)
        </p>
        <p className="mt-1 text-xs text-muted">
          オリエンタルコンサルタンツグローバル 水資源・防災部
        </p>
      </header>

      <section className="mb-8 rounded-lg border border-border bg-card-bg p-6 shadow-sm">
        <h2 className="mb-4 border-b-2 border-accent-light pb-2 text-lg font-bold text-[#1e3a5f] dark:text-accent">
          概要
        </h2>
        <p className="text-sm leading-relaxed text-muted">
          IMF の DIGNAD (Debt, Investment, Growth, and Natural Disasters) モデルをベースに、
          フィリピン17地域を対象として自然災害が GDP・公的債務・民間投資に与える 20 年間の
          動学的影響をシミュレーションします。Region II (Cagayan Valley) の Lawin 2015 /
          Ompong 2016 を基準被害シナリオとし、各地域の構造パラメータ (g, VA<sub>n</sub>)
          を変えて応答を比較できます。計算エンジンは <strong>GNU Octave 6.4 + Dynare 4.5.6</strong>
          (Linux ソースビルド)、Cloud Run 上で実行されます。1リクエストあたり 60〜90秒です。
        </p>
      </section>

      <section className="mb-8 rounded-lg border border-border bg-card-bg p-6 shadow-sm">
        <h2 className="mb-4 border-b-2 border-accent-light pb-2 text-lg font-bold text-[#1e3a5f] dark:text-accent">
          入力
        </h2>
        <form onSubmit={submit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-muted">地域</span>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full rounded-md border border-border bg-white px-3 py-2 text-sm dark:bg-slate-800"
              >
                {Object.entries(regions).map(([key, info]) => (
                  <option key={key} value={key}>{info.label}</option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-1 block text-xs font-medium text-muted">被害シナリオ</span>
              <select
                value={damageRun}
                onChange={(e) => setDamageRun(e.target.value as "Run1" | "Run2")}
                className="w-full rounded-md border border-border bg-white px-3 py-2 text-sm dark:bg-slate-800"
              >
                <option value="Run1">Run1 (2015 Lawin 相当)</option>
                <option value="Run2">Run2 (2016 Ompong 相当, 軽め)</option>
              </select>
            </label>
          </div>

          <label className="block">
            <span className="mb-1 flex items-center justify-between text-xs font-medium text-muted">
              <span>トレンド成長率 g <span className="text-[10px] opacity-60">(0.02〜0.10、上限0.10)</span></span>
              <span className="font-mono text-accent">{g.toFixed(4)}</span>
            </span>
            <input
              type="range" min="0.02" max="0.10" step="0.001"
              value={g} onChange={(e) => setG(parseFloat(e.target.value))}
              className="w-full"
            />
          </label>

          <label className="block">
            <span className="mb-1 flex items-center justify-between text-xs font-medium text-muted">
              <span>非貿易部門比率 VA<sub>n</sub> <span className="text-[10px] opacity-60">(0.30〜0.90)</span></span>
              <span className="font-mono text-accent">{vaN.toFixed(4)}</span>
            </span>
            <input
              type="range" min="0.30" max="0.90" step="0.005"
              value={vaN} onChange={(e) => setVaN(parseFloat(e.target.value))}
              className="w-full"
            />
          </label>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="rounded-md bg-accent px-5 py-2 text-sm font-medium text-white hover:bg-accent/90 disabled:opacity-60 disabled:cursor-wait"
            >
              {loading ? "計算中... (~60秒)" : "シミュレーション実行"}
            </button>
            {error && <span className="text-xs text-red-600">エラー: {error}</span>}
          </div>
        </form>
      </section>

      {result && kpis && (
        <section className="mb-8 rounded-lg border border-border bg-card-bg p-6 shadow-sm">
          <h2 className="mb-4 border-b-2 border-accent-light pb-2 text-lg font-bold text-[#1e3a5f] dark:text-accent">
            結果
          </h2>
          <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-5">
            {([
              { label: "災害年 GDP偏差", v: kpis.damage },
              { label: "+1年",          v: kpis.year1 },
              { label: "+5年",          v: kpis.year5 },
              { label: "+10年",         v: kpis.year10 },
            ] as const).map((k) => (
              <div key={k.label} className="rounded-md border border-border bg-slate-50 px-3 py-2 dark:bg-slate-900">
                <div className="text-[10px] text-muted">{k.label}</div>
                <div className={`text-base font-bold font-mono ${k.v == null ? "" : k.v < 0 ? "text-red-700" : "text-green-700"}`}>
                  {fmtPct(k.v)}
                </div>
              </div>
            ))}
            <div className="rounded-md border border-border bg-slate-50 px-3 py-2 dark:bg-slate-900">
              <div className="text-[10px] text-muted">計算時間</div>
              <div className="text-base font-bold font-mono">{kpis.elapsed.toFixed(1)} s</div>
            </div>
          </div>
          <div className="rounded-md border border-border bg-white p-3 dark:bg-slate-950">
            <GdpChart years={result.years} values={result.gdp_pct_dev} />
            <p className="mt-2 text-xs text-muted">
              Real GDP 偏差 (% from initial year)
            </p>
          </div>
          <details className="mt-3 text-xs text-muted">
            <summary className="cursor-pointer">レスポンス全文 (JSON)</summary>
            <pre className="mt-2 max-h-60 overflow-auto rounded bg-slate-900 p-3 text-[11px] text-slate-100">
              {JSON.stringify(result, null, 2)}
            </pre>
          </details>
        </section>
      )}

      <section className="rounded-lg border border-border bg-card-bg p-6 shadow-sm">
        <h2 className="mb-4 border-b-2 border-accent-light pb-2 text-lg font-bold text-[#1e3a5f] dark:text-accent">
          モデル概要
        </h2>
        <ul className="ml-5 list-disc space-y-1 text-sm leading-relaxed text-muted">
          <li>Marto, Papageorgiou &amp; Klyuev (2018), <em>Journal of Development Economics</em> Vol.135 を基盤とした IMF RES の DSGE モデル</li>
          <li>計算エンジン: <strong>GNU Octave 6.4 + Dynare 4.5.6</strong> (Linux ソースビルド)、Cloud Run 上で実行</li>
          <li>地域別 g, VA<sub>n</sub> は PSA 2018PSNA 名目GRDPから算出</li>
          <li>被害ショックは Region II の 2015/2016 推計値を全地域に同一適用 (構造応答比較)</li>
          <li>制約: g &ge; 0.10 で Dynare Jacobian が爆発するため 0.10 にキャップ</li>
        </ul>
      </section>
    </div>
  );
}

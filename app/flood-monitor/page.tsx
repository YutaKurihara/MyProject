"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

// Data of the daily analysis. The files are replaced once a day (branch `flood-monitor-data`,
// copied to /flood-monitor-data/ when the site is built); only the latest analysis is kept.
const DATA = "../flood-monitor-data";

/* ============================================================================
   Types
   ========================================================================= */

type Amounts = { house: number; rice: number; corn: number; public: number; total: number };

type Monitor = {
  generated_at_jst: string;
  window: { start_pht: string; end_pht: string };
  rain: {
    total_mm: number; raw_total_mm: number; max_24h_mm: number; latency_hours: number | null;
    hourly_mm: number[]; legend: { bounds: number[]; colors: string[] };
  };
  flood: {
    detected: boolean; flooded_km2: number; deep_km2: number; buntun_max_depth_m: number; rising: boolean;
    colors: { shallow: string; deep: string };
  };
  damage: Amounts & { by_province: ({ name: string; flooded_km2: number } & Amounts)[] };
  scale: { return_periods: number[]; damage_php: number[]; estimated_return_period: number | null; above_largest: boolean } | null;
  yearly: {
    through_pht: string;
    years: ({ year: number; n_floods: number; partial: boolean; loss_rate_pct: number | null; loss_php: number | null } & Amounts)[];
    events: ({ peak_end: string; rain7_mm: number; flooded_km2: number; source: string } & Amounts)[];
    economy: {
      status: string; base_year: number | null; grdp_nominal_php: number | null; years: number[];
      indicators: { key: string; label: string; values: number[] }[];
    };
  };
  history: { window_end_pht: string; rain_mm: number; flooded_km2: number; total_php: number }[];
  map_colors: { province: string; region: string; river: string; basin: string };
};

/* ============================================================================
   Formatting
   ========================================================================= */

const OKU = 1e8; // 億ペソ
const oku = (php: number, digits = 1) => (php / OKU).toLocaleString("ja-JP", { minimumFractionDigits: digits, maximumFractionDigits: digits });
const int = (v: number) => Math.round(v).toLocaleString("ja-JP");
const parse = (s: string) => new Date(s.replace(" ", "T") + (s.length <= 16 ? ":00" : "") + "Z"); // times are handled as wall-clock values
const jpDate = (s: string, hour = true) => {
  const d = parse(s);
  return `${d.getUTCFullYear()}年${d.getUTCMonth() + 1}月${d.getUTCDate()}日` + (hour ? ` ${d.getUTCHours()}時` : "");
};

function niceTicks(lo: number, hi: number, count = 4): number[] {
  if (hi <= lo) hi = lo + 1;
  const raw = (hi - lo) / count;
  const mag = Math.pow(10, Math.floor(Math.log10(raw)));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => s >= raw) ?? raw;
  const out: number[] = [];
  for (let v = Math.ceil(lo / step) * step; v <= hi + step * 1e-6; v += step) out.push(Math.abs(v) < step * 1e-6 ? 0 : v);
  return out;
}
const tickLabel = (v: number, ticks: number[]) => {
  const step = ticks.length > 1 ? Math.abs(ticks[1] - ticks[0]) : 1;
  return v.toFixed(step >= 1 ? 0 : step >= 0.1 ? 1 : 2);
};

/* ============================================================================
   Layout parts (same look as the other pages of this site)
   ========================================================================= */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-6 rounded-lg border border-border bg-card-bg p-6 shadow-sm">
      <h2 className="mb-4 border-b-2 border-accent-light pb-2 text-lg font-bold text-[#1e3a5f] dark:text-accent">{title}</h2>
      {children}
    </section>
  );
}

function Tile({ label, value, unit, note }: { label: string; value: string; unit: string; note?: string }) {
  return (
    <div className="rounded-md border border-border bg-slate-50 px-3 py-2 dark:bg-slate-900">
      <div className="text-[11px] text-muted">{label}</div>
      <div className="text-xl font-bold tabular-nums text-[#1e3a5f] dark:text-accent">
        {value}
        <span className="ml-1 text-xs font-medium">{unit}</span>
      </div>
      {note && <div className="mt-0.5 text-[11px] text-muted">{note}</div>}
    </div>
  );
}

const TH = "border border-border bg-[#1e3a5f] px-2 py-2 text-white";
const TD = "border border-border px-2 py-1.5 text-right tabular-nums";
const TD_HEAD = "whitespace-nowrap border border-border px-2 py-1.5 text-left font-medium";

function Swatch({ color, label, dashed, line }: { color: string; label: string; dashed?: boolean; line?: boolean }) {
  return (
    <span className="mr-3 inline-flex items-center gap-1 whitespace-nowrap">
      {line ? (
        <span className="inline-block w-5" style={{ borderTop: `2px ${dashed ? "dashed" : "solid"} ${color}` }} />
      ) : (
        <span className="inline-block h-2.5 w-4 border border-border" style={{ background: color }} />
      )}
      {label}
    </span>
  );
}

/* ============================================================================
   Charts (inline SVG, as on the DSGE page)
   ========================================================================= */

const AXIS = "#475569", GRID = "#e2e8f0", TEXT = "#64748b";
const BLUE = "#1d6ab3", BLUE_LIGHT = "#8fb8e0", NAVY = "#1e3a5f", TEAL = "#0d9488", ORANGE = "#ea580c";

function RainChart({ start, values }: { start: string; values: number[] }) {
  const w = 560, h = 280, padL = 40, padR = 20, padT = 26, padB = 30;
  const innerW = w - padL - padR, innerH = h - padT - padB;
  const top = Math.max(1, ...values) * 1.1;
  const ticks = niceTicks(0, top);
  const yMax = Math.max(top, ticks[ticks.length - 1]);
  const x = (i: number) => padL + (i / values.length) * innerW;
  const y = (v: number) => padT + (1 - v / yMax) * innerH;
  const t0 = parse(start).getTime();
  const days: { i: number; label: string }[] = [];
  for (let i = 0; i <= values.length; i++) {
    const d = new Date(t0 + i * 3600e3);
    if (d.getUTCHours() === 0) days.push({ i, label: `${d.getUTCMonth() + 1}/${d.getUTCDate()}` });
  }
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-auto w-full" role="img" aria-label="流域平均の時間雨量">
      <text x={padL} y={padT - 10} fontSize="12.5" fill={TEXT}>流域平均の時間雨量（mm/h）</text>
      {ticks.map((t) => (
        <g key={t}>
          <line x1={padL} y1={y(t)} x2={w - padR} y2={y(t)} stroke={GRID} />
          <text x={padL - 6} y={y(t) + 4} textAnchor="end" fontSize="11.5" fill={TEXT}>{tickLabel(t, ticks)}</text>
        </g>
      ))}
      {values.map((v, i) => v > 0 && (
        <rect key={i} x={x(i)} y={y(v)} width={Math.max(innerW / values.length - 0.6, 0.8)} height={y(0) - y(v)} fill={BLUE} />
      ))}
      {days.map((d) => (
        <g key={d.i}>
          <line x1={x(d.i)} y1={h - padB} x2={x(d.i)} y2={h - padB + 4} stroke={AXIS} />
          <text x={x(d.i)} y={h - padB + 17} textAnchor="middle" fontSize="11.5" fill={TEXT}>{d.label}</text>
        </g>
      ))}
      <line x1={padL} y1={padT} x2={padL} y2={h - padB} stroke={AXIS} />
      <line x1={padL} y1={h - padB} x2={w - padR} y2={h - padB} stroke={AXIS} />
    </svg>
  );
}

function YearChart({ years, upto }: { years: Monitor["yearly"]["years"]; upto: string }) {
  const w = 720, padL = 52, padR = 14, h1 = 210, h2 = 190, gap = 34, padT = 24, padB = 40;
  const h = padT + h1 + gap + h2 + padB, innerW = w - padL - padR, band = innerW / years.length;
  const cx = (i: number) => padL + band * (i + 0.5);
  const dmg = years.map((y) => y.total / OKU);
  const t1 = niceTicks(0, Math.max(...dmg) * 1.12), max1 = t1[t1.length - 1];
  const y1 = (v: number) => padT + (1 - v / max1) * h1;
  const rates = years.map((y) => y.loss_rate_pct);
  const has = rates.every((r) => r != null);
  const top2 = padT + h1 + gap;
  const t2 = niceTicks(0, Math.max(0.1, ...rates.map((r) => r ?? 0)) * 1.15), max2 = t2[t2.length - 1];
  const y2 = (v: number) => top2 + (1 - v / max2) * h2;
  const path = rates.map((r, i) => `${i === 0 ? "M" : "L"}${cx(i).toFixed(1)},${y2(r ?? 0).toFixed(1)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-auto w-full" role="img" aria-label="年間の直接被害額とGRDP毀損率">
      <text x={padL} y={padT - 9} fontSize="11" fill={TEXT}>年間の直接被害額（億ペソ）</text>
      {t1.map((t) => (
        <g key={`a${t}`}>
          <line x1={padL} y1={y1(t)} x2={w - padR} y2={y1(t)} stroke={GRID} />
          <text x={padL - 6} y={y1(t) + 4} textAnchor="end" fontSize="10" fill={TEXT}>{tickLabel(t, t1)}</text>
        </g>
      ))}
      {years.map((yr, i) => (
        <g key={yr.year}>
          <rect x={cx(i) - band * 0.31} y={y1(dmg[i])} width={band * 0.62} height={y1(0) - y1(dmg[i])} fill={yr.partial ? BLUE_LIGHT : BLUE} />
          <text x={cx(i)} y={y1(dmg[i]) - 5} textAnchor="middle" fontSize="11" fill={NAVY} className="dark:fill-slate-200">{dmg[i].toFixed(0)}</text>
        </g>
      ))}
      <line x1={padL} y1={padT} x2={padL} y2={padT + h1} stroke={AXIS} />
      <line x1={padL} y1={padT + h1} x2={w - padR} y2={padT + h1} stroke={AXIS} />

      <text x={padL} y={top2 - 9} fontSize="11" fill={TEXT}>GRDP毀損率（%）</text>
      {t2.map((t) => (
        <g key={`b${t}`}>
          <line x1={padL} y1={y2(t)} x2={w - padR} y2={y2(t)} stroke={GRID} />
          <text x={padL - 6} y={y2(t) + 4} textAnchor="end" fontSize="10" fill={TEXT}>{tickLabel(t, t2)}</text>
        </g>
      ))}
      {has ? (
        <>
          <path d={path} fill="none" stroke={NAVY} strokeWidth="2" className="dark:stroke-sky-300" />
          {rates.map((r, i) => (
            <g key={i}>
              <circle cx={cx(i)} cy={y2(r ?? 0)} r="3.2" fill={NAVY} className="dark:fill-sky-300" />
              <text x={cx(i)} y={y2(r ?? 0) - 8} textAnchor="middle" fontSize="11" fill={NAVY} className="dark:fill-slate-200">{(r ?? 0).toFixed(2)}</text>
            </g>
          ))}
        </>
      ) : (
        <text x={padL + innerW / 2} y={top2 + h2 / 2} textAnchor="middle" fontSize="12" fill={TEXT}>経済指標は算定中です</text>
      )}
      <line x1={padL} y1={top2} x2={padL} y2={top2 + h2} stroke={AXIS} />
      <line x1={padL} y1={top2 + h2} x2={w - padR} y2={top2 + h2} stroke={AXIS} />
      {years.map((yr, i) => (
        <g key={`x${yr.year}`}>
          <text x={cx(i)} y={top2 + h2 + 16} textAnchor="middle" fontSize="11" fill={TEXT}>{yr.year}年</text>
          {yr.partial && <text x={cx(i)} y={top2 + h2 + 30} textAnchor="middle" fontSize="10" fill={TEXT}>（{upto}）</text>}
        </g>
      ))}
    </svg>
  );
}

function IndicatorChart({ title, years, lines, lastFloodYear }:
  { title: string; years: number[]; lines: { values: number[]; color: string }[]; lastFloodYear: number }) {
  const w = 270, h = 185, padL = 36, padR = 16, padT = 26, padB = 24;
  const innerW = w - padL - padR, innerH = h - padT - padB;
  const all = lines.flatMap((l) => l.values);
  const lo = Math.min(0, ...all), hi = Math.max(0, ...all);
  const pad = (hi - lo || 1) * 0.08;
  const ticks = niceTicks(lo - pad, hi + pad, 4);
  const yMin = Math.min(lo - pad, ticks[0]), yMax = Math.max(hi + pad, ticks[ticks.length - 1]);
  const x = (i: number) => padL + (i / (years.length - 1)) * innerW;
  const y = (v: number) => padT + ((yMax - v) / (yMax - yMin)) * innerH;
  const k = years.indexOf(lastFloodYear);
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-auto w-full" role="img" aria-label={title}>
      <text x={4} y={15} fontSize="12.5" fontWeight="bold" fill={NAVY} className="dark:fill-slate-200">{title}</text>
      {k >= 0 && k < years.length - 1 && <rect x={x(k + 0.5)} y={padT} width={w - padR - x(k + 0.5)} height={innerH} fill="#94a3b8" opacity="0.14" />}
      {ticks.map((t) => (
        <g key={t}>
          <line x1={padL} y1={y(t)} x2={w - padR} y2={y(t)} stroke={t === 0 ? "#94a3b8" : GRID} />
          <text x={padL - 5} y={y(t) + 3.5} textAnchor="end" fontSize="10.5" fill={TEXT}>{tickLabel(t, ticks)}</text>
        </g>
      ))}
      {lines.map((l, j) => (
        <path key={j} fill="none" stroke={l.color} strokeWidth="1.8"
          d={l.values.map((v, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ")} />
      ))}
      {years.map((yr, i) => (yr - years[0]) % 4 === 0 && (
        <text key={yr} x={x(i)} y={h - padB + 15} textAnchor="middle" fontSize="10.5" fill={TEXT}>{yr}</text>
      ))}
      <line x1={padL} y1={padT} x2={padL} y2={h - padB} stroke={AXIS} />
      <line x1={padL} y1={h - padB} x2={w - padR} y2={h - padB} stroke={AXIS} />
    </svg>
  );
}

// panels of the economic indicators: title, indicator keys and colours
const PANELS: { title: string; lines: { key: string; color: string }[] }[] = [
  { title: "生産（部門別）", lines: [{ key: "output_tradable", color: TEAL }, { key: "output_nontradable", color: ORANGE }] },
  { title: "民間消費", lines: [{ key: "consumption", color: NAVY }] },
  { title: "民間投資（部門別）", lines: [{ key: "investment_tradable", color: TEAL }, { key: "investment_nontradable", color: ORANGE }] },
  { title: "民間資本（部門別）", lines: [{ key: "capital_tradable", color: TEAL }, { key: "capital_nontradable", color: ORANGE }] },
  { title: "公共資本", lines: [{ key: "public_capital", color: NAVY }] },
  { title: "実質賃金", lines: [{ key: "real_wage", color: NAVY }] },
  { title: "家計への移転", lines: [{ key: "transfers", color: NAVY }] },
];

function ScaleBar({ scale, total }: { scale: NonNullable<Monitor["scale"]>; total: number }) {
  const top = scale.damage_php[scale.damage_php.length - 1];
  const pos = (v: number) => Math.max(0, Math.min(100, (100 * v) / top));
  const now = pos(total);
  return (
    <div className="relative mx-3 mt-2 h-[84px]">
      <div className="absolute top-0 whitespace-nowrap text-xs font-bold text-accent"
        style={now < 12 ? { left: 0 } : now > 88 ? { right: 0 } : { left: `${now}%`, transform: "translateX(-50%)" }}>
        今回 {oku(total)} 億ペソ
      </div>
      <div className="absolute top-[22px] h-6 w-0.5 bg-accent" style={{ left: `${now}%` }} />
      <div className="absolute left-0 right-0 top-[34px] h-2 rounded bg-slate-200 dark:bg-slate-700">
        <div className="h-2 rounded bg-accent" style={{ width: `${now}%` }} />
      </div>
      {scale.return_periods.map((t, i) => (
        <div key={t} className="absolute top-[44px] -translate-x-1/2 whitespace-nowrap text-center text-[10px] leading-tight text-muted" style={{ left: `${pos(scale.damage_php[i])}%` }}>
          <span className="mx-auto mb-0.5 block h-1.5 w-px bg-slate-400" />
          {t}年<br />{oku(scale.damage_php[i], 0)}
        </div>
      ))}
    </div>
  );
}

/* ============================================================================
   Page
   ========================================================================= */

export default function FloodMonitorPage() {
  const [data, setData] = useState<Monitor | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    fetch(`${DATA}/latest.json`, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(setData)
      .catch(() => setFailed(true));
  }, []);

  const header = (
    <header className="mb-8 border-b-[3px] border-accent pb-4 text-center">
      <h1 className="mb-1 text-2xl font-bold text-[#1e3a5f] dark:text-accent">洪水被害・経済影響 日次モニター</h1>
      <p className="text-sm text-muted">Daily Flood Damage and Economic Impact Monitor — Cagayan River Basin (Region II), Philippines</p>
      <p className="mt-1 text-xs text-muted">オリエンタルコンサルタンツグローバル 水資源・防災部</p>
    </header>
  );

  if (!data) {
    return (
      <div className="mx-auto max-w-[960px] px-4 py-10">
        {header}
        <p className="text-center text-sm text-muted">{failed ? "解析結果を取得できませんでした。時間をおいて再度アクセスしてください。" : "解析結果を読み込んでいます。"}</p>
      </div>
    );
  }

  const { rain, flood, damage, scale, yearly } = data;
  const version = encodeURIComponent(data.generated_at_jst);
  const current = yearly.years[yearly.years.length - 1];
  const last = new Date(parse(yearly.through_pht).getTime() - 3600e3);
  const upto = `${last.getUTCMonth() + 1}月${last.getUTCDate()}日まで`;
  const economy = yearly.economy, computed = economy.status === "computed";
  const series = Object.fromEntries(economy.indicators.map((i) => [i.key, i.values]));
  const shown = yearly.years.length; // rows of the indicator table = years with flood records

  let level: "calm" | "notice" | "alert" = "calm";
  let message = "解析対象期間において、洪水は確認されていません。";
  if (flood.detected) {
    level = scale && (scale.estimated_return_period || scale.above_largest) ? "alert" : "notice";
    message = !scale ? "洪水を確認しました。"
      : scale.above_largest ? `洪水を確認しました。直接被害額は、再現期間${scale.return_periods[scale.return_periods.length - 1]}年の洪水を上回る規模です。`
      : scale.estimated_return_period ? `洪水を確認しました。直接被害額は、再現期間 約${Math.round(scale.estimated_return_period)}年の洪水に相当する規模です。`
      : `洪水を確認しました。直接被害額は、再現期間${scale.return_periods[0]}年の洪水を下回る規模です。`;
  }
  const banner = {
    calm: "border-accent bg-accent-light/40 text-[#1e3a5f] dark:text-slate-100",
    notice: "border-amber-500 bg-amber-50 text-amber-900 dark:bg-amber-950/40 dark:text-amber-200",
    alert: "border-red-600 bg-red-50 text-red-900 dark:bg-red-950/40 dark:text-red-200",
  }[level];

  return (
    <div className="mx-auto max-w-[960px] px-4 py-10">
      {header}

      {/* ===== 概要 ===== */}
      <Section title="概要">
        <p className="mb-3 text-sm leading-relaxed text-muted">
          衛星降水量（GSMaP）を入力として、降雨流出氾濫モデル（RRI）による浸水解析、被害関数による直接被害額の算定、
          マクロ経済モデル（DIGNAD）による地域経済への影響評価までを1日1回自動で実行し、その結果を掲載しています。
          対象は、フィリピン・ルソン島北部のカガヤン川流域に位置する Region II の4州（カガヤン、イサベラ、ヌエバ・ビスカヤ、キリノ）です。
        </p>
        <p className="mb-4 text-xs text-muted">
          解析対象期間：{jpDate(data.window.start_pht)} ～ {jpDate(data.window.end_pht)}（フィリピン時間）
          <span className="mx-2">｜</span>
          最終更新：{jpDate(data.generated_at_jst, false)} {data.generated_at_jst.slice(11, 16)}（日本時間）
        </p>
        <div className={`mb-4 rounded-md border-l-4 px-4 py-3 text-sm font-bold ${banner}`}>{message}</div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <Tile label="7日間雨量（流域平均）" value={int(rain.total_mm)} unit="mm" />
          <Tile label="浸水面積（浸水深0.1m以上）" value={int(flood.flooded_km2)} unit="km²" />
          <Tile label="直接被害額" value={flood.detected ? oku(damage.total) : "0"} unit="億ペソ" />
          <Tile label={`${current.year}年の累計直接被害額`} value={oku(current.total)} unit="億ペソ"
            note={current.loss_rate_pct != null ? `GRDP毀損率 ${current.loss_rate_pct.toFixed(2)}%（${upto}）` : `洪水 ${current.n_floods}回（${upto}）`} />
        </div>
      </Section>

      {/* ===== 降雨 ===== */}
      <Section title="降雨の状況">
        <div className="grid gap-5 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          <figure>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${DATA}/rain_map.png?v=${version}`} alt="7日間雨量の分布" className="w-full rounded-md border border-border" />
            <figcaption className="mt-2 text-[11px] leading-relaxed text-muted">
              <span className="mb-1 block font-medium">7日間雨量の分布（mm）</span>
              {rain.legend.colors.map((c, i) => (
                <Swatch key={c} color={c} label={i < rain.legend.bounds.length - 1 ? `${rain.legend.bounds[i]}～${rain.legend.bounds[i + 1]}` : `${rain.legend.bounds[i]}以上`} />
              ))}
            </figcaption>
          </figure>
          <div>
            <div className="rounded-md border border-border bg-white p-3 dark:bg-slate-950">
              <RainChart start={data.window.start_pht} values={rain.hourly_mm} />
            </div>
            <ul className="mt-3 ml-5 list-disc space-y-1 text-xs leading-relaxed text-muted">
              <li>7日間雨量（流域平均）：{int(rain.total_mm)} mm、最大24時間雨量：{int(rain.max_24h_mm)} mm</li>
              <li>補正前の7日間雨量：{int(rain.raw_total_mm)} mm</li>
              <li>雨量は JAXA GSMaP（準リアルタイム・雨量計補正版）に、地上観測に基づく補正係数を適用した値です。
                {rain.latency_hours != null && `データの配信遅延は約${Math.round(rain.latency_hours)}時間です。`}</li>
            </ul>
            <MapLegend colors={data.map_colors} />
          </div>
        </div>
      </Section>

      {/* ===== 浸水・直接被害 ===== */}
      <Section title="浸水範囲と直接被害額">
        <div className="grid gap-5 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          <figure>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${DATA}/flood_map.png?v=${version}`} alt="最大浸水深の分布" className="w-full rounded-md border border-border" />
            <figcaption className="mt-2 text-[11px] leading-relaxed text-muted">
              <span className="mb-1 block font-medium">最大浸水深の分布</span>
              <Swatch color={flood.colors.shallow} label="0.1～1 m" />
              <Swatch color={flood.colors.deep} label="1 m以上" />
            </figcaption>
          </figure>
          <div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-xs">
                <thead>
                  <tr>
                    <th rowSpan={2} className={`${TH} text-left`}>州</th>
                    <th rowSpan={2} className={`${TH} text-right`}>浸水面積<br />（km²）</th>
                    <th colSpan={5} className={`${TH} text-center`}>直接被害額（億ペソ）</th>
                  </tr>
                  <tr>
                    {["住宅", "コメ", "トウモロコシ", "公共施設", "合計"].map((c) => <th key={c} className={`${TH} text-right`}>{c}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {damage.by_province.map((p) => (
                    <tr key={p.name}>
                      <td className={TD_HEAD}>{p.name}</td>
                      <td className={TD}>{int(p.flooded_km2)}</td>
                      {[p.house, p.rice, p.corn, p.public, p.total].map((v, i) => <td key={i} className={TD}>{oku(v)}</td>)}
                    </tr>
                  ))}
                  <tr className="bg-slate-50 font-bold dark:bg-slate-900">
                    <td className={TD_HEAD}>4州計</td>
                    <td className={TD}>{int(flood.flooded_km2)}</td>
                    {[damage.house, damage.rice, damage.corn, damage.public, damage.total].map((v, i) => <td key={i} className={TD}>{oku(v)}</td>)}
                  </tr>
                </tbody>
              </table>
            </div>
            {flood.detected ? (
              <>
                <ul className="mt-3 ml-5 list-disc space-y-1 text-xs leading-relaxed text-muted">
                  <li>解析対象期間中の最大浸水深に基づく値です（資産および単価は2020年時点）。</li>
                  <li>浸水深1m以上の面積：{int(flood.deep_km2)} km²、Buntun地点の最大水深（モデル計算値）：{flood.buntun_max_depth_m.toFixed(1)} m</li>
                </ul>
                {flood.rising && (
                  <div className="mt-3 rounded-md border-l-4 border-amber-500 bg-amber-50 p-3 text-xs text-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
                    解析対象期間の終了時点で、Buntun地点の水位は上昇中です。浸水面積および直接被害額は、今後の更新で増加する可能性があります。
                  </div>
                )}
                {scale && (
                  <div className="mt-4">
                    <h3 className="text-sm font-bold text-accent">被害規模の目安</h3>
                    <ScaleBar scale={scale} total={damage.total} />
                    <p className="text-[11px] leading-relaxed text-muted">目盛は、再現期間別の洪水による直接被害額（億ペソ、現在気候）を示します。</p>
                  </div>
                )}
              </>
            ) : (
              <p className="mt-3 text-xs leading-relaxed text-muted">
                直接被害額が1億ペソ未満の期間は洪水なしと判定し、浸水面積および直接被害額を0として表示しています。
              </p>
            )}
          </div>
        </div>
      </Section>

      {/* ===== 年間の直接被害額と経済指標 ===== */}
      <Section title="年間の直接被害額と経済指標">
        <div className="rounded-md border border-border bg-white p-3 dark:bg-slate-950">
          <YearChart years={yearly.years} upto={upto} />
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr>
                <th rowSpan={2} className={`${TH} text-left`}>年</th>
                <th rowSpan={2} className={`${TH} text-right`}>洪水<br />回数</th>
                <th colSpan={5} className={`${TH} text-center`}>年間の直接被害額（億ペソ）</th>
                <th rowSpan={2} className={`${TH} text-right`}>GRDP毀損率<br />（%）</th>
                <th rowSpan={2} className={`${TH} text-right`}>GRDP毀損額<br />（億ペソ）</th>
              </tr>
              <tr>
                {["住宅", "コメ", "トウモロコシ", "公共施設", "合計"].map((c) => <th key={c} className={`${TH} text-right`}>{c}</th>)}
              </tr>
            </thead>
            <tbody>
              {yearly.years.map((y) => (
                <tr key={y.year} className={y.partial ? "bg-slate-50 font-bold dark:bg-slate-900" : ""}>
                  <td className={TD_HEAD}>{y.year}年{y.partial && `（${upto}）`}</td>
                  <td className={TD}>{y.n_floods}</td>
                  {[y.house, y.rice, y.corn, y.public, y.total].map((v, i) => <td key={i} className={TD}>{oku(v)}</td>)}
                  <td className={TD}>{y.loss_rate_pct != null ? y.loss_rate_pct.toFixed(2) : "—"}</td>
                  <td className={TD}>{y.loss_php != null ? oku(y.loss_php) : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ul className="mt-3 ml-5 list-disc space-y-1 text-xs leading-relaxed text-muted">
          <li>洪水は、流域平均の7日間雨量が120mm以上となった降雨イベントとして抽出しています（ピークが10日以上離れたものを別のイベントとして計上）。</li>
          <li>GRDP毀損率は、{yearly.years[0].year}年以降の洪水が発生しなかった場合のGRDP（ベースライン）に対する、当該年のGRDPの低下率です。</li>
          {economy.grdp_nominal_php != null && (
            <li>GRDP毀損額は、{economy.base_year}年の名目GRDP（{oku(economy.grdp_nominal_php, 0)}億ペソ）にGRDP毀損率を乗じた値です。</li>
          )}
        </ul>

        <h3 className="mt-6 mb-2 text-sm font-bold text-accent">経済指標</h3>
        {computed ? (
          <>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
              {PANELS.map((p) => (
                <div key={p.title} className="rounded-md border border-border bg-white p-2 dark:bg-slate-950">
                  <IndicatorChart title={p.title} years={economy.years} lastFloodYear={current.year}
                    lines={p.lines.filter((l) => series[l.key]).map((l) => ({ values: series[l.key], color: l.color }))} />
                </div>
              ))}
              <div className="rounded-md border border-border p-3 text-[11px] leading-relaxed text-muted">
                <p className="mb-1 font-medium">凡例</p>
                <p><Swatch line color={NAVY} label="全体" /></p>
                <p><Swatch line color={TEAL} label="貿易財部門" /></p>
                <p><Swatch line color={ORANGE} label="非貿易財部門" /></p>
                <p className="mt-1"><Swatch color="#94a3b824" label={`${current.year + 1}年以降`} /></p>
                <p className="mt-1">縦軸：ベースライン比（%）</p>
              </div>
            </div>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full border-collapse text-xs">
                <thead>
                  <tr>
                    <th className={`${TH} text-left`}>年</th>
                    {economy.indicators.map((i) => <th key={i.key} className={`${TH} min-w-[64px] text-right font-medium`}>{i.label}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {economy.years.slice(0, shown).map((yr, k) => (
                    <tr key={yr}>
                      <td className={TD_HEAD}>{yr}年</td>
                      {economy.indicators.map((i) => <td key={i.key} className={TD}>{i.values[k].toFixed(2)}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <ul className="mt-3 ml-5 list-disc space-y-1 text-xs leading-relaxed text-muted">
              <li>各指標の、ベースライン（洪水が発生しなかった場合）に対する変化率（%）です。</li>
              <li>{current.year + 1}年以降は、新たな洪水が発生しないと仮定した場合の推移です。</li>
              <li>民間消費および実質賃金は、物価水準で実質化した値です。</li>
            </ul>
          </>
        ) : (
          <p className="text-xs text-muted">経済指標は算定中です。年間の直接被害額は確定値です。</p>
        )}

        <details className="mt-5 text-xs text-muted">
          <summary className="cursor-pointer font-medium text-accent">洪水イベント別の内訳</summary>
          <div className="mt-2 overflow-x-auto">
            <table className="w-full border-collapse text-xs">
              <thead>
                <tr>
                  <th className={`${TH} text-left`}>降雨ピーク日</th>
                  <th className={`${TH} text-right`}>7日間雨量<br />（mm）</th>
                  <th className={`${TH} text-right`}>浸水面積<br />（km²）</th>
                  {["住宅", "コメ", "トウモロコシ", "公共施設", "合計"].map((c) => <th key={c} className={`${TH} text-right`}>{c}<br />（億ペソ）</th>)}
                </tr>
              </thead>
              <tbody>
                {yearly.events.map((e) => (
                  <tr key={e.peak_end}>
                    <td className={TD_HEAD}>{jpDate(e.peak_end, false)}</td>
                    <td className={TD}>{int(e.rain7_mm)}</td>
                    <td className={TD}>{int(e.flooded_km2)}</td>
                    {[e.house, e.rice, e.corn, e.public, e.total].map((v, i) => <td key={i} className={TD}>{oku(v)}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      </Section>

      {/* ===== 日次解析の履歴 ===== */}
      {data.history.length > 0 && (
        <Section title="日次解析の履歴">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-xs">
              <thead>
                <tr>
                  <th className={`${TH} text-left`}>解析対象期間の終了時刻（フィリピン時間）</th>
                  <th className={`${TH} text-right`}>7日間雨量（mm）</th>
                  <th className={`${TH} text-right`}>浸水面積（km²）</th>
                  <th className={`${TH} text-right`}>直接被害額（億ペソ）</th>
                </tr>
              </thead>
              <tbody>
                {data.history.map((h) => (
                  <tr key={h.window_end_pht}>
                    <td className={TD_HEAD}>{jpDate(h.window_end_pht)}</td>
                    <td className={TD}>{int(h.rain_mm)}</td>
                    <td className={TD}>{int(h.flooded_km2)}</td>
                    <td className={TD}>{oku(h.total_php)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-[11px] text-muted">直近10回分を表示しています。</p>
        </Section>
      )}

      {/* ===== 留意事項 ===== */}
      <section className="mb-6 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm leading-relaxed text-amber-900 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-200">
        <strong className="mb-1 block">留意事項</strong>
        <ul className="ml-5 list-disc space-y-1">
          <li>日次解析は直近7日間の降雨を入力としており、それ以前の降雨に起因する河川流量は考慮していません。</li>
          <li>浸水範囲の再現精度は検証の途上にあります。2020年台風Ulyssesを対象とした検証では、衛星観測による浸水域のうちモデルが浸水と判定した範囲は26%にとどまりました。浸水範囲の図は参考情報としてご利用ください。</li>
          <li>年間の直接被害額は、2026年9月16日までは既往の解析（1イベントあたり18日間）による値、それ以降は本モニターの日次解析（7日間）による値です。</li>
          <li>経済指標は、年間の直接被害額をマクロ経済モデルに入力した条件付きの試算であり、将来を予測するものではありません。{yearly.years[0].year - 1}年以前の洪水の影響は含みません。</li>
          <li>雨量は準リアルタイムの衛星降水量に基づくため、後日公表される確定値とは異なる場合があります。</li>
        </ul>
      </section>

      {/* ===== 手法とデータ ===== */}
      <Section title="手法とデータ">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr>
                <th className={`${TH} w-32 text-left`}>項目</th>
                <th className={`${TH} text-left`}>内容</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["降雨", "JAXA GSMaP（準リアルタイム・雨量計補正版、時間雨量）。地上雨量観測との比較に基づく補正係数を適用。"],
                ["浸水解析", "降雨流出氾濫モデル（RRI）。空間解像度15秒（約450 m）、計算期間7日間。浸水深は地表面上の水深。"],
                ["直接被害額", "浸水深－被害率曲線により住宅・コメ・トウモロコシの被害額を算定。公共施設は民間被害額に対する比率により算定。資産および単価は2020年時点。"],
                ["経済影響", "IMF の DIGNAD モデルを Region II の経済構造に合わせて較正し、年間の直接被害額を入力。"],
                ["更新頻度", "1日1回。掲載データは最新の解析結果に置き換えられます。"],
                ["地図データ", "行政界：PSA／NAMRIA（2023年）、流域界：HydroBASINS、河川：OpenStreetMap。"],
              ].map(([k, v]) => (
                <tr key={k}>
                  <td className={TD_HEAD}>{k}</td>
                  <td className="border border-border px-2 py-1.5 text-muted">{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-muted">
          マクロ経済モデルの概要は
          <Link href="/dsge" className="mx-1 text-accent underline">経済被害評価DSGEモデル</Link>
          をご覧ください。
        </p>
      </Section>
    </div>
  );
}

function MapLegend({ colors }: { colors: Monitor["map_colors"] }) {
  return (
    <p className="mt-3 text-[11px] leading-relaxed text-muted">
      <span className="mr-2 font-medium">地図の凡例</span>
      <Swatch line color="#111111" label="Region II" />
      <Swatch line color={colors.region} label="地域界" />
      <Swatch line color={colors.province} label="州界" />
      <Swatch line dashed color={colors.basin} label="カガヤン川流域界" />
      <Swatch line color={colors.river} label="主要河川" />
    </p>
  );
}

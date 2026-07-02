"use client";

import { useEffect, useMemo, useState } from "react";

const API_BASE = "https://dignad-api-wp3vw2gjra-an.a.run.app";

/* ============================================================================
   Region defaults
   ========================================================================= */

type RegionInfo = {
  label: string;
  g_run1: number; van_run1: number;
  g_run2: number; van_run2: number;
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

/* ============================================================================
   Parameter metadata
   ========================================================================= */

type ParamDef = {
  key: string;
  label: string;
  sublabel?: string;
  tooltip?: string;
  unit?: "ratio" | "pct" | "rate" | "scaling" | "usd_pct";
  default: number;
  min?: number;
  max?: number;
  step?: number;
};

const PUB_INFRA: ParamDef[] = [
  { key: "iziy",     label: "Public infrastructure inv./GDP", sublabel: "iziy",    default: 0.04,  min: 0, max: 0.20, step: 0.001, unit: "ratio",
    tooltip: "Steady-state share of public investment in standard infrastructure (% of GDP). DIGNAD default: 6% for typical SSA-LIC." },
  { key: "izay",     label: "Public adaptation inv./GDP",     sublabel: "izay",    default: 0.00,  min: 0, max: 0.10, step: 0.001, unit: "ratio",
    tooltip: "Investment in climate-resilient infrastructure. Often near 0 in LICs." },
  { key: "delta_zi", label: "Depreciation (std infra)",       sublabel: "δ_zi",    default: 0.075, min: 0.01, max: 0.20, step: 0.005, unit: "rate" },
  { key: "delta_za", label: "Depreciation (adaptation)",      sublabel: "δ_za",    default: 0.03,  min: 0.005, max: 0.15, step: 0.005, unit: "rate" },
  { key: "R_zio",    label: "Return on std infra",            sublabel: "R_zi,o",  default: 0.25,  min: 0.05, max: 0.60, step: 0.01, unit: "rate" },
  { key: "R_zao",    label: "Return on adaptation",           sublabel: "R_za,o",  default: 0.30,  min: 0.05, max: 0.90, step: 0.01, unit: "rate" },
  { key: "s_o",      label: "Public investment efficiency",   sublabel: "s_o",     default: 0.50,  min: 0.10, max: 1.00, step: 0.05, unit: "ratio" },
  { key: "a_za",     label: "Cost ratio adapt vs std",        sublabel: "a_za",    default: 0.25,  min: 0,    max: 1.00, step: 0.05, unit: "ratio" },
  { key: "ppi_nd_n", label: "Adaptation mitigation scaling",  sublabel: "π_j",     default: 25,    min: 0,    max: 100,  step: 1,    unit: "scaling" },
  { key: "fo",       label: "User fees (% recurrent)",        sublabel: "μ",       default: 0.05,  min: 0,    max: 0.60, step: 0.01, unit: "ratio" },
];

const REAL_ECON: ParamDef[] = [
  { key: "g",       label: "Trend per-capita growth",  sublabel: "g",      default: 0.0696, min: 0.01, max: 0.10, step: 0.001, unit: "rate",
    tooltip: "Steady-state per-capita real growth rate. Hard-capped at 10%." },
  { key: "oilro",   label: "Natural resource rev/GDP", sublabel: "N_o",    default: 0.00,   min: 0, max: 0.50, step: 0.01, unit: "ratio" },
  { key: "imp2gdp", label: "Imports/GDP",              sublabel: "I_o",    default: 0.2177, min: 0.05, max: 0.80, step: 0.01, unit: "ratio" },
  { key: "a_ratio", label: "NS/S labor ratio",         sublabel: "α",      default: 0.60,   min: 0, max: 5.0, step: 0.05, unit: "ratio",
    tooltip: "Liquidity-constrained (NS) vs savers (S). Default: 60% are NS (Buffie 2012)." },
  { key: "VA_n",    label: "Value added in NT sector", sublabel: "VA_n",   default: 0.5045, min: 0.20, max: 0.90, step: 0.01, unit: "ratio" },
  { key: "alpha_x", label: "Capital share, T sector",  sublabel: "α_x",    default: 0.40,   min: 0.10, max: 0.80, step: 0.05, unit: "ratio" },
  { key: "alpha_n", label: "Capital share, NT sector", sublabel: "α_n",    default: 0.55,   min: 0.10, max: 0.80, step: 0.05, unit: "ratio" },
  { key: "alpha_k", label: "NT inputs in K_priv",      sublabel: "α_k",    default: 0.50,   min: 0.10, max: 0.90, step: 0.05, unit: "ratio" },
  { key: "alpha_z", label: "NT inputs in K_pub",       sublabel: "α_z",    default: 0.50,   min: 0.10, max: 0.90, step: 0.05, unit: "ratio" },
  { key: "delta_x", label: "Depreciation, T sector",   sublabel: "δ_x",    default: 0.05,   min: 0.01, max: 0.20, step: 0.005, unit: "rate" },
  { key: "delta_n", label: "Depreciation, NT sector",  sublabel: "δ_n",    default: 0.05,   min: 0.01, max: 0.20, step: 0.005, unit: "rate" },
];

const DEBT_REV: ParamDef[] = [
  { key: "share_b",     label: "Domestic public debt/GDP",   sublabel: "b_o",     default: 0.414, min: 0, max: 1.5, step: 0.01, unit: "ratio" },
  { key: "share_d",     label: "Concessional debt/GDP",      sublabel: "d_o",     default: 0.001, min: 0, max: 1.0, step: 0.005, unit: "ratio" },
  { key: "share_dc",    label: "Ext. commercial debt/GDP",   sublabel: "d_c,o",   default: 0.196, min: 0, max: 1.0, step: 0.01, unit: "ratio" },
  { key: "share_bstar", label: "Private external debt/GDP",  sublabel: "b*_o",    default: 0.113, min: 0, max: 1.0, step: 0.01, unit: "ratio" },
  { key: "Savo",        label: "Contingency fund/GDP",       sublabel: "Sav_o",   default: 0,     min: 0, max: 0.50, step: 0.005, unit: "ratio",
    tooltip: "External natural-disaster savings fund." },
  { key: "share_grants",label: "Grants/GDP",                 sublabel: "G_o",     default: 0.078, min: 0, max: 0.50, step: 0.005, unit: "ratio" },
  { key: "share_remit", label: "Remittances/GDP",            sublabel: "R_o",     default: 0.089, min: 0, max: 0.50, step: 0.005, unit: "ratio" },
  { key: "ro",          label: "Real rate, domestic",        sublabel: "r_o",     default: 0.027, min: 0, max: 0.20, step: 0.005, unit: "rate" },
  { key: "r_dco",       label: "Real rate, ext.commercial",  sublabel: "r_dc,o",  default: 0.022, min: 0, max: 0.20, step: 0.005, unit: "rate" },
  { key: "rstar",       label: "Risk-free foreign rate",     sublabel: "r^f",     default: 0.04,  min: 0, max: 0.15, step: 0.005, unit: "rate" },
];

const FISCAL: ParamDef[] = [
  { key: "ho",         label: "Consumption tax (VAT)",      sublabel: "h",    default: 0.12, min: 0, max: 0.40, step: 0.005, unit: "rate" },
  { key: "hlo",        label: "Labor income tax",           sublabel: "h_l",  default: 0.25, min: 0, max: 0.60, step: 0.005, unit: "rate" },
  { key: "lambda",     label: "Fiscal adj — Transfers",     sublabel: "λ",    default: 0.20, min: 0, max: 1.0, step: 0.05, unit: "ratio",
    tooltip: "λ + λ_h + λ_hl = 1. How fiscal gap is split between transfers, VAT, labor tax." },
  { key: "lambda_h",   label: "Fiscal adj — VAT",           sublabel: "λ_h",  default: 0.40, min: 0, max: 1.0, step: 0.05, unit: "ratio" },
  { key: "lambda_hl",  label: "Fiscal adj — Labor tax",     sublabel: "λ_hl", default: 0.40, min: 0, max: 1.0, step: 0.05, unit: "ratio" },
  { key: "upsilon",    label: "Debt mix: ext-comm vs dom",  sublabel: "υ",    default: 0.50, min: 0, max: 1.0, step: 0.05, unit: "ratio" },
];

// 災害シナリオ — ユーザーが USD 金額や % で直接入力
// チャネル別に 3 カードに分割: ① 公共インフラ被害 ② 家計/民間資産被害 ③ 生産性・その他係数

const DAMAGE_PUBLIC: ParamDef[] = [
  { key: "damage_public_capital", label: "公共インフラ被害額",      sublabel: "shock_zi",  default: 0.005, min: 0, max: 0.50, step: 0.001, unit: "usd_pct",
    tooltip: "災害による公共インフラ(道路・橋・建物等)の破壊額。% of GDP / USD 金額の両方で編集可。" },
  { key: "damage_recon_efficiency", label: "公共投資効率の低下",   sublabel: "shock_s",   default: 0,     min: 0, max: 0.80, step: 0.01,  unit: "pct",
    tooltip: "災害後の再建期間中、 政府の投資が実際に capital に化ける割合の低下分(%)。容量制約・管理逼迫を反映。" },
  { key: "damage_risk_premium",   label: "対外債務リスクプレミアム上昇", sublabel: "shock_rextg", default: 0, min: 0, max: 0.10, step: 0.001, unit: "pct",
    tooltip: "災害後の信用格下げによる対外商業債のリスクプレミアム上昇(percentage point)。" },
];

const DAMAGE_PRIVATE: ParamDef[] = [
  { key: "damage_private_capital", label: "家計・民間資産被害額", sublabel: "shock_k",  default: 0.010, min: 0, max: 0.50, step: 0.001, unit: "usd_pct",
    tooltip: "災害による家計の住宅・耐久財・企業の生産設備の破壊額。% of GDP / USD 金額の両方で編集可。" },
  { key: "damage_share_tradable",  label: "うち貿易財部門への配分", sublabel: "share_T",  default: 0.50,  min: 0, max: 1.0,  step: 0.01,  unit: "ratio",
    tooltip: "民間資産被害のうち、 貿易財(農業・製造業など)部門に帰属する割合。残りは非貿易財(サービス・建設業など)。" },
];

const DAMAGE_TFP: ParamDef[] = [
  { key: "damage_yx", label: "貿易財部門 TFP 低下",      sublabel: "shock_yx", default: 0.03, min: 0, max: 0.50, step: 0.001, unit: "pct",
    tooltip: "災害による貿易財部門の総要素生産性(TFP)の直接低下(行動応答を除く、純粋技術的損失%)。" },
  { key: "damage_yn", label: "非貿易財部門 TFP 低下",    sublabel: "shock_yn", default: 0.04, min: 0, max: 0.50, step: 0.001, unit: "pct",
    tooltip: "災害による非貿易財部門のTFP直接低下%。インフラ寸断・物流停止等の直接影響。" },
];

type GroupDef = {
  id: string;
  title: string;
  subtitle: string;
  params: ParamDef[];
  // Tailwind classes for card background / border / accent
  cardBg: string;       // outer card background
  cardBorder: string;   // outer card border
  fieldBg: string;      // individual field background
  badgeBg: string;      // small color badge
  titleColor: string;
};

const ALL_GROUPS: GroupDef[] = [
  // ===== 災害被害 (3 cards) — 最上部 =====
  { id: "dmg_public", title: "災害被害 ① 公共インフラ",
    subtitle: "公共資本破壊・再建非効率・リスクプレミアム",
    params: DAMAGE_PUBLIC,
    cardBg: "bg-rose-50/70 dark:bg-rose-950/40",
    cardBorder: "border-rose-300 dark:border-rose-800",
    fieldBg: "bg-white dark:bg-rose-950/60",
    badgeBg: "bg-rose-500",
    titleColor: "text-rose-800 dark:text-rose-200" },
  { id: "dmg_private", title: "災害被害 ② 家計・民間資産",
    subtitle: "民間資本破壊・貿易/非貿易財配分",
    params: DAMAGE_PRIVATE,
    cardBg: "bg-orange-50/70 dark:bg-orange-950/40",
    cardBorder: "border-orange-300 dark:border-orange-800",
    fieldBg: "bg-white dark:bg-orange-950/60",
    badgeBg: "bg-orange-500",
    titleColor: "text-orange-800 dark:text-orange-200" },
  { id: "dmg_tfp", title: "災害被害 ③ 生産性・その他",
    subtitle: "TFP直接低下(貿易/非貿易財別)",
    params: DAMAGE_TFP,
    cardBg: "bg-amber-50/70 dark:bg-amber-950/40",
    cardBorder: "border-amber-300 dark:border-amber-800",
    fieldBg: "bg-white dark:bg-amber-950/60",
    badgeBg: "bg-amber-500",
    titleColor: "text-amber-800 dark:text-amber-200" },

  // ===== 構造パラメータ (4 cards) =====
  { id: "infra", title: "公共インフラ・パラメータ",
    subtitle: "標準 + 適応資本(構造)",
    params: PUB_INFRA,
    cardBg: "bg-sky-50/70 dark:bg-sky-950/40",
    cardBorder: "border-sky-300 dark:border-sky-800",
    fieldBg: "bg-white dark:bg-sky-950/60",
    badgeBg: "bg-sky-500",
    titleColor: "text-sky-800 dark:text-sky-200" },
  { id: "economy", title: "実体経済パラメータ",
    subtitle: "成長率・部門構成・家計",
    params: REAL_ECON,
    cardBg: "bg-emerald-50/70 dark:bg-emerald-950/40",
    cardBorder: "border-emerald-300 dark:border-emerald-800",
    fieldBg: "bg-white dark:bg-emerald-950/60",
    badgeBg: "bg-emerald-500",
    titleColor: "text-emerald-800 dark:text-emerald-200" },
  { id: "debt", title: "債務・収入パラメータ",
    subtitle: "公的/民間債務・金利",
    params: DEBT_REV,
    cardBg: "bg-violet-50/70 dark:bg-violet-950/40",
    cardBorder: "border-violet-300 dark:border-violet-800",
    fieldBg: "bg-white dark:bg-violet-950/60",
    badgeBg: "bg-violet-500",
    titleColor: "text-violet-800 dark:text-violet-200" },
  { id: "fiscal", title: "財政手段パラメータ",
    subtitle: "税率・財政調整ウェイト",
    params: FISCAL,
    cardBg: "bg-slate-100 dark:bg-slate-900/60",
    cardBorder: "border-slate-300 dark:border-slate-700",
    fieldBg: "bg-white dark:bg-slate-950",
    badgeBg: "bg-slate-500",
    titleColor: "text-slate-800 dark:text-slate-200" },
];

/* ============================================================================
   Helpers
   ========================================================================= */

function defaultParams(): Record<string, number> {
  const out: Record<string, number> = {};
  for (const g of ALL_GROUPS) for (const p of g.params) out[p.key] = p.default;
  return out;
}

function fmtUSD(amount: number) {
  if (!isFinite(amount)) return "—";
  const abs = Math.abs(amount);
  if (abs >= 1e12) return `${(amount / 1e12).toFixed(2)} T USD`;
  if (abs >= 1e9)  return `${(amount / 1e9).toFixed(2)} B USD`;
  if (abs >= 1e6)  return `${(amount / 1e6).toFixed(2)} M USD`;
  if (abs >= 1e3)  return `${(amount / 1e3).toFixed(2)} K USD`;
  return `${amount.toFixed(0)} USD`;
}

function fmtPct(v: number | null | undefined, digits = 2) {
  if (v == null || !isFinite(v)) return "—";
  return `${v >= 0 ? "+" : ""}${v.toFixed(digits)}%`;
}

/* ============================================================================
   Chart component
   ========================================================================= */

function LineChart({ years, values, color, ylabel }:
  { years: number[]; values: (number|null)[]; color: string; ylabel: string }) {
  const pts = years.map((y, i) => ({ y, v: values[i] ?? 0 }));
  if (pts.length === 0) return null;
  const w = 720, h = 240, padL = 56, padR = 14, padT = 16, padB = 32;
  const innerW = w - padL - padR, innerH = h - padT - padB;
  const vals = pts.map(p => p.v);
  const minV = Math.min(...vals, 0), maxV = Math.max(...vals, 0);
  const r = (maxV - minV) || 1;
  const yMin = minV - r * 0.1, yMax = maxV + r * 0.1;
  const xFor = (i: number) => padL + (i / (pts.length - 1)) * innerW;
  const yFor = (v: number) => padT + ((yMax - v) / (yMax - yMin)) * innerH;
  const path = pts.map((p, i) => `${i === 0 ? "M" : "L"}${xFor(i).toFixed(1)},${yFor(p.v).toFixed(1)}`).join(" ");
  const areaPath = `${path} L${xFor(pts.length-1).toFixed(1)},${yFor(0).toFixed(1)} L${xFor(0).toFixed(1)},${yFor(0).toFixed(1)} Z`;
  const yTicks = 5;
  const ticks = Array.from({ length: yTicks }, (_, i) => yMin + ((yMax - yMin) * i) / (yTicks - 1));
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-auto w-full">
      <text x={padL} y={padT - 4} fontSize="11" fill="#64748b">{ylabel}</text>
      <line x1={padL} y1={yFor(0)} x2={w - padR} y2={yFor(0)} stroke="#94a3b8" strokeDasharray="3 3" />
      {ticks.map((t, i) => (
        <g key={i}>
          <line x1={padL} y1={yFor(t)} x2={w - padR} y2={yFor(t)} stroke="#e2e8f0" />
          <text x={padL - 6} y={yFor(t) + 4} textAnchor="end" fontSize="10" fill="#64748b">{t.toFixed(2)}</text>
        </g>
      ))}
      {pts.map((p, i) => i % 2 === 0 && (
        <text key={p.y} x={xFor(i)} y={h - padB + 14} textAnchor="middle" fontSize="10" fill="#64748b">{p.y}</text>
      ))}
      <path d={areaPath} fill={`${color}22`} />
      <path d={path} fill="none" stroke={color} strokeWidth="2" />
      {pts.map((p, i) => <circle key={i} cx={xFor(i)} cy={yFor(p.v)} r="2.5" fill={color} />)}
      <line x1={padL} y1={padT} x2={padL} y2={h - padB} stroke="#475569" />
      <line x1={padL} y1={h - padB} x2={w - padR} y2={h - padB} stroke="#475569" />
    </svg>
  );
}

/* ============================================================================
   Parameter card (group of NumFields, with group-specific colors)
   ========================================================================= */

function ParamCard({ group, params, setParam, gdpUsd }:
  { group: GroupDef; params: Record<string, number>; setParam: (k: string, v: number) => void; gdpUsd: number }) {
  return (
    <div className={`rounded-md border-2 p-4 shadow-sm ${group.cardBg} ${group.cardBorder}`}>
      <div className="mb-3 flex items-baseline justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className={`inline-block h-3 w-3 rounded-full ${group.badgeBg}`} />
          <h3 className={`text-sm font-bold ${group.titleColor}`}>{group.title}</h3>
        </div>
        <span className="text-[10px] text-muted">{group.subtitle}</span>
      </div>
      <div className="grid grid-cols-2 gap-2 xl:grid-cols-3">
        {group.params.map((p) => (
          <NumField key={p.key} def={p} value={params[p.key] ?? p.default}
                    onChange={(v) => setParam(p.key, v)} gdpUsd={gdpUsd}
                    fieldBg={group.fieldBg} />
        ))}
      </div>
    </div>
  );
}

/* ============================================================================
   Parameter input field
   ========================================================================= */

function NumField({ def, value, onChange, gdpUsd, fieldBg }:
  { def: ParamDef; value: number; onChange: (v: number) => void; gdpUsd: number; fieldBg?: string }) {
  const [showTip, setShowTip] = useState(false);
  const usdValue = def.unit === "usd_pct" ? value * gdpUsd : null;
  const onUsdChange = (usd: number) => { if (gdpUsd) onChange(usd / gdpUsd); };

  return (
    <div className={`relative rounded-md border border-border px-3 py-2 ${fieldBg ?? "bg-slate-50 dark:bg-slate-900"}`}>
      <div className="mb-1 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="truncate text-[11px] font-medium text-slate-700 dark:text-slate-200">{def.label}</div>
          {def.sublabel && <div className="text-[9px] font-mono text-slate-400">{def.sublabel}</div>}
        </div>
        {def.tooltip && (
          <button
            type="button"
            onMouseEnter={() => setShowTip(true)}
            onMouseLeave={() => setShowTip(false)}
            onClick={() => setShowTip(s => !s)}
            className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-slate-300 text-[9px] font-bold text-white hover:bg-slate-500 dark:bg-slate-600"
            aria-label="info"
          >i</button>
        )}
      </div>
      {showTip && def.tooltip && (
        <div className="absolute left-0 right-0 top-full z-10 mt-1 rounded-md border border-border bg-white p-2 text-[10px] leading-snug text-slate-700 shadow-lg dark:bg-slate-800 dark:text-slate-100">
          {def.tooltip}
        </div>
      )}
      <input
        type="number"
        value={Number.isFinite(value) ? value : 0}
        step="any"
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        className="w-full rounded border border-border bg-white px-2 py-1 text-right text-xs font-mono text-slate-700 dark:bg-slate-800 dark:text-slate-100"
      />
      {usdValue !== null && (
        <div className="mt-1 flex items-center gap-1">
          <span className="text-[9px] text-slate-400">USD:</span>
          <input
            type="number"
            value={usdValue}
            step="any"
            onChange={(e) => onUsdChange(parseFloat(e.target.value) || 0)}
            className="w-full rounded border border-border bg-white px-2 py-1 text-right text-[11px] font-mono text-emerald-700 dark:bg-slate-800 dark:text-emerald-300"
          />
          <span className="text-[10px] text-slate-400">{fmtUSD(usdValue).split(" ").slice(1).join(" ")}</span>
        </div>
      )}
    </div>
  );
}

/* ============================================================================
   Main page
   ========================================================================= */

type ApiResult = {
  elapsed_seconds: number;
  years: number[];
  gdp_pct_dev: (number | null)[];
  k_pct_dev?: (number | null)[];
  debt_pct_gdp_dev?: (number | null)[];
  private_inv?: (number | null)[];
  private_cons_pct_dev?: (number | null)[];
  consumption_tax?: number[];
  labor_tax?: number[];
  params: Record<string, unknown>;
};

export default function DsgePage() {
  const [region, setRegion] = useState("RegionII");
  const [disasterYear, setDisasterYear] = useState<number>(2015);
  const [gdpUsd, setGdpUsd] = useState(10_000_000_000); // 10B USD default (Region II 2015 相当)
  const [params, setParams] = useState<Record<string, number>>(defaultParams);
  const setParam = (k: string, v: number) => setParams((p) => ({ ...p, [k]: v }));

  const [regions, setRegions] = useState<Record<string, RegionInfo>>(REGIONS_FALLBACK);
  useEffect(() => {
    fetch(`${API_BASE}/regions`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(setRegions)
      .catch(() => {});
  }, []);

  // 地域変更時に g (構造パラメータ既定値) のみ更新
  useEffect(() => {
    const info = regions[region];
    if (!info) return;
    setParams((p) => ({ ...p, g: info.g_run1 }));
  }, [region, regions]);

  // ===== 地域+年 → /economic-data 自動取得 =====
  const [econLoading, setEconLoading] = useState(false);
  const [econNote, setEconNote] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setEconLoading(true);
    setEconNote(null);
    fetch(`${API_BASE}/economic-data?region=${region}&year=${disasterYear}`)
      .then((r) => (r.ok ? r.json() : r.json().then((j) => Promise.reject(j))))
      .then((d) => {
        if (cancelled) return;
        if (d.grdp_usd) setGdpUsd(Math.round(d.grdp_usd));
        const upd: Record<string, number> = {};
        if (d.VA_n) upd.VA_n = d.VA_n;
        if (d.g_trend) upd.g = Math.min(d.g_trend, 0.10); // hard cap
        if (Object.keys(upd).length) setParams((p) => ({ ...p, ...upd }));
        setEconNote(
          `PSA ${d.year}: GRDP = ${d.grdp_usd ? (d.grdp_usd / 1e9).toFixed(2) : "—"} B USD `
          + `(FX ${d.php_per_usd?.toFixed(2)} PHP/USD), `
          + `VA_n = ${d.VA_n?.toFixed(4) ?? "—"}, `
          + `g = ${d.g_trend ? (d.g_trend * 100).toFixed(2) + "%" : "—"} `
          + `(過去${d.g_window ?? "—"}年CAGR)`
        );
      })
      .catch((err) => {
        if (cancelled) return;
        setEconNote(`既定値を使用 (${err?.error ?? "PSAデータ取得失敗"})`);
      })
      .finally(() => !cancelled && setEconLoading(false));
    return () => { cancelled = true; };
  }, [region, disasterYear]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ApiResult | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError(null); setResult(null);
    try {
      const resp = await fetch(`${API_BASE}/simulate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // damage_run は backend が template ファイルを選ぶための内部値
        // (Disaster 値はすべて params で上書きされるため Run1/Run2 の違いは消える)
        // disaster_year は結果の x 軸ラベルを災害年に合わせるためのヒント
        body: JSON.stringify({ region, damage_run: "Run1", disaster_year: disasterYear, params }),
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

  // Run1 テンプレ固定: 基準年 2014、 災害年 2015 (index = 1)
  const damageIdx = 1;
  const kpis = useMemo(() => {
    if (!result) return null;
    const at = (off: number) => result.gdp_pct_dev[damageIdx + off] ?? null;
    return {
      damage: at(0), year1: at(1), year5: at(5), year10: at(10),
      elapsed: result.elapsed_seconds,
    };
  }, [result, damageIdx]);

  const usdLoss = useMemo(() => {
    if (!result || !kpis) return null;
    const calc = (p: number | null) => (p != null ? (p / 100) * gdpUsd : null);
    return { damage: calc(kpis.damage), year1: calc(kpis.year1), year5: calc(kpis.year5), year10: calc(kpis.year10) };
  }, [kpis, gdpUsd]);

  return (
    <div className="mx-auto max-w-[1240px] px-4 py-10">
      {/* ===== Hero ===== */}
      <header className="mb-8 border-b-[3px] border-accent pb-4 text-center">
        <h1 className="mb-1 text-2xl font-bold text-[#1e3a5f] dark:text-accent">
          経済被害評価DSGEモデル
        </h1>
        <p className="text-sm text-muted">
          DIGNAD (Debt, Investment, Growth, and Natural Disasters) on GNU Octave 6.4 + Dynare 4.5.6
        </p>
        <p className="mt-1 text-xs text-muted">
          オリエンタルコンサルタンツグローバル 水資源・防災部
        </p>
      </header>

      {/* ===== What is DSGE ===== */}
      <section className="mb-6 rounded-lg border border-border bg-card-bg p-6 shadow-sm">
        <h2 className="mb-3 border-b-2 border-accent-light pb-2 text-lg font-bold text-[#1e3a5f] dark:text-accent">
          DSGE モデルとは?
        </h2>
        <div className="space-y-3 text-sm leading-relaxed text-muted">
          <p>
            <strong>DSGE (Dynamic Stochastic General Equilibrium)</strong> モデルは、
            経済全体を「最適化する家計・企業・政府の相互作用」として動学的に記述する
            マクロ経済モデルです。中央銀行・IMF・主要研究機関で政策シミュレーションの中核
            ツールとして使われています。
          </p>
          <ul className="ml-5 list-disc space-y-1">
            <li><strong>Dynamic</strong>: 各期(年)の意思決定が将来期待を含む</li>
            <li><strong>Stochastic</strong>: 外的ショック (災害、金利、需要) に対する応答を計算</li>
            <li><strong>General Equilibrium</strong>: 家計・企業・政府・海外の市場すべてが同時に均衡</li>
          </ul>
          <p>
            DSGE は「需要・供給・財政・金融が連動した波及効果」を 1 つの整合的フレームワークで
            評価できる強みがあり、災害・パンデミック・気候変動など多面的ショックの影響評価に適しています。
          </p>
        </div>
      </section>

      {/* ===== DIGNAD model overview ===== */}
      <section className="mb-6 rounded-lg border border-border bg-card-bg p-6 shadow-sm">
        <h2 className="mb-3 border-b-2 border-accent-light pb-2 text-lg font-bold text-[#1e3a5f] dark:text-accent">
          DIGNAD モデルの構造
        </h2>
        <div className="space-y-4 text-sm leading-relaxed text-muted">
          <p>
            <strong>DIGNAD</strong> は IMF が低所得・新興国の災害マクロ財政分析のために
            開発した小国開放経済 DSGE モデルです (Marto, Papageorgiou &amp; Klyuev, <em>Journal of
            Development Economics</em> Vol.135, 2018; Buffie et al. 2012)。過去 10 年間で
            アフリカ・アジア・太平洋の 70 カ国以上で実用されました。
          </p>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-md border border-accent/30 bg-accent-light/30 p-3">
              <h3 className="mb-1 text-sm font-bold text-accent">① 家計部門</h3>
              <p className="text-xs">
                金融アクセスを持つ「貯蓄家計 (Savers)」と、流動性制約家計
                (Non-Savers, 全人口の ~60%) の 2 タイプ。労働供給・消費・貯蓄を
                最適化。送金・政府移転も含む。
              </p>
            </div>
            <div className="rounded-md border border-accent/30 bg-accent-light/30 p-3">
              <h3 className="mb-1 text-sm font-bold text-accent">② 企業部門</h3>
              <p className="text-xs">
                貿易財 (T) と非貿易財 (NT) の 2 部門。Cobb-Douglas 技術で資本と労働を
                投入、TFP は公共インフラ・ストックに依存。標準インフラと適応インフラ
                は完全代替で集約。
              </p>
            </div>
            <div className="rounded-md border border-accent/30 bg-accent-light/30 p-3">
              <h3 className="mb-1 text-sm font-bold text-accent">③ 政府部門</h3>
              <p className="text-xs">
                消費税・労働所得税・移転を操作。国内債/譲許債/対外商業債/対外私債/
                外援助/天然資源収入を組み合わせて投資 (標準/適応) を財源化。財政ルール
                or 債務調整いずれかで均衡。
              </p>
            </div>
          </div>
          <p className="mt-2">
            <strong>災害は 5 つのチャネルで経済に伝播</strong>します:
          </p>
          <ol className="ml-5 list-decimal space-y-1">
            <li><strong>公共資本ストックの破壊</strong> → 政府による再建コスト</li>
            <li><strong>民間資本ストックの破壊</strong> → 民間投資による回復、調整コスト</li>
            <li><strong>TFP 一時低下</strong> → 外生的・段階的に回復</li>
            <li><strong>対外債務リスクプレミアム上昇</strong> → 借入コスト増</li>
            <li><strong>公共投資効率低下</strong> → 容量制約による再建非効率</li>
          </ol>
        </div>
      </section>

      {/* ===== Top-level controls + parameter grid ===== */}
      <section className="mb-6 rounded-lg border border-border bg-card-bg p-6 shadow-sm">
        <h2 className="mb-4 border-b-2 border-accent-light pb-2 text-lg font-bold text-[#1e3a5f] dark:text-accent">
          シナリオ設定
        </h2>
        <form onSubmit={submit}>
          <div className="grid gap-4 md:grid-cols-3">
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-muted">
                対象地域
              </span>
              <select value={region} onChange={(e) => setRegion(e.target.value)}
                className="w-full rounded-md border border-border bg-white px-3 py-2 text-sm dark:bg-slate-800">
                {Object.entries(regions).map(([k, v]) => (<option key={k} value={k}>{v.label}</option>))}
              </select>
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-muted">
                災害年 <span className="text-[10px] opacity-60">— その年のPSAデータが自動取得される</span>
              </span>
              <select
                value={disasterYear}
                onChange={(e) => setDisasterYear(parseInt(e.target.value, 10))}
                className="w-full rounded-md border border-border bg-white px-3 py-2 text-sm dark:bg-slate-800"
              >
                {Array.from({ length: 24 }, (_, i) => 2000 + i).map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </label>
            <div className="block">
              <span className="mb-1 block text-xs font-medium text-muted">
                ベースライン GDP (USD)
                {econLoading && <span className="ml-1 text-[10px] text-accent">取得中...</span>}
                <span className="ml-1 text-[10px] opacity-60">— 地域+年から自動取得</span>
              </span>
              <div className="rounded-md border border-border bg-slate-50 px-3 py-2 text-right font-mono text-sm text-slate-700 dark:bg-slate-900 dark:text-slate-200">
                {fmtUSD(gdpUsd)}
              </div>
              <div className="mt-1 text-right text-[10px] font-mono text-slate-400">
                {gdpUsd.toLocaleString()} USD
              </div>
            </div>
          </div>
          {econNote && (
            <div className="mt-2 rounded-md border border-emerald-200 bg-emerald-50/60 px-3 py-1.5 text-[11px] text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-100">
              📊 {econNote}
            </div>
          )}
          <div className="mt-3 rounded-md border border-amber-200 bg-amber-50/60 p-3 text-[11px] leading-relaxed text-amber-900 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-100">
            <strong>ベースラインGDP</strong> は 地域 + 災害年 から PSA 2018PSNA データを使って自動取得されます。
            DIGNAD は GDP を内部で 100 に標準化するため、 被害額(USD) と結果(USD偏差) を実額に換算する
            スケール係数として使われます。
            例: フィリピン全国 ≈ 480B USD、 Region II ≈ 10B USD、 NCR ≈ 300B USD。
            <br />※ 災害被害は下記の <strong className="text-rose-700 dark:text-rose-300">災害被害 ①〜③ カード</strong>
            で <strong>USD 金額または %</strong> で直接入力してください。 事前定義シナリオ(Run1/Run2) は廃止し、
            被害は完全にユーザー入力で決まります。
          </div>

          {/* 災害被害 (最上部、赤系) */}
          <div className="mt-6 mb-3 flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-rose-500" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-300">災害シナリオ (Damage Shocks)</h3>
            <span className="text-[10px] text-muted">— 災害規模をここで決定</span>
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            {ALL_GROUPS.filter(g => g.id.startsWith("dmg_")).map((g) => (
              <ParamCard key={g.id} group={g} params={params} setParam={setParam} gdpUsd={gdpUsd} />
            ))}
          </div>

          {/* 構造パラメータ */}
          <div className="mt-8 mb-3 flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-sky-500" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-sky-700 dark:text-sky-300">経済構造パラメータ (Calibration)</h3>
            <span className="text-[10px] text-muted">— 既定値で動作 (高度な調整用)</span>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            {ALL_GROUPS.filter(g => !g.id.startsWith("dmg_")).map((g) => (
              <ParamCard key={g.id} group={g} params={params} setParam={setParam} gdpUsd={gdpUsd} />
            ))}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <button type="submit" disabled={loading}
              className="rounded-md bg-accent px-6 py-2.5 text-sm font-semibold text-white shadow hover:bg-accent/90 disabled:cursor-wait disabled:opacity-60">
              {loading ? "計算中... (~60秒)" : "シミュレーション実行"}
            </button>
            <button type="button" onClick={() => setParams(defaultParams())}
              className="rounded-md border border-border bg-white px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-100">
              すべて既定値にリセット
            </button>
            {error && <span className="text-xs text-red-600">エラー: {error}</span>}
          </div>
        </form>
      </section>

      {/* ===== Results ===== */}
      {result && kpis && usdLoss && (
        <section className="mb-6 rounded-lg border border-border bg-card-bg p-6 shadow-sm">
          <h2 className="mb-4 border-b-2 border-accent-light pb-2 text-lg font-bold text-[#1e3a5f] dark:text-accent">
            シミュレーション結果
          </h2>
          <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-5">
            {[
              { label: "災害年 GDP偏差", pct: kpis.damage, usd: usdLoss.damage },
              { label: "+1年",         pct: kpis.year1,  usd: usdLoss.year1 },
              { label: "+5年",         pct: kpis.year5,  usd: usdLoss.year5 },
              { label: "+10年",        pct: kpis.year10, usd: usdLoss.year10 },
              { label: "計算時間",     pct: null,        usd: null, extra: `${kpis.elapsed.toFixed(1)} s` },
            ].map((k) => (
              <div key={k.label} className="rounded-md border border-border bg-slate-50 px-3 py-2 dark:bg-slate-900">
                <div className="text-[10px] text-muted">{k.label}</div>
                {k.extra ? (
                  <div className="text-base font-bold font-mono text-slate-700">{k.extra}</div>
                ) : (
                  <>
                    <div className={`text-base font-bold font-mono ${k.pct == null ? "" : k.pct < 0 ? "text-red-700" : "text-green-700"}`}>
                      {fmtPct(k.pct)}
                    </div>
                    <div className="mt-0.5 text-[10px] font-mono text-emerald-700">{fmtUSD(k.usd ?? 0)}</div>
                  </>
                )}
              </div>
            ))}
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-md border border-border bg-white p-3 dark:bg-slate-950">
              <LineChart years={result.years} values={result.gdp_pct_dev} color="#1d4ed8" ylabel="Real GDP 偏差 (%)" />
            </div>
            {result.private_cons_pct_dev && (
              <div className="rounded-md border border-border bg-white p-3 dark:bg-slate-950">
                <LineChart years={result.years} values={result.private_cons_pct_dev} color="#ea580c" ylabel="民間消費 偏差 (%)" />
              </div>
            )}
            {result.debt_pct_gdp_dev && (
              <div className="rounded-md border border-border bg-white p-3 dark:bg-slate-950">
                <LineChart years={result.years} values={result.debt_pct_gdp_dev} color="#7c3aed" ylabel="国内公的債務 偏差 (%)" />
              </div>
            )}
            {result.private_inv && (
              <div className="rounded-md border border-border bg-white p-3 dark:bg-slate-950">
                <LineChart years={result.years} values={result.private_inv} color="#0d9488" ylabel="民間投資 水準" />
              </div>
            )}
          </div>

          <details className="mt-4 text-xs text-muted">
            <summary className="cursor-pointer">レスポンス全文 (JSON)</summary>
            <pre className="mt-2 max-h-80 overflow-auto rounded bg-slate-900 p-3 text-[10px] text-slate-100">
              {JSON.stringify(result, null, 2)}
            </pre>
          </details>
        </section>
      )}

      {/* ===== Notes ===== */}
      <section className="rounded-lg border border-border bg-card-bg p-6 shadow-sm">
        <h2 className="mb-3 border-b-2 border-accent-light pb-2 text-lg font-bold text-[#1e3a5f] dark:text-accent">
          技術ノート
        </h2>
        <ul className="ml-5 list-disc space-y-1 text-sm leading-relaxed text-muted">
          <li>計算エンジン: <strong>GNU Octave 6.4 + Dynare 4.5.6</strong> (Linux ソースビルド), Cloud Run 上で実行。1リクエスト ~60秒。</li>
          <li>地域別 <code>g</code>, <code>VA<sub>n</sub></code> は PSA 2018PSNA 名目GRDPから算出 (フィリピン 17 地域)。</li>
          <li>制約: <code>g ≥ 0.10</code> で Dynare Jacobian が爆発するため自動的に 0.10 にキャップ。</li>
          <li>USD 換算は「Real GDP 偏差 (%) × ベースライン GDP (USD)」の単純線形換算で、為替変動・物価変動は考慮していません。</li>
          <li>パラメータ詳細・出典: <a href="https://www.elibrary.imf.org/view/journals/005/2023/003/article-A001-en.xml" target="_blank" rel="noopener noreferrer" className="text-accent underline">IMF Technical Note 2023/03</a> 参照。</li>
        </ul>
      </section>

      <footer className="mt-6 text-center text-[11px] text-muted">
        DIGNAD model: Marto, Papageorgiou &amp; Klyuev (2018), <em>Journal of Development Economics</em> Vol.135 ·
        IMF DIGNAD Toolkit (Aligishiev, Ruane &amp; Sultanov 2023)
      </footer>
    </div>
  );
}

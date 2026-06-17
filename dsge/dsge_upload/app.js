// DSGE経済モデル — frontend logic
// Edit API_BASE after deploying the Cloud Run backend.

const API_BASE = (() => {
  // Allow running against localhost during dev (`?api=http://localhost:8080`)
  const qs = new URLSearchParams(location.search);
  if (qs.has("api")) return qs.get("api").replace(/\/$/, "");
  // Production: Cloud Run URL set below before deploy
  return "https://dignad-api-wp3vw2gjra-an.a.run.app";
})();

const REGIONS_FALLBACK = {
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

const els = {
  region:    document.getElementById("region"),
  damageRun: document.getElementById("damage_run"),
  g:         document.getElementById("g"),
  gVal:      document.getElementById("g_val"),
  van:       document.getElementById("van"),
  vanVal:    document.getElementById("van_val"),
  form:      document.getElementById("form"),
  runBtn:    document.getElementById("run_btn"),
  resetBtn:  document.getElementById("reset_btn"),
  statusCard:document.getElementById("status_card"),
  statusMsg: document.getElementById("status_msg"),
  resultCard:document.getElementById("result_card"),
  rawJson:   document.getElementById("raw_json"),
  kpi_d:     document.getElementById("kpi_d"),
  kpi_d1:    document.getElementById("kpi_d1"),
  kpi_d5:    document.getElementById("kpi_d5"),
  kpi_d10:   document.getElementById("kpi_d10"),
  kpi_elapsed: document.getElementById("kpi_elapsed"),
  chartCanvas: document.getElementById("gdp_chart"),
};

let regionsCache = null;
let chart = null;

async function loadRegions() {
  try {
    const resp = await fetch(`${API_BASE}/regions`);
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    regionsCache = await resp.json();
  } catch (err) {
    console.warn("Falling back to embedded region defaults:", err);
    regionsCache = REGIONS_FALLBACK;
  }
  populateRegionSelect();
  applyDefaults();
}

function populateRegionSelect() {
  const sel = els.region;
  sel.innerHTML = "";
  for (const [key, info] of Object.entries(regionsCache)) {
    const opt = document.createElement("option");
    opt.value = key;
    opt.textContent = info.label || key;
    if (key === "RegionII") opt.selected = true;
    sel.appendChild(opt);
  }
}

function applyDefaults() {
  const key = els.region.value;
  const run = els.damageRun.value;
  const info = regionsCache[key];
  if (!info) return;
  const g = run === "Run1" ? info.g_run1 : info.g_run2;
  const van = run === "Run1" ? info.van_run1 : info.van_run2;
  els.g.value = g;
  els.gVal.value = g.toFixed(4);
  els.van.value = van;
  els.vanVal.value = van.toFixed(4);
}

els.region.addEventListener("change", applyDefaults);
els.damageRun.addEventListener("change", applyDefaults);
els.g.addEventListener("input", () => { els.gVal.value = parseFloat(els.g.value).toFixed(4); });
els.van.addEventListener("input", () => { els.vanVal.value = parseFloat(els.van.value).toFixed(4); });

els.resetBtn.addEventListener("click", () => { applyDefaults(); });

els.form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const payload = {
    region:      els.region.value,
    damage_run:  els.damageRun.value,
    g:           parseFloat(els.g.value),
    VA_n:        parseFloat(els.van.value),
  };

  els.runBtn.disabled = true;
  els.statusCard.hidden = false;
  els.statusMsg.textContent = "Octave サーバで計算中... (通常 15〜30 秒)";
  els.resultCard.hidden = true;

  const t0 = performance.now();
  try {
    const resp = await fetch(`${API_BASE}/simulate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await resp.json();
    if (!resp.ok) throw new Error(data.error || `HTTP ${resp.status}`);
    renderResult(data, (performance.now() - t0) / 1000);
    els.statusCard.hidden = true;
  } catch (err) {
    els.statusMsg.textContent = "エラー: " + err.message;
    console.error(err);
  } finally {
    els.runBtn.disabled = false;
  }
});

function renderResult(data, clientElapsed) {
  els.resultCard.hidden = false;
  els.rawJson.textContent = JSON.stringify(data, null, 2);

  const years = data.years || [];
  const gdp = data.gdp_pct_dev || data.y || [];

  // Damage year is 2015 for Run1, 2016 for Run2 (offset 1 or 2 from 2014 base)
  const damageIdx = data.params && data.params.damage_run === "Run2" ? 2 : 1;

  const fmtPct = (v) => v == null ? "—" : `${v >= 0 ? "+" : ""}${(v).toFixed(2)}%`;
  const setKpi = (el, v) => {
    el.textContent = fmtPct(v);
    el.classList.remove("neg", "pos");
    if (v != null) el.classList.add(v < 0 ? "neg" : "pos");
  };

  setKpi(els.kpi_d,   gdp[damageIdx]);
  setKpi(els.kpi_d1,  gdp[damageIdx + 1]);
  setKpi(els.kpi_d5,  gdp[damageIdx + 5]);
  setKpi(els.kpi_d10, gdp[damageIdx + 10]);
  els.kpi_elapsed.textContent = `${(data.elapsed_seconds || clientElapsed).toFixed(1)} s`;

  if (chart) chart.destroy();
  chart = new Chart(els.chartCanvas, {
    type: "line",
    data: {
      labels: years,
      datasets: [{
        label: "Real GDP 偏差 (% from initial year)",
        data: gdp,
        borderColor: "#1d4ed8",
        backgroundColor: "rgba(29, 78, 216, 0.12)",
        fill: true,
        tension: 0.2,
        pointRadius: 3,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: { title: { display: true, text: "% deviation" } },
        x: { title: { display: true, text: "Year" } },
      },
      plugins: { legend: { display: false } },
    },
  });
}

loadRegions();

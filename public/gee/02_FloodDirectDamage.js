// ============================================================
// 02_Flood_DirectDamage.js
// 洪水直接被害計算ツール（FwDET + 被害曲線）
// Oriental Consultants Global - MyProject 第10期
// ============================================================
// 前提:
//   - 01_LULC_RandomForest.js で作成した土地利用図をGEE Assetにアップロード済み
//   - 浸水範囲・浸水深は別途SAR-DATで作成しAssetにアップロード済み
//     （もしくは本コード内のSTEP1で自動生成）
//   - Hospital, School, NatRoad, MunRoad は必要に応じてAssetを用意
// ============================================================

// ==================== 行政境界データ ====================
var gaul2 = ee.FeatureCollection('FAO/GAUL/2015/level2');
var phProv = gaul2.filter(ee.Filter.eq('ADM0_NAME', 'Philippines'));

// フィリピン市町村境界（Provinceフィールド、NAME_2が市町村名）
var phMuni = ee.FeatureCollection('users/kurihara-yt/Philippines_MuniCities');

var regionProvinces = {
  'Region I - Ilocos': ['Ilocos Norte','Ilocos Sur','La Union','Pangasinan'],
  'Region II - Cagayan Valley': ['Batanes','Cagayan','Isabela','Nueva Vizcaya','Quirino'],
  'Region III - Central Luzon': ['Aurora','Bataan','Bulacan','Nueva Ecija','Pampanga','Tarlac','Zambales'],
  'Region IV-A - CALABARZON': ['Batangas','Cavite','Laguna','Quezon','Rizal'],
  'Region V - Bicol': ['Albay','Camarines Norte','Camarines Sur','Catanduanes','Masbate','Sorsogon'],
  'Region VI - Western Visayas': ['Aklan','Antique','Capiz','Guimaras','Iloilo','Negros Occidental'],
  'Region VII - Central Visayas': ['Bohol','Cebu','Negros Oriental','Siquijor'],
  'Region VIII - Eastern Visayas': ['Biliran','Eastern Samar','Leyte','Northern Samar','Samar','Southern Leyte'],
  'Region IX - Zamboanga': ['Zamboanga Del Norte','Zamboanga Del Sur','Zamboanga Sibugay'],
  'Region X - Northern Mindanao': ['Bukidnon','Camiguin','Lanao Del Norte','Misamis Occidental','Misamis Oriental'],
  'Region XI - Davao': ['Compostela','Davao del Norte','Davao Del Sur','Davao Oriental'],
  'Region XII - SOCCSKSARGEN': ['North Cotabato','Saranggani','South Cotabato','Sultan Kudarat'],
  'Region XIII - Caraga': ['Agusan Del Norte','Agusan Del Sur','Dinagat','Surigao Del Norte','Surigao Del Sur'],
  'BARMM': ['Basilan','Lanao Del Sur','Maguindanao','Shariff Kabunsuan','Sulu','Tawi-tawi'],
  'CAR - Cordillera': ['Abra','Apayao','Benguet','Ifugao','Kalinga','Mountain Province'],
  'NCR - Metro Manila': ['Metropolitan Manila'],
};

// ==================== UIパネル ====================
var panel = ui.Panel({style: {width: '340px', padding: '8px'}});
ui.root.insert(0, panel);

panel.add(ui.Label('洪水直接被害計算ツール', {
  fontWeight: 'bold', fontSize: '16px', margin: '0 0 4px 0'
}));
panel.add(ui.Label('Flood Direct Damage Estimation', {fontSize: '12px', color: 'gray'}));

// --- 入力方式の選択 ---
panel.add(ui.Label('浸水データ入力:', {fontWeight: 'bold', margin: '14px 0 4px 0'}));
var inputMode = ui.Select({
  items: ['SAR画像から自動生成', 'Assetから読み込み'],
  value: 'SAR画像から自動生成',
  style: {stretch: 'horizontal'}
});
panel.add(inputMode);

// --- SAR自動生成パラメータ ---
var sarPanel = ui.Panel();
panel.add(sarPanel);

sarPanel.add(ui.Label('洪水発生日 (After):', {fontWeight: 'bold', margin: '10px 0 4px 0'}));
var afterYear = ui.Select({items: ['2017','2018','2019','2020','2021','2022','2023','2024','2025'], value: '2020', style: {stretch: 'horizontal'}});
var afterMonth = ui.Select({items: ['01','02','03','04','05','06','07','08','09','10','11','12'], value: '11', style: {stretch: 'horizontal'}});
var afterDay = ui.Select({items: (function(){var d=[];for(var i=1;i<=31;i++)d.push(String(i<10?'0'+i:i));return d;})(), value: '13', style: {stretch: 'horizontal'}});
sarPanel.add(ui.Panel([afterYear, afterMonth, afterDay], ui.Panel.Layout.Flow('horizontal')));

sarPanel.add(ui.Label('比較画像日 (Before):', {fontWeight: 'bold', margin: '10px 0 4px 0'}));
var beforeYear = ui.Select({items: ['2017','2018','2019','2020','2021','2022','2023','2024','2025'], value: '2020', style: {stretch: 'horizontal'}});
var beforeMonth = ui.Select({items: ['01','02','03','04','05','06','07','08','09','10','11','12'], value: '10', style: {stretch: 'horizontal'}});
var beforeDay = ui.Select({items: (function(){var d=[];for(var i=1;i<=31;i++)d.push(String(i<10?'0'+i:i));return d;})(), value: '08', style: {stretch: 'horizontal'}});
sarPanel.add(ui.Panel([beforeYear, beforeMonth, beforeDay], ui.Panel.Layout.Flow('horizontal')));

sarPanel.add(ui.Label('衛星軌道:', {fontWeight: 'bold', margin: '10px 0 4px 0'}));
var orbitSelect = ui.Select({items: ['ASCENDING', 'DESCENDING'], value: 'ASCENDING', style: {stretch: 'horizontal'}});
sarPanel.add(orbitSelect);

sarPanel.add(ui.Label('偏波:', {fontWeight: 'bold', margin: '10px 0 4px 0'}));
var polSelect = ui.Select({items: ['VV', 'VH'], value: 'VV', style: {stretch: 'horizontal'}});
sarPanel.add(polSelect);

sarPanel.add(ui.Label('洪水検出閾値:', {fontWeight: 'bold', margin: '10px 0 4px 0'}));
var threshSlider = ui.Slider({min: 1.0, max: 2.0, value: 1.15, step: 0.05, style: {stretch: 'horizontal'}});
sarPanel.add(threshSlider);

// --- Asset入力パラメータ ---
var assetPanel = ui.Panel();
panel.add(assetPanel);
assetPanel.style().set('shown', false);

assetPanel.add(ui.Label('浸水範囲 Asset ID:', {fontWeight: 'bold', margin: '10px 0 4px 0'}));
var floodAssetInput = ui.Textbox({value: 'users/kurihara-yt/FloodArea', style: {stretch: 'horizontal'}});
assetPanel.add(floodAssetInput);

assetPanel.add(ui.Label('浸水深 Asset ID:', {fontWeight: 'bold', margin: '10px 0 4px 0'}));
var depthAssetInput = ui.Textbox({value: 'users/kurihara-yt/FloodDepth', style: {stretch: 'horizontal'}});
assetPanel.add(depthAssetInput);

// --- 土地利用図 ---
panel.add(ui.Label('土地利用図 Asset ID:', {fontWeight: 'bold', margin: '10px 0 4px 0'}));
var luAssetInput = ui.Textbox({value: 'projects/user-id/assets/LULC', style: {stretch: 'horizontal'}});
panel.add(luAssetInput);

// 入力方式切替
inputMode.onChange(function(val) {
  sarPanel.style().set('shown', val === 'SAR画像から自動生成');
  assetPanel.style().set('shown', val === 'Assetから読み込み');
});

// --- 解析範囲の選択 ---
panel.add(ui.Label('解析範囲:', {fontWeight: 'bold', margin: '14px 0 4px 0'}));
var aoiMode = ui.Select({
  items: ['行政区域から選択', 'ジオメトリを描画'],
  value: '行政区域から選択',
  style: {stretch: 'horizontal'}
});
panel.add(aoiMode);

var adminPanel = ui.Panel();
panel.add(adminPanel);

// Region選択
adminPanel.add(ui.Label('Region:', {fontWeight: 'bold', margin: '8px 0 4px 0'}));
var regionSelect = ui.Select({
  items: Object.keys(regionProvinces),
  value: 'Region II - Cagayan Valley',
  style: {stretch: 'horizontal'}
});
adminPanel.add(regionSelect);

// Province選択（オプション）
adminPanel.add(ui.Label('Province（オプション）:', {margin: '8px 0 4px 0'}));
var provinceSelect = ui.Select({
  items: ['-- 全域 --'].concat(regionProvinces['Region II - Cagayan Valley']),
  value: '-- 全域 --',
  style: {stretch: 'horizontal'}
});
adminPanel.add(provinceSelect);

// Municipality選択（オプション）
adminPanel.add(ui.Label('Municipality（オプション）:', {margin: '8px 0 4px 0'}));
var munSelect = ui.Select({
  items: ['-- 全域 --'],
  value: '-- 全域 --',
  style: {stretch: 'horizontal'}
});
adminPanel.add(munSelect);

// Region変更時にProvince一覧を更新
regionSelect.onChange(function(regionName) {
  var provinces = regionProvinces[regionName];
  provinceSelect.items().reset(['-- 全域 --'].concat(provinces));
  provinceSelect.setValue('-- 全域 --');
  munSelect.items().reset(['-- 全域 --']);
  munSelect.setValue('-- 全域 --');
});

// Province変更時にMunicipality一覧を動的取得
provinceSelect.onChange(function(provName) {
  munSelect.items().reset(['-- 全域 --']);
  munSelect.setValue('-- 全域 --');
  if (provName !== '-- 全域 --') {
    phMuni.filter(ee.Filter.eq('PROVINCE', provName))
      .aggregate_array('NAME_2').sort()
      .evaluate(function(names) {
        if (names && names.length > 0) {
          munSelect.items().reset(['-- 全域 --'].concat(names));
        }
      });
  }
});

// 解析範囲方式の切替
var geomNote = ui.Label('地図上にジオメトリを描画してください', {fontSize: '10px', color: 'gray'});
geomNote.style().set('shown', false);
panel.add(geomNote);

aoiMode.onChange(function(val) {
  adminPanel.style().set('shown', val === '行政区域から選択');
  geomNote.style().set('shown', val === 'ジオメトリを描画');
});

// --- 結果表示・チャートエリア ---
var resultPanel = ui.Panel({style: {margin: '12px 0 0 0'}});
panel.add(resultPanel);

var messagePanel = ui.Panel({
  layout: ui.Panel.Layout.flow('vertical'),
  style: {position: 'bottom-left', border: '1px solid gray', padding: '2px'}
});
Map.add(messagePanel);

// 凡例パネル（1つだけ作成し、実行ごとに中身を再構築）
var legendPanel = ui.Panel({style: {position: 'bottom-right', padding: '15px 8px'}});
Map.add(legendPanel);

// --- 実行ボタン ---
var applyButton = ui.Button({label: '実行', style: {stretch: 'horizontal', fontWeight: 'bold'}});
panel.add(applyButton);

// ==================== 被害曲線（論文準拠） ====================
// 住宅: GMMA-RAP (2014)
var calculateBuildingDR = function(floodDepth) {
  var a = ee.Number(0.24);
  var b = ee.Number(-1.50);
  var c = ee.Number(1.45);
  return a.divide(ee.Number(1).add(b.multiply(floodDepth.subtract(c)).exp()))
    .subtract(0.02448).max(0).min(0.24);
};

// コメ: Shrestha et al. (2016)
var calculateRiceDR = function(image) {
  var a = ee.Number(0.505);
  var b = ee.Number(-7.513);
  var c = ee.Number(0.854);
  return ee.Image.constant(a).divide(image.subtract(c).multiply(b).exp().add(1))
    .subtract(0.00082).min(1);
};

// トウモロコシ: Tariq et al. (2021)
var calculateCornDR = function(image) {
  var a = ee.Number(1.44);
  var b = ee.Number(-2.11);
  return ee.Image.constant(a).divide(image.multiply(b).exp().add(1))
    .subtract(0.72).min(0.75);
};

// ==================== 凡例色 ====================
var classVis = ['#ADFF2F','#FFD700','#006400','#B8860B','#DC143C','#1E90FF'];
var bandNames = ['Rice', 'Corn', 'Forest', 'Barren', 'Urban', 'Water'];
var flood_palette = {min: 0, max: 5, palette: ['#eff3ff','#bdd7e7','#6baed6','#3182bd','#08519c']};

// ==================== 解析関数 ====================
function runAnalysis() {
  resultPanel.clear();
  messagePanel.clear();
  resultPanel.add(ui.Label('処理中...', {color: 'blue'}));

  // 解析範囲の決定
  var aoi;
  var aoiModeVal = aoiMode.getValue();

  if (aoiModeVal === '行政区域から選択') {
    var selectedRegion = regionSelect.getValue();
    var selectedProv = provinceSelect.getValue();
    var selectedMun = munSelect.getValue();

    if (selectedMun !== '-- 全域 --') {
      // Municipality単位（Philippines_MuniCities）
      aoi = phMuni.filter(ee.Filter.and(
        ee.Filter.eq('PROVINCE', selectedProv),
        ee.Filter.eq('NAME_2', selectedMun)
      )).geometry();
    } else if (selectedProv !== '-- 全域 --') {
      // Province単位（GAUL Level2）
      aoi = phProv.filter(ee.Filter.eq('ADM2_NAME', selectedProv)).geometry();
    } else {
      // Region全体
      var provList = regionProvinces[selectedRegion];
      aoi = phProv.filter(ee.Filter.inList('ADM2_NAME', provList)).geometry();
    }
  } else {
    // ジオメトリを描画
    var drawingLayers = Map.drawingTools().layers();
    if (drawingLayers.length() > 0 && drawingLayers.get(0).geometries().length() > 0) {
      aoi = drawingLayers.get(0).toGeometry();
    } else {
      resultPanel.clear();
      resultPanel.add(ui.Label('エラー: 地図上に解析範囲を描画してください', {color: 'red'}));
      return;
    }
  }

  var flooded, costDepthFilter;
  var mode = inputMode.getValue();

  if (mode === 'Assetから読み込み') {
    // --- Assetから浸水範囲・浸水深を読み込み ---
    flooded = ee.Image(floodAssetInput.getValue()).clip(aoi);
    costDepthFilter = ee.Image(depthAssetInput.getValue()).clip(aoi);
    processResults(aoi, flooded, costDepthFilter);

  } else {
    // --- SAR画像から自動生成 ---
    var afterDate = ee.Date(afterYear.getValue()+'-'+afterMonth.getValue()+'-'+afterDay.getValue());
    var beforeDate = ee.Date(beforeYear.getValue()+'-'+beforeMonth.getValue()+'-'+beforeDay.getValue());
    var pass_direction = orbitSelect.getValue();
    var polarization = polSelect.getValue();
    var difference_threshold = threshSlider.getValue();

    var after_start = afterDate.format('YYYY-MM-dd');
    var after_end = afterDate.advance(12, 'day').format('YYYY-MM-dd');
    var before_end = beforeDate.advance(1, 'day').format('YYYY-MM-dd');
    var before_start = beforeDate.advance(-11, 'day').format('YYYY-MM-dd');

    // Sentinel-2（参照用）
    var S2_Pre = ee.ImageCollection('COPERNICUS/S2')
      .filterDate(before_start, before_end).filterBounds(aoi)
      .sort('CLOUD_COVERAGE_ASSESSMENT', false);
    var S2_Post = ee.ImageCollection('COPERNICUS/S2')
      .filterDate(after_start, after_end).filterBounds(aoi)
      .sort('CLOUD_COVERAGE_ASSESSMENT', false);
    var rgbVis = {min: 0, max: 3000, bands: ['B4','B3','B2']};
    Map.addLayer(S2_Pre.mosaic().clip(aoi), rgbVis, 'Sentinel2: 洪水前', 0);
    Map.addLayer(S2_Post.mosaic().clip(aoi), rgbVis, 'Sentinel2: 洪水後', 0);

    // Sentinel-1
    var collection = ee.ImageCollection('COPERNICUS/S1_GRD')
      .filter(ee.Filter.eq('instrumentMode', 'IW'))
      .filter(ee.Filter.listContains('transmitterReceiverPolarisation', polarization))
      .filter(ee.Filter.eq('orbitProperties_pass', pass_direction))
      .filter(ee.Filter.eq('resolution_meters', 10))
      .filterBounds(aoi).select(polarization);

    var after_collection = collection.filterDate(after_start, after_end).sort('system:time_start');
    var OrbitNumber = ee.Image(after_collection.first()).get('relativeOrbitNumber_start');
    var before_collection = collection.filterDate(before_start, before_end)
      .sort('system:time_start', false)
      .filter(ee.Filter.eq('relativeOrbitNumber_start', OrbitNumber));
    var after_date_exact = ee.Date(after_collection.first().get('system:time_start'));
    after_collection = after_collection.filterDate(
      after_date_exact.advance(-1,'day').format('YYYY-MM-dd'),
      after_date_exact.advance(1,'day').format('YYYY-MM-dd'));

    print(ee.String('S1 Before: ').cat(before_collection.size()));
    print(ee.String('S1 After: ').cat(after_collection.size()));

    var before = before_collection.mosaic().clip(aoi);
    var after = after_collection.mosaic().clip(aoi);
    var before_filtered = before.focal_mean(50, 'circle', 'meters');
    var after_filtered = after.focal_mean(50, 'circle', 'meters');

    var difference = after_filtered.divide(before_filtered);
    var difference_binary = difference.gt(difference_threshold);

    var swater = ee.Image('JRC/GSW1_0/GlobalSurfaceWater').select('seasonality');
    var swater_mask = swater.updateMask(swater.gte(10));
    var flooded_mask = difference_binary.where(swater_mask, 0);
    flooded = flooded_mask.updateMask(flooded_mask);
    var connections = flooded.connectedPixelCount();
    flooded = flooded.updateMask(connections.gte(8));

    // Copernicus DEM GLO-30 を90mにリサンプリング
    var DEM = ee.ImageCollection('COPERNICUS/DEM/GLO30').select('DEM').mosaic().setDefaultProjection('EPSG:4326', null, 90);
    var terrain = ee.Algorithms.Terrain(DEM);
    var slope = terrain.select('slope');
    flooded = flooded.updateMask(slope.lt(5));

    // FwDET浸水深推定（オリジナルFwDET-GEEコード準拠、cumulativeCost法）
    var area = ee.Feature(aoi).geometry().bounds().buffer(1000).bounds();
    var fill = DEM.clip(area);
    var projection = fill.projection();

    // 浸水域をDEMスケールに合わせて変換
    // Sentinel-1のネイティブ投影を設定してからreduceResolution
    var flood_image = flooded.multiply(0)
      .setDefaultProjection('EPSG:4326', null, 10)
      .reduceResolution({reducer: ee.Reducer.mode(), maxPixels: 1024})
      .reproject(projection);

    // cumulativeCostによる水面標高の補間
    var mod = fill.updateMask(flood_image.mask().eq(0));
    var source = mod.mask();
    var costVal = 10000;
    var push = 5000;
    var cost0 = ee.Image(costVal).where(source, 0).cumulativeCost(source, push);
    var cost1 = ee.Image(costVal).where(source, 1).cumulativeCost(source, push);
    var cost2 = mod.unmask(costVal).cumulativeCost(source, push);
    var costFill = cost2.subtract(cost0).divide(cost1.subtract(cost0));
    var costSurface = mod.unmask(0).add(costFill);

    // 浸水深の計算とローパスフィルタによる平滑化
    var boxcar = ee.Kernel.square({radius: 3, units: 'pixels', normalize: true});
    var costDepth = costSurface.subtract(fill)
      .rename('FwDET')
      .convolve(boxcar)
      .updateMask(flood_image.eq(0));
    costDepthFilter = costDepth.where(costDepth.lt(0), 0);

    Map.addLayer(before_filtered, {min:-25, max:0}, 'SAR: 洪水前', 0);
    Map.addLayer(after_filtered, {min:-25, max:0}, 'SAR: 洪水後', 0);

    processResults(aoi, flooded, costDepthFilter);
  }
}

// ==================== 被害計算・結果表示 ====================
function processResults(aoi, flooded, costDepthFilter) {
  Map.layers().reset();
  messagePanel.clear();
  legendPanel.clear();
  resultPanel.clear();
  Map.centerObject(aoi, 12);
  Map.setOptions('SATELLITE');

  // DEM
  var DEM = ee.ImageCollection('COPERNICUS/DEM/GLO30').filterBounds(aoi).select('DEM').mosaic();
  Map.addLayer(DEM, {min:0, max:300}, 'DEM', 0);

  // 浸水深表示
  // AOI表示
  var aoiFC = ee.FeatureCollection([ee.Feature(aoi)]);
  var redOutline = {color: 'FF0000', width: 2, fillColor: '00000000'};
  Map.addLayer(aoiFC.style(redOutline), {}, '解析範囲 (AOI)', 1);

  // 浸水範囲 → 浸水深の順（浸水深が上に表示）
  Map.addLayer(flooded, {palette: '0000FF'}, '浸水範囲', 1);
  Map.addLayer(costDepthFilter, flood_palette, '浸水深', true);

  // --- 建物被害（フィーチャーベース、論文準拠） ---
  var Building = ee.FeatureCollection('GOOGLE/Research/open-buildings/v3/polygons').filterBounds(aoi);
  Map.addLayer(Building, {color: 'purple'}, '建物', 0, 0.65);

  var buildingFloodDepths = costDepthFilter.unmask(0).reduceRegions({
    collection: Building, reducer: ee.Reducer.mean(), scale: 30, tileScale: 8
  }).filter(ee.Filter.notNull(['mean']));

  var buildingDamageRatios = buildingFloodDepths.map(function(building) {
    var floodDepth = building.getNumber('mean');
    var damageRatio = calculateBuildingDR(floodDepth);
    return building.set('damageRatio', damageRatio);
  });

  var buildingDamageValue = buildingDamageRatios.map(function(building) {
    var building_area = building.geometry().area();
    var damageRatio = building.getNumber('damageRatio');
    var damageValue = building_area.multiply(damageRatio).multiply(10.3).round();
    return building.set('damageValue', damageValue);
  });

  var totalBuildingDamageCost = ee.Number(buildingDamageValue.aggregate_sum('damageValue')).round();

  // --- 土地利用図の読み込み ---
  var LU = ee.Image(luAssetInput.getValue()).clip(aoi);
  Map.addLayer(LU, {min:1, max:6, palette: classVis}, '土地利用図', 0);

  // --- 土地利用別浸水面積 ---
  var area = ee.Image.pixelArea().divide(10000);
  var rice = flooded.updateMask(LU.eq(1)).multiply(area).select([0],['Rice']);
  var corn = flooded.updateMask(LU.eq(2)).multiply(area).select([0],['Corn']);
  var forest = flooded.updateMask(LU.eq(3)).multiply(area).select([0],['Forest']);
  var barren = flooded.updateMask(LU.eq(4)).multiply(area).select([0],['Barren']);
  var urban_area = flooded.updateMask(LU.eq(5)).multiply(area).select([0],['Urban']);
  var water_area = flooded.updateMask(LU.eq(6)).multiply(area).select([0],['Water']);

  var landTypes = [rice, corn, forest, barren, urban_area, water_area];
  var landTypeAreas = landTypes.map(function(landType, i) {
    var a = landType.reduceRegion({reducer: ee.Reducer.sum(), geometry: aoi, scale: 30, bestEffort: true}).get(bandNames[i]);
    return ee.List([]).add(a);
  });

  var chart2 = ui.Chart.array.values({array: ee.List(landTypeAreas), axis: 1, xLabels: ['']})
    .setSeriesNames(bandNames)
    .setChartType('BarChart')
    .setOptions({
      title: '土地利用別浸水面積',
      titleTextStyle: {fontSize: 14},
      hAxis: {title: '面積 (ha)', titleTextStyle: {fontSize: 14, italic: false, bold: true}},
      vAxis: {title: '土地利用', titleTextStyle: {fontSize: 14, italic: false, bold: true}},
      colors: classVis
    });
  messagePanel.widgets().set(0, chart2);

  // --- 農作物被害（画像ベース、論文準拠） ---
  var riceArea = costDepthFilter.updateMask(LU.eq(1));
  var cornArea = costDepthFilter.updateMask(LU.eq(2));

  var Rice_damage = calculateRiceDR(riceArea);
  var Corn_damage = calculateCornDR(cornArea);

  var floodedRiceDepth = Rice_damage.multiply(area);
  var floodedCornDepth = Corn_damage.multiply(area);

  var rice_price = 69.6;  // '000 PhP/ha
  var corn_price = 45.9;

  var riceDamageCost = floodedRiceDepth.multiply(rice_price);
  var cornDamageCost = floodedCornDepth.multiply(corn_price);

  var totalRiceDamageCost = ee.Number(riceDamageCost.reduceRegion({
    reducer: ee.Reducer.sum(), geometry: aoi, scale: 30, bestEffort: true
  }).get('constant')).round();

  var totalCornDamageCost = ee.Number(cornDamageCost.reduceRegion({
    reducer: ee.Reducer.sum(), geometry: aoi, scale: 30, bestEffort: true
  }).get('constant')).round();

  // --- 被害額パイチャート ---
  var damageCosts = {
    'Resident': totalBuildingDamageCost,
    'Rice': totalRiceDamageCost,
    'Corn': totalCornDamageCost,
  };

  var damageCostsList = Object.keys(damageCosts).map(function(key) {
    return ee.Feature(null, {'category': key, 'amount': damageCosts[key]});
  });
  var dataTable = ee.FeatureCollection(damageCostsList);

  var chart3 = ui.Chart.feature.byFeature(dataTable, 'category', 'amount')
    .setChartType('PieChart')
    .setOptions({
      title: '被害額内訳',
      titleTextStyle: {fontSize: 14, italic: false, bold: true},
      colors: ['#DC143C','#ADFF2F','#FFD700']
    });
  messagePanel.widgets().set(1, chart3);

  // --- 結果表示 ---
  resultPanel.clear();
  resultPanel.add(ui.Label('解析結果', {fontWeight: 'bold', margin: '0 0 6px 0'}));

  // 浸水面積
  var flood_pixelarea = flooded.multiply(ee.Image.pixelArea());
  flood_pixelarea.reduceRegion({
    reducer: ee.Reducer.sum(), geometry: aoi, scale: 30, bestEffort: true
  }).values().get(0).evaluate(function(val) {
    if (val !== null && val !== undefined) {
      resultPanel.add(ui.Label('浸水面積: ' + (val / 10000).toFixed(0) + ' ha'));
    }
  });

  // 被害額をUIに表示
  totalBuildingDamageCost.evaluate(function(val) {
    if (val !== null && val !== undefined) {
      resultPanel.add(ui.Label('住宅被害: ' + Math.round(val).toLocaleString() + ' 千PhP'));
    } else {
      resultPanel.add(ui.Label('住宅被害: 計算中...'));
    }
  });
  totalRiceDamageCost.evaluate(function(val) {
    if (val !== null && val !== undefined) {
      resultPanel.add(ui.Label('コメ被害: ' + Math.round(val).toLocaleString() + ' 千PhP'));
    }
  });
  totalCornDamageCost.evaluate(function(val) {
    if (val !== null && val !== undefined) {
      resultPanel.add(ui.Label('トウモロコシ被害: ' + Math.round(val).toLocaleString() + ' 千PhP'));
    }
  });

  // 合計被害額
  var Total_value = totalBuildingDamageCost.add(totalRiceDamageCost).add(totalCornDamageCost);
  Total_value.evaluate(function(val) {
    if (val !== null && val !== undefined) {
      messagePanel.widgets().set(2, ui.Label({
        value: '合計被害額: ' + Math.round(val).toLocaleString() + ' 千ペソ',
        style: {fontSize: 14, fontWeight: 'bold'}
      }));
    }
  });

  // --- エクスポート ---
  Export.image.toDrive({
    image: flooded, description: 'Flood_extent',
    region: aoi, maxPixels: 1e10
  });
  Export.image.toDrive({
    image: costDepthFilter, description: 'Flood_depth',
    region: aoi, scale: 10, maxPixels: 1e10, fileFormat: 'GeoTIFF'
  });

  // 浸水範囲ベクタ
  var flooded_vec = flooded.reduceToVectors({
    scale: 10, geometryType: 'polygon', geometry: aoi,
    eightConnected: false, bestEffort: true, tileScale: 16
  });
  Export.table.toDrive({
    collection: flooded_vec, description: 'Flood_extent_vector',
    fileFormat: 'KML', fileNamePrefix: 'Flood'
  });

  // AOIエクスポート
  Export.table.toDrive({
    collection: aoiFC, description: 'AOI',
    fileFormat: 'SHP', fileNamePrefix: 'AOI'
  });

  // --- 凡例（既存パネルを再利用） ---
  legendPanel.add(ui.Label('浸水深 (m)', {fontSize: '14px', margin: '0 0 4px 0', padding: '0'}));
  var lon = ee.Image.pixelLonLat().select('latitude');
  var gradient = lon.multiply((flood_palette.max - flood_palette.min) / 100.0).add(flood_palette.min);
  var legendImage = gradient.visualize(flood_palette);
  legendPanel.add(ui.Panel({widgets: [ui.Label(flood_palette.max)]}));
  legendPanel.add(ui.Thumbnail({
    image: legendImage, params: {bbox: '0,0,10,100', dimensions: '10x50'},
    style: {padding: '1px', position: 'bottom-center'}
  }));
  legendPanel.add(ui.Panel({widgets: [ui.Label(flood_palette.min)]}));
}

applyButton.onClick(runAnalysis);

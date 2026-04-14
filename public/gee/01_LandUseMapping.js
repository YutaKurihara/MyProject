// ============================================================
// 01_LULC_RandomForest.js
// 土地利用図作成ツール（Random Forest）
// フィリピン・カガヤンバレー地域
// Oriental Consultants Global - MyProject 第10期
// ============================================================

// ==================== 教師データ ====================
// Rice (LU=1), Corn (LU=2), Forest (LU=3),
// Barren (LU=4), Urban (LU=5), Water (LU=6)
// フィリピン全国から収集した教師データ (各60ポイント, 計360ポイント)

var Rice = ee.FeatureCollection([
  ee.Feature(ee.Geometry.Point([121.15989924161646, 14.253286214158777]), {LU:1}),
  ee.Feature(ee.Geometry.Point([124.14480917508527, 9.787841687296584]), {LU:1}),
  ee.Feature(ee.Geometry.Point([124.1451390867941, 9.788111290197449]), {LU:1}),
  ee.Feature(ee.Geometry.Point([120.93478345503246, 15.110130050359956]), {LU:1}),
  ee.Feature(ee.Geometry.Point([121.15957941746578, 14.253149025958072]), {LU:1}),
  ee.Feature(ee.Geometry.Point([121.15338864101658, 14.22265710104709]), {LU:1}),
  ee.Feature(ee.Geometry.Point([121.15308421029339, 14.222690900975222]), {LU:1}),
  ee.Feature(ee.Geometry.Point([121.15308823360691, 14.222963900209596]), {LU:1}),
  ee.Feature(ee.Geometry.Point([121.15336852444896, 14.222973000178396]), {LU:1}),
  ee.Feature(ee.Geometry.Point([120.75545586087134, 14.290784588171604]), {LU:1}),
  ee.Feature(ee.Geometry.Point([120.75565032102492, 14.290575351729398]), {LU:1}),
  ee.Feature(ee.Geometry.Point([120.75522921420958, 14.2905467603992]), {LU:1}),
  ee.Feature(ee.Geometry.Point([120.75504682399657, 14.290723506745868]), {LU:1}),
  ee.Feature(ee.Geometry.Point([120.65490933017198, 14.004535131972396]), {LU:1}),
  ee.Feature(ee.Geometry.Point([120.65435947732392, 14.004592386625909]), {LU:1}),
  ee.Feature(ee.Geometry.Point([122.39665152759083, 14.1927367169764]), {LU:1}),
  ee.Feature(ee.Geometry.Point([122.39563228816517, 14.192996750671675]), {LU:1}),
  ee.Feature(ee.Geometry.Point([122.3959970685912, 14.19357922506601]), {LU:1}),
  ee.Feature(ee.Geometry.Point([123.19180474694174, 13.711728855604983]), {LU:1}),
  ee.Feature(ee.Geometry.Point([123.1908069651882, 13.711708009462365]), {LU:1}),
  ee.Feature(ee.Geometry.Point([123.19191203530234, 13.71023835174286]), {LU:1}),
  ee.Feature(ee.Geometry.Point([123.19220171387595, 13.710644853734335]), {LU:1}),
  ee.Feature(ee.Geometry.Point([123.40282941145959, 13.284101110830226]), {LU:1}),
  ee.Feature(ee.Geometry.Point([123.40328538699212, 13.284664965272807]), {LU:1}),
  ee.Feature(ee.Geometry.Point([123.40215349478784, 13.284785045216346]), {LU:1}),
  ee.Feature(ee.Geometry.Point([123.40262556357446, 13.28526014354081]), {LU:1}),
  ee.Feature(ee.Geometry.Point([124.53379537077384, 11.004333709627815]), {LU:1}),
  ee.Feature(ee.Geometry.Point([124.53385437937217, 11.004133609877108]), {LU:1}),
  ee.Feature(ee.Geometry.Point([124.53363980265098, 11.004681250977125]), {LU:1}),
  ee.Feature(ee.Geometry.Point([122.84690843478901, 10.462230857235845]), {LU:1}),
  ee.Feature(ee.Geometry.Point([120.78265483677615, 14.948173454368458]), {LU:1}),
  ee.Feature(ee.Geometry.Point([120.78254754841555, 14.948365220978907]), {LU:1}),
  ee.Feature(ee.Geometry.Point([120.80423003849181, 15.424505850183204]), {LU:1}),
  ee.Feature(ee.Geometry.Point([120.80417639431151, 15.424816122011604]), {LU:1}),
  ee.Feature(ee.Geometry.Point([122.67662250192923, 11.29588681740482]), {LU:1}),
  ee.Feature(ee.Geometry.Point([122.67665468843741, 11.296118279417064]), {LU:1}),
  ee.Feature(ee.Geometry.Point([123.78096317812692, 7.9989833399932015]), {LU:1}),
  ee.Feature(ee.Geometry.Point([123.73553499116738, 7.962561881263041]), {LU:1}),
  ee.Feature(ee.Geometry.Point([123.8076152724745, 12.193318174972282]), {LU:1}),
  ee.Feature(ee.Geometry.Point([120.76445910961158, 14.29803826573587]), {LU:1}),
  ee.Feature(ee.Geometry.Point([122.92198999638332, 7.75542474307281]), {LU:1}),
  ee.Feature(ee.Geometry.Point([123.03351354371392, 7.724310438124942]), {LU:1}),
  ee.Feature(ee.Geometry.Point([121.44801381849045, 14.225605984784172]), {LU:1}),
  ee.Feature(ee.Geometry.Point([121.38500059693791, 14.237025814982008]), {LU:1}),
  ee.Feature(ee.Geometry.Point([121.38527418225743, 14.237005016346469]), {LU:1}),
  ee.Feature(ee.Geometry.Point([121.4575279616743, 14.288113994588796]), {LU:1}),
  ee.Feature(ee.Geometry.Point([121.4575467371374, 14.287786490096492]), {LU:1}),
  ee.Feature(ee.Geometry.Point([121.43865274494222, 14.407394965121261]), {LU:1}),
  ee.Feature(ee.Geometry.Point([121.43866347377828, 14.407766458273139]), {LU:1}),
  ee.Feature(ee.Geometry.Point([121.43967466657689, 14.407584608555828]), {LU:1}),
  ee.Feature(ee.Geometry.Point([121.43954860275319, 14.407259876548984]), {LU:1}),
  ee.Feature(ee.Geometry.Point([120.80671805148589, 15.417783861526726]), {LU:1}),
  ee.Feature(ee.Geometry.Point([122.84692184583409, 10.462629137119258]), {LU:1}),
  ee.Feature(ee.Geometry.Point([122.84672336236699, 10.462684526996322]), {LU:1}),
  ee.Feature(ee.Geometry.Point([122.84668312923176, 10.462473517887918]), {LU:1}),
  ee.Feature(ee.Geometry.Point([120.82679235640475, 12.99858061518191]), {LU:1}),
  ee.Feature(ee.Geometry.Point([120.82636320296237, 12.998583228661005]), {LU:1}),
  ee.Feature(ee.Geometry.Point([120.82635247412631, 12.998251316594601]), {LU:1}),
  ee.Feature(ee.Geometry.Point([120.82685941163012, 12.998214727835707]), {LU:1}),
  ee.Feature(ee.Geometry.Point([122.67759882601065, 11.295976246011962]), {LU:1})
]);

var Corn = ee.FeatureCollection([
  ee.Feature(ee.Geometry.Point([124.72225593106599, 7.61745142379841]), {LU:2}),
  ee.Feature(ee.Geometry.Point([124.72317861096711, 7.617836911792487]), {LU:2}),
  ee.Feature(ee.Geometry.Point([124.72428699891418, 7.619427999198284]), {LU:2}),
  ee.Feature(ee.Geometry.Point([124.73443476785984, 7.662309195951598]), {LU:2}),
  ee.Feature(ee.Geometry.Point([124.73509995569553, 7.661128041676832]), {LU:2}),
  ee.Feature(ee.Geometry.Point([124.733742757934, 7.661563997287403]), {LU:2}),
  ee.Feature(ee.Geometry.Point([125.11445492111683, 8.131398023155592]), {LU:2}),
  ee.Feature(ee.Geometry.Point([125.11491089664936, 8.13142988606885]), {LU:2}),
  ee.Feature(ee.Geometry.Point([121.07602076137636, 14.121579296067488]), {LU:2}),
  ee.Feature(ee.Geometry.Point([121.03973633788608, 14.229113739083363]), {LU:2}),
  ee.Feature(ee.Geometry.Point([121.03987983606838, 14.228888845857817]), {LU:2}),
  ee.Feature(ee.Geometry.Point([121.03858014382683, 14.228363723613093]), {LU:2}),
  ee.Feature(ee.Geometry.Point([121.0311605936695, 14.225519830617017]), {LU:2}),
  ee.Feature(ee.Geometry.Point([121.0455107792767, 14.234936033928625]), {LU:2}),
  ee.Feature(ee.Geometry.Point([121.04483486260494, 14.234618851593563]), {LU:2}),
  ee.Feature(ee.Geometry.Point([121.60472365987803, 17.515936690216897]), {LU:2}),
  ee.Feature(ee.Geometry.Point([121.60441788805034, 17.516440584738756]), {LU:2}),
  ee.Feature(ee.Geometry.Point([121.51597093330022, 17.58276915769677]), {LU:2}),
  ee.Feature(ee.Geometry.Point([121.51617478118536, 17.582403520571546]), {LU:2}),
  ee.Feature(ee.Geometry.Point([120.47503209341285, 17.378686144074084]), {LU:2}),
  ee.Feature(ee.Geometry.Point([120.47504282224891, 17.37854023711399]), {LU:2}),
  ee.Feature(ee.Geometry.Point([120.47512060631034, 17.378911403713918]), {LU:2}),
  ee.Feature(ee.Geometry.Point([120.47550147999046, 17.37670231141335]), {LU:2}),
  ee.Feature(ee.Geometry.Point([120.47550147999046, 17.376610158664075]), {LU:2}),
  ee.Feature(ee.Geometry.Point([120.94003429531004, 14.23805045362519]), {LU:2}),
  ee.Feature(ee.Geometry.Point([120.9396654915705, 14.238210342346358]), {LU:2}),
  ee.Feature(ee.Geometry.Point([121.06342444715943, 14.130947189765942]), {LU:2}),
  ee.Feature(ee.Geometry.Point([121.05601373702633, 14.132227897153195]), {LU:2}),
  ee.Feature(ee.Geometry.Point([121.05608347446072, 14.13210304760646]), {LU:2}),
  ee.Feature(ee.Geometry.Point([121.48003400595412, 17.75275600870207]), {LU:2}),
  ee.Feature(ee.Geometry.Point([121.4557878804125, 17.755328974789922]), {LU:2}),
  ee.Feature(ee.Geometry.Point([121.94202140855899, 17.89942894612817]), {LU:2}),
  ee.Feature(ee.Geometry.Point([125.19502105077771, 7.368095075973475]), {LU:2}),
  ee.Feature(ee.Geometry.Point([120.95849192724263, 14.25786585226358]), {LU:2}),
  ee.Feature(ee.Geometry.Point([120.95807618484532, 14.258224595290367]), {LU:2}),
  ee.Feature(ee.Geometry.Point([124.54046511193535, 6.587847294371387]), {LU:2}),
  ee.Feature(ee.Geometry.Point([124.99757891411882, 7.988274010078471]), {LU:2}),
  ee.Feature(ee.Geometry.Point([124.9606034996473, 7.994110458265544]), {LU:2}),
  ee.Feature(ee.Geometry.Point([120.67923797240616, 15.925625037412805]), {LU:2}),
  ee.Feature(ee.Geometry.Point([120.66590816795693, 15.925911773934946]), {LU:2}),
  ee.Feature(ee.Geometry.Point([121.20280799367725, 16.59456463838141]), {LU:2}),
  ee.Feature(ee.Geometry.Point([120.42610098634194, 15.936018202633985]), {LU:2}),
  ee.Feature(ee.Geometry.Point([121.03974170230411, 14.228830347583276]), {LU:2}),
  ee.Feature(ee.Geometry.Point([121.03939435623668, 14.229008442283076]), {LU:2}),
  ee.Feature(ee.Geometry.Point([121.0450905039004, 14.234677904667418]), {LU:2}),
  ee.Feature(ee.Geometry.Point([121.04565645000254, 14.234906691910451]), {LU:2}),
  ee.Feature(ee.Geometry.Point([120.6847921027933, 15.192142802096548]), {LU:2}),
  ee.Feature(ee.Geometry.Point([120.68494498870714, 15.192127271261848]), {LU:2}),
  ee.Feature(ee.Geometry.Point([120.68447023771151, 15.192191983065582]), {LU:2}),
  ee.Feature(ee.Geometry.Point([121.76451706993217, 16.708594000361785]), {LU:2}),
  ee.Feature(ee.Geometry.Point([121.76456803190345, 16.70840389689469]), {LU:2}),
  ee.Feature(ee.Geometry.Point([121.76028959360949, 16.71291647904589]), {LU:2}),
  ee.Feature(ee.Geometry.Point([121.76028422919146, 16.71314511157038]), {LU:2}),
  ee.Feature(ee.Geometry.Point([121.76035394088831, 16.71375388942499]), {LU:2}),
  ee.Feature(ee.Geometry.Point([121.48261860491063, 16.97747065426644]), {LU:2}),
  ee.Feature(ee.Geometry.Point([121.48271248222615, 16.97756044035381]), {LU:2}),
  ee.Feature(ee.Geometry.Point([121.76029245793035, 16.71362092138918]), {LU:2}),
  ee.Feature(ee.Geometry.Point([120.42172308137698, 15.939821693819919]), {LU:2}),
  ee.Feature(ee.Geometry.Point([120.4187002318172, 15.9411757061852]), {LU:2}),
  ee.Feature(ee.Geometry.Point([120.40128224202311, 15.95561229597662]), {LU:2})
]);

var Forest = ee.FeatureCollection([
  ee.Feature(ee.Geometry.Point([121.19023540901566, 14.140167338357086]), {LU:3}),
  ee.Feature(ee.Geometry.Point([121.1905056721211, 14.154971204670217]), {LU:3}),
  ee.Feature(ee.Geometry.Point([121.03768194968117, 14.167144625786944]), {LU:3}),
  ee.Feature(ee.Geometry.Point([120.79712611477521, 14.046886361454447]), {LU:3}),
  ee.Feature(ee.Geometry.Point([121.48932674903328, 14.070972376265322]), {LU:3}),
  ee.Feature(ee.Geometry.Point([121.30277335338903, 14.936672753521554]), {LU:3}),
  ee.Feature(ee.Geometry.Point([121.29831015758825, 14.933811629415798]), {LU:3}),
  ee.Feature(ee.Geometry.Point([120.40449629142573, 15.18245017576594]), {LU:3}),
  ee.Feature(ee.Geometry.Point([120.40461430862239, 15.181135167328506]), {LU:3}),
  ee.Feature(ee.Geometry.Point([120.24066438079369, 15.363551071804311]), {LU:3}),
  ee.Feature(ee.Geometry.Point([120.25104989409935, 15.36139921086366]), {LU:3}),
  ee.Feature(ee.Geometry.Point([120.74659594148838, 16.168978875227584]), {LU:3}),
  ee.Feature(ee.Geometry.Point([120.99486421322895, 16.175138565422483]), {LU:3}),
  ee.Feature(ee.Geometry.Point([121.03051899845545, 14.156978556910794]), {LU:3}),
  ee.Feature(ee.Geometry.Point([123.21284837998657, 10.657323135125164]), {LU:3}),
  ee.Feature(ee.Geometry.Point([123.22035856522827, 10.657871410797048]), {LU:3}),
  ee.Feature(ee.Geometry.Point([123.13815024219798, 10.457513499741957]), {LU:3}),
  ee.Feature(ee.Geometry.Point([123.12626269184398, 10.461860327885963]), {LU:3}),
  ee.Feature(ee.Geometry.Point([124.49034002061224, 7.767315252317417]), {LU:3}),
  ee.Feature(ee.Geometry.Point([124.49857976670599, 7.7813471458713135]), {LU:3}),
  ee.Feature(ee.Geometry.Point([121.18443334813507, 17.15774982813146]), {LU:3}),
  ee.Feature(ee.Geometry.Point([121.15782583470734, 17.13724597265984]), {LU:3}),
  ee.Feature(ee.Geometry.Point([122.27187183704898, 17.04153167854901]), {LU:3}),
  ee.Feature(ee.Geometry.Point([122.24406269398257, 17.040711055908208]), {LU:3}),
  ee.Feature(ee.Geometry.Point([121.87971965801287, 16.244079682730085]), {LU:3}),
  ee.Feature(ee.Geometry.Point([121.91370861064959, 16.244079682730085]), {LU:3}),
  ee.Feature(ee.Geometry.Point([121.96040050518084, 16.24984789361013]), {LU:3}),
  ee.Feature(ee.Geometry.Point([121.4484162583184, 14.797412663666083]), {LU:3}),
  ee.Feature(ee.Geometry.Point([121.4703889145684, 14.799321289730754]), {LU:3}),
  ee.Feature(ee.Geometry.Point([124.54510429136339, 7.9596596118041845]), {LU:3}),
  ee.Feature(ee.Geometry.Point([126.31519963316049, 7.326375228504566]), {LU:3}),
  ee.Feature(ee.Geometry.Point([125.20108773478894, 11.52001618251708]), {LU:3}),
  ee.Feature(ee.Geometry.Point([124.76870405898566, 10.998831763868486]), {LU:3}),
  ee.Feature(ee.Geometry.Point([125.15768820945637, 8.39744023103187]), {LU:3}),
  ee.Feature(ee.Geometry.Point([123.67218019073326, 12.244096382039935]), {LU:3}),
  ee.Feature(ee.Geometry.Point([122.58938402912676, 12.41442782549937]), {LU:3}),
  ee.Feature(ee.Geometry.Point([121.16427535173085, 13.022442441356176]), {LU:3}),
  ee.Feature(ee.Geometry.Point([121.4692425228735, 15.628636427082208]), {LU:3}),
  ee.Feature(ee.Geometry.Point([120.92938535495912, 15.97457276852782]), {LU:3}),
  ee.Feature(ee.Geometry.Point([120.90975799205609, 16.620663589097248]), {LU:3}),
  ee.Feature(ee.Geometry.Point([120.95779800410784, 16.815873565769714]), {LU:3}),
  ee.Feature(ee.Geometry.Point([120.9827333681682, 16.9230876026052]), {LU:3}),
  ee.Feature(ee.Geometry.Point([121.02674121042833, 14.23125122639382]), {LU:3}),
  ee.Feature(ee.Geometry.Point([124.82807898037366, 7.952227249253497]), {LU:3}),
  ee.Feature(ee.Geometry.Point([121.12573940070209, 17.60075671114503]), {LU:3}),
  ee.Feature(ee.Geometry.Point([122.07938720467085, 17.381715498976014]), {LU:3}),
  ee.Feature(ee.Geometry.Point([122.0258068528652, 17.650463268329233]), {LU:3}),
  ee.Feature(ee.Geometry.Point([122.0779420264269, 18.144131928003215]), {LU:3}),
  ee.Feature(ee.Geometry.Point([122.22419506401445, 11.210533123245563]), {LU:3}),
  ee.Feature(ee.Geometry.Point([121.42652111891238, 14.818861847322179]), {LU:3}),
  ee.Feature(ee.Geometry.Point([122.78272368708107, 13.95009828457087]), {LU:3}),
  ee.Feature(ee.Geometry.Point([122.79122092524025, 13.947849195117351]), {LU:3}),
  ee.Feature(ee.Geometry.Point([123.36800904054668, 13.655849982876191]), {LU:3}),
  ee.Feature(ee.Geometry.Point([123.37513298769024, 13.644506715956263]), {LU:3}),
  ee.Feature(ee.Geometry.Point([124.33359872545223, 13.815631613283493]), {LU:3}),
  ee.Feature(ee.Geometry.Point([124.33853399003964, 13.817298558022234]), {LU:3}),
  ee.Feature(ee.Geometry.Point([125.16511884086235, 11.928640702080157]), {LU:3}),
  ee.Feature(ee.Geometry.Point([125.10516733390129, 12.180711409076894]), {LU:3}),
  ee.Feature(ee.Geometry.Point([126.2836341210482, 7.303935663128188]), {LU:3}),
  ee.Feature(ee.Geometry.Point([125.24737819112359, 7.7650664611692015]), {LU:3})
]);

var Barren = ee.FeatureCollection([
  ee.Feature(ee.Geometry.Point([124.570997551634, 7.022057787166241]), {LU:4}),
  ee.Feature(ee.Geometry.Point([121.10419288655218, 14.252575635498001]), {LU:4}),
  ee.Feature(ee.Geometry.Point([121.15622583906679, 14.253994648915413]), {LU:4}),
  ee.Feature(ee.Geometry.Point([121.07195224277402, 14.253544305419236]), {LU:4}),
  ee.Feature(ee.Geometry.Point([121.07136886231328, 14.253735378807487]), {LU:4}),
  ee.Feature(ee.Geometry.Point([121.07233177534962, 14.253773073538431]), {LU:4}),
  ee.Feature(ee.Geometry.Point([121.02511400994929, 14.222170169711458]), {LU:4}),
  ee.Feature(ee.Geometry.Point([121.16684983577365, 14.219567166443554]), {LU:4}),
  ee.Feature(ee.Geometry.Point([121.15621215734843, 14.254482734255582]), {LU:4}),
  ee.Feature(ee.Geometry.Point([121.0730191942017, 14.254150092437227]), {LU:4}),
  ee.Feature(ee.Geometry.Point([121.07466607053685, 14.254805198763405]), {LU:4}),
  ee.Feature(ee.Geometry.Point([124.02155055014904, 11.220365397612559]), {LU:4}),
  ee.Feature(ee.Geometry.Point([124.02090051931576, 11.22274993904837]), {LU:4}),
  ee.Feature(ee.Geometry.Point([124.02023264927105, 11.223160362228898]), {LU:4}),
  ee.Feature(ee.Geometry.Point([120.91427184601342, 14.263614993989957]), {LU:4}),
  ee.Feature(ee.Geometry.Point([120.91476805468118, 14.263856749491945]), {LU:4}),
  ee.Feature(ee.Geometry.Point([120.84777819575447, 14.181273767531549]), {LU:4}),
  ee.Feature(ee.Geometry.Point([120.80988713796205, 14.196352888079106]), {LU:4}),
  ee.Feature(ee.Geometry.Point([120.78558441006155, 14.21592318184986]), {LU:4}),
  ee.Feature(ee.Geometry.Point([120.78323998019434, 14.233481295218986]), {LU:4}),
  ee.Feature(ee.Geometry.Point([120.75465712660733, 14.294103004885233]), {LU:4}),
  ee.Feature(ee.Geometry.Point([120.8216735632459, 14.134938156424765]), {LU:4}),
  ee.Feature(ee.Geometry.Point([120.99203583084837, 14.134995761105493]), {LU:4}),
  ee.Feature(ee.Geometry.Point([120.9929236420323, 14.134887819585263]), {LU:4}),
  ee.Feature(ee.Geometry.Point([120.6337175755728, 15.456837672817455]), {LU:4}),
  ee.Feature(ee.Geometry.Point([121.42999702579391, 17.72053562589405]), {LU:4}),
  ee.Feature(ee.Geometry.Point([123.0276909484757, 10.624560433186513]), {LU:4}),
  ee.Feature(ee.Geometry.Point([123.35606026415604, 10.632119647307235]), {LU:4}),
  ee.Feature(ee.Geometry.Point([123.356231925533, 10.631840214108491]), {LU:4}),
  ee.Feature(ee.Geometry.Point([122.65652946631725, 9.531904216050552]), {LU:4}),
  ee.Feature(ee.Geometry.Point([123.57680726665662, 10.131427415349195]), {LU:4}),
  ee.Feature(ee.Geometry.Point([125.1289878508599, 7.289509542080252]), {LU:4}),
  ee.Feature(ee.Geometry.Point([125.27730727735353, 7.426586591544897]), {LU:4}),
  ee.Feature(ee.Geometry.Point([121.1248453280254, 13.953756936520167]), {LU:4}),
  ee.Feature(ee.Geometry.Point([121.12842013633013, 13.95469627299976]), {LU:4}),
  ee.Feature(ee.Geometry.Point([121.1952791601311, 13.964923360771625]), {LU:4}),
  ee.Feature(ee.Geometry.Point([121.1232495827789, 14.130005163588057]), {LU:4}),
  ee.Feature(ee.Geometry.Point([120.8958983601344, 14.256306221225278]), {LU:4}),
  ee.Feature(ee.Geometry.Point([120.97480851401258, 14.297423751525699]), {LU:4}),
  ee.Feature(ee.Geometry.Point([120.9834841395129, 14.301366755397572]), {LU:4}),
  ee.Feature(ee.Geometry.Point([121.01882242145957, 14.507255367821124]), {LU:4}),
  ee.Feature(ee.Geometry.Point([123.72928563860735, 13.153649328993165]), {LU:4}),
  ee.Feature(ee.Geometry.Point([121.02520118174228, 14.222302769686193]), {LU:4}),
  ee.Feature(ee.Geometry.Point([121.0251166921583, 14.222275469697758]), {LU:4}),
  ee.Feature(ee.Geometry.Point([120.68464462785332, 14.048364713424112]), {LU:4}),
  ee.Feature(ee.Geometry.Point([120.68517302302925, 14.04826323589779]), {LU:4}),
  ee.Feature(ee.Geometry.Point([120.68500940827934, 14.048539046505361]), {LU:4}),
  ee.Feature(ee.Geometry.Point([121.04476016894512, 14.234081859412473]), {LU:4}),
  ee.Feature(ee.Geometry.Point([121.04484868184261, 14.233892069318257]), {LU:4}),
  ee.Feature(ee.Geometry.Point([121.02338672912991, 14.220095783755427]), {LU:4}),
  ee.Feature(ee.Geometry.Point([121.02354229725277, 14.219938482241224]), {LU:4}),
  ee.Feature(ee.Geometry.Point([121.33021733930137, 14.17824334054154]), {LU:4}),
  ee.Feature(ee.Geometry.Point([121.3300429957154, 14.178235539027256]), {LU:4}),
  ee.Feature(ee.Geometry.Point([123.79728712365636, 10.664188082540285]), {LU:4}),
  ee.Feature(ee.Geometry.Point([123.79760898873815, 10.664836509227731]), {LU:4}),
  ee.Feature(ee.Geometry.Point([123.79793621823796, 10.664673084745704]), {LU:4}),
  ee.Feature(ee.Geometry.Point([121.3929418348514, 13.674162633034243]), {LU:4}),
  ee.Feature(ee.Geometry.Point([121.39311081401934, 13.673836859808054]), {LU:4}),
  ee.Feature(ee.Geometry.Point([123.40256689606892, 10.489549875170542]), {LU:4}),
  ee.Feature(ee.Geometry.Point([123.40199039948484, 10.488135034334256]), {LU:4})
]);

var Urban = ee.FeatureCollection([
  ee.Feature(ee.Geometry.Point([121.14927704747666, 14.240923645264155]), {LU:5}),
  ee.Feature(ee.Geometry.Point([121.03436045091883, 14.57944993713781]), {LU:5}),
  ee.Feature(ee.Geometry.Point([120.99039628965072, 14.596237456187698]), {LU:5}),
  ee.Feature(ee.Geometry.Point([120.59455237738933, 18.194818633848573]), {LU:5}),
  ee.Feature(ee.Geometry.Point([125.62599782778517, 7.086412542994908]), {LU:5}),
  ee.Feature(ee.Geometry.Point([123.92202208571014, 10.341525240029025]), {LU:5}),
  ee.Feature(ee.Geometry.Point([123.93943919019013, 10.340093457508036]), {LU:5}),
  ee.Feature(ee.Geometry.Point([124.65151580023598, 8.477306864109524]), {LU:5}),
  ee.Feature(ee.Geometry.Point([124.65619577350718, 8.481733887846637]), {LU:5}),
  ee.Feature(ee.Geometry.Point([122.95155125594245, 10.660382553073148]), {LU:5}),
  ee.Feature(ee.Geometry.Point([122.75376653735997, 11.584323490428211]), {LU:5}),
  ee.Feature(ee.Geometry.Point([122.75521493022801, 11.580255977782668]), {LU:5}),
  ee.Feature(ee.Geometry.Point([121.48865634501435, 13.035678034487008]), {LU:5}),
  ee.Feature(ee.Geometry.Point([124.59493347079348, 12.068710267475769]), {LU:5}),
  ee.Feature(ee.Geometry.Point([123.41669961656964, 10.48024330659727]), {LU:5}),
  ee.Feature(ee.Geometry.Point([124.24592252121705, 8.230453701044155]), {LU:5}),
  ee.Feature(ee.Geometry.Point([124.2440396104886, 8.233978971601138]), {LU:5}),
  ee.Feature(ee.Geometry.Point([123.62035648361305, 12.36578814377385]), {LU:5}),
  ee.Feature(ee.Geometry.Point([123.62406866088966, 12.365987262378386]), {LU:5}),
  ee.Feature(ee.Geometry.Point([121.39435091759732, 13.67304456175915]), {LU:5}),
  ee.Feature(ee.Geometry.Point([121.0579551803434, 13.755902103139308]), {LU:5}),
  ee.Feature(ee.Geometry.Point([121.05886713140846, 13.756939000996944]), {LU:5}),
  ee.Feature(ee.Geometry.Point([120.72899410459307, 13.968172483882663]), {LU:5}),
  ee.Feature(ee.Geometry.Point([120.5420585103351, 14.67816854062058]), {LU:5}),
  ee.Feature(ee.Geometry.Point([120.55866147918913, 14.692991676385319]), {LU:5}),
  ee.Feature(ee.Geometry.Point([120.69371154144368, 15.0292230738815]), {LU:5}),
  ee.Feature(ee.Geometry.Point([121.72673782026261, 17.615338549693]), {LU:5}),
  ee.Feature(ee.Geometry.Point([121.72800382291764, 17.614408003354352]), {LU:5}),
  ee.Feature(ee.Geometry.Point([121.08605692038513, 18.607201439059622]), {LU:5}),
  ee.Feature(ee.Geometry.Point([120.23204280093086, 16.020912703546596]), {LU:5}),
  ee.Feature(ee.Geometry.Point([125.00141667156977, 11.241825209724329]), {LU:5}),
  ee.Feature(ee.Geometry.Point([124.3931944492583, 11.560702777822874]), {LU:5}),
  ee.Feature(ee.Geometry.Point([124.63953170926963, 12.497435832904712]), {LU:5}),
  ee.Feature(ee.Geometry.Point([121.61320985387454, 13.935833189243498]), {LU:5}),
  ee.Feature(ee.Geometry.Point([121.62089170049319, 13.93376098417955]), {LU:5}),
  ee.Feature(ee.Geometry.Point([121.42544976568561, 13.927381272999718]), {LU:5}),
  ee.Feature(ee.Geometry.Point([121.42429105139118, 13.927516647486291]), {LU:5}),
  ee.Feature(ee.Geometry.Point([121.32352271329648, 14.067493679692843]), {LU:5}),
  ee.Feature(ee.Geometry.Point([120.9985460783317, 14.46746679200989]), {LU:5}),
  ee.Feature(ee.Geometry.Point([121.15952220834113, 14.74918350280286]), {LU:5}),
  ee.Feature(ee.Geometry.Point([120.41700032341292, 16.895027826901938]), {LU:5}),
  ee.Feature(ee.Geometry.Point([123.75405529806112, 13.145555758138086]), {LU:5}),
  ee.Feature(ee.Geometry.Point([123.42044934477246, 10.481583135190707]), {LU:5}),
  ee.Feature(ee.Geometry.Point([122.56504562312047, 10.69594422556466]), {LU:5}),
  ee.Feature(ee.Geometry.Point([124.59766397605688, 12.066669560372015]), {LU:5}),
  ee.Feature(ee.Geometry.Point([122.95677330615058, 14.112182963480508]), {LU:5}),
  ee.Feature(ee.Geometry.Point([121.11251646098508, 14.634443238046636]), {LU:5}),
  ee.Feature(ee.Geometry.Point([121.05416750561777, 14.760941982285972]), {LU:5}),
  ee.Feature(ee.Geometry.Point([120.23468378585824, 14.880310739834634]), {LU:5}),
  ee.Feature(ee.Geometry.Point([120.20362368715669, 14.932681700665997]), {LU:5}),
  ee.Feature(ee.Geometry.Point([120.31627119918244, 16.615710648111822]), {LU:5}),
  ee.Feature(ee.Geometry.Point([122.12363455853288, 16.27673261573832]), {LU:5}),
  ee.Feature(ee.Geometry.Point([123.12750425222865, 9.593749623186184]), {LU:5}),
  ee.Feature(ee.Geometry.Point([124.25297078996334, 7.218214226703165]), {LU:5}),
  ee.Feature(ee.Geometry.Point([125.49549568302906, 9.787405073244722]), {LU:5}),
  ee.Feature(ee.Geometry.Point([125.59957451045773, 10.06184911997362]), {LU:5}),
  ee.Feature(ee.Geometry.Point([124.48856123427969, 11.36910764708222]), {LU:5}),
  ee.Feature(ee.Geometry.Point([123.60064830187824, 13.189802333685376]), {LU:5}),
  ee.Feature(ee.Geometry.Point([123.93617171933413, 10.33417624898572]), {LU:5}),
  ee.Feature(ee.Geometry.Point([123.89288502876704, 10.297890684717927]), {LU:5})
]);

var Water = ee.FeatureCollection([
  ee.Feature(ee.Geometry.Point([124.47242213129545, 11.365080973524561]), {LU:6}),
  ee.Feature(ee.Geometry.Point([124.3017786906851, 11.464033071677074]), {LU:6}),
  ee.Feature(ee.Geometry.Point([121.27255321682345, 14.369808105941377]), {LU:6}),
  ee.Feature(ee.Geometry.Point([121.13385082424533, 14.393420151126975]), {LU:6}),
  ee.Feature(ee.Geometry.Point([121.02963394518613, 13.966636825783546]), {LU:6}),
  ee.Feature(ee.Geometry.Point([121.37189713604018, 14.00079133699303]), {LU:6}),
  ee.Feature(ee.Geometry.Point([121.52456872375525, 14.29103638520722]), {LU:6}),
  ee.Feature(ee.Geometry.Point([121.55683010291742, 15.785068999567118]), {LU:6}),
  ee.Feature(ee.Geometry.Point([121.67370721506065, 18.244225074934377]), {LU:6}),
  ee.Feature(ee.Geometry.Point([121.66547382462701, 18.279751523955383]), {LU:6}),
  ee.Feature(ee.Geometry.Point([121.65732792833, 18.14528660093338]), {LU:6}),
  ee.Feature(ee.Geometry.Point([125.59428116497247, 7.0793643945248155]), {LU:6}),
  ee.Feature(ee.Geometry.Point([124.27990963139763, 7.857903636358763]), {LU:6}),
  ee.Feature(ee.Geometry.Point([121.1740594015852, 15.82855250921797]), {LU:6}),
  ee.Feature(ee.Geometry.Point([121.38865126383696, 13.669483163639253]), {LU:6}),
  ee.Feature(ee.Geometry.Point([121.3945306659976, 13.670650754377204]), {LU:6}),
  ee.Feature(ee.Geometry.Point([120.95379230266022, 13.936417559744461]), {LU:6}),
  ee.Feature(ee.Geometry.Point([121.09145388807109, 18.612076077016475]), {LU:6}),
  ee.Feature(ee.Geometry.Point([120.21115375712287, 16.02019085250606]), {LU:6}),
  ee.Feature(ee.Geometry.Point([120.23831188849336, 16.01553429009325]), {LU:6}),
  ee.Feature(ee.Geometry.Point([123.50817927974666, 13.468511599408256]), {LU:6}),
  ee.Feature(ee.Geometry.Point([123.55181129214428, 13.623682691814048]), {LU:6}),
  ee.Feature(ee.Geometry.Point([121.34131252931331, 13.160171483333485]), {LU:6}),
  ee.Feature(ee.Geometry.Point([126.35427812545613, 8.226936358864064]), {LU:6}),
  ee.Feature(ee.Geometry.Point([125.9629525278317, 9.900477117165373]), {LU:6}),
  ee.Feature(ee.Geometry.Point([125.6464384575345, 9.868347180126058]), {LU:6}),
  ee.Feature(ee.Geometry.Point([125.65903375392101, 10.000027900991112]), {LU:6}),
  ee.Feature(ee.Geometry.Point([125.63744298392798, 10.252852511272934]), {LU:6}),
  ee.Feature(ee.Geometry.Point([125.54843696383566, 11.205957485181246]), {LU:6}),
  ee.Feature(ee.Geometry.Point([121.3062124767919, 13.962628382201716]), {LU:6}),
  ee.Feature(ee.Geometry.Point([121.3307930087587, 14.078325367031171]), {LU:6}),
  ee.Feature(ee.Geometry.Point([121.34396801943986, 14.08096862454672]), {LU:6}),
  ee.Feature(ee.Geometry.Point([121.36642538128292, 14.119062118311474]), {LU:6}),
  ee.Feature(ee.Geometry.Point([121.36831365642941, 14.114525611863778]), {LU:6}),
  ee.Feature(ee.Geometry.Point([121.33535490067777, 14.12194979977748]), {LU:6}),
  ee.Feature(ee.Geometry.Point([122.33202609427104, 13.87756291846799]), {LU:6}),
  ee.Feature(ee.Geometry.Point([123.11925839985129, 13.690222709739075]), {LU:6}),
  ee.Feature(ee.Geometry.Point([123.33386308440512, 13.9848816286307]), {LU:6}),
  ee.Feature(ee.Geometry.Point([125.03955646837714, 12.54929963362164]), {LU:6}),
  ee.Feature(ee.Geometry.Point([125.04123530569807, 12.51304814136048]), {LU:6}),
  ee.Feature(ee.Geometry.Point([124.69635714916804, 11.070178802727094]), {LU:6}),
  ee.Feature(ee.Geometry.Point([124.71735267254327, 11.099119020921968]), {LU:6}),
  ee.Feature(ee.Geometry.Point([121.27775653608364, 14.444040762515531]), {LU:6}),
  ee.Feature(ee.Geometry.Point([120.98802302951451, 14.060703447156305]), {LU:6}),
  ee.Feature(ee.Geometry.Point([123.3339692689928, 13.976556871089976]), {LU:6}),
  ee.Feature(ee.Geometry.Point([123.51684575072323, 13.452932221303625]), {LU:6}),
  ee.Feature(ee.Geometry.Point([123.710202653494, 12.945067868120995]), {LU:6}),
  ee.Feature(ee.Geometry.Point([125.52288870096092, 9.475903755415988]), {LU:6}),
  ee.Feature(ee.Geometry.Point([120.29555480000755, 14.980084529028998]), {LU:6}),
  ee.Feature(ee.Geometry.Point([120.32729069707176, 14.980043072127362]), {LU:6}),
  ee.Feature(ee.Geometry.Point([121.24190579607908, 14.26081400522269]), {LU:6}),
  ee.Feature(ee.Geometry.Point([121.14173586041876, 14.368596920361528]), {LU:6}),
  ee.Feature(ee.Geometry.Point([120.14653058601897, 16.03103302973905]), {LU:6}),
  ee.Feature(ee.Geometry.Point([119.92042040795329, 16.245833933740684]), {LU:6}),
  ee.Feature(ee.Geometry.Point([119.92105583299627, 16.368278022098313]), {LU:6}),
  ee.Feature(ee.Geometry.Point([121.36022136850366, 18.48505775693296]), {LU:6}),
  ee.Feature(ee.Geometry.Point([121.60758536893783, 13.907702681319542]), {LU:6}),
  ee.Feature(ee.Geometry.Point([124.92348055189532, 11.446905144518986]), {LU:6}),
  ee.Feature(ee.Geometry.Point([124.96962592924318, 11.315022349618918]), {LU:6}),
  ee.Feature(ee.Geometry.Point([124.09362885524804, 12.753955230740322]), {LU:6})
]);

// ==================== 固定パラメータ ====================
var NUM_TREES = 500;
var TRAIN_RATIO = 0.7;
// Rice=cyan(旧Urban), Corn=green, Forest=darkgreen, Barren=gold, Urban=red(旧Rice), Water=blue
var luPalette = ['#00ffff','#00ff00','#006400','#ffd700','#ff0000','#0000ff'];
var luNames = ['Rice', 'Corn', 'Forest', 'Barren', 'Urban', 'Water'];

// ==================== 教師データの結合 ====================
var trainingPoints = Rice.merge(Corn).merge(Forest)
                        .merge(Barren).merge(Urban).merge(Water);

// ==================== フィリピン地域定義（FAO GAUL Level2 Province境界） ====================
var gaul2 = ee.FeatureCollection('FAO/GAUL/2015/level2');
var phProv = gaul2.filter(ee.Filter.eq('ADM0_NAME', 'Philippines'));

var regionProvinces = {
  'Region I - Ilocos':            ['Ilocos Norte','Ilocos Sur','La Union','Pangasinan'],
  'Region II - Cagayan Valley':   ['Batanes','Cagayan','Isabela','Nueva Vizcaya','Quirino'],
  'Region III - Central Luzon':   ['Aurora','Bataan','Bulacan','Nueva Ecija','Pampanga','Tarlac','Zambales'],
  'Region IV-A - CALABARZON':     ['Batangas','Cavite','Laguna','Quezon','Rizal'],
  'Region V - Bicol':             ['Albay','Camarines Norte','Camarines Sur','Catanduanes','Masbate','Sorsogon'],
  'Region VI - Western Visayas':  ['Aklan','Antique','Capiz','Guimaras','Iloilo','Negros Occidental'],
  'Region VII - Central Visayas': ['Bohol','Cebu','Negros Oriental','Siquijor'],
  'Region VIII - Eastern Visayas':['Biliran','Eastern Samar','Leyte','Northern Samar','Samar','Southern Leyte'],
  'Region IX - Zamboanga':        ['Zamboanga Del Norte','Zamboanga Del Sur','Zamboanga Sibugay'],
  'Region X - Northern Mindanao': ['Bukidnon','Camiguin','Lanao Del Norte','Misamis Occidental','Misamis Oriental'],
  'Region XI - Davao':            ['Compostela','Davao del Norte','Davao Del Sur','Davao Oriental'],
  'Region XII - SOCCSKSARGEN':    ['North Cotabato','Saranggani','South Cotabato','Sultan Kudarat'],
  'Region XIII - Caraga':         ['Agusan Del Norte','Agusan Del Sur','Dinagat','Surigao Del Norte','Surigao Del Sur'],
  'BARMM':                        ['Basilan','Lanao Del Sur','Maguindanao','Shariff Kabunsuan','Sulu','Tawi-tawi'],
  'CAR - Cordillera':             ['Abra','Apayao','Benguet','Ifugao','Kalinga','Mountain Province'],
  'NCR - Metro Manila':           ['Metropolitan Manila'],
};

function getRegionGeometry(name) {
  var provList = regionProvinces[name];
  return phProv.filter(ee.Filter.inList('ADM2_NAME', provList)).geometry();
}

var regionNames = Object.keys(regionProvinces).concat(['Custom (Draw on map)']);

// ==================== UIパネル ====================
var panel = ui.Panel({style: {width: '320px', padding: '8px'}});
ui.root.insert(0, panel);

panel.add(ui.Label('LULC Random Forest', {
  fontWeight: 'bold', fontSize: '16px', margin: '0 0 4px 0'
}));
panel.add(ui.Label('土地利用図作成ツール', {fontSize: '12px', color: 'gray'}));

// --- 地域選択 ---
panel.add(ui.Label('解析地域:', {fontWeight: 'bold', margin: '14px 0 4px 0'}));
var regionSelect = ui.Select({
  items: regionNames,
  value: 'Region II - Cagayan Valley',
  style: {stretch: 'horizontal'}
});
panel.add(regionSelect);
panel.add(ui.Label('※「Custom」選択時は地図上にジオメトリを描画してください',
  {fontSize: '10px', color: 'gray'}));

// --- 解析年 ---
panel.add(ui.Label('解析年:', {fontWeight: 'bold', margin: '12px 0 4px 0'}));
var yearSlider = ui.Slider({min: 2017, max: 2025, value: 2020, step: 1, style: {stretch: 'horizontal'}});
panel.add(yearSlider);

// --- 雲被覆率 ---
panel.add(ui.Label('雲被覆率閾値 (%):', {fontWeight: 'bold', margin: '12px 0 4px 0'}));
var cloudSlider = ui.Slider({min: 5, max: 50, value: 20, step: 5, style: {stretch: 'horizontal'}});
panel.add(cloudSlider);

// --- 結果表示エリア ---
var resultPanel = ui.Panel({style: {margin: '12px 0 0 0'}});
panel.add(resultPanel);

// --- Apply ボタン ---
var applyButton = ui.Button({label: '実行', style: {stretch: 'horizontal', fontWeight: 'bold'}});
panel.add(applyButton);

// ==================== 解析関数 ====================
function runClassification() {
  resultPanel.clear();
  resultPanel.add(ui.Label('処理中...', {color: 'blue'}));

  var YEAR = yearSlider.getValue();
  var CLOUD_THRESHOLD = cloudSlider.getValue();
  var selectedRegion = regionSelect.getValue();

  // 解析範囲の決定
  var region;
  if (selectedRegion === 'Custom (Draw on map)') {
    var drawingLayers = Map.drawingTools().layers();
    if (drawingLayers.length() > 0 && drawingLayers.get(0).geometries().length() > 0) {
      region = drawingLayers.get(0).toGeometry();
    } else {
      resultPanel.clear();
      resultPanel.add(ui.Label('エラー: 地図上にジオメトリを描画してください', {color: 'red'}));
      return;
    }
  } else {
    region = getRegionGeometry(selectedRegion);
  }

  // --- 衛星データ取得関数 ---
  // --- Sentinel-1 SAR ---
  function getS1(startDate, endDate) {
    return ee.ImageCollection('COPERNICUS/S1_GRD')
      .filterDate(startDate, endDate)
      .filter(ee.Filter.listContains('transmitterReceiverPolarisation', 'VV'))
      .filter(ee.Filter.listContains('transmitterReceiverPolarisation', 'VH'))
      .select(['VV', 'VH'])
      .median();
  }

  // --- Landsat-8 光学衛星（論文準拠） ---
  function getLandsat(startDate, endDate) {
    var l8 = ee.ImageCollection('LANDSAT/LC08/C02/T1_L2')
      .filterDate(startDate, endDate)
      .filter(ee.Filter.lt('CLOUD_COVER', CLOUD_THRESHOLD))
      .map(function(img) {
        // スケーリング
        var sr = img.select('SR_B.*').multiply(0.0000275).add(-0.2);
        return sr.copyProperties(img, img.propertyNames());
      });
    var composite = l8.median();
    // 論文Table 2準拠: B1-B7, B9, B10, B11 + NDVI, EVI, NDWI, MNDWI
    var ndvi = composite.normalizedDifference(['SR_B5', 'SR_B4']).rename('NDVI');
    var evi = composite.expression(
      '2.5 * ((NIR - RED) / (NIR + 6 * RED - 7.5 * BLUE + 1))',
      {NIR: composite.select('SR_B5'), RED: composite.select('SR_B4'), BLUE: composite.select('SR_B2')}
    ).rename('EVI');
    var ndwi = composite.normalizedDifference(['SR_B3', 'SR_B5']).rename('NDWI');
    var mndwi = composite.normalizedDifference(['SR_B3', 'SR_B6']).rename('MNDWI');
    return composite
      .select(['SR_B1','SR_B2','SR_B3','SR_B4','SR_B5','SR_B6','SR_B7'])
      .addBands(ndvi).addBands(evi).addBands(ndwi).addBands(mndwi);
  }

  // --- 季節ごとの衛星データ（論文準拠: 3期間に分割） ---
  var periods = [
    {start: YEAR+'-01-01', end: YEAR+'-04-30', suffix: '_P1'},
    {start: YEAR+'-05-01', end: YEAR+'-08-31', suffix: '_P2'},
    {start: YEAR+'-09-01', end: YEAR+'-12-31', suffix: '_P3'},
  ];

  var inputImage = ee.Image([]);
  periods.forEach(function(p) {
    var s1 = getS1(p.start, p.end);
    var l8 = getLandsat(p.start, p.end);
    var s1Renamed = s1.select(['VV','VH'], ['VV'+p.suffix, 'VH'+p.suffix]);
    var l8Renamed = l8.bandNames().iterate(function(bandName, img) {
      bandName = ee.String(bandName);
      return ee.Image(img).addBands(l8.select([bandName], [bandName.cat(p.suffix)]));
    }, ee.Image([]));
    inputImage = inputImage.addBands(s1Renamed).addBands(ee.Image(l8Renamed));
  });

  // --- MERIT Hydro 地形データ（論文準拠: 標高, 傾斜, 集水面積） ---
  var merit = ee.Image('MERIT/Hydro/v1_0_1');
  var elevation = merit.select('elv').rename('elevation');
  var slopeImg = ee.Terrain.slope(elevation).rename('slope');
  var upa = merit.select('upa').rename('flow_accumulation');
  inputImage = inputImage.addBands(elevation).addBands(slopeImg).addBands(upa);

  // --- NAMRIA 土地被覆マップ（論文準拠: GEE上ではCopernicus Land Coverで代用） ---
  // ※ NAMRIAはGEE Data Catalogに未収録のため、Copernicus 100mで代用
  var landcover = ee.Image('COPERNICUS/Landcover/100m/Proba-V-C3/Global/2019')
    .select('discrete_classification').rename('landcover_ref');
  inputImage = inputImage.addBands(landcover);

  // --- トレーニング（全国の教師データポイントでサンプリング） ---
  var withRandom = trainingPoints.randomColumn('random', 42);
  var trainData = withRandom.filter(ee.Filter.lt('random', TRAIN_RATIO));
  var testData = withRandom.filter(ee.Filter.gte('random', TRAIN_RATIO));

  var bands = inputImage.bandNames();
  // sampleRegionsは各ポイント周辺のピクセル値のみ取得するため、メモリ効率が良い
  var trainSamples = inputImage.sampleRegions({collection: trainData, properties: ['LU'], scale: 30});
  var testSamples = inputImage.sampleRegions({collection: testData, properties: ['LU'], scale: 30});

  var classifier = ee.Classifier.smileRandomForest(NUM_TREES)
    .train({features: trainSamples, classProperty: 'LU', inputProperties: bands});

  // --- 選択地域のみに分類結果をクリップ（100mスケールで表示） ---
  var classified = inputImage.classify(classifier).clip(region);

  // --- 精度検証 ---
  var validated = testSamples.classify(classifier);
  var errorMatrix = validated.errorMatrix('LU', 'classification');

  // --- 可視化（選択地域のみ） ---
  Map.layers().reset();
  Map.centerObject(region, 8);
  Map.addLayer(classified, {min:1, max:6, palette: luPalette}, 'LULC ' + selectedRegion + ' ' + YEAR);

  // --- 結果表示 ---
  resultPanel.clear();
  resultPanel.add(ui.Label('解析結果', {fontWeight: 'bold', margin: '0 0 6px 0'}));
  resultPanel.add(ui.Label('地域: ' + selectedRegion));
  resultPanel.add(ui.Label('年: ' + YEAR));

  errorMatrix.accuracy().evaluate(function(acc) {
    if (acc !== null && acc !== undefined) {
      resultPanel.add(ui.Label('全体精度: ' + (acc * 100).toFixed(1) + '%'));
    }
  });
  errorMatrix.kappa().evaluate(function(k) {
    if (k !== null && k !== undefined) {
      resultPanel.add(ui.Label('カッパ係数: ' + k.toFixed(3)));
    }
  });

  // 各土地利用タイプの精度
  errorMatrix.producersAccuracy().evaluate(function(pa) {
    if (!pa) return;
    resultPanel.add(ui.Label('分類精度:', {fontWeight: 'bold', margin: '8px 0 4px 0'}));
    for (var i = 0; i < luNames.length; i++) {
      var val = (pa[i] && pa[i][0] !== null && pa[i][0] !== undefined)
        ? (pa[i][0] * 100).toFixed(1) + '%' : '-';
      resultPanel.add(ui.Label('  ' + luNames[i] + ': ' + val, {fontSize: '11px'}));
    }
  });

  // --- エクスポート ---
  Export.image.toDrive({
    image: classified,
    description: 'LULC',
    region: region, scale: 30, maxPixels: 1e13, fileFormat: 'GeoTIFF'
  });

  print('--- Classification complete: ' + selectedRegion + ' ' + YEAR + ' ---');
}

applyButton.onClick(runClassification);

// ==================== 凡例 ====================
var legend = ui.Panel({style: {position: 'bottom-left'}});
legend.add(ui.Label('凡例', {fontWeight: 'bold'}));
luNames.forEach(function(name, i) {
  var color = ui.Panel({
    style: {backgroundColor: luPalette[i], width: '14px', height: '14px', margin: '2px 4px 2px 0'}
  });
  legend.add(ui.Panel([color, ui.Label(name, {margin: '2px 0'})], ui.Panel.Layout.Flow('horizontal')));
});
Map.add(legend);

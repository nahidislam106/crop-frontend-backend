// ─── Crop dictionary (English ↔ Bangla) ────────────────────────────────────

export const CROP_NAMES: Record<string, { bn: string; type: string }> = {
  rice:         { bn: "ধান (Dhan)",             type: "cereal" },
  maize:        { bn: "ভুট্টা (Bhuṭṭa)",        type: "cereal" },
  chickpea:     { bn: "ছোলা (Chola)",            type: "pulse" },
  kidneybeans:  { bn: "রাজমা (Rajma)",            type: "pulse" },
  pigeonpeas:   { bn: "অড়হর ডাল (Arhor Dal)",   type: "pulse" },
  mothbeans:    { bn: "মথ ডাল (Moth Dal)",       type: "pulse" },
  mungbean:     { bn: "মুগ ডাল (Mug Dal)",       type: "pulse" },
  blackgram:    { bn: "মাষকলাই (Mashkolai)",     type: "pulse" },
  lentil:       { bn: "মসুর ডাল (Masur Dal)",    type: "pulse" },
  pomegranate:  { bn: "ডালিম (Dalim)",           type: "fruit" },
  banana:       { bn: "কলা (Kola)",              type: "fruit" },
  mango:        { bn: "আম (Am)",                 type: "fruit" },
  grapes:       { bn: "আঙুর (Angur)",            type: "fruit" },
  watermelon:   { bn: "তরমুজ (Tormuj)",          type: "fruit" },
  muskmelon:    { bn: "বাঙি (Bangi)",             type: "fruit" },
  apple:        { bn: "আপেল (Apel)",             type: "fruit" },
  orange:       { bn: "কমলা (Komola)",           type: "fruit" },
  papaya:       { bn: "পেঁপে (Pepe)",            type: "fruit" },
  coconut:      { bn: "নারিকেল (Narikel)",       type: "fruit" },
  cotton:       { bn: "তুলা (Tula)",             type: "cash_crop" },
  jute:         { bn: "পাট (Pat)",               type: "cash_crop" },
  coffee:       { bn: "কফি (Coffee)",            type: "cash_crop" },
  "Balsam Apple":  { bn: "করলা (Korola)",        type: "vegetable" },
  "Cauliflower":   { bn: "ফুলকপি (Phulkopi)",   type: "vegetable" },
  "Chili":         { bn: "মরিচ (Morich)",        type: "vegetable" },
  "Cucumber":      { bn: "শসা (Shasha)",         type: "vegetable" },
};

// ─── Exact ideal parameters (directly from ideal_parameters.json) ─────────
// All 26 crops × 12 parameters: { min, mean, max, std }

export interface ParamStat { min: number; mean: number; max: number; std: number; }
export interface CropIdeal {
  N:                   ParamStat;
  P:                   ParamStat;
  K:                   ParamStat;
  ph:                  ParamStat;
  EC:                  ParamStat;
  temperature:         ParamStat;
  humidity:            ParamStat;
  weather_temperature: ParamStat;
  weather_humidity:    ParamStat;
  light_intensity:     ParamStat;
  air_pressure:        ParamStat;
  rainfall:            ParamStat;
  en_tip: string;
  bn_tip: string;
}

export const CROP_IDEAL_DATA: Record<string, CropIdeal> = {
  rice: {
    N:                   { min: 60.0,   mean: 79.89,    max: 99.0,    std: 11.92  },
    P:                   { min: 35.0,   mean: 47.58,    max: 60.0,    std: 7.90   },
    K:                   { min: 35.0,   mean: 39.87,    max: 45.0,    std: 2.95   },
    ph:                  { min: 5.01,   mean: 6.43,     max: 7.87,    std: 0.77   },
    EC:                  { min: 1.21,   mean: 2.38,     max: 3.58,    std: 0.68   },
    temperature:         { min: 20.05,  mean: 23.69,    max: 26.93,   std: 2.03   },
    humidity:            { min: 80.12,  mean: 82.27,    max: 84.97,   std: 1.42   },
    weather_temperature: { min: 11.20,  mean: 20.10,    max: 27.79,   std: 4.98   },
    weather_humidity:    { min: 47.02,  mean: 70.07,    max: 95.07,   std: 13.70  },
    light_intensity:     { min: 118.07, mean: 538.50,   max: 990.76,  std: 252.92 },
    air_pressure:        { min: 980.57, mean: 1005.11,  max: 1029.99, std: 15.29  },
    rainfall:            { min: 0.22,   mean: 14.77,    max: 29.42,   std: 9.02   },
    en_tip: "Rice thrives in wet/flooded conditions. Ensure good water management and apply split N doses.",
    bn_tip: "ধান চাষে পানি ব্যবস্থাপনা সবচেয়ে গুরুত্বপূর্ণ। নাইট্রোজেন সার ভাগে ভাগে প্রয়োগ করুন।",
  },
  maize: {
    N:                   { min: 60.0,    mean: 77.76,   max: 100.0,   std: 11.96  },
    P:                   { min: 35.0,    mean: 48.39,   max: 60.0,    std: 7.98   },
    K:                   { min: 15.0,    mean: 19.83,   max: 25.0,    std: 2.94   },
    ph:                  { min: 5.50,    mean: 6.34,    max: 7.00,    std: 0.43   },
    EC:                  { min: 1.21,    mean: 2.47,    max: 3.59,    std: 0.72   },
    temperature:         { min: 18.04,   mean: 22.36,   max: 26.63,   std: 2.66   },
    humidity:            { min: 55.33,   mean: 65.12,   max: 74.79,   std: 5.46   },
    weather_temperature: { min: 11.01,   mean: 19.24,   max: 27.87,   std: 4.95   },
    weather_humidity:    { min: 49.23,   mean: 72.36,   max: 95.81,   std: 12.62  },
    light_intensity:     { min: 114.63,  mean: 543.47,  max: 996.67,  std: 253.23 },
    air_pressure:        { min: 980.52,  mean: 1004.24, max: 1029.88, std: 13.91  },
    rainfall:            { min: 0.49,    mean: 14.11,   max: 29.87,   std: 8.80   },
    en_tip: "Maize needs deep well-drained soil. Top-dress with urea at knee-high stage for best yield.",
    bn_tip: "ভুট্টায় ইউরিয়া সার উপরি প্রয়োগ করুন যখন গাছ হাঁটু সমান হয়।",
  },
  chickpea: {
    N:                   { min: 20.0,    mean: 40.09,   max: 60.0,    std: 12.22  },
    P:                   { min: 55.0,    mean: 67.79,   max: 80.0,    std: 7.51   },
    K:                   { min: 75.0,    mean: 79.93,   max: 85.0,    std: 3.29   },
    ph:                  { min: 5.97,    mean: 7.28,    max: 8.93,    std: 0.80   },
    EC:                  { min: 1.21,    mean: 2.37,    max: 3.56,    std: 0.69   },
    temperature:         { min: 17.00,   mean: 18.87,   max: 21.00,   std: 1.17   },
    humidity:            { min: 14.26,   mean: 16.86,   max: 19.97,   std: 1.70   },
    weather_temperature: { min: 11.22,   mean: 19.71,   max: 27.67,   std: 5.00   },
    weather_humidity:    { min: 47.04,   mean: 72.22,   max: 94.77,   std: 13.43  },
    light_intensity:     { min: 113.98,  mean: 570.26,  max: 978.72,  std: 260.38 },
    air_pressure:        { min: 980.12,  mean: 1006.49, max: 1029.64, std: 13.93  },
    rainfall:            { min: 0.25,    mean: 14.62,   max: 29.96,   std: 8.80   },
    en_tip: "Chickpea fixes nitrogen — avoid heavy N fertilizer. Good for dry, cool Rabi season.",
    bn_tip: "ছোলা নিজেই মাটিতে নাইট্রোজেন সংযোজন করে। বেশি ইউরিয়া দেওয়া দরকার নেই।",
  },
  kidneybeans: {
    N:                   { min: 0.0,     mean: 20.75,   max: 40.0,    std: 10.82  },
    P:                   { min: 55.0,    mean: 67.52,   max: 80.0,    std: 7.63   },
    K:                   { min: 15.0,    mean: 20.13,   max: 25.0,    std: 3.10   },
    ph:                  { min: 5.50,    mean: 5.79,    max: 6.00,    std: 0.15   },
    EC:                  { min: 1.24,    mean: 2.51,    max: 3.54,    std: 0.71   },
    temperature:         { min: 15.26,   mean: 20.07,   max: 24.94,   std: 2.64   },
    humidity:            { min: 18.07,   mean: 21.57,   max: 24.96,   std: 2.21   },
    weather_temperature: { min: 11.11,   mean: 19.76,   max: 27.59,   std: 4.75   },
    weather_humidity:    { min: 47.23,   mean: 70.22,   max: 95.42,   std: 14.01  },
    light_intensity:     { min: 106.63,  mean: 558.74,  max: 991.62,  std: 248.18 },
    air_pressure:        { min: 980.17,  mean: 1005.88, max: 1028.91, std: 14.77  },
    rainfall:            { min: 0.12,    mean: 15.38,   max: 29.90,   std: 8.82   },
    en_tip: "Kidney beans prefer slightly acidic soil. Excellent companion with corn.",
    bn_tip: "রাজমা সামান্য অম্লীয় মাটিতে ভালো জন্মায়। ভুট্টার সাথে মিশ্র চাষ ভালো।",
  },
  pigeonpeas: {
    N:                   { min: 0.0,     mean: 20.70,   max: 40.0,    std: 11.92  },
    P:                   { min: 55.0,    mean: 67.73,   max: 80.0,    std: 7.28   },
    K:                   { min: 15.0,    mean: 20.28,   max: 25.0,    std: 2.82   },
    ph:                  { min: 4.62,    mean: 5.79,    max: 7.47,    std: 0.80   },
    EC:                  { min: 1.21,    mean: 2.43,    max: 3.58,    std: 0.72   },
    temperature:         { min: 18.26,   mean: 27.69,   max: 36.98,   std: 5.74   },
    humidity:            { min: 30.38,   mean: 48.07,   max: 69.71,   std: 11.01  },
    weather_temperature: { min: 11.33,   mean: 19.67,   max: 27.93,   std: 5.16   },
    weather_humidity:    { min: 47.74,   mean: 72.84,   max: 95.90,   std: 14.81  },
    light_intensity:     { min: 104.82,  mean: 539.54,  max: 998.92,  std: 256.60 },
    air_pressure:        { min: 980.30,  mean: 1005.84, max: 1029.87, std: 14.52  },
    rainfall:            { min: 0.55,    mean: 15.31,   max: 29.41,   std: 8.82   },
    en_tip: "Pigeon peas are drought-tolerant and great for intercropping. Long growing season of 150–180 days.",
    bn_tip: "অড়হর ডাল খরা সহনশীল এবং মিশ্র চাষের জন্য উপযুক্ত। ১৫০–১৮০ দিনে ফলন দেয়।",
  },
  mothbeans: {
    N:                   { min: 0.0,     mean: 21.42,   max: 40.0,    std: 11.30  },
    P:                   { min: 35.0,    mean: 47.97,   max: 60.0,    std: 7.62   },
    K:                   { min: 15.0,    mean: 20.24,   max: 25.0,    std: 3.12   },
    ph:                  { min: 3.50,    mean: 6.83,    max: 9.94,    std: 1.89   },
    EC:                  { min: 1.27,    mean: 2.41,    max: 3.58,    std: 0.71   },
    temperature:         { min: 24.01,   mean: 28.19,   max: 31.99,   std: 2.21   },
    humidity:            { min: 40.01,   mean: 53.22,   max: 64.98,   std: 7.01   },
    weather_temperature: { min: 11.04,   mean: 18.28,   max: 27.57,   std: 4.50   },
    weather_humidity:    { min: 47.51,   mean: 72.14,   max: 95.66,   std: 14.11  },
    light_intensity:     { min: 101.63,  mean: 590.98,  max: 995.34,  std: 260.22 },
    air_pressure:        { min: 980.22,  mean: 1005.05, max: 1029.95, std: 14.89  },
    rainfall:            { min: 0.07,    mean: 14.64,   max: 29.29,   std: 8.11   },
    en_tip: "Moth beans are extremely drought-hardy. Best for sandy soils in arid zones.",
    bn_tip: "মথ ডাল অত্যন্ত খরা সহনশীল। শুষ্ক বালুকাময় এলাকায় চমৎকার ফলন দেয়।",
  },
  mungbean: {
    N:                   { min: 0.0,     mean: 20.99,   max: 40.0,    std: 11.52  },
    P:                   { min: 35.0,    mean: 47.28,   max: 60.0,    std: 7.88   },
    K:                   { min: 15.0,    mean: 19.87,   max: 25.0,    std: 3.17   },
    ph:                  { min: 6.20,    mean: 6.73,    max: 7.19,    std: 0.29   },
    EC:                  { min: 1.26,    mean: 2.33,    max: 3.58,    std: 0.69   },
    temperature:         { min: 27.00,   mean: 28.52,   max: 29.95,   std: 0.83   },
    humidity:            { min: 80.02,   mean: 85.52,   max: 89.97,   std: 2.89   },
    weather_temperature: { min: 11.17,   mean: 18.91,   max: 27.90,   std: 4.97   },
    weather_humidity:    { min: 47.22,   mean: 72.04,   max: 94.48,   std: 13.57  },
    light_intensity:     { min: 113.97,  mean: 560.82,  max: 980.38,  std: 263.90 },
    air_pressure:        { min: 980.12,  mean: 1003.87, max: 1029.95, std: 15.11  },
    rainfall:            { min: 0.19,    mean: 14.07,   max: 29.63,   std: 8.44   },
    en_tip: "Mungbean (green gram) matures in 60–90 days. Good for quick-rotation between main crops.",
    bn_tip: "মুগ ডাল ৬০–৯০ দিনে ঘরে আসে। দুই প্রধান ফসলের মাঝে দ্রুত ফলন পাওয়া যায়।",
  },
  blackgram: {
    N:                   { min: 20.0,    mean: 40.03,   max: 60.0,    std: 12.69  },
    P:                   { min: 55.0,    mean: 67.50,   max: 80.0,    std: 7.21   },
    K:                   { min: 15.0,    mean: 19.24,   max: 25.0,    std: 3.21   },
    ph:                  { min: 6.48,    mean: 7.13,    max: 7.79,    std: 0.37   },
    EC:                  { min: 1.22,    mean: 2.51,    max: 3.59,    std: 0.72   },
    temperature:         { min: 25.09,   mean: 30.01,   max: 35.00,   std: 2.73   },
    humidity:            { min: 60.09,   mean: 65.12,   max: 69.97,   std: 2.81   },
    weather_temperature: { min: 11.39,   mean: 19.71,   max: 27.91,   std: 4.83   },
    weather_humidity:    { min: 47.77,   mean: 74.17,   max: 95.81,   std: 13.90  },
    light_intensity:     { min: 103.09,  mean: 520.04,  max: 988.48,  std: 268.00 },
    air_pressure:        { min: 980.54,  mean: 1002.77, max: 1029.72, std: 13.50  },
    rainfall:            { min: 1.06,    mean: 15.75,   max: 29.98,   std: 8.36   },
    en_tip: "Black gram (urad) grows well in loamy soil. Needs well-distributed rainfall, avoid waterlogging.",
    bn_tip: "মাষকলাই দোআঁশ মাটিতে ভালো জন্মায়। জলাবদ্ধতা অবশ্যই এড়াতে হবে।",
  },
  lentil: {
    N:                   { min: 0.0,     mean: 18.83,   max: 40.0,    std: 12.23  },
    P:                   { min: 55.0,    mean: 68.36,   max: 80.0,    std: 7.31   },
    K:                   { min: 15.0,    mean: 19.41,   max: 25.0,    std: 2.96   },
    ph:                  { min: 5.92,    mean: 6.93,    max: 7.79,    std: 0.56   },
    EC:                  { min: 1.24,    mean: 2.28,    max: 3.58,    std: 0.70   },
    temperature:         { min: 18.07,   mean: 24.52,   max: 29.93,   std: 3.31   },
    humidity:            { min: 60.09,   mean: 64.82,   max: 69.94,   std: 2.92   },
    weather_temperature: { min: 11.54,   mean: 19.78,   max: 27.90,   std: 5.12   },
    weather_humidity:    { min: 47.94,   mean: 73.92,   max: 95.82,   std: 14.22  },
    light_intensity:     { min: 100.96,  mean: 540.69,  max: 996.99,  std: 274.97 },
    air_pressure:        { min: 981.20,  mean: 1004.91, max: 1029.09, std: 14.91  },
    rainfall:            { min: 0.01,    mean: 14.35,   max: 29.89,   std: 8.65   },
    en_tip: "Lentils prefer cool dry weather. Inoculate seeds with Rhizobium for better N fixation.",
    bn_tip: "মসুর ডাল ঠান্ডা শুষ্ক আবহাওয়া পছন্দ করে। রাইজোবিয়াম ব্যাকটেরিয়া দিয়ে বীজ শোধন করলে ভালো ফলন হয়।",
  },
  pomegranate: {
    N:                   { min: 0.0,     mean: 18.87,   max: 40.0,    std: 12.63  },
    P:                   { min: 5.0,     mean: 18.76,   max: 30.0,    std: 7.40   },
    K:                   { min: 35.0,    mean: 40.19,   max: 45.0,    std: 3.02   },
    ph:                  { min: 5.64,    mean: 6.43,    max: 7.24,    std: 0.45   },
    EC:                  { min: 1.21,    mean: 2.42,    max: 3.58,    std: 0.71   },
    temperature:         { min: 18.08,   mean: 21.83,   max: 24.96,   std: 2.22   },
    humidity:            { min: 85.06,   mean: 90.09,   max: 94.97,   std: 2.81   },
    weather_temperature: { min: 11.33,   mean: 19.67,   max: 27.93,   std: 5.16   },
    weather_humidity:    { min: 47.74,   mean: 72.84,   max: 95.90,   std: 14.81  },
    light_intensity:     { min: 104.82,  mean: 539.54,  max: 998.92,  std: 256.60 },
    air_pressure:        { min: 980.30,  mean: 1005.84, max: 1029.87, std: 14.52  },
    rainfall:            { min: 0.55,    mean: 15.31,   max: 29.41,   std: 8.82   },
    en_tip: "Pomegranate is drought-tolerant once established. Prune after harvest to encourage new fruiting wood.",
    bn_tip: "ডালিম গাছ একবার বড় হলে খরা সহনশীল হয়। ফসল তোলার পরে ছাঁটাই করলে নতুন ফলের ডাল বের হয়।",
  },
  banana: {
    N:                   { min: 80.0,    mean: 100.23,  max: 120.0,   std: 11.07  },
    P:                   { min: 70.0,    mean: 82.00,   max: 95.0,    std: 7.72   },
    K:                   { min: 45.0,    mean: 50.05,   max: 55.0,    std: 3.36   },
    ph:                  { min: 5.50,    mean: 5.99,    max: 6.50,    std: 0.29   },
    EC:                  { min: 1.21,    mean: 2.34,    max: 3.59,    std: 0.72   },
    temperature:         { min: 25.00,   mean: 27.38,   max: 29.95,   std: 1.42   },
    humidity:            { min: 75.00,   mean: 80.36,   max: 84.99,   std: 2.84   },
    weather_temperature: { min: 11.33,   mean: 19.74,   max: 27.90,   std: 4.99   },
    weather_humidity:    { min: 48.17,   mean: 69.48,   max: 95.97,   std: 13.80  },
    light_intensity:     { min: 102.60,  mean: 512.51,  max: 974.24,  std: 247.22 },
    air_pressure:        { min: 980.02,  mean: 1002.84, max: 1029.93, std: 14.72  },
    rainfall:            { min: 0.06,    mean: 15.43,   max: 29.93,   std: 8.88   },
    en_tip: "Banana is a heavy feeder — apply K-rich fertilizers. Remove suckers leaving only 1–2 per mat.",
    bn_tip: "কলা গাছ বেশি সার চায়। পটাশ সার নিয়মিত দিন এবং একটি মাদায় ১–২টির বেশি গাছ রাখবেন না।",
  },
  mango: {
    N:                   { min: 0.0,     mean: 20.07,   max: 40.0,    std: 12.35  },
    P:                   { min: 15.0,    mean: 27.18,   max: 40.0,    std: 7.69   },
    K:                   { min: 25.0,    mean: 29.94,   max: 35.0,    std: 3.11   },
    ph:                  { min: 4.51,    mean: 5.77,    max: 7.00,    std: 0.67   },
    EC:                  { min: 1.26,    mean: 2.55,    max: 3.53,    std: 0.62   },
    temperature:         { min: 26.98,   mean: 31.17,   max: 36.00,   std: 2.65   },
    humidity:            { min: 45.01,   mean: 50.15,   max: 55.00,   std: 2.79   },
    weather_temperature: { min: 11.04,   mean: 18.08,   max: 27.23,   std: 4.90   },
    weather_humidity:    { min: 47.73,   mean: 72.66,   max: 95.94,   std: 15.23  },
    light_intensity:     { min: 116.70,  mean: 542.88,  max: 977.11,  std: 249.98 },
    air_pressure:        { min: 980.25,  mean: 1006.42, max: 1029.37, std: 13.61  },
    rainfall:            { min: 0.10,    mean: 16.28,   max: 29.82,   std: 8.88   },
    en_tip: "Mango needs a dry period to trigger flowering. Avoid heavy irrigation Nov–Jan for good fruit set.",
    bn_tip: "আম ফুটতে শুষ্ক মৌসুম প্রয়োজন। নভেম্বর–জানুয়ারিতে সেচ কমালে ফুল বেশি আসে।",
  },
  grapes: {
    N:                   { min: 0.0,     mean: 23.18,   max: 40.0,    std: 12.47  },
    P:                   { min: 120.0,   mean: 132.53,  max: 145.0,   std: 7.64   },
    K:                   { min: 195.0,   mean: 200.11,  max: 205.0,   std: 3.31   },
    ph:                  { min: 5.50,    mean: 6.03,    max: 6.50,    std: 0.28   },
    EC:                  { min: 1.21,    mean: 2.31,    max: 3.57,    std: 0.72   },
    temperature:         { min: 8.83,    mean: 23.86,   max: 41.99,   std: 9.68   },
    humidity:            { min: 80.00,   mean: 81.87,   max: 84.00,   std: 1.21   },
    weather_temperature: { min: 11.10,   mean: 19.79,   max: 27.80,   std: 4.82   },
    weather_humidity:    { min: 47.23,   mean: 70.23,   max: 95.72,   std: 15.19  },
    light_intensity:     { min: 110.13,  mean: 582.01,  max: 999.86,  std: 253.28 },
    air_pressure:        { min: 980.13,  mean: 1003.96, max: 1029.62, std: 15.22  },
    rainfall:            { min: 0.10,    mean: 15.36,   max: 29.90,   std: 8.36   },
    en_tip: "Grapes need high K and P. Prune canes hard in dormancy. Train on trellises for air circulation.",
    bn_tip: "আঙুরে প্রচুর পটাশ ও ফসফরাস লাগে। শীতে কঠিন ছাঁটাই করুন এবং মাচায় তুলুন।",
  },
  watermelon: {
    N:                   { min: 80.0,    mean: 99.43,   max: 120.0,   std: 12.56  },
    P:                   { min: 5.0,     mean: 17.02,   max: 30.0,    std: 7.50   },
    K:                   { min: 45.0,    mean: 50.22,   max: 55.0,    std: 3.27   },
    ph:                  { min: 6.00,    mean: 6.50,    max: 7.00,    std: 0.28   },
    EC:                  { min: 1.20,    mean: 2.26,    max: 3.58,    std: 0.71   },
    temperature:         { min: 24.01,   mean: 25.59,   max: 26.99,   std: 0.86   },
    humidity:            { min: 80.02,   mean: 85.21,   max: 89.99,   std: 3.00   },
    weather_temperature: { min: 11.18,   mean: 19.80,   max: 28.02,   std: 4.98   },
    weather_humidity:    { min: 47.49,   mean: 71.92,   max: 96.00,   std: 12.93  },
    light_intensity:     { min: 113.73,  mean: 552.83,  max: 997.40,  std: 268.67 },
    air_pressure:        { min: 980.94,  mean: 1006.96, max: 1029.17, std: 13.93  },
    rainfall:            { min: 0.64,    mean: 13.36,   max: 29.34,   std: 7.47   },
    en_tip: "Watermelon needs sandy loam with good drainage. Hand-pollinate in low bee areas for fruit set.",
    bn_tip: "তরমুজে বালি-দোআঁশ মাটি আদর্শ। মৌমাছি কম থাকলে হাতে পরাগায়ন করুন।",
  },
  muskmelon: {
    N:                   { min: 80.0,    mean: 100.32,  max: 120.0,   std: 12.18  },
    P:                   { min: 5.0,     mean: 17.69,   max: 30.0,    std: 7.23   },
    K:                   { min: 45.0,    mean: 50.08,   max: 55.0,    std: 3.20   },
    ph:                  { min: 6.00,    mean: 6.40,    max: 6.80,    std: 0.23   },
    EC:                  { min: 1.23,    mean: 2.52,    max: 3.59,    std: 0.71   },
    temperature:         { min: 27.00,   mean: 28.66,   max: 29.95,   std: 0.85   },
    humidity:            { min: 90.01,   mean: 92.34,   max: 95.00,   std: 1.49   },
    weather_temperature: { min: 11.23,   mean: 18.95,   max: 28.03,   std: 4.93   },
    weather_humidity:    { min: 47.08,   mean: 70.64,   max: 95.38,   std: 14.50  },
    light_intensity:     { min: 108.04,  mean: 544.96,  max: 999.95,  std: 267.14 },
    air_pressure:        { min: 980.40,  mean: 1004.80, max: 1027.57, std: 12.68  },
    rainfall:            { min: 0.38,    mean: 14.89,   max: 29.97,   std: 8.47   },
    en_tip: "Muskmelon (cantaloupe) ripens when the stem slips easily. Reduce irrigation 2 weeks before harvest.",
    bn_tip: "বাঙি পাকলে বোঁটা সহজে আলাদা হয়। সংগ্রহের ২ সপ্তাহ আগে সেচ কমান।",
  },
  apple: {
    N:                   { min: 0.0,     mean: 20.80,   max: 40.0,    std: 11.92  },
    P:                   { min: 120.0,   mean: 134.22,  max: 145.0,   std: 8.10   },
    K:                   { min: 195.0,   mean: 199.89,  max: 205.0,   std: 3.33   },
    ph:                  { min: 5.50,    mean: 5.93,    max: 6.49,    std: 0.29   },
    EC:                  { min: 1.21,    mean: 2.37,    max: 3.57,    std: 0.70   },
    temperature:         { min: 21.00,   mean: 22.63,   max: 24.00,   std: 0.84   },
    humidity:            { min: 90.02,   mean: 92.33,   max: 94.93,   std: 1.47   },
    weather_temperature: { min: 11.17,   mean: 19.43,   max: 27.41,   std: 4.89   },
    weather_humidity:    { min: 47.00,   mean: 71.37,   max: 94.81,   std: 13.22  },
    light_intensity:     { min: 103.20,  mean: 524.96,  max: 983.77,  std: 273.56 },
    air_pressure:        { min: 980.10,  mean: 1003.17, max: 1028.86, std: 14.79  },
    rainfall:            { min: 0.17,    mean: 14.55,   max: 30.00,   std: 8.94   },
    en_tip: "Apple requires chilling hours (cold winter). High P and K needed. Thin fruits for better size.",
    bn_tip: "আপেলের জন্য শীত ঠান্ডার প্রয়োজন। বেশি ফলন হলে কিছু ফল পাতলা করুন যাতে বড় আপেল হয়।",
  },
  orange: {
    N:                   { min: 0.0,     mean: 19.58,   max: 40.0,    std: 11.94  },
    P:                   { min: 5.0,     mean: 16.60,   max: 30.0,    std: 7.67   },
    K:                   { min: 5.0,     mean: 10.02,   max: 15.0,    std: 3.14   },
    ph:                  { min: 5.99,    mean: 7.02,    max: 7.99,    std: 0.57   },
    EC:                  { min: 1.23,    mean: 2.44,    max: 3.57,    std: 0.73   },
    temperature:         { min: 10.00,   mean: 22.76,   max: 34.88,   std: 7.34   },
    humidity:            { min: 90.00,   mean: 92.17,   max: 95.00,   std: 1.43   },
    weather_temperature: { min: 11.05,   mean: 19.89,   max: 27.92,   std: 5.54   },
    weather_humidity:    { min: 48.48,   mean: 72.02,   max: 95.46,   std: 13.90  },
    light_intensity:     { min: 112.77,  mean: 508.37,  max: 985.92,  std: 256.71 },
    air_pressure:        { min: 980.54,  mean: 1004.52, max: 1028.40, std: 13.68  },
    rainfall:            { min: 0.17,    mean: 17.21,   max: 29.82,   std: 8.88   },
    en_tip: "Orange and citrus prefer slightly alkaline soil. Foliar spray of micronutrients (Zn, Fe, Mn) prevents yellowing.",
    bn_tip: "কমলা সামান্য ক্ষারীয় মাটিতে ভালো জন্মায়। পাতা হলুদ হলে জিংক ও আয়রন স্প্রে করুন।",
  },
  papaya: {
    N:                   { min: 31.0,    mean: 49.88,   max: 70.0,    std: 12.23  },
    P:                   { min: 46.0,    mean: 59.14,   max: 70.0,    std: 7.05   },
    K:                   { min: 45.0,    mean: 50.02,   max: 55.0,    std: 3.11   },
    ph:                  { min: 6.50,    mean: 6.74,    max: 7.00,    std: 0.15   },
    EC:                  { min: 1.21,    mean: 2.41,    max: 3.58,    std: 0.62   },
    temperature:         { min: 23.04,   mean: 33.74,   max: 43.68,   std: 6.31   },
    humidity:            { min: 90.00,   mean: 92.43,   max: 94.87,   std: 1.41   },
    weather_temperature: { min: 11.24,   mean: 19.54,   max: 27.77,   std: 4.69   },
    weather_humidity:    { min: 47.31,   mean: 71.33,   max: 95.83,   std: 14.73  },
    light_intensity:     { min: 110.18,  mean: 544.94,  max: 991.33,  std: 247.10 },
    air_pressure:        { min: 980.49,  mean: 1005.55, max: 1029.62, std: 15.19  },
    rainfall:            { min: 0.34,    mean: 15.50,   max: 29.98,   std: 9.00   },
    en_tip: "Papaya grows fast (fruits in 9–11 months). Very sensitive to waterlogging — raise beds in heavy soil.",
    bn_tip: "পেঁপে দ্রুত বাড়ে — ৯–১১ মাসে ফল আসে। ভারী মাটিতে উঁচু বেড বানান কারণ জলাবদ্ধতায় গাছ মারা যায়।",
  },
  coconut: {
    N:                   { min: 0.0,     mean: 21.97,   max: 40.0,    std: 11.83  },
    P:                   { min: 5.0,     mean: 16.93,   max: 30.0,    std: 8.40   },
    K:                   { min: 25.0,    mean: 30.59,   max: 35.0,    std: 3.03   },
    ph:                  { min: 5.50,    mean: 5.98,    max: 6.50,    std: 0.28   },
    EC:                  { min: 1.26,    mean: 2.53,    max: 3.59,    std: 0.62   },
    temperature:         { min: 25.00,   mean: 27.41,   max: 29.99,   std: 1.44   },
    humidity:            { min: 90.02,   mean: 94.84,   max: 100.00,  std: 2.73   },
    weather_temperature: { min: 11.11,   mean: 19.71,   max: 27.73,   std: 4.76   },
    weather_humidity:    { min: 48.40,   mean: 71.72,   max: 93.91,   std: 12.82  },
    light_intensity:     { min: 109.97,  mean: 564.31,  max: 982.16,  std: 278.39 },
    air_pressure:        { min: 980.09,  mean: 1003.97, max: 1028.00, std: 13.00  },
    rainfall:            { min: 0.09,    mean: 14.33,   max: 30.00,   std: 8.52   },
    en_tip: "Coconut is a heavy potassium consumer. Apply 1–2 kg MOP per tree/year. Mulch the basin.",
    bn_tip: "নারিকেল গাছে বছরে ১–২ কেজি পটাশ সার দিন। গাছের গোড়ায় জৈব মালচ দিলে আর্দ্রতা বজায় থাকে।",
  },
  cotton: {
    N:                   { min: 100.0,   mean: 117.77,  max: 140.0,   std: 11.60  },
    P:                   { min: 35.0,    mean: 46.24,   max: 60.0,    std: 7.41   },
    K:                   { min: 15.0,    mean: 19.56,   max: 25.0,    std: 3.24   },
    ph:                  { min: 5.83,    mean: 6.92,    max: 7.97,    std: 0.60   },
    EC:                  { min: 1.22,    mean: 2.37,    max: 3.59,    std: 0.69   },
    temperature:         { min: 22.00,   mean: 24.00,   max: 26.00,   std: 1.11   },
    humidity:            { min: 75.01,   mean: 79.80,   max: 84.87,   std: 3.11   },
    weather_temperature: { min: 11.21,   mean: 19.54,   max: 27.88,   std: 4.70   },
    weather_humidity:    { min: 47.07,   mean: 72.48,   max: 95.88,   std: 14.89  },
    light_intensity:     { min: 101.98,  mean: 548.80,  max: 991.52,  std: 236.97 },
    air_pressure:        { min: 981.08,  mean: 1006.90, max: 1029.62, std: 15.28  },
    rainfall:            { min: 0.39,    mean: 14.22,   max: 29.78,   std: 8.49   },
    en_tip: "Cotton needs high N. Monitor bollworms closely — use pheromone traps for early detection.",
    bn_tip: "তুলায় প্রচুর নাইট্রোজেন লাগে। বোলওয়ার্ম পোকার জন্য ফেরোমন ফাঁদ ব্যবহার করুন।",
  },
  jute: {
    N:                   { min: 60.0,    mean: 78.40,   max: 100.0,   std: 11.01  },
    P:                   { min: 35.0,    mean: 46.86,   max: 60.0,    std: 7.23   },
    K:                   { min: 35.0,    mean: 39.96,   max: 45.0,    std: 3.28   },
    ph:                  { min: 6.00,    mean: 6.74,    max: 7.49,    std: 0.47   },
    EC:                  { min: 1.24,    mean: 2.49,    max: 3.60,    std: 0.71   },
    temperature:         { min: 23.07,   mean: 25.04,   max: 27.00,   std: 1.15   },
    humidity:            { min: 70.88,   mean: 79.64,   max: 89.88,   std: 5.54   },
    weather_temperature: { min: 11.02,   mean: 18.91,   max: 27.54,   std: 4.93   },
    weather_humidity:    { min: 47.42,   mean: 71.75,   max: 95.77,   std: 14.02  },
    light_intensity:     { min: 109.93,  mean: 519.33,  max: 992.18,  std: 247.70 },
    air_pressure:        { min: 980.41,  mean: 1004.82, max: 1029.60, std: 13.73  },
    rainfall:            { min: 0.08,    mean: 15.58,   max: 29.36,   std: 8.81   },
    en_tip: "Jute thrives in humid Bengal delta soil. Ret jute in clean slow-moving water for quality fibre.",
    bn_tip: "পাট বাংলাদেশের ভেজা পলি মাটিতে সবচেয়ে ভালো হয়। পরিষ্কার ধীর প্রবাহের পানিতে জাক দিন।",
  },
  coffee: {
    N:                   { min: 80.0,    mean: 101.20,  max: 120.0,   std: 12.38  },
    P:                   { min: 15.0,    mean: 28.88,   max: 40.0,    std: 7.21   },
    K:                   { min: 25.0,    mean: 29.94,   max: 35.0,    std: 3.32   },
    ph:                  { min: 6.00,    mean: 6.80,    max: 7.47,    std: 0.40   },
    EC:                  { min: 1.22,    mean: 2.49,    max: 3.59,    std: 0.71   },
    temperature:         { min: 23.05,   mean: 25.56,   max: 27.94,   std: 1.46   },
    humidity:            { min: 50.14,   mean: 58.87,   max: 70.00,   std: 5.92   },
    weather_temperature: { min: 11.04,   mean: 19.37,   max: 27.75,   std: 4.90   },
    weather_humidity:    { min: 49.09,   mean: 71.22,   max: 95.81,   std: 14.00  },
    light_intensity:     { min: 127.26,  mean: 589.02,  max: 988.71,  std: 265.06 },
    air_pressure:        { min: 980.06,  mean: 1005.58, max: 1029.83, std: 14.22  },
    rainfall:            { min: 0.97,    mean: 15.24,   max: 29.66,   std: 9.02   },
    en_tip: "Coffee needs well-drained acidic loam and partial shade. Mulch heavily to retain soil moisture.",
    bn_tip: "কফি সামান্য ছায়া ও অ্যাসিডিক মাটিতে ভালো জন্মায়। মালচ দিয়ে মাটির আর্দ্রতা ধরে রাখুন।",
  },
  "Balsam Apple": {
    N:                   { min: 0.0,     mean: 19.32,   max: 26.5,    std: 8.44   },
    P:                   { min: 0.0,     mean: 48.99,   max: 66.0,    std: 20.07  },
    K:                   { min: 0.0,     mean: 48.61,   max: 65.7,    std: 20.09  },
    ph:                  { min: 0.25,    mean: 2.28,    max: 4.00,    std: 1.17   },
    EC:                  { min: 5.44,    mean: 6.39,    max: 7.32,    std: 0.32   },
    temperature:         { min: 27.31,   mean: 28.24,   max: 31.62,   std: 0.79   },
    humidity:            { min: 0.0,     mean: 30.84,   max: 42.36,   std: 9.30   },
    weather_temperature: { min: 11.02,   mean: 19.78,   max: 27.89,   std: 4.79   },
    weather_humidity:    { min: 47.57,   mean: 71.92,   max: 95.22,   std: 13.90  },
    light_intensity:     { min: 114.43,  mean: 566.52,  max: 999.12,  std: 248.17 },
    air_pressure:        { min: 980.20,  mean: 1004.58, max: 1029.66, std: 13.68  },
    rainfall:            { min: 0.83,    mean: 15.70,   max: 29.53,   std: 8.36   },
    en_tip: "Bitter gourd (karela) is a warm-season vine. Provide trellises for climbing and better fruit exposure.",
    bn_tip: "করলা গরম মৌসুমের লতানো সবজি। মাচায় তুলুন এবং পুরুষ–মহিলা ফুল চিনে পরাগায়ন নিশ্চিত করুন।",
  },
  "Cauliflower": {
    N:                   { min: 0.0,     mean: 0.57,    max: 1.40,    std: 0.59   },
    P:                   { min: 0.0,     mean: 4.33,    max: 7.83,    std: 3.27   },
    K:                   { min: 0.0,     mean: 3.78,    max: 7.12,    std: 3.03   },
    ph:                  { min: 0.25,    mean: 1.91,    max: 4.00,    std: 1.07   },
    EC:                  { min: 5.89,    mean: 6.38,    max: 7.12,    std: 0.30   },
    temperature:         { min: 30.89,   mean: 32.80,   max: 33.89,   std: 0.97   },
    humidity:            { min: 0.0,     mean: 17.31,   max: 24.49,   std: 6.72   },
    weather_temperature: { min: 11.07,   mean: 19.32,   max: 28.04,   std: 4.84   },
    weather_humidity:    { min: 47.88,   mean: 73.16,   max: 95.91,   std: 12.96  },
    light_intensity:     { min: 114.06,  mean: 553.77,  max: 989.51,  std: 254.39 },
    air_pressure:        { min: 980.16,  mean: 1006.31, max: 1029.53, std: 15.09  },
    rainfall:            { min: 0.22,    mean: 14.91,   max: 29.83,   std: 8.29   },
    en_tip: "Cauliflower needs consistent moisture and cool temperatures for curd formation. Tie leaves over curd to blanch.",
    bn_tip: "ফুলকপির কার্ড তৈরিতে ঠান্ডা আবহাওয়া ও নিয়মিত পানি দরকার। পাতা দিয়ে ঢেকে রাখলে ফুলকপি সাদা থাকে।",
  },
  "Chili": {
    N:                   { min: 0.0,     mean: 0.96,    max: 1.53,    std: 0.42   },
    P:                   { min: 0.0,     mean: 6.51,    max: 8.10,    std: 2.08   },
    K:                   { min: 0.0,     mean: 5.81,    max: 7.42,    std: 1.93   },
    ph:                  { min: 0.24,    mean: 2.01,    max: 3.95,    std: 1.08   },
    EC:                  { min: 3.04,    mean: 5.47,    max: 6.20,    std: 0.41   },
    temperature:         { min: 32.00,   mean: 34.61,   max: 35.94,   std: 1.72   },
    humidity:            { min: 6.31,    mean: 20.34,   max: 22.41,   std: 2.29   },
    weather_temperature: { min: 11.29,   mean: 19.22,   max: 27.90,   std: 5.18   },
    weather_humidity:    { min: 47.77,   mean: 72.73,   max: 95.88,   std: 15.37  },
    light_intensity:     { min: 109.29,  mean: 555.42,  max: 990.62,  std: 262.93 },
    air_pressure:        { min: 980.86,  mean: 1004.72, max: 1029.49, std: 14.90  },
    rainfall:            { min: 0.02,    mean: 15.57,   max: 29.82,   std: 9.11   },
    en_tip: "Chili needs warm weather and good drainage. Potassium boosts pungency. Spray potash for bigger fruits.",
    bn_tip: "মরিচ গরম আবহাওয়া ও ঝরঝরে মাটি পছন্দ করে। পটাশ সার দিলে ঝাল ও আকার বাড়ে।",
  },
  "Cucumber": {
    N:                   { min: 0.0,     mean: 3.48,    max: 9.43,    std: 3.89   },
    P:                   { min: 0.0,     mean: 11.43,   max: 26.49,   std: 10.22  },
    K:                   { min: 0.0,     mean: 10.89,   max: 25.90,   std: 10.21  },
    ph:                  { min: 0.24,    mean: 2.00,    max: 4.00,    std: 1.11   },
    EC:                  { min: 5.91,    mean: 6.68,    max: 7.49,    std: 0.50   },
    temperature:         { min: 29.22,   mean: 30.17,   max: 32.17,   std: 0.67   },
    humidity:            { min: 0.0,     mean: 18.50,   max: 26.64,   std: 8.31   },
    weather_temperature: { min: 11.05,   mean: 19.63,   max: 28.03,   std: 5.31   },
    weather_humidity:    { min: 48.23,   mean: 70.91,   max: 95.01,   std: 13.49  },
    light_intensity:     { min: 117.28,  mean: 551.52,  max: 994.15,  std: 237.76 },
    air_pressure:        { min: 980.55,  mean: 1004.38, max: 1029.71, std: 14.12  },
    rainfall:            { min: 0.66,    mean: 13.53,   max: 30.00,   std: 8.34   },
    en_tip: "Cucumber is fast-maturing (55–65 days). Trellis cultivation saves space and reduces disease.",
    bn_tip: "শসা দ্রুত ফলন দেয় (৫৫–৬৫ দিনে)। মাচায় চাষ করলে জায়গা বাঁচে ও রোগবালাই কম হয়।",
  },
};

// ─── Soil health thresholds (Bangla + English) ─────────────────────────────

export const SOIL_GUIDE = `
=== SOIL PARAMETER GUIDE / মাটির পরামিতি গাইড ===

NITROGEN (N) / নাইট্রোজেন:
- Low (<40 kg/ha): Apply 100–150 kg Urea/ha. Use green manure or compost.
  কম হলে: ১০০–১৫০ কেজি ইউরিয়া প্রতি হেক্টর দিন। সবুজ সার বা কম্পোস্ট ব্যবহার করুন।
- Optimal (40–80 kg/ha): Good for most crops. / বেশিরভাগ ফসলের জন্য উপযুক্ত।
- High (>80 kg/ha): Reduce nitrogenous fertilizer. Risk of leaf burn and lodging.
  বেশি হলে: নাইট্রোজেন সার কমান। পাতা পোড়া ও গাছ হেলে পড়ার ঝুঁকি থাকে।

PHOSPHORUS (P) / ফসফরাস:
- Low (<25 kg/ha): Apply TSP or SSP (60–80 kg/ha). Improves root development.
  কম হলে: TSP বা SSP সার প্রয়োগ করুন। শিকড়ের বিকাশে সাহায্য করে।
- Optimal (25–60 kg/ha): Adequate for most crops. / বেশিরভাগ ফসলের জন্য যথেষ্ট।
- High (>60 kg/ha): Skip P fertilizer. Excess P can lock up zinc and iron.
  বেশি হলে: ফসফেট সার দেওয়া বন্ধ রাখুন। জিংক ও আয়রনের ঘাটতি হতে পারে।

POTASSIUM (K) / পটাশিয়াম:
- Low (<20 kg/ha): Apply MOP at 60–100 kg/ha. Essential for fruit quality.
  কম হলে: MOP সার দিন। ফলের মান ও রোগ প্রতিরোধে পটাশ জরুরি।
- Optimal (20–50 kg/ha): Healthy range. / স্বাস্থ্যকর মাত্রা।
- High (>50 kg/ha): Reduce potash. Watch for Mg and Ca antagonism.
  বেশি হলে: পটাশ কমান। ম্যাগনেশিয়াম ও ক্যালসিয়ামের অভাব হতে পারে।

pH / মাটির পিএইচ:
- <5.5 (Acidic / অম্লীয়): Apply lime (CaCO₃) at 2–4 t/ha. Wait 2–4 weeks before planting.
  ১-২ টন চুন প্রয়োগ করুন এবং ২–৪ সপ্তাহ পর চারা লাগান।
- 5.5–7.0 (Ideal / আদর্শ): Best nutrient availability for most crops.
  বেশিরভাগ পুষ্টি উপাদান এই মাত্রায় সঠিকভাবে কাজ করে।
- >7.5 (Alkaline / ক্ষারীয়): Apply sulfur or ammonium sulfate. Manganese and iron become unavailable.
  গন্ধক বা অ্যামোনিয়াম সালফেট দিন। আয়রন ও ম্যাঙ্গানিজ অপ্রাপ্য হয়ে যায়।

EC (Electrical Conductivity / বৈদ্যুতিক পরিবাহিতা):
- <1.0 dS/m: Very low salinity — safe but may indicate low nutrient reserve.
  লবণাক্ততা খুব কম — পুষ্টির মজুদও কম হতে পারে।
- 1.0–3.5 dS/m (Optimal / আদর্শ): Ideal for most crops. / অধিকাংশ ফসলের জন্য ভালো।
- >4.0 dS/m (High salinity / বেশি লবণাক্ত): Leach soil with excess water. Choose salt-tolerant varieties.
  অতিরিক্ত সেচ দিয়ে লবণ ধুয়ে ফেলুন। লবণ-সহিষ্ণু জাত ব্যবহার করুন।
- >7.0 dS/m: Severe — most crops fail. Gypsum application + drainage improvement needed.
  মারাত্মক — বেশিরভাগ ফসল মারা যাবে। জিপসাম ও নিষ্কাশন ব্যবস্থা উন্নত করুন।
`;

// ─── Fertilizer knowledge ──────────────────────────────────────────────────

export const FERTILIZER_GUIDE = `
=== FERTILIZER GUIDE / সার গাইড ===

ORGANIC / জৈব সার:
- Compost (কম্পোস্ট): 5–10 t/ha improves structure, moisture, all nutrients. Best applied 2–3 weeks before planting.
- Vermicompost (ভার্মি কম্পোস্ট): 3–5 t/ha — richer than regular compost. Great for vegetables.
- Green manure (সবুজ সার): Dhaincha (Sesbania) or Sunhemp — incorporate before flowering. Adds 80–120 kg N equivalent.
- Cow dung (গোবর সার): 10 t/ha of well-rotted dung. Never apply fresh dung — burns roots.
  টাটকা গোবর দেওয়া যাবে না — শিকড় পুড়ে যায়।

CHEMICAL (রাসায়নিক সার) — Quick reference:
- Urea (ইউরিয়া): 46% N. Apply in splits (50% basal + 25% at tillering + 25% at panicle initiation for rice).
- TSP (ট্রিপল সুপার ফসফেট): 46% P₂O₅. Apply all at base as P doesn't move in soil.
- MOP (মিউরেট অব পটাশ): 60% K₂O. Split application recommended for sandy soils.
- DAP (ডিএপি): 18% N + 46% P₂O₅. Use as starter fertilizer at sowing/transplanting.
- Ammonium Sulfate (অ্যামোনিয়াম সালফেট): 21% N + 24% S. Good for S-deficient soils.

MICRONUTRIENTS / অণু পুষ্টি:
- Zinc (জিংক): Spray 0.5% ZnSO₄ if leaves show interveinal chlorosis (yellowing between leaf veins).
- Boron (বোরন): Apply 1–2 kg borax/ha if cauliflower hollow stem or sunflower empty seeds occurring.
- Iron (লৌহ): Foliar spray of 1% FeSO₄ for citrus or rice yellowing on alkaline soils.
`;

// ─── Pest & Disease management ─────────────────────────────────────────────

export const PEST_GUIDE = `
=== COMMON PESTS & DISEASES / সাধারণ পোকামাকড় ও রোগ ===

RICE / ধান:
- Blast (ব্লাস্ট রোগ): Grey-green spots → brown diamond lesions. Spray Tricyclazole 75WP.
- Brown Plant Hopper (BPH / বাদামী গাছফড়িং): Yellowing at base (hopperburn). Drain field, spray imidacloprid.
- Stem Borer (কান্ড ছিদ্রকারী): Dead heart / white ear. Spray Chlorpyrifos at early infestation.

VEGETABLES / সবজি:
- White fly (সাদামাছি): Yellow sticky traps + neem oil spray (5 ml/L). Spreads viruses.
- Aphids (জাব পোকা): Soapy water spray or imidacloprid. Heavy infestations = sooty mould.
- Late blight (লেট ব্লাইট): Potato/tomato — brown water-soaked spots. Mancozeb 75WP spray.

FRUIT CROPS / ফল ফসল:
- Mango hopper (আম হপার): Spray Lambda-cyhalothrin at flower emergence.
- Fruit fly (ফলের মাছি): Methyl Eugenol traps. Bag fruits when young.
- Anthracnose (অ্যান্থ্রাকনোজ): Black spots on mango/banana. Copper-based fungicide spray.

GENERAL / সাধারণ:
- Root rot (মূল পচা রোগ): Improve drainage. Apply Trichoderma at 5 kg/ha in soil.
- Damping off (চারা পচা): Use Thiram or Captan seed treatment 2g/kg seed.
- Nematodes (কৃমি): Apply Carbofuran 3G at 25 kg/ha or summer ploughing to expose eggs to sun.
`;

// ─── Irrigation guide ─────────────────────────────────────────────────────

export const IRRIGATION_GUIDE = `
=== IRRIGATION GUIDE / সেচ গাইড ===

Critical / সংকটকালীন পানির চাহিদা:
- Rice (ধান): Keep 5 cm standing water during vegetative; drain 2 weeks before harvest.
- Wheat (গম): 4–6 irrigations — crown root, tillering, jointing, booting, milking, dough.
- Maize (ভুট্টা): Irrigation at tasseling and silking critical. Skip = 40-50% yield loss.
- Vegetables (সবজি): Drip irrigation saves 40–50% water. Water daily in hot summer.
- Fruit trees (ফল গাছ): Basin irrigation. Mulch to reduce evaporation.

Deficit signs / পানি ঘাটতির লক্ষণ:
- Leaf wilting/rolling (পাতা কুঁকড়ানো) = immediate irrigation needed.
- Soil cracking (মাটি ফাটা) = moderate stress — irrigate within 24h for field crops.

Excess water signs / অতিরিক্ত পানির লক্ষণ:
- Yellowing leaves, foul smell at roots, fungal collar rot = drain field immediately.
  পাতা হলুদ, শিকড়ে দুর্গন্ধ, গলা পচা রোগ = দ্রুত পানি নিষ্কাশন করুন।
`;

// ─── Seasonal calendar for Bangladesh / South Asia ─────────────────────────

export const SEASONAL_CALENDAR = `
=== SEASONAL PLANTING CALENDAR (Bangladesh / South Asia) ===
=== মৌসুম ভিত্তিক চাষ পঞ্জিকা (বাংলাদেশ) ===

KHARIF / AMAN (June–November / জ্যৈষ্ঠ–কার্তিক):
  Crops: Rice (aman), Jute, Maize, Mungbean, Blackgram
  ফসল: আমন ধান, পাট, ভুট্টা, মুগ ডাল, মাষকলাই

RABI (November–March / অগ্রহায়ণ–ফাল্গুন):
  Crops: Wheat, Lentil, Chickpea, Mustard, Potato, Cauliflower, Tomato
  ফসল: গম, মসুর, ছোলা, সরিষা, আলু, ফুলকপি, টমেটো

PRE-KHARIF / BORO (February–June / মাঘ–জ্যৈষ্ঠ):
  Crops: Boro Rice, Watermelon, Muskmelon, Cucumber, Chili, Maize
  ফসল: বোরো ধান, তরমুজ, বাঙি, শসা, মরিচ, ভুট্টা

YEAR-ROUND (সারা বছর):
  Papaya, Banana, Coconut, Mango (care), Vegetables in tunnels
  পেঁপে, কলা, নারিকেল, আম পরিচর্যা, টানেলে সবজি
`;

// ─── High-yielding variety guide ──────────────────────────────────────────

export const VARIETY_GUIDE = `
=== HIGH-YIELDING VARIETIES (HYV) / উচ্চ ফলনশীল জাত ===

RICE / ধান — BRRI & BINA releases:
- Boro season: BRRI dhan28 (6.5 t/ha), BRRI dhan29 (7.5 t/ha — most popular), BRRI dhan74 (zinc-enriched), Binadhan-8 (early, 7.0 t/ha), BRRI dhan89 (blast-resistant).
  বোরো: ব্রি ধান২৮, ব্রি ধান২৯ (সবচেয়ে জনপ্রিয়), ব্রি ধান৭৪ (জিংক সমৃদ্ধ), বিনাধান-৮, ব্রি ধান৮৯ (ব্লাস্ট প্রতিরোধী)।
- Aman season: BRRI dhan49 (5.0 t/ha), BRRI dhan52 (submergence-tolerant, Sub1), BRRI dhan87, BRRI dhan93 (saline-tolerant), BRRI dhan79 (haor).
  আমন: ব্রি ধান৪৯, ব্রি ধান৫২ (জলমগ্নতা সহনশীল), ব্রি ধান৯৩ (লবণাক্ততা সহনশীল), ব্রি ধান৭৯ (হাওর)।
- Aus season: BRRI dhan48, Binadhan-19 (60-day upland rice), BRRI dhan56/57 (drought-tolerant upland).
  আউশ: ব্রি ধান৪৮, বিনাধান-১৯ (৬০ দিন, উঁচু জমি), ব্রি ধান৫৬/৫৭ (খরা সহনশীল)।

WHEAT / গম:
- BARI Gom-26 (6.0 t/ha), BARI Gom-33 (heat-tolerant), Prodip (BWMRI-1), Shatabdi.
  বারি গম-২৬, বারি গম-৩৩ (তাপ সহনশীল), প্রদীপ, শতাব্দী।

MAIZE / ভুট্টা:
- NK40 (hybrid), Pioneer 3522, BARI Hybrid Bhutta-9, BARI Bhutta-7 (open-pollinated, 8–10 t/ha).
  NK40, পাইওনিয়ার ৩৫২২, বারি হাইব্রিড ভুট্টা-৯, বারি ভুট্টা-৭।

MUSTARD / সরিষা:
- BARI Sarisha-14 (high yield), BARI Sarisha-17 (high oil %), Tori-7 (short-duration), Agrani.
  বারি সরিষা-১৪, বারি সরিষা-১৭ (বেশি তেল), তোরি-৭ (স্বল্পমেয়াদী), অগ্রণী।

POTATO / আলু:
- Diamant, Cardinal, Granola, Asterix (BADC-approved) — yield 25–40 t/ha. Suitable for north Bangladesh.
  ডায়ামান্ট, কার্ডিনাল, গ্রানোলা, অ্যাস্টারিক্স — ফলন ২৫–৪০ টন/হেক্টর।

TOMATO / টমেটো:
- BARI Tomato-14 (heat-tolerant, summer), Ratan, Manik (hybrid), Roma (processing type).
  বারি টমেটো-১৪ (তাপ সহনশীল), রতন, মানিক (হাইব্রিড), রোমা।

PAPAYA / পেঁপে:
- BARI Papaya-3 (high yield, dioecious), Shahi (hermaphrodite, table quality), Red Lady (hybrid).
  বারি পেঁপে-৩, শাহী (হারমাফ্রোডাইট), রেড লেডি (হাইব্রিড)।

JUTE / পাট:
- BJC 7370, O-9897 (capsularis — white jute), OM-1 (olitorius — tossa jute for better fibre).
  বিজেসি ৭৩৭০, ও-৯৮৯৭ (দেশি পাট), ওএম-১ (তোষা পাট — উন্নত আঁশ)।

LENTIL / মসুর ডাল:
- BARI Masur-6, BARI Masur-7, BARI Masur-8 (high protein, early maturing, 90–100 days).
  বারি মসুর-৬, বারি মসুর-৭, বারি মসুর-৮ (বেশি আমিষ, ৯০–১০০ দিনে পাকে)।

MUNGBEAN / মুগ ডাল:
- BARI Mung-5, BARI Mung-6, Binamoog-8 (short-duration 65 days, 1.5 t/ha).
  বারি মুগ-৫, বারি মুগ-৬, বিনামুগ-৮ (৬৫ দিন, ১.৫ টন/হে)।

BANANA / কলা:
- Amritsagar (local), Sabri (Dwarf Cavendish), BARI Kola-1, Agnishwar (export quality).
  অমৃতসাগর, সবরি, বারি কলা-১, অগ্নিশ্বর।

MANGO / আম:
- Amrapali (high yield, regular bearing), BARI Aam-3 (late variety), Haribhanga (export), Langra, Fazli.
  আম্রপালি (নিয়মিত ফল), বারি আম-৩ (আগাম), হিমসাগর, হাঁড়িভাঙা (রপ্তানিযোগ্য)।
`;

// ─── Post-harvest management ───────────────────────────────────────────────

export const POST_HARVEST_GUIDE = `
=== POST-HARVEST MANAGEMENT / ফসল সংগ্রহ পরবর্তী ব্যবস্থাপনা ===

HARVESTING INDICATORS / পাকার লক্ষণ:
- Rice: 80% grains golden-yellow, 15–18% moisture. Use combine harvester or sickle.
  ধান: ৮০% দানা সোনালী, আর্দ্রতা ১৫–১৮%। কম্বাইন হার্ভেস্টার বা কাস্তে ব্যবহার করুন।
- Wheat: Grains hard, straw golden-yellow, moisture <14%.
  গম: দানা শক্ত, খড় হলুদ, আর্দ্রতা ১৪%-এর নিচে।
- Vegetables: Harvest early morning when cool. Handle gently to avoid bruising.
  সবজি: ঠান্ডা সকালে তুলুন। আঘাত লাগলে পচন শুরু হয়।
- Mango: Color change + fruit detaches slightly from stalk. Float test — ripe fruits sink.
  আম: রং বদলায় + বোঁটা আলগা হয়। পাকা আম পানিতে ডোবে।
- Tomato: Breaker stage for long-distance transport; full red for local market.
  টমেটো: দূরে পাঠাতে হলে ব্রেকার পর্যায়ে তুলুন; কাছে হলে পুরো লাল হলে তুলুন।

STORAGE CONDITIONS / সংরক্ষণ শর্ত:
- Grains (cereals, pulses): Dry to <12–14% moisture. Store in airtight bins or hermetic bags (PICS). Apply Phostoxin tablet (1 tablet/50 kg) for >6-month storage.
  শস্য: ১২–১৪% আর্দ্রতায় শুকিয়ে বায়ুরোধী পাত্র বা হার্মেটিক ব্যাগে রাখুন।
- Potato: Cool dark place 4–10°C, 85–90% RH. NEVER expose to light (greening = solanine toxin).
  আলু: ৪–১০°C অন্ধকারে রাখুন। আলোতে সবুজ হলে বিষাক্ত হয়।
- Onion/Garlic: Cure in field 5–7 days. Store in hanging nets with good airflow, 25–30°C.
  পেঁয়াজ/রসুন: ৫–৭ দিন মাঠে শুকিয়ে ঝুলিয়ে বায়ু চলাচলের স্থানে রাখুন।
- Tomato/Mango/Fruits: 12–15°C is ideal. Do not cool below 10°C — causes chilling injury.
  ফল: ১২–১৫°C রাখুন। ১০°C-এর নিচে ঠান্ডায় ক্ষতি হয়।

GRADING & MARKETING / শ্রেণিবিভাজন ও বিক্রয়:
- Grade A: Uniform size, no blemish — for supermarkets and export.
  গ্রেড এ: সমান আকার, দাগমুক্ত — রপ্তানি ও সুপারশপের জন্য।
- Grade B: Minor defects — for local wholesale market.
  গ্রেড বি: ছোট দাগ — স্থানীয় পাইকারি বাজারের জন্য।
- Grade C: Processing use — ketchup, pickle, dried products.
  গ্রেড সি: শিল্পকারখানায় ব্যবহারের জন্য (কেচাপ, আচার)।
- Collective marketing: Join farmer cooperatives (কৃষক সমিতি) to negotiate better prices.
  কৃষক সমিতির মাধ্যমে একসাথে বিক্রি করলে ভালো দাম পাওয়া যায়।

REDUCING POST-HARVEST LOSSES / ক্ষতি কমানোর উপায়:
- Bangladesh average post-harvest loss: 15–30% for vegetables, 5–10% for grains.
  বাংলাদেশে সবজিতে ১৫–৩০% এবং শস্যে ৫–১০% ফসল নষ্ট হয়।
- Main causes: Poor packaging, no cooling, rough handling.
  কারণ: দুর্বল প্যাকেজিং, ঠান্ডার অভাব, অসতর্ক পরিচালনা।
- Zero Energy Cool Chamber (ZECC): Cheap evaporative cooling using bricks and wet sand. Reduces temperature 10–15°C, extends shelf life 2–3x.
  জিরো এনার্জি কুল চেম্বার: ইট ও স্যাঁতসেঁতে বালু দিয়ে তৈরি সস্তা কুলিং — আয়ু ২–৩ গুণ বাড়ে।
- Use ventilated bamboo crates instead of jute sacks to prevent bruising.
  পাট বস্তার পরিবর্তে বাঁশের ঝুড়িতে সংগ্রহ করুন — আঘাত কম লাগে।
`;

// ─── Crop rotation & intercropping ────────────────────────────────────────

export const CROP_ROTATION_GUIDE = `
=== CROP ROTATION & INTERCROPPING / ফসল পর্যায় ও মিশ্র চাষ ===

RECOMMENDED ROTATIONS FOR BANGLADESH / বাংলাদেশে প্রস্তাবিত ফসল পর্যায়:
1. Boro Rice → Fallow/Mungbean → Aman Rice (ধান-মুগ-ধান):
   Most common. Mungbean in April–June gap fixes N and adds organic matter.
   সবচেয়ে প্রচলিত। মুগ ডাল ফাঁকা সময়ে চাষ দিলে নাইট্রোজেন ও জৈব পদার্থ বাড়ে।

2. Potato → Jute → Aman Rice (আলু-পাট-আমন):
   Oct–Feb / Mar–Jul / Jul–Nov. High-value sequence for flood-plain chars lands.
   অক্টোবর–ফেব্রুয়ারি/মার্চ–জুলাই/জুলাই–নভেম্বর। চর জমিতে লাভজনক ক্রম।

3. Wheat → Summer Vegetables → Aman Rice (গম-সবজি-আমন):
   Nov–Mar / Apr–Jun / Jul–Nov. Good for north-west (Rajshahi, Bogura).
   নভেম্বর–মার্চ / এপ্রিল–জুন / জুলাই–নভেম্বর। উত্তর-পশ্চিমাঞ্চলের জন্য লাভজনক।

4. Mustard → Boro Rice → Aman Rice (সরিষা-বোরো-আমন):
   Oct–Jan / Jan–May / Jul–Nov. Triple-crop system.
   অক্টোবর–জানুয়ারি / জানুয়ারি–মে / জুলাই–নভেম্বর। তিন ফসলি চাষ।

5. Vegetables → Lentil → Aman Rice (সবজি-মসুর-আমন):
   Jan–Apr / Nov–Feb / Jun–Nov. For higher-land areas.
   উঁচু জমিতে উপযুক্ত।

INTERCROPPING COMBINATIONS / মিশ্র চাষের সংমিশ্রণ:
- Maize + Blackgram (ভুট্টা + মাষকলাই): Plant blackgram between maize rows. Fixes N, maximizes space.
- Coconut + Papaya (নারিকেল + পেঁপে): Papaya in coconut gaps during early years (1–3 years).
- Maize + Mungbean + Cucumber: Three-crop summer trellis system.
- Banana + Ginger / Turmeric (কলা + আদা/হলুদ): Ginger under banana canopy — tolerates partial shade.
  কলা বাগানে আদা ও হলুদ রোপণ — আংশিক ছায়া সহনশীল।
- Fruit orchard + Vegetables: Use inter-row space for 3–5 years until canopy closes.
  ফলের বাগানে রোপণের ৩–৫ বছর পর্যন্ত সবজি মিশ্র চাষ করুন।
- Sugarcane + Pulse: Reduce bare soil evaporation; pulse fixes N for sugarcane ratoon.

BENEFITS OF ROTATION / ফসল পর্যায়ের সুবিধা:
- Breaks pest and disease cycles → less pesticide needed.
  পোকামাকড় ও রোগের চক্র ভেঙে যায় — কীটনাশক কম লাগে।
- Pulse crops in rotation fix 50–200 kg N/ha → saves urea cost.
  ডাল ফসল মাটিতে ৫০–২০০ কেজি/হে নাইট্রোজেন যোগ করে।
- Improves soil structure, organic matter, and microbial diversity.
  মাটির গঠন, জৈব পদার্থ ও অণুজীব বিচিত্রতা বাড়ে।
- Reduces weed pressure in subsequent crops.
  পরবর্তী ফসলে আগাছার চাপ কমে।
`;

// ─── Bangladesh soil zones ─────────────────────────────────────────────────

export const SOIL_TYPES_BANGLADESH = `
=== BANGLADESH SOIL ZONES / বাংলাদেশের মাটির অঞ্চল ===

1. GANGES TIDAL FLOODPLAIN / গঙ্গার জোয়ার-ভাটা প্লাবনভূমি:
   Location: Barisal, Khulna, Satkhira, Jessore (coastal south-west).
   Soil: Silty clay loam, high organic matter, seasonally saline.
   Best crops: Rice, jute, betel leaf, coconut, banana, fish-rice systems.
   Problem: Salinity intrusion April–June. Use BRRI dhan67, dhan97 (salt-tolerant).
   লবণাক্ততা: এপ্রিল–জুনে বাড়ে। লবণ সহনশীল ধান জাত চাষ করুন।

2. BRAHMAPUTRA-JAMUNA FLOODPLAIN / যমুনার প্লাবনভূমি:
   Location: Bogura, Sirajganj, Jamalpur, Mymensingh.
   Soil: Sandy loam to loamy sand (char lands), low fertility, drought-prone.
   Best crops: Mungbean, watermelon, sweet potato, maize, jute, groundnut.
   Problem: Riverbank erosion. Use short-duration varieties (60–90 day).
   বালুর চরে দ্রুত পাকে এমন জাত লাগান।

3. HAOR BASIN / হাওর অঞ্চল:
   Location: Sylhet, Sunamganj, Netrokona, Kishoreganj.
   Soil: Deep silty clay, high organic matter, flash-flood prone May–June.
   Best crops: Flash-flood-tolerant aman (BRRI dhan52, dhan79), deep-water rice, taro, water chestnut.
   Problem: Flash floods damage standing crops. Plant late-maturing boro to harvest before floods.
   মে–জুনে আকস্মিক বন্যার আগে বোরো ধান তুলে নিন।

4. BARIND TRACT / বরেন্দ্র ভূমি:
   Location: Rajshahi, Chapainawabganj, Naogaon (north-west highlands).
   Soil: Hard lateritic / murram, reddish, low organic matter, drought-prone.
   Best crops: Wheat, mango, litchi, lentil, mustard, potato, boro rice (with groundwater irrigation).
   Problem: Groundwater depletion — use AWD (Alternate Wet–Dry) for boro rice, saves 25–30% water.
   ভূগর্ভস্থ পানির সাশ্রয়ে AWD পদ্ধতি ব্যবহার করুন।

5. CHITTAGONG HILL TRACTS / পার্বত্য চট্টগ্রাম:
   Location: Rangamati, Khagrachhari, Bandarban.
   Soil: Hilly loam to sandy loam, acidic (pH 4.5–5.5), prone to erosion.
   Best crops: Banana, papaya, ginger, turmeric, pineapple, upland rice, maize, cucumber.
   Problem: Soil erosion on slopes. Use contour bunding, agroforestry, Dhaincha cover crop.
   ঢালে মাটি ক্ষয় রোধে কনট্যুর পদ্ধতিতে চাষ করুন।

6. COASTAL SALINE ZONE / উপকূলীয় লবণাক্ত এলাকা:
   Salinity class: EC 2–8 dS/m (mild to severe).
   Salt-tolerant crops: BRRI dhan47, dhan67, Binasail, BINA dhan8 (aman); coconut, date palm, barley.
   Soil amendment: Apply gypsum (CaSO₄) 2–4 t/ha to displace Na. Improve drainage channels.
   লবণ সংশোধন: জিপসাম ২–৪ টন/হে প্রয়োগ করুন। ড্রেনেজ উন্নত করুন।
`;

// ─── Climate adaptation ────────────────────────────────────────────────────

export const CLIMATE_ADAPTATION_GUIDE = `
=== CLIMATE ADAPTATION / জলবায়ু অভিযোজন ===

FLOOD / বন্যা:
- Short-duration varieties (60–90 day rice) escape early flash floods in haor regions.
  দ্রুত জাত (৬০–৯০ দিনের) হাওর এলাকায় আগাম বন্যার আগেই খরচ উঠে আসে।
- Submergence-tolerant varieties: BRRI dhan52 (Sub1 gene) withstands 2 weeks submerged.
  ব্রি ধান৫২ — Sub1 জিন দিয়ে ২ সপ্তাহ পানির নিচে থেকেও বাঁচে।
- Raised bed cultivation for vegetables prevents root rot during flooding.
  সবজিতে উঁচু বেড বানালে বন্যায় শিকড় পচা থেকে রক্ষা পাওয়া যায়।

DROUGHT / খরা:
- Alternate Wetting and Drying (AWD): Let soil dry 15 cm below surface before re-irrigating. Saves 25–30% water.
  AWD পদ্ধতি: মাটি ১৫ সেমি শুকালে পুনরায় সেচ দিন — ২৫–৩০% পানি সাশ্রয়।
- Drought-tolerant varieties: BRRI dhan56, BRRI dhan57 (upland), Binadhan-7.
  খরা সহনশীল: ব্রি ধান৫৬, ব্রি ধান৫৭, বিনাধান-৭।
- Mulching with rice straw/water hyacinth reduces evapotranspiration 30–40%.
  খড় বা কচুরিপানা দিয়ে মালচিং করলে মাটির আর্দ্রতা ৩০–৪০% বেশি থাকে।
- Deep-rooted legumes (pigeon peas, chickpea) tolerate short dry spells well.
  গভীর শিকড়ের ডাল ফসল (অড়হর, ছোলা) সাময়িক খরা সহ্য করে।

SALINITY / লবণাক্ততা:
- If EC >8 dS/m: Pond freshwater over field surface to leach salts. Then drain.
  EC >৮ হলে মিষ্টি পানি দিয়ে ধুয়ে লবণ কমান, তারপর সরিয়ে দিন।
- Gypsum (CaSO₄) at 2–4 t/ha replaces Na⁺ with Ca²⁺ in saline-sodic soil.
  জিপসাম ২–৪ টন/হে প্রয়োগ করলে সোডিয়াম কমে ক্যালসিয়াম বাড়ে।
- Green manure (Dhaincha — Sesbania bispinosa) improves saline soil organic matter.
  ধইঞ্চা সবুজ সার হিসেবে লবণাক্ত মাটির জৈব পদার্থ বাড়ায়।

HEAT STRESS / তাপ চাপ:
- Spikelet sterility in rice occurs >35°C at flowering. Time planting to avoid peak summer heat.
  ধানের ফুল ফোটার সময় ৩৫°C-এর বেশি তাপে দানা চিটা হয়।
- Use heat-tolerant wheat (BARI Gom-33) for late-planting situations (after Nov 25).
  দেরিতে বোনার ক্ষেত্রে তাপ সহনশীল বারি গম-৩৩ ব্যবহার করুন।
- Evening irrigation creates microclimate cooling (–2–3°C) during heat waves.
  তাপদাহে বিকেলে সেচ দিলে মাঠের তাপ ২–৩°C কমে।
- Shade nets (35–50% shading) protect seedlings and vegetables in May–June.
  ৩৫–৫০% শেড নেট দিয়ে চারা ও সবজি গরম থেকে রক্ষা করুন।

CYCLONE PREPAREDNESS / ঘূর্ণিঝড় প্রস্তুতি:
- Harvest mature crops before cyclone season (Oct–Nov) in coastal areas.
  উপকূলে অক্টোবর–নভেম্বরের আগে পাকা ফসল তুলে রাখুন।
- Windbreak trees (casuarina, palm rows) along field boundaries reduce wind damage.
  মাঠের চারপাশে ঝাউ বা তাল গাছের সারি দিলে ঝড়ের ক্ষতি কমে।
- Tie young banana plants to stakes before cyclone warnings.
  ঘূর্ণিঝড়ের আগে কলা গাছ খুঁটির সাথে বেঁধে রাখুন।
`;

// ─── Organic farming & GAP ─────────────────────────────────────────────────

export const ORGANIC_FARMING_GUIDE = `
=== ORGANIC FARMING & GOOD AGRICULTURAL PRACTICES (GAP) ===
=== জৈব চাষ ও উত্তম কৃষি অনুশীলন ===

ORGANIC CERTIFICATION / জৈব সনদ:
- Certifying bodies: BOAS (Bangladesh Organic Agriculture Society), Control Union, CERES.
- Conversion period: 2–3 years chemical-free before certification.
  সনদ পেতে ২–৩ বছর রাসায়নিক বর্জন করতে হবে।
- Market premium: Organic products fetch 20–50% higher price in urban and export markets.
  জৈব পণ্যে ২০–৫০% বেশি দাম পাওয়া যায়।

KEY ORGANIC PRACTICES / মূল জৈব চাষ পদ্ধতি:
- Compost making (কম্পোস্ট): Layer green material (N-rich) + brown material (C-rich) 1:3 ratio. Turn every 2 weeks. Ready in 6–8 weeks.
  সবুজ ও বাদামি উপাদান ১:৩ অনুপাতে স্তরে রাখুন। ৬–৮ সপ্তাহে তৈরি।
- Vermicompost: Use Eisenia fetida (red wiggler). 1 kg worms processes 1 kg waste/day. 3–5 t/ha for vegetables.
  ভার্মি কম্পোস্ট: ১ কেজি কেঁচো প্রতিদিন ১ কেজি জৈব বর্জ্য খায়।
- Trichoderma harzianum: Apply 5 kg/ha in soil — suppresses root rot, pythium, fusarium.
  ট্রাইকোডার্মা ৫ কেজি/হে মাটিতে দিন — শিকড় পচা রোগ দমন করে।
- Neem oil spray (5 ml/L + 2 ml liquid soap): Controls aphids, whitefly, mites. Bee-safe.
  নিম তেল স্প্রে: জাব পোকা, সাদামাছি, মাইট দমন করে। মৌমাছির জন্য নিরাপদ।
- Yellow sticky traps: For whitefly and aphids. Blue traps for thrips. Change every 7–10 days.
  হলুদ আঠালো ফাঁদ: সাদামাছি ও জাব পোকার জন্য। নীল ফাঁদ থ্রিপসের জন্য।
- Pheromone traps: Fruit fly (methyl eugenol), Spodoptera, Diamond back moth. Species-specific.
  ফেরোমন ফাঁদ: ফলের মাছি, শুঁয়াপোকার জন্য প্রজাতি-নির্দিষ্ট ফাঁদ।
- Dhaincha (Sesbania bispinosa): Grow as green manure; incorporate at 45 days. Adds 80–120 kg N-equivalent/ha.
  ধইঞ্চা ৪৫ দিনে মাটিতে মিশিয়ে দিন। ৮০–১২০ কেজি নাইট্রোজেন সমতুল্য পাওয়া যায়।

GOOD AGRICULTURAL PRACTICES (GAP) / উত্তম কৃষি অনুশীলন:
- Pre-harvest interval (PHI): Observe label PHI — e.g., no pesticide 7–14 days before harvest.
  কীটনাশক শেষ প্রয়োগের পর লেবেল অনুযায়ী নিরাপদ সময় মানুন।
- Calibrate sprayer before use — prevents overdose and waste.
  স্প্রেয়ার ক্যালিব্রেট করুন। অতিরিক্ত কীটনাশক ক্ষতিকর।
- Use PPE (gloves, mask, goggles) during chemical handling.
  রাসায়নিক ব্যবহারে গ্লাভস, মাস্ক ও চশমা পরুন।
- Wash produce in clean potable water. Pack in ventilated plastic crates.
  পরিষ্কার পানিতে সবজি ধুয়ে বায়ুচলাচলযোগ্য ক্রেটে প্যাক করুন।
- Keep pesticide application records (date, product, dose, crop, field).
  কীটনাশক প্রয়োগের রেকর্ড বই রাখুন।
`;

// ─── Government support & schemes ─────────────────────────────────────────

export const GOVERNMENT_SCHEMES_GUIDE = `
=== BANGLADESH GOVT AGRICULTURAL SUPPORT / বাংলাদেশ সরকারের কৃষি সহায়তা ===

SUBSIDY & SUPPORT PROGRAMS / ভর্তুকি ও সহায়তা:
- Fertilizer subsidy (সার ভর্তুকি): Govt subsidizes Urea, TSP, MOP, DAP below market price. Buy with NID card from licensed dealer (ডিলার) or cooperative.
  সার ভর্তুকি: জাতীয় পরিচয়পত্র নিয়ে লাইসেন্সপ্রাপ্ত ডিলারের কাছে সরকারি মূল্যে সার পাওয়া যায়।
- Agricultural credit (কৃষি ঋণ): Bangladesh Krishi Bank (BKB), RAKUB — crop loans at 4–9% interest. Land documents required.
  বাংলাদেশ কৃষি ব্যাংক ও রাকাব থেকে ৪–৯% সুদে ঋণ পাওয়া যায়।
- Crop insurance (ফসল বীমা): Sadharan Bima Corporation — covers boro and aman rice. Premium ~2.5%. Claim for flood/drought damage.
  সাধারণ বীমা কর্পোরেশনের মাধ্যমে ধানের বীমা করুন।
- Stimulus packages: Post-flood/cyclone seed and fertilizer distribution by DAE.
  বন্যা/ঘূর্ণিঝড়ের পরে DAE থেকে বিনামূল্যে বীজ ও সার পাওয়া যেতে পারে।

KEY INSTITUTIONS / মূল প্রতিষ্ঠান:
- BRRI (Bangladesh Rice Research Institute, Gazipur): Rice varieties, cultural practices, seed.
  ব্রি গাজীপুর — ধানের নতুন জাত ও প্রযুক্তি।
- BARI (Bangladesh Agricultural Research Institute, Gazipur): Non-rice crops — wheat, vegetables, fruits, pulses.
  বারি গাজীপুর — অধান ফসলের গবেষণা ও জাত।
- BADC (Bangladesh Agricultural Development Corporation): Certified seed production/distribution.
  বিএডিসি — সার্টিফাইড বীজ উৎপাদন ও বিতরণ।
- DAE (Department of Agricultural Extension): Farm-level advisory and subsidy distribution.
  কৃষি সম্প্রসারণ অধিদফতর — মাঠ পর্যায়ে পরামর্শ ও ভর্তুকি বিতরণ।
- SRDI (Soil Resource Development Institute): Soil fertility maps and soil testing.
  মৃত্তিকা সম্পদ উন্নয়ন ইনস্টিটিউট — মাটির উর্বরতা মানচিত্র ও পরীক্ষা।
- BINAS (Bangladesh Institute of Nuclear Agriculture): Nuclear-derived improved varieties.

HELPLINES / হেল্পলাইন:
- Farmers' helpline (কৃষক হেল্পলাইন): 16123 — free call from any BD mobile, 24/7 agricultural advice.
  ১৬১২৩ — যেকোনো মোবাইল থেকে বিনামূল্যে কল, ২৪/৭ কৃষি পরামর্শ।
- DAE website: www.dae.gov.bd | BRRI: www.brri.gov.bd | BARI: www.bari.gov.bd
`;

// ─── AgriSense platform guide for chatbot ──────────────────────────────────

export const PLATFORM_FEATURES_GUIDE = `
=== AGRISENSE PLATFORM GUIDE / অ্যাগ্রিসেন্স প্ল্যাটফর্ম গাইড ===

AgriSense is a smart agricultural decision-support system for Bangladeshi farmers and agricultural officers.
অ্যাগ্রিসেন্স বাংলাদেশের কৃষক ও কৃষি কর্মকর্তাদের জন্য একটি স্মার্ট কৃষি সহায়তা ব্যবস্থা।

PAGES & FEATURES / পেজ ও বৈশিষ্ট্যসমূহ:

1. CROP RECOMMENDATION — /recommendation:
   - Enter N, P, K, pH, EC manually OR auto-fill from IoT NPK/soil sensor.
   - AI model predicts the best-fit crop for your soil conditions.
   - Shows confidence score for each candidate crop.
   - মাটির তথ্য দিন বা IoT সেন্সর থেকে সরাসরি নিন। AI সেরা ফসল বলে দেবে।

2. REAL-TIME SENSOR DASHBOARD — /realtime:
   - Live NPK sensor readings: Nitrogen, Phosphorus, Potassium, pH, EC, Temperature, Humidity.
   - Auto-refreshes every few seconds. Shows historical trend graph.
   - সেন্সর থেকে সরাসরি মাটির তথ্য দেখুন এবং ট্রেন্ড গ্রাফ বিশ্লেষণ করুন।

3. CROP ANALYSIS — /analysis:
   - Select any of 26 crops → see ideal parameter ranges (soil + weather).
   - Compare mode: live sensor vs ideal ranges with colour-coded match score.
   - Soil parameters (7): N, P, K, pH, EC, Temperature, Humidity — live comparison.
   - Weather parameters (5): Air temperature, Air humidity, Light intensity, Air pressure, Rainfall — ideal reference only.
   - Match score: >80% Excellent · 60–79% Good · 40–59% Fair · <40% Poor.
   - ফসল নির্বাচন করুন → আদর্শ মানের সাথে আপনার মাটির তুলনা দেখুন।

4. MICRO-CLIMATE DASHBOARD — /microclimateDashboard:
   - Environmental sensor data: air temperature, humidity, light intensity, air pressure, rainfall.
   - Helps assess ambient growing conditions around the field.
   - পরিবেশগত তথ্য (আলো, বাতাসের তাপ, চাপ, বৃষ্টি) এক জায়গায় দেখুন।

5. AGRIBOT CHAT — Floating button (bottom-right corner):
   - Bilingual (English + Bangla) AI chatbot for instant agricultural advice.
   - Ask about crop cultivation, soil problems, fertilizer, pests, weather, platform features.
   - ইংরেজি বা বাংলায় যেকোনো কৃষি প্রশ্ন করুন।

6. PROFILE PAGE — /profile:
   - View and manage account details, region, farm profile.

MATCH SCORE INTERPRETATION / ম্যাচ স্কোর বোঝা:
- 80–100% (Excellent): Soil very suitable. Proceed with cultivation.
  ৮০–১০০% (চমৎকার): মাটি উপযুক্ত। চাষ শুরু করুন।
- 60–79% (Good): Minor fertilizer or lime adjustment will improve suitability.
  ৬০–৭৯% (ভালো): সামান্য সার বা চুন দিয়ে উপযুক্ত করা সম্ভব।
- 40–59% (Fair): Significant soil amendment required.
  ৪০–৫৯% (মোটামুটি): মাটি সংশোধন প্রয়োজন।
- <40% (Poor): Consider a different crop for current soil conditions.
  ৪০%-এর নিচে: অন্য ফসল বিবেচনা করুন বা মাটি উন্নত করুন।

SENSOR PARAMETER GUIDE / সেন্সর তথ্যের ব্যাখ্যা:
- N (Nitrogen): mg/kg soil → key for leaf and stem growth. পাতা ও কান্ডের বৃদ্ধিতে।
- P (Phosphorus): mg/kg soil → root development and flowering. শিকড় ও ফুলের জন্য।
- K (Potassium): mg/kg soil → fruit quality and disease resistance. ফলের মান ও রোগ প্রতিরোধে।
- pH: Soil acidity (0–14). 5.5–7.0 ideal for most crops. ৫.৫–৭.০ বেশিরভাগ ফসলের জন্য আদর্শ।
- EC: Electrical conductivity (dS/m) — soil salinity. >4 dS/m problematic for most crops. লবণাক্ততা নির্দেশক।
- Temperature: Soil temperature (°C) at sensor depth. সেন্সর গভীরতায় মাটির তাপমাত্রা।
- Humidity: Relative humidity (%) near sensor. আপেক্ষিক আর্দ্রতা।
`;

// ─── Common Q&A for the chatbot ────────────────────────────────────────────

export const COMMON_QA = `
=== FREQUENTLY ASKED QUESTIONS / সাধারণ জিজ্ঞাসা ===

Q: Where to get soil tested? মাটি পরীক্ষা কোথায় করাব?
A: At the Upazila Agriculture Extension Office (UPAE) or SRDI. AgriSense sensor gives live N, P, K, pH, EC automatically.
   উপজেলা কৃষি অফিস বা SRDI-তে মাটি পরীক্ষা করুন। AgriSense সেন্সরে রিয়েল-টাইম দেখা যায়।

Q: I see rice blast — what to do? ধানে ব্লাস্ট রোগ হলে কী করব?
A: Spray Tricyclazole 75WP (15 ml / 15 L water) or Isoprothiolane. Reduce N fertilizer. Use blast-resistant varieties (BRRI dhan49, BRRI dhan89).
   ট্রাইসাইক্লাজোল ৭৫WP স্প্রে করুন। নাইট্রোজেন কমান। ব্রি ধান৪৯, ব্রি ধান৮৯ চাষ করুন।

Q: Chili plants wilting and dying — why? মরিচ গাছ ঢলে পড়ছে কেন?
A: Likely Phytophthora or Pythium (damping off). Improve drainage. Apply Ridomil Gold (Metalaxyl) or Trichoderma harzianum to soil.
   ফাইটোফথোরা বা পাইথিয়াম ছত্রাকের কারণে হয়। নিষ্কাশন ভালো করুন। রিডোমিল গোল্ড দিন।

Q: How to fix very acidic soil (low pH)? মাটির pH কম — কী করব?
A: Apply agricultural lime (CaCO₃) at 2–4 t/ha. Wait 2–4 weeks before planting.
   ২–৪ টন/হে চুন দিন। ২–৪ সপ্তাহ পরে চাষ করুন।

Q: How to fix very alkaline soil (high pH)? মাটির pH বেশি — কী করব?
A: Apply elemental sulfur or ammonium sulfate. Or use acidifying organic matter (pine leaf compost).
   গন্ধক বা অ্যামোনিয়াম সালফেট দিন।

Q: Which crops does AgriSense recommend? AgriSense কোন কোন ফসলের সুপারিশ দেয়?
A: 26 crops: rice, maize, chickpea, kidneybeans, pigeonpeas, mothbeans, mungbean, blackgram, lentil, pomegranate, banana, mango, grapes, watermelon, muskmelon, apple, orange, papaya, coconut, cotton, jute, coffee, balsam apple (bitter gourd/karela), cauliflower, chili, cucumber.
   ২৬টি ফসল: ধান, ভুট্টা, ছোলা, রাজমা, অড়হর, মথ ডাল, মুগ, মাষকলাই, মসুর, ডালিম, কলা, আম, আঙুর, তরমুজ, বাঙি, আপেল, কমলা, পেঁপে, নারিকেল, তুলা, পাট, কফি, করলা, ফুলকপি, মরিচ, শসা।

Q: Can I use AgriSense without a sensor? সেন্সর ছাড়া সুপারিশ পাওয়া যাবে?
A: Yes. On the Recommendation page, type N, P, K, pH, EC, temperature, humidity values manually.
   হ্যাঁ। Recommendation পেজে ম্যানুয়ালি মান টাইপ করে সুপারিশ পাওয়া যাবে।

Q: What does Match Score mean? ম্যাচ স্কোর মানে কী?
A: It shows how closely your current sensor readings match the ideal range for the selected crop. >80% = excellent; 60–79% = good; <40% = poor (consider another crop).
   আপনার মাটির মান নির্বাচিত ফসলের আদর্শ মানের সাথে কতটুকু মিলছে তা দেখায়।

Q: Soil EC is high — what crops to grow? মাটির EC বেশি — কোন ফসল করব?
A: For EC 4–8 dS/m: BRRI dhan47, BRRI dhan67 (salt-tolerant rice), coconut, date palm, barley. EC >8: first leach salt with irrigation water + apply gypsum.
   লবণাক্ত মাটিতে ব্রি ধান৪৭, ব্রি ধান৬৭, নারিকেল, খেজুর চাষ করুন।

Q: When to apply urea for boro rice? বোরো ধানে ইউরিয়া কখন দেব?
A: Three splits: (1) 10–15 DAT (days after transplant), (2) at tillering, (3) before panicle initiation. Total 180–220 kg/ha.
   তিন ভাগে: রোপণের ১০–১৫ দিন পর, কুশি বের হওয়ার সময়, থোড় আসার আগে। মোট ১৮০–২২০ কেজি/হে।

Q: How to increase mango yield? আমের ফলন বাড়াবো কীভাবে?
A: Stop irrigation Nov–Jan to trigger flowering. Spray Lambda-cyhalothrin at flower emergence (hopper control). Increase K after fruit set.
   নভেম্বর–জানুয়ারিতে সেচ বন্ধ রাখুন। ফুলের সময় হপার পোকার বিরুদ্ধে স্প্রে করুন। ফল ধরার পরে পটাশ বাড়ান।

Q: What is AWD irrigation? AWD সেচ পদ্ধতি কী?
A: Alternate Wet–Dry: irrigate boro rice when a perforated pipe inserted 15 cm shows water level dropped below surface. Saves 25–30% water. No yield loss.
   মাঠে ১৫ সেমি গর্তে পানি না দেখা গেলে সেচ দিন। ২৫–৩০% পানি সাশ্রয়। ফলনে কোনো ক্ষতি নেই।

Q: How to make compost at home? বাড়িতে কম্পোস্ট কীভাবে বানাবো?
A: Layer green (vegetable waste, fresh leaves — nitrogen) + brown (straw, dry leaves — carbon) 1:3 ratio. Keep moist. Turn weekly. Ready in 6–8 weeks.
   সবুজ (সবজির উচ্ছিষ্ট, কাঁচা পাতা) ও বাদামি (খড়, শুকনো পাতা) উপাদান ১:৩ অনুপাতে স্তরে রাখুন। সপ্তাহে একবার উল্টান। ৬–৮ সপ্তাহে তৈরি।
`;

// ─── Assemble full knowledge base string for the system prompt ─────────────

export function buildKnowledgeBase(): string {
  const fmt = (s: ParamStat) => `${s.min}–${s.max} (mean ${s.mean}±${s.std})`;

  const cropList = Object.entries(CROP_IDEAL_DATA)
    .map(([en, d]) => {
      const bn = CROP_NAMES[en]?.bn ?? en;
      return (
        `  • ${en} (${bn}):\n` +
        `    Soil: N=${fmt(d.N)}, P=${fmt(d.P)}, K=${fmt(d.K)}, pH=${fmt(d.ph)}, EC=${fmt(d.EC)} dS/m\n` +
        `    Sensor env: Temp=${fmt(d.temperature)}°C, Humidity=${fmt(d.humidity)}%\n` +
        `    Weather: Temp=${fmt(d.weather_temperature)}°C, Humidity=${fmt(d.weather_humidity)}%, Light=${fmt(d.light_intensity)} lux, Pressure=${fmt(d.air_pressure)} hPa, Rain=${fmt(d.rainfall)} mm\n` +
        `    EN tip: ${d.en_tip}\n` +
        `    BN tip: ${d.bn_tip}`
      );
    })
    .join("\n");

  return `
=== AGRISENSE CROP KNOWLEDGE BASE ===
Platform: AgriSense — Smart Crop Recommendation for Bangladeshi/South Asian Farmers
Supported crops (26 total) with exact ideal parameter statistics (min–max, mean±std from dataset):

${cropList}

${SOIL_GUIDE}
${FERTILIZER_GUIDE}
${PEST_GUIDE}
${IRRIGATION_GUIDE}
${SEASONAL_CALENDAR}
${VARIETY_GUIDE}
${POST_HARVEST_GUIDE}
${CROP_ROTATION_GUIDE}
${SOIL_TYPES_BANGLADESH}
${CLIMATE_ADAPTATION_GUIDE}
${ORGANIC_FARMING_GUIDE}
${GOVERNMENT_SCHEMES_GUIDE}
${PLATFORM_FEATURES_GUIDE}
${COMMON_QA}
`;
}

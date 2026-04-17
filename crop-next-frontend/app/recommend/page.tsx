"use client";

import { useState, useEffect, useRef } from "react";
import ProtectedLayout from "@/components/ProtectedLayout";
import PageHeader from "@/components/PageHeader";
import { API_BASE } from "@/lib/utils";
import { ref, onValue, off, push, set } from "firebase/database";
import { database } from "@/lib/firebase";
import { useAuth } from "@/lib/auth-context";
import { useLanguage } from "@/lib/language-context";
import Image from "next/image";
import {
  Sprout, FlaskConical, Thermometer, CloudSun, Loader2, AlertCircle,
  CheckCircle2, Info, ChevronDown, ChevronUp,
  Radio, WifiOff, Wifi, Zap as ZapIcon,
  BookmarkPlus, BookmarkCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FormValues {
  N:                   string;
  P:                   string;
  K:                   string;
  temperature:         string;
  humidity:            string;
  ph:                  string;
  EC:                  string;
  weather_temperature: string;
  weather_humidity:    string;
  light_intensity:     string;
  air_pressure:        string;
  rainfall:            string;
}

interface CropResult {
  recommended_crop: string;
  confidence:       number;
  model_name:       string;
  input_features:   Record<string, number>;
}

interface IdealParam {
  mean:   number;
  std:    number;
  min:    number;
  max:    number;
  median: number;
}

interface PredictionEntry {
  date: string;
  prediction: string;
  sensorData?: Record<string, unknown>;
}

type LandPredictions = Record<string, PredictionEntry[]>;

const defaultValues: FormValues = {
  N: "", P: "", K: "",
  temperature: "", humidity: "", ph: "", EC: "",
  weather_temperature: "", weather_humidity: "",
  light_intensity: "", air_pressure: "", rainfall: "",
};

const sampleValues: FormValues = {
  N: "90", P: "42", K: "43",
  temperature: "20.88", humidity: "82",
  ph: "6.5", EC: "3.36",
  weather_temperature: "20.31", weather_humidity: "63.72",
  light_intensity: "381.97", air_pressure: "997.77", rainfall: "2.64",
};

const fieldGroups = [
  {
    title: "Soil Nutrients",
    icon:  <FlaskConical size={16} />,
    color: "blue",
    fields: [
      { key: "N",    label: "Nitrogen (N)",    unit: "kg/ha",  placeholder: "0 – 200",  icon: "🧪" },
      { key: "P",    label: "Phosphorus (P)",  unit: "kg/ha",  placeholder: "0 – 200",  icon: "⚗️" },
      { key: "K",    label: "Potassium (K)",   unit: "kg/ha",  placeholder: "0 – 200",  icon: "🔥" },
      { key: "ph",   label: "Soil pH",         unit: "",       placeholder: "0 – 14",   icon: "🔬" },
      { key: "EC",   label: "EC",              unit: "dS/m",   placeholder: "0 – 10",   icon: "⚡" },
    ],
  },
  {
    title: "Soil Environment",
    icon:  <Thermometer size={16} />,
    color: "green",
    fields: [
      { key: "temperature", label: "Temperature",  unit: "°C", placeholder: "-10 – 50",  icon: "🌡️" },
      { key: "humidity",    label: "Humidity",     unit: "%",  placeholder: "0 – 100",   icon: "💧" },
    ],
  },
  {
    title: "Weather Data",
    icon:  <CloudSun size={16} />,
    color: "amber",
    fields: [
      { key: "weather_temperature", label: "Air Temperature",  unit: "°C", placeholder: "-10 – 50",    icon: "🌡️" },
      { key: "weather_humidity",    label: "Air Humidity",     unit: "%",  placeholder: "0 – 100",     icon: "💧" },
      { key: "light_intensity",     label: "Light Intensity",  unit: "lux",placeholder: "0 – 2000",    icon: "☀️" },
      { key: "air_pressure",        label: "Air Pressure",     unit: "hPa",placeholder: "900 – 1100",  icon: "💨" },
      { key: "rainfall",            label: "Rainfall",         unit: "mm", placeholder: "0 – 500",     icon: "🌧️" },
    ],
  },
];

const cropEmoji: Record<string, string> = {
  rice: "🌾", maize: "🌽", chickpea: "🫘", kidneybeans: "🫘", pigeonpeas: "🌿",
  mothbeans: "🌿", mungbean: "🌱", blackgram: "🫘", lentil: "🫘",
  pomegranate: "🍎", banana: "🍌", mango: "🥭", grapes: "🍇",
  watermelon: "🍉", muskmelon: "🍈", apple: "🍎", orange: "🍊",
  papaya: "🍑", coconut: "🥥", cotton: "🌸", jute: "🌿", coffee: "☕",
};

interface SoilReading {
  nitrogen?:     number;
  phosphorus?:   number;
  potassium?:    number;
  temperature?:  number;
  humidity?:     number;
  ph?:           number;
  conductivity?: number;
  timestamp?:    number;
}

export default function RecommendPage() {
  const { user } = useAuth();
  const { language } = useLanguage();
  const isBangla = language === "bn";
  const [form,    setForm]    = useState<FormValues>(defaultValues);
  const [result,  setResult]  = useState<CropResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);
  const [idealData, setIdealData] = useState<Record<string, IdealParam> | null>(null);
  const [ideaLoading, setIdealLoading] = useState(false);
  const [showIdeal, setShowIdeal] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  // Live sensor state
  const [liveSoil,      setLiveSoil]      = useState<SoilReading | null>(null);
  const [sensorOnline,  setSensorOnline]  = useState(false);
  const [sensorLoaded,  setSensorLoaded]  = useState(false);
  const [sensorLoadedAt, setSensorLoadedAt] = useState<Date | null>(null);
  const [autoPredict,   setAutoPredict]   = useState(false);
  const submitRef = useRef<HTMLButtonElement>(null);
  const pageDescription = isBangla
    ? "মাটি ও আবহাওয়ার প্যারামিটার দিন, AI-চালিত ফসলের পরামর্শ নিন"
    : "Enter soil and weather parameters to get an AI-powered crop suggestion";

  // Subscribe to Firebase sensor data
  useEffect(() => {
    const curRef = ref(database, "npkSensor/current");
    const unsub  = onValue(curRef, (snap) => {
      const data = snap.val() as SoilReading | null;
      if (data) { setLiveSoil(data); setSensorOnline(true); }
      else        { setSensorOnline(false); }
    }, () => setSensorOnline(false));
    return () => { off(curRef); unsub(); };
  }, []);

  // Fill form from live sensor data + optional auto-predict
  const loadFromSensor = (andPredict = false) => {
    if (!liveSoil) return;
    const filled: FormValues = {
      N:                   (liveSoil.nitrogen    ?? "").toString(),
      P:                   (liveSoil.phosphorus  ?? "").toString(),
      K:                   (liveSoil.potassium   ?? "").toString(),
      temperature:         (liveSoil.temperature ?? "").toString(),
      humidity:            (liveSoil.humidity    ?? "").toString(),
      ph:                  (liveSoil.ph          ?? "").toString(),
      EC:                  (liveSoil.conductivity?? "").toString(),
      // Weather fields stay as-is unless they were empty
      weather_temperature: form.weather_temperature || (liveSoil.temperature ?? "").toString(),
      weather_humidity:    form.weather_humidity    || (liveSoil.humidity    ?? "").toString(),
      light_intensity:     form.light_intensity     || "",
      air_pressure:        form.air_pressure        || "",
      rainfall:            form.rainfall            || "",
    };
    setForm(filled);
    setSensorLoaded(true);
    setSensorLoadedAt(new Date());
    setResult(null);
    setError(null);
    if (andPredict) {
      // Trigger submit after state settles
      setTimeout(() => submitRef.current?.click(), 80);
    }
  };

  const setValue = (key: string, val: string) =>
    setForm((prev) => ({ ...prev, [key]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    setIdealData(null);
    setShowIdeal(false);

    // Validate all fields are numeric
    for (const key of Object.keys(form) as (keyof FormValues)[]) {
      if (form[key] === "" || isNaN(Number(form[key]))) {
        setError(`Please fill in a valid number for "${key}".`);
        setLoading(false);
        return;
      }
    }

    try {
      const payload = Object.fromEntries(
        Object.entries(form).map(([k, v]) => [k, parseFloat(v)])
      );

      const res = await fetch(`${API_BASE}/predict`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || `Server error: ${res.status}`);
      }

      const data: CropResult = await res.json();
      setResult(data);
      setSaveStatus("idle");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Prediction failed";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const loadIdealParams = async (cropName: string) => {
    setIdealLoading(true);
    try {
      const res = await fetch(`${API_BASE}/ideal-parameters/${encodeURIComponent(cropName)}`);
      if (!res.ok) throw new Error("Could not load ideal parameters");
      const data = await res.json();
      setIdealData(data.parameters);
      setShowIdeal(true);
    } catch {
      // silently fail
    } finally {
      setIdealLoading(false);
    }
  };

  const savePrediction = async () => {
    if (!result || !user) return;
    setSaveStatus("saving");

    const localEntry: PredictionEntry = {
      date: new Date().toLocaleString(),
      prediction: `${result.recommended_crop} (${Math.round(result.confidence * 100)}%)`,
      sensorData: result.input_features,
    };

    const storageKey = `predictions_${user.uid}`;

    try {
      const currentPredictions: LandPredictions = JSON.parse(localStorage.getItem(storageKey) ?? "{}") || {};
      const landName = "Saved Recommendations";
      const updatedPredictions: LandPredictions = {
        ...currentPredictions,
        [landName]: [...(currentPredictions[landName] ?? []), localEntry],
      };
      localStorage.setItem(storageKey, JSON.stringify(updatedPredictions));

      try {
        const predRef = push(ref(database, `users/${user.uid}/predictions`));
        await set(predRef, {
          crop:       result.recommended_crop,
          confidence: result.confidence,
          model:      result.model_name,
          inputs:     result.input_features,
          savedAt:    Date.now(),
        });
      } catch (err) {
        console.error("Firebase prediction sync failed:", err);
      }

      setSaveStatus("saved");
    } catch (err) {
      console.error("Local prediction save failed:", err);
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 3000);
    }
  };

  const fillSample = () => setForm(sampleValues);
  const clearForm  = () => {
    setForm(defaultValues);
    setResult(null);
    setError(null);
    setIdealData(null);
    setSensorLoaded(false);
    setSaveStatus("idle");
  };

  const confidencePct  = result ? Math.round(result.confidence * 100) : 0;
  const cropKey        = result?.recommended_crop?.toLowerCase() ?? "";
  const emoji          = cropEmoji[cropKey] ?? "🌱";
  // Image filenames exactly match lowercase crop names
  const CROPS_WITH_IMG = [
    "apple","banana","blackgram","chickpea","coconut","coffee","cotton",
    "grapes","jute","kidneybeans","lentil","maize","mango","mothbeans",
    "mungbean","muskmelon","orange","papaya","pigeonpeas","pomegranate",
    "rice","watermelon",
  ];
  const cropImgSrc = cropKey && CROPS_WITH_IMG.includes(cropKey)
    ? `/cropImages/${cropKey}.jpg`
    : null;

  return (
    <ProtectedLayout>
      <PageHeader
        title={isBangla ? "ফসলের পরামর্শ" : "Crop Recommendation"}
        description={pageDescription}
        badge={isBangla ? "AI-চালিত" : "AI Powered"}
      />

      <div className="grid lg:grid-cols-5 gap-6">
        {/* === INPUT FORM === */}
        <div className="lg:col-span-3">

          {/* ── Live sensor banner ── */}
          <div className={cn(
            "rounded-2xl border px-5 py-4 mb-4 flex flex-col sm:flex-row sm:items-center gap-3 transition-all",
            sensorOnline
              ? "bg-emerald-50 border-emerald-200"
              : "bg-gray-50 border-gray-200"
          )}>
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className={cn(
                "w-9 h-9 rounded-xl flex items-center justify-center shrink-0",
                sensorOnline ? "bg-emerald-100" : "bg-gray-100"
              )}>
                {sensorOnline
                  ? <Wifi size={17} className="text-emerald-600" />
                  : <WifiOff size={17} className="text-gray-400" />}
              </div>
              <div className="min-w-0">
                <p className={cn("text-sm font-semibold", sensorOnline ? "text-emerald-800" : "text-gray-600")}>
                  {sensorOnline ? (isBangla ? "লাইভ সেন্সর যুক্ত" : "Live Sensor Connected") : (isBangla ? "সেন্সর সিগন্যাল নেই" : "No Sensor Signal")}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {sensorOnline
                    ? sensorLoadedAt
                      ? `${isBangla ? "শেষ লোড:" : "Last loaded:"} ${sensorLoadedAt.toLocaleTimeString()}`
                      : isBangla ? "সেন্সর থেকে মাটির মান স্বয়ংক্রিয়ভাবে নিন" : "Tap to auto-fill soil parameters"
                    : isBangla ? "আপনার ESP8266 ডিভাইসটি Firebase-এ সংযুক্ত করুন" : "Connect your ESP8266 device to Firebase"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {/* Auto-predict toggle */}
              {sensorOnline && (
                <button
                  type="button"
                  onClick={() => setAutoPredict(!autoPredict)}
                  className={cn(
                    "flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border font-medium transition-all",
                    autoPredict
                      ? "bg-purple-100 border-purple-300 text-purple-700"
                      : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50"
                  )}
                  title={isBangla ? "চালু থাকলে সেন্সর ডেটা লোড হলেই সঙ্গে সঙ্গে পূর্বাভাস দেবে" : "When enabled, loading sensor data will immediately trigger prediction"}
                >
                  <ZapIcon size={12} />
                  {isBangla ? "অটো-পূর্বাভাস" : "Auto-predict"} {autoPredict ? (isBangla ? "চালু" : "ON") : (isBangla ? "বন্ধ" : "OFF")}
                </button>
              )}

              <button
                type="button"
                disabled={!sensorOnline}
                onClick={() => loadFromSensor(autoPredict)}
                className={cn(
                  "flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg border font-medium transition-all",
                  sensorOnline
                    ? "bg-emerald-600 border-emerald-700 text-white hover:bg-emerald-700 shadow-sm"
                    : "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
                )}
                title={
                  sensorOnline
                    ? sensorLoadedAt
                      ? `${isBangla ? "শেষ লোড:" : "Last loaded:"} ${sensorLoadedAt.toLocaleTimeString()}`
                      : isBangla ? "সেন্সর থেকে মাটির মান স্বয়ংক্রিয়ভাবে নিন" : "Tap to auto-fill soil parameters"
                    : isBangla ? "আপনার ESP8266 ডিভাইসটি Firebase-এ সংযুক্ত করুন" : "Connect your ESP8266 device to Firebase"
                }
              >
                <Radio size={12} />
                {isBangla ? "সেন্সর থেকে নিন" : "Load from Sensor"}
              </button>
            </div>
          </div>

          {/* Filled-from-sensor badge */}
          {sensorLoaded && (
            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2.5 mb-4 animate-fade-in">
              <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
              <p className="text-xs text-emerald-800 font-medium">
                {isBangla
                  ? "লাইভ সেন্সর থেকে মাটির ফিল্ডগুলো পূরণ হয়েছে — নিচের আবহাওয়ার ফিল্ডগুলো দেখে নিন, তারপর পূর্বাভাস দিন।"
                  : "Soil fields auto-filled from live sensor — review weather fields below, then predict."}
              </p>
              <button onClick={clearForm} className="ml-auto text-xs text-emerald-600 hover:underline">
                {isBangla ? "মুছুন" : "Clear"}
              </button>
            </div>
          )}

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-bold text-gray-900 flex items-center gap-2">
                <FlaskConical size={18} className="text-blue-500" />
                {isBangla ? "ইনপুট প্যারামিটার" : "Input Parameters"}
              </h2>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={fillSample}
                  className="text-xs text-blue-600 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-lg font-medium hover:bg-blue-100 transition-all"
                >
                  {isBangla ? "নমুনা লোড" : "Load Sample"}
                </button>
                <button
                  type="button"
                  onClick={clearForm}
                  className="text-xs text-gray-500 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg font-medium hover:bg-gray-100 transition-all"
                >
                  {isBangla ? "মুছুন" : "Clear"}
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-7">
              {fieldGroups.map(({ title, icon, color, fields }) => (
                <div key={title}>
                  <div className={`flex items-center gap-2 text-sm font-semibold text-${color}-700 mb-3`}>
                    {icon}
                    {title}
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {fields.map(({ key, label, unit, placeholder, icon: ico }) => (
                      <div key={key} className="relative">
                        <label className="block text-xs font-medium text-gray-500 mb-1.5">
                          {ico} {label}
                          {unit && <span className="text-gray-400 ml-1">({unit})</span>}
                        </label>
                        <input
                          type="number"
                          step="any"
                          value={form[key as keyof FormValues]}
                          onChange={(e) => setValue(key, e.target.value)}
                          placeholder={placeholder}
                          className={cn(
                            "w-full px-3 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all",
                            sensorLoaded &&
                            ["N","P","K","ph","EC","temperature","humidity"].includes(key) &&
                            form[key as keyof FormValues] !== ""
                              ? "bg-emerald-50 border-emerald-300 text-emerald-900"
                              : "bg-gray-50 border-gray-200 focus:bg-white"
                          )}
                          required
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {error && (
                <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                  <AlertCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <button
                ref={submitRef}
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2.5 py-3.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl shadow-md hover:shadow-green-200 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed transition-all active:scale-[0.99] text-sm"
              >
                {loading ? (
                    <><Loader2 size={18} className="animate-spin" /> {isBangla ? "বিশ্লেষণ করা হচ্ছে…" : "Analyzing…"}</>
                ) : sensorLoaded ? (
                    <><Radio size={18} /> {isBangla ? "সেন্সর ডেটা থেকে পূর্বাভাস" : "Predict from Sensor Data"}</>
                ) : (
                    <><Sprout size={18} /> {isBangla ? "পরামর্শ নিন" : "Get Recommendation"}</>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* === RESULT PANEL === */}
        <div className="lg:col-span-2 space-y-4">
          {/* Result card */}
          {result ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-slide-up">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-5 text-white">
                <div className="flex items-center gap-2 text-green-100 text-xs font-medium mb-3">
                  <CheckCircle2 size={14} />
                  {isBangla ? "পরামর্শ প্রস্তুত" : "Recommendation ready"}
                </div>
                {cropImgSrc ? (
                  <div className="relative w-full h-44 rounded-xl overflow-hidden mb-3 shadow-md">
                    <Image
                      src={cropImgSrc}
                      alt={result.recommended_crop}
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                ) : (
                  <div className="text-6xl mb-2">{emoji}</div>
                )}
                <h3 className="text-3xl font-bold capitalize mb-1">
                  {result.recommended_crop}
                </h3>
                <p className="text-green-100 text-sm">{isBangla ? "আপনার অবস্থার জন্য সবচেয়ে উপযোগী ফসল" : "Best suited crop for your conditions"}</p>
              </div>

              <div className="p-6">
                {/* Confidence bar */}
                <div className="mb-5">
                  <div className="flex justify-between mb-2">
                    <span className="text-xs text-gray-500 font-medium">{isBangla ? "মডেলের আত্মবিশ্বাস" : "Model Confidence"}</span>
                    <span className="text-xs font-bold text-gray-900">{confidencePct}%</span>
                  </div>
                  <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-700",
                        confidencePct >= 80 ? "bg-green-500" : confidencePct >= 50 ? "bg-yellow-400" : "bg-red-400"
                      )}
                      style={{ width: `${confidencePct}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1.5">
                    Model: {result.model_name}
                  </p>
                </div>

                {/* Save prediction button */}
                <button
                  onClick={savePrediction}
                  disabled={saveStatus === "saving" || saveStatus === "saved"}
                  className={cn(
                    "w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all mb-3",
                    saveStatus === "saved"
                      ? "bg-emerald-100 border border-emerald-300 text-emerald-700 cursor-default"
                      : saveStatus === "error"
                      ? "bg-red-50 border border-red-200 text-red-600"
                      : "bg-green-600 hover:bg-green-700 text-white shadow-sm"
                  )}
                >
                  {saveStatus === "saving" ? (
                    <><Loader2 size={15} className="animate-spin" /> {isBangla ? "সংরক্ষণ করা হচ্ছে…" : "Saving…"}</>
                  ) : saveStatus === "saved" ? (
                    <><BookmarkCheck size={15} /> {isBangla ? "পূর্বাভাস সংরক্ষিত" : "Prediction Saved"}</>
                  ) : saveStatus === "error" ? (
                    <><AlertCircle size={15} /> {isBangla ? "সংরক্ষণ ব্যর্থ — আবার চেষ্টা করুন" : "Save Failed — Retry"}</>
                  ) : (
                    <><BookmarkPlus size={15} /> {isBangla ? "পূর্বাভাস সংরক্ষণ" : "Save Prediction"}</>
                  )}
                </button>

                {/* Ideal params button */}
                <button
                  onClick={() => {
                    if (showIdeal) { setShowIdeal(false); return; }
                    if (!idealData) loadIdealParams(result.recommended_crop);
                    else setShowIdeal(true);
                  }}
                  className="w-full flex items-center justify-between px-4 py-3 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm font-medium hover:bg-green-100 transition-all"
                >
                  <span className="flex items-center gap-2">
                    <Info size={14} />
                    {ideaLoading ? (isBangla ? "আদর্শ অবস্থা লোড হচ্ছে…" : "Loading ideal conditions…") : (isBangla ? "আদর্শ মাটির অবস্থা দেখুন" : "View Ideal Soil Conditions")}
                  </span>
                  {ideaLoading
                    ? <Loader2 size={14} className="animate-spin" />
                    : showIdeal ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                  }
                </button>

                {/* Ideal params table */}
                {showIdeal && idealData && (
                  <div className="mt-4 animate-fade-in">
                    <div className="overflow-x-auto rounded-xl border border-gray-100">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="bg-gray-50 border-b border-gray-100">
                            <th className="text-left px-3 py-2.5 font-semibold text-gray-500">{isBangla ? "প্যারামিটার" : "Parameter"}</th>
                            <th className="text-right px-3 py-2.5 font-semibold text-gray-500">{isBangla ? "গড়" : "Mean"}</th>
                            <th className="text-right px-3 py-2.5 font-semibold text-gray-500">{isBangla ? "পরিসীমা" : "Range"}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.entries(idealData).map(([param, vals]) => (
                            <tr key={param} className="border-b border-gray-50">
                              <td className="px-3 py-2.5 font-medium text-gray-700 capitalize">{param}</td>
                              <td className="px-3 py-2.5 text-right text-gray-800 font-semibold">
                                {vals.mean.toFixed(2)}
                              </td>
                              <td className="px-3 py-2.5 text-right text-gray-500">
                                {vals.min.toFixed(1)}–{vals.max.toFixed(1)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Placeholder */
            <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-8 text-center">
              <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Sprout size={28} className="text-green-400" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{isBangla ? "বিশ্লেষণের জন্য প্রস্তুত" : "Ready to analyze"}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                {isBangla
                  ? "মাটি ও আবহাওয়ার প্যারামিটার পূরণ করুন, তারপর পরামর্শ নিন ক্লিক করে AI-চালিত ফসলের পরামর্শ দেখুন।"
                  : "Fill in soil and weather parameters, then click Get Recommendation to see your AI-powered crop suggestion."}
              </p>
              <button
                onClick={fillSample}
                className="mt-4 text-xs text-green-600 bg-green-50 border border-green-200 px-4 py-2 rounded-lg font-medium hover:bg-green-100 transition-all"
              >
                {isBangla ? "নমুনা ডেটা দিয়ে চেষ্টা করুন" : "Try with sample data"}
              </button>
            </div>
          )}

          {/* Tips card */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-100 p-5">
              <h4 className="font-semibold text-amber-900 text-sm mb-3 flex items-center gap-2">
              <span>💡</span> {isBangla ? "নির্ভুলতার জন্য পরামর্শ" : "Tips for accuracy"}
            </h4>
            <ul className="space-y-2">
              {[
                isBangla ? "আপনার আসল ফিল্ডের NPK সেন্সর রিডিং ব্যবহার করুন" : "Use NPK sensor readings from your actual field",
                isBangla ? "বিভিন্ন স্থান থেকে মাটির নমুনা নিন" : "Take soil samples from multiple spots",
                isBangla ? "আবহাওয়ার ডেটা বর্তমান অবস্থা প্রতিফলিত করতে হবে" : "Weather data should reflect current conditions",
                isBangla ? "EC dS/cm-এ মাপুন (µS/cm নয়)" : "EC measured in dS/cm (not µS/cm)",
              ].map((tip) => (
                <li key={tip} className="flex items-start gap-2 text-xs text-amber-800">
                  <CheckCircle2 size={12} className="text-amber-500 shrink-0 mt-0.5" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </ProtectedLayout>
  );
}

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ref, onValue, off } from "firebase/database";
import { database, pickLatestHistoryEntry } from "@/lib/firebase";
import ProtectedLayout from "@/components/ProtectedLayout";
import StatCard from "@/components/StatCard";
import PageHeader from "@/components/PageHeader";
import { getStatusColor, formatNumber } from "@/lib/utils";
import { useLanguage } from "@/lib/language-context";
import { FlaskConical, Thermometer, Droplets, Zap, RefreshCw, Clock } from "lucide-react";

interface SoilReading {
  nitrogen?:     number;
  phosphorus?:   number;
  potassium?:    number;
  temperature?:  number;
  humidity?:     number;
  ph?:           number;
  conductivity?: number;
  timestamp?:    number;
  id?:           number;
}

function formatTime(ts: number | undefined): string {
  if (!ts) return "—";
  return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

export default function SoilPage() {
  const { language } = useLanguage();
  const isBangla = language === "bn";
  const [current,  setCurrent]  = useState<SoilReading | null>(null);
  const [history,  setHistory]  = useState<SoilReading[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState<string | null>(null);
  const [lastSeen, setLastSeen] = useState<Date | null>(null);
  const latestReadingRef = useRef<SoilReading | null>(null);
  const pageDescription = isBangla
    ? "আপনার ফিল্ড সেন্সর থেকে রিয়েলটাইম NPK, pH, EC এবং পরিবেশগত ডেটা"
    : "Real-time NPK, pH, EC and environmental readings from your field sensor";

  const commitReading = useCallback((data: SoilReading | null) => {
    if (!data) {
      setError(isBangla ? "কোনো সেন্সর ডেটা পাওয়া যায়নি। ESP8266 ডিভাইসটি পরীক্ষা করুন।" : "No sensor data found. Check your ESP8266 device.");
      setLoading(false);
      return;
    }

    latestReadingRef.current = data;
    setCurrent(data);
    setLastSeen(new Date(data.timestamp || Date.now()));
    setError(null);
    setHistory((prev) => {
      const entry = { ...data, id: Date.now() };
      return [entry, ...prev].slice(0, 10);
    });
    setLoading(false);
  }, []);

  useEffect(() => {
    const curRef = ref(database, "soil_data/history");

    const unsub = onValue(curRef, (snap) => {
      const history = snap.val() as Record<string, SoilReading> | null;
      commitReading(pickLatestHistoryEntry(history));
    }, (err) => {
      console.error(err);
      setError(isBangla ? "Firebase সংযোগে সমস্যা হয়েছে।" : "Firebase connection error.");
      setLoading(false);
    });

    return () => { off(curRef); unsub(); };
  }, []);

  const params = [
    { key: "nitrogen",    label: isBangla ? "নাইট্রোজেন (N)" : "Nitrogen (N)",       unit: "mg/kg", icon: <FlaskConical size={20} />, value: current?.nitrogen },
    { key: "phosphorus",  label: isBangla ? "ফসফরাস (P)" : "Phosphorus (P)",     unit: "mg/kg", icon: <span className="text-lg">⚗️</span>, value: current?.phosphorus },
    { key: "potassium",   label: isBangla ? "পটাশিয়াম (K)" : "Potassium (K)",      unit: "mg/kg", icon: <span className="text-lg">🔥</span>, value: current?.potassium },
    { key: "ph",          label: "pH",                 unit: "",      icon: <span className="text-lg">🔬</span>, value: current?.ph },
    { key: "EC",          label: isBangla ? "EC (পরিবাহিতা)" : "EC (Conductivity)",  unit: "mS/cm", icon: <Zap size={20} />,           value: current?.conductivity },
    { key: "temperature", label: isBangla ? "তাপমাত্রা" : "Temperature",        unit: "°C",    icon: <Thermometer size={20} />,   value: current?.temperature },
    { key: "humidity",    label: isBangla ? "আর্দ্রতা" : "Humidity",           unit: "%",     icon: <Droplets size={20} />,      value: current?.humidity },
  ];

  const historyKeys = ["nitrogen", "phosphorus", "potassium", "ph", "conductivity", "temperature", "humidity"];

  return (
    <ProtectedLayout>
      <PageHeader
        title={isBangla ? "মাটির প্যারামিটার" : "Soil Parameters"}
        description={pageDescription}
        badge={isBangla ? "লাইভ Firebase" : "Live Firebase"}
        action={
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock size={14} />
            <span>{isBangla ? "শেষ আপডেট:" : "Last update:"} {lastSeen ? lastSeen.toLocaleTimeString() : "—"}</span>
          </div>
        }
      />

      {loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      )}

      {error && !loading && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl px-6 py-6 mb-8 flex items-start gap-4">
          <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
            <span className="text-xl">⚠️</span>
          </div>
          <div>
            <p className="font-semibold text-amber-900 text-sm">{error}</p>
            <p className="text-amber-700 text-xs mt-1">
              {isBangla ? "ডিভাইস অনলাইনে এলে ডেটা স্বয়ংক্রিয়ভাবে দেখা যাবে।" : "Data will appear automatically once the device comes online."}
            </p>
          </div>
        </div>
      )}

      {!loading && (
        <>
          {/* Live stat cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
            {params.map(({ key, label, unit, icon, value }) => (
              <StatCard
                key={key}
                label={label}
                value={value != null ? formatNumber(value) : "—"}
                unit={unit}
                icon={icon}
                status={value != null ? getStatusColor(key, value) : "neutral"}
              />
            ))}
          </div>

          {/* Optimal ranges reference */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8">
            <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wide">{isBangla ? "আদর্শ পরিসীমা" : "Optimal Ranges Reference"}</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { label: isBangla ? "নাইট্রোজেন" : "Nitrogen",    range: "> 0 mg/kg",   color: "green" },
                { label: isBangla ? "ফসফরাস" : "Phosphorus",  range: "> 0 mg/kg",   color: "green" },
                { label: isBangla ? "পটাশিয়াম" : "Potassium",   range: "> 0 mg/kg",   color: "green" },
                { label: "pH",          range: "6.0 – 7.5",   color: "blue" },
                { label: "EC",          range: "0.5 – 2.5 mS/cm", color: "purple" },
                { label: isBangla ? "তাপমাত্রা" : "Temperature", range: "20°C – 35°C", color: "orange" },
                { label: isBangla ? "আর্দ্রতা" : "Humidity",    range: "40% – 80%",   color: "cyan" },
              ].map(({ label, range, color }) => (
                <div key={label} className="flex items-center gap-3 px-3 py-2.5 bg-gray-50 rounded-xl">
                  <div className={`w-2 h-2 rounded-full bg-${color}-400`} />
                  <span className="text-xs font-medium text-gray-600">{label}:</span>
                  <span className="text-xs text-gray-500 ml-auto">{range}</span>
                </div>
              ))}
            </div>
          </div>

          {/* History table */}
          {history.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                  <RefreshCw size={15} className="text-green-600" />
                  {isBangla ? "সাম্প্রতিক রিডিং" : "Recent Readings"}
                  <span className="ml-1 px-2 py-0.5 text-xs bg-gray-100 text-gray-500 rounded-full">{history.length}</span>
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="text-left px-4 py-3 font-semibold text-gray-500">{isBangla ? "সময়" : "Time"}</th>
                      <th className="text-right px-4 py-3 font-semibold text-gray-500">N</th>
                      <th className="text-right px-4 py-3 font-semibold text-gray-500">P</th>
                      <th className="text-right px-4 py-3 font-semibold text-gray-500">K</th>
                      <th className="text-right px-4 py-3 font-semibold text-gray-500">pH</th>
                      <th className="text-right px-4 py-3 font-semibold text-gray-500">EC</th>
                      <th className="text-right px-4 py-3 font-semibold text-gray-500">{isBangla ? "তাপ" : "Temp"}</th>
                      <th className="text-right px-4 py-3 font-semibold text-gray-500">{isBangla ? "আর্দ্রতা" : "Hum"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((row, i) => (
                      <tr key={row.id ?? i} className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors">
                        <td className="px-4 py-3 text-gray-500 font-mono">{formatTime(row.timestamp)}</td>
                        <td className="px-4 py-3 text-right font-medium text-gray-800">{formatNumber(row.nitrogen, 0)}</td>
                        <td className="px-4 py-3 text-right font-medium text-gray-800">{formatNumber(row.phosphorus, 0)}</td>
                        <td className="px-4 py-3 text-right font-medium text-gray-800">{formatNumber(row.potassium, 0)}</td>
                        <td className="px-4 py-3 text-right font-medium text-gray-800">{formatNumber(row.ph)}</td>
                        <td className="px-4 py-3 text-right font-medium text-gray-800">{formatNumber(row.conductivity)}</td>
                        <td className="px-4 py-3 text-right font-medium text-gray-800">{formatNumber(row.temperature)}°</td>
                        <td className="px-4 py-3 text-right font-medium text-gray-800">{formatNumber(row.humidity)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </ProtectedLayout>
  );
}

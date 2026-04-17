"use client";

import { useEffect, useState, useCallback } from "react";
import ProtectedLayout from "@/components/ProtectedLayout";
import StatCard from "@/components/StatCard";
import PageHeader from "@/components/PageHeader";
import { getStatusColor, formatNumber } from "@/lib/utils";
import { Thermometer, Droplets, Sun, Wind, MapPin, RefreshCw, Loader2 } from "lucide-react";
import { useLanguage } from "@/lib/language-context";

interface WeatherData {
  temperature:    number;
  humidity:       number;
  lightIntensity: number;
  pressure:       number;
  timestamp:      number;
}

interface LocationInfo {
  lat:  number;
  lon:  number;
  name: string;
}

function generateWeather(): WeatherData {
  const h     = new Date().getHours();
  const temp  = parseFloat((( h >= 12 && h <= 16 ? 20 : 19) + (Math.random() * 3 - 1.5)).toFixed(1));
  const humid = parseFloat((60 + Math.random() * 30).toFixed(1));
  const light = h >= 6 && h <= 18
    ? parseInt((10000 + Math.random() * 90000).toFixed(0))
    : parseInt((Math.random() * 1000).toFixed(0));
  const pres  = parseFloat((1000 + Math.random() * 20).toFixed(1));
  return { temperature: temp, humidity: humid, lightIntensity: light, pressure: pres, timestamp: Date.now() };
}

function formatLight(lux: number): string {
  if (lux >= 1000) return `${(lux / 1000).toFixed(1)} klux`;
  return `${lux} lux`;
}

function lightCondition(lux: number): string {
  if (lux < 500)     return "Night / Overcast";
  if (lux < 10000)   return "Cloudy / Indoor";
  if (lux < 50000)   return "Partly sunny";
  return "Full sunlight";
}

export default function WeatherPage() {
  const [weather, setWeather]   = useState<WeatherData | null>(null);
  const [history, setHistory]   = useState<WeatherData[]>([]);
  const [location, setLocation] = useState<LocationInfo | null>(null);
  const [locLoading, setLocLoading] = useState(false);
  const [locError,   setLocError]   = useState<string | null>(null);
  const { language } = useLanguage();
  const isBangla = language === "bn";

  const refresh = useCallback(() => {
    const w = generateWeather();
    setWeather(w);
    setHistory((prev) => [w, ...prev].slice(0, 12));
  }, []);

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 30_000);
    return () => clearInterval(interval);
  }, [refresh]);

  const getLocation = () => {
    if (!navigator.geolocation) { setLocError(isBangla ? "Geolocation সমর্থিত নয়।" : "Geolocation not supported."); return; }
    setLocLoading(true);
    setLocError(null);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lon } = pos.coords;
        try {
          const res  = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
          const data = await res.json();
          const addr = data.address ?? {};
          const name = [addr.village || addr.town || addr.city, addr.county, addr.country]
            .filter(Boolean).join(", ") || data.display_name || "Unknown location";
          setLocation({ lat, lon, name });
        } catch {
          setLocation({ lat, lon, name: `${lat.toFixed(4)}, ${lon.toFixed(4)}` });
        } finally {
          setLocLoading(false);
        }
      },
      (err) => {
        setLocError(isBangla ? "লোকেশন অনুমতি বাতিল করা হয়েছে।" : "Location permission denied.");
        setLocLoading(false);
      }
    );
  };

  const params = weather ? [
    {
      key:   "temperature",
      label: "Temperature",
      value: formatNumber(weather.temperature),
      unit:  "°C",
      icon:  <Thermometer size={20} />,
      sub:   "Ambient air temp",
    },
    {
      key:   "humidity",
      label: "Humidity",
      value: formatNumber(weather.humidity),
      unit:  "%",
      icon:  <Droplets size={20} />,
      sub:   "Relative humidity",
    },
    {
      key:   "light",
      label: "Light Intensity",
      value: formatLight(weather.lightIntensity),
      unit:  "",
      icon:  <Sun size={20} />,
      sub:   lightCondition(weather.lightIntensity),
    },
    {
      key:   "pressure",
      label: "Air Pressure",
      value: formatNumber(weather.pressure, 1),
      unit:  "hPa",
      icon:  <Wind size={20} />,
      sub:   weather.pressure > 1015 ? "High pressure" : "Low pressure",
    },
  ] : [];

  const hour = new Date().getHours();
  const isDaytime = hour >= 6 && hour <= 18;

  return (
    <ProtectedLayout>
      <PageHeader
        title={isBangla ? "আবহাওয়া ও মাইক্রোক্লাইমেট" : "Weather & Microclimate"}
        description={isBangla ? "লোকাল আবহাওয়ার অবস্থা প্রতি ৩০ সেকেন্ডে আপডেট হয়" : "Local atmospheric conditions updated every 30 seconds"}
        badge={isBangla ? "অটো-রিফ্রেশ" : "Auto-refresh"}
        action={
          <button
            onClick={refresh}
            className="flex items-center gap-2 text-sm bg-white border border-gray-200 text-gray-700 font-medium px-4 py-2 rounded-xl hover:bg-gray-50 transition-all shadow-sm"
          >
            <RefreshCw size={14} />
            {isBangla ? "রিফ্রেশ" : "Refresh"}
          </button>
        }
      />

      {/* Sky condition banner */}
      <div
        className={`relative overflow-hidden rounded-3xl p-7 mb-8 shadow-sm ${
          isDaytime
            ? "bg-gradient-to-r from-blue-400 via-sky-400 to-cyan-400"
            : "bg-gradient-to-r from-indigo-900 via-blue-900 to-slate-800"
        }`}
      >
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full" />
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <p className="text-white/80 text-sm font-medium mb-1">
              {isDaytime ? (isBangla ? "☀️ দিনের সময়" : "☀️ Daytime") : (isBangla ? "🌙 রাতের সময়" : "🌙 Nighttime")}
            </p>
            {weather && (
              <div className="flex items-end gap-3">
                <span className="text-5xl font-bold text-white">{weather.temperature}°C</span>
                <div className="pb-1 text-white/80 text-sm">
                  <div>{isBangla ? "💧 আর্দ্রতা" : "💧 humidity"} {weather.humidity}%</div>
                  <div>{isBangla ? "🌬 বায়ু চাপ" : "🌬 air pressure"} {weather.pressure} hPa</div>
                </div>
              </div>
            )}
          </div>
          <div className="text-6xl opacity-80">
            {isDaytime ? (weather && weather.lightIntensity > 30000 ? "☀️" : "⛅") : "🌙"}
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {params.map(({ key, label, value, unit, icon, sub }) => (
          <StatCard
            key={key}
            label={label}
            value={value}
            unit={unit}
            icon={icon}
            sub={sub}
            status={
              key === "temperature" && weather
                ? getStatusColor("temperature", weather.temperature)
                : key === "humidity" && weather
                ? getStatusColor("humidity", weather.humidity)
                : "neutral"
            }
          />
        ))}
      </div>

      {/* Location */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
            <MapPin size={16} className="text-green-600" />
            {isBangla ? "আপনার অবস্থান" : "Your Location"}
          </h3>
          {!location && (
            <button
              onClick={getLocation}
              disabled={locLoading}
              className="flex items-center gap-2 text-xs bg-green-50 text-green-700 border border-green-200 px-4 py-2 rounded-xl font-medium hover:bg-green-100 transition-all disabled:opacity-60"
            >
              {locLoading ? <Loader2 size={13} className="animate-spin" /> : <MapPin size={13} />}
              {locLoading ? (isBangla ? "অবস্থান শনাক্ত করা হচ্ছে…" : "Locating…") : (isBangla ? "অবস্থান শনাক্ত করুন" : "Detect Location")}
            </button>
          )}
        </div>
        {locError && <p className="text-sm text-red-600">{locError}</p>}
        {location ? (
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center shrink-0">
              <MapPin size={18} className="text-green-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm">{location.name}</p>
              <p className="text-xs text-gray-400 mt-0.5">
                {location.lat.toFixed(5)}, {location.lon.toFixed(5)}
              </p>
            </div>
          </div>
        ) : (
          !locLoading && (
            <p className="text-sm text-gray-400">
              Enable location to see area-specific weather context.
            </p>
          )
        )}
      </div>

      {/* History table */}
      {history.length > 1 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="font-bold text-gray-900 text-sm">{isBangla ? "রিডিং ইতিহাস" : "Reading History"}</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-4 py-3 font-semibold text-gray-500">Time</th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-500">Temp (°C)</th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-500">Humidity (%)</th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-500">Light</th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-500">Pressure (hPa)</th>
                </tr>
              </thead>
              <tbody>
                {history.map((row, i) => (
                  <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors">
                    <td className="px-4 py-3 font-mono text-gray-500">
                      {new Date(row.timestamp).toLocaleTimeString()}
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-gray-800">{row.temperature}</td>
                    <td className="px-4 py-3 text-right font-medium text-gray-800">{row.humidity}</td>
                    <td className="px-4 py-3 text-right font-medium text-gray-800">{formatLight(row.lightIntensity)}</td>
                    <td className="px-4 py-3 text-right font-medium text-gray-800">{row.pressure}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </ProtectedLayout>
  );
}

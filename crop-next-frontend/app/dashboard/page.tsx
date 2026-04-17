"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ref, onValue } from "firebase/database";
import { database, pickLatestHistoryEntry } from "@/lib/firebase";
import { useAuth } from "@/lib/auth-context";
import ProtectedLayout from "@/components/ProtectedLayout";
import StatCard from "@/components/StatCard";
import PageHeader from "@/components/PageHeader";
import { useLanguage } from "@/lib/language-context";
import {
  FlaskConical, Thermometer, Droplets, Zap, CloudSun,
  Sprout, ArrowRight, Activity, TrendingUp, BarChart2,
} from "lucide-react";
import { getStatusColor, formatNumber } from "@/lib/utils";

interface SoilData {
  nitrogen?:     number;
  phosphorus?:   number;
  potassium?:    number;
  temperature?:  number;
  humidity?:     number;
  ph?:           number;
  conductivity?: number;
  timestamp?:    number;
}

const quickLinks = [
  { label: "Soil Monitor",    href: "/soil",      icon: FlaskConical, color: "from-blue-500 to-cyan-500",     bg: "bg-blue-50",    text: "text-blue-600",   desc: "Live NPK & pH data" },
  { label: "Weather",         href: "/weather",   icon: CloudSun,     color: "from-amber-500 to-orange-500",  bg: "bg-amber-50",   text: "text-amber-600",  desc: "Microclimate readings" },
  { label: "Crop Recommend",  href: "/recommend", icon: Sprout,       color: "from-green-500 to-emerald-500", bg: "bg-green-50",   text: "text-green-600",  desc: "AI crop suggestions" },
  { label: "Crop Analysis",   href: "/analysis",  icon: BarChart2,    color: "from-violet-500 to-purple-500", bg: "bg-violet-50",  text: "text-violet-600", desc: "Compare ideal vs live" },
];

export default function DashboardPage() {
  const { user }           = useAuth();
  const router             = useRouter();
  const { language }       = useLanguage();
  const [soil, setSoil]    = useState<SoilData | null>(null);
  const [soilErr, setSoilErr] = useState(false);
  const isBangla = language === "bn";
  const pageDescription = "Live sensor readings from your field";
  const heroStatus = "System Active";
  const heroCopy = "Your farm data is being monitored in real-time. All sensors are operational.";

  useEffect(() => {
    const soilRef = ref(database, "soil_data/history");
    const unsub   = onValue(soilRef, (snap) => {
      const history = snap.val() as Record<string, SoilData> | null;
      const data = pickLatestHistoryEntry(history);
      if (data) { setSoil(data); setSoilErr(false); }
      else       { setSoilErr(true); }
    }, () => setSoilErr(true));
    return () => unsub();
  }, []);

  const firstName = user?.displayName?.split(" ")[0] || user?.email?.split("@")[0] || (isBangla ? "কৃষক" : "Farmer");
  const hour      = new Date().getHours();
  const greeting  = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <ProtectedLayout>
      {/* Hero greeting */}
      <div className="relative overflow-hidden bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 rounded-3xl p-8 mb-8 shadow-lg">
        <div className="absolute -top-10 -right-10 w-64 h-64 bg-white/10 rounded-full" />
        <div className="absolute -bottom-16 -left-8 w-48 h-48 bg-white/5 rounded-full" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Activity size={16} className="text-green-200" />
            <span className="text-green-200 text-sm font-medium">{heroStatus}</span>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">
            {greeting}, {firstName}! 👋
          </h2>
          <p className="text-green-100 text-sm leading-relaxed max-w-lg">
            {heroCopy}
          </p>
          <div className="flex flex-wrap gap-3 mt-5">
            <button
              onClick={() => router.push("/recommend")}
              className="flex items-center gap-2 bg-white text-green-700 font-semibold text-sm px-5 py-2.5 rounded-xl shadow hover:shadow-md transition-all active:scale-[0.98]"
            >
              <Sprout size={16} />
              Get Recommendation
            </button>
            <button
              onClick={() => router.push("/soil")}
              className="flex items-center gap-2 bg-white/20 text-white font-semibold text-sm px-5 py-2.5 rounded-xl border border-white/30 hover:bg-white/30 transition-all"
            >
              <Activity size={16} />
              View Live Data
            </button>
          </div>
        </div>
      </div>

      <PageHeader
        title={isBangla ? "খামারের সারসংক্ষেপ" : "Farm Overview"}
        description={pageDescription}
        badge={isBangla ? "রিয়েল-টাইম" : "Real-time"}
      />

      {/* Live soil stats */}
      {soilErr ? (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl px-6 py-5 mb-8 flex items-start gap-3">
          <span className="text-2xl">⚠️</span>
          <div>
            <p className="font-semibold text-amber-800 text-sm">{isBangla ? "কোনও সেন্সর ডেটা নেই" : "No sensor data available"}</p>
            <p className="text-amber-700 text-xs mt-1">
              {isBangla
                ? "আপনার ESP8266 ডিভাইস চালু আছে এবং Firebase-এর সাথে সংযুক্ত কিনা দেখুন।"
                : "Make sure your ESP8266 device is on and connected to Firebase."}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="Nitrogen (N)"
            value={soil ? formatNumber(soil.nitrogen, 0) : "—"}
            unit="mg/kg"
            icon={<FlaskConical size={20} />}
            status={soil?.nitrogen != null ? getStatusColor("N", soil.nitrogen) : "neutral"}
            sub="Soil nutrient"
          />
          <StatCard
            label="Phosphorus (P)"
            value={soil ? formatNumber(soil.phosphorus, 0) : "—"}
            unit="mg/kg"
            icon={<span className="text-base">⚗️</span>}
            status={soil?.phosphorus != null ? getStatusColor("P", soil.phosphorus) : "neutral"}
            sub="Soil nutrient"
          />
          <StatCard
            label="Potassium (K)"
            value={soil ? formatNumber(soil.potassium, 0) : "—"}
            unit="mg/kg"
            icon={<span className="text-base">🔥</span>}
            status={soil?.potassium != null ? getStatusColor("K", soil.potassium) : "neutral"}
            sub="Soil nutrient"
          />
          <StatCard
            label="Temperature"
            value={soil ? formatNumber(soil.temperature) : "—"}
            unit="°C"
            icon={<Thermometer size={20} />}
            status={soil?.temperature != null ? getStatusColor("temperature", soil.temperature) : "neutral"}
            sub="Soil temperature"
          />
          <StatCard
            label="Humidity"
            value={soil ? formatNumber(soil.humidity) : "—"}
            unit="%"
            icon={<Droplets size={20} />}
            status={soil?.humidity != null ? getStatusColor("humidity", soil.humidity) : "neutral"}
            sub="Relative humidity"
          />
          <StatCard
            label="pH"
            value={soil ? formatNumber(soil.ph) : "—"}
            icon={<span className="text-base">🔬</span>}
            status={soil?.ph != null ? getStatusColor("ph", soil.ph) : "neutral"}
            sub="Soil acidity"
          />
          <StatCard
            label="EC"
            value={soil ? formatNumber(soil.conductivity) : "—"}
            unit="mS/cm"
            icon={<Zap size={20} />}
            status={soil?.conductivity != null ? getStatusColor("EC", soil.conductivity) : "neutral"}
            sub="Conductivity"
          />
        </div>
      )}

      {/* Quick Nav Cards */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <TrendingUp size={18} className="text-green-600" />
          {isBangla ? "দ্রুত প্রবেশ" : "Quick Access"}
        </h3>
        <div className="grid sm:grid-cols-3 gap-4">
          {quickLinks.map(({ label, href, icon: Icon, color, bg, text, desc }) => (
            <Link
              key={href}
              href={href}
              className="group flex items-center gap-4 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-sm`}>
                <Icon size={22} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 text-sm">{label}</p>
                <p className="text-xs text-gray-500 mt-0.5 truncate">{desc}</p>
              </div>
              <ArrowRight size={16} className="text-gray-300 group-hover:text-gray-500 group-hover:translate-x-1 transition-all" />
            </Link>
          ))}
        </div>
      </div>
    </ProtectedLayout>
  );
}

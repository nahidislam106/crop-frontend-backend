"use client";

import { Fragment, useState, useEffect, useCallback } from "react";
import ProtectedLayout from "@/components/ProtectedLayout";
import PageHeader from "@/components/PageHeader";
import { ref, onValue } from "firebase/database";
import { database, pickLatestHistoryEntry } from "@/lib/firebase";
import { API_BASE, cn, formatNumber } from "@/lib/utils";
import { CROP_NAMES } from "@/lib/knowledge-base";
import { useLanguage } from "@/lib/language-context";
import {
  FlaskConical, Thermometer, Droplets, Zap, Sprout,
  TrendingUp, TrendingDown, CheckCircle2, AlertTriangle,
  AlertCircle, Wifi, WifiOff, RefreshCw, ChevronDown,
  Info, Leaf, ArrowLeftRight, BookOpen,
  Cloud, Sun, CloudRain, Gauge,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface LiveSensor {
  nitrogen?:     number;
  phosphorus?:   number;
  potassium?:    number;
  ph?:           number;
  conductivity?: number;
  temperature?:  number;
  humidity?:     number;
  timestamp?:    number;
}

interface ParamStats {
  mean:   number;
  std:    number;
  min:    number;
  max:    number;
  median: number;
}

type IdealData = Record<string, ParamStats>;

// ─── Parameter config (maps sensor keys → ideal_parameters keys) ─────────────

interface ParamConfig {
  key:      string;          // key in ideal API response
  label:    string;
  bnLabel:  string;
  unit:     string;
  icon:     React.ElementType;
  color:    string;          // tailwind color token
  sensorFn: (s: LiveSensor) => number | undefined;
  decimals: number;
}

const SOIL_PARAMS: ParamConfig[] = [
  {
    key: "N", label: "Nitrogen", bnLabel: "নাইট্রোজেন", unit: "kg/ha",
    icon: FlaskConical, color: "green",
    sensorFn: (s) => s.nitrogen,
    decimals: 1,
  },
  {
    key: "P", label: "Phosphorus", bnLabel: "ফসফরাস", unit: "kg/ha",
    icon: FlaskConical, color: "blue",
    sensorFn: (s) => s.phosphorus,
    decimals: 1,
  },
  {
    key: "K", label: "Potassium", bnLabel: "পটাশিয়াম", unit: "kg/ha",
    icon: FlaskConical, color: "purple",
    sensorFn: (s) => s.potassium,
    decimals: 1,
  },
  {
    key: "ph", label: "Soil pH", bnLabel: "মাটির pH", unit: "",
    icon: Zap, color: "yellow",
    sensorFn: (s) => s.ph,
    decimals: 2,
  },
  {
    key: "EC", label: "EC", bnLabel: "বৈ. পরিবাহিতা (EC)", unit: "dS/m",
    icon: Zap, color: "orange",
    sensorFn: (s) => s.conductivity,
    decimals: 2,
  },
  {
    key: "temperature", label: "Temperature", bnLabel: "তাপমাত্রা", unit: "°C",
    icon: Thermometer, color: "red",
    sensorFn: (s) => s.temperature,
    decimals: 1,
  },
  {
    key: "humidity", label: "Humidity", bnLabel: "আর্দ্রতা", unit: "%",
    icon: Droplets, color: "cyan",
    sensorFn: (s) => s.humidity,
    decimals: 1,
  },
];

const WEATHER_PARAMS: ParamConfig[] = [
  {
    key: "weather_temperature", label: "Weather Temp", bnLabel: "আবহাওয়া তাপমাত্রা", unit: "°C",
    icon: Thermometer, color: "rose",
    sensorFn: () => undefined,
    decimals: 1,
  },
  {
    key: "weather_humidity", label: "Weather Humidity", bnLabel: "আবহাওয়া আর্দ্রতা", unit: "%",
    icon: Cloud, color: "sky",
    sensorFn: () => undefined,
    decimals: 1,
  },
  {
    key: "light_intensity", label: "Light Intensity", bnLabel: "আলোর তীব্রতা", unit: "lux",
    icon: Sun, color: "amber",
    sensorFn: () => undefined,
    decimals: 0,
  },
  {
    key: "air_pressure", label: "Air Pressure", bnLabel: "বায়ু চাপ", unit: "hPa",
    icon: Gauge, color: "indigo",
    sensorFn: () => undefined,
    decimals: 1,
  },
  {
    key: "rainfall", label: "Rainfall", bnLabel: "বৃষ্টিপাত", unit: "mm",
    icon: CloudRain, color: "teal",
    sensorFn: () => undefined,
    decimals: 1,
  },
];

const PARAMS: ParamConfig[] = [...SOIL_PARAMS, ...WEATHER_PARAMS];

// Tailwind color mappings
const COLOR = {
  green:  { bg: "bg-green-100",  text: "text-green-700",  border: "border-green-200",  bar: "bg-green-500",  light: "bg-green-50"  },
  blue:   { bg: "bg-blue-100",   text: "text-blue-700",   border: "border-blue-200",   bar: "bg-blue-500",   light: "bg-blue-50"   },
  purple: { bg: "bg-purple-100", text: "text-purple-700", border: "border-purple-200", bar: "bg-purple-500", light: "bg-purple-50" },
  yellow: { bg: "bg-yellow-100", text: "text-yellow-700", border: "border-yellow-200", bar: "bg-yellow-500", light: "bg-yellow-50" },
  orange: { bg: "bg-orange-100", text: "text-orange-700", border: "border-orange-200", bar: "bg-orange-500", light: "bg-orange-50" },
  red:    { bg: "bg-red-100",    text: "text-red-700",    border: "border-red-200",    bar: "bg-red-500",    light: "bg-red-50"    },
  cyan:   { bg: "bg-cyan-100",   text: "text-cyan-700",   border: "border-cyan-200",   bar: "bg-cyan-500",   light: "bg-cyan-50"   },
  rose:   { bg: "bg-rose-100",   text: "text-rose-700",   border: "border-rose-200",   bar: "bg-rose-500",   light: "bg-rose-50"   },
  sky:    { bg: "bg-sky-100",    text: "text-sky-700",    border: "border-sky-200",    bar: "bg-sky-500",    light: "bg-sky-50"    },
  amber:  { bg: "bg-amber-100",  text: "text-amber-700",  border: "border-amber-200",  bar: "bg-amber-500",  light: "bg-amber-50"  },
  indigo: { bg: "bg-indigo-100", text: "text-indigo-700", border: "border-indigo-200", bar: "bg-indigo-500", light: "bg-indigo-50" },
  teal:   { bg: "bg-teal-100",   text: "text-teal-700",   border: "border-teal-200",   bar: "bg-teal-500",   light: "bg-teal-50"   },
} as const;

// ─── Status helpers ───────────────────────────────────────────────────────────

type Status = "in_range" | "low" | "high" | "no_sensor";

function getStatus(value: number | undefined, stats: ParamStats): Status {
  if (value === undefined || value === null) return "no_sensor";
  if (value < stats.min) return "low";
  if (value > stats.max) return "high";
  return "in_range";
}

const STATUS_META: Record<Status, { label: string; bnLabel: string; icon: React.ElementType; cls: string }> = {
  in_range:  { label: "In Range",   bnLabel: "আদর্শ মাত্রায়",   icon: CheckCircle2,  cls: "bg-green-50 text-green-700 border-green-200" },
  low:       { label: "Too Low",    bnLabel: "কম",               icon: TrendingDown,  cls: "bg-blue-50 text-blue-700 border-blue-200"   },
  high:      { label: "Too High",   bnLabel: "বেশি",             icon: TrendingUp,    cls: "bg-red-50 text-red-700 border-red-200"      },
  no_sensor: { label: "No Data",    bnLabel: "ডেটা নেই",         icon: AlertCircle,   cls: "bg-gray-50 text-gray-500 border-gray-200"   },
};

// ─── Range bar component ──────────────────────────────────────────────────────
// Shows: [──── ideal zone (min→max) ────] with mean marker and current value marker

interface RangeBarProps {
  stats:   ParamStats;
  current: number | undefined;
  color:   keyof typeof COLOR;
}

function RangeBar({ stats, current, color }: RangeBarProps) {
  // Extend the visible range 20% beyond ideal min/max for context
  const padding = (stats.max - stats.min) * 0.5 || 1;
  const visMin  = Math.max(0, stats.min - padding);
  const visMax  = stats.max + padding;
  const visRange = visMax - visMin;

  const toPercent = (v: number) =>
    Math.min(100, Math.max(0, ((v - visMin) / visRange) * 100));

  const idealLeft  = toPercent(stats.min);
  const idealWidth = toPercent(stats.max) - idealLeft;
  const meanPos    = toPercent(stats.mean);
  const currPos    = current !== undefined ? toPercent(current) : null;

  const c = COLOR[color];

  return (
    <div className="space-y-2">
      {/* Bar */}
      <div className="relative h-6 bg-gray-100 rounded-full overflow-visible">
        {/* Ideal zone */}
        <div
          className={cn("absolute top-0 h-full rounded-full opacity-30", c.bar)}
          style={{ left: `${idealLeft}%`, width: `${idealWidth}%` }}
        />
        {/* Ideal zone border */}
        <div
          className={cn("absolute top-0 h-full rounded-full border-2 border-opacity-60", c.bar.replace("bg-", "border-"))}
          style={{ left: `${idealLeft}%`, width: `${idealWidth}%`, background: "transparent" }}
        />
        {/* Mean line */}
        <div
          className={cn("absolute top-1/2 -translate-y-1/2 w-0.5 h-4 rounded-full opacity-70", c.bar)}
          style={{ left: `${meanPos}%` }}
        />
        {/* Mean tooltip */}
        <div
          className="absolute -top-6 text-[10px] font-semibold text-gray-500 -translate-x-1/2"
          style={{ left: `${meanPos}%` }}
        >
          mean
        </div>

        {/* Current value marker */}
        {currPos !== null && (
          <div
            className={cn(
              "absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 rounded-full border-2 border-white shadow-md z-10 transition-all",
              current! < stats.min ? "bg-blue-500" :
              current! > stats.max ? "bg-red-500"  : `${c.bar}`
            )}
            style={{ left: `${currPos}%` }}
            title={`Current: ${current}`}
          />
        )}
      </div>

      {/* Scale labels */}
      <div className="flex justify-between text-[10px] text-gray-400 px-0.5">
        <span>{formatNumber(visMin, 1)}</span>
        <span className={cn("font-semibold text-xs", c.text)}>
          Ideal: {formatNumber(stats.min, 1)} – {formatNumber(stats.max, 1)}
        </span>
        <span>{formatNumber(visMax, 1)}</span>
      </div>
    </div>
  );
}

// ─── Single parameter card ────────────────────────────────────────────────────

interface ParamCardProps {
  config:  ParamConfig;
  stats:   ParamStats | undefined;
  current: number | undefined;
  loading: boolean;
}

function ParamCard({ config, stats, current, loading }: ParamCardProps) {
  const { label, bnLabel, unit, icon: Icon, color, decimals } = config;
  const c = COLOR[color as keyof typeof COLOR];

  if (loading || !stats) {
    return (
      <div className={cn("rounded-2xl border p-5 animate-pulse bg-gray-50", c.border)}>
        <div className="h-4 bg-gray-200 rounded w-2/3 mb-3" />
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-4" />
        <div className="h-6 bg-gray-200 rounded-full" />
      </div>
    );
  }

  const status = getStatus(current, stats);
  const sm     = STATUS_META[status];
  const delta  = current !== undefined ? current - stats.mean : null;
  const deltaPct = delta !== null && stats.mean !== 0
    ? (delta / stats.mean) * 100
    : null;

  return (
    <div className={cn(
      "rounded-2xl border-2 p-5 transition-all hover:shadow-md flex flex-col gap-4",
      status === "in_range" ? "border-green-200 bg-green-50/30" :
      status === "low"      ? "border-blue-200 bg-blue-50/30"   :
      status === "high"     ? "border-red-200 bg-red-50/30"     :
      "border-gray-200 bg-gray-50"
    )}>
      {/* Header row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center", c.bg)}>
            <Icon size={18} className={c.text} />
          </div>
          <div>
            <p className="font-bold text-gray-900 text-sm leading-tight">{label}</p>
            <p className="text-xs text-gray-400">{bnLabel}</p>
          </div>
        </div>
        {/* Status badge */}
        <span className={cn("flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border", sm.cls)}>
          <sm.icon size={11} />
          {sm.label}
          <span className="opacity-70">· {sm.bnLabel}</span>
        </span>
      </div>

      {/* Values row */}
      <div className="grid grid-cols-3 gap-2 text-center">
        {/* Current sensor value */}
        <div className={cn("rounded-xl p-2.5", c.light)}>
          <p className="text-[10px] text-gray-500 mb-0.5">Live / লাইভ</p>
          <p className={cn("text-xl font-black", c.text)}>
            {current !== undefined ? formatNumber(current, decimals) : "—"}
          </p>
          <p className="text-[10px] text-gray-400">{unit}</p>
        </div>
        {/* Ideal mean */}
        <div className="rounded-xl bg-gray-100 p-2.5">
          <p className="text-[10px] text-gray-500 mb-0.5">Ideal Mean / আদর্শ</p>
          <p className="text-xl font-black text-gray-700">
            {formatNumber(stats.mean, decimals)}
          </p>
          <p className="text-[10px] text-gray-400">{unit}</p>
        </div>
        {/* Delta */}
        <div className={cn(
          "rounded-xl p-2.5",
          delta === null       ? "bg-gray-100" :
          delta > 0            ? "bg-red-50"   : "bg-blue-50"
        )}>
          <p className="text-[10px] text-gray-500 mb-0.5">Diff / পার্থক্য</p>
          <p className={cn(
            "text-xl font-black",
            delta === null  ? "text-gray-400" :
            delta > 0       ? "text-red-600"  : "text-blue-600"
          )}>
            {delta !== null ? `${delta > 0 ? "+" : ""}${formatNumber(delta, decimals)}` : "—"}
          </p>
          <p className="text-[10px] text-gray-400">
            {deltaPct !== null ? `${deltaPct > 0 ? "+" : ""}${deltaPct.toFixed(1)}%` : ""}
          </p>
        </div>
      </div>

      {/* Range bar */}
      <div className="pt-3 mt-auto">
        <RangeBar stats={stats} current={current} color={color as keyof typeof COLOR} />
      </div>

      {/* Recommendation hint */}
      {status !== "in_range" && status !== "no_sensor" && (
        <div className={cn(
          "flex items-start gap-2 rounded-xl px-3 py-2 text-xs",
          status === "low"
            ? "bg-blue-50 text-blue-700 border border-blue-200"
            : "bg-red-50 text-red-700 border border-red-200"
        )}>
          <Info size={13} className="mt-0.5 shrink-0" />
          <span>
            {status === "low"
              ? `${label} is ${Math.abs(delta!).toFixed(decimals)} ${unit} below ideal mean. Consider increasing ${label.toLowerCase()} input.`
              : `${label} is ${Math.abs(delta!).toFixed(decimals)} ${unit} above ideal mean. Reduce ${label.toLowerCase()} application.`}
          </span>
        </div>
      )}
    </div>
  );
}

// ─── Score gauge (overall match %) ───────────────────────────────────────────

function MatchGauge({ score }: { score: number }) {
  const color  = score >= 70 ? "text-green-600" : score >= 40 ? "text-yellow-600" : "text-red-600";
  const bgRing = score >= 70 ? "stroke-green-500" : score >= 40 ? "stroke-yellow-500" : "stroke-red-500";
  const r = 36, cx = 44, cy = 44;
  const circ = 2 * Math.PI * r;
  const dash  = (score / 100) * circ;

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={88} height={88} className="-rotate-90">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#e5e7eb" strokeWidth={7} />
        <circle
          cx={cx} cy={cy} r={r} fill="none"
          className={bgRing} strokeWidth={7}
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
        />
      </svg>
      <div className="flex flex-col items-center -mt-16 mb-8">
        <span className={cn("text-2xl font-black", color)}>{score}%</span>
        <span className="text-[10px] text-gray-400 font-medium">Match</span>
      </div>
    </div>
  );
}

// ─── Ideal-only parameter card ──────────────────────────────────────────────────

function IdealParamCard({ config, stats, loading }: { config: ParamConfig; stats: ParamStats | undefined; loading: boolean }) {
  const { label, bnLabel, unit, icon: Icon, color, decimals } = config;
  const c = COLOR[color as keyof typeof COLOR];

  if (loading || !stats) {
    return (
      <div className={cn("rounded-2xl border p-5 animate-pulse bg-gray-50", c.border)}>
        <div className="h-4 bg-gray-200 rounded w-2/3 mb-3" />
        <div className="h-16 bg-gray-200 rounded mb-4" />
        <div className="h-6 bg-gray-200 rounded-full" />
      </div>
    );
  }

  const statBoxes = [
    { key: "Min",    bnKey: "সর্বনিম্ন", val: stats.min,    cls: "bg-blue-50 text-blue-700"   },
    { key: "Mean",   bnKey: "গড়",       val: stats.mean,   cls: "bg-gray-100 text-gray-800"  },
    { key: "Median", bnKey: "মধ্যমা",   val: stats.median, cls: "bg-gray-100 text-gray-800"  },
    { key: "Max",    bnKey: "সর্বোচ্চ", val: stats.max,    cls: "bg-red-50 text-red-700"     },
  ];

  return (
    <div className={cn(
      "rounded-2xl border-2 p-5 flex flex-col gap-4 hover:shadow-md transition-all",
      c.border, `${c.light}/30`
    )}>
      {/* Header */}
      <div className="flex items-center gap-2.5">
        <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center shrink-0", c.bg)}>
          <Icon size={18} className={c.text} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-gray-900 text-sm leading-tight">{label}</p>
          <p className="text-xs text-gray-400">{bnLabel}</p>
        </div>
        <span className={cn("text-xs font-semibold px-2.5 py-1 rounded-full border", c.bg, c.text, c.border)}>
          {unit || "dimensionless"}
        </span>
      </div>

      {/* 4 stat boxes: Min / Mean / Median / Max */}
      <div className="grid grid-cols-4 gap-1.5">
        {statBoxes.map(({ key, bnKey, val, cls }) => (
          <div key={key} className={cn("rounded-xl p-2 text-center", cls)}>
            <p className="text-[9px] font-bold uppercase tracking-wide opacity-60 mb-0.5">{key}</p>
            <p className="text-sm font-black leading-tight">{formatNumber(val, decimals)}</p>
            <p className="text-[9px] opacity-50 mt-0.5">{bnKey}</p>
          </div>
        ))}
      </div>

      {/* Range bar (no live value) */}
      <div className="pt-2">
        <RangeBar stats={stats} current={undefined} color={color as keyof typeof COLOR} />
      </div>

      {/* Std dev footer */}
      <div className={cn("flex items-center justify-between text-xs rounded-lg px-3 py-2", c.bg)}>
        <span className={cn("font-medium", c.text)}>Std Dev / আদর্শ বিচ্যুতি</span>
        <span className={cn("font-black", c.text)}>±{formatNumber(stats.std, decimals)} {unit}</span>
      </div>
    </div>
  );
}

// ─── Crop selector ────────────────────────────────────────────────────────────

const ALL_CROPS = Object.entries(CROP_NAMES).map(([key, val]) => ({
  key,
  label: key.charAt(0).toUpperCase() + key.slice(1),
  bn: val.bn,
  type: val.type,
}));

const TYPE_ORDER = ["cereal", "pulse", "vegetable", "fruit", "cash_crop"];
const TYPE_LABELS: Record<string, string> = {
  cereal: "Cereals / শস্য", pulse: "Pulses / ডাল",
  vegetable: "Vegetables / সবজি", fruit: "Fruits / ফল",
  cash_crop: "Cash Crops / অর্থকরী ফসল",
};

// ─── Main page ────────────────────────────────────────────────────────────────

export default function CropAnalysisPage() {
  const { language } = useLanguage();
  const isBangla = language === "bn";
  type Mode = "compare" | "ideal";
  const [selectedCrop, setSelectedCrop] = useState<string>("rice");
  const [mode,         setMode]         = useState<Mode>("compare");
  const [ideal,        setIdeal]        = useState<IdealData | null>(null);
  const [idealLoading, setIdealLoading] = useState(false);
  const [idealError,   setIdealError]   = useState<string | null>(null);
  const [sensor,       setSensor]       = useState<LiveSensor | null>(null);
  const [sensorOnline, setSensorOnline] = useState(false);
  const [dropOpen,     setDropOpen]     = useState(false);
  const pageDescription = isBangla
    ? "লাইভ সেন্সর রিডিংকে আদর্শ প্যারামিটারের সাথে তুলনা করুন, অথবা যেকোনো ফসলের আদর্শ মান দেখুন"
    : "Compare live sensor readings against ideal parameters, or browse ideal values for any crop · ফসল বিশ্লেষণ";
  const compareLabel = isBangla ? "রিয়েলটাইম তুলনা" : "Compare with Realtime";
  const compareBnLabel = "রিয়েলটাইম তুলনা";

  // Firebase live listener
  useEffect(() => {
    const dbRef = ref(database, "soil_data/history");
    const unsub = onValue(dbRef, (snap) => {
      const history = snap.val() as Record<string, LiveSensor> | null;
      const data = pickLatestHistoryEntry(history);
      if (data) { setSensor(data); setSensorOnline(true); }
      else       { setSensorOnline(false); }
    }, () => setSensorOnline(false));
    return () => unsub();
  }, []);

  // Fetch ideal parameters from backend
  const fetchIdeal = useCallback(async (crop: string) => {
    setIdealLoading(true);
    setIdealError(null);
    setIdeal(null);
    try {
      const res = await fetch(`${API_BASE}/ideal-parameters/${encodeURIComponent(crop)}`);
      if (!res.ok) throw new Error(`${res.status}`);
      const data = await res.json();
      setIdeal(data.parameters ?? data);
    } catch (e) {
      setIdealError("Failed to load ideal parameters. Check backend connection.");
    } finally {
      setIdealLoading(false);
    }
  }, []);

  useEffect(() => { fetchIdeal(selectedCrop); }, [selectedCrop, fetchIdeal]);

  // Compute overall match score (soil/sensor params only)
  const matchScore = (() => {
    if (!ideal || !sensor) return null;
    const applicable = SOIL_PARAMS.filter((p) => {
      const v = p.sensorFn(sensor);
      return v !== undefined && ideal[p.key];
    });
    if (!applicable.length) return null;
    const inRange = applicable.filter((p) => {
      const v     = p.sensorFn(sensor)!;
      const stats = ideal[p.key];
      return v >= stats.min && v <= stats.max;
    });
    return Math.round((inRange.length / applicable.length) * 100);
  })();

  const selectedMeta = CROP_NAMES[selectedCrop];
  const grouped = TYPE_ORDER.map((t) => ({
    type: t, label: TYPE_LABELS[t],
    crops: ALL_CROPS.filter((c) => c.type === t),
  }));

  // Count status per param (soil/sensor only)
  const statusCounts = SOIL_PARAMS.reduce(
    (acc, p) => {
      if (!ideal || !ideal[p.key]) return acc;
      const v = p.sensorFn(sensor ?? {});
      const s = getStatus(v, ideal[p.key]);
      acc[s] = (acc[s] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <ProtectedLayout>
      <div className="space-y-6 animate-fade-in">
        <PageHeader
          title={isBangla ? "ফসল বিশ্লেষণ" : "Crop Analysis"}
          description={pageDescription}
          badge={isBangla ? "বিশ্লেষণ" : "Analysis"}
        />

        {/* ── Mode tab switcher ── */}
        <div className="flex gap-1 p-1 bg-gray-100 rounded-2xl w-fit">
          {([
            { key: "compare" as Mode, icon: ArrowLeftRight, label: compareLabel, bnLabel: compareBnLabel },
            { key: "ideal"   as Mode, icon: BookOpen,       label: isBangla ? "আদর্শ মান" : "Ideal Values", bnLabel: "আদর্শ মান" },
          ] as const).map(({ key, icon: Icon, label, bnLabel }) => (
            <button
              key={key}
              onClick={() => setMode(key)}
              className={cn(
                "flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all",
                mode === key
                  ? "bg-white text-green-700 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              )}
            >
              <Icon size={15} />
              <span className="hidden sm:inline">{label}</span>
              <span className="sm:hidden">{bnLabel}</span>
              <span className={cn(
                "hidden sm:inline text-xs font-normal opacity-60"
              )}>· {bnLabel}</span>
            </button>
          ))}
        </div>

        {/* ── Top control row ── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">

          {/* Crop selector */}
          <div className="relative">
            <button
              onClick={() => setDropOpen(!dropOpen)}
              className="flex items-center gap-3 pl-4 pr-3 py-3 bg-white border-2 border-green-200 rounded-2xl shadow-sm hover:border-green-400 transition-all min-w-[260px] justify-between"
            >
              <div className="flex items-center gap-2.5">
                <Leaf size={18} className="text-green-600" />
                <div className="text-left">
                  <p className="font-bold text-gray-900 text-sm capitalize">{selectedCrop}</p>
                  <p className="text-xs text-gray-400">{selectedMeta?.bn}</p>
                </div>
              </div>
              <ChevronDown size={16} className={cn("text-gray-400 transition-transform", dropOpen && "rotate-180")} />
            </button>

            {dropOpen && (
              <div className="absolute z-30 top-full mt-2 left-0 w-[300px] bg-white rounded-2xl shadow-xl border border-gray-100 max-h-[400px] overflow-y-auto">
                {grouped.map(({ type, label, crops }) => (
                  <div key={type}>
                    <div className="px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-gray-400 bg-gray-50 border-b border-gray-100 sticky top-0">
                      {label}
                    </div>
                    {crops.map((c) => (
                      <button
                        key={c.key}
                        onClick={() => { setSelectedCrop(c.key); setDropOpen(false); }}
                        className={cn(
                          "w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-green-50 transition-all",
                          selectedCrop === c.key && "bg-green-50 font-semibold text-green-700"
                        )}
                      >
                        <span className="capitalize">{c.label}</span>
                        <span className="text-xs text-gray-400">{c.bn}</span>
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sensor status pill — only relevant in compare mode */}
          {mode === "compare" && (
            <div className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-full border text-sm font-medium",
              sensorOnline
                ? "bg-green-50 border-green-200 text-green-700"
                : "bg-gray-50 border-gray-200 text-gray-500"
            )}>
              {sensorOnline
                ? <><Wifi size={14} /><span>Sensor Online</span><span className="w-2 h-2 rounded-full bg-green-500 animate-ping ml-1" /></>
                : <><WifiOff size={14} /><span>Sensor Offline</span></>
              }
            </div>
          )}

          {/* Refresh */}
          <button
            onClick={() => fetchIdeal(selectedCrop)}
            disabled={idealLoading}
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-white border border-gray-200 text-sm text-gray-600 hover:border-green-400 hover:text-green-700 transition-all disabled:opacity-50"
          >
            <RefreshCw size={14} className={cn(idealLoading && "animate-spin")} />
            {isBangla ? "রিফ্রেশ" : "Refresh"}
          </button>
        </div>

        {/* ── Summary strip — compare mode only ── */}
        {mode === "compare" && !idealLoading && ideal && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Match gauge */}
            <div className="col-span-2 sm:col-span-1 bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col items-center justify-center gap-1">
              {matchScore !== null ? (
                <>
                  <MatchGauge score={matchScore} />
                  <p className="text-xs text-gray-500 text-center -mt-1">
                    {isBangla ? "আদর্শ সীমার মধ্যে প্যারামিটার" : "Parameters within ideal range"}
                  </p>
                </>
              ) : (
                <div className="text-center">
                  <AlertCircle size={24} className="text-gray-300 mx-auto mb-1" />
                  <p className="text-xs text-gray-400">{isBangla ? "লাইভ সেন্সর ডেটা নেই" : "No live sensor data"}</p>
                </div>
              )}
            </div>

            {/* Status summary cards */}
            {[
              { status: "in_range" as Status, label: "In Range", bnLabel: "আদর্শ মাত্রায়", cls: "bg-green-50 border-green-200 text-green-700" },
              { status: "low"      as Status, label: "Too Low",  bnLabel: "কম",             cls: "bg-blue-50 border-blue-200 text-blue-700"   },
              { status: "high"     as Status, label: "Too High", bnLabel: "বেশি",           cls: "bg-red-50 border-red-200 text-red-700"       },
            ].map(({ status, label, bnLabel, cls }) => {
              const sm = STATUS_META[status];
              return (
                <div key={status} className={cn("rounded-2xl border p-4 flex flex-col gap-2", cls)}>
                  <div className="flex items-center gap-2">
                    <sm.icon size={16} />
                    <span className="font-semibold text-sm">{label}</span>
                  </div>
                  <p className="text-3xl font-black">{statusCounts[status] ?? 0}</p>
                  <p className="text-xs opacity-70">{bnLabel} · parameters</p>
                </div>
              );
            })}
          </div>
        )}

        {/* ── Error state ── */}
        {idealError && (
          <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm">
            <AlertCircle size={18} className="shrink-0" />
            {idealError}
          </div>
        )}

        {/* ── Parameter cards grid ── */}
        {([
          { group: "Soil & Sensor Parameters", bnGroup: "মাটি ও সেন্সর", params: SOIL_PARAMS },
          { group: "Weather Parameters",        bnGroup: "আবহাওয়া",       params: WEATHER_PARAMS },
        ]).map(({ group, bnGroup, params }) => (
          <div key={group} className="space-y-3">
            <div className="flex items-center gap-3">
              <h2 className="font-bold text-gray-700 text-sm tracking-wide">{group}</h2>
              <span className="text-xs text-gray-400">· {bnGroup}</span>
              <div className="flex-1 h-px bg-gray-200" />
              {group === "Weather Parameters" && mode === "compare" && (
                <span className="text-[10px] text-gray-400 bg-gray-50 border border-gray-200 rounded-full px-2.5 py-1">
                  Ideal range only · No live sensor
                </span>
              )}
            </div>
            {mode === "compare" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {params.map((p) => (
                  <ParamCard
                    key={p.key}
                    config={p}
                    stats={ideal?.[p.key]}
                    current={sensor ? p.sensorFn(sensor) : undefined}
                    loading={idealLoading}
                  />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {params.map((p) => (
                  <IdealParamCard
                    key={p.key}
                    config={p}
                    stats={ideal?.[p.key]}
                    loading={idealLoading}
                  />
                ))}
              </div>
            )}
          </div>
        ))}

        {/* ── Full stats table ── */}
        {!idealLoading && ideal && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Sprout size={18} className="text-green-600" />
                <h3 className="font-bold text-gray-900 text-sm">
                  {mode === "compare"
                    ? (isBangla ? "সম্পূর্ণ তুলনা টেবিল" : "Full Comparison Table")
                    : (isBangla ? "আদর্শ রেফারেন্স টেবিল" : "Ideal Reference Table")}
                  {" — "}
                  <span className="text-green-700 capitalize">{selectedCrop}</span>
                  <span className="ml-2 text-gray-400 font-normal">({selectedMeta?.bn})</span>
                </h3>
              </div>
              {mode === "ideal" && (
                  <span className="text-xs text-gray-400 bg-gray-50 border border-gray-200 rounded-full px-3 py-1">
                  {isBangla ? "শুধু আদর্শ রেফারেন্স · সেন্সর ছাড়া" : "Ideal reference only · সেন্সর ছাড়া"}
                </span>
              )}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {(mode === "compare"
                      ? ["Parameter", "Unit", "Min", "Mean", "Median", "Max", "Std Dev", "Live Value", "Status"]
                      : ["Parameter", "Unit", "Min", "Mean", "Median", "Max", "Std Dev"]
                    ).map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {PARAMS.map((p, i) => {
                    // Insert group header rows
                    const isFirstWeather = i === SOIL_PARAMS.length;
                    const groupHeader = isFirstWeather ? (
                      <tr key="weather-header" className="bg-sky-50">
                        <td colSpan={mode === "compare" ? 9 : 7} className="px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-sky-600">
                          Weather Parameters · আবহাওয়া
                        </td>
                      </tr>
                    ) : i === 0 ? (
                      <tr key="soil-header" className="bg-green-50">
                        <td colSpan={mode === "compare" ? 9 : 7} className="px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-green-700">
                          Soil & Sensor Parameters · মাটি ও সেন্সর
                        </td>
                      </tr>
                    ) : null;
                    const stats  = ideal[p.key];
                    if (!stats) return null;
                    const curr   = sensor ? p.sensorFn(sensor) : undefined;
                    const status = mode === "compare" ? getStatus(curr, stats) : "no_sensor" as Status;
                    const sm     = STATUS_META[status];
                    const c      = COLOR[p.color as keyof typeof COLOR];
                    return (
                      <Fragment key={p.key}>
                        {groupHeader}
                      <tr className="hover:bg-gray-50/70 transition-colors">
                        <td className="px-4 py-3 font-semibold text-gray-900">
                          <div className="flex items-center gap-2">
                            <p.icon size={14} className={c.text} />
                            {p.label}
                          </div>
                          <div className="text-xs text-gray-400">{p.bnLabel}</div>
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-xs">{p.unit || "—"}</td>
                        <td className="px-4 py-3 text-blue-600 font-medium">{formatNumber(stats.min, p.decimals)}</td>
                        <td className="px-4 py-3 text-gray-700 font-bold">{formatNumber(stats.mean, p.decimals)}</td>
                        <td className="px-4 py-3 text-gray-600">{formatNumber(stats.median, p.decimals)}</td>
                        <td className="px-4 py-3 text-red-600 font-medium">{formatNumber(stats.max, p.decimals)}</td>
                        <td className="px-4 py-3 text-gray-400">±{formatNumber(stats.std, p.decimals)}</td>
                        {mode === "compare" && (
                          <>
                            <td className="px-4 py-3">
                              {curr !== undefined
                                ? <span className={cn("font-black text-base", c.text)}>{formatNumber(curr, p.decimals)}</span>
                                : <span className="text-gray-300">—</span>
                              }
                            </td>
                            <td className="px-4 py-3">
                              <span className={cn("flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full border w-fit whitespace-nowrap", sm.cls)}>
                                <sm.icon size={10} />
                                {sm.label}
                              </span>
                            </td>
                          </>
                        )}
                      </tr>
                      </Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </ProtectedLayout>
  );
}

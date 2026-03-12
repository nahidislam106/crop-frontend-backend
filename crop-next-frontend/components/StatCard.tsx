import { cn } from "@/lib/utils";

interface StatCardProps {
  label:    string;
  value:    string | number;
  unit?:    string;
  icon:     React.ReactNode;
  status?:  "green" | "yellow" | "red" | "neutral";
  sub?:     string;
  className?: string;
}

const statusRing = {
  green:   "ring-green-100",
  yellow:  "ring-yellow-100",
  red:     "ring-red-100",
  neutral: "ring-gray-100",
};

const statusIcon = {
  green:   "bg-green-50  text-green-600",
  yellow:  "bg-yellow-50 text-yellow-600",
  red:     "bg-red-50    text-red-600",
  neutral: "bg-gray-50   text-gray-500",
};

const statusDot = {
  green:   "bg-green-500",
  yellow:  "bg-yellow-500",
  red:     "bg-red-500",
  neutral: "bg-gray-400",
};

export default function StatCard({ label, value, unit, icon, status = "neutral", sub, className }: StatCardProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-2xl p-5 border border-gray-100 shadow-sm card-hover ring-1",
        statusRing[status],
        className
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center text-lg", statusIcon[status])}>
          {icon}
        </div>
        {status !== "neutral" && (
          <span
            className={cn(
              "live-dot w-2.5 h-2.5 rounded-full mt-1",
              statusDot[status]
            )}
          />
        )}
      </div>
      <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
      <div className="flex items-baseline gap-1.5">
        <span className="text-2xl font-bold text-gray-900">{value}</span>
        {unit && <span className="text-sm text-gray-400 font-medium">{unit}</span>}
      </div>
      {sub && <p className="text-xs text-gray-400 mt-1.5">{sub}</p>}
    </div>
  );
}

import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title:       string;
  description?: string;
  badge?:      string;
  action?:     React.ReactNode;
  className?:  string;
}

export default function PageHeader({ title, description, badge, action, className }: PageHeaderProps) {
  return (
    <div className={cn("flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8", className)}>
      <div>
        {badge && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full mb-3">
            <span className="live-dot w-1.5 h-1.5 bg-green-500 rounded-full" />
            {badge}
          </span>
        )}
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">{title}</h1>
        {description && (
          <p className="text-gray-500 mt-1.5 text-sm leading-relaxed">{description}</p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

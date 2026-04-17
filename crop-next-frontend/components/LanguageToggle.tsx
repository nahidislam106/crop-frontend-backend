"use client";

import { Languages } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { cn } from "@/lib/utils";

interface LanguageToggleProps {
  className?: string;
  compact?: boolean;
}

export default function LanguageToggle({ className, compact = false }: LanguageToggleProps) {
  const { language, toggleLanguage, isBangla } = useLanguage();

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      className={cn(
        "flex items-center gap-2 rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition-all",
        compact ? "px-3 py-1.5" : "px-3.5 py-2",
        className
      )}
      title={isBangla ? "Switch to English" : "বাংলায় বদলান"}
    >
      <Languages size={14} className="text-green-600" />
      <span className="text-xs font-semibold">{language === "bn" ? "বাংলা" : "English"}</span>
    </button>
  );
}
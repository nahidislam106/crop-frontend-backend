"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/lib/auth-context";
import { useLanguage } from "@/lib/language-context";
import LanguageToggle from "@/components/LanguageToggle";
import {
  LayoutDashboard,
  Sprout,
  FlaskConical,
  CloudSun,
  BarChart2,
  User,
  LogOut,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  {
    label: "Dashboard",
    href:  "/dashboard",
    icon:  LayoutDashboard,
  },
  {
    label: "Soil Data",
    href:  "/soil",
    icon:  FlaskConical,
  },
  {
    label: "Weather",
    href:  "/weather",
    icon:  CloudSun,
  },
  {
    label: "Recommend",
    href:  "/recommend",
    icon:  Sprout,
  },
  {
    label: "Analysis",
    href:  "/analysis",
    icon:  BarChart2,
  },
];

export default function Navbar() {
  const pathname          = usePathname();
  const router            = useRouter();
  const { user }          = useAuth();
  const { language } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  const navLabels = {
    dashboard: language === "bn" ? "ড্যাশবোর্ড" : "Dashboard",
    soil: language === "bn" ? "মাটি" : "Soil Data",
    weather: language === "bn" ? "আবহাওয়া" : "Weather",
    recommend: language === "bn" ? "সুপারিশ" : "Recommend",
    analysis: language === "bn" ? "বিশ্লেষণ" : "Analysis",
    profile: language === "bn" ? "আমার প্রোফাইল" : "My Profile",
    signOut: language === "bn" ? "সাইন আউট" : "Sign Out",
    live: language === "bn" ? "লাইভ" : "Live",
  };

  const initials = user?.displayName
    ? user.displayName.slice(0, 2).toUpperCase()
    : user?.email?.slice(0, 2).toUpperCase() ?? "?";

  return (
    <>
      {/* Top bar */}
      <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-gray-200/60 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              href="/dashboard"
              className="flex items-center gap-2.5 group"
            >
              <div className="w-8 h-8 rounded-lg overflow-hidden shadow-sm ring-1 ring-green-100 group-hover:shadow-green-200 group-hover:scale-105 transition-all">
                <Image
                  src="/logo.png"
                  alt="AgriSense Logo"
                  width={32}
                  height={32}
                  className="w-8 h-8 object-cover"
                  priority
                />
              </div>
              <span className="font-bold text-gray-900 text-lg tracking-tight">
                Agri<span className="gradient-text">Sense</span>
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map(({ label, href, icon: Icon }) => {
                const active = pathname === href || pathname.startsWith(href + "/");
                const localizedLabel = href === "/dashboard"
                  ? navLabels.dashboard
                  : href === "/soil"
                  ? navLabels.soil
                  : href === "/weather"
                  ? navLabels.weather
                  : href === "/recommend"
                  ? navLabels.recommend
                  : navLabels.analysis;
                return (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all",
                      active
                        ? "bg-green-50 text-green-700 shadow-sm"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    )}
                  >
                    <Icon size={16} />
                    {localizedLabel}
                  </Link>
                );
              })}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-3">
              <LanguageToggle compact className="hidden sm:flex" />

              {/* Live indicator */}
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-green-50 rounded-full border border-green-200">
                <span className="live-dot w-2 h-2 rounded-full bg-green-500" />
                <span className="text-xs font-medium text-green-700">{navLabels.live}</span>
              </div>

              {/* Profile dropdown */}
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-xl hover:bg-gray-100 transition-all group"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                    {initials}
                  </div>
                  <ChevronDown
                    size={14}
                    className={cn(
                      "text-gray-500 transition-transform",
                      profileOpen && "rotate-180"
                    )}
                  />
                </button>

                {profileOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setProfileOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 z-20 animate-fade-in overflow-hidden">
                      {/* User info */}
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {user?.displayName || (language === "bn" ? "কৃষক" : "Farmer")}
                        </p>
                        <p className="text-xs text-gray-500 truncate mt-0.5">
                          {user?.email}
                        </p>
                      </div>
                      <div className="p-2">
                        <Link
                          href="/profile"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition-all"
                        >
                          <User size={15} className="text-gray-400" />
                          {navLabels.profile}
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-red-600 hover:bg-red-50 transition-all mt-1"
                        >
                          <LogOut size={15} />
                          {navLabels.signOut}
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Mobile hamburger */}
              <button
                className="md:hidden p-2 rounded-xl hover:bg-gray-100 transition-all"
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden bg-white/95 border-t border-gray-100 px-4 py-3 space-y-1 animate-slide-up backdrop-blur-sm">
            {navLinks.map(({ label, href, icon: Icon }) => {
              const active = pathname === href;
              const localizedLabel = href === "/dashboard"
                ? navLabels.dashboard
                : href === "/soil"
                ? navLabels.soil
                : href === "/weather"
                ? navLabels.weather
                : href === "/recommend"
                ? navLabels.recommend
                : navLabels.analysis;
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                    active
                      ? "bg-green-50 text-green-700"
                      : "text-gray-600 hover:bg-gray-50"
                  )}
                >
                  <Icon size={18} />
                  {localizedLabel}
                </Link>
              );
            })}
            <div className="pt-2 border-t border-gray-100 mt-2">
              <Link
                href="/profile"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-gray-700 hover:bg-gray-50"
              >
                <User size={18} />
                {navLabels.profile}
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-red-600 hover:bg-red-50"
              >
                <LogOut size={18} />
                {navLabels.signOut}
              </button>
              <LanguageToggle className="w-full justify-start rounded-xl px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 mt-1 border-gray-100" />
            </div>
          </div>
        )}
      </header>

      {/* Spacer */}
      <div className="h-16" />
    </>
  );
}

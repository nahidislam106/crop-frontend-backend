"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { updateProfile, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/lib/auth-context";
import ProtectedLayout from "@/components/ProtectedLayout";
import PageHeader from "@/components/PageHeader";
import {
  User, Mail, MapPin, Lock, Save, Trash2, CheckCircle2,
  AlertCircle, Eye, EyeOff, Calendar, Sprout,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Profile {
  name:          string;
  village:       string;
  district:      string;
  subDistrict:   string;
  detailedAddr:  string;
}

interface PredictionEntry {
  date:       string;
  prediction: string;
  sensorData?: Record<string, unknown>;
}

type LandPredictions = Record<string, PredictionEntry[]>;

export default function ProfilePage() {
  const { user }   = useAuth();
  const router     = useRouter();

  const [profile, setProfile] = useState<Profile>({
    name: "", village: "", district: "", subDistrict: "", detailedAddr: "",
  });
  const [editMode,  setEditMode]  = useState(false);
  const [saving,    setSaving]    = useState(false);
  const [alert,     setAlert]     = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [lands,     setLands]     = useState<LandPredictions>({});
  const [activeLand, setActiveLand] = useState<string | null>(null);

  // Password change
  const [curPw,   setCurPw]   = useState("");
  const [newPw,   setNewPw]   = useState("");
  const [showPw,  setShowPw]  = useState(false);
  const [pwSaving, setPwSaving] = useState(false);

  useEffect(() => {
    if (!user) { router.replace("/login"); return; }
    const saved = JSON.parse(localStorage.getItem(`profile_${user.uid}`) ?? "null");
    if (saved) {
      setProfile({
        name:         saved.name ?? "",
        village:      saved.address?.village ?? "",
        district:     saved.address?.district ?? "",
        subDistrict:  saved.address?.subDistrict ?? "",
        detailedAddr: saved.address?.detailedAddress ?? saved.address ?? "",
      });
    } else {
      setProfile((p) => ({ ...p, name: user.displayName ?? "" }));
    }
    const preds: LandPredictions = JSON.parse(localStorage.getItem(`predictions_${user.uid}`) ?? "{}") || {};
    setLands(preds);
    if (Object.keys(preds).length > 0) setActiveLand(Object.keys(preds)[0]);
  }, [user, router]);

  const showAlert = (msg: string, type: "success" | "error") => {
    setAlert({ msg, type });
    setTimeout(() => setAlert(null), 4000);
  };

  const saveProfile = async () => {
    if (!user) return;
    if (!profile.name) { showAlert("Name is required.", "error"); return; }
    setSaving(true);
    try {
      await updateProfile(user, { displayName: profile.name });
      localStorage.setItem(`profile_${user.uid}`, JSON.stringify({
        name:  profile.name,
        email: user.email,
        address: {
          village:      profile.village,
          district:     profile.district,
          subDistrict:  profile.subDistrict,
          detailedAddress: profile.detailedAddr,
        },
      }));
      showAlert("Profile updated successfully!", "success");
      setEditMode(false);
    } catch {
      showAlert("Failed to update profile.", "error");
    } finally {
      setSaving(false);
    }
  };

  const changePassword = async () => {
    if (!user || !user.email) return;
    if (!curPw || !newPw) { showAlert("Fill in both password fields.", "error"); return; }
    if (newPw.length < 6) { showAlert("New password must be 6+ characters.", "error"); return; }
    setPwSaving(true);
    try {
      const cred = EmailAuthProvider.credential(user.email, curPw);
      await reauthenticateWithCredential(user, cred);
      await updatePassword(user, newPw);
      setCurPw(""); setNewPw("");
      showAlert("Password changed successfully!", "success");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed";
      showAlert(msg.replace("Firebase: ", "").replace(/ \(auth.*?\)/, ""), "error");
    } finally {
      setPwSaving(false);
    }
  };

  const deleteLand = (land: string) => {
    const updated = { ...lands };
    delete updated[land];
    setLands(updated);
    if (user) localStorage.setItem(`predictions_${user.uid}`, JSON.stringify(updated));
    setActiveLand(Object.keys(updated)[0] ?? null);
  };

  const initials = user?.displayName?.slice(0, 2).toUpperCase() ?? user?.email?.slice(0, 2).toUpperCase() ?? "??";
  const totalPreds = Object.values(lands).reduce((a, e) => a + e.length, 0);

  return (
    <ProtectedLayout>
      <PageHeader title="My Profile" description="Manage your account and view saved predictions" />

      {alert && (
        <div
          className={cn(
            "fixed bottom-6 right-6 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-lg border text-sm font-medium z-50 animate-slide-up",
            alert.type === "success"
              ? "bg-green-50 border-green-200 text-green-800"
              : "bg-red-50 border-red-200 text-red-800"
          )}
        >
          {alert.type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          {alert.msg}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left col */}
        <div className="space-y-4">
          {/* Avatar card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 shadow-lg">
              {initials}
            </div>
            <h2 className="font-bold text-gray-900 text-lg">{user?.displayName || "Farmer"}</h2>
            <p className="text-gray-400 text-sm mt-0.5">{user?.email}</p>
            <div className="flex justify-center gap-4 mt-4">
              <div className="text-center">
                <div className="text-xl font-bold text-gray-900">{Object.keys(lands).length}</div>
                <div className="text-xs text-gray-400">Land Parcels</div>
              </div>
              <div className="w-px bg-gray-100" />
              <div className="text-center">
                <div className="text-xl font-bold text-gray-900">{totalPreds}</div>
                <div className="text-xs text-gray-400">Predictions</div>
              </div>
            </div>
          </div>

          {/* Change password */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-bold text-gray-900 text-sm mb-4 flex items-center gap-2">
              <Lock size={15} className="text-gray-400" /> Change Password
            </h3>
            <div className="space-y-3">
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPw ? "text" : "password"}
                  value={curPw}
                  onChange={(e) => setCurPw(e.target.value)}
                  placeholder="Current password"
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-50 focus:bg-white transition-all"
                />
              </div>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPw ? "text" : "password"}
                  value={newPw}
                  onChange={(e) => setNewPw(e.target.value)}
                  placeholder="New password"
                  className="w-full pl-9 pr-10 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-50 focus:bg-white transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              <button
                onClick={changePassword}
                disabled={pwSaving}
                className="w-full py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-gray-800 transition-all disabled:opacity-60"
              >
                {pwSaving ? "Updating…" : "Update Password"}
              </button>
            </div>
          </div>
        </div>

        {/* Right col */}
        <div className="lg:col-span-2 space-y-4">
          {/* Profile info */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                <User size={15} className="text-gray-400" /> Personal Information
              </h3>
              {!editMode ? (
                <button
                  onClick={() => setEditMode(true)}
                  className="text-xs text-green-600 bg-green-50 border border-green-200 px-3 py-1.5 rounded-lg font-medium hover:bg-green-100 transition-all"
                >
                  Edit
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditMode(false)}
                    className="text-xs text-gray-500 px-3 py-1.5 rounded-lg font-medium hover:bg-gray-100 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveProfile}
                    disabled={saving}
                    className="flex items-center gap-1.5 text-xs text-white bg-green-500 px-3 py-1.5 rounded-lg font-medium hover:bg-green-600 transition-all disabled:opacity-60"
                  >
                    <Save size={12} />
                    {saving ? "Saving…" : "Save"}
                  </button>
                </div>
              )}
            </div>
            <div className="p-6 grid sm:grid-cols-2 gap-4">
              {[
                { label: "Full Name",     key: "name",        icon: <User size={14} />,    type: "text" },
                { label: "Email",         key: "email",       icon: <Mail size={14} />,    type: "email", disabled: true, value: user?.email ?? "" },
                { label: "Village",       key: "village",     icon: <MapPin size={14} />,  type: "text" },
                { label: "Sub-district",  key: "subDistrict", icon: <MapPin size={14} />,  type: "text" },
                { label: "District",      key: "district",    icon: <MapPin size={14} />,  type: "text" },
                { label: "Detailed Addr", key: "detailedAddr",icon: <MapPin size={14} />,  type: "text" },
              ].map(({ label, key, icon, type, disabled, value: overrideVal }) => {
                const val = overrideVal !== undefined ? overrideVal : profile[key as keyof Profile];
                return (
                  <div key={key}>
                    <label className="block text-xs font-medium text-gray-500 mb-1.5 flex items-center gap-1.5">
                      {icon} {label}
                    </label>
                    {editMode && !disabled ? (
                      <input
                        type={type}
                        value={val}
                        onChange={(e) => setProfile((p) => ({ ...p, [key]: e.target.value }))}
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-50 focus:bg-white transition-all"
                      />
                    ) : (
                      <p className="text-sm text-gray-800 font-medium px-3 py-2.5 bg-gray-50 rounded-xl truncate">
                        {val || <span className="text-gray-400">—</span>}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Saved predictions */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
              <Sprout size={15} className="text-green-600" />
              <h3 className="font-bold text-gray-900 text-sm">Saved Predictions</h3>
              <span className="ml-auto text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{totalPreds} total</span>
            </div>

            {Object.keys(lands).length === 0 ? (
              <div className="p-8 text-center">
                <Sprout size={28} className="text-gray-200 mx-auto mb-3" />
                <p className="text-sm text-gray-400">No saved predictions yet.</p>
                <p className="text-xs text-gray-300 mt-1">Use the Recommendation page to generate and save predictions.</p>
              </div>
            ) : (
              <div className="p-4">
                {/* Land tabs */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {Object.keys(lands).map((land) => (
                    <button
                      key={land}
                      onClick={() => setActiveLand(land)}
                      className={cn(
                        "text-xs px-3 py-1.5 rounded-lg font-medium transition-all truncate max-w-[180px]",
                        activeLand === land
                          ? "bg-green-100 text-green-700 border border-green-300"
                          : "bg-gray-100 text-gray-500 border border-gray-200 hover:bg-gray-200"
                      )}
                    >
                      <MapPin size={10} className="inline mr-1" />
                      {land}
                    </button>
                  ))}
                </div>

                {activeLand && lands[activeLand] && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-semibold text-gray-800 truncate">{activeLand}</h4>
                      <button
                        onClick={() => deleteLand(activeLand)}
                        className="flex items-center gap-1 text-xs text-red-500 hover:bg-red-50 px-2 py-1 rounded-lg transition-all"
                      >
                        <Trash2 size={12} /> Delete land
                      </button>
                    </div>
                    <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                      {lands[activeLand].map((entry, i) => (
                        <div key={i} className="flex items-start gap-3 bg-gray-50 rounded-xl p-3 border border-gray-100">
                          <div className="w-7 h-7 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                            <Calendar size={12} className="text-green-600" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-medium text-gray-700 truncate">{entry.prediction}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{entry.date}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedLayout>
  );
}

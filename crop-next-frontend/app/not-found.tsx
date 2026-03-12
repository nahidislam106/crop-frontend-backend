import Link from "next/link";
import { Leaf } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Leaf size={28} className="text-green-500" />
        </div>
        <h1 className="text-6xl font-bold text-gray-800 mb-3">404</h1>
        <p className="text-gray-500 text-lg mb-6">Page not found</p>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold px-6 py-3 rounded-xl shadow hover:shadow-green-200 hover:shadow-lg transition-all"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      setError("נא למלא את כל השדות");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email: email.trim(),
        password: password.trim(),
        redirect: false,
      });

      if (result?.error) {
        setError("פרטי כניסה שגויים");
        return;
      }

      // בדיקה שהכניסה הצליחה
      const session = await getSession();
      if (session?.user) {
        router.push("/admin/dashboard");
      } else {
        setError("שגיאה בכניסה למערכת");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("שגיאה בכניסה למערכת");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      {/* לינק חזרה לדף הבית */}
      <Link
        href="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
      >
        <span className="text-xl">←</span>
        <span>חזרה לדף הבית</span>
      </Link>

      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* כותרת */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">👨‍💼 Admin Panel</h1>
          <p className="text-blue-100">כניסה למערכת הניהול</p>
        </div>

        {/* טופס כניסה */}
        <form onSubmit={handleSubmit} className="p-8">
          {/* שדה אימיל */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              כתובת אימיל
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="admin@restaurant.com"
              disabled={isLoading}
              required
            />
          </div>

          {/* שדה סיסמה */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              סיסמה
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="••••••"
              disabled={isLoading}
              required
            />
          </div>

          {/* הודעת שגיאה */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* כפתור כניסה */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-4 rounded-lg font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                <span>מתחבר...</span>
              </div>
            ) : (
              "כניסה למערכת"
            )}
          </button>
        </form>

        {/* מידע דמו */}
        <div className="bg-gray-50 px-8 py-6 border-t">
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            🧪 פרטי כניסה לדמו:
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">אימיל:</span>
              <span className="font-mono bg-gray-200 px-2 py-1 rounded text-xs">
                admin@restaurant.com
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">סיסמה:</span>
              <span className="font-mono bg-gray-200 px-2 py-1 rounded text-xs">
                123456
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

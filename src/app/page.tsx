"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Business {
  id: string;
  name: string;
  description?: string;
  logo?: string;
}

export default function HomePage() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // לצורך דמו, נשתמש ב-ID שיצרנו
    setBusinesses([
      {
        id: "cmckqidpo0000vqzw503br23a",
        name: "מסעדת דמו",
        description: "מסעדה לדוגמה לבדיקת המערכת",
      },
    ]);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">טוען...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* כותרת עליונה */}
      <header className="bg-white shadow-lg border-b-4 border-blue-500">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              🍽️ מערכת הזמנות חכמה
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              מסך הזמנות דיגיטלי מתקדם לעסקי מזון עם ניהול מלא וחוויית משתמש
              מושלמת
            </p>
          </div>
        </div>
      </header>

      {/* תוכן ראשי */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* סטטיסטיקות מהירות */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center border-l-4 border-green-500">
            <div className="text-3xl mb-2">📱</div>
            <h3 className="font-bold text-gray-800 mb-1">מסך הזמנות</h3>
            <p className="text-gray-600 text-sm">ממשק מתקדם ללקוחות</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 text-center border-l-4 border-blue-500">
            <div className="text-3xl mb-2">👨‍💼</div>
            <h3 className="font-bold text-gray-800 mb-1">Admin Panel</h3>
            <p className="text-gray-600 text-sm">ניהול מלא של המערכת</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 text-center border-l-4 border-purple-500">
            <div className="text-3xl mb-2">🚀</div>
            <h3 className="font-bold text-gray-800 mb-1">אוטומציה</h3>
            <p className="text-gray-600 text-sm">מייל, WhatsApp ומדפסת</p>
          </div>
        </div>

        {/* רשימת עסקים */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            עסקים במערכת
          </h2>

          <div className="grid gap-6">
            {businesses.map((business) => (
              <div
                key={business.id}
                className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-100 hover:border-blue-300 transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {business.logo ? (
                      <img
                        src={business.logo}
                        alt={business.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                        {business.name.charAt(0)}
                      </div>
                    )}

                    <div>
                      <h3 className="text-2xl font-bold text-gray-800">
                        {business.name}
                      </h3>
                      {business.description && (
                        <p className="text-gray-600 mt-1">
                          {business.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Link
                      href={`/screen/${business.id}`}
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-bold transition-colors duration-200 flex items-center gap-2"
                    >
                      <span>🛍️</span>
                      <span>מסך הזמנות</span>
                    </Link>

                    <Link
                      href="/admin/login"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold transition-colors duration-200 flex items-center gap-2"
                    >
                      <span>👨‍💼</span>
                      <span>Admin</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* מידע נוסף */}
        <div className="mt-12 bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            🔧 פרטי כניסה למערכת
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg p-6">
              <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <span>🛍️</span>
                <span>מסך הזמנות לקוחות</span>
              </h3>
              <p className="text-gray-600 mb-2">
                <strong>קישור:</strong> /screen/{businesses[0]?.id}
              </p>
              <p className="text-gray-600">
                ממשק הזמנות מלא עם בחירת סוג הזמנה, קטגוריות, מוצרים וסל קניות
              </p>
            </div>

            <div className="bg-white rounded-lg p-6">
              <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <span>👨‍💼</span>
                <span>Admin Panel</span>
              </h3>
              <p className="text-gray-600 mb-1">
                <strong>אימיל:</strong> admin@restaurant.com
              </p>
              <p className="text-gray-600 mb-2">
                <strong>סיסמה:</strong> 123456
              </p>
              <p className="text-gray-600">
                ניהול מלא של העסק, קטגוריות, מוצרים והזמנות
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* תחתית */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-gray-300">
            🚀 מערכת הזמנות חכמה לעסקי מזון - פותח עם Next.js, Prisma ו-Railway
          </p>
        </div>
      </footer>
    </div>
  );
}

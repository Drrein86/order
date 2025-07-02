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
    // לצורך דמו, נשתמש ב-ID של העסק הקיים
    setBusinesses([
      {
        id: "cmcl7qfe00000vquscnsinlly",
        name: "פיצה אקספרס",
        description: "הפיצה הטובה ביותר בעיר",
        logo: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=400&fit=crop&crop=center",
      },
    ]);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-primary">
        <div className="text-center text-white">
          <div className="animate-pulse-slow rounded-full h-20 w-20 border-4 border-white border-t-transparent mx-auto mb-6"></div>
          <p className="text-xl font-semibold">טוען מערכת הזמנות...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* כותרת עליונה */}
      <header className="relative overflow-hidden">
        {/* רקע דינמי */}
        <div className="absolute inset-0 gradient-primary opacity-90"></div>
        <div className="absolute inset-0 bg-black opacity-20"></div>

        {/* תמונת רקע */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1920&h=600&fit=crop&crop=center"
            alt="רקע מסעדה"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="relative max-w-6xl mx-auto px-6 py-16">
          <div className="text-center text-white">
            <div className="animate-fade-in-up">
              <h1 className="text-5xl md:text-7xl font-bold mb-6 drop-shadow-lg">
                🍽️ מערכת הזמנות חכמה
              </h1>
              <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-8 drop-shadow-md">
                מסך הזמנות דיגיטלי מתקדם לעסקי מזון עם ניהול מלא וחוויית משתמש
                מושלמת
              </p>
              <div className="flex justify-center gap-4">
                <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-full px-6 py-2 text-sm">
                  📱 ממשק מתקדם
                </div>
                <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-full px-6 py-2 text-sm">
                  🚀 אוטומציה מלאה
                </div>
                <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-full px-6 py-2 text-sm">
                  💳 תשלום דיגיטלי
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* תוכן ראשי */}
      <main className="max-w-6xl mx-auto px-6 py-16">
        {/* סטטיסטיקות מהירות */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="card-modern p-8 text-center hover-lift animate-fade-in-up">
            <div className="w-20 h-20 gradient-success rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
              📱
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">
              מסך הזמנות
            </h3>
            <p className="text-gray-600">
              ממשק מתקדם ללקוחות עם חוויית משתמש מושלמת
            </p>
          </div>

          <div
            className="card-modern p-8 text-center hover-lift animate-fade-in-up"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="w-20 h-20 gradient-accent rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
              👨‍💼
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">
              Admin Panel
            </h3>
            <p className="text-gray-600">ניהול מלא של המערכת עם דשבורד מתקדם</p>
          </div>

          <div
            className="card-modern p-8 text-center hover-lift animate-fade-in-up"
            style={{ animationDelay: "0.4s" }}
          >
            <div className="w-20 h-20 gradient-warning rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
              🚀
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">אוטומציה</h3>
            <p className="text-gray-600">
              שליחה אוטומטית למייל, WhatsApp ומדפסת
            </p>
          </div>
        </div>

        {/* רשימת עסקים */}
        <div className="card-modern p-12 mb-16">
          <h2 className="text-4xl font-bold text-center mb-12 text-gradient">
            עסקים במערכת
          </h2>

          <div className="grid gap-8">
            {businesses.map((business, index) => (
              <div
                key={business.id}
                className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border-2 border-blue-100 hover:border-blue-300 transition-all duration-300 hover-lift animate-slide-in-left"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="image-container w-24 h-24">
                      <img
                        src={business.logo}
                        alt={business.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div>
                      <h3 className="text-3xl font-bold text-gray-800 mb-2">
                        {business.name}
                      </h3>
                      {business.description && (
                        <p className="text-gray-600 text-lg">
                          {business.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Link
                      href={`/screen/${business.id}`}
                      className="btn-modern flex items-center gap-3"
                    >
                      <span className="text-xl">🛍️</span>
                      <span>מסך הזמנות</span>
                    </Link>

                    <Link
                      href="/admin/login"
                      className="btn-modern flex items-center gap-3"
                      style={{ background: "var(--secondary-gradient)" }}
                    >
                      <span className="text-xl">👨‍💼</span>
                      <span>Admin</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* תכונות מתקדמות */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div className="card-modern p-8 hover-lift">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 gradient-success rounded-full flex items-center justify-center text-2xl">
                🎨
              </div>
              <h3 className="text-2xl font-bold text-gray-800">עיצוב מתקדם</h3>
            </div>
            <p className="text-gray-600 mb-4">
              ממשק משתמש מודרני עם אנימציות חלקות, גרדיאנטים יפים ותמונות
              איכותיות
            </p>
            <ul className="space-y-2 text-gray-600">
              <li>✅ תמונות איכותיות לכל מוצר</li>
              <li>✅ אנימציות מתקדמות</li>
              <li>✅ עיצוב רספונסיבי</li>
              <li>✅ חוויית משתמש מושלמת</li>
            </ul>
          </div>

          <div className="card-modern p-8 hover-lift">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 gradient-accent rounded-full flex items-center justify-center text-2xl">
                ⚡
              </div>
              <h3 className="text-2xl font-bold text-gray-800">
                ביצועים מעולים
              </h3>
            </div>
            <p className="text-gray-600 mb-4">
              מערכת מהירה ויעילה עם טעינה מהירה ותגובה חלקה
            </p>
            <ul className="space-y-2 text-gray-600">
              <li>✅ טעינה מהירה</li>
              <li>✅ תגובה חלקה</li>
              <li>✅ אבטחה מתקדמת</li>
              <li>✅ זמינות גבוהה</li>
            </ul>
          </div>
        </div>

        {/* פרטי כניסה */}
        <div className="card-modern p-12 bg-gradient-to-r from-purple-50 to-pink-50">
          <h2 className="text-3xl font-bold text-center mb-8 text-gradient">
            🔧 פרטי כניסה למערכת
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="card-modern p-6 bg-white">
              <h3 className="font-bold text-xl text-gray-800 mb-4 flex items-center gap-3">
                <span className="text-2xl">🛍️</span>
                <span>מסך הזמנות לקוחות</span>
              </h3>
              <p className="text-gray-600 mb-3">
                <strong>קישור:</strong> /screen/{businesses[0]?.id}
              </p>
              <p className="text-gray-600 mb-4">
                ממשק הזמנות מלא עם בחירת סוג הזמנה, קטגוריות, מוצרים וסל קניות
              </p>
              <div className="flex gap-2">
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                  ממשק מתקדם
                </span>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  תמונות איכותיות
                </span>
              </div>
            </div>

            <div className="card-modern p-6 bg-white">
              <h3 className="font-bold text-xl text-gray-800 mb-4 flex items-center gap-3">
                <span className="text-2xl">👨‍💼</span>
                <span>Admin Panel</span>
              </h3>
              <p className="text-gray-600 mb-1">
                <strong>אימיל:</strong> admin@pizza-express.co.il
              </p>
              <p className="text-gray-600 mb-4">
                <strong>סיסמה:</strong> admin123
              </p>
              <p className="text-gray-600 mb-4">
                ניהול מלא של העסק, קטגוריות, מוצרים והזמנות
              </p>
              <div className="flex gap-2">
                <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                  ניהול מלא
                </span>
                <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm">
                  דשבורד מתקדם
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* תחתית */}
      <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="mb-6">
            <h3 className="text-2xl font-bold mb-2">🍽️ מערכת הזמנות חכמה</h3>
            <p className="text-gray-300">פותח עם Next.js, Prisma ו-Railway</p>
          </div>
          <div className="flex justify-center gap-6 text-sm text-gray-400">
            <span>📧 תמיכה טכנית</span>
            <span>🔒 אבטחה מתקדמת</span>
            <span>📱 רספונסיבי</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

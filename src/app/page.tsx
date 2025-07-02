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
        <div className="text-center text-white px-4">
          <div className="animate-pulse-slow rounded-full h-16 w-16 sm:h-20 sm:w-20 border-4 border-white border-t-transparent mx-auto mb-6"></div>
          <p className="text-lg sm:text-xl font-semibold">
            טוען מערכת הזמנות...
          </p>
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

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="text-center text-white">
            <div className="animate-fade-in-up">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 drop-shadow-lg">
                🍽️ מערכת הזמנות חכמה
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto mb-6 sm:mb-8 drop-shadow-md px-4">
                מסך הזמנות דיגיטלי מתקדם לעסקי מזון עם ניהול מלא וחוויית משתמש
                מושלמת
              </p>
              <div className="flex flex-wrap justify-center gap-2 sm:gap-4 px-4">
                <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-full px-4 sm:px-6 py-2 text-xs sm:text-sm">
                  📱 ממשק מתקדם
                </div>
                <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-full px-4 sm:px-6 py-2 text-xs sm:text-sm">
                  🚀 אוטומציה מלאה
                </div>
                <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-full px-4 sm:px-6 py-2 text-xs sm:text-sm">
                  💳 תשלום דיגיטלי
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* תוכן ראשי */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        {/* סטטיסטיקות מהירות */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
          <div className="card-modern p-6 sm:p-8 text-center hover-lift animate-fade-in-up">
            <div className="w-16 h-16 sm:w-20 sm:h-20 gradient-success rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 text-2xl sm:text-3xl">
              📱
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 sm:mb-3">
              מסך הזמנות
            </h3>
            <p className="text-gray-600 text-sm sm:text-base">
              ממשק מתקדם ללקוחות עם חוויית משתמש מושלמת
            </p>
          </div>

          <div
            className="card-modern p-6 sm:p-8 text-center hover-lift animate-fade-in-up"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 gradient-accent rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 text-2xl sm:text-3xl">
              👨‍💼
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 sm:mb-3">
              Admin Panel
            </h3>
            <p className="text-gray-600 text-sm sm:text-base">
              ניהול מלא של המערכת עם דשבורד מתקדם
            </p>
          </div>

          <div
            className="card-modern p-6 sm:p-8 text-center hover-lift animate-fade-in-up"
            style={{ animationDelay: "0.4s" }}
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 gradient-warning rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 text-2xl sm:text-3xl">
              🚀
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 sm:mb-3">
              אוטומציה
            </h3>
            <p className="text-gray-600 text-sm sm:text-base">
              שליחה אוטומטית למייל, WhatsApp ומדפסת
            </p>
          </div>
        </div>

        {/* רשימת עסקים */}
        <div className="card-modern p-6 sm:p-8 md:p-12 mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-12 text-gradient">
            עסקים במערכת
          </h2>

          <div className="grid gap-6 sm:gap-8">
            {businesses.map((business, index) => (
              <div
                key={business.id}
                className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 border-2 border-blue-100 hover:border-blue-300 transition-all duration-300 hover-lift animate-slide-in-left"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex flex-col lg:flex-row items-center justify-between gap-4 sm:gap-6">
                  <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-center sm:text-right">
                    <div className="image-container w-20 h-20 sm:w-24 sm:h-24">
                      <img
                        src={business.logo}
                        alt={business.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>

                    <div>
                      <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
                        {business.name}
                      </h3>
                      {business.description && (
                        <p className="text-gray-600 text-base sm:text-lg">
                          {business.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
                    <Link
                      href={`/screen/${business.id}`}
                      className="btn-modern flex items-center justify-center gap-2 sm:gap-3 text-sm sm:text-base"
                    >
                      <span className="text-lg sm:text-xl">🛍️</span>
                      <span>מסך הזמנות</span>
                    </Link>

                    <Link
                      href="/admin/login"
                      className="btn-modern flex items-center justify-center gap-2 sm:gap-3 text-sm sm:text-base"
                      style={{ background: "var(--secondary-gradient)" }}
                    >
                      <span className="text-lg sm:text-xl">👨‍💼</span>
                      <span>Admin</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* תכונות מתקדמות */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 mb-12 sm:mb-16">
          <div className="card-modern p-6 sm:p-8 hover-lift">
            <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="w-12 h-12 sm:w-16 sm:h-16 gradient-success rounded-full flex items-center justify-center text-xl sm:text-2xl">
                🎨
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800">
                עיצוב מתקדם
              </h3>
            </div>
            <p className="text-gray-600 mb-4 text-sm sm:text-base">
              ממשק משתמש מודרני עם אנימציות חלקות, גרדיאנטים יפים ותמונות
              איכותיות
            </p>
            <ul className="space-y-2 text-gray-600 text-sm sm:text-base">
              <li>✅ תמונות איכותיות לכל מוצר</li>
              <li>✅ אנימציות חלקות ומתקדמות</li>
              <li>✅ עיצוב רספונסיבי למובייל</li>
              <li>✅ גרדיאנטים וצללים יפים</li>
            </ul>
          </div>

          <div className="card-modern p-6 sm:p-8 hover-lift">
            <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="w-12 h-12 sm:w-16 sm:h-16 gradient-accent rounded-full flex items-center justify-center text-xl sm:text-2xl">
                ⚡
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800">
                ביצועים מהירים
              </h3>
            </div>
            <p className="text-gray-600 mb-4 text-sm sm:text-base">
              מערכת מהירה ויעילה עם טעינה מהירה ותגובה חלקה לכל פעולה
            </p>
            <ul className="space-y-2 text-gray-600 text-sm sm:text-base">
              <li>✅ טעינה מהירה של דפים</li>
              <li>✅ תגובה מיידית לפעולות</li>
              <li>✅ אופטימיזציה למובייל</li>
              <li>✅ אחסון מקומי חכם</li>
            </ul>
          </div>
        </div>

        {/* CTA */}
        <div className="card-modern p-8 sm:p-12 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 text-gradient">
            מוכנים להתחיל?
          </h2>
          <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base max-w-2xl mx-auto">
            הצטרפו למערכת ההזמנות המתקדמת ביותר וקבלו את כל הכלים הנדרשים להצלחת
            העסק שלכם
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/admin/login"
              className="btn-modern flex items-center justify-center gap-3 text-sm sm:text-base"
            >
              <span className="text-xl">🚀</span>
              <span>התחל עכשיו</span>
            </Link>
            <Link
              href={`/screen/${businesses[0]?.id}`}
              className="btn-modern flex items-center justify-center gap-3 text-sm sm:text-base"
              style={{ background: "var(--secondary-gradient)" }}
            >
              <span className="text-xl">👀</span>
              <span>צפה בדמו</span>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 sm:py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-sm sm:text-base text-gray-400">
            © 2024 מערכת הזמנות חכמה. כל הזכויות שמורות.
          </p>
        </div>
      </footer>

      <style jsx>{`
        .gradient-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .gradient-success {
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
        }

        .gradient-accent {
          background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
        }

        .gradient-warning {
          background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
        }

        .card-modern {
          background: white;
          border-radius: 1rem;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }

        .card-modern:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }

        .btn-modern {
          background: var(--primary-gradient);
          color: white;
          padding: 0.75rem 1.5rem;
          border-radius: 0.75rem;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
        }

        .btn-modern:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        }

        .text-gradient {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hover-lift {
          transition: all 0.3s ease;
        }

        .hover-lift:hover {
          transform: translateY(-5px);
        }

        .image-container {
          border-radius: 0.75rem;
          overflow: hidden;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-in-left {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes pulse-slow {
          0%,
          100% {
            transform: rotate(0deg);
          }
          50% {
            transform: rotate(180deg);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out;
        }

        .animate-slide-in-left {
          animation: slide-in-left 0.8s ease-out;
        }

        .animate-pulse-slow {
          animation: pulse-slow 2s linear infinite;
        }

        :root {
          --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          --secondary-gradient: linear-gradient(
            135deg,
            #fa709a 0%,
            #fee140 100%
          );
        }
      `}</style>
    </div>
  );
}

"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

interface DashboardStats {
  totalOrders: number;
  pendingOrders: number;
  totalCategories: number;
  totalProducts: number;
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats] = useState<DashboardStats>({
    totalOrders: 0,
    pendingOrders: 0,
    totalCategories: 5,
    totalProducts: 17,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/admin/login");
      return;
    }

    // סימולציה של טעינת נתונים
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, [session, status, router]);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/admin/login" });
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">טוען לוח בקרה...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* כותרת עליונה */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-gray-800">👨‍💼 לוח בקרה</h1>
              <span className="text-gray-500">|</span>
              <span className="text-gray-600">{session.user.businessName}</span>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">שלום,</p>
                <p className="font-semibold text-gray-800">
                  {session.user.name}
                </p>
              </div>

              <button
                onClick={handleSignOut}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                יציאה
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* תוכן ראשי */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* כרטיסי סטטיסטיקה */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-r-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">סה"כ הזמנות</p>
                <p className="text-3xl font-bold text-gray-800">
                  {stats.totalOrders}
                </p>
              </div>
              <div className="text-4xl text-blue-500">📊</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-r-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">הזמנות ממתינות</p>
                <p className="text-3xl font-bold text-gray-800">
                  {stats.pendingOrders}
                </p>
              </div>
              <div className="text-4xl text-orange-500">⏳</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-r-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">קטגוריות</p>
                <p className="text-3xl font-bold text-gray-800">
                  {stats.totalCategories}
                </p>
              </div>
              <div className="text-4xl text-green-500">📂</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-r-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">מוצרים</p>
                <p className="text-3xl font-bold text-gray-800">
                  {stats.totalProducts}
                </p>
              </div>
              <div className="text-4xl text-purple-500">🍽️</div>
            </div>
          </div>
        </div>

        {/* תפריט ניהול */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            href="/admin/orders"
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow group"
          >
            <div className="text-center">
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">
                📋
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                ניהול הזמנות
              </h3>
              <p className="text-gray-600">צפייה ועדכון סטטוס הזמנות</p>
            </div>
          </Link>

          <Link
            href="/admin/categories"
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow group"
          >
            <div className="text-center">
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">
                📂
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                ניהול קטגוריות
              </h3>
              <p className="text-gray-600">הוספה ועריכת קטגוריות</p>
            </div>
          </Link>

          <Link
            href="/admin/products"
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow group"
          >
            <div className="text-center">
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">
                🍽️
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                ניהול מוצרים
              </h3>
              <p className="text-gray-600">הוספה ועריכת מוצרים ותוספות</p>
            </div>
          </Link>

          <Link
            href="/admin/settings"
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow group"
          >
            <div className="text-center">
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">
                ⚙️
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">הגדרות</h3>
              <p className="text-gray-600">הגדרות עסק וקסטמיזציה</p>
            </div>
          </Link>

          <Link
            href="/admin/customers"
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow group"
          >
            <div className="text-center">
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">
                👥
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">לקוחות</h3>
              <p className="text-gray-600">רשימת לקוחות וסטטיסטיקות</p>
            </div>
          </Link>

          <Link
            href={`/screen/${session.user.businessId}`}
            target="_blank"
            className="bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow group"
          >
            <div className="text-center">
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">
                🖥️
              </div>
              <h3 className="text-xl font-bold mb-2">מסך הזמנות</h3>
              <p className="text-green-100">צפייה במסך הלקוחות</p>
            </div>
          </Link>
        </div>

        {/* מידע מהיר */}
        <div className="mt-8 bg-blue-50 rounded-xl p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            🔗 קישורים מהירים
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">מסך הזמנות לקוחות:</p>
              <code className="text-xs bg-white p-2 rounded border text-blue-600">
                /screen/{session.user.businessId}
              </code>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">לוח בקרה:</p>
              <code className="text-xs bg-white p-2 rounded border text-blue-600">
                /admin/dashboard
              </code>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

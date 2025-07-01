"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

interface BusinessSettings {
  businessId: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  textColor: string;
  backgroundVideo?: string;
  whatsappNumber?: string;
  emailEnabled: boolean;
  whatsappEnabled: boolean;
  printingEnabled: boolean;
  isOrderingOpen: boolean;
  orderStartNumber: number;
}

interface Business {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  description?: string;
  logo?: string;
}

export default function AdminSettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [business, setBusiness] = useState<Business | null>(null);
  const [settings, setSettings] = useState<BusinessSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeTab, setActiveTab] = useState("business");

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/admin/login");
      return;
    }

    loadData();
  }, [session, status, router]);

  const loadData = async () => {
    try {
      setIsLoading(true);

      // טעינת פרטי עסק
      const businessRes = await fetch(
        `/api/businesses/${session?.user.businessId}`
      );
      if (businessRes.ok) {
        const businessData = await businessRes.json();
        setBusiness(businessData);
      }

      // סימולציה של הגדרות
      const mockSettings: BusinessSettings = {
        businessId: session?.user.businessId || "",
        primaryColor: "#3B82F6",
        secondaryColor: "#F59E0B",
        accentColor: "#10B981",
        textColor: "#1F2937",
        whatsappNumber: "050-1234567",
        emailEnabled: true,
        whatsappEnabled: true,
        printingEnabled: true,
        isOrderingOpen: true,
        orderStartNumber: 1,
      };

      setSettings(mockSettings);
    } catch (err) {
      console.error("Error loading data:", err);
      setError("שגיאה בטעינת נתונים");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBusinessUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!business) return;

    try {
      setError("");
      setSuccess("");

      // כאן תהיה קריאה לAPI לעדכון פרטי עסק
      console.log("Updating business:", business);

      setSuccess("פרטי העסק עודכנו בהצלחה!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Error updating business:", err);
      setError("שגיאה בעדכון פרטי העסק");
    }
  };

  const handleSettingsUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    try {
      setError("");
      setSuccess("");

      // כאן תהיה קריאה לAPI לעדכון הגדרות
      console.log("Updating settings:", settings);

      setSuccess("ההגדרות עודכנו בהצלחה!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Error updating settings:", err);
      setError("שגיאה בעדכון ההגדרות");
    }
  };

  const toggleOrdering = async () => {
    if (!settings) return;

    try {
      const newStatus = !settings.isOrderingOpen;
      setSettings((prev) =>
        prev ? { ...prev, isOrderingOpen: newStatus } : null
      );

      // כאן תהיה קריאה לAPI
      console.log("Toggle ordering:", newStatus);

      setSuccess(`מסך ההזמנות ${newStatus ? "נפתח" : "נסגר"} בהצלחה!`);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Error toggling ordering:", err);
      setError("שגיאה בעדכון סטטוס הזמנות");
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">טוען הגדרות...</p>
        </div>
      </div>
    );
  }

  if (!session || !business || !settings) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* כותרת עליונה */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/admin/dashboard"
                className="text-gray-600 hover:text-gray-800 transition-colors"
              >
                ← חזרה ללוח בקרה
              </Link>
              <span className="text-gray-400">|</span>
              <h1 className="text-2xl font-bold text-gray-800">⚙️ הגדרות</h1>
            </div>

            {/* סטטוס הזמנות */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">סטטוס הזמנות:</span>
              <button
                onClick={toggleOrdering}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  settings.isOrderingOpen
                    ? "bg-green-100 text-green-800 hover:bg-green-200"
                    : "bg-red-100 text-red-800 hover:bg-red-200"
                }`}
              >
                {settings.isOrderingOpen ? "🟢 פתח" : "🔴 סגור"}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* תוכן ראשי */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* הודעות */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-green-700">{success}</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <div className="grid lg:grid-cols-4 gap-8">
          {/* תפריט צד */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-4">
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab("business")}
                  className={`w-full text-right px-4 py-3 rounded-lg transition-colors ${
                    activeTab === "business"
                      ? "bg-blue-100 text-blue-800 font-medium"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  🏢 פרטי עסק
                </button>

                <button
                  onClick={() => setActiveTab("appearance")}
                  className={`w-full text-right px-4 py-3 rounded-lg transition-colors ${
                    activeTab === "appearance"
                      ? "bg-blue-100 text-blue-800 font-medium"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  🎨 עיצוב ומראה
                </button>

                <button
                  onClick={() => setActiveTab("notifications")}
                  className={`w-full text-right px-4 py-3 rounded-lg transition-colors ${
                    activeTab === "notifications"
                      ? "bg-blue-100 text-blue-800 font-medium"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  📬 התראות
                </button>

                <button
                  onClick={() => setActiveTab("ordering")}
                  className={`w-full text-right px-4 py-3 rounded-lg transition-colors ${
                    activeTab === "ordering"
                      ? "bg-blue-100 text-blue-800 font-medium"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  🛍️ הגדרות הזמנות
                </button>
              </nav>
            </div>
          </div>

          {/* תוכן הטאבים */}
          <div className="lg:col-span-3">
            {/* פרטי עסק */}
            {activeTab === "business" && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6">
                  🏢 פרטי עסק
                </h2>

                <form onSubmit={handleBusinessUpdate} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        שם העסק *
                      </label>
                      <input
                        type="text"
                        value={business.name}
                        onChange={(e) =>
                          setBusiness((prev) =>
                            prev ? { ...prev, name: e.target.value } : null
                          )
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        אימיל *
                      </label>
                      <input
                        type="email"
                        value={business.email}
                        onChange={(e) =>
                          setBusiness((prev) =>
                            prev ? { ...prev, email: e.target.value } : null
                          )
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        טלפון
                      </label>
                      <input
                        type="tel"
                        value={business.phone || ""}
                        onChange={(e) =>
                          setBusiness((prev) =>
                            prev ? { ...prev, phone: e.target.value } : null
                          )
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="050-1234567"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        כתובת
                      </label>
                      <input
                        type="text"
                        value={business.address || ""}
                        onChange={(e) =>
                          setBusiness((prev) =>
                            prev ? { ...prev, address: e.target.value } : null
                          )
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="רחוב ירושלים 1, תל אביב"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      תיאור העסק
                    </label>
                    <textarea
                      value={business.description || ""}
                      onChange={(e) =>
                        setBusiness((prev) =>
                          prev ? { ...prev, description: e.target.value } : null
                        )
                      }
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="תיאור קצר על העסק..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                  >
                    שמור שינויים
                  </button>
                </form>
              </div>
            )}

            {/* עיצוב ומראה */}
            {activeTab === "appearance" && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6">
                  🎨 עיצוב ומראה
                </h2>

                <form onSubmit={handleSettingsUpdate} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        צבע ראשי
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={settings.primaryColor}
                          onChange={(e) =>
                            setSettings((prev) =>
                              prev
                                ? { ...prev, primaryColor: e.target.value }
                                : null
                            )
                          }
                          className="w-12 h-10 rounded border border-gray-300"
                        />
                        <input
                          type="text"
                          value={settings.primaryColor}
                          onChange={(e) =>
                            setSettings((prev) =>
                              prev
                                ? { ...prev, primaryColor: e.target.value }
                                : null
                            )
                          }
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        צבע משני
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={settings.secondaryColor}
                          onChange={(e) =>
                            setSettings((prev) =>
                              prev
                                ? { ...prev, secondaryColor: e.target.value }
                                : null
                            )
                          }
                          className="w-12 h-10 rounded border border-gray-300"
                        />
                        <input
                          type="text"
                          value={settings.secondaryColor}
                          onChange={(e) =>
                            setSettings((prev) =>
                              prev
                                ? { ...prev, secondaryColor: e.target.value }
                                : null
                            )
                          }
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      וידאו רקע (URL)
                    </label>
                    <input
                      type="url"
                      value={settings.backgroundVideo || ""}
                      onChange={(e) =>
                        setSettings((prev) =>
                          prev
                            ? { ...prev, backgroundVideo: e.target.value }
                            : null
                        )
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://example.com/video.mp4"
                    />
                    <p className="text-sm text-gray-600 mt-1">
                      הוידאו יופיע כרקע במסך הברוכים הבאים
                    </p>
                  </div>

                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                  >
                    שמור עיצוב
                  </button>
                </form>
              </div>
            )}

            {/* התראות */}
            {activeTab === "notifications" && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6">
                  📬 הגדרות התראות
                </h2>

                <form onSubmit={handleSettingsUpdate} className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="font-medium text-gray-800">
                          התראות אימיל
                        </h3>
                        <p className="text-sm text-gray-600">
                          קבל התראות על הזמנות חדשות באימיל
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.emailEnabled}
                          onChange={(e) =>
                            setSettings((prev) =>
                              prev
                                ? { ...prev, emailEnabled: e.target.checked }
                                : null
                            )
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="font-medium text-gray-800">
                          התראות WhatsApp
                        </h3>
                        <p className="text-sm text-gray-600">
                          שלח הזמנות ללקוחות בWhatsApp
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.whatsappEnabled}
                          onChange={(e) =>
                            setSettings((prev) =>
                              prev
                                ? { ...prev, whatsappEnabled: e.target.checked }
                                : null
                            )
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="font-medium text-gray-800">
                          הדפסה אוטומטית
                        </h3>
                        <p className="text-sm text-gray-600">
                          הדפס הזמנות חדשות אוטומטית
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.printingEnabled}
                          onChange={(e) =>
                            setSettings((prev) =>
                              prev
                                ? { ...prev, printingEnabled: e.target.checked }
                                : null
                            )
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>

                  {settings.whatsappEnabled && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        מספר WhatsApp העסק
                      </label>
                      <input
                        type="tel"
                        value={settings.whatsappNumber || ""}
                        onChange={(e) =>
                          setSettings((prev) =>
                            prev
                              ? { ...prev, whatsappNumber: e.target.value }
                              : null
                          )
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="050-1234567"
                      />
                    </div>
                  )}

                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                  >
                    שמור הגדרות התראות
                  </button>
                </form>
              </div>
            )}

            {/* הגדרות הזמנות */}
            {activeTab === "ordering" && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6">
                  🛍️ הגדרות הזמנות
                </h2>

                <form onSubmit={handleSettingsUpdate} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      מספר התחלתי להזמנות
                    </label>
                    <input
                      type="number"
                      value={settings.orderStartNumber}
                      onChange={(e) =>
                        setSettings((prev) =>
                          prev
                            ? {
                                ...prev,
                                orderStartNumber: parseInt(e.target.value) || 1,
                              }
                            : null
                        )
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="1"
                    />
                    <p className="text-sm text-gray-600 mt-1">
                      מספר זה יקבע את מספור ההזמנות הבא
                    </p>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-4">
                    <h3 className="font-medium text-blue-800 mb-2">
                      🔗 קישור מסך הזמנות
                    </h3>
                    <div className="bg-white rounded border p-3 font-mono text-sm">
                      http://localhost:3000/screen/{session.user.businessId}
                    </div>
                    <p className="text-sm text-blue-700 mt-2">
                      זה הקישור שלקוחות ישתמשו בו כדי להזמין ממך
                    </p>
                  </div>

                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                  >
                    שמור הגדרות הזמנות
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

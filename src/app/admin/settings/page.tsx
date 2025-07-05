"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { BusinessConfig } from "@/lib/types";

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
  const [business, setBusiness] = useState<BusinessConfig | null>(null);
  const [settings, setSettings] = useState<BusinessSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeTab, setActiveTab] = useState("business");
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    description: "",
    logo: "",
    backgroundVideo: "",
    colors: {
      primary: "#3B82F6",
      secondary: "#10B981",
      accent: "#F59E0B",
      text: "#1F2937",
    },
    settings: {
      whatsappNumber: "",
      emailEnabled: true,
      whatsappEnabled: true,
      printingEnabled: true,
      isOrderingOpen: true,
    },
  });

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
      console.log("Loading business with ID:", session?.user.businessId);
      const businessRes = await fetch(
        `/api/businesses/${session?.user.businessId}`
      );
      if (businessRes.ok) {
        const response = await businessRes.json();
        const businessData = response.data || response;
        console.log("Business data loaded:", businessData);
        console.log("Logo URL:", businessData.logo);
        setBusiness(businessData);
        setFormData({
          name: businessData.name || "",
          email: businessData.email || "",
          phone: businessData.phone || "",
          address: businessData.address || "",
          description: businessData.description || "",
          logo: businessData.logo || "",
          backgroundVideo: businessData.backgroundVideo || "",
          colors: businessData.colors || {
            primary: "#3B82F6",
            secondary: "#10B981",
            accent: "#F59E0B",
            text: "#1F2937",
          },
          settings: businessData.settings || {
            whatsappNumber: "",
            emailEnabled: true,
            whatsappEnabled: true,
            printingEnabled: true,
            isOrderingOpen: true,
          },
        });
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

  const handleVideoUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingVideo(true);
    const formData = new FormData();
    formData.append("video", file);

    try {
      const response = await fetch("/api/upload/video", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Video uploaded successfully:", data);
        setFormData((prev) => ({
          ...prev,
          backgroundVideo: data.url,
        }));
        setSuccess("הוידאו הועלה בהצלחה!");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        const errorData = await response.json();
        console.error("Video upload error:", errorData);
        setError("שגיאה בהעלאת הוידאו");
      }
    } catch (error) {
      console.error("Error uploading video:", error);
    } finally {
      setUploadingVideo(false);
    }
  };

  const handleLogoUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingLogo(true);
    setError("");
    setSuccess("");

    const formData = new FormData();
    formData.append("logo", file);

    try {
      // העלאת הקובץ
      const uploadResponse = await fetch("/api/upload/logo", {
        method: "POST",
        body: formData,
      });

      if (uploadResponse.ok) {
        const uploadData = await uploadResponse.json();
        console.log("Logo uploaded successfully:", uploadData);

        // עדכון ה-state המקומי
        setFormData((prev) => ({
          ...prev,
          logo: uploadData.url,
        }));

        // שמירה בבסיס הנתונים
        if (business && business.id) {
          const saveResponse = await fetch(`/api/businesses/${business.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ...formData,
              logo: uploadData.url,
            }),
          });

          if (saveResponse.ok) {
            setSuccess("הלוגו הועלה ונשמר בהצלחה!");
            // רענון הנתונים מהשרת
            await loadData();
          } else {
            const saveError = await saveResponse.json();
            console.error("Save error:", saveError);
            setError("הלוגו הועלה אבל לא נשמר בבסיס הנתונים");
          }
        }

        setTimeout(() => setSuccess(""), 3000);
      } else {
        const errorData = await uploadResponse.json();
        console.error("Upload error:", errorData);
        setError(`שגיאה בהעלאת הלוגו: ${errorData.error || "שגיאה לא ידועה"}`);
      }
    } catch (error) {
      console.error("Error uploading logo:", error);
      setError("שגיאה בהעלאת הלוגו");
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleSave = async () => {
    if (!business || !business.id) {
      setError("שגיאה: לא נמצא מזהה עסק");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      console.log("Saving business with ID:", business.id);
      console.log("Form data:", formData);

      const response = await fetch(`/api/businesses/${business.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccess("ההגדרות נשמרו בהצלחה!");
        await loadData();
        setTimeout(() => setSuccess(""), 3000);
      } else {
        const errorData = await response.json();
        console.error("API Error:", errorData);
        setError(
          `שגיאה בשמירת ההגדרות: ${errorData.error || "שגיאה לא ידועה"}`
        );
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      setError("שגיאה בשמירת ההגדרות");
    } finally {
      setSaving(false);
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
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

        <div className="grid lg:grid-cols-4 gap-6 lg:gap-8">
          {/* תפריט צד */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-4">
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab("business")}
                  className={`w-full text-right px-3 sm:px-4 py-3 rounded-lg transition-colors text-sm sm:text-base ${
                    activeTab === "business"
                      ? "bg-blue-100 text-blue-800 font-medium"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  🏢 פרטי עסק
                </button>

                <button
                  onClick={() => setActiveTab("appearance")}
                  className={`w-full text-right px-3 sm:px-4 py-3 rounded-lg transition-colors text-sm sm:text-base ${
                    activeTab === "appearance"
                      ? "bg-blue-100 text-blue-800 font-medium"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  🎨 עיצוב ומראה
                </button>

                <button
                  onClick={() => setActiveTab("notifications")}
                  className={`w-full text-right px-3 sm:px-4 py-3 rounded-lg transition-colors text-sm sm:text-base ${
                    activeTab === "notifications"
                      ? "bg-blue-100 text-blue-800 font-medium"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  📬 התראות
                </button>

                <button
                  onClick={() => setActiveTab("ordering")}
                  className={`w-full text-right px-3 sm:px-4 py-3 rounded-lg transition-colors text-sm sm:text-base ${
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
              <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4 sm:mb-6">
                  🏢 פרטי עסק
                </h2>

                <form
                  onSubmit={handleBusinessUpdate}
                  className="space-y-4 sm:space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        שם העסק *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        לוגו העסק
                      </label>
                      <div className="space-y-3">
                        {formData.logo && (
                          <div className="relative">
                            <img
                              src={formData.logo}
                              alt="לוגו נוכחי"
                              className="w-32 h-32 sm:w-40 sm:h-40 object-cover rounded-lg border-2 border-gray-200 shadow-lg"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src =
                                  "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=400&fit=crop&crop=center";
                              }}
                            />
                            <div className="absolute -top-2 -right-2 flex gap-1">
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  setFormData((prev) => ({
                                    ...prev,
                                    logo: "",
                                  }));
                                }}
                                className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                                title="מחק לוגו"
                              >
                                ×
                              </button>
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  loadData();
                                }}
                                className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-blue-600"
                                title="רענן"
                              >
                                ↻
                              </button>
                            </div>
                          </div>
                        )}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleLogoUpload}
                            className="hidden"
                            id="logo-upload"
                            disabled={uploadingLogo}
                          />
                          <label
                            htmlFor="logo-upload"
                            className="cursor-pointer bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm sm:text-base"
                          >
                            {uploadingLogo ? "מעלה..." : "העלה לוגו חדש"}
                          </label>
                          <span className="text-xs sm:text-sm text-gray-500">
                            PNG, JPG עד 5MB
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        אימייל
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                        className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                        placeholder="info@business.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        טלפון
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            phone: e.target.value,
                          }))
                        }
                        className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                        placeholder="050-1234567"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        כתובת
                      </label>
                      <input
                        type="text"
                        value={formData.address}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            address: e.target.value,
                          }))
                        }
                        className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                        placeholder="רחוב ירושלים 1, תל אביב"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        מספר WhatsApp
                      </label>
                      <input
                        type="tel"
                        value={formData.settings.whatsappNumber || ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            settings: {
                              ...prev.settings,
                              whatsappNumber: e.target.value,
                            },
                          }))
                        }
                        className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                        placeholder="050-1234567"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      תיאור העסק
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      rows={3}
                      className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      placeholder="תיאור קצר על העסק..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2 rounded-lg transition-colors text-sm sm:text-base"
                  >
                    שמור שינויים
                  </button>
                </form>
              </div>
            )}

            {/* עיצוב ומראה */}
            {activeTab === "appearance" && (
              <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4 sm:mb-6">
                  🎨 עיצוב ומראה
                </h2>

                <form
                  onSubmit={handleSettingsUpdate}
                  className="space-y-4 sm:space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        צבע ראשי
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={formData.colors.primary}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              colors: {
                                ...prev.colors,
                                primary: e.target.value,
                              },
                            }))
                          }
                          className="w-10 sm:w-12 h-10 rounded border border-gray-300"
                        />
                        <input
                          type="text"
                          value={formData.colors.primary}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              colors: {
                                ...prev.colors,
                                primary: e.target.value,
                              },
                            }))
                          }
                          className="flex-1 px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-900"
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
                          value={formData.colors.secondary}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              colors: {
                                ...prev.colors,
                                secondary: e.target.value,
                              },
                            }))
                          }
                          className="w-10 sm:w-12 h-10 rounded border border-gray-300"
                        />
                        <input
                          type="text"
                          value={formData.colors.secondary}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              colors: {
                                ...prev.colors,
                                secondary: e.target.value,
                              },
                            }))
                          }
                          className="flex-1 px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-900"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      וידאו רקע
                    </label>

                    <div className="space-y-4">
                      {formData.backgroundVideo && (
                        <div className="relative">
                          <video
                            src={formData.backgroundVideo}
                            className="w-full h-48 sm:h-64 object-cover rounded-lg border-2 border-gray-200"
                            controls
                          />
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              setFormData((prev) => ({
                                ...prev,
                                backgroundVideo: "",
                              }));
                            }}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                          >
                            ×
                          </button>
                        </div>
                      )}

                      <div className="space-y-3">
                        {/* העלאת וידאו מהגלריה */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                          <input
                            type="file"
                            accept="video/*"
                            onChange={handleVideoUpload}
                            className="hidden"
                            id="video-upload"
                            disabled={uploadingVideo}
                          />
                          <label
                            htmlFor="video-upload"
                            className="cursor-pointer bg-green-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 text-sm sm:text-base"
                          >
                            {uploadingVideo ? "מעלה..." : "העלה וידאו מהגלריה"}
                          </label>
                          <span className="text-xs sm:text-sm text-gray-500">
                            MP4 עד 50MB
                          </span>
                        </div>

                        {/* או הכנס URL */}
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-500 text-sm">או</span>
                          </div>
                          <input
                            type="url"
                            value={formData.backgroundVideo || ""}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                backgroundVideo: e.target.value,
                              }))
                            }
                            className="w-full pl-8 pr-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-900"
                            placeholder="https://example.com/video.mp4"
                          />
                        </div>
                      </div>

                      <div className="bg-blue-50 p-3 sm:p-4 rounded-lg">
                        <h3 className="font-medium text-blue-900 mb-2 text-sm sm:text-base">
                          💡 טיפים לוידאו רקע מושלם:
                        </h3>
                        <ul className="text-xs sm:text-sm text-blue-800 space-y-1">
                          <li>• השתמש בוידאו באיכות גבוהה (1080p)</li>
                          <li>• וידאו קצר של 10-30 שניות שחוזר על עצמו</li>
                          <li>• תנועה עדינה שלא מסיחה את הדעת</li>
                          <li>• תאורה טובה וצבעים תואמים</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* כפתור שמירה */}
                  <div className="flex justify-end pt-4">
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {saving ? "שומר..." : "שמור הגדרות"}
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2 rounded-lg transition-colors text-sm sm:text-base"
                  >
                    שמור עיצוב
                  </button>
                </form>
              </div>
            )}

            {/* התראות */}
            {activeTab === "notifications" && (
              <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4 sm:mb-6">
                  📬 הגדרות התראות
                </h2>

                <form
                  onSubmit={handleSettingsUpdate}
                  className="space-y-4 sm:space-y-6"
                >
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="font-medium text-gray-800 text-sm sm:text-base">
                          התראות אימיל
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600">
                          קבל התראות על הזמנות חדשות באימיל
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.settings.emailEnabled}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              settings: {
                                ...prev.settings,
                                emailEnabled: e.target.checked,
                              },
                            }))
                          }
                          className="sr-only peer"
                        />
                        <div className="w-10 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="font-medium text-gray-800 text-sm sm:text-base">
                          התראות WhatsApp
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600">
                          שלח הזמנות ללקוחות בWhatsApp
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.settings.whatsappEnabled}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              settings: {
                                ...prev.settings,
                                whatsappEnabled: e.target.checked,
                              },
                            }))
                          }
                          className="sr-only peer"
                        />
                        <div className="w-10 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="font-medium text-gray-800 text-sm sm:text-base">
                          הדפסה אוטומטית
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600">
                          הדפס הזמנות חדשות אוטומטית
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.settings.printingEnabled}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              settings: {
                                ...prev.settings,
                                printingEnabled: e.target.checked,
                              },
                            }))
                          }
                          className="sr-only peer"
                        />
                        <div className="w-10 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>

                  {formData.settings.whatsappEnabled && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        מספר WhatsApp העסק
                      </label>
                      <input
                        type="tel"
                        value={formData.settings.whatsappNumber || ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            settings: {
                              ...prev.settings,
                              whatsappNumber: e.target.value,
                            },
                          }))
                        }
                        className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                        placeholder="050-1234567"
                      />
                    </div>
                  )}
                </form>
              </div>
            )}

            {/* הגדרות הזמנות */}
            {activeTab === "ordering" && (
              <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4 sm:mb-6">
                  🛍️ הגדרות הזמנות
                </h2>

                <form
                  onSubmit={handleSettingsUpdate}
                  className="space-y-4 sm:space-y-6"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      מספר התחלתי להזמנות
                    </label>
                    <input
                      type="number"
                      value="1"
                      className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="1"
                      disabled
                    />
                    <p className="text-xs sm:text-sm text-gray-600 mt-1">
                      מספר זה יקבע את מספור ההזמנות הבא
                    </p>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-3 sm:p-4">
                    <h3 className="font-medium text-blue-800 mb-2 text-sm sm:text-base">
                      🔗 קישור מסך הזמנות
                    </h3>
                    <div className="bg-white rounded border p-2 sm:p-3 font-mono text-xs sm:text-sm break-all">
                      http://localhost:3000/screen/{session.user.businessId}
                    </div>
                    <p className="text-xs sm:text-sm text-blue-700 mt-2">
                      זה הקישור שלקוחות ישתמשו בו כדי להזמין ממך
                    </p>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* כפתור שמירה */}
      <div className="mt-6 sm:mt-8 bg-white rounded-lg shadow-sm p-4 sm:p-6 mx-4 sm:mx-6 lg:mx-8">
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="bg-blue-600 text-white px-6 sm:px-8 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
          >
            {isLoading ? "שומר..." : "שמור הגדרות"}
          </button>
        </div>
      </div>
    </div>
  );
}

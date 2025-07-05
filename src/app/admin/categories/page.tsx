"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Category {
  id: string;
  name: string;
  description?: string;
  image?: string;
  order: number;
  isActive: boolean;
  productsCount?: number;
}

export default function AdminCategoriesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    order: 0,
    image: "",
  });

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/admin/login");
      return;
    }

    loadCategories();
  }, [session, status, router]);

  const loadCategories = async () => {
    try {
      setIsLoading(true);

      const response = await fetch(
        `/api/categories?businessId=${session?.user.businessId}`
      );
      if (response.ok) {
        const responseData = await response.json();

        if (responseData.success && responseData.data) {
          // הוספת מספר מוצרים לכל קטגוריה (סימולציה)
          const categoriesWithCount = responseData.data.map(
            (cat: Category) => ({
              ...cat,
              productsCount: Math.floor(Math.random() * 10) + 1,
            })
          );
          setCategories(categoriesWithCount);
        } else {
          setCategories([]);
        }
      } else {
        setError("שגיאה בטעינת קטגוריות");
        setCategories([]);
      }
    } catch (err) {
      console.error("Error loading categories:", err);
      setError("שגיאה בטעינת קטגוריות");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleCategoryStatus = async (
    categoryId: string,
    currentStatus: boolean
  ) => {
    try {
      // כאן תהיה קריאה לAPI לעדכון סטטוס
      console.log(`Toggle category ${categoryId} to ${!currentStatus}`);

      setCategories((prev) =>
        prev.map((category) =>
          category.id === categoryId
            ? { ...category, isActive: !currentStatus }
            : category
        )
      );
    } catch (err) {
      console.error("Error toggling category status:", err);
      setError("שגיאה בעדכון סטטוס הקטגוריה");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setError("נא למלא שם קטגוריה");
      return;
    }

    try {
      const method = editingCategory ? "PUT" : "POST";
      const url = editingCategory
        ? `/api/categories/${editingCategory.id}`
        : "/api/categories";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          businessId: session?.user.businessId,
        }),
      });

      if (response.ok) {
        const savedCategory = await response.json();

        if (editingCategory) {
          setCategories((prev) =>
            prev.map((cat) =>
              cat.id === editingCategory.id ? savedCategory : cat
            )
          );
        } else {
          setCategories((prev) => [...prev, savedCategory]);
        }

        // איפוס הטופס
        setFormData({ name: "", description: "", order: 0, image: "" });
        setIsCreating(false);
        setEditingCategory(null);
        setError("");
      } else {
        setError("שגיאה בשמירת הקטגוריה");
      }
    } catch (err) {
      console.error("Error saving category:", err);
      setError("שגיאה בשמירת הקטגוריה");
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || "",
      order: category.order,
      image: category.image || "",
    });
    setIsCreating(true);
  };

  const handleDelete = async (categoryId: string) => {
    if (!confirm("האם אתה בטוח שברצונך למחוק את הקטגוריה?")) {
      return;
    }

    try {
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setCategories((prev) => prev.filter((cat) => cat.id !== categoryId));
      } else {
        setError("שגיאה במחיקת הקטגוריה");
      }
    } catch (err) {
      console.error("Error deleting category:", err);
      setError("שגיאה במחיקת הקטגוריה");
    }
  };

  const cancelEdit = () => {
    setFormData({ name: "", description: "", order: 0, image: "" });
    setIsCreating(false);
    setEditingCategory(null);
    setError("");
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">טוען קטגוריות...</p>
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
              <Link
                href="/admin/dashboard"
                className="text-gray-600 hover:text-gray-800 transition-colors"
              >
                ← חזרה ללוח בקרה
              </Link>
              <span className="text-gray-400">|</span>
              <h1 className="text-2xl font-bold text-gray-800">
                📂 ניהול קטגוריות
              </h1>
            </div>

            <button
              onClick={() => setIsCreating(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-bold transition-colors"
            >
              + הוסף קטגוריה חדשה
            </button>
          </div>
        </div>
      </header>

      {/* תוכן ראשי */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* הודעת שגיאה */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* טופס הוספה/עריכה */}
        {isCreating && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              {editingCategory ? "עריכת קטגוריה" : "הוספת קטגוריה חדשה"}
            </h2>

            <form onSubmit={handleSubmit} className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  שם הקטגוריה *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="לדוגמה: מנות ראשונות"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  תיאור
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="תיאור קצר של הקטגוריה"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  סדר תצוגה
                </label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      order: parseInt(e.target.value) || 0,
                    }))
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="1"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  תמונה
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const form = new FormData();
                    form.append("image", file);
                    const res = await fetch("/api/upload/category-image", {
                      method: "POST",
                      body: form,
                    });
                    const data = await res.json();
                    if (data.success && data.url) {
                      setFormData((prev) => ({ ...prev, image: data.url }));
                    } else {
                      alert(data.error || "שגיאה בהעלאת התמונה");
                    }
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {formData.image && (
                  <div className="mt-2">
                    <img
                      src={formData.image}
                      alt="תמונה מקדימה"
                      className="w-32 h-32 object-contain bg-gray-50 rounded-lg border"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  </div>
                )}
              </div>

              <div className="md:col-span-3 flex gap-3">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  {editingCategory ? "עדכן קטגוריה" : "הוסף קטגוריה"}
                </button>
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  בטל
                </button>
              </div>
            </form>
          </div>
        )}

        {/* סטטיסטיקות */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl text-blue-500 mb-2">📂</div>
            <p className="text-2xl font-bold text-gray-800">
              {categories.length}
            </p>
            <p className="text-sm text-gray-600">סה"כ קטגוריות</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl text-green-500 mb-2">✅</div>
            <p className="text-2xl font-bold text-gray-800">
              {categories.filter((c) => c.isActive).length}
            </p>
            <p className="text-sm text-gray-600">קטגוריות פעילות</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl text-red-500 mb-2">❌</div>
            <p className="text-2xl font-bold text-gray-800">
              {categories.filter((c) => !c.isActive).length}
            </p>
            <p className="text-sm text-gray-600">קטגוריות לא פעילות</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl text-purple-500 mb-2">🍽️</div>
            <p className="text-2xl font-bold text-gray-800">
              {categories.reduce(
                (sum, cat) => sum + (cat.productsCount || 0),
                0
              )}
            </p>
            <p className="text-sm text-gray-600">סה"כ מוצרים</p>
          </div>
        </div>

        {/* רשימת קטגוריות */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">
                    קטגוריה
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">
                    תיאור
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">
                    סדר
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">
                    מוצרים
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">
                    סטטוס
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">
                    פעולות
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {categories
                  .sort((a, b) => a.order - b.order)
                  .map((category) => (
                    <tr key={category.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {category.image ? (
                            <img
                              src={category.image}
                              alt={category.name}
                              className="w-12 h-12 rounded-lg object-contain bg-gray-50"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 text-xl">
                              📂
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-gray-800">
                              {category.name}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-gray-600">
                          {category.description || "ללא תיאור"}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-sm">
                          {category.order}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-800">
                            {category.productsCount || 0}
                          </span>
                          <Link
                            href={`/admin/products?category=${category.id}`}
                            className="text-blue-600 hover:text-blue-800 text-sm"
                          >
                            צפה במוצרים
                          </Link>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() =>
                            toggleCategoryStatus(category.id, category.isActive)
                          }
                          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                            category.isActive
                              ? "bg-green-100 text-green-800 hover:bg-green-200"
                              : "bg-red-100 text-red-800 hover:bg-red-200"
                          }`}
                        >
                          {category.isActive ? "פעילה" : "לא פעילה"}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(category)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-sm transition-colors"
                          >
                            ערוך
                          </button>
                          <button
                            onClick={() => handleDelete(category.id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm transition-colors"
                          >
                            מחק
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {categories.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl text-gray-300 mb-4">📂</div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                אין קטגוריות
              </h3>
              <p className="text-gray-600">צור קטגוריה ראשונה כדי להתחיל</p>
            </div>
          )}
        </div>

        {/* טיפים */}
        <div className="mt-8 bg-blue-50 rounded-xl p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            💡 טיפים לניהול קטגוריות:
          </h3>
          <ul className="space-y-2 text-gray-700">
            <li>• השתמש בסדר תצוגה כדי לקבוע איך הקטגוריות יופיעו ללקוח</li>
            <li>• תיאור קטגוריה עוזר ללקוחות להבין מה כלול בה</li>
            <li>• ניתן להעלות תמונה לכל קטגוריה כדי להפוך אותה למושכת יותר</li>
            <li>
              • קטגוריות לא פעילות לא יופיעו למסך הזמנות אבל המוצרים שלהן נשמרים
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}

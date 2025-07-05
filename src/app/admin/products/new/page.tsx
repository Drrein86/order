"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Category {
  id: string;
  name: string;
}

interface ProductFormData {
  name: string;
  description: string;
  price: number;
  categoryId: string;
  image: string;
  isActive: boolean;
}

export default function NewProductPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);

  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    description: "",
    price: 0,
    categoryId: "",
    image: "",
    isActive: true,
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
        const data = await response.json();
        if (data.success && data.data) {
          setCategories(data.data);
        }
      }
    } catch (err) {
      console.error("Error loading categories:", err);
      setError("שגיאה בטעינת קטגוריות");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setError("");

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch("/api/upload/product-image", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setFormData((prev) => ({
          ...prev,
          image: data.url,
        }));
        setSuccess("התמונה הועלתה בהצלחה!");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        const errorData = await response.json();
        setError(`שגיאה בהעלאת התמונה: ${errorData.error || "שגיאה לא ידועה"}`);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      setError("שגיאה בהעלאת התמונה");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.categoryId || formData.price <= 0) {
      setError("אנא מלא את כל השדות הנדרשים");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          businessId: session?.user.businessId,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setSuccess("המוצר נוסף בהצלחה!");
          setTimeout(() => {
            router.push("/admin/products");
          }, 2000);
        } else {
          setError(result.error || "שגיאה בהוספת המוצר");
        }
      } else {
        const errorData = await response.json();
        setError(`שגיאה בהוספת המוצר: ${errorData.error || "שגיאה לא ידועה"}`);
      }
    } catch (error) {
      console.error("Error creating product:", error);
      setError("שגיאה בהוספת המוצר");
    } finally {
      setSaving(false);
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">טוען...</p>
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
                href="/admin/products"
                className="text-gray-600 hover:text-gray-800 transition-colors"
              >
                ← חזרה למוצרים
              </Link>
              <span className="text-gray-400">|</span>
              <h1 className="text-2xl font-bold text-gray-800">
                ➕ הוסף מוצר חדש
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* תוכן ראשי */}
      <main className="max-w-4xl mx-auto px-6 py-8">
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

        {/* טופס הוספת מוצר */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* שם המוצר */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  שם המוצר *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  placeholder="למשל: פיצה מרגריטה"
                  required
                />
              </div>

              {/* תיאור */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  תיאור המוצר
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  placeholder="תיאור קצר של המוצר..."
                />
              </div>

              {/* קטגוריה */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  קטגוריה *
                </label>
                <select
                  value={formData.categoryId}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      categoryId: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  required
                >
                  <option value="">בחר קטגוריה</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* מחיר */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  מחיר (₪) *
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      price: parseFloat(e.target.value) || 0,
                    }))
                  }
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  placeholder="0.00"
                  required
                />
              </div>
            </div>

            {/* תמונה */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                תמונת המוצר
              </label>
              <div className="space-y-3">
                {formData.image && (
                  <div className="relative">
                    <img
                      src={formData.image}
                      alt="תמונה נבחרת"
                      className="w-32 h-32 object-contain bg-gray-50 rounded-lg border-2 border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, image: "" }))
                      }
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="product-image-upload"
                    disabled={uploadingImage}
                  />
                  <label
                    htmlFor="product-image-upload"
                    className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {uploadingImage ? "מעלה..." : "העלה תמונה"}
                  </label>
                  <span className="text-sm text-gray-500">PNG, JPG עד 5MB</span>
                </div>
              </div>
            </div>

            {/* סטטוס */}
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      isActive: e.target.checked,
                    }))
                  }
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  מוצר פעיל (יופיע בתפריט)
                </span>
              </label>
            </div>

            {/* כפתורי פעולה */}
            <div className="flex justify-end gap-4 pt-6">
              <Link
                href="/admin/products"
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                ביטול
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {saving ? "מוסיף..." : "הוסף מוצר"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

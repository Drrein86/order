"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  categoryId: string;
  category: {
    id: string;
    name: string;
  };
}

interface ProductOption {
  id: string;
  name: string;
  type: "SINGLE_CHOICE" | "MULTIPLE_CHOICE";
  isRequired: boolean;
  sortOrder: number;
  productOptionValues: {
    id: string;
    name: string;
    price: number;
    sortOrder: number;
  }[];
}

interface NewOption {
  name: string;
  type: "SINGLE_CHOICE" | "MULTIPLE_CHOICE";
  isRequired: boolean;
  values: { name: string; price: number }[];
}

export default function ProductOptionsPage({
  params,
}: {
  params: { productId: string };
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { productId } = params;

  const [product, setProduct] = useState<Product | null>(null);
  const [options, setOptions] = useState<ProductOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [newOption, setNewOption] = useState<NewOption>({
    name: "",
    type: "SINGLE_CHOICE",
    isRequired: false,
    values: [{ name: "", price: 0 }],
  });

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/admin/login");
      return;
    }

    loadData();
  }, [session, status, router, productId]);

  const loadData = async () => {
    try {
      setIsLoading(true);

      // טעינת המוצר
      const productRes = await fetch(`/api/products/${productId}`);
      if (productRes.ok) {
        const productData = await productRes.json();
        if (productData.success && productData.data) {
          setProduct(productData.data);
          setOptions(productData.data.productOptions || []);
        } else {
          setError("המוצר לא נמצא");
        }
      } else {
        setError("שגיאה בטעינת המוצר");
      }
    } catch (err) {
      console.error("Error loading data:", err);
      setError("שגיאה בטעינת נתונים");
    } finally {
      setIsLoading(false);
    }
  };

  const addOptionValue = () => {
    setNewOption((prev) => ({
      ...prev,
      values: [...prev.values, { name: "", price: 0 }],
    }));
  };

  const removeOptionValue = (index: number) => {
    setNewOption((prev) => ({
      ...prev,
      values: prev.values.filter((_, i) => i !== index),
    }));
  };

  const updateOptionValue = (
    index: number,
    field: string,
    value: string | number
  ) => {
    setNewOption((prev) => ({
      ...prev,
      values: prev.values.map((val, i) =>
        i === index ? { ...val, [field]: value } : val
      ),
    }));
  };

  const addProductOption = async () => {
    if (!newOption.name || newOption.values.some((v) => !v.name)) {
      setError("אנא מלא את כל השדות הנדרשים");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`/api/products/${productId}/options`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newOption),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setSuccess("התוספת נוספה בהצלחה!");
          setNewOption({
            name: "",
            type: "SINGLE_CHOICE",
            isRequired: false,
            values: [{ name: "", price: 0 }],
          });
          loadData(); // טעינה מחדש של המוצר
        } else {
          setError(result.error || "שגיאה בהוספת התוספת");
        }
      } else {
        const errorData = await response.json();
        setError(`שגיאה בהוספת התוספת: ${errorData.error || "שגיאה לא ידועה"}`);
      }
    } catch (error) {
      console.error("Error adding option:", error);
      setError("שגיאה בהוספת התוספת");
    } finally {
      setSaving(false);
    }
  };

  const deleteProductOption = async (optionId: string) => {
    if (!confirm("האם אתה בטוח שברצונך למחוק תוספת זו?")) {
      return;
    }

    try {
      const response = await fetch(
        `/api/products/${productId}/options/${optionId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setSuccess("התוספת נמחקה בהצלחה!");
          loadData(); // טעינה מחדש של המוצר
        } else {
          setError(result.error || "שגיאה במחיקת התוספת");
        }
      } else {
        const errorData = await response.json();
        setError(`שגיאה במחיקת התוספת: ${errorData.error || "שגיאה לא ידועה"}`);
      }
    } catch (error) {
      console.error("Error deleting option:", error);
      setError("שגיאה במחיקת התוספת");
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

  if (!session || !product) {
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
                🔧 תוספות למוצר: {product.name}
              </h1>
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

        <div className="grid lg:grid-cols-2 gap-8">
          {/* תוספות קיימות */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              🔧 תוספות קיימות
            </h2>

            {options.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl text-gray-300 mb-4">🔧</div>
                <p className="text-gray-500">אין תוספות למוצר זה</p>
              </div>
            ) : (
              <div className="space-y-4">
                {options.map((option) => (
                  <div
                    key={option.id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-medium text-gray-800">
                          {option.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          סוג:{" "}
                          {option.type === "SINGLE_CHOICE"
                            ? "בחירה יחידה"
                            : "בחירה מרובה"}{" "}
                          |{option.isRequired ? " נדרש" : " אופציונלי"}
                        </p>
                      </div>
                      <button
                        onClick={() => deleteProductOption(option.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm transition-colors"
                      >
                        מחק
                      </button>
                    </div>

                    {option.productOptionValues.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-700">
                          ערכים:
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                          {option.productOptionValues.map((value) => (
                            <div
                              key={value.id}
                              className="bg-gray-50 rounded p-2 text-sm"
                            >
                              <span className="font-medium">{value.name}</span>
                              {value.price > 0 && (
                                <span className="text-green-600 mr-2">
                                  +₪{value.price}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* הוספת תוספת חדשה */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              ➕ הוסף תוספת חדשה
            </h2>

            <div className="space-y-4">
              {/* שם התוספת */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  שם התוספת *
                </label>
                <input
                  type="text"
                  value={newOption.name}
                  onChange={(e) =>
                    setNewOption((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  placeholder="למשל: גודל, תוספות, צבע..."
                />
              </div>

              {/* סוג התוספת */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    סוג התוספת
                  </label>
                  <select
                    value={newOption.type}
                    onChange={(e) =>
                      setNewOption((prev) => ({
                        ...prev,
                        type: e.target.value as
                          | "SINGLE_CHOICE"
                          | "MULTIPLE_CHOICE",
                      }))
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  >
                    <option value="SINGLE_CHOICE">בחירה יחידה</option>
                    <option value="MULTIPLE_CHOICE">בחירה מרובה</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newOption.isRequired}
                      onChange={(e) =>
                        setNewOption((prev) => ({
                          ...prev,
                          isRequired: e.target.checked,
                        }))
                      }
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="mr-2 text-sm font-medium text-gray-700">
                      נדרש
                    </span>
                  </label>
                </div>
              </div>

              {/* ערכי התוספת */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ערכי התוספת *
                </label>
                <div className="space-y-2">
                  {newOption.values.map((value, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={value.name}
                        onChange={(e) =>
                          updateOptionValue(index, "name", e.target.value)
                        }
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                        placeholder="שם הערך..."
                      />
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={value.price}
                        onChange={(e) =>
                          updateOptionValue(
                            index,
                            "price",
                            parseFloat(e.target.value) || 0
                          )
                        }
                        className="w-24 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                        placeholder="מחיר"
                      />
                      {newOption.values.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeOptionValue(index)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg transition-colors"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addOptionValue}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                  >
                    + הוסף ערך
                  </button>
                </div>
              </div>

              <button
                onClick={addProductOption}
                disabled={
                  saving ||
                  !newOption.name ||
                  newOption.values.some((v) => !v.name)
                }
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-bold transition-colors"
              >
                {saving ? "מוסיף..." : "➕ הוסף תוספת"}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

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
  isActive: boolean;
  order: number;
  categoryId: string;
  category: {
    id: string;
    name: string;
  };
  productOptions: {
    id: string;
    name: string;
    type: string;
    isRequired: boolean;
  }[];
}

interface Category {
  id: string;
  name: string;
}

export default function AdminProductsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/admin/login");
      return;
    }

    loadData();
  }, [session, status, router]);

  // טעינת מוצרים מחדש כאשר משתנה הקטגוריה
  useEffect(() => {
    if (session?.user.businessId && selectedCategory !== "all") {
      loadProductsByCategory();
    }
  }, [selectedCategory, session?.user.businessId]);

  const loadProductsByCategory = async () => {
    try {
      const productsRes = await fetch(
        `/api/products?businessId=${session?.user.businessId}&categoryId=${selectedCategory}`
      );
      if (productsRes.ok) {
        const productsData = await productsRes.json();
        if (productsData.success && productsData.data) {
          setProducts(productsData.data);
        } else {
          setProducts([]);
        }
      } else {
        setProducts([]);
      }
    } catch (err) {
      console.error("Error loading products by category:", err);
      setError("שגיאה בטעינת מוצרים לפי קטגוריה");
    }
  };

  const loadData = async () => {
    try {
      setIsLoading(true);

      // טעינת קטגוריות
      const categoriesRes = await fetch(
        `/api/categories?businessId=${session?.user.businessId}`
      );
      if (categoriesRes.ok) {
        const categoriesData = await categoriesRes.json();
        if (categoriesData.success && categoriesData.data) {
          setCategories(categoriesData.data);
        } else {
          setCategories([]);
        }
      } else {
        setCategories([]);
      }

      // טעינת מוצרים אמיתיים ממסד הנתונים
      const productsRes = await fetch(
        `/api/products?businessId=${session?.user.businessId}`
      );
      if (productsRes.ok) {
        const productsData = await productsRes.json();
        if (productsData.success && productsData.data) {
          setProducts(productsData.data);
        } else {
          setProducts([]);
        }
      } else {
        setProducts([]);
      }
    } catch (err) {
      console.error("Error loading data:", err);
      setError("שגיאה בטעינת נתונים");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleProductStatus = async (
    productId: string,
    currentStatus: boolean
  ) => {
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isActive: !currentStatus,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setProducts((prev) =>
            prev.map((product) =>
              product.id === productId
                ? { ...product, isActive: !currentStatus }
                : product
            )
          );
        } else {
          setError(result.error || "שגיאה בעדכון סטטוס המוצר");
        }
      } else {
        setError("שגיאה בעדכון סטטוס המוצר");
      }
    } catch (err) {
      console.error("Error toggling product status:", err);
      setError("שגיאה בעדכון סטטוס המוצר");
    }
  };

  const deleteProduct = async (productId: string) => {
    if (!confirm("האם אתה בטוח שברצונך למחוק מוצר זה?")) {
      return;
    }

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setProducts((prev) =>
            prev.filter((product) => product.id !== productId)
          );
        } else {
          setError(result.error || "שגיאה במחיקת המוצר");
        }
      } else {
        setError("שגיאה במחיקת המוצר");
      }
    } catch (err) {
      console.error("Error deleting product:", err);
      setError("שגיאה במחיקת המוצר");
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === "all" || product.categoryId === selectedCategory;
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.description &&
        product.description.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">טוען נתוני מוצרים...</p>
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
                🍽️ ניהול מוצרים
              </h1>
            </div>

            <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-bold transition-colors">
              + הוסף מוצר חדש
            </button>
          </div>
        </div>
      </header>

      {/* תוכן ראשי */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* פילטרים וחיפוש */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid md:grid-cols-3 gap-4">
            {/* חיפוש */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                חיפוש מוצר
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="שם או תיאור המוצר..."
              />
            </div>

            {/* סינון לפי קטגוריה */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                קטגוריה
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">כל הקטגוריות</option>
                {Array.isArray(categories) &&
                  categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
              </select>
            </div>

            {/* סינון לפי סטטוס */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                סטטוס
              </label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="all">כל המוצרים</option>
                <option value="active">פעילים</option>
                <option value="inactive">לא פעילים</option>
              </select>
            </div>
          </div>
        </div>

        {/* הודעת שגיאה */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* סטטיסטיקות מהירות */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl text-blue-500 mb-2">📊</div>
            <p className="text-2xl font-bold text-gray-800">
              {products.length}
            </p>
            <p className="text-sm text-gray-600">סה"כ מוצרים</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl text-green-500 mb-2">✅</div>
            <p className="text-2xl font-bold text-gray-800">
              {products.filter((p) => p.isActive).length}
            </p>
            <p className="text-sm text-gray-600">מוצרים פעילים</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl text-red-500 mb-2">❌</div>
            <p className="text-2xl font-bold text-gray-800">
              {products.filter((p) => !p.isActive).length}
            </p>
            <p className="text-sm text-gray-600">מוצרים לא פעילים</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl text-purple-500 mb-2">📂</div>
            <p className="text-2xl font-bold text-gray-800">
              {Array.isArray(categories) ? categories.length : 0}
            </p>
            <p className="text-sm text-gray-600">קטגוריות</p>
          </div>
        </div>

        {/* רשימת מוצרים */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">
                    מוצר
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">
                    קטגוריה
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">
                    מחיר
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">
                    תוספות
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
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                            🍽️
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-800">
                            {product.name}
                          </p>
                          {product.description && (
                            <p className="text-sm text-gray-600">
                              {product.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                        {product.category.name}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-gray-800">
                        ₪{product.price}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {product.productOptions.map((option) => (
                          <span
                            key={option.id}
                            className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs"
                          >
                            {option.name}
                          </span>
                        ))}
                        {product.productOptions.length === 0 && (
                          <span className="text-gray-400 text-sm">
                            ללא תוספות
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() =>
                          toggleProductStatus(product.id, product.isActive)
                        }
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                          product.isActive
                            ? "bg-green-100 text-green-800 hover:bg-green-200"
                            : "bg-red-100 text-red-800 hover:bg-red-200"
                        }`}
                      >
                        {product.isActive ? "פעיל" : "לא פעיל"}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Link
                          href={`/admin/products/edit/${product.id}`}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-sm transition-colors inline-block"
                        >
                          ערוך
                        </Link>
                        <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-lg text-sm transition-colors">
                          תוספות
                        </button>
                        <button
                          onClick={() => deleteProduct(product.id)}
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

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl text-gray-300 mb-4">🍽️</div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                לא נמצאו מוצרים
              </h3>
              <p className="text-gray-600">
                נסה לשנות את הפילטרים או להוסיף מוצר חדש
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

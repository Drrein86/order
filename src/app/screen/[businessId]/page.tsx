"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { OrderingScreen } from "@/components/ordering/OrderingScreen";
import { WelcomeScreen } from "@/components/ordering/WelcomeScreen";
import { BusinessConfig, CategoryWithProducts } from "@/lib/types";

export default function OrderingPage() {
  const params = useParams();
  const businessId = params.businessId as string;

  const [business, setBusiness] = useState<BusinessConfig | null>(null);
  const [categories, setCategories] = useState<CategoryWithProducts[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<"welcome" | "ordering">(
    "welcome"
  );
  const [orderType, setOrderType] = useState<"DINE_IN" | "TAKEAWAY" | null>(
    null
  );

  useEffect(() => {
    if (!businessId) return;

    const loadBusinessData = async () => {
      try {
        setIsLoading(true);

        // קבלת נתוני העסק והקטגוריות במקביל
        const [businessRes, categoriesRes] = await Promise.all([
          fetch(`/api/businesses/${businessId}`),
          fetch(`/api/categories?businessId=${businessId}`),
        ]);

        if (!businessRes.ok || !categoriesRes.ok) {
          throw new Error("שגיאה בטעינת נתוני העסק");
        }

        const businessData = await businessRes.json();
        const categoriesData = await categoriesRes.json();

        if (!businessData.success || !categoriesData.success) {
          throw new Error(
            businessData.error || categoriesData.error || "שגיאה בטעינת הנתונים"
          );
        }

        setBusiness(businessData.data);
        setCategories(categoriesData.data);

        // בדיקה אם ההזמנות פתוחות
        if (!businessData.data.settings.isOrderingOpen) {
          setError("מסך ההזמנות סגור כרגע. אנא פנו אלינו בטלפון.");
          return;
        }
      } catch (err) {
        console.error("Error loading business data:", err);
        setError("שגיאה בטעינת נתוני העסק. אנא נסו שוב מאוחר יותר.");
      } finally {
        setIsLoading(false);
      }
    };

    loadBusinessData();
  }, [businessId]);

  const handleOrderTypeSelect = (type: "DINE_IN" | "TAKEAWAY") => {
    setOrderType(type);
    setCurrentStep("ordering");
  };

  const goBackToWelcome = () => {
    setCurrentStep("welcome");
    setOrderType(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">טוען נתוני העסק...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-100">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="text-6xl mb-4">😔</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">אופס!</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            נסה שוב
          </button>
        </div>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">העסק לא נמצא</h1>
          <p className="text-gray-600 mt-2">נא לבדוק את הקישור ולנסות שוב</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: business.colors.primary + "10" }}
    >
      {currentStep === "welcome" ? (
        <WelcomeScreen
          business={business}
          onOrderTypeSelect={handleOrderTypeSelect}
        />
      ) : (
        <OrderingScreen
          business={business}
          categories={categories}
          orderType={orderType!}
          onBack={goBackToWelcome}
        />
      )}
    </div>
  );
}

"use client";

import { useState, useMemo } from "react";
import {
  BusinessConfig,
  CategoryWithProducts,
  CartItem,
  OrderType,
} from "@/lib/types";
import { CategoriesPanel } from "./CategoriesPanel";
import { ProductsPanel } from "./ProductsPanel";
import { CartPanel } from "./CartPanel";
import { OrderModal } from "./OrderModal";
import { calculateCartTotal } from "@/lib/utils";

interface OrderingScreenProps {
  business: BusinessConfig;
  categories: CategoryWithProducts[];
  orderType: OrderType;
  onBack: () => void;
}

export function OrderingScreen({
  business,
  categories,
  orderType,
  onBack,
}: OrderingScreenProps) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(
    categories.length > 0 ? categories[0].id : ""
  );
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  // קטגוריה נבחרת
  const selectedCategory = useMemo(
    () => categories.find((c) => c.id === selectedCategoryId) || categories[0],
    [categories, selectedCategoryId]
  );

  // סיכום סל
  const cartTotal = useMemo(() => calculateCartTotal(cart), [cart]);
  const cartItemsCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  // הוספה לסל
  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (cartItem) =>
          cartItem.product.id === item.product.id &&
          JSON.stringify(cartItem.selectedOptions) ===
            JSON.stringify(item.selectedOptions)
      );

      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex].quantity += item.quantity;
        return updated;
      }

      return [...prev, item];
    });
  };

  // עדכון כמות בסל
  const updateCartItemQuantity = (index: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(index);
      return;
    }

    setCart((prev) => {
      const updated = [...prev];
      updated[index].quantity = quantity;
      return updated;
    });
  };

  // הסרה מהסל
  const removeFromCart = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  // ניקוי הסל
  const clearCart = () => {
    setCart([]);
  };

  return (
    <div className="min-h-screen flex flex-col relative bg-white">
      {/* כותרת עליונה */}
      <header
        className="bg-white/95 backdrop-blur-sm shadow-sm border-b-4 fixed top-0 left-0 right-0 z-30"
        style={{ borderBottomColor: business.colors.primary }}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between">
          {/* כפתור חזרה ושם העסק */}
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={onBack}
              className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-green-700 hover:bg-green-800 rounded-full transition-colors"
            >
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <div className="flex items-center gap-2 sm:gap-3">
              {business.logo && (
                <img
                  src={business.logo}
                  alt={business.name}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full shadow-lg border-2 border-white object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src =
                      "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=400&fit=crop&crop=center";
                  }}
                />
              )}
              <div>
                <h1 className="text-base sm:text-xl font-bold text-gray-800 truncate max-w-32 sm:max-w-none bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {business.name}
                </h1>
                <p className="text-xs sm:text-sm text-gray-500">
                  {orderType === "DINE_IN" ? "🍽️ שבת במקום" : "📦 לקחת"}
                </p>
              </div>
            </div>
          </div>

          {/* כפתור סל */}
          <button
            onClick={() => setIsCartOpen(true)}
            className={`
              relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full font-bold text-white
              transition-all duration-300 hover:scale-105 shadow-lg
              ${
                cartItemsCount > 0
                  ? "bg-green-700 hover:bg-green-800"
                  : "bg-green-700 hover:bg-green-800 opacity-50"
              }
            `}
          >
            <svg
              className="w-6 h-6 sm:w-7 sm:h-7 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" />
            </svg>
            {cartItemsCount > 0 && (
              <span className="bg-red-500 text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-xs sm:text-sm font-bold absolute -top-1 -right-1 sm:-top-2 sm:-right-2">
                {cartItemsCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* סרגל קטגוריות אופקי - מובייל בלבד */}
      <div className="sm:hidden bg-white border-b border-gray-200 shadow-sm mt-20 sm:mt-24">
        <div className="overflow-x-auto">
          <div className="flex gap-3 px-4 py-3 min-w-max">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategoryId(category.id)}
                className={`
                  flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all duration-200 whitespace-nowrap
                  ${
                    selectedCategoryId === category.id
                      ? "bg-blue-100 text-blue-700 border-2 border-blue-300"
                      : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                  }
                `}
              >
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden relative">
                  {category.image && category.image.length > 0 ? (
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-contain bg-gray-50"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                        const fallback =
                          target.nextElementSibling as HTMLElement;
                        if (fallback) {
                          fallback.style.display = "flex";
                        }
                      }}
                    />
                  ) : null}
                  <div
                    className={`w-full h-full flex items-center justify-center text-lg font-bold ${
                      category.image && category.image.length > 0
                        ? "hidden"
                        : "flex"
                    } ${
                      selectedCategoryId === category.id
                        ? "bg-blue-400 text-white"
                        : "bg-gradient-to-br from-gray-200 to-gray-300 text-gray-600"
                    }`}
                    style={{
                      display:
                        category.image && category.image.length > 0
                          ? "none"
                          : "flex",
                    }}
                  >
                    {category.name.charAt(0).toUpperCase()}
                  </div>
                </div>
                <span className="text-xs font-medium text-center max-w-16 truncate">
                  {category.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* תוכן ראשי */}
      <div className="flex-1 flex flex-row-reverse mt-20 sm:mt-24">
        {/* פאנל מוצרים */}
        <div className="order-1 flex-1 overflow-y-auto bg-white">
          <ProductsPanel
            products={selectedCategory?.products || []}
            onAddToCart={(product, options, quantity) => {
              const selectedOptions = [];
              for (const [optionId, value] of Object.entries(options)) {
                const option = product.productOptions?.find(
                  (opt) => opt.id === optionId
                );
                if (!option) continue;
                if (option.type === "MULTIPLE_CHOICE" && Array.isArray(value)) {
                  value.forEach((val) => {
                    selectedOptions.push({
                      optionId,
                      optionName: option.name,
                      valueId: val.id,
                      valueName: val.name,
                      additionalPrice: val.additionalPrice || 0,
                    });
                  });
                } else if (
                  option.type === "HALF_AND_HALF" &&
                  value &&
                  typeof value === "object"
                ) {
                  const halfValue = value as { left?: any; right?: any };
                  if (halfValue.left) {
                    selectedOptions.push({
                      optionId,
                      optionName: option.name + " (שמאל)",
                      valueId: halfValue.left.id,
                      valueName: halfValue.left.name,
                      additionalPrice: halfValue.left.additionalPrice || 0,
                    });
                  }
                  if (halfValue.right) {
                    selectedOptions.push({
                      optionId,
                      optionName: option.name + " (ימין)",
                      valueId: halfValue.right.id,
                      valueName: halfValue.right.name,
                      additionalPrice: halfValue.right.additionalPrice || 0,
                    });
                  }
                } else if (
                  typeof value === "object" &&
                  value !== null &&
                  "id" in value
                ) {
                  const objValue = value as {
                    id: string;
                    name: string;
                    additionalPrice?: number;
                  };
                  selectedOptions.push({
                    optionId,
                    optionName: option.name,
                    valueId: objValue.id,
                    valueName: objValue.name,
                    additionalPrice: objValue.additionalPrice || 0,
                  });
                } else if (typeof value === "string") {
                  selectedOptions.push({
                    optionId,
                    optionName: option.name,
                    valueName: value,
                    additionalPrice: 0,
                  });
                }
              }
              const cartItem = {
                product,
                quantity,
                selectedOptions,
                notes: "",
              };
              addToCart(cartItem);
            }}
          />
        </div>
        {/* פאנל קטגוריות - צד ימין */}
        <div
          className="order-2 w-20 lg:w-56 max-w-xs h-screen overflow-y-auto bg-white/95 backdrop-blur-sm shadow-lg border-l border-gray-200 z-10 hidden sm:block"
          style={{ minWidth: "80px" }}
        >
          <CategoriesPanel
            categories={categories}
            selectedCategoryId={selectedCategoryId}
            onCategorySelect={setSelectedCategoryId}
            businessColors={business.colors}
            hideTitleOnMobile={true}
          />
        </div>
      </div>

      {/* מודל סל קניות */}
      {isCartOpen && (
        <CartPanel
          cart={cart}
          business={business}
          orderType={orderType}
          onClose={() => setIsCartOpen(false)}
          onUpdateQuantity={updateCartItemQuantity}
          onRemoveItem={removeFromCart}
          onClearCart={clearCart}
          onProceedToOrder={() => {
            setIsCartOpen(false);
            setIsOrderModalOpen(true);
          }}
        />
      )}

      {/* מודל סיום הזמנה */}
      {isOrderModalOpen && (
        <OrderModal
          cart={cart}
          business={business}
          orderType={orderType}
          onClose={() => setIsOrderModalOpen(false)}
          onOrderComplete={() => {
            setIsOrderModalOpen(false);
            clearCart();
            // חזרה למסך הראשי
            setTimeout(() => onBack(), 2000);
          }}
        />
      )}

      {/* תחתית קבועה עם סיכום */}
      <div
        className="fixed bottom-16 sm:bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t-4 shadow-lg p-3 sm:p-4 z-20"
        style={{ borderTopColor: business.colors.primary }}
      >
        {cartItemsCount > 0 ? (
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0">
            <div className="flex items-center gap-2 sm:gap-4">
              <span className="text-base sm:text-lg font-bold text-gray-800">
                סה"כ: {cartTotal.toFixed(2)} ₪
              </span>
              <span className="text-xs sm:text-sm text-gray-600">
                ({cartItemsCount} פריטים)
              </span>
            </div>

            <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
              <button
                onClick={() => setIsCartOpen(true)}
                className="flex-1 sm:flex-none px-4 sm:px-6 py-2 sm:py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base flex items-center justify-center gap-2"
              >
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                עריכת סל
              </button>
              <button
                onClick={() => setIsOrderModalOpen(true)}
                className="flex-1 sm:flex-none px-4 sm:px-8 py-2 sm:py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold transition-colors text-sm sm:text-base flex items-center justify-center gap-2"
              >
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                סיום הזמנה
              </button>
            </div>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto text-center">
            <span className="text-base sm:text-lg font-bold text-gray-600">
              הסל ריק - הוסף מוצרים כדי להתחיל
            </span>
          </div>
        )}
      </div>

      {/* סרגל ניווט תחתון - מובייל בלבד */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-30">
        <div className="flex justify-around items-center py-3">
          <button
            onClick={onBack}
            className="flex flex-col items-center justify-center w-12 h-12 rounded-full bg-green-700 hover:bg-green-800 transition-colors"
          >
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
          </button>
          <button className="flex flex-col items-center justify-center w-12 h-12 rounded-full bg-green-700 text-white">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </button>
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex flex-col items-center justify-center w-12 h-12 rounded-full bg-green-700 hover:bg-green-800 transition-colors relative"
          >
            <svg
              className="w-6 h-6 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" />
            </svg>
            {cartItemsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                {cartItemsCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

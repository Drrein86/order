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
        className="bg-white/95 backdrop-blur-sm shadow-sm border-b-4 sticky top-0 z-30"
        style={{ borderBottomColor: business.colors.primary }}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between">
          {/* כפתור חזרה ושם העסק */}
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={onBack}
              className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors text-sm sm:text-base"
            >
              <span className="text-lg sm:text-xl">←</span>
              <span className="hidden sm:inline">חזרה</span>
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
              relative flex items-center gap-2 sm:gap-3 px-3 sm:px-6 py-2 sm:py-3 rounded-xl font-bold text-white
              transition-all duration-300 hover:scale-105 shadow-lg text-sm sm:text-base
              ${
                cartItemsCount > 0
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-gray-400 cursor-not-allowed"
              }
            `}
            disabled={cartItemsCount === 0}
          >
            <span className="text-lg sm:text-xl">🛒</span>
            <span className="hidden sm:inline">סל הקניות</span>
            {cartItemsCount > 0 && (
              <span className="bg-red-500 text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-xs sm:text-sm font-bold absolute -top-1 -right-1 sm:-top-2 sm:-right-2">
                {cartItemsCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* תוכן ראשי */}
      <div className="flex-1 flex flex-row-reverse lg:flex-row-reverse">
        {/* פאנל קטגוריות - צד ימין */}
        <div className="lg:w-56 w-full max-w-xs bg-white/95 backdrop-blur-sm shadow-lg overflow-y-auto border-l border-gray-200 z-10">
          <CategoriesPanel
            categories={categories}
            selectedCategoryId={selectedCategoryId}
            onCategorySelect={setSelectedCategoryId}
            businessColors={business.colors}
          />
        </div>
        {/* פאנל מוצרים */}
        <div className="flex-1 overflow-y-auto bg-white">
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
                } else if (option.type === "HALF_AND_HALF" && value) {
                  if (value.left) {
                    selectedOptions.push({
                      optionId,
                      optionName: option.name + " (שמאל)",
                      valueId: value.left.id,
                      valueName: value.left.name,
                      additionalPrice: value.left.additionalPrice || 0,
                    });
                  }
                  if (value.right) {
                    selectedOptions.push({
                      optionId,
                      optionName: option.name + " (ימין)",
                      valueId: value.right.id,
                      valueName: value.right.name,
                      additionalPrice: value.right.additionalPrice || 0,
                    });
                  }
                } else if (typeof value === "object" && value !== null) {
                  selectedOptions.push({
                    optionId,
                    optionName: option.name,
                    valueId: value.id,
                    valueName: value.name,
                    additionalPrice: value.additionalPrice || 0,
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
      {cartItemsCount > 0 && (
        <div
          className="sticky bottom-0 bg-white/95 backdrop-blur-sm border-t-4 shadow-lg p-3 sm:p-4 z-20"
          style={{ borderTopColor: business.colors.primary }}
        >
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
                className="flex-1 sm:flex-none px-4 sm:px-6 py-2 sm:py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base"
              >
                עריכת סל
              </button>
              <button
                onClick={() => setIsOrderModalOpen(true)}
                className="flex-1 sm:flex-none px-4 sm:px-8 py-2 sm:py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold transition-colors text-sm sm:text-base"
              >
                סיום הזמנה
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

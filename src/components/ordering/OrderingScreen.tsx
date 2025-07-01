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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* כותרת עליונה */}
      <header
        className="bg-white shadow-sm border-b-4 sticky top-0 z-30"
        style={{ borderBottomColor: business.colors.primary }}
      >
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          {/* כפתור חזרה ושם העסק */}
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <span className="text-xl">←</span>
              <span>חזרה</span>
            </button>

            <div className="flex items-center gap-3">
              {business.logo && (
                <img
                  src={business.logo}
                  alt={business.name}
                  className="w-10 h-10 rounded-full"
                />
              )}
              <div>
                <h1 className="text-xl font-bold text-gray-800">
                  {business.name}
                </h1>
                <p className="text-sm text-gray-500">
                  {orderType === "DINE_IN" ? "🍽️ שבת במקום" : "📦 טייקאווי"}
                </p>
              </div>
            </div>
          </div>

          {/* כפתור סל */}
          <button
            onClick={() => setIsCartOpen(true)}
            className={`
              relative flex items-center gap-3 px-6 py-3 rounded-xl font-bold text-white
              transition-all duration-300 hover:scale-105 shadow-lg
              ${
                cartItemsCount > 0
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-gray-400 cursor-not-allowed"
              }
            `}
            disabled={cartItemsCount === 0}
          >
            <span className="text-xl">🛒</span>
            <span>סל הקניות</span>
            {cartItemsCount > 0 && (
              <span className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold absolute -top-2 -right-2">
                {cartItemsCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* תוכן ראשי */}
      <div className="flex-1 flex">
        {/* פאנל קטגוריות - צד ימין */}
        <div className="w-80 bg-white shadow-lg overflow-y-auto">
          <CategoriesPanel
            categories={categories}
            selectedCategoryId={selectedCategoryId}
            onCategorySelect={setSelectedCategoryId}
            businessColors={business.colors}
          />
        </div>

        {/* פאנל מוצרים - מרכז */}
        <div className="flex-1 overflow-y-auto">
          <ProductsPanel
            category={selectedCategory}
            onAddToCart={addToCart}
            businessColors={business.colors}
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
          className="sticky bottom-0 bg-white border-t-4 shadow-lg p-4 z-20"
          style={{ borderTopColor: business.colors.primary }}
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-lg font-bold text-gray-800">
                סה"כ: {cartTotal.toFixed(2)} ₪
              </span>
              <span className="text-sm text-gray-600">
                ({cartItemsCount} פריטים)
              </span>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setIsCartOpen(true)}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                עריכת סל
              </button>
              <button
                onClick={() => setIsOrderModalOpen(true)}
                className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold transition-colors"
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

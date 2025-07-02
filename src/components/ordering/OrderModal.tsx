"use client";

import { useState } from "react";
import { CartItem, BusinessConfig, OrderType } from "@/lib/types";
import { calculateCartTotal } from "@/lib/utils";

interface OrderModalProps {
  cart: CartItem[];
  business: BusinessConfig;
  orderType: OrderType;
  onClose: () => void;
  onOrderComplete: () => void;
}

export function OrderModal({
  cart,
  business,
  orderType,
  onClose,
  onOrderComplete,
}: OrderModalProps) {
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const total = calculateCartTotal(cart);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName.trim() || !customerPhone.trim()) {
      setError("שם וטלפון הם שדות חובה");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const orderData = {
        businessId: business.id,
        orderType,
        customer: {
          name: customerName.trim(),
          phone: customerPhone.trim(),
          email: customerEmail.trim() || undefined,
        },
        items: cart.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
          notes: item.notes,
          selectedOptions: item.selectedOptions,
        })),
        totalAmount: total,
        notes: notes.trim() || undefined,
      };

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "שגיאה ביצירת ההזמנה");
      }

      // הצלחה!
      onOrderComplete();
    } catch (err) {
      console.error("Order submission error:", err);
      setError(err instanceof Error ? err.message : "שגיאה ביצירת ההזמנה");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* כותרת משודרגת */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-3">
              <span className="text-2xl sm:text-3xl">🍽️</span>
              סיום הזמנה
            </h2>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white text-xl transition-colors"
              disabled={isSubmitting}
            >
              ✕
            </button>
          </div>
          <p className="text-white/90 mt-2 text-lg">
            {orderType === "DINE_IN" ? "שבת במקום" : "לקחת"} • סה"כ: ₪
            {total.toFixed(2)}
          </p>
        </div>

        {/* תוכן משודרג */}
        <form
          onSubmit={handleSubmit}
          className="p-4 sm:p-6 overflow-y-auto max-h-[70vh]"
        >
          {/* פרטי לקוח משודרגים */}
          <div className="mb-6">
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="text-xl">👤</span>
              פרטי לקוח
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  שם מלא *
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base transition-colors"
                  placeholder="הזן את השם המלא"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  טלפון *
                </label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base transition-colors"
                  placeholder="050-1234567"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  אימייל (אופציונלי)
                </label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base transition-colors"
                  placeholder="example@email.com"
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </div>

          {/* הערות משודרגות */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <span className="text-lg">💬</span>
              הערות להזמנה (אופציונלי)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base transition-colors"
              rows={3}
              placeholder="הערות מיוחדות..."
              disabled={isSubmitting}
            />
          </div>

          {/* סיכום הזמנה משודרג */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <h3 className="font-bold text-gray-800 mb-4 text-lg flex items-center gap-2">
              <span className="text-xl">📋</span>
              סיכום הזמנה
            </h3>
            <div className="space-y-3">
              {cart.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-white rounded-lg"
                >
                  {item.product.image && (
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <span className="font-semibold text-gray-800">
                        {item.product.name} x{item.quantity}
                      </span>
                      <span className="font-bold text-green-600">
                        ₪
                        {(
                          (item.product.price || item.product.basePrice || 0) *
                          item.quantity
                        ).toFixed(2)}
                      </span>
                    </div>
                    {item.selectedOptions.length > 0 && (
                      <div className="text-xs text-gray-500 mt-1">
                        {item.selectedOptions.map((option, optIndex) => (
                          <div key={optIndex}>
                            {option.optionName}:{" "}
                            {option.valueName || option.textValue}
                            {option.additionalPrice > 0 &&
                              ` (+₪${option.additionalPrice})`}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div className="border-t-2 border-gray-200 pt-4 mt-4">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-gray-800">סה"כ:</span>
                  <span className="text-2xl font-bold text-green-600">
                    ₪{total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* שגיאה משודרגת */}
          {error && (
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-2">
                <span className="text-red-500 text-xl">⚠️</span>
                <p className="text-red-700 font-semibold">{error}</p>
              </div>
            </div>
          )}

          {/* כפתורים משודרגים */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors text-lg font-semibold"
              disabled={isSubmitting}
            >
              ביטול
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  <span>שולח...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <span className="text-xl">✅</span>
                  <span>שלח הזמנה</span>
                </div>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

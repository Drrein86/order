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
      <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-hidden">
        {/* כותרת */}
        <div className="bg-green-50 px-4 sm:px-6 py-3 sm:py-4 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-2xl font-bold text-gray-800">
              🍽️ סיום הזמנה
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-xl sm:text-2xl"
              disabled={isSubmitting}
            >
              ✕
            </button>
          </div>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">
            {orderType === "DINE_IN" ? "שבת במקום" : "לקחת"} • סה"כ: ₪
            {total.toFixed(2)}
          </p>
        </div>

        {/* תוכן */}
        <form
          onSubmit={handleSubmit}
          className="p-3 sm:p-6 overflow-y-auto max-h-[70vh]"
        >
          {/* פרטי לקוח */}
          <div className="mb-4 sm:mb-6">
            <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-3 sm:mb-4">
              פרטי לקוח
            </h3>

            <div className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  שם מלא *
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  placeholder="הזן את השם המלא"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  טלפון *
                </label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  placeholder="050-1234567"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  אימייל (אופציונלי)
                </label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  placeholder="example@email.com"
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </div>

          {/* הערות */}
          <div className="mb-4 sm:mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              הערות להזמנה (אופציונלי)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
              rows={3}
              placeholder="הערות מיוחדות..."
              disabled={isSubmitting}
            />
          </div>

          {/* סיכום הזמנה */}
          <div className="bg-gray-50 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
            <h3 className="font-bold text-gray-800 mb-2 text-sm sm:text-base">
              סיכום הזמנה
            </h3>
            <div className="space-y-1 text-xs sm:text-sm">
              {cart.map((item, index) => (
                <div key={index} className="flex justify-between">
                  <span className="truncate flex-1 mr-2">
                    {item.product.name} x{item.quantity}
                  </span>
                  <span className="flex-shrink-0">
                    ₪{(item.product.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
              <div className="border-t pt-2 mt-2 font-bold flex justify-between">
                <span>סה"כ:</span>
                <span>₪{total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* שגיאה */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* כפתורים */}
          <div className="flex gap-2 sm:gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base"
              disabled={isSubmitting}
            >
              ביטול
            </button>
            <button
              type="submit"
              className="flex-1 px-3 sm:px-4 py-2 sm:py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>שולח...</span>
                </div>
              ) : (
                "שלח הזמנה"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

"use client";

import { CartItem, BusinessConfig, OrderType } from "@/lib/types";
import { calculateCartTotal, calculateItemTotal } from "@/lib/utils";

interface CartPanelProps {
  cart: CartItem[];
  business: BusinessConfig;
  orderType: OrderType;
  onClose: () => void;
  onUpdateQuantity: (index: number, quantity: number) => void;
  onRemoveItem: (index: number) => void;
  onClearCart: () => void;
  onProceedToOrder: () => void;
}

export function CartPanel({
  cart,
  business,
  orderType,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onProceedToOrder,
}: CartPanelProps) {
  const total = calculateCartTotal(cart);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* כותרת משודרגת */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-3">
            <span className="text-2xl sm:text-3xl">🛒</span>
            סל הקניות
          </h2>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white text-xl transition-colors"
          >
            ✕
          </button>
        </div>

        {/* תוכן משודרג */}
        <div className="p-4 sm:p-6 overflow-y-auto max-h-[60vh]">
          {cart.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-6">🛒</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">הסל ריק</h3>
              <p className="text-gray-600 text-lg">
                הוסף מוצרים לסל כדי להמשיך
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item, index) => (
                <div
                  key={index}
                  className="bg-white border-2 border-gray-100 rounded-xl p-4 hover:border-gray-200 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    {/* תמונה גדולה יותר */}
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden flex-shrink-0">
                      {item.product.image ? (
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center text-2xl">
                          🍽️
                        </div>
                      )}
                    </div>

                    {/* פרטים משודרגים */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-800 text-lg sm:text-xl mb-2">
                        {item.product.name}
                      </h3>
                      <p className="text-green-600 font-bold text-lg mb-3">
                        ₪
                        {(
                          item.product.basePrice ||
                          item.product.price ||
                          0
                        ).toFixed(2)}
                      </p>

                      {/* תוספות משודרגות */}
                      {item.selectedOptions.length > 0 && (
                        <div className="bg-gray-50 rounded-lg p-3 mb-3">
                          <h4 className="font-semibold text-gray-700 text-sm mb-2">
                            תוספות:
                          </h4>
                          <div className="space-y-1">
                            {item.selectedOptions.map((option, optIndex) => (
                              <div
                                key={optIndex}
                                className="flex justify-between items-center text-sm"
                              >
                                <span className="text-gray-600">
                                  {option.optionName}:{" "}
                                  {option.valueName || option.textValue}
                                </span>
                                {option.additionalPrice > 0 && (
                                  <span className="text-green-600 font-semibold">
                                    +₪{option.additionalPrice}
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* הערות */}
                      {item.notes && (
                        <div className="bg-blue-50 rounded-lg p-3">
                          <p className="text-sm text-blue-800">
                            💬 {item.notes}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* כמות ומחיר משודרגים */}
                    <div className="text-right flex-shrink-0">
                      <div className="flex items-center gap-2 mb-3">
                        <button
                          onClick={() =>
                            onUpdateQuantity(index, item.quantity - 1)
                          }
                          className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center text-lg font-bold transition-colors"
                        >
                          -
                        </button>
                        <span className="font-bold text-lg sm:text-xl w-8 sm:w-10 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            onUpdateQuantity(index, item.quantity + 1)
                          }
                          className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center text-lg font-bold transition-colors"
                        >
                          +
                        </button>
                      </div>

                      <div className="font-bold text-green-600 text-xl sm:text-2xl mb-2">
                        ₪{calculateItemTotal(item).toFixed(2)}
                      </div>

                      <button
                        onClick={() => onRemoveItem(index)}
                        className="text-red-500 hover:text-red-700 text-sm font-semibold bg-red-50 hover:bg-red-100 px-3 py-1 rounded-lg transition-colors"
                      >
                        הסר
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* תחתית משודרגת */}
        {cart.length > 0 && (
          <div className="bg-gray-50 px-6 py-4 border-t">
            <div className="flex items-center justify-between mb-4">
              <span className="text-2xl sm:text-3xl font-bold text-gray-800">
                סה"כ: ₪{total.toFixed(2)}
              </span>
              <button
                onClick={onClearCart}
                className="text-red-500 hover:text-red-700 text-sm font-semibold bg-red-50 hover:bg-red-100 px-4 py-2 rounded-lg transition-colors"
              >
                נקה סל
              </button>
            </div>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors text-lg font-semibold"
              >
                המשך קניות
              </button>
              <button
                onClick={onProceedToOrder}
                className="flex-1 px-6 py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105 shadow-lg"
              >
                סיום הזמנה
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

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
      <div className="bg-white/95 backdrop-blur-sm rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* כותרת */}
        <div className="bg-gray-50 px-4 sm:px-6 py-3 sm:py-4 border-b flex items-center justify-between">
          <h2 className="text-lg sm:text-2xl font-bold text-gray-800">
            🛒 סל הקניות
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl sm:text-2xl"
          >
            ✕
          </button>
        </div>

        {/* תוכן */}
        <div className="p-3 sm:p-6 overflow-y-auto max-h-[60vh]">
          {cart.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">🛒</div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">
                הסל ריק
              </h3>
              <p className="text-gray-600 text-sm sm:text-base">
                הוסף מוצרים לסל כדי להמשיך
              </p>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {cart.map((item, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-3 sm:p-4">
                  <div className="flex items-start gap-3 sm:gap-4">
                    {/* תמונה */}
                    {item.product.image && (
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg object-cover flex-shrink-0"
                      />
                    )}

                    {/* פרטים */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-800 text-sm sm:text-base">
                        {item.product.name}
                      </h3>
                      <p className="text-gray-600 text-xs sm:text-sm">
                        ₪{item.product.price}
                      </p>

                      {/* תוספות */}
                      {item.selectedOptions.length > 0 && (
                        <div className="text-xs text-gray-500 mt-1">
                          {item.selectedOptions.map((option) => (
                            <div key={option.optionId} className="truncate">
                              {option.optionName}:{" "}
                              {option.valueName || option.textValue}
                              {option.additionalPrice > 0 &&
                                ` (+₪${option.additionalPrice})`}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* הערות */}
                      {item.notes && (
                        <p className="text-xs text-gray-500 mt-1 truncate">
                          💬 {item.notes}
                        </p>
                      )}
                    </div>

                    {/* כמות ומחיר */}
                    <div className="text-right flex-shrink-0">
                      <div className="flex items-center gap-1 sm:gap-2 mb-2">
                        <button
                          onClick={() =>
                            onUpdateQuantity(index, item.quantity - 1)
                          }
                          className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center text-sm"
                        >
                          -
                        </button>
                        <span className="font-semibold w-6 sm:w-8 text-center text-sm sm:text-base">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            onUpdateQuantity(index, item.quantity + 1)
                          }
                          className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center text-sm"
                        >
                          +
                        </button>
                      </div>

                      <div className="font-bold text-green-600 text-sm sm:text-base">
                        ₪{calculateItemTotal(item).toFixed(2)}
                      </div>

                      <button
                        onClick={() => onRemoveItem(index)}
                        className="text-red-500 hover:text-red-700 text-xs sm:text-sm mt-1"
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

        {/* תחתית */}
        {cart.length > 0 && (
          <div className="bg-gray-50 px-4 sm:px-6 py-3 sm:py-4 border-t">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <span className="text-lg sm:text-xl font-bold text-gray-800">
                סה"כ: ₪{total.toFixed(2)}
              </span>
              <button
                onClick={onClearCart}
                className="text-red-500 hover:text-red-700 text-xs sm:text-sm"
              >
                נקה סל
              </button>
            </div>

            <div className="flex gap-2 sm:gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base"
              >
                המשך קניות
              </button>
              <button
                onClick={onProceedToOrder}
                className="flex-1 px-3 sm:px-4 py-2 sm:py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold transition-colors text-sm sm:text-base"
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

"use client";

import { useState } from "react";
import {
  ProductWithOptions,
  ProductOption,
  ProductOptionValue,
} from "@/lib/types";
import { cn } from "@/lib/utils";

interface ProductsPanelProps {
  products: ProductWithOptions[];
  onAddToCart: (
    product: ProductWithOptions,
    options: any,
    quantity: number
  ) => void;
}

export function ProductsPanel({ products, onAddToCart }: ProductsPanelProps) {
  const [selectedProduct, setSelectedProduct] =
    useState<ProductWithOptions | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, any>>(
    {}
  );
  const [quantity, setQuantity] = useState(1);
  const [showModal, setShowModal] = useState(false);

  const handleProductClick = (product: ProductWithOptions) => {
    setSelectedProduct(product);
    setSelectedOptions({});
    setQuantity(1);
    setShowModal(true);
  };

  const handleOptionChange = (
    optionId: string,
    value: any,
    optionType: string
  ) => {
    setSelectedOptions((prev) => {
      const newOptions = { ...prev };

      if (optionType === "SINGLE_CHOICE" || optionType === "HALF_AND_HALF") {
        newOptions[optionId] = value;
      } else if (optionType === "MULTIPLE_CHOICE") {
        if (!newOptions[optionId]) {
          newOptions[optionId] = [];
        }
        const currentValues = newOptions[optionId];
        if (currentValues.includes(value)) {
          newOptions[optionId] = currentValues.filter((v: any) => v !== value);
        } else {
          newOptions[optionId] = [...currentValues, value];
        }
      } else if (optionType === "QUANTITY") {
        newOptions[optionId] = value;
      }

      return newOptions;
    });
  };

  const handleAddToCart = () => {
    if (selectedProduct) {
      onAddToCart(selectedProduct, selectedOptions, quantity);
      setShowModal(false);
      setSelectedProduct(null);
      setSelectedOptions({});
      setQuantity(1);
    }
  };

  const calculateTotalPrice = () => {
    if (!selectedProduct) return 0;

    let total =
      (selectedProduct.basePrice || selectedProduct.price || 0) * quantity;

    Object.values(selectedOptions).forEach((optionValue: any) => {
      if (Array.isArray(optionValue)) {
        // Multiple choice
        optionValue.forEach((value: any) => {
          total += (value.additionalPrice || 0) * quantity;
        });
      } else if (
        typeof optionValue === "object" &&
        optionValue.additionalPrice
      ) {
        // Single choice
        total += (optionValue.additionalPrice || 0) * quantity;
      } else if (typeof optionValue === "number") {
        // Quantity
        total += optionValue * quantity;
      }
    });

    return total;
  };

  const renderOptionInput = (
    option: ProductOption,
    values: ProductOptionValue[]
  ) => {
    const currentValue = selectedOptions[option.id];

    if (option.type === "SINGLE_CHOICE") {
      return (
        <div className="grid grid-cols-1 gap-3">
          {values.map((value) => (
            <label
              key={value.id}
              className={`
                flex items-center p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer
                ${
                  currentValue?.id === value.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                }
              `}
            >
              <input
                type="radio"
                name={option.id}
                value={value.id}
                checked={currentValue?.id === value.id}
                onChange={() =>
                  handleOptionChange(option.id, value, option.type)
                }
                className="w-5 h-5 text-blue-600 mr-3"
              />
              <div className="flex-1">
                <span className="font-medium text-gray-800 text-lg">
                  {value.name}
                </span>
              </div>
              {value.additionalPrice > 0 && (
                <span className="text-green-600 font-bold text-xl">
                  +{value.additionalPrice}₪
                </span>
              )}
              {currentValue?.id === value.id && (
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mr-2">
                  <span className="text-white text-sm">✓</span>
                </div>
              )}
            </label>
          ))}
        </div>
      );
    }

    if (option.type === "MULTIPLE_CHOICE") {
      return (
        <div className="grid grid-cols-1 gap-3">
          {values.map((value) => (
            <label
              key={value.id}
              className={`
                flex items-center p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer
                ${
                  currentValue?.includes(value)
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                }
              `}
            >
              <input
                type="checkbox"
                checked={currentValue?.includes(value) || false}
                onChange={() =>
                  handleOptionChange(option.id, value, option.type)
                }
                className="w-5 h-5 text-blue-600 mr-3"
              />
              <div className="flex-1">
                <span className="font-medium text-gray-800 text-lg">
                  {value.name}
                </span>
              </div>
              {value.additionalPrice > 0 && (
                <span className="text-green-600 font-bold text-xl">
                  +{value.additionalPrice}₪
                </span>
              )}
              {currentValue?.includes(value) && (
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mr-2">
                  <span className="text-white text-sm">✓</span>
                </div>
              )}
            </label>
          ))}
        </div>
      );
    }

    if (option.type === "HALF_AND_HALF") {
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center bg-blue-50 p-4 rounded-xl border-2 border-blue-200">
              <h4 className="font-bold text-lg mb-4 text-gray-800">חצי שמאל</h4>
              <div className="space-y-3">
                {values
                  .filter(
                    (v) =>
                      v.halfPosition === "LEFT" || v.halfPosition === "FULL"
                  )
                  .map((value) => (
                    <label
                      key={value.id}
                      className={`
                        flex items-center p-3 rounded-lg border-2 transition-all duration-200 cursor-pointer
                        ${
                          currentValue?.left?.id === value.id
                            ? "border-blue-500 bg-blue-100"
                            : "border-gray-200 bg-white hover:border-gray-300"
                        }
                      `}
                    >
                      <input
                        type="radio"
                        name={`${option.id}_left`}
                        value={value.id}
                        checked={currentValue?.left?.id === value.id}
                        onChange={() =>
                          handleOptionChange(
                            option.id,
                            { ...currentValue, left: value },
                            option.type
                          )
                        }
                        className="w-4 h-4 text-blue-600 mr-2"
                      />
                      <span className="font-medium text-gray-800 text-sm">
                        {value.name}
                      </span>
                      {value.additionalPrice > 0 && (
                        <span className="text-green-600 font-bold text-sm mr-auto">
                          +{value.additionalPrice}₪
                        </span>
                      )}
                    </label>
                  ))}
              </div>
            </div>
            <div className="text-center bg-red-50 p-4 rounded-xl border-2 border-red-200">
              <h4 className="font-bold text-lg mb-4 text-gray-800">חצי ימין</h4>
              <div className="space-y-3">
                {values
                  .filter(
                    (v) =>
                      v.halfPosition === "RIGHT" || v.halfPosition === "FULL"
                  )
                  .map((value) => (
                    <label
                      key={value.id}
                      className={`
                        flex items-center p-3 rounded-lg border-2 transition-all duration-200 cursor-pointer
                        ${
                          currentValue?.right?.id === value.id
                            ? "border-red-500 bg-red-100"
                            : "border-gray-200 bg-white hover:border-gray-300"
                        }
                      `}
                    >
                      <input
                        type="radio"
                        name={`${option.id}_right`}
                        value={value.id}
                        checked={currentValue?.right?.id === value.id}
                        onChange={() =>
                          handleOptionChange(
                            option.id,
                            { ...currentValue, right: value },
                            option.type
                          )
                        }
                        className="w-4 h-4 text-red-600 mr-2"
                      />
                      <span className="font-medium text-gray-800 text-sm">
                        {value.name}
                      </span>
                      {value.additionalPrice > 0 && (
                        <span className="text-green-600 font-bold text-sm mr-auto">
                          +{value.additionalPrice}₪
                        </span>
                      )}
                    </label>
                  ))}
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (option.type === "QUANTITY") {
      return (
        <div className="flex items-center justify-center space-x-4 space-x-reverse bg-gray-50 p-4 rounded-xl">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center hover:bg-blue-600 font-bold text-xl transition-colors"
          >
            -
          </button>
          <span className="text-2xl font-bold text-gray-800 min-w-[4rem] text-center">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center hover:bg-blue-600 font-bold text-xl transition-colors"
          >
            +
          </button>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="flex-1 overflow-y-auto p-3 sm:p-6 bg-white">
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
        {products.map((product, index) => (
          <div
            key={product.id}
            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:scale-105 cursor-pointer"
            style={{ animationDelay: `${index * 0.1}s` }}
            onClick={() => handleProductClick(product)}
          >
            <div className="w-full h-32 sm:h-40 relative overflow-hidden">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-3xl sm:text-4xl bg-gradient-to-br from-gray-100 to-gray-200">
                  🍽️
                </div>
              )}
              <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 shadow-lg">
                <span className="text-sm sm:text-base font-bold text-green-600">
                  {(product.basePrice || product.price || 0).toFixed(2)}₪
                </span>
              </div>
            </div>

            {/* תוכן הכרטיס */}
            <div className="p-3 sm:p-4">
              <h3 className="font-bold text-base sm:text-lg mb-1 text-gray-800 text-center line-clamp-2">
                {product.name}
              </h3>
              {product.description && (
                <p className="text-gray-600 mb-3 text-xs sm:text-sm text-center line-clamp-2">
                  {product.description}
                </p>
              )}

              {/* מחיר בתחתית הכרטיס */}
              <div className="text-center">
                <span className="text-lg sm:text-xl font-bold text-green-600">
                  {(product.basePrice || product.price || 0).toFixed(2)}₪
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for product options */}
      {showModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-fade-in-up shadow-2xl">
            <div className="p-4 sm:p-8">
              {/* כותרת עם תמונה */}
              <div className="flex items-center gap-4 mb-6">
                {selectedProduct.image && (
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    className="w-16 h-16 rounded-xl object-cover"
                  />
                )}
                <div className="flex-1">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                    {selectedProduct.name}
                  </h2>
                  <p className="text-lg sm:text-xl font-bold text-green-600">
                    {(
                      selectedProduct.basePrice ||
                      selectedProduct.price ||
                      0
                    ).toFixed(2)}
                    ₪
                  </p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors"
                >
                  ✕
                </button>
              </div>

              {selectedProduct.description && (
                <p className="text-gray-700 mb-6 text-sm sm:text-base bg-gray-50 p-4 rounded-xl">
                  {selectedProduct.description}
                </p>
              )}

              {/* Product Options - עיצוב משודרג */}
              {selectedProduct.productOptions?.map((option) => (
                <div key={option.id} className="mb-6">
                  <h3 className="font-bold mb-4 flex items-center text-lg sm:text-xl text-gray-800">
                    {option.name}
                    {option.isRequired && (
                      <span className="text-red-500 mr-2 text-xl">*</span>
                    )}
                  </h3>
                  <div className="space-y-3">
                    {renderOptionInput(
                      option,
                      option.productOptionValues || []
                    )}
                  </div>
                </div>
              ))}

              {/* Quantity - עיצוב משודרג */}
              <div className="mb-6">
                <h3 className="font-bold mb-4 text-lg sm:text-xl text-gray-800">
                  כמות
                </h3>
                <div className="flex items-center justify-center space-x-4 space-x-reverse bg-gray-50 p-4 rounded-xl">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center hover:bg-blue-600 font-bold text-xl transition-colors"
                  >
                    -
                  </button>
                  <span className="text-2xl font-bold text-gray-800 min-w-[4rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center hover:bg-blue-600 font-bold text-xl transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Total Price - עיצוב משודרג */}
              <div className="border-t-2 border-gray-200 pt-6 mb-6">
                <div className="flex justify-between items-center bg-green-50 p-6 rounded-xl">
                  <span className="text-xl font-bold text-gray-800">
                    סה"כ לתשלום:
                  </span>
                  <span className="text-3xl font-bold text-green-600">
                    {calculateTotalPrice().toFixed(2)}₪
                  </span>
                </div>
              </div>

              {/* Add to Cart Button - עיצוב משודרג */}
              <button
                onClick={handleAddToCart}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold text-xl py-5 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg flex items-center justify-center gap-3"
              >
                <span className="text-2xl">🛒</span>
                <span>הוסף לסל ({quantity})</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

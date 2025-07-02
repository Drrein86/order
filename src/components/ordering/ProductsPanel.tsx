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
        <div className="space-y-2">
          {values.map((value) => (
            <label
              key={value.id}
              className="flex items-center space-x-3 space-x-reverse cursor-pointer"
            >
              <input
                type="radio"
                name={option.id}
                value={value.id}
                checked={currentValue?.id === value.id}
                onChange={() =>
                  handleOptionChange(option.id, value, option.type)
                }
                className="w-4 h-4 text-blue-600"
              />
              <span className="flex-1">{value.name}</span>
              {value.additionalPrice > 0 && (
                <span className="text-green-600 font-semibold">
                  +{value.additionalPrice}₪
                </span>
              )}
            </label>
          ))}
        </div>
      );
    }

    if (option.type === "MULTIPLE_CHOICE") {
      return (
        <div className="space-y-2">
          {values.map((value) => (
            <label
              key={value.id}
              className="flex items-center space-x-3 space-x-reverse cursor-pointer"
            >
              <input
                type="checkbox"
                checked={currentValue?.includes(value) || false}
                onChange={() =>
                  handleOptionChange(option.id, value, option.type)
                }
                className="w-4 h-4 text-blue-600"
              />
              <span className="flex-1">{value.name}</span>
              {value.additionalPrice > 0 && (
                <span className="text-green-600 font-semibold">
                  +{value.additionalPrice}₪
                </span>
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
            <div className="text-center">
              <h4 className="font-semibold text-sm mb-2">חצי שמאל</h4>
              <div className="space-y-2">
                {values
                  .filter(
                    (v) =>
                      v.halfPosition === "LEFT" || v.halfPosition === "FULL"
                  )
                  .map((value) => (
                    <label
                      key={value.id}
                      className="flex items-center space-x-2 space-x-reverse cursor-pointer"
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
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="text-sm">{value.name}</span>
                      {value.additionalPrice > 0 && (
                        <span className="text-green-600 text-xs">
                          +{value.additionalPrice}₪
                        </span>
                      )}
                    </label>
                  ))}
              </div>
            </div>
            <div className="text-center">
              <h4 className="font-semibold text-sm mb-2">חצי ימין</h4>
              <div className="space-y-2">
                {values
                  .filter(
                    (v) =>
                      v.halfPosition === "RIGHT" || v.halfPosition === "FULL"
                  )
                  .map((value) => (
                    <label
                      key={value.id}
                      className="flex items-center space-x-2 space-x-reverse cursor-pointer"
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
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="text-sm">{value.name}</span>
                      {value.additionalPrice > 0 && (
                        <span className="text-green-600 text-xs">
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
        <div className="flex items-center space-x-4 space-x-reverse">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
          >
            -
          </button>
          <span className="text-lg font-semibold">{quantity}</span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
          >
            +
          </button>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="flex-1 overflow-y-auto p-3 sm:p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
        {products.map((product, index) => (
          <div
            key={product.id}
            onClick={() => handleProductClick(product)}
            className="card-modern cursor-pointer hover-lift animate-fade-in-up"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="image-container aspect-video">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-2xl sm:text-4xl bg-gradient-to-br from-gray-100 to-gray-200">
                  🍽️
                </div>
              )}
              <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
                <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-full px-2 py-1 sm:px-3 sm:py-1 text-xs sm:text-sm font-semibold text-gray-800">
                  {(product.basePrice || product.price || 0).toFixed(2)}₪
                </div>
              </div>
            </div>
            <div className="p-3 sm:p-6">
              <h3 className="font-bold text-lg sm:text-xl mb-2 sm:mb-3 text-gray-800">
                {product.name}
              </h3>
              {product.description && (
                <p className="text-gray-600 mb-3 sm:mb-4 line-clamp-2 text-sm sm:text-base">
                  {product.description}
                </p>
              )}
              <div className="flex justify-between items-center">
                <span className="text-lg sm:text-2xl font-bold text-gradient">
                  {(product.basePrice || product.price || 0).toFixed(2)}₪
                </span>
                <button className="btn-modern text-sm sm:text-base px-3 py-2 sm:px-4 sm:py-2">
                  <span className="mr-1 sm:mr-2">🛒</span>
                  <span className="hidden sm:inline">הוסף לסל</span>
                  <span className="sm:hidden">הוסף</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for product options */}
      {showModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="card-modern max-w-lg w-full max-h-[90vh] overflow-y-auto animate-fade-in-up">
            <div className="p-4 sm:p-8">
              <div className="flex justify-between items-center mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gradient">
                  {selectedProduct.name}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors"
                >
                  ✕
                </button>
              </div>

              {selectedProduct.description && (
                <p className="text-gray-600 mb-4 text-sm sm:text-base">
                  {selectedProduct.description}
                </p>
              )}

              {/* Product Options */}
              {selectedProduct.productOptions?.map((option) => (
                <div key={option.id} className="mb-4 sm:mb-6">
                  <h3 className="font-semibold mb-2 sm:mb-3 flex items-center text-sm sm:text-base">
                    {option.name}
                    {option.isRequired && (
                      <span className="text-red-500 mr-2">*</span>
                    )}
                  </h3>
                  {renderOptionInput(option, option.productOptionValues || [])}
                </div>
              ))}

              {/* Quantity */}
              <div className="mb-4 sm:mb-6">
                <h3 className="font-semibold mb-2 sm:mb-3 text-sm sm:text-base">
                  כמות
                </h3>
                <div className="flex items-center space-x-4 space-x-reverse">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                  >
                    -
                  </button>
                  <span className="text-lg font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Total Price */}
              <div className="border-t pt-4 mb-4 sm:mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-base sm:text-lg font-semibold">
                    סה"כ:
                  </span>
                  <span className="text-xl sm:text-2xl font-bold text-green-600">
                    {calculateTotalPrice().toFixed(2)}₪
                  </span>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                className="w-full btn-modern text-base sm:text-lg py-3 sm:py-4"
                style={{ background: "var(--success-gradient)" }}
              >
                <span className="mr-2">🛒</span>
                הוסף לסל ({quantity})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

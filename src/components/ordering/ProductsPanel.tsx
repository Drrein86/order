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
        <div className="space-y-3">
          {values.map((value) => (
            <label
              key={value.id}
              className="flex items-center space-x-3 space-x-reverse cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <input
                type="radio"
                name={option.id}
                value={value.id}
                checked={currentValue?.id === value.id}
                onChange={() =>
                  handleOptionChange(option.id, value, option.type)
                }
                className="w-5 h-5 text-blue-600"
              />
              <span className="flex-1 font-medium text-gray-800">
                {value.name}
              </span>
              {value.additionalPrice > 0 && (
                <span className="text-green-600 font-bold text-lg">
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
        <div className="space-y-3">
          {values.map((value) => (
            <label
              key={value.id}
              className="flex items-center space-x-3 space-x-reverse cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <input
                type="checkbox"
                checked={currentValue?.includes(value) || false}
                onChange={() =>
                  handleOptionChange(option.id, value, option.type)
                }
                className="w-5 h-5 text-blue-600"
              />
              <span className="flex-1 font-medium text-gray-800">
                {value.name}
              </span>
              {value.additionalPrice > 0 && (
                <span className="text-green-600 font-bold text-lg">
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
            <div className="text-center bg-blue-50 p-3 rounded-lg">
              <h4 className="font-bold text-base mb-3 text-gray-800">
                חצי שמאל
              </h4>
              <div className="space-y-2">
                {values
                  .filter(
                    (v) =>
                      v.halfPosition === "LEFT" || v.halfPosition === "FULL"
                  )
                  .map((value) => (
                    <label
                      key={value.id}
                      className="flex items-center space-x-2 space-x-reverse cursor-pointer p-2 rounded hover:bg-blue-100 transition-colors"
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
                      <span className="text-sm font-medium text-gray-800">
                        {value.name}
                      </span>
                      {value.additionalPrice > 0 && (
                        <span className="text-green-600 text-xs font-bold">
                          +{value.additionalPrice}₪
                        </span>
                      )}
                    </label>
                  ))}
              </div>
            </div>
            <div className="text-center bg-red-50 p-3 rounded-lg">
              <h4 className="font-bold text-base mb-3 text-gray-800">
                חצי ימין
              </h4>
              <div className="space-y-2">
                {values
                  .filter(
                    (v) =>
                      v.halfPosition === "RIGHT" || v.halfPosition === "FULL"
                  )
                  .map((value) => (
                    <label
                      key={value.id}
                      className="flex items-center space-x-2 space-x-reverse cursor-pointer p-2 rounded hover:bg-red-100 transition-colors"
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
                      <span className="text-sm font-medium text-gray-800">
                        {value.name}
                      </span>
                      {value.additionalPrice > 0 && (
                        <span className="text-green-600 text-xs font-bold">
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
        <div className="flex items-center space-x-4 space-x-reverse bg-white p-3 rounded-lg">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center hover:bg-blue-600 font-bold text-lg"
          >
            -
          </button>
          <span className="text-xl font-bold text-gray-800 min-w-[3rem] text-center">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center hover:bg-blue-600 font-bold text-lg"
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
        {products.map((product, index) => (
          <div
            key={product.id}
            className="card-modern flex flex-col items-center justify-between p-0 hover-lift animate-fade-in-up"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="w-full image-container aspect-video rounded-t-2xl">
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
            </div>
            <div className="flex-1 w-full flex flex-col justify-between p-4">
              <h3 className="font-bold text-lg sm:text-xl mb-2 sm:mb-3 text-gray-800 text-center">
                {product.name}
              </h3>
              {product.description && (
                <p className="text-gray-600 mb-3 sm:mb-4 line-clamp-2 text-sm sm:text-base text-center">
                  {product.description}
                </p>
              )}
              <div className="flex flex-col items-center gap-2 mt-2">
                <span className="text-lg sm:text-2xl font-bold text-green-600">
                  {(product.basePrice || product.price || 0).toFixed(2)}₪
                </span>
                <button
                  onClick={() => handleProductClick(product)}
                  className="btn-modern text-sm sm:text-base px-6 py-3 w-full mt-2"
                >
                  <span className="mr-1 sm:mr-2">🛒</span>
                  הוסף לסל
                </button>
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
              <div className="flex justify-between items-center mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                  {selectedProduct.name}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors"
                >
                  ✕
                </button>
              </div>

              {selectedProduct.description && (
                <p className="text-gray-700 mb-4 text-sm sm:text-base bg-gray-50 p-3 rounded-lg">
                  {selectedProduct.description}
                </p>
              )}

              {/* Product Options */}
              {selectedProduct.productOptions?.map((option) => (
                <div key={option.id} className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-bold mb-3 flex items-center text-base sm:text-lg text-gray-800">
                    {option.name}
                    {option.isRequired && (
                      <span className="text-red-500 mr-2 text-lg">*</span>
                    )}
                  </h3>
                  <div className="bg-white p-3 rounded-lg">
                    {renderOptionInput(
                      option,
                      option.productOptionValues || []
                    )}
                  </div>
                </div>
              ))}

              {/* Quantity */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-bold mb-3 text-base sm:text-lg text-gray-800">
                  כמות
                </h3>
                <div className="flex items-center space-x-4 space-x-reverse bg-white p-3 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center hover:bg-blue-600 font-bold text-lg"
                  >
                    -
                  </button>
                  <span className="text-xl font-bold text-gray-800 min-w-[3rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center hover:bg-blue-600 font-bold text-lg"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Total Price */}
              <div className="border-t-2 border-gray-200 pt-4 mb-6">
                <div className="flex justify-between items-center bg-green-50 p-4 rounded-lg">
                  <span className="text-lg font-bold text-gray-800">
                    סה"כ לתשלום:
                  </span>
                  <span className="text-2xl font-bold text-green-600">
                    {calculateTotalPrice().toFixed(2)}₪
                  </span>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold text-lg py-4 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
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

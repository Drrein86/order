"use client";

import { CategoryWithProducts, CartItem } from "@/lib/types";

interface ProductsPanelProps {
  category: CategoryWithProducts | undefined;
  onAddToCart: (item: CartItem) => void;
  businessColors: any;
}

export function ProductsPanel({
  category,
  onAddToCart,
  businessColors,
}: ProductsPanelProps) {
  if (!category) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">בחר קטגוריה</h2>
        <p className="text-gray-600">בחר קטגוריה מהצד כדי לראות את המוצרים</p>
      </div>
    );
  }

  if (!category.products || category.products.length === 0) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          {category.name}
        </h2>
        <p className="text-gray-600">אין מוצרים בקטגוריה זו כרגע</p>
      </div>
    );
  }

  const handleAddToCart = (product: any) => {
    const cartItem: CartItem = {
      product,
      quantity: 1,
      selectedOptions: [],
      notes: "",
    };
    onAddToCart(cartItem);
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">{category.name}</h2>
      {category.description && (
        <p className="text-gray-600 mb-8">{category.description}</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {category.products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            {product.image && (
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
            )}

            <div className="p-4">
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {product.name}
              </h3>
              {product.description && (
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                  {product.description}
                </p>
              )}

              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-green-600">
                  ₪{product.price}
                </span>

                <button
                  onClick={() => handleAddToCart(product)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-200"
                >
                  הוסף לסל
                </button>
              </div>

              {product.productOptions && product.productOptions.length > 0 && (
                <p className="text-xs text-gray-500 mt-2">
                  ⚙️ עם אפשרויות נוספות
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

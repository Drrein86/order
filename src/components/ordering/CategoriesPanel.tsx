"use client";

import { CategoryWithProducts } from "@/lib/types";

interface CategoriesPanelProps {
  categories: CategoryWithProducts[];
  selectedCategoryId: string;
  onCategorySelect: (categoryId: string) => void;
  businessColors: any;
}

export function CategoriesPanel({
  categories,
  selectedCategoryId,
  onCategorySelect,
  businessColors,
}: CategoriesPanelProps) {
  return (
    <div className="p-2 sm:p-3 bg-transparent">
      <h2 className="text-sm sm:text-base font-bold mb-2 sm:mb-3 text-gray-800 text-center">
        קטגוריות
      </h2>
      <div className="space-y-2 sm:space-y-3">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategorySelect(category.id)}
            className={`
              w-full p-3 sm:p-4 rounded-xl transition-all duration-200 hover:scale-105
              ${
                selectedCategoryId === category.id
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg"
                  : "bg-white hover:bg-gray-50 border border-gray-200 shadow-sm"
              }
            `}
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden mb-2 border-2 border-gray-200">
                {category.image ? (
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src =
                        "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=400&fit=crop&crop=center";
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-2xl">
                    🍽️
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3
                  className={`font-bold text-sm sm:text-base truncate ${
                    selectedCategoryId === category.id
                      ? "text-white"
                      : "text-gray-800"
                  }`}
                >
                  {category.name}
                </h3>
                <span
                  className={`text-xs ${
                    selectedCategoryId === category.id
                      ? "text-blue-100"
                      : "text-gray-500"
                  }`}
                >
                  {category.products?.length || 0} מוצרים
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

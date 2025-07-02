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
    <div className="p-3 sm:p-4">
      <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-gray-800">
        קטגוריות
      </h2>
      <div className="space-y-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategorySelect(category.id)}
            className={`
              w-full text-right p-3 sm:p-4 rounded-lg transition-all duration-200
              ${
                selectedCategoryId === category.id
                  ? "bg-blue-100 border-2 border-blue-500 shadow-md"
                  : "bg-gray-50 hover:bg-gray-100 border-2 border-transparent"
              }
            `}
          >
            <div className="flex items-center gap-2 sm:gap-3">
              {category.image && (
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-cover flex-shrink-0"
                />
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-800 text-sm sm:text-base truncate">
                  {category.name}
                </h3>
                {category.description && (
                  <p className="text-xs sm:text-sm text-gray-600 mt-1 line-clamp-2">
                    {category.description}
                  </p>
                )}
                <span className="text-xs text-gray-500">
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

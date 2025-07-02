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
    <div className="p-2 sm:p-3">
      <h2 className="text-sm sm:text-base font-bold mb-2 sm:mb-3 text-gray-800">
        קטגוריות
      </h2>
      <div className="space-y-1 sm:space-y-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategorySelect(category.id)}
            className={`
              w-full text-right p-2 sm:p-3 rounded-lg transition-all duration-200
              ${
                selectedCategoryId === category.id
                  ? "bg-blue-100 border-2 border-blue-500 shadow-md"
                  : "bg-gray-50 hover:bg-gray-100 border-2 border-transparent"
              }
            `}
          >
            <div className="flex items-center gap-1 sm:gap-2">
              {category.image && (
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg object-cover flex-shrink-0"
                />
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-800 text-xs sm:text-sm truncate">
                  {category.name}
                </h3>
                {category.description && (
                  <p className="text-xs text-gray-600 mt-1 line-clamp-1">
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

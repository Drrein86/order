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
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4 text-gray-800">קטגוריות</h2>
      <div className="space-y-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategorySelect(category.id)}
            className={`
              w-full text-right p-4 rounded-lg transition-all duration-200
              ${
                selectedCategoryId === category.id
                  ? "bg-blue-100 border-2 border-blue-500 shadow-md"
                  : "bg-gray-50 hover:bg-gray-100 border-2 border-transparent"
              }
            `}
          >
            <div className="flex items-center gap-3">
              {category.image && (
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-12 h-12 rounded-lg object-cover"
                />
              )}
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">{category.name}</h3>
                {category.description && (
                  <p className="text-sm text-gray-600 mt-1">
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

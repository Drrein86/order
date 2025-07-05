"use client";

import { CategoryWithProducts } from "@/lib/types";

interface CategoriesPanelProps {
  categories: CategoryWithProducts[];
  selectedCategoryId: string;
  onCategorySelect: (categoryId: string) => void;
  businessColors: any;
  hideTitleOnMobile?: boolean;
  isDarkMode?: boolean;
}

export function CategoriesPanel({
  categories,
  selectedCategoryId,
  onCategorySelect,
  businessColors,
  hideTitleOnMobile = false,
  isDarkMode = false,
}: CategoriesPanelProps) {
  return (
    <div className="p-2 sm:p-3 bg-transparent">
      {!(
        hideTitleOnMobile &&
        typeof window !== "undefined" &&
        window.innerWidth <= 768
      ) && (
        <h2
          className={`text-sm sm:text-base font-bold mb-2 sm:mb-3 text-center ${
            isDarkMode ? "text-white" : "text-gray-800"
          }`}
        >
          קטגוריות
        </h2>
      )}
      <div className="space-y-2 sm:space-y-3">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategorySelect(category.id)}
            className={`
              w-full p-3 sm:p-4 rounded-xl transition-all duration-200 hover:scale-105
              ${
                selectedCategoryId === category.id
                  ? "text-white shadow-lg"
                  : isDarkMode
                  ? "bg-gray-700 hover:bg-gray-600 border border-gray-600 shadow-sm"
                  : "bg-white hover:bg-gray-50 border border-gray-200 shadow-sm"
              }
            `}
            style={{
              background:
                selectedCategoryId === category.id
                  ? `linear-gradient(to right, ${businessColors.primary}, ${businessColors.secondary})`
                  : undefined,
            }}
          >
            <div className="flex flex-col items-center text-center">
              <div
                className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden mb-2 border-2 relative ${
                  selectedCategoryId === category.id
                    ? "border-white"
                    : isDarkMode
                    ? "border-gray-600"
                    : "border-gray-200"
                }`}
              >
                {category.image ? (
                  <img
                    src={category.image}
                    alt={category.name}
                    className={`w-full h-full object-contain ${
                      isDarkMode ? "bg-gray-600" : "bg-gray-50"
                    }`}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                      const fallback = target.nextElementSibling as HTMLElement;
                      if (fallback) {
                        fallback.style.display = "flex";
                      }
                    }}
                  />
                ) : null}
                <div
                  className={`w-full h-full flex items-center justify-center text-2xl sm:text-3xl font-bold ${
                    category.image ? "hidden" : "flex"
                  } ${
                    selectedCategoryId === category.id
                      ? "bg-blue-400 text-white"
                      : isDarkMode
                      ? "bg-gradient-to-br from-gray-600 to-gray-700 text-gray-300"
                      : "bg-gradient-to-br from-gray-200 to-gray-300 text-gray-600"
                  }`}
                  style={{
                    display: category.image ? "none" : "flex",
                  }}
                >
                  {category.name.charAt(0).toUpperCase()}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h3
                  className={`font-bold text-sm sm:text-base truncate ${
                    selectedCategoryId === category.id
                      ? "text-white"
                      : isDarkMode
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
                      : isDarkMode
                      ? "text-gray-400"
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

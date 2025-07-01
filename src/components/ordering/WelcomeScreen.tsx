"use client";

import { BusinessConfig } from "@/lib/types";
import { useState } from "react";

interface WelcomeScreenProps {
  business: BusinessConfig;
  onOrderTypeSelect: (type: "DINE_IN" | "TAKEAWAY") => void;
}

export function WelcomeScreen({
  business,
  onOrderTypeSelect,
}: WelcomeScreenProps) {
  const [selectedType, setSelectedType] = useState<
    "DINE_IN" | "TAKEAWAY" | null
  >(null);

  const handleContinue = () => {
    if (selectedType) {
      onOrderTypeSelect(selectedType);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* וידאו רקע */}
      {business.backgroundVideo && (
        <video
          autoPlay
          muted
          loop
          className="absolute inset-0 w-full h-full object-cover z-0"
        >
          <source src={business.backgroundVideo} type="video/mp4" />
        </video>
      )}

      {/* שכבת כיסוי */}
      <div className="absolute inset-0 bg-black/40 z-10" />

      {/* תוכן */}
      <div className="relative z-20 min-h-screen flex flex-col items-center justify-center p-8">
        {/* לוגו ושם העסק */}
        <div className="text-center mb-12">
          {business.logo && (
            <img
              src={business.logo}
              alt={business.name}
              className="w-32 h-32 mx-auto mb-6 rounded-full shadow-2xl"
            />
          )}
          <h1
            className="text-5xl md:text-6xl font-bold mb-4 text-white drop-shadow-lg"
            style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.8)" }}
          >
            {business.name}
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
            ברוכים הבאים למסך ההזמנות הדיגיטלי שלנו
          </p>
        </div>

        {/* כרטיסי בחירה */}
        <div className="grid md:grid-cols-2 gap-8 max-w-2xl w-full">
          {/* שבת במקום */}
          <div
            onClick={() => setSelectedType("DINE_IN")}
            className={`
              bg-white/95 backdrop-blur-sm rounded-2xl p-8 cursor-pointer
              transform transition-all duration-300 hover:scale-105
              ${
                selectedType === "DINE_IN"
                  ? "ring-4 ring-green-500 shadow-2xl"
                  : "hover:shadow-xl"
              }
            `}
          >
            <div className="text-center">
              <div className="text-6xl mb-4">🍽️</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                שבת במקום
              </h2>
              <p className="text-gray-600 leading-relaxed">
                ליהנות מהאוכל שלנו כאן במסעדה עם שירות מלא וחוויה מושלמת
              </p>
            </div>
          </div>

          {/* טייקאווי */}
          <div
            onClick={() => setSelectedType("TAKEAWAY")}
            className={`
              bg-white/95 backdrop-blur-sm rounded-2xl p-8 cursor-pointer
              transform transition-all duration-300 hover:scale-105
              ${
                selectedType === "TAKEAWAY"
                  ? "ring-4 ring-blue-500 shadow-2xl"
                  : "hover:shadow-xl"
              }
            `}
          >
            <div className="text-center">
              <div className="text-6xl mb-4">📦</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                טייקאווי
              </h2>
              <p className="text-gray-600 leading-relaxed">
                להזמין ולקחת הביתה מהר, נוח ובטעם מושלם
              </p>
            </div>
          </div>
        </div>

        {/* כפתור המשך */}
        {selectedType && (
          <div className="mt-12 animate-fade-in">
            <button
              onClick={handleContinue}
              className={`
                px-12 py-4 rounded-xl text-xl font-bold text-white
                transform transition-all duration-300 hover:scale-105
                shadow-lg hover:shadow-xl
                ${
                  selectedType === "DINE_IN"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-blue-600 hover:bg-blue-700"
                }
              `}
            >
              המשך להזמנה →
            </button>
          </div>
        )}

        {/* הודעה נוספת */}
        <div className="mt-16 text-center">
          <p className="text-white/80 text-lg">
            👆 בחרו את סוג ההזמנה שלכם כדי להתחיל
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}

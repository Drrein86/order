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
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
          style={{
            filter: "brightness(0.7) contrast(1.1)",
          }}
        >
          <source src={business.backgroundVideo} type="video/mp4" />
          <source src={business.backgroundVideo} type="video/webm" />
          <source src={business.backgroundVideo} type="video/ogg" />
        </video>
      )}

      {/* תמונת רקע חלופית אם אין וידאו */}
      {!business.backgroundVideo && (
        <div
          className="absolute inset-0 w-full h-full z-0"
          style={{
            background: `linear-gradient(135deg, ${
              business.colors?.primary || "#3B82F6"
            } 0%, ${business.colors?.secondary || "#10B981"} 100%)`,
          }}
        />
      )}

      {/* שכבת כיסוי */}
      <div className="absolute inset-0 bg-black/50 z-10" />

      {/* תוכן */}
      <div className="relative z-20 min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
        {/* לוגו ושם העסק */}
        <div className="text-center mb-8 sm:mb-10 md:mb-12 w-full max-w-4xl">
          {business.logo && (
            <div className="mb-6 sm:mb-8 animate-fade-in-up">
              <img
                src={business.logo}
                alt={business.name}
                className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 mx-auto rounded-full shadow-2xl border-4 border-white/20 backdrop-blur-sm"
                style={{
                  boxShadow: `0 20px 40px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1)`,
                }}
              />
            </div>
          )}
          <h1
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 text-white drop-shadow-2xl px-4"
            style={{
              textShadow: "3px 3px 6px rgba(0,0,0,0.8)",
              color: business.colors?.text || "#FFFFFF",
            }}
          >
            {business.name}
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed font-light px-4">
            ברוכים הבאים למסך ההזמנות הדיגיטלי שלנו
          </p>
        </div>

        {/* כפתורי בחירה */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 max-w-2xl w-full px-4">
          {/* שבת במקום */}
          <button
            onClick={() => setSelectedType("DINE_IN")}
            className={`
              bg-white/20 backdrop-blur-sm rounded-xl p-6 sm:p-8 cursor-pointer
              transform transition-all duration-300 hover:scale-105
              border border-white/30 min-h-[120px] flex items-center justify-center
              ${
                selectedType === "DINE_IN"
                  ? "ring-2 ring-white/50 bg-white/30"
                  : "hover:bg-white/30"
              }
            `}
          >
            <span className="text-2xl sm:text-3xl font-bold text-white">
              לשבת
            </span>
          </button>

          {/* לקחת */}
          <button
            onClick={() => setSelectedType("TAKEAWAY")}
            className={`
              bg-white/20 backdrop-blur-sm rounded-xl p-6 sm:p-8 cursor-pointer
              transform transition-all duration-300 hover:scale-105
              border border-white/30 min-h-[120px] flex items-center justify-center
              ${
                selectedType === "TAKEAWAY"
                  ? "ring-2 ring-white/50 bg-white/30"
                  : "hover:bg-white/30"
              }
            `}
          >
            <span className="text-2xl sm:text-3xl font-bold text-white">
              לקחת
            </span>
          </button>
        </div>

        {/* כפתור המשך */}
        {selectedType && (
          <div className="mt-8 sm:mt-10 md:mt-12 animate-fade-in px-4 w-full max-w-md">
            <button
              onClick={handleContinue}
              className={`
                w-full px-8 sm:px-12 md:px-16 py-4 sm:py-5 md:py-6 rounded-xl sm:rounded-2xl 
                text-lg sm:text-xl md:text-2xl font-bold text-white
                transform transition-all duration-300 hover:scale-105 active:scale-95
                shadow-2xl hover:shadow-3xl backdrop-blur-sm
                ${
                  selectedType === "DINE_IN"
                    ? "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                    : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                }
              `}
              style={{
                boxShadow: `0 20px 40px rgba(0,0,0,0.3)`,
              }}
            >
              {selectedType === "DINE_IN" ? "🍽️ " : "📦 "}
              המשך להזמנה →
            </button>
          </div>
        )}

        {/* הודעה נוספת */}
        <div className="mt-12 sm:mt-14 md:mt-16 text-center animate-fade-in-delayed px-4">
          <p className="text-white/80 text-base sm:text-lg md:text-xl font-light mb-4">
            👆 בחרו את סוג ההזמנה שלכם כדי להתחיל
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4 text-white/60 text-sm sm:text-base">
            <span>🍽️ שבת במקום</span>
            <span>📦 לקחת</span>
          </div>
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

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(40px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes fade-in-delayed {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          50% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out;
        }

        .animate-fade-in-delayed {
          animation: fade-in-delayed 1.2s ease-out;
        }

        .shadow-3xl {
          box-shadow: 0 35px 60px rgba(0, 0, 0, 0.4);
        }

        /* Mobile optimizations */
        @media (max-width: 640px) {
          .animate-bounce {
            animation: none;
          }

          .animate-pulse {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}

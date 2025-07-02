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
              <div className="logo-container w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 mx-auto border-4 border-white/30 backdrop-blur-sm">
                <img
                  src={business.logo}
                  alt={business.name}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src =
                      "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=400&fit=crop&crop=center";
                  }}
                />
              </div>
            </div>
          )}
          <h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-4 sm:mb-6 text-white drop-shadow-2xl px-4 bg-gradient-to-r from-white to-white/90 bg-clip-text text-transparent"
            style={{
              textShadow: "4px 4px 8px rgba(0,0,0,0.9)",
            }}
          >
            {business.name}
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed font-light px-4">
            ברוכים הבאים למסך ההזמנות הדיגיטלי שלנו
          </p>
        </div>

        {/* כפתורי בחירה */}
        <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 max-w-4xl w-full px-4 justify-center">
          {/* שבת במקום */}
          <button
            onClick={() => onOrderTypeSelect("DINE_IN")}
            className={`
              btn-large bg-white/20 backdrop-blur-sm rounded-2xl cursor-pointer
              transform transition-all duration-300 hover:scale-105
              border border-white/30 min-h-[250px] sm:min-h-[300px] flex items-center justify-center
              flex-1 max-w-[350px] sm:max-w-[450px]
              hover:bg-white/30 hover:shadow-xl
            `}
          >
            <span className="text-4xl sm:text-5xl md:text-6xl font-bold text-white">
              לשבת
            </span>
          </button>

          {/* לקחת */}
          <button
            onClick={() => onOrderTypeSelect("TAKEAWAY")}
            className={`
              btn-large bg-white/20 backdrop-blur-sm rounded-2xl cursor-pointer
              transform transition-all duration-300 hover:scale-105
              border border-white/30 min-h-[250px] sm:min-h-[300px] flex items-center justify-center
              flex-1 max-w-[350px] sm:max-w-[450px]
              hover:bg-white/30 hover:shadow-xl
            `}
          >
            <span className="text-4xl sm:text-5xl md:text-6xl font-bold text-white">
              לקחת
            </span>
          </button>
        </div>

        {/* הודעה נוספת */}
        <div className="mt-12 sm:mt-14 md:mt-16 text-center animate-fade-in-delayed px-4">
          <p className="text-white/80 text-base sm:text-lg md:text-xl font-light mb-4">
            👆 לחצו על סוג ההזמנה הרצוי כדי להתחיל
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4 text-white/60 text-sm sm:text-base">
            <span>שבת במקום</span>
            <span>לקחת</span>
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

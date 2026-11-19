"use client";

import React from "react";
import { Direction } from "../lib/types";

interface KikiAvatarProps {
  direction: Direction;
  isMoving?: boolean;
  isJumping?: boolean;
  isCelebration?: boolean;
  isConfused?: boolean;
  size?: number;
}

export const KikiAvatar: React.FC<KikiAvatarProps> = ({
  direction,
  isMoving = false,
  isJumping = false,
  isCelebration = false,
  isConfused = false,
  size = 64,
}) => {
  // Hitung sudut rotasi karakter
  const getRotationAngle = () => {
    switch (direction) {
      case "UP":
        return -90;
      case "RIGHT":
        return 0;
      case "DOWN":
        return 90;
      case "LEFT":
        return 180;
    }
  };

  return (
    <div
      className={`relative flex items-center justify-center transition-all duration-300 ${
        isJumping
          ? "scale-125 -translate-y-4 shadow-2xl"
          : isMoving
          ? "animate-bounce"
          : isCelebration
          ? "animate-wiggle scale-110"
          : isConfused
          ? "rotate-12"
          : "animate-float"
      }`}
      style={{ width: size, height: size }}
    >
      {/* Bayangan di tanah */}
      <div
        className={`absolute -bottom-1 w-3/4 h-2 rounded-full bg-slate-900/20 blur-[2px] transition-all duration-300 ${
          isJumping ? "scale-50 opacity-30" : "scale-100 opacity-70"
        }`}
      />

      {/* SVG Karakter Robot Kelinci Kiki */}
      <div
        className="relative transition-transform duration-300 ease-out"
        style={{
          transform: `rotate(${getRotationAngle()}deg)`,
        }}
      >
        <svg
          width={size}
          height={size}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-md select-none"
        >
          {/* Telinga Kiri */}
          <rect
            x="20"
            y="6"
            width="14"
            height="32"
            rx="7"
            fill="#E0E7FF"
            stroke="#4F46E5"
            strokeWidth="3"
            transform="rotate(-8 27 22)"
          />
          <rect
            x="23"
            y="11"
            width="8"
            height="22"
            rx="4"
            fill="#F472B6"
            transform="rotate(-8 27 22)"
          />

          {/* Telinga Kanan */}
          <rect
            x="66"
            y="6"
            width="14"
            height="32"
            rx="7"
            fill="#E0E7FF"
            stroke="#4F46E5"
            strokeWidth="3"
            transform="rotate(8 73 22)"
          />
          <rect
            x="69"
            y="11"
            width="8"
            height="22"
            rx="4"
            fill="#F472B6"
            transform="rotate(8 73 22)"
          />

          {/* Antena Robot */}
          <line
            x1="50"
            y1="22"
            x2="50"
            y2="8"
            stroke="#6366F1"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <circle
            cx="50"
            cy="7"
            r="6"
            fill="#FBBF24"
            stroke="#D97706"
            strokeWidth="2"
            className={isMoving ? "animate-ping" : ""}
          />
          <circle cx="48" cy="5" r="2" fill="#FEF08A" />

          {/* Kepala Robot */}
          <rect
            x="18"
            y="26"
            width="64"
            height="56"
            rx="24"
            fill="#EEF2FF"
            stroke="#4338CA"
            strokeWidth="4"
          />

          {/* Layar Kaca Wajah */}
          <rect
            x="26"
            y="34"
            width="48"
            height="40"
            rx="16"
            fill="#1E1B4B"
          />

          {/* Efek Kilau Layar */}
          <path
            d="M32 38 Q 44 36, 68 40"
            stroke="#818CF8"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.4"
          />

          {/* Pipi Merona / Rosy Cheeks */}
          <ellipse cx="33" cy="62" rx="4" ry="2.5" fill="#F472B6" opacity="0.9" />
          <ellipse cx="67" cy="62" rx="4" ry="2.5" fill="#F472B6" opacity="0.9" />

          {/* Mata Karakter */}
          {isConfused ? (
            // Mata bingung spiral / silang
            <>
              <text x="32" y="52" fill="#60A5FA" fontSize="16" fontWeight="bold">
                ?
              </text>
              <text x="56" y="52" fill="#60A5FA" fontSize="16" fontWeight="bold">
                ?
              </text>
            </>
          ) : isCelebration ? (
            // Mata tersenyum lengkung bahagia ^_^
            <>
              <path
                d="M33 50 Q 38 43, 43 50"
                stroke="#38BDF8"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <path
                d="M57 50 Q 62 43, 67 50"
                stroke="#38BDF8"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
            </>
          ) : (
            // Mata normal bersinar
            <>
              <circle cx="38" cy="48" r="5.5" fill="#38BDF8" />
              <circle cx="62" cy="48" r="5.5" fill="#38BDF8" />
              <circle cx="36" cy="46" r="2" fill="#FFFFFF" />
              <circle cx="60" cy="46" r="2" fill="#FFFFFF" />
            </>
          )}

          {/* Hidung & Mulut Lucu */}
          <polygon points="50,54 47,51 53,51" fill="#F472B6" />
          <path
            d="M46 56 Q 50 60, 50 56 Q 50 60, 54 56"
            stroke="#60A5FA"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Bodi Bawah / Kerah */}
          <rect
            x="36"
            y="81"
            width="28"
            height="12"
            rx="6"
            fill="#6366F1"
            stroke="#4338CA"
            strokeWidth="3"
          />
          <circle cx="50" cy="87" r="2.5" fill="#34D399" />
        </svg>
      </div>

      {/* Bubble tanda seru/tanya jika confused */}
      {isConfused && (
        <span className="absolute -top-3 -right-2 text-2xl animate-bounce">
          ❓
        </span>
      )}
      {isCelebration && (
        <span className="absolute -top-3 -right-2 text-2xl animate-spin">
          ✨
        </span>
      )}
    </div>
  );
};

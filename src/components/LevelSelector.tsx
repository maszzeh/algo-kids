"use client";

import React from "react";
import { GAME_LEVELS } from "../data/gameLevels";
import { Star, CheckCircle, Lock, Play } from "lucide-react";
import { playPop } from "../lib/sounds";

interface LevelSelectorProps {
  currentLevelId: number;
  completedLevels: Record<number, number>; // levelId -> stars (1..3)
  onSelectLevel: (levelId: number) => void;
}

export const LevelSelector: React.FC<LevelSelectorProps> = ({
  currentLevelId,
  completedLevels,
  onSelectLevel,
}) => {
  return (
    <div className="bg-white/95 backdrop-blur-sm p-4 md:p-6 rounded-3xl shadow-xl border-4 border-indigo-200">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base md:text-lg font-black text-indigo-950 flex items-center gap-2">
            <span>🗺️</span> Peta Petualangan Level
          </h3>
          <p className="text-xs text-indigo-500 font-medium">
            Pilih tantangan untuk membantu Kiki berpetualang
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full text-xs font-black text-amber-700">
          <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
          <span>
            {Object.values(completedLevels).reduce((a, b) => a + b, 0)} Bintang
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {GAME_LEVELS.map((lvl) => {
          const isCurrent = lvl.id === currentLevelId;
          const starsEarned = completedLevels[lvl.id] || 0;
          // Level terbuka jika level 1 atau level sebelumnya sudah diselesaikan
          const isUnlocked = lvl.id === 1 || (completedLevels[lvl.id - 1] ?? 0) > 0;

          return (
            <button
              key={lvl.id}
              disabled={!isUnlocked}
              onClick={() => {
                if (isUnlocked) {
                  playPop();
                  onSelectLevel(lvl.id);
                }
              }}
              className={`relative flex flex-col p-3 rounded-2xl border-2 transition-all text-left ${
                isCurrent
                  ? "bg-indigo-600 text-white border-indigo-700 ring-4 ring-yellow-400 shadow-lg scale-105"
                  : isUnlocked
                  ? "bg-indigo-50 hover:bg-indigo-100 text-slate-800 border-indigo-200 shadow-sm hover:scale-102 cursor-pointer"
                  : "bg-slate-100 text-slate-400 border-slate-200 opacity-60 cursor-not-allowed"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span
                  className={`text-xs font-black px-2 py-0.5 rounded-lg ${
                    isCurrent
                      ? "bg-white/20 text-white"
                      : isUnlocked
                      ? "bg-indigo-200 text-indigo-900"
                      : "bg-slate-200 text-slate-500"
                  }`}
                >
                  Level {lvl.id}
                </span>

                {isUnlocked ? (
                  starsEarned > 0 ? (
                    <div className="flex text-amber-400 text-xs">
                      {"⭐".repeat(starsEarned)}
                    </div>
                  ) : (
                    <Play
                      className={`w-3.5 h-3.5 ${
                        isCurrent ? "text-yellow-300" : "text-indigo-400"
                      }`}
                    />
                  )
                ) : (
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                )}
              </div>

              <span className="font-extrabold text-xs line-clamp-1 mt-0.5">
                {lvl.title.split(":")[1]?.trim() || lvl.title}
              </span>

              <span
                className={`text-[10px] mt-1 font-semibold ${
                  isCurrent ? "text-indigo-100" : "text-indigo-600"
                }`}
              >
                Konsep: {lvl.conceptName}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

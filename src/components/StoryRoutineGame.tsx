"use client";

import React, { useState } from "react";
import { STORY_ROUTINES } from "../data/storyRoutines";
import { RoutineStep, RoutineStory } from "../lib/types";
import { playPop, playSuccess, playVictory, playOops, speakKidFriendly } from "../lib/sounds";
import { CheckCircle2, RotateCcw, Volume2, Sparkles, ArrowRight, ArrowLeft } from "lucide-react";

interface StoryRoutineGameProps {
  onBackToMenu: () => void;
  onSuccessRoutine: () => void;
}

export const StoryRoutineGame: React.FC<StoryRoutineGameProps> = ({
  onBackToMenu,
  onSuccessRoutine,
}) => {
  const [currentRoutineIndex, setCurrentRoutineIndex] = useState(0);
  const activeRoutine = STORY_ROUTINES[currentRoutineIndex];

  // Acak urutan awal langkah agar anak bisa menyusunnya
  const shuffleSteps = (steps: RoutineStep[]) => {
    return [...steps].sort(() => Math.random() - 0.5);
  };

  const [currentOrder, setCurrentOrder] = useState<RoutineStep[]>(() =>
    shuffleSteps(activeRoutine.steps)
  );
  const [isCompleted, setIsCompleted] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSelectRoutine = (idx: number) => {
    playPop();
    setCurrentRoutineIndex(idx);
    setCurrentOrder(shuffleSteps(STORY_ROUTINES[idx].steps));
    setIsCompleted(false);
    setFeedback(null);
  };

  // Pindahkan langkah ke atas / ke bawah
  const handleMoveStep = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= currentOrder.length || isCompleted) return;
    playPop();
    const updated = [...currentOrder];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    setCurrentOrder(updated);
    setFeedback(null);
  };

  // Periksa apakah urutan sudah 1, 2, 3, 4
  const handleCheckOrder = () => {
    const isCorrect = currentOrder.every(
      (step, idx) => step.correctOrder === idx + 1
    );

    if (isCorrect) {
      playVictory();
      setIsCompleted(true);
      setFeedback(activeRoutine.successMessage);
      speakKidFriendly(activeRoutine.successMessage);
      onSuccessRoutine();
    } else {
      playOops();
      const wrongMsg = "Urutan belum pas nih! Coba pikirkan apa yang kita lakukan pertama kali ya?";
      setFeedback(wrongMsg);
      speakKidFriendly("Yuk periksa lagi urutannya!");
    }
  };

  const handleReset = () => {
    playPop();
    setCurrentOrder(shuffleSteps(activeRoutine.steps));
    setIsCompleted(false);
    setFeedback(null);
  };

  const handleSpeakDialogue = () => {
    speakKidFriendly(activeRoutine.characterDialogue);
  };

  return (
    <div className="flex flex-col gap-5 max-w-4xl mx-auto">
      {/* Tab Pilihan Cerita */}
      <div className="flex flex-wrap items-center justify-center gap-2 p-2 bg-white/80 rounded-2xl shadow-sm border border-indigo-100">
        {STORY_ROUTINES.map((routine, idx) => (
          <button
            key={routine.id}
            onClick={() => handleSelectRoutine(idx)}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl font-bold text-xs md:text-sm transition-all cursor-pointer ${
              idx === currentRoutineIndex
                ? "bg-indigo-600 text-white shadow-md scale-105"
                : "bg-slate-100 hover:bg-slate-200 text-slate-700"
            }`}
          >
            <span>{routine.icon}</span>
            <span>{routine.title.split(" ")[1]}</span>
          </button>
        ))}
      </div>

      {/* Kartu Dialog & Cerita Utama */}
      <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white p-5 rounded-3xl shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-4">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-4xl shadow-inner shrink-0 animate-bounce">
            {activeRoutine.icon}
          </div>

          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
              <span className="bg-white/30 text-xs px-2.5 py-0.5 rounded-full font-bold">
                Cerita Algoritma Nyata
              </span>
              <button
                onClick={handleSpeakDialogue}
                className="bg-white/20 hover:bg-white/40 p-1 rounded-full transition-colors cursor-pointer"
                title="Dengarkan Suara Kiki"
              >
                <Volume2 className="w-4 h-4 text-white" />
              </button>
            </div>
            <h2 className="text-xl md:text-2xl font-black">
              {activeRoutine.title}
            </h2>
            <p className="text-sm md:text-base font-medium text-white/95 mt-1">
              "{activeRoutine.characterDialogue}"
            </p>
          </div>
        </div>
      </div>

      {/* Kartu Urutan Langkah yang Dapat Ditukar */}
      <div className="bg-white/90 p-4 md:p-6 rounded-3xl shadow-xl border-4 border-indigo-200 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="text-xs md:text-sm font-extrabold text-indigo-900 flex items-center gap-1.5">
            <span>🎯</span> Susun dari Urutan Langkah 1 ke Langkah 4:
          </span>
          <span className="text-xs text-slate-500">
            Gunakan tombol ⬆️ ⬇️ untuk menukar posisi
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {currentOrder.map((step, idx) => {
            const isMatch = isCompleted && step.correctOrder === idx + 1;

            return (
              <div
                key={step.id}
                className={`flex items-center justify-between p-3.5 rounded-2xl border-2 transition-all ${
                  isMatch
                    ? "bg-emerald-50 border-emerald-400 ring-2 ring-emerald-300"
                    : "bg-slate-50 border-slate-200 hover:border-indigo-300 shadow-sm"
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Badge Nomor Langkah */}
                  <span
                    className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm shadow-xs ${
                      isMatch
                        ? "bg-emerald-500 text-white"
                        : "bg-indigo-600 text-white"
                    }`}
                  >
                    {idx + 1}
                  </span>

                  <span className="text-3xl">{step.icon}</span>

                  <div>
                    <h4 className="font-extrabold text-slate-800 text-sm md:text-base">
                      {step.title}
                    </h4>
                    <p className="text-xs text-slate-500 font-medium">
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Tombol Geser Posisi */}
                {!isCompleted && (
                  <div className="flex flex-col gap-1">
                    <button
                      disabled={idx === 0}
                      onClick={() => handleMoveStep(idx, idx - 1)}
                      className="w-7 h-7 bg-indigo-100 hover:bg-indigo-200 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg flex items-center justify-center text-indigo-700 font-black text-xs transition-colors cursor-pointer"
                    >
                      ▲
                    </button>
                    <button
                      disabled={idx === currentOrder.length - 1}
                      onClick={() => handleMoveStep(idx, idx + 1)}
                      className="w-7 h-7 bg-indigo-100 hover:bg-indigo-200 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg flex items-center justify-center text-indigo-700 font-black text-xs transition-colors cursor-pointer"
                    >
                      ▼
                    </button>
                  </div>
                )}

                {isMatch && (
                  <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
                )}
              </div>
            );
          })}
        </div>

        {/* Feedback Kotak Pesan */}
        {feedback && (
          <div
            className={`p-3.5 rounded-2xl border-2 text-center font-bold text-sm md:text-base animate-bounce ${
              isCompleted
                ? "bg-emerald-100 border-emerald-400 text-emerald-900"
                : "bg-amber-100 border-amber-400 text-amber-900"
            }`}
          >
            {feedback}
          </div>
        )}

        {/* Tombol Kontrol Bawah */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-indigo-100">
          <button
            onClick={onBackToMenu}
            className="px-4 py-2.5 rounded-xl font-bold text-xs md:text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Menu Utama</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="px-4 py-2.5 rounded-xl font-bold text-xs md:text-sm text-amber-800 bg-amber-100 hover:bg-amber-200 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Acak Ulang</span>
            </button>

            {!isCompleted ? (
              <button
                onClick={handleCheckOrder}
                className="px-6 py-2.5 rounded-xl font-black text-sm md:text-base text-white bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 border-b-4 border-emerald-800 shadow-lg active:translate-y-1 transition-all cursor-pointer flex items-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                <span>Periksa Urutan! ✨</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  if (currentRoutineIndex < STORY_ROUTINES.length - 1) {
                    handleSelectRoutine(currentRoutineIndex + 1);
                  } else {
                    onBackToMenu();
                  }
                }}
                className="px-6 py-2.5 rounded-xl font-black text-sm md:text-base text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 border-b-4 border-indigo-800 shadow-lg active:translate-y-1 transition-all cursor-pointer flex items-center gap-2"
              >
                <span>Cerita Berikutnya</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

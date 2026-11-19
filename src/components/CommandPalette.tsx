"use client";

import React from "react";
import { CommandType } from "../lib/types";
import { Play, RotateCcw, Trash2, ArrowUp, Undo2, CornerUpLeft, CornerUpRight, Sparkles } from "lucide-react";

interface CommandPaletteProps {
  allowedCommands: CommandType[];
  commands: CommandType[];
  currentStepIndex: number | null;
  isRunning: boolean;
  maxCommands?: number;
  onAddCommand: (cmd: CommandType) => void;
  onRemoveCommand: (index: number) => void;
  onClearCommands: () => void;
  onRun: () => void;
  onReset: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  allowedCommands,
  commands,
  currentStepIndex,
  isRunning,
  maxCommands = 12,
  onAddCommand,
  onRemoveCommand,
  onClearCommands,
  onRun,
  onReset,
}) => {
  const getCommandDetails = (cmd: CommandType) => {
    switch (cmd) {
      case "FORWARD":
        return {
          label: "Maju",
          sub: "1 Langkah",
          color: "bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white border-b-4 border-emerald-700",
          badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-300",
          icon: <ArrowUp className="w-6 h-6 md:w-7 md:h-7 stroke-[3]" />,
        };
      case "TURN_LEFT":
        return {
          label: "Belok Kiri",
          sub: "Putar 90°",
          color: "bg-sky-500 hover:bg-sky-600 active:bg-sky-700 text-white border-b-4 border-sky-700",
          badgeColor: "bg-sky-100 text-sky-800 border-sky-300",
          icon: <CornerUpLeft className="w-6 h-6 md:w-7 md:h-7 stroke-[3]" />,
        };
      case "TURN_RIGHT":
        return {
          label: "Belok Kanan",
          sub: "Putar 90°",
          color: "bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white border-b-4 border-amber-700",
          badgeColor: "bg-amber-100 text-amber-800 border-amber-300",
          icon: <CornerUpRight className="w-6 h-6 md:w-7 md:h-7 stroke-[3]" />,
        };
      case "JUMP":
        return {
          label: "Lompat",
          sub: "Lewati Semak",
          color: "bg-purple-500 hover:bg-purple-600 active:bg-purple-700 text-white border-b-4 border-purple-700",
          badgeColor: "bg-purple-100 text-purple-800 border-purple-300",
          icon: <span className="text-2xl md:text-3xl">🦘</span>,
        };
      case "REPEAT_2":
        return {
          label: "Ulangi 2x",
          sub: "Maju 2 Kali",
          color: "bg-pink-500 hover:bg-pink-600 active:bg-pink-700 text-white border-b-4 border-pink-700",
          badgeColor: "bg-pink-100 text-pink-800 border-pink-300",
          icon: <span className="text-2xl">🔁×2</span>,
        };
      case "REPEAT_3":
        return {
          label: "Ulangi 3x",
          sub: "Maju 3 Kali",
          color: "bg-rose-500 hover:bg-rose-600 active:bg-rose-700 text-white border-b-4 border-rose-700",
          badgeColor: "bg-rose-100 text-rose-800 border-rose-300",
          icon: <span className="text-2xl">🔁×3</span>,
        };
    }
  };

  const isFull = commands.length >= maxCommands;

  return (
    <div className="flex flex-col gap-4 bg-white/90 backdrop-blur-sm p-4 md:p-6 rounded-3xl shadow-xl border-4 border-indigo-200">
      {/* Judul Panel Kotak Algoritma */}
      <div className="flex items-center justify-between border-b border-indigo-100 pb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🧩</span>
          <div>
            <h3 className="font-extrabold text-indigo-950 text-base md:text-lg">
              Susun Algoritma Kiki
            </h3>
            <p className="text-xs text-indigo-500 font-medium">
              Tekan tombol warna-warni untuk menyusun langkah robot
            </p>
          </div>
        </div>

        {/* Counter langkah */}
        <span
          className={`text-xs font-bold px-3 py-1 rounded-full border ${
            isFull
              ? "bg-rose-100 text-rose-700 border-rose-300"
              : "bg-indigo-50 text-indigo-700 border-indigo-200"
          }`}
        >
          {commands.length} / {maxCommands} Langkah
        </span>
      </div>

      {/* Baki Antrean Algoritma (Step Sequencer) */}
      <div className="min-h-[96px] bg-indigo-50/70 p-3 rounded-2xl border-2 border-dashed border-indigo-200 flex flex-wrap items-center gap-2 relative">
        {commands.length === 0 ? (
          <div className="w-full flex flex-col items-center justify-center py-4 text-center">
            <span className="text-3xl animate-bounce mb-1">👇</span>
            <p className="text-sm font-bold text-indigo-400">
              Antrean langkah masih kosong!
            </p>
            <p className="text-xs text-indigo-300">
              Pilih tombol perintah di bawah untuk mulai menyusun kode.
            </p>
          </div>
        ) : (
          commands.map((cmd, idx) => {
            const details = getCommandDetails(cmd);
            const isCurrent = currentStepIndex === idx;

            return (
              <div
                key={`cmd-step-${idx}`}
                className={`relative flex items-center gap-1.5 px-3 py-2 rounded-xl border-2 shadow-sm transition-all duration-200 ${
                  details.badgeColor
                } ${
                  isCurrent
                    ? "ring-4 ring-yellow-400 scale-110 shadow-lg animate-pulse z-10 bg-yellow-100"
                    : "hover:scale-105"
                }`}
              >
                {/* Nomor Urutan Langkah */}
                <span className="w-5 h-5 rounded-full bg-white/90 text-[11px] font-black flex items-center justify-center text-slate-700 shadow-xs">
                  {idx + 1}
                </span>

                {/* Ikon dan Label */}
                <span className="scale-75">{details.icon}</span>
                <span className="text-xs font-bold">{details.label}</span>

                {/* Tombol Hapus Step (X) */}
                {!isRunning && (
                  <button
                    onClick={() => onRemoveCommand(idx)}
                    title="Hapus langkah ini"
                    className="ml-1 text-slate-400 hover:text-rose-500 rounded-full p-0.5 hover:bg-rose-100 transition-colors"
                  >
                    ×
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Tombol-Tombol Aksi (Command Library) */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          Pilihan Perintah:
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {allowedCommands.map((cmd) => {
            const details = getCommandDetails(cmd);
            return (
              <button
                key={cmd}
                disabled={isRunning || isFull}
                onClick={() => onAddCommand(cmd)}
                className={`flex flex-col items-center justify-center py-2.5 px-3 rounded-2xl transition-all duration-150 transform hover:-translate-y-0.5 active:translate-y-1 shadow-md ${
                  details.color
                } ${
                  isRunning || isFull ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                }`}
              >
                <div className="mb-0.5">{details.icon}</div>
                <span className="font-black text-sm">{details.label}</span>
                <span className="text-[10px] opacity-90 font-medium">
                  {details.sub}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tombol Kontrol Utama: JALANKAN, RESET, HAPUS */}
      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-indigo-100">
        <button
          disabled={isRunning || commands.length === 0}
          onClick={onRun}
          className={`col-span-2 flex items-center justify-center gap-2 py-3 px-4 rounded-2xl font-black text-base md:text-lg text-white shadow-lg transition-all duration-150 ${
            isRunning || commands.length === 0
              ? "bg-slate-300 cursor-not-allowed border-b-4 border-slate-400"
              : "bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 border-b-4 border-emerald-800 active:translate-y-1 cursor-pointer animate-pulse"
          }`}
        >
          <Play className="w-6 h-6 fill-current" />
          <span>{isRunning ? "Kiki Sedang Jalan..." : "JALANKAN KIKI! 🚀"}</span>
        </button>

        <button
          disabled={isRunning}
          onClick={onReset}
          className="flex items-center justify-center gap-1.5 py-3 px-2 rounded-2xl font-bold text-xs md:text-sm text-slate-700 bg-amber-100 hover:bg-amber-200 border-b-4 border-amber-300 active:translate-y-1 transition-all cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Ulangi</span>
        </button>
      </div>

      {/* Tombol Hapus Satu Langkah & Hapus Semua */}
      {!isRunning && commands.length > 0 && (
        <div className="flex justify-end gap-2 text-xs">
          <button
            onClick={() => onRemoveCommand(commands.length - 1)}
            className="flex items-center gap-1 text-slate-500 hover:text-amber-600 font-bold px-2 py-1 rounded-lg hover:bg-amber-50"
          >
            <Undo2 className="w-3.5 h-3.5" />
            <span>Batalkan Langkah Terakhir</span>
          </button>
          <button
            onClick={onClearCommands}
            className="flex items-center gap-1 text-rose-500 hover:text-rose-700 font-bold px-2 py-1 rounded-lg hover:bg-rose-50"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Kosongkan Semua</span>
          </button>
        </div>
      )}
    </div>
  );
};

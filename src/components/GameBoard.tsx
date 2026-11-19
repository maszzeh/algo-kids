"use client";

import React from "react";
import { Direction, Position, TileType } from "../lib/types";
import { KikiAvatar } from "./KikiAvatar";

interface GameBoardProps {
  grid: TileType[][];
  kikiPos: Position;
  kikiDir: Direction;
  visitedPath: Position[];
  isMoving: boolean;
  isJumping: boolean;
  isCelebration: boolean;
  isConfused: boolean;
  onTileClick?: (row: number, col: number) => void;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  grid,
  kikiPos,
  kikiDir,
  visitedPath,
  isMoving,
  isJumping,
  isCelebration,
  isConfused,
  onTileClick,
}) => {
  const rows = grid.length;
  const cols = rows > 0 && grid[0] ? grid[0].length : 0;

  if (rows === 0 || cols === 0) {
    return null;
  }

  const isVisited = (r: number, c: number) => {
    return visitedPath.some((pos) => pos.y === r && pos.x === c);
  };

  const renderTileContent = (tile: TileType, r: number, c: number) => {
    switch (tile) {
      case "carrot":
        return (
          <div className="relative animate-bounce">
            <span className="text-3xl md:text-4xl drop-shadow-md select-none">
              🥕
            </span>
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-1.5 bg-amber-900/20 rounded-full blur-[1px]" />
          </div>
        );

      case "star":
        return (
          <div className="relative animate-pulse">
            <span className="text-3xl md:text-4xl drop-shadow-lg select-none">
              ⭐
            </span>
            <div className="absolute -inset-1 bg-amber-400/20 rounded-full blur-sm" />
          </div>
        );

      case "water":
        return (
          <div className="relative flex flex-col items-center justify-center">
            <span className="text-2xl md:text-3xl animate-wiggle select-none">
              🦆
            </span>
            <span className="text-xs text-blue-600 font-bold bg-white/70 px-1 rounded-full shadow-sm">
              Kolam
            </span>
          </div>
        );

      case "rock":
        return (
          <div className="relative">
            <span className="text-3xl md:text-4xl drop-shadow-sm select-none">
              🪨
            </span>
          </div>
        );

      case "bush":
        return (
          <div className="relative">
            <span className="text-3xl md:text-4xl drop-shadow-sm select-none">
              🌳
            </span>
          </div>
        );

      case "key":
        return (
          <div className="relative animate-bounce">
            <span className="text-3xl md:text-4xl drop-shadow-md select-none">
              🗝️
            </span>
          </div>
        );

      case "gate":
        return (
          <div className="relative flex flex-col items-center">
            <span className="text-3xl md:text-4xl select-none">
              🚪
            </span>
            <span className="text-[10px] bg-amber-200 text-amber-900 font-bold px-1 rounded">
              Kunci
            </span>
          </div>
        );

      case "home":
        return (
          <div className="relative flex flex-col items-center animate-pulse">
            <span className="text-3xl md:text-4xl drop-shadow-md select-none">
              🏠
            </span>
            <span className="text-[10px] bg-red-100 text-red-700 font-bold px-1 rounded shadow-xs">
              Finish!
            </span>
          </div>
        );

      default:
        // Rumput biasa atau Jalan setapak
        if (isVisited(r, c) && !(kikiPos.x === c && kikiPos.y === r)) {
          return (
            <span className="text-sm opacity-50 select-none animate-pulse">
              🐾
            </span>
          );
        }
        return null;
    }
  };

  const getTileBg = (tile: TileType, r: number, c: number) => {
    const isTarget = tile === "carrot" || tile === "star" || tile === "home";

    if (tile === "water") {
      return "bg-gradient-to-b from-sky-200 to-blue-300 border-blue-400";
    }
    if (tile === "rock") {
      return "bg-gradient-to-b from-stone-200 to-stone-300 border-stone-400";
    }
    if (tile === "path" || isTarget || tile === "key" || tile === "gate") {
      return "bg-gradient-to-b from-amber-50 to-amber-100 border-amber-300";
    }
    // Rumput
    const checker = (r + c) % 2 === 0;
    return checker
      ? "bg-gradient-to-b from-emerald-100 to-green-200 border-emerald-300"
      : "bg-gradient-to-b from-green-100 to-emerald-200 border-emerald-300";
  };

  return (
    <div className="relative p-3 md:p-5 bg-gradient-to-b from-amber-100 via-amber-50 to-orange-100 rounded-3xl shadow-xl border-4 border-amber-300">
      {/* Papan Grid Permainan */}
      <div
        className="grid gap-2 md:gap-3 bg-amber-200/50 p-2 md:p-3 rounded-2xl relative"
        style={{
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
        }}
      >
        {grid.map((row, r) =>
          row.map((tile, c) => {
            const hasKiki = kikiPos.x === c && kikiPos.y === r;

            return (
              <div
                key={`tile-${r}-${c}`}
                onClick={() => onTileClick && onTileClick(r, c)}
                className={`relative w-16 h-16 sm:w-20 sm:h-20 md:w-22 md:h-22 rounded-2xl border-2 flex items-center justify-center transition-all duration-200 shadow-sm ${getTileBg(
                  tile,
                  r,
                  c
                )} ${
                  onTileClick ? "cursor-pointer hover:scale-105" : ""
                }`}
              >
                {/* Petunjuk Koordinat Tipis untuk Guru/Ortu */}
                <span className="absolute top-1 left-1.5 text-[9px] text-slate-400 font-mono font-medium">
                  {c + 1},{r + 1}
                </span>

                {/* Elemen Item di Tile (Wortel, Bintang, Rintangan) */}
                {renderTileContent(tile, r, c)}

                {/* Karakter Kiki jika berada di tile ini */}
                {hasKiki && (
                  <div className="absolute inset-0 flex items-center justify-center z-20">
                    <KikiAvatar
                      direction={kikiDir}
                      isMoving={isMoving}
                      isJumping={isJumping}
                      isCelebration={isCelebration}
                      isConfused={isConfused}
                      size={58}
                    />
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Footer Info Ceria di bawah Papan */}
      <div className="mt-3 flex items-center justify-between text-xs font-bold text-amber-900 bg-white/80 px-3 py-1.5 rounded-xl border border-amber-200">
        <span className="flex items-center gap-1.5">
          <span>🐰 Posisi Kiki:</span>
          <span className="bg-amber-100 px-2 py-0.5 rounded-md text-indigo-700">
            Kolom {kikiPos.x + 1}, Baris {kikiPos.y + 1}
          </span>
        </span>
        <span className="flex items-center gap-1">
          <span>Arah:</span>
          <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-md">
            {kikiDir === "UP" && "⬆️ Atas"}
            {kikiDir === "RIGHT" && "➡️ Kanan"}
            {kikiDir === "DOWN" && "⬇️ Bawah"}
            {kikiDir === "LEFT" && "⬅️ Kiri"}
          </span>
        </span>
      </div>
    </div>
  );
};

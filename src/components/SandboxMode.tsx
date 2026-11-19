"use client";

import React, { useState } from "react";
import { CommandType, Direction, Position, TileType } from "../lib/types";
import { GameBoard } from "./GameBoard";
import { CommandPalette } from "./CommandPalette";
import {
  playPop,
  playStep,
  playTurn,
  playJump,
  playPickup,
  playOops,
  playVictory,
  speakKidFriendly,
} from "../lib/sounds";
import { ArrowLeft, Sparkles, Wand2 } from "lucide-react";

interface SandboxModeProps {
  onBackToMenu: () => void;
  onVictory: () => void;
}

export const SandboxMode: React.FC<SandboxModeProps> = ({
  onBackToMenu,
  onVictory,
}) => {
  const initialGrid: TileType[][] = [
    ["grass", "grass", "grass", "grass", "grass"],
    ["grass", "path",  "path",  "carrot", "grass"],
    ["grass", "grass", "grass", "grass", "grass"],
    ["grass", "grass", "grass", "grass", "grass"],
  ];

  const [grid, setGrid] = useState<TileType[][]>(initialGrid);
  const [kikiPos, setKikiPos] = useState<Position>({ x: 1, y: 1 });
  const [kikiDir, setKikiDir] = useState<Direction>("RIGHT");
  const [commands, setCommands] = useState<CommandType[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [visitedPath, setVisitedPath] = useState<Position[]>([{ x: 1, y: 1 }]);
  const [selectedTool, setSelectedTool] = useState<TileType>("carrot");

  const [isMoving, setIsMoving] = useState(false);
  const [isJumping, setIsJumping] = useState(false);
  const [isCelebration, setIsCelebration] = useState(false);
  const [isConfused, setIsConfused] = useState(false);

  const tilePalette: { type: TileType; label: string; icon: string }[] = [
    { type: "carrot", label: "Wortel", icon: "🥕" },
    { type: "star", label: "Bintang", icon: "⭐" },
    { type: "path", label: "Jalan", icon: "🟫" },
    { type: "water", label: "Kolam Bebek", icon: "🦆" },
    { type: "rock", label: "Batu", icon: "🪨" },
    { type: "bush", label: "Semak", icon: "🌳" },
    { type: "grass", label: "Rumput Bersih", icon: "🟩" },
  ];

  // Klik tile untuk menaruh item saat mode edit
  const handleTileClick = (r: number, c: number) => {
    if (isRunning) return;
    playPop();
    const updated = grid.map((row, ri) =>
      row.map((cell, ci) => {
        if (ri === r && ci === c) {
          return selectedTool;
        }
        return cell;
      })
    );
    setGrid(updated);
  };

  const handleAddCommand = (cmd: CommandType) => {
    playPop();
    setCommands((prev) => [...prev, cmd]);
  };

  const handleRemoveCommand = (idx: number) => {
    playPop();
    setCommands((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleClearCommands = () => {
    playPop();
    setCommands([]);
    handleReset();
  };

  const handleReset = () => {
    playPop();
    setIsRunning(false);
    setCurrentStepIndex(null);
    setKikiPos({ x: 1, y: 1 });
    setKikiDir("RIGHT");
    setVisitedPath([{ x: 1, y: 1 }]);
    setIsMoving(false);
    setIsJumping(false);
    setIsCelebration(false);
    setIsConfused(false);
  };

  const runAlgorithm = async () => {
    if (commands.length === 0 || isRunning) return;

    setIsRunning(true);
    setIsCelebration(false);
    setIsConfused(false);
    let curX = 1;
    let curY = 1;
    let curDir: Direction = "RIGHT";
    const curVisited: Position[] = [{ x: curX, y: curY }];
    let remainingCarrots = grid.flat().filter((t) => t === "carrot").length;

    const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

    for (let i = 0; i < commands.length; i++) {
      setCurrentStepIndex(i);
      const cmd = commands[i];

      const executeSingleForward = async () => {
        let nextX = curX;
        let nextY = curY;
        if (curDir === "UP") nextY -= 1;
        if (curDir === "RIGHT") nextX += 1;
        if (curDir === "DOWN") nextY += 1;
        if (curDir === "LEFT") nextX -= 1;

        // Cek batas grid
        if (nextX < 0 || nextX >= 5 || nextY < 0 || nextY >= 4) {
          playOops();
          setIsConfused(true);
          speakKidFriendly("Aduh, Kiki mentok di pinggir!");
          await delay(800);
          return false;
        }

        const targetTile = grid[nextY][nextX];
        if (targetTile === "water" || targetTile === "rock" || targetTile === "bush") {
          playOops();
          setIsConfused(true);
          speakKidFriendly("Ups, ada rintangan di depan!");
          await delay(800);
          return false;
        }

        // Bergerak
        curX = nextX;
        curY = nextY;
        setKikiPos({ x: curX, y: curY });
        curVisited.push({ x: curX, y: curY });
        setVisitedPath([...curVisited]);
        setIsMoving(true);
        playStep();
        await delay(350);
        setIsMoving(false);

        if (targetTile === "carrot" || targetTile === "star") {
          playPickup();
          if (targetTile === "carrot") remainingCarrots--;
        }
        return true;
      };

      if (cmd === "FORWARD") {
        const ok = await executeSingleForward();
        if (!ok) break;
      } else if (cmd === "TURN_LEFT") {
        playTurn();
        if (curDir === "UP") curDir = "LEFT";
        else if (curDir === "LEFT") curDir = "DOWN";
        else if (curDir === "DOWN") curDir = "RIGHT";
        else if (curDir === "RIGHT") curDir = "UP";
        setKikiDir(curDir);
        await delay(350);
      } else if (cmd === "TURN_RIGHT") {
        playTurn();
        if (curDir === "UP") curDir = "RIGHT";
        else if (curDir === "RIGHT") curDir = "DOWN";
        else if (curDir === "DOWN") curDir = "LEFT";
        else if (curDir === "LEFT") curDir = "UP";
        setKikiDir(curDir);
        await delay(350);
      } else if (cmd === "JUMP") {
        playJump();
        setIsJumping(true);
        let nextX = curX;
        let nextY = curY;
        if (curDir === "UP") nextY -= 2;
        if (curDir === "RIGHT") nextX += 2;
        if (curDir === "DOWN") nextY += 2;
        if (curDir === "LEFT") nextX -= 2;

        if (nextX >= 0 && nextX < 5 && nextY >= 0 && nextY < 4) {
          curX = nextX;
          curY = nextY;
          setKikiPos({ x: curX, y: curY });
          curVisited.push({ x: curX, y: curY });
          setVisitedPath([...curVisited]);
        }
        await delay(500);
        setIsJumping(false);
      } else if (cmd === "REPEAT_2") {
        for (let r = 0; r < 2; r++) {
          const ok = await executeSingleForward();
          if (!ok) break;
        }
      }

      await delay(250);
    }

    setIsRunning(false);
    setCurrentStepIndex(null);

    if (remainingCarrots <= 0) {
      playVictory();
      setIsCelebration(true);
      speakKidFriendly("Yeeey, algoritma buatanmu berhasil!");
      onVictory();
    }
  };

  return (
    <div className="flex flex-col gap-5 max-w-5xl mx-auto">
      {/* Header Info Sandbox */}
      <div className="flex items-center justify-between bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 text-white p-4 rounded-3xl shadow-lg">
        <div className="flex items-center gap-3">
          <span className="text-3xl bg-white/20 p-2 rounded-2xl">🎨</span>
          <div>
            <h2 className="text-lg md:text-xl font-black">
              Arena Kreatif Bebas (Sandbox)
            </h2>
            <p className="text-xs text-white/90">
              Pasang wortel dan rintangan sesukamu, lalu rancang kodenya sendiri!
            </p>
          </div>
        </div>

        <button
          onClick={onBackToMenu}
          className="flex items-center gap-1 text-xs font-bold bg-white text-slate-800 px-3 py-2 rounded-xl shadow-xs hover:bg-amber-50 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali</span>
        </button>
      </div>

      {/* Palet Pilihan Alat (Tile Creator) */}
      <div className="bg-white/90 p-3 rounded-2xl border-2 border-amber-200 flex flex-wrap items-center justify-center gap-2">
        <span className="text-xs font-extrabold text-amber-900 mr-2 flex items-center gap-1">
          <Wand2 className="w-4 h-4" />
          <span>Pilih Alat untuk Menggambar Peta:</span>
        </span>
        {tilePalette.map((tool) => (
          <button
            key={tool.type}
            onClick={() => {
              playPop();
              setSelectedTool(tool.type);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
              selectedTool === tool.type
                ? "bg-amber-500 text-white shadow-md scale-105 ring-2 ring-amber-300"
                : "bg-amber-50 hover:bg-amber-100 text-amber-900"
            }`}
          >
            <span className="text-base">{tool.icon}</span>
            <span>{tool.label}</span>
          </button>
        ))}
      </div>

      {/* Papan & Kontrol Algoritma */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        <div className="lg:col-span-7 flex justify-center">
          <GameBoard
            grid={grid}
            kikiPos={kikiPos}
            kikiDir={kikiDir}
            visitedPath={visitedPath}
            isMoving={isMoving}
            isJumping={isJumping}
            isCelebration={isCelebration}
            isConfused={isConfused}
            onTileClick={handleTileClick}
          />
        </div>

        <div className="lg:col-span-5">
          <CommandPalette
            allowedCommands={[
              "FORWARD",
              "TURN_LEFT",
              "TURN_RIGHT",
              "JUMP",
              "REPEAT_2",
            ]}
            commands={commands}
            currentStepIndex={currentStepIndex}
            isRunning={isRunning}
            maxCommands={12}
            onAddCommand={handleAddCommand}
            onRemoveCommand={handleRemoveCommand}
            onClearCommands={handleClearCommands}
            onRun={runAlgorithm}
            onReset={handleReset}
          />
        </div>
      </div>
    </div>
  );
};

"use client";

import React, { useState, useEffect, useRef } from "react";
import { GAME_LEVELS } from "../data/gameLevels";
import { CommandType, Direction, Position, TileType } from "../lib/types";
import { GameBoard } from "../components/GameBoard";
import { CommandPalette } from "../components/CommandPalette";
import { LevelSelector } from "../components/LevelSelector";
import { StoryRoutineGame } from "../components/StoryRoutineGame";
import { SandboxMode } from "../components/SandboxMode";
import { ParentTeacherGuideModal } from "../components/ParentTeacherGuideModal";
import { ConfettiEffect } from "../components/ConfettiEffect";
import {
  playPop,
  playStep,
  playTurn,
  playJump,
  playPickup,
  playOops,
  playVictory,
  speakKidFriendly,
  toggleAudioMute,
  getAudioMuted,
} from "../lib/sounds";
import {
  Volume2,
  VolumeX,
  BookOpen,
  Sparkles,
  HelpCircle,
  Trophy,
  ArrowRight,
  RotateCcw,
  Star,
  Gamepad2,
  ListOrdered,
  Palette,
} from "lucide-react";

type GameTab = "ADVENTURE" | "ROUTINE" | "SANDBOX";

export default function KidsAlgoGamePage() {
  const [activeTab, setActiveTab] = useState<GameTab>("ADVENTURE");
  const [currentLevelId, setCurrentLevelId] = useState(1);
  const currentLevel =
    GAME_LEVELS.find((lvl) => lvl.id === currentLevelId) || GAME_LEVELS[0];

  // State Papan Petualangan
  const [grid, setGrid] = useState<TileType[][]>(() =>
    GAME_LEVELS[0].grid.map((row) => [...row])
  );
  const [kikiPos, setKikiPos] = useState<Position>(() => ({
    ...GAME_LEVELS[0].startPos,
  }));
  const [kikiDir, setKikiDir] = useState<Direction>(
    GAME_LEVELS[0].startDir
  );
  const [visitedPath, setVisitedPath] = useState<Position[]>(() => [
    { ...GAME_LEVELS[0].startPos },
  ]);
  const [commands, setCommands] = useState<CommandType[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  // Status Karakter
  const [isMoving, setIsMoving] = useState(false);
  const [isJumping, setIsJumping] = useState(false);
  const [isCelebration, setIsCelebration] = useState(false);
  const [isConfused, setIsConfused] = useState(false);

  // Inventaris & Kondisi Menang
  const [hasKey, setHasKey] = useState(false);
  const [carrotsCollected, setCarrotsCollected] = useState(0);
  const [starsCollected, setStarsCollected] = useState(0);

  // Progres Level & Reward
  const [completedLevels, setCompletedLevels] = useState<Record<number, number>>({
    1: 0,
  });
  const [showWinModal, setShowWinModal] = useState(false);
  const [winStars, setWinStars] = useState(3);
  const [confettiActive, setConfettiActive] = useState(false);

  // Dialog & Modal
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showHint, setShowHint] = useState(false);

  // Inisialisasi Level
  const initLevel = (levelId: number) => {
    const lvl = GAME_LEVELS.find((l) => l.id === levelId) || GAME_LEVELS[0];
    // Deep clone grid
    setGrid(lvl.grid.map((row) => [...row]));
    setKikiPos({ ...lvl.startPos });
    setKikiDir(lvl.startDir);
    setVisitedPath([{ ...lvl.startPos }]);
    setCommands([]);
    setCurrentStepIndex(null);
    setIsRunning(false);
    setIsMoving(false);
    setIsJumping(false);
    setIsCelebration(false);
    setIsConfused(false);
    setHasKey(false);
    setCarrotsCollected(0);
    setStarsCollected(0);
    setShowWinModal(false);
    setConfettiActive(false);
    setShowHint(false);
  };

  useEffect(() => {
    initLevel(currentLevelId);
  }, [currentLevelId]);

  // Audio Toggle
  const handleToggleMute = () => {
    const muted = toggleAudioMute();
    setIsMuted(muted);
    if (!muted) playPop();
  };

  // Suarakan Prompt Cerita
  const handleSpeakStory = () => {
    playPop();
    speakKidFriendly(currentLevel.storyPrompt);
  };

  // Tambah Perintah
  const handleAddCommand = (cmd: CommandType) => {
    if (isRunning) return;
    playPop();
    setCommands((prev) => [...prev, cmd]);
  };

  // Hapus Satu Langkah
  const handleRemoveCommand = (idx: number) => {
    if (isRunning) return;
    playPop();
    setCommands((prev) => prev.filter((_, i) => i !== idx));
  };

  // Kosongkan Langkah
  const handleClearCommands = () => {
    if (isRunning) return;
    playPop();
    setCommands([]);
    handleResetLevel();
  };

  // Reset Posisi
  const handleResetLevel = () => {
    playPop();
    initLevel(currentLevelId);
  };

  // Eksekusi Algoritma Langkah Demi Langkah
  const handleRunAlgorithm = async () => {
    if (commands.length === 0 || isRunning) return;

    setIsRunning(true);
    setIsCelebration(false);
    setIsConfused(false);

    let curX = currentLevel.startPos.x;
    let curY = currentLevel.startPos.y;
    let curDir: Direction = currentLevel.startDir;
    let keyAcquired = false;
    let cCollected = 0;
    let sCollected = 0;

    const curVisited: Position[] = [{ x: curX, y: curY }];
    const localGrid = currentLevel.grid.map((row) => [...row]);

    const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

    // Helper untuk satu langkah maju
    const stepForward = async (): Promise<boolean> => {
      let nextX = curX;
      let nextY = curY;

      if (curDir === "UP") nextY -= 1;
      if (curDir === "RIGHT") nextX += 1;
      if (curDir === "DOWN") nextY += 1;
      if (curDir === "LEFT") nextX -= 1;

      // Cek apakah keluar dari batas grid
      if (
        nextX < 0 ||
        nextX >= currentLevel.gridSize.cols ||
        nextY < 0 ||
        nextY >= currentLevel.gridSize.rows
      ) {
        playOops();
        setIsConfused(true);
        speakKidFriendly("Aduh, Kiki mentok di ujung jalan! Coba periksa langkahmu lagi ya!");
        await delay(900);
        return false;
      }

      const targetTile = localGrid[nextY][nextX];

      // Rintangan yang tak bisa dilewati dengan maju biasa
      if (targetTile === "water") {
        playOops();
        setIsConfused(true);
        speakKidFriendly("Byuuur! Kiki tercebur ke kolam bebek! Ayo coba rute lain!");
        await delay(900);
        return false;
      }
      if (targetTile === "rock") {
        playOops();
        setIsConfused(true);
        speakKidFriendly("Aduh! Kiki menabrak batu besar! Ayo perbaiki arahnya!");
        await delay(900);
        return false;
      }
      if (targetTile === "bush") {
        playOops();
        setIsConfused(true);
        speakKidFriendly("Ada semak rimbun! Kiki harus lompat, bukan jalan biasa!");
        await delay(900);
        return false;
      }
      if (targetTile === "gate" && !keyAcquired) {
        playOops();
        setIsConfused(true);
        speakKidFriendly("Gerbang terkunci! Kiki butuh kunci emas dulu!");
        await delay(900);
        return false;
      }

      // Berhasil melangkah maju
      curX = nextX;
      curY = nextY;
      setKikiPos({ x: curX, y: curY });
      curVisited.push({ x: curX, y: curY });
      setVisitedPath([...curVisited]);

      setIsMoving(true);
      playStep();
      await delay(380);
      setIsMoving(false);

      // Cek item di tile
      if (targetTile === "carrot") {
        playPickup();
        cCollected++;
        setCarrotsCollected(cCollected);
        localGrid[nextY][nextX] = "path";
        setGrid([...localGrid]);
      } else if (targetTile === "star") {
        playPickup();
        sCollected++;
        setStarsCollected(sCollected);
        localGrid[nextY][nextX] = "path";
        setGrid([...localGrid]);
      } else if (targetTile === "key") {
        playPickup();
        keyAcquired = true;
        setHasKey(true);
        localGrid[nextY][nextX] = "path";
        setGrid([...localGrid]);
        speakKidFriendly("Keren! Kunci emas sudah didapat!");
      }

      return true;
    };

    // Eksekusi tiap perintah dalam antrean
    for (let i = 0; i < commands.length; i++) {
      setCurrentStepIndex(i);
      const cmd = commands[i];

      if (cmd === "FORWARD") {
        const success = await stepForward();
        if (!success) break;
      } else if (cmd === "TURN_LEFT") {
        playTurn();
        if (curDir === "UP") curDir = "LEFT";
        else if (curDir === "LEFT") curDir = "DOWN";
        else if (curDir === "DOWN") curDir = "RIGHT";
        else if (curDir === "RIGHT") curDir = "UP";
        setKikiDir(curDir);
        await delay(360);
      } else if (cmd === "TURN_RIGHT") {
        playTurn();
        if (curDir === "UP") curDir = "RIGHT";
        else if (curDir === "RIGHT") curDir = "DOWN";
        else if (curDir === "DOWN") curDir = "LEFT";
        else if (curDir === "LEFT") curDir = "UP";
        setKikiDir(curDir);
        await delay(360);
      } else if (cmd === "JUMP") {
        // Lompat 2 petak melewati rintangan
        playJump();
        setIsJumping(true);

        let nextX = curX;
        let nextY = curY;
        if (curDir === "UP") nextY -= 2;
        if (curDir === "RIGHT") nextX += 2;
        if (curDir === "DOWN") nextY += 2;
        if (curDir === "LEFT") nextX -= 2;

        if (
          nextX >= 0 &&
          nextX < currentLevel.gridSize.cols &&
          nextY >= 0 &&
          nextY < currentLevel.gridSize.rows
        ) {
          curX = nextX;
          curY = nextY;
          setKikiPos({ x: curX, y: curY });
          curVisited.push({ x: curX, y: curY });
          setVisitedPath([...curVisited]);

          const landTile = localGrid[nextY][nextX];
          if (landTile === "carrot") {
            playPickup();
            cCollected++;
            setCarrotsCollected(cCollected);
            localGrid[nextY][nextX] = "path";
            setGrid([...localGrid]);
          }
        }
        await delay(500);
        setIsJumping(false);
      } else if (cmd === "REPEAT_2" || cmd === "REPEAT_3") {
        const loopCount = cmd === "REPEAT_2" ? 2 : 3;
        for (let l = 0; l < loopCount; l++) {
          const success = await stepForward();
          if (!success) break;
          await delay(200);
        }
      }

      await delay(250);
    }

    setIsRunning(false);
    setCurrentStepIndex(null);

    // Evaluasi Penyelesaian Level
    const reachedTargetCarrots = cCollected >= currentLevel.targetCarrots;
    const reachedTargetStars = sCollected >= currentLevel.targetStars;
    const isAtHome =
      currentLevel.requiresKey
        ? curX === currentLevel.gridSize.cols - 1 &&
          keyAcquired
        : true;

    if (reachedTargetCarrots && reachedTargetStars && isAtHome) {
      // Hore Menang!
      playVictory();
      setIsCelebration(true);
      setConfettiActive(true);

      // Hitung Bintang Efisiensi
      const stars = commands.length <= (currentLevel.maxCommands || 8) ? 3 : 2;
      setWinStars(stars);
      setCompletedLevels((prev) => ({
        ...prev,
        [currentLevel.id]: Math.max(prev[currentLevel.id] || 0, stars),
      }));

      speakKidFriendly("Horeee! Algoritma susunanmu berhasil 100%! Kamu hebat!");
      setShowWinModal(true);
    }
  };

  // Pindah ke Level Berikutnya
  const handleNextLevel = () => {
    playPop();
    setShowWinModal(false);
    setConfettiActive(false);
    if (currentLevelId < GAME_LEVELS.length) {
      setCurrentLevelId(currentLevelId + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-100 via-sky-100 to-indigo-100 text-slate-900 pb-12 selection:bg-pink-300">
      {/* Efek Pesta Konfeti Kemenangan */}
      <ConfettiEffect active={confettiActive} />

      {/* Header Utama Navigasi Ramah Anak */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b-4 border-indigo-200 shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo & Judul Game */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center text-3xl shadow-md border-2 border-white animate-bounce">
              🐰
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-black text-indigo-950 text-base md:text-xl tracking-tight">
                  Petualangan Kiki si Robot Kelinci
                </h1>
                <span className="bg-pink-100 text-pink-700 font-extrabold text-[10px] md:text-xs px-2 py-0.5 rounded-full border border-pink-200">
                  Usia 4-6 Th
                </span>
              </div>
              <p className="text-xs text-indigo-600 font-semibold hidden sm:block">
                Belajar Konsep Algoritma & Urutan Langkah dengan Gembira
              </p>
            </div>
          </div>

          {/* Tombol Panduan & Suara */}
          <div className="flex items-center gap-2">
            {/* Indikator Total Bintang */}
            <div className="flex items-center gap-1.5 bg-amber-50 border-2 border-amber-300 px-3 py-1.5 rounded-2xl text-xs font-black text-amber-800 shadow-xs">
              <Star className="w-4 h-4 fill-amber-400 text-amber-500 animate-pulse" />
              <span>
                {Object.values(completedLevels).reduce((a, b) => a + b, 0)} ⭐
              </span>
            </div>

            {/* Suara On/Off */}
            <button
              onClick={handleToggleMute}
              className="p-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-2xl border-2 border-indigo-200 shadow-xs transition-colors cursor-pointer"
              title={isMuted ? "Nyalakan Suara" : "Matikan Suara"}
            >
              {isMuted ? (
                <VolumeX className="w-5 h-5 text-rose-500" />
              ) : (
                <Volume2 className="w-5 h-5 text-indigo-600" />
              )}
            </button>

            {/* Panduan Ortu / Guru */}
            <button
              onClick={() => {
                playPop();
                setIsGuideOpen(true);
              }}
              className="flex items-center gap-1 px-3 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-2xl font-bold text-xs shadow-md border-b-2 border-indigo-900 cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span className="hidden md:inline">Panduan Ortu & Guru</span>
            </button>
          </div>
        </div>

        {/* Tab Pilihan Mode Game */}
        <div className="max-w-6xl mx-auto px-4 pb-2 pt-1 flex items-center justify-center gap-2">
          <button
            onClick={() => {
              playPop();
              setActiveTab("ADVENTURE");
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-black text-xs md:text-sm transition-all cursor-pointer ${
              activeTab === "ADVENTURE"
                ? "bg-indigo-600 text-white shadow-md border-b-4 border-indigo-800 scale-105"
                : "bg-slate-100 hover:bg-slate-200 text-slate-700"
            }`}
          >
            <Gamepad2 className="w-4 h-4" />
            <span>Petualangan Level 🗺️</span>
          </button>

          <button
            onClick={() => {
              playPop();
              setActiveTab("ROUTINE");
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-black text-xs md:text-sm transition-all cursor-pointer ${
              activeTab === "ROUTINE"
                ? "bg-purple-600 text-white shadow-md border-b-4 border-purple-800 scale-105"
                : "bg-slate-100 hover:bg-slate-200 text-slate-700"
            }`}
          >
            <ListOrdered className="w-4 h-4" />
            <span>Algoritma Sehari-hari 🥪</span>
          </button>

          <button
            onClick={() => {
              playPop();
              setActiveTab("SANDBOX");
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-black text-xs md:text-sm transition-all cursor-pointer ${
              activeTab === "SANDBOX"
                ? "bg-amber-500 text-white shadow-md border-b-4 border-amber-700 scale-105"
                : "bg-slate-100 hover:bg-slate-200 text-slate-700"
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>Arena Bebas (Sandbox) 🎨</span>
          </button>
        </div>
      </header>

      {/* Konten Utama Sesuai Tab Aktif */}
      <main className="max-w-6xl mx-auto px-4 pt-5">
        {activeTab === "ADVENTURE" && (
          <div className="flex flex-col gap-5">
            {/* Kotak Cerita Level & Konsep Edukasi */}
            <div className="bg-gradient-to-r from-indigo-500 via-sky-500 to-emerald-400 text-white p-4 md:p-5 rounded-3xl shadow-xl relative overflow-hidden border-4 border-white/50">
              <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 md:w-16 md:h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-3xl shadow-inner shrink-0">
                    🐰
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="bg-white/30 text-[11px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        {currentLevel.conceptName}
                      </span>
                      <button
                        onClick={handleSpeakStory}
                        className="flex items-center gap-1 bg-white/20 hover:bg-white/40 text-[11px] font-bold px-2 py-0.5 rounded-full transition-colors cursor-pointer"
                        title="Dengarkan Suara Kiki"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Dengarkan Kiki</span>
                      </button>
                    </div>
                    <h2 className="text-lg md:text-2xl font-black mt-0.5">
                      {currentLevel.title}
                    </h2>
                    <p className="text-xs md:text-sm font-medium text-white/95 mt-1">
                      "{currentLevel.storyPrompt}"
                    </p>
                  </div>
                </div>

                {/* Tombol Petunjuk Bantuan */}
                <button
                  onClick={() => {
                    playPop();
                    setShowHint(!showHint);
                    if (!showHint) speakKidFriendly(currentLevel.hint);
                  }}
                  className="flex items-center gap-1.5 bg-yellow-400 hover:bg-yellow-300 text-yellow-950 font-black text-xs md:text-sm px-4 py-2.5 rounded-2xl shadow-md border-b-2 border-yellow-600 transition-all cursor-pointer self-stretch md:self-auto justify-center"
                >
                  <HelpCircle className="w-4 h-4" />
                  <span>{showHint ? "Tutup Bantuan" : "Butuh Bantuan? 💡"}</span>
                </button>
              </div>

              {/* Tampilan Kotak Bantuan */}
              {showHint && (
                <div className="mt-3 p-3 bg-white/95 text-slate-800 rounded-2xl shadow-lg border-2 border-yellow-400 text-xs md:text-sm font-bold flex items-center gap-2 animate-fadeIn">
                  <span className="text-xl">💡</span>
                  <span>{currentLevel.hint}</span>
                </div>
              )}
            </div>

            {/* Papan Grid & Palet Algoritma */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
              {/* Papan Game di Sebelah Kiri */}
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
                />
              </div>

              {/* Panel Perintah & Baki Antrean di Sebelah Kanan */}
              <div className="lg:col-span-5">
                <CommandPalette
                  allowedCommands={currentLevel.allowedCommands}
                  commands={commands}
                  currentStepIndex={currentStepIndex}
                  isRunning={isRunning}
                  maxCommands={currentLevel.maxCommands || 8}
                  onAddCommand={handleAddCommand}
                  onRemoveCommand={handleRemoveCommand}
                  onClearCommands={handleClearCommands}
                  onRun={handleRunAlgorithm}
                  onReset={handleResetLevel}
                />
              </div>
            </div>

            {/* Peta Pilihan Level di Bawah */}
            <LevelSelector
              currentLevelId={currentLevelId}
              completedLevels={completedLevels}
              onSelectLevel={(id) => setCurrentLevelId(id)}
            />
          </div>
        )}

        {activeTab === "ROUTINE" && (
          <StoryRoutineGame
            onBackToMenu={() => setActiveTab("ADVENTURE")}
            onSuccessRoutine={() => {
              setConfettiActive(true);
              setTimeout(() => setConfettiActive(false), 4000);
            }}
          />
        )}

        {activeTab === "SANDBOX" && (
          <SandboxMode
            onBackToMenu={() => setActiveTab("ADVENTURE")}
            onVictory={() => {
              setConfettiActive(true);
              setTimeout(() => setConfettiActive(false), 4000);
            }}
          />
        )}
      </main>

      {/* Modal Popup Kemenangan Level */}
      {showWinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border-4 border-yellow-300 p-6 flex flex-col items-center text-center relative">
            <div className="w-20 h-20 bg-gradient-to-tr from-yellow-300 to-amber-400 rounded-3xl flex items-center justify-center text-4xl shadow-lg -mt-14 mb-3 border-4 border-white animate-bounce">
              🏆
            </div>

            <h3 className="text-2xl font-black text-indigo-950">
              Horeee! Kamu Juara! 🎉
            </h3>
            <p className="text-sm font-semibold text-slate-600 mt-1">
              Kiki berhasil mencapai tujuan berkat algoritma pintarmu!
            </p>

            {/* Bintang Skor */}
            <div className="flex gap-2 text-4xl my-4 animate-pulse">
              {"⭐".repeat(winStars)}
            </div>

            <div className="bg-indigo-50 p-3 rounded-2xl border border-indigo-200 text-xs text-indigo-900 font-bold mb-4">
              Konsep yang kamu pelajari: <br />
              <span className="text-indigo-600 text-sm font-black">
                {currentLevel.conceptName}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 w-full">
              <button
                onClick={() => {
                  playPop();
                  setShowWinModal(false);
                  setConfettiActive(false);
                  initLevel(currentLevelId);
                }}
                className="py-3 px-4 rounded-2xl font-bold text-xs md:text-sm text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Main Lagi</span>
              </button>

              <button
                onClick={handleNextLevel}
                className="py-3 px-4 rounded-2xl font-black text-xs md:text-sm text-white bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 border-b-4 border-emerald-800 shadow-lg active:translate-y-1 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Level Lanjut!</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Panduan Guru & Orang Tua */}
      <ParentTeacherGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />
    </div>
  );
}

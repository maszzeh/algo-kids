export type Direction = 'UP' | 'RIGHT' | 'DOWN' | 'LEFT';

export type CommandType = 
  | 'FORWARD'      // Maju 1 langkah
  | 'TURN_LEFT'    // Belok Kiri
  | 'TURN_RIGHT'   // Belok Kanan
  | 'JUMP'         // Lompat melewati rintangan rendah
  | 'REPEAT_2'     // Ulangi 2x (pengenalan loop)
  | 'REPEAT_3';    // Ulangi 3x

export type TileType = 
  | 'grass'        // Rumput biasa
  | 'path'         // Jalan setapak
  | 'water'        // Kolam air (rintangan bebek)
  | 'rock'         // Batu besar (rintangan tak bisa dilewati)
  | 'bush'         // Semak kecil (bisa dilompati)
  | 'carrot'       // Makanan kesukaan Kiki (tujuan utama / item koleksi)
  | 'star'         // Bintang bonus
  | 'key'          // Kunci emas
  | 'gate'         // Pintu pagar (butuh kunci)
  | 'home';        // Rumah kelinci tempat istirahat

export interface Position {
  x: number;
  y: number;
}

export interface LevelData {
  id: number;
  title: string;
  subtitle: string;
  conceptName: string;
  conceptDescription: string;
  storyPrompt: string;
  gridSize: { rows: number; cols: number };
  startPos: Position;
  startDir: Direction;
  grid: TileType[][];
  targetCarrots: number;
  targetStars: number;
  requiresKey?: boolean;
  allowedCommands: CommandType[];
  maxCommands?: number;
  hint: string;
}

export interface RoutineStep {
  id: string;
  icon: string;
  title: string;
  description: string;
  correctOrder: number;
}

export interface RoutineStory {
  id: string;
  title: string;
  themeColor: string;
  characterDialogue: string;
  icon: string;
  steps: RoutineStep[];
  successMessage: string;
}

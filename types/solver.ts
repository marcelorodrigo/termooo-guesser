export type CellState = 'empty' | 'green' | 'yellow' | 'gray';

export interface CellData {
  letter: string;
  state: CellState;
}

export interface Guess {
  cells: CellData[];
}

export interface LetterInfo {
  minCount: number;
  maxCount: number | null;
  exactPositions: Set<number>;
  excludedPositions: Set<number>;
}

export interface SolverState {
  letterInfo: Map<string, LetterInfo>;
  fullyExcluded: Set<string>;
}

export interface RankedCandidate {
  word: string;
  score: number;
}

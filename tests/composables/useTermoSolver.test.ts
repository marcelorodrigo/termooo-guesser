import { describe, expect, it } from 'vitest';
import { useTermoSolver } from '~/composables/useTermoSolver';
import type { CellData, Guess } from '~/types/solver';

function makeCell(letter: string, state: CellData['state']): CellData {
  return { letter, state };
}

function makeGuess(cells: CellData[]): Guess {
  return { cells };
}

describe('useTermoSolver', () => {
  describe('filterCandidates', () => {
    it('excludes words containing fully excluded letters', () => {
      const wordList = ['areia', 'porta', 'termo', 'turme', 'ursao', 'topar'];
      const solver = useTermoSolver(wordList);
      const guesses = [
        makeGuess([
          makeCell('p', 'gray'),
          makeCell('u', 'gray'),
          makeCell('x', 'gray'),
          makeCell('y', 'gray'),
          makeCell('z', 'gray'),
        ]),
      ];
      const state = solver.computeState(guesses);
      const filtered = solver.filterCandidates(wordList, state);
      expect(filtered).toEqual(['areia', 'termo']);
    });

    it('includes words with letters at wrong positions (yellow)', () => {
      const wordList = ['areia', 'porta', 'termo', 'turma', 'ursao', 'limpo'];
      const solver = useTermoSolver(wordList);
      const guesses = [
        makeGuess([
          makeCell('a', 'yellow'),
          makeCell('x', 'gray'),
          makeCell('u', 'yellow'),
          makeCell('y', 'gray'),
          makeCell('z', 'gray'),
        ]),
      ];
      const state = solver.computeState(guesses);
      const filtered = solver.filterCandidates(wordList, state);
      expect(filtered).toEqual(['turma', 'ursao']);
    });

    it('includes words with letters at exact positions (green)', () => {
      const wordList = ['areia', 'porta', 'turma', 'amero', 'ursao', 'limao', 'amora'];
      const solver = useTermoSolver(wordList);
      const guesses = [
        makeGuess([
          makeCell('a', 'green'),
          makeCell('x', 'gray'),
          makeCell('y', 'gray'),
          makeCell('z', 'gray'),
          makeCell('a', 'green'),
        ]),
      ];
      const state = solver.computeState(guesses);
      const filtered = solver.filterCandidates(wordList, state);
      expect(filtered).toEqual(['areia', 'amora']);
    });
  });

  describe('computeState with duplicate letters', () => {
    it('handles duplicate letters correctly (areia has two a)', () => {
      const wordList = ['areia', 'porta', 'termo'];
      const solver = useTermoSolver(wordList);
      const guesses = [
        makeGuess([
          makeCell('a', 'green'),
          makeCell('r', 'green'),
          makeCell('e', 'green'),
          makeCell('i', 'green'),
          makeCell('a', 'green'),
        ]),
      ];
      const state = solver.computeState(guesses);
      expect(state.letterInfo.get('a')?.minCount).toBe(2);
      expect(state.letterInfo.get('a')?.exactPositions).toEqual(new Set([0, 4]));
    });

    it('handles gray duplicate when another instance is green', () => {
      const wordList = ['areia', 'porta', 'termo'];
      const solver = useTermoSolver(wordList);
      const guesses = [
        makeGuess([
          makeCell('a', 'green'),
          makeCell('r', 'gray'),
          makeCell('e', 'gray'),
          makeCell('i', 'gray'),
          makeCell('a', 'green'),
        ]),
      ];
      const state = solver.computeState(guesses);
      expect(state.letterInfo.get('a')?.minCount).toBe(2);
      expect(state.fullyExcluded.has('r')).toBe(true);
      expect(state.fullyExcluded.has('e')).toBe(true);
      expect(state.fullyExcluded.has('i')).toBe(true);
    });

    it('handles yellow duplicate correctly', () => {
      const solver = useTermoSolver(['areia', 'amora', 'porta']);
      const guesses = [
        makeGuess([
          makeCell('a', 'yellow'),
          makeCell('m', 'gray'),
          makeCell('o', 'gray'),
          makeCell('r', 'gray'),
          makeCell('a', 'yellow'),
        ]),
      ];
      const state = solver.computeState(guesses);
      expect(state.letterInfo.get('a')?.minCount).toBe(2);
      expect(state.letterInfo.get('a')?.excludedPositions).toEqual(new Set([0, 4]));
    });
  });

  describe('rankCandidates', () => {
    it('ranks candidates by unique letter frequency', () => {
      const solver = useTermoSolver(['abcde', 'aabbb', 'xyzab']);
      const candidates = ['abcde', 'aabbb', 'xyzab'];
      const state = solver.computeState([]);
      const ranked = solver.rankCandidates(candidates, state);
      expect(ranked[0].word).toBe('abcde');
      expect(ranked[ranked.length - 1].word).toBe('aabbb');
    });
  });

  describe('solve', () => {
    it('returns all words ranked when no guesses', () => {
      const solver = useTermoSolver(['abc', 'def', 'ghi']);
      const result = solver.solve([]);
      expect(result.length).toBe(3);
    });

    it('filters and ranks after guesses', () => {
      const wordList = ['areia', 'porta', 'turma', 'amero', 'ursao', 'limao', 'amora'];
      const solver = useTermoSolver(wordList);
      const guesses = [
        makeGuess([
          makeCell('a', 'green'),
          makeCell('x', 'gray'),
          makeCell('y', 'gray'),
          makeCell('z', 'gray'),
          makeCell('a', 'green'),
        ]),
      ];
      const result = solver.solve(guesses);
      expect(result.map(r => r.word)).toEqual(['areia', 'amora']);
    });
  });
});

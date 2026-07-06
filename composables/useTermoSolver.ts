import type { CellData, Guess, LetterInfo, RankedCandidate, SolverState } from '~/types/solver';

export function useTermoSolver(wordList: string[]) {
  function computeState(guesses: Guess[]): SolverState {
    const letterInfo = new Map<string, LetterInfo>();
    const fullyExcluded = new Set<string>();

    for (const guess of guesses) {
      const cellsByLetter = new Map<string, { cell: CellData; pos: number }[]>();
      for (let i = 0; i < guess.cells.length; i++) {
        const cell = guess.cells[i];
        if (cell.letter === '' || cell.state === 'empty') continue;
        if (!cellsByLetter.has(cell.letter)) {
          cellsByLetter.set(cell.letter, []);
        }
        cellsByLetter.get(cell.letter)!.push({ cell, pos: i });
      }

      for (const [letter, entries] of cellsByLetter) {
        const greenEntries = entries.filter(e => e.cell.state === 'green');
        const yellowEntries = entries.filter(e => e.cell.state === 'yellow');
        const grayEntries = entries.filter(e => e.cell.state === 'gray');

        if (greenEntries.length + yellowEntries.length > 0) {
          fullyExcluded.delete(letter);
          if (!letterInfo.has(letter)) {
            letterInfo.set(letter, {
              minCount: 0,
              exactPositions: new Set<number>(),
              excludedPositions: new Set<number>(),
            });
          }
          const info = letterInfo.get(letter)!;
          for (const entry of greenEntries) {
            info.exactPositions.add(entry.pos);
            info.minCount++;
          }
          for (const entry of yellowEntries) {
            info.excludedPositions.add(entry.pos);
            info.minCount++;
          }
          for (const entry of grayEntries) {
            info.excludedPositions.add(entry.pos);
          }
        } else {
          if (!letterInfo.has(letter) || letterInfo.get(letter)!.minCount === 0) {
            fullyExcluded.add(letter);
          }
        }
      }
    }

    return { letterInfo, fullyExcluded };
  }

  function filterCandidates(words: string[], state: SolverState): string[] {
    return words.filter(word => {
      for (const letter of state.fullyExcluded) {
        if (word.includes(letter)) return false;
      }

      for (const [letter, info] of state.letterInfo) {
        const count = word.split('').filter(c => c === letter).length;
        if (count < info.minCount) return false;

        for (const pos of info.exactPositions) {
          if (word[pos] !== letter) return false;
        }

        for (const pos of info.excludedPositions) {
          if (word[pos] === letter) return false;
        }
      }

      return true;
    });
  }

  function rankCandidates(candidates: string[], _state: SolverState): RankedCandidate[] {
    const letterFrequency = new Map<string, number>();
    for (const word of candidates) {
      const uniqueLetters = new Set(word.split(''));
      for (const letter of uniqueLetters) {
        letterFrequency.set(letter, (letterFrequency.get(letter) || 0) + 1);
      }
    }

    return candidates
      .map(word => {
        const uniqueLetters = new Set(word.split(''));
        let score = 0;
        for (const letter of uniqueLetters) {
          score += letterFrequency.get(letter) || 0;
        }
        return { word, score };
      })
      .sort((a, b) => b.score - a.score);
  }

  function solve(guesses: Guess[]): RankedCandidate[] {
    const state = computeState(guesses);
    const filtered = filterCandidates(wordList, state);
    return rankCandidates(filtered, state);
  }

  return {
    computeState,
    filterCandidates,
    rankCandidates,
    solve,
  };
}

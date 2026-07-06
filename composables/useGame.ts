import { computed, ref, watch } from 'vue';
import type { CellData, Guess, RankedCandidate } from '~/types/solver';
import wordsRaw from '~/assets/words.txt?raw';
import { useTermoSolver } from '~/composables/useTermoSolver';

const MAX_ROWS = 6;
const COLS = 5;

function createEmptyGrid(): CellData[][] {
  return Array.from({ length: MAX_ROWS }, () =>
    Array.from({ length: COLS }, () => ({ letter: '', state: 'empty' as const }))
  );
}

function createEmptyCell(): CellData {
  return { letter: '', state: 'empty' };
}

export function useGame() {
  const wordList = wordsRaw.trim().split('\n').filter(w => w.length === 5);
  const solver = useTermoSolver(wordList);

  const grid = ref<CellData[][]>(createEmptyGrid());
  const currentRow = ref(0);
  const currentCol = ref(0);
  const submittedGuesses = ref<Guess[]>([]);
  const candidates = ref<RankedCandidate[]>(
    solver.solve([])
  );

  const gameOver = computed(() => currentRow.value >= MAX_ROWS);

  function typeLetter(letter: string) {
    if (gameOver.value) return;
    if (!/^[a-zA-Z]$/.test(letter)) return;
    letter = letter.toLowerCase();

    const cell = grid.value[currentRow.value][currentCol.value];
    cell.letter = letter;
    if (cell.state === 'empty') {
      cell.state = 'green';
    }
    if (currentCol.value < COLS - 1) {
      currentCol.value++;
    }
  }

  function deleteLetter() {
    if (gameOver.value) return;

    const cell = grid.value[currentRow.value][currentCol.value];
    if (cell.letter !== '') {
      cell.letter = '';
      cell.state = 'empty';
    } else if (currentCol.value > 0) {
      currentCol.value--;
      const prevCell = grid.value[currentRow.value][currentCol.value];
      prevCell.letter = '';
      prevCell.state = 'empty';
    }
  }

  function cycleCell(row: number, col: number) {
    if (gameOver.value) return;
    if (row !== currentRow.value) return;
    const cell = grid.value[row][col];
    if (cell.letter === '') return;

    const cycle: CellData['state'][] = ['green', 'yellow', 'gray', 'empty'];
    const idx = cycle.indexOf(cell.state);
    cell.state = cycle[(idx + 1) % cycle.length];
  }

  function submitRow() {
    if (gameOver.value) return;

    const row = grid.value[currentRow.value];
    const allFilled = row.every(c => c.letter !== '' && c.state !== 'empty');
    if (!allFilled) return;

    const guess: Guess = {
      cells: row.map(c => ({ ...c })),
    };
    submittedGuesses.value.push(guess);

    currentRow.value++;
    currentCol.value = 0;

    if (currentRow.value < MAX_ROWS) {
      grid.value[currentRow.value] = Array.from({ length: COLS }, () => createEmptyCell());
    }
  }

  function reset() {
    grid.value = createEmptyGrid();
    currentRow.value = 0;
    currentCol.value = 0;
    submittedGuesses.value = [];
    candidates.value = solver.solve([]);
  }

  watch(submittedGuesses, (guesses) => {
    candidates.value = solver.solve(guesses);
  }, { deep: true });

  return {
    grid,
    currentRow,
    currentCol,
    candidates,
    gameOver,
    typeLetter,
    deleteLetter,
    cycleCell,
    submitRow,
    reset,
  };
}

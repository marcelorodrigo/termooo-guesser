<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { useGame } from '~/composables/useGame';

const {
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
} = useGame();

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter') {
    submitRow();
  } else if (e.key === 'Backspace') {
    deleteLetter();
  } else if (/^[a-zA-Z]$/.test(e.key)) {
    e.preventDefault();
    typeLetter(e.key.toLowerCase());
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
});
</script>

<template>
  <div class="page">
    <h1>Termooo Guesser</h1>
    <p class="instructions">
      Type a letter, click cells to cycle state (green/yellow/gray), press Enter to submit.
    </p>
    <WordleGrid
      :grid="grid"
      :current-row="currentRow"
      :current-col="currentCol"
      :game-over="gameOver"
      @cycle-cell="cycleCell"
    />
    <div class="actions">
      <button @click="submitRow" :disabled="gameOver">Submit Row</button>
      <button @click="reset">Reset</button>
    </div>
    <CandidateList :candidates="candidates" />
  </div>
</template>

<style scoped>
.page {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
}

h1 {
  color: #d7dadc;
  margin-bottom: 10px;
}

.instructions {
  color: #818384;
  font-size: 0.9rem;
  margin-bottom: 20px;
}

.actions {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin: 20px 0;
}

button {
  background-color: #538d4e;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 1rem;
  cursor: pointer;
  border-radius: 4px;
}

button:hover:not(:disabled) {
  background-color: #6aaa64;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>

<script setup lang="ts">
import type { CellData } from '~/types/solver';

const props = defineProps<{
  grid: CellData[][];
  currentRow: number;
  currentCol: number;
  gameOver: boolean;
}>();

const emit = defineEmits<{
  cycleCell: [row: number, col: number];
}>();

function cellClass(cell: CellData, row: number, col: number): string {
  const classes = ['cell'];
  classes.push(`state-${cell.state}`);
  if (row === props.currentRow && col === props.currentCol && !props.gameOver) {
    classes.push('active');
  }
  return classes.join(' ');
}
</script>

<template>
  <div class="grid">
    <div v-for="(row, rowIdx) in grid" :key="rowIdx" class="row">
      <div
        v-for="(cell, colIdx) in row"
        :key="colIdx"
        :class="cellClass(cell, rowIdx, colIdx)"
        @click="emit('cycleCell', rowIdx, colIdx)"
      >
        {{ cell.letter.toUpperCase() }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.grid {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin: 20px auto;
  width: fit-content;
}

.row {
  display: flex;
  gap: 5px;
}

.cell {
  width: 56px;
  height: 56px;
  border: 2px solid #3a3a3c;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: bold;
  text-transform: uppercase;
  cursor: pointer;
  user-select: none;
  transition: background-color 0.2s;
}

.cell.state-empty {
  background-color: transparent;
}

.cell.state-green {
  background-color: #6aaa64;
  border-color: #6aaa64;
  color: white;
}

.cell.state-yellow {
  background-color: #c9b458;
  border-color: #c9b458;
  color: white;
}

.cell.state-gray {
  background-color: #787c7e;
  border-color: #787c7e;
  color: white;
}

.cell.active {
  border-color: #565758;
}
</style>

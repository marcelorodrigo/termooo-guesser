<script setup lang="ts">
import type { RankedCandidate } from '~/types/solver';

defineProps<{
  candidates: RankedCandidate[];
}>();
</script>

<template>
  <div class="candidates">
    <h2>Candidates: {{ candidates.length }}</h2>
    <div v-if="candidates.length === 0" class="empty">
      No candidates match the current constraints.
    </div>
    <ul v-else>
      <li v-for="(c, i) in candidates" :key="c.word" class="candidate">
        <span class="rank">{{ i + 1 }}.</span>
        <span class="word">{{ c.word }}</span>
        <span class="score">{{ c.score }}</span>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.candidates {
  margin: 20px auto;
  max-width: 400px;
  text-align: left;
}

h2 {
  color: #d7dadc;
  margin-bottom: 10px;
  font-size: 1.2rem;
}

.empty {
  color: #818384;
  font-style: italic;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
  max-height: 300px;
  overflow-y: auto;
}

.candidate {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 4px 8px;
  border-bottom: 1px solid #3a3a3c;
}

.rank {
  color: #818384;
  min-width: 30px;
}

.word {
  font-family: monospace;
  font-size: 1.1rem;
  color: #d7dadc;
  text-transform: uppercase;
}

.score {
  margin-left: auto;
  background-color: #3a3a3c;
  color: #d7dadc;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.85rem;
}
</style>

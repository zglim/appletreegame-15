<script setup>
import { onMounted, computed } from "vue";
import { useAppleTreeStore } from "@/stores/index";
import router from "@/router/index.js";
const appleStore = useAppleTreeStore();

const best = computed(() => appleStore.bestScoreData);
const history = computed(() => appleStore.historyData);

onMounted(() => {
  appleStore.loadHistory();
});

function formatTime(seconds) {
  if (!seconds && seconds !== 0) return '--';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s}s`;
}

function playNow() {
  appleStore.resetGameState();
  appleStore.setPlayingStatus(true);
  appleStore.startTimer();
  router.push({ name: "game" });
}
</script>

<template>
  <main class="main-screen">
    <h1>Apple Tree Game</h1>

    <div v-if="best" class="best-badge">
      <div class="best-label">Best Score</div>
      <div class="best-value">
        <span class="score">{{ best.totalScore }}</span>
        <span class="rating" :class="'rating-' + best.rating">{{ best.rating }}</span>
      </div>
      <div class="best-time">{{ formatTime(best.duration) }}</div>
    </div>

    <button class="home-button" @click="playNow()">Play Button</button>

    <div v-if="history && history.length > 0" class="recent-games">
      <h3>Recent Games</h3>
      <div class="game-list">
        <div v-for="(rec, idx) in history.slice(0, 3)" :key="idx" class="game-item">
          <span class="g-score">{{ rec.totalScore }} pts</span>
          <span class="g-rating" :class="'rating-' + rec.rating">{{ rec.rating }}</span>
          <span class="g-time">{{ formatTime(rec.duration) }}</span>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.main-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
  transition: margin 0.5s ease-out;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

h1 {
  color: white;
  margin-bottom: 30px;
}

.best-badge {
  background: white;
  border-radius: 16px;
  padding: 20px 30px;
  margin-bottom: 30px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.best-label {
  color: #666;
  font-size: 14px;
  margin-bottom: 8px;
}

.best-value {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 8px;
}

.score {
  font-size: 32px;
  font-weight: bold;
  color: #516dff;
}

.rating {
  display: inline-block;
  width: 28px;
  height: 28px;
  line-height: 28px;
  text-align: center;
  border-radius: 6px;
  font-weight: bold;
  font-size: 16px;
}

.rating-S { background: #ffd700; color: #333; }
.rating-A { background: #4caf50; color: white; }
.rating-B { background: #2196f3; color: white; }
.rating-C { background: #ff9800; color: white; }
.rating-D { background: #9e9e9e; color: white; }
.rating-F { background: #f44336; color: white; }

.best-time {
  color: #999;
  font-size: 14px;
}

.home-button {
  border: 0;
  background-color: #fff;
  color: #516dff;
  padding: 15px 40px;
  font-family: inherit;
  cursor: pointer;
  border-radius: 12px;
  font-size: 18px;
  font-weight: 600;
  transition: transform 0.2s, box-shadow 0.2s;
  margin-bottom: 30px;
}

.home-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.recent-games {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  padding: 20px;
  max-width: 400px;
  width: 90%;
}

.recent-games h3 {
  margin: 0 0 15px 0;
  color: #333;
}

.game-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.game-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 8px;
}

.g-score {
  font-weight: 600;
  color: #333;
  flex: 1;
}

.g-rating {
  width: 24px;
  height: 24px;
  line-height: 24px;
  font-size: 12px;
}

.g-time {
  color: #666;
  font-size: 14px;
}
</style>

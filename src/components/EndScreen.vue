<script setup>
import { computed } from 'vue';
import { useAppleTreeStore } from "../stores/index";
import router from "@/router/index.js";

const appleStore = useAppleTreeStore();

const result = computed(() => appleStore.currentResultData);
const best = computed(() => appleStore.bestScoreData);
const history = computed(() => appleStore.historyData);
const newRecord = computed(() => appleStore.isRecordData);

function formatTime(seconds) {
  if (!seconds && seconds !== 0) return '--';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s}s`;
}

function goHome() {
  appleStore.resetGameState();
  appleStore.setPlayingStatus(false);
  router.push({ name: "home" });
}

function playAgain() {
  appleStore.resetGameState();
  appleStore.setPlayingStatus(true);
  appleStore.startTimer();
  router.push({ name: "game" });
}
</script>

<template>
  <main class="end-screen">
    <div class="result-card">
      <div v-if="newRecord" class="record-banner">🏆 New Record!</div>
      <h1 class="title">Game Over</h1>

      <div v-if="result" class="stats">
        <div class="stat-row">
          <span class="label">Duration</span>
          <span class="value">{{ formatTime(result.duration) }}</span>
        </div>
        <div class="stat-row">
          <span class="label">Apples Collected</span>
          <span class="value">{{ result.collectedApples }} / {{ result.totalApples }}</span>
        </div>
        <div class="stat-row">
          <span class="label">Completion</span>
          <span class="value">{{ result.completionRate }}%</span>
        </div>
        <div class="stat-row score-row">
          <span class="label">Score</span>
          <span class="value big-score">{{ result.totalScore }}</span>
        </div>
        <div class="stat-row">
          <span class="label">Rating</span>
          <span class="value rating" :class="'rating-' + result.rating">{{ result.rating }}</span>
        </div>
      </div>

      <div v-if="best" class="best-section">
        <h2>Best Score</h2>
        <div class="best-info">
          <span class="best-score">{{ best.totalScore }}</span>
          <span class="best-rating" :class="'rating-' + best.rating">{{ best.rating }}</span>
          <span class="best-time">{{ formatTime(best.duration) }}</span>
        </div>
      </div>

      <div v-if="history && history.length > 0" class="history-section">
        <h2>Recent Games</h2>
        <div class="history-list">
          <div v-for="(rec, idx) in history.slice(0, 5)" :key="idx" class="history-row">
            <span class="h-rank">#{{ idx + 1 }}</span>
            <span class="h-score">{{ rec.totalScore }} pts</span>
            <span class="h-rating" :class="'rating-' + rec.rating">{{ rec.rating }}</span>
            <span class="h-time">{{ formatTime(rec.duration) }}</span>
            <span class="h-date">{{ new Date(rec.date).toLocaleDateString() }}</span>
          </div>
        </div>
      </div>

      <div class="actions">
        <button class="action-btn primary" @click="playAgain()">Play Again</button>
        <button class="action-btn secondary" @click="goHome()">Back to Home</button>
      </div>
    </div>
  </main>
</template>

<style scoped>
.end-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  width: 100vw;
  padding: 20px;
  box-sizing: border-box;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.result-card {
  background: white;
  border-radius: 20px;
  padding: 40px;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  position: relative;
  overflow: hidden;
}

.record-banner {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  background: linear-gradient(90deg, #ffd700, #ffed4e);
  color: #333;
  text-align: center;
  padding: 8px;
  font-weight: bold;
  font-size: 18px;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

.title {
  text-align: center;
  color: #333;
  margin: 0 0 30px 0;
  font-size: 32px;
}

.stats {
  margin-bottom: 30px;
}

.stat-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #eee;
}

.stat-row:last-child {
  border-bottom: none;
}

.label {
  color: #666;
  font-size: 16px;
}

.value {
  color: #333;
  font-weight: 600;
  font-size: 16px;
}

.big-score {
  font-size: 28px;
  color: #516dff;
}

.rating {
  display: inline-block;
  width: 32px;
  height: 32px;
  line-height: 32px;
  text-align: center;
  border-radius: 8px;
  font-weight: bold;
  font-size: 18px;
}

.rating-S { background: #ffd700; color: #333; }
.rating-A { background: #4caf50; color: white; }
.rating-B { background: #2196f3; color: white; }
.rating-C { background: #ff9800; color: white; }
.rating-D { background: #9e9e9e; color: white; }
.rating-F { background: #f44336; color: white; }

.best-section {
  margin-bottom: 30px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 12px;
}

.best-section h2 {
  margin: 0 0 15px 0;
  color: #333;
  font-size: 20px;
}

.best-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.best-score {
  font-size: 24px;
  font-weight: bold;
  color: #516dff;
}

.best-rating {
  width: 28px;
  height: 28px;
  line-height: 28px;
  font-size: 16px;
}

.best-time {
  color: #666;
  font-size: 14px;
}

.history-section {
  margin-bottom: 30px;
}

.history-section h2 {
  margin: 0 0 15px 0;
  color: #333;
  font-size: 20px;
}

.history-list {
  max-height: 200px;
  overflow-y: auto;
}

.history-row {
  display: grid;
  grid-template-columns: 40px 80px 40px 70px 1fr;
  gap: 10px;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
  font-size: 14px;
}

.h-rank {
  color: #999;
  font-weight: 600;
}

.h-score {
  color: #333;
  font-weight: 600;
}

.h-rating {
  width: 24px;
  height: 24px;
  line-height: 24px;
  font-size: 12px;
}

.h-time {
  color: #666;
}

.h-date {
  color: #999;
  text-align: right;
  font-size: 12px;
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.action-btn {
  border: none;
  padding: 15px 20px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  font-family: inherit;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.action-btn.primary {
  background: linear-gradient(135deg, #516dff, #667eea);
  color: white;
}

.action-btn.secondary {
  background: #f0f0f0;
  color: #333;
}
</style>

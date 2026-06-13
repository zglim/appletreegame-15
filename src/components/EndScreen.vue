<script setup>
import { useAppleTreeStore } from "../stores/index";
import router from "@/router/index.js";
const appleStore = useAppleTreeStore();

function goHome() {
  appleStore.resetGameState();
  router.push({ name: "home" });
}

function playAgain() {
  appleStore.startGame();
  router.push({ name: "game" });
}
</script>

<template>
  <main class="end-screen">
    <h1>游戏结束</h1>

    <div v-if="appleStore.newRecord" class="new-record-badge">
      🎉 新纪录！
    </div>

    <div v-if="appleStore.currentResult" class="result-card">
      <div class="result-row">
        <span class="result-label">耗时</span>
        <span class="result-value">{{ appleStore.currentResult.duration }}s</span>
      </div>
      <div class="result-row">
        <span class="result-label">得分</span>
        <span class="result-value">{{ appleStore.currentResult.score }}</span>
      </div>
      <div class="result-row">
        <span class="result-label">评级</span>
        <span class="result-value rating">{{ appleStore.currentResult.rating }}</span>
      </div>
    </div>

    <div v-if="appleStore.best > 0" class="best-section">
      <span class="best-label">历史最佳：{{ appleStore.best }} 分</span>
    </div>

    <div class="button-group">
      <button class="action-button play-again" @click="playAgain()">再来一局</button>
      <button class="action-button go-home" @click="goHome()">返回主页</button>
    </div>
  </main>
</template>

<style scoped>
.end-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
  transition: margin 0.5s ease-out;
}

.new-record-badge {
  font-size: 28px;
  font-weight: bold;
  color: #f5222d;
  background: #fff1f0;
  border: 2px solid #f5222d;
  border-radius: 12px;
  padding: 8px 24px;
  margin-bottom: 16px;
  animation: pulse 1s ease-in-out infinite alternate;
}

@keyframes pulse {
  from { transform: scale(1); }
  to { transform: scale(1.05); }
}

.result-card {
  background: #f6ffed;
  border: 2px solid #52c41a;
  border-radius: 12px;
  padding: 16px 32px;
  margin-bottom: 12px;
  min-width: 200px;
}

.result-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 0;
}

.result-label {
  font-size: 16px;
  color: #555;
  margin-right: 24px;
}

.result-value {
  font-size: 20px;
  font-weight: bold;
  color: #333;
}

.result-value.rating {
  font-size: 28px;
  color: #516dff;
}

.best-section {
  margin-bottom: 16px;
}

.best-label {
  font-size: 16px;
  color: #ad8b00;
  font-weight: bold;
}

.button-group {
  display: flex;
  gap: 12px;
}

.action-button {
  border: 0;
  padding: 12px 24px;
  font-family: inherit;
  font-size: 16px;
  cursor: pointer;
  border-radius: 6px;
}

.play-again {
  background-color: #516dff;
  color: #fff;
}

.go-home {
  background-color: #fff;
  color: #516dff;
  border: 2px solid #516dff;
}
</style>

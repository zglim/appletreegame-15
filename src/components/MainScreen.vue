<script setup>
import { onMounted } from "vue";
import { useAppleTreeStore } from "@/stores/index";
import router from "@/router/index.js";
const appleStore = useAppleTreeStore();

onMounted(() => {
  appleStore.loadHistory();
});

function playNow() {
  appleStore.startGame();
  router.push({ name: "game" });
}
</script>

<template>
  <main class="main-screen">
    <h1>Play to Apple Tree Game</h1>

    <div v-if="appleStore.best > 0" class="best-score">
      <span class="best-label">历史最佳</span>
      <span class="best-value">{{ appleStore.best }} 分</span>
    </div>

    <div v-if="appleStore.history.length > 0" class="recent-games">
      <h3>最近记录</h3>
      <ul>
        <li v-for="(record, idx) in appleStore.history.slice(0, 5)" :key="idx">
          {{ record.score }} 分 · {{ record.rating }} · {{ record.duration }}s
        </li>
      </ul>
    </div>

    <button class="home-button" @click="playNow()">Play Button</button>
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
}

.home-button {
  border: 0;
  background-color: #fff;
  color: #516dff;
  padding: 15px 20px;
  font-family: inherit;
  cursor: pointer;
  margin-top: 20px;
}

.best-score {
  margin-top: 16px;
  padding: 10px 20px;
  background: #fffbe6;
  border: 2px solid #fadb14;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.best-label {
  font-size: 14px;
  color: #ad8b00;
}

.best-value {
  font-size: 24px;
  font-weight: bold;
  color: #d48806;
}

.recent-games {
  margin-top: 12px;
  text-align: center;
}

.recent-games h3 {
  margin-bottom: 4px;
}

.recent-games ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.recent-games li {
  font-size: 14px;
  color: #555;
  padding: 2px 0;
}
</style>

<script setup>
import { onMounted, onUnmounted } from "vue";
import Apples from "@/components/Apples.vue";
import AppleTree from "@/components/AppleTree.vue";
import GroundGrass from "@/components/GroundGrass.vue";
import Basket from "@/components/Basket.vue";
import EndScreen from "@/components/EndScreen.vue";
import { useAppleTreeStore } from "@/stores/index";
import router from "@/router/index.js";

const appleStore = useAppleTreeStore();

onMounted(() => {
  // If the store doesn't indicate we're playing, we likely hit a stale route
  // (e.g., page refresh where sessionStorage was "true" but store state was lost).
  // Re-check and redirect if the session is not actually active.
  if (!appleStore.playingStatus) {
    appleStore.resetGame();
    router.replace({ name: "home" });
  }
});

onUnmounted(() => {
  // Cancel pending timers when leaving the game view to prevent
  // callbacks from firing after the view is gone.
  if (appleStore._basketTimer !== null) {
    clearTimeout(appleStore._basketTimer);
    appleStore._basketTimer = null;
  }
  if (appleStore._dropTimer !== null) {
    clearTimeout(appleStore._dropTimer);
    appleStore._dropTimer = null;
  }
  if (appleStore._shakeTimer !== null) {
    clearTimeout(appleStore._shakeTimer);
    appleStore._shakeTimer = null;
  }
  appleStore.isAnimating = false;
});
</script>

<template>
  <template v-if="appleStore.appleIsBasket">
    <EndScreen></EndScreen>
  </template>
  <template v-else>
    <Apples></Apples>
    <AppleTree></AppleTree>
    <Basket></Basket>
    <GroundGrass></GroundGrass>
  </template>
</template>

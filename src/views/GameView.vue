<script setup>
import Apples from "@/components/Apples.vue";
import AppleTree from "@/components/AppleTree.vue";
import GroundGrass from "@/components/GroundGrass.vue";
import Basket from "@/components/Basket.vue";
import EndScreen from "@/components/EndScreen.vue";
import { useAppleTreeStore } from "@/stores/index";
import { useAppleAnimation } from "@/composables/useAppleAnimation";

const appleStore = useAppleTreeStore();
const { mountApples, shakeTree } = useAppleAnimation();

// Expose shakeTree to the AppleTree child via provide/inject would also work,
// but we pass it down as a prop-like callback through the tree component to
// keep the dependency explicit and the component testable.
defineExpose({ shakeTree });

// GameView owns the apple lifecycle: mount once on setup.
mountApples();
</script>

<template>
  <template v-if="appleStore.isBasketed">
    <EndScreen />
  </template>
  <template v-else>
    <Apples :phase="appleStore.phase" />
    <AppleTree :phase="appleStore.phase" @shake="shakeTree" />
    <Basket :phase="appleStore.phase" />
    <GroundGrass />
  </template>
</template>

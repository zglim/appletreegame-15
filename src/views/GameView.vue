<script setup>
import { onUnmounted } from "vue";
import Apples from "@/components/Apples.vue";
import AppleTree from "@/components/AppleTree.vue";
import GroundGrass from "@/components/GroundGrass.vue";
import Basket from "@/components/Basket.vue";
import EndScreen from "@/components/EndScreen.vue";
import { useAppleTreeStore } from "@/stores/index";
import { useAppleAnimation } from "@/composables/useAppleAnimation";

const appleStore = useAppleTreeStore();
const { cleanup } = useAppleAnimation();

onUnmounted(() => {
  cleanup();
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

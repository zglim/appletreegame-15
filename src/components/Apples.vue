<script setup>
import { onMounted } from "vue";
import { useAppleTreeStore } from "@/stores/index";
const appleStore = useAppleTreeStore();

onMounted(() => {
  // Only create apple SVG nodes if they haven't been created yet for this game session.
  // This prevents duplicates if the component is re-mounted unexpectedly.
  if (appleStore.svgData.length === 0) {
    appleStore.treeApple();
  }
  if (appleStore.basketSvgData.length === 0) {
    appleStore.basketApple();
  }
});
</script>

<template>
  <svg v-show="!appleStore.appleIsGroundStatus" id="apples" class="red-apple"
    :class="{ shake: appleStore.shackingStatus }"></svg>
</template>

<style scoped>
.red-apple {
  pointer-events: none;
  left: 0;
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 1;
}
</style>

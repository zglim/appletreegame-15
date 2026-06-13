<script setup>
import AppleTree from '@/components/icons/AppleTree.vue'
import { useAppleTreeStore } from '@/stores/index'
const appleStore = useAppleTreeStore()

function onTreeClick() {
  // Guard: don't allow shaking if already animating or game has ended
  if (appleStore.isAnimating || appleStore.appleIsGroundStatus || appleStore.appleIsBasketStatus) {
    return;
  }
  appleStore.shakeTree();
}
</script>

<template>
  <div :class="{ shake: appleStore.shackingStatus }" @contextmenu.prevent>
    <AppleTree class="apple-tree" @click="onTreeClick()" />
  </div>
</template>

<style scoped>
.apple-tree {
  position: relative;
  width: 800px;
  height: 800px;
  transition: margin 0.5s ease-out;
}
</style>

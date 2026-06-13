<script setup>
import AppleTree from '@/components/icons/AppleTree.vue'
import { useAppleAnimation } from '@/composables/useAppleAnimation'
import { useAppleTreeStore } from '@/stores/index'

const appleStore = useAppleTreeStore()
const { shakeAndDrop } = useAppleAnimation()
</script>

<template>
  <div :class="{ shake: appleStore.shackingStatus }" @contextmenu.prevent>
    <AppleTree class="apple-tree" @click="shakeAndDrop()" />
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

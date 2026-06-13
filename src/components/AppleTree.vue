<script setup>
import AppleTree from "@/components/icons/AppleTree.vue";
import { PHASE } from "@/config/game";

defineProps({
  phase: { type: String, required: true },
});

const emit = defineEmits(["shake"]);
</script>

<template>
  <div
    :class="{ shake: phase === PHASE.SHAKING }"
    @contextmenu.prevent
  >
    <AppleTree
      class="apple-tree"
      @click="phase === PHASE.IDLE && emit('shake')"
    />
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

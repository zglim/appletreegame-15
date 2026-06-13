<script setup>
import { PHASE } from "@/config/game";

defineProps({
  phase: { type: String, required: true },
});
</script>

<template>
  <svg
    v-show="phase !== PHASE.GROUNDED && phase !== PHASE.BASKETED"
    id="apples"
    class="red-apple"
    :class="{ shake: phase === PHASE.SHAKING }"
  />
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

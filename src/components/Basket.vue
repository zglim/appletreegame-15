<script setup>
import Basket from "@/components/icons/Basket.vue";
import { PHASE } from "@/config/game";

defineProps({
  phase: { type: String, required: true },
});
</script>

<template>
  <div class="basket" @contextmenu.prevent>
    <svg
      v-show="phase === PHASE.GROUNDED || phase === PHASE.BASKETED"
      id="basket_apples"
      class="basket_apple"
    />
    <Basket class="basket-icon" />
  </div>
</template>

<style scoped>
.basket {
  position: absolute;
  bottom: 0;
  left: 75%;
  z-index: 1;
}

.basket-icon {
  width: 200px;
  height: 200px;
  cursor: pointer;
}

.basket_apple {
  pointer-events: none;
  left: 0;
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 1;
}
</style>

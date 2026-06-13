import { ref, onUnmounted } from "vue";
import { useAppleTreeStore } from "@/stores/index";
import { GAME_CONFIG, PHASE } from "@/config/game";
import {
  generateTreeApples,
  renderTreeApples,
  renderBasketApples,
  animateDrop,
} from "@/services/appleAnimation";

/**
 * Composable that owns the D3 animation lifecycle.
 *
 * It reads state from the store but never writes DOM directly from the store.
 * Timers are tracked and cleaned up on unmount so navigation never leaks.
 */
export function useAppleAnimation() {
  const store = useAppleTreeStore();
  const timers = [];

  const treeNodes = ref([]);

  const schedule = (fn, ms) => {
    const id = setTimeout(fn, ms);
    timers.push(id);
    return id;
  };

  function clearTimers() {
    while (timers.length) {
      clearTimeout(timers.pop());
    }
  }

  /** Create apples on the tree + hidden basket apples. */
  function mountApples() {
    const positions = generateTreeApples();
    treeNodes.value = renderTreeApples(positions);
    renderBasketApples();
  }

  /** Trigger the full shake → fall → ground → basket flow. */
  function shakeTree() {
    if (store.phase !== PHASE.IDLE) return; // ignore extra clicks
    store.startShake();

    schedule(() => {
      store.startFalling();
      animateDrop(treeNodes.value);
    }, GAME_CONFIG.SHAKE_DELAY);

    // The longest possible drop is DROP_DELAY_MAX + DROP_DURATION; we use the
    // original 3000ms budget so behaviour matches the previous implementation.
    schedule(() => {
      store.setGrounded();
    }, GAME_CONFIG.GROUND_SETTLE_TIME);

    schedule(() => {
      store.setBasketed();
    }, GAME_CONFIG.GROUND_SETTLE_TIME + GAME_CONFIG.BASKET_FILL_TIME);
  }

  onUnmounted(() => {
    clearTimers();
  });

  return {
    mountApples,
    shakeTree,
    clearTimers,
  };
}

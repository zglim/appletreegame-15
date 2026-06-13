import { defineStore } from "pinia";
import { GAME_CONFIG, PHASE, PHASE_TRANSITIONS } from "@/config/game";

/**
 * Pure state store.
 *
 * This store is the *single source of truth* for game state.
 * It knows nothing about D3, DOM nodes or timers — those live in
 * the composable layer (useAppleAnimation).
 */
export const useAppleTreeStore = defineStore("appleTree", {
  state: () => ({
    /** @type {keyof typeof PHASE} */
    phase: PHASE.IDLE,
    /** Whether the user has started a session (for router guard) */
    playing: false,
  }),

  getters: {
    phaseStatus: (state) => state.phase,
    playingStatus: (state) => state.playing,

    // Convenience boolean getters for templates that only need a yes/no.
    isShaking: (state) => state.phase === PHASE.SHAKING,
    isFalling: (state) => state.phase === PHASE.FALLING,
    isGrounded: (state) => state.phase === PHASE.GROUNDED,
    isBasketed: (state) => state.phase === PHASE.BASKETED,
    isEnded: (state) => state.phase === PHASE.BASKETED,
  },

  actions: {
    /**
     * Move to a new phase. Throws if the transition is invalid so bugs
     * surface early during development (silently ignored in prod if desired).
     */
    transition(nextPhase) {
      const allowed = PHASE_TRANSITIONS[this.phase] || [];
      if (!allowed.includes(nextPhase)) {
        if (process.env.NODE_ENV !== "production") {
          // eslint-disable-next-line no-console
          console.warn(
            `[appleTree] invalid transition ${this.phase} -> ${nextPhase}`,
          );
        }
        return false;
      }
      this.phase = nextPhase;
      return true;
    },

    setPlayingStatus(status) {
      this.playing = status;
      sessionStorage.setItem("playing", String(status));
    },

    /** Start the shake → fall → ground → basket sequence. */
    startShake() {
      this.transition(PHASE.SHAKING);
    },

    /** Called by the animation layer once apples actually begin dropping. */
    startFalling() {
      this.transition(PHASE.FALLING);
    },

    /** Apples have landed on the ground. */
    setGrounded() {
      this.transition(PHASE.GROUNDED);
    },

    /** Basket is full — game over. */
    setBasketed() {
      this.transition(PHASE.BASKETED);
    },

    /** Reset everything back to a clean slate. */
    reset() {
      this.phase = PHASE.IDLE;
      this.playing = false;
      sessionStorage.removeItem("playing");
      sessionStorage.removeItem("shacking");
      sessionStorage.removeItem("appleIsGround");
      sessionStorage.removeItem("appleIsBasket");
    },
  },
});

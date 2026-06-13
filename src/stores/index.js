import { defineStore } from 'pinia';
import { GamePhase, TREE_APPLE_COUNT, BASKET_APPLE_COUNT, APPLE_SIZE } from '@/config/gameConfig';

export const useAppleTreeStore = defineStore('appleTree', {
  state: () => ({
    // ── State machine ────────────────────────────────────────
    phase: GamePhase.IDLE,

    // ── Legacy boolean flags (kept for template compat) ──────
    shacking: false,
    playing: false,
    appleIsGround: false,
    appleIsBasket: false,

    // ── Layout / sizing (read-only config surfaced to views) ─
    appleSize: APPLE_SIZE,

    // ── Book-keeping for positions (pure data, no DOM refs) ──
    yPosValue: [],

    // ── Counts ───────────────────────────────────────────────
    treeAppleCount: TREE_APPLE_COUNT,
    basketAppleCount: BASKET_APPLE_COUNT,
  }),

  getters: {
    // Phase-based getters
    isShaking:    (state) => state.phase === GamePhase.SHAKING,
    isDropping:   (state) => state.phase === GamePhase.DROPPING,
    isGrounded:   (state) => state.phase === GamePhase.GROUNDED,
    isBasketDone: (state) => state.phase === GamePhase.BASKET_DONE,
    isEnded:      (state) => state.phase === GamePhase.ENDED,
    isIdle:       (state) => state.phase === GamePhase.IDLE,
    isPlaying:    (state) =>
      state.phase !== GamePhase.IDLE && state.phase !== GamePhase.ENDED,

    // Legacy compat getters (used by existing templates)
    shackingStatus:      (state) => state.shacking,
    playingStatus:       (state) => state.playing,
    appleIsGroundStatus: (state) => state.appleIsGround,
    appleIsBasketStatus: (state) => state.appleIsBasket,
  },

  actions: {
    // ── Phase transitions ─────────────────────────────────────
    transitionTo(newPhase) {
      this.phase = newPhase;
      // Sync legacy flags
      this.shacking      = newPhase === GamePhase.SHAKING;
      this.appleIsGround = newPhase === GamePhase.GROUNDED
                         || newPhase === GamePhase.BASKET_DONE;
      this.appleIsBasket = newPhase === GamePhase.BASKET_DONE
                         || newPhase === GamePhase.ENDED;
      sessionStorage.setItem('phase', newPhase);
      sessionStorage.setItem('shacking', this.shacking);
      sessionStorage.setItem('appleIsGround', this.appleIsGround);
      sessionStorage.setItem('appleIsBasket', this.appleIsBasket);
    },

    // ── Public actions ────────────────────────────────────────
    startGame() {
      this.playing = true;
      sessionStorage.setItem('playing', true);
      this.transitionTo(GamePhase.PLAYING);
    },

    shakeTree() {
      if (this.phase !== GamePhase.PLAYING) return;
      this.transitionTo(GamePhase.SHAKING);
    },

    startDrop() {
      if (this.phase !== GamePhase.SHAKING) return;
      this.transitionTo(GamePhase.DROPPING);
    },

    applesLanded() {
      if (this.phase !== GamePhase.DROPPING) return;
      this.transitionTo(GamePhase.GROUNDED);
    },

    basketFilled() {
      if (this.phase !== GamePhase.GROUNDED) return;
      this.transitionTo(GamePhase.BASKET_DONE);
    },

    endGame() {
      this.transitionTo(GamePhase.ENDED);
    },

    reset() {
      this.playing = false;
      this.yPosValue = [];
      sessionStorage.setItem('playing', false);
      this.transitionTo(GamePhase.IDLE);
    },

    // ── Legacy compat setters (called by components) ──────────
    setPlayingStatus(status) {
      this.playing = status;
      sessionStorage.setItem('playing', status);
      if (status && this.phase === GamePhase.IDLE) {
        this.transitionTo(GamePhase.PLAYING);
      }
    },
    setShackingStatus(status) {
      this.shacking = status;
      sessionStorage.setItem('shacking', status);
    },
    setAppleIsGroundStatus(status) {
      this.appleIsGround = status;
      sessionStorage.setItem('appleIsGround', status);
    },
    setAppleIsBasketStatus(status) {
      this.appleIsBasket = status;
      sessionStorage.setItem('appleIsBasket', status);
    },

    // ── Tree Y position book-keeping ──────────────────────────
    pushTreeYPos(value) {
      this.yPosValue.push(value);
    },
  },
});

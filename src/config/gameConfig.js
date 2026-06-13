/**
 * Central game configuration — all tuneable values live here
 * so that neither the store nor helpers carry magic numbers.
 */

// ── Apple counts ──────────────────────────────────────────────
export const TREE_APPLE_COUNT = 15;
export const BASKET_APPLE_COUNT = 10;

// ── Apple sprite size ─────────────────────────────────────────
export const APPLE_SIZE = Object.freeze({ width: 40, height: 40 });

// ── Tree placement (random Y range for apples on the tree) ────
export const TREE_Y_MIN = 30;
export const TREE_Y_MAX = 340;

/**
 * Tree X ranges keyed by Y-band.
 * Each entry: [yUpperBound, xMin, xMax]
 * Evaluated top-to-bottom; first match wins.
 */
export const TREE_X_BANDS = Object.freeze([
  [40,  920,  950],
  [90,  750, 1050],
  [130, 690, 1200],
  [190, 650, 1230],
  [285, 650, 1250],
  [340, 750, 1150],
]);
export const TREE_X_FALLBACK = Object.freeze([750, 1150]);

// ── Basket layout ─────────────────────────────────────────────
export const BASKET_MIN_X = 22;
export const BASKET_OFFSET_X = 25;
export const BASKET_COLS = 5;
export const BASKET_FIRST_ROW_Y = 52;
export const BASKET_SECOND_ROW_Y = 30;

// ── Animation timing (ms) ─────────────────────────────────────
export const DROP_DURATION = 1000;
export const DROP_DELAY_MIN = 1000;
export const DROP_DELAY_MAX = 2000;
export const DROP_Y_TARGET = 850;

export const SHAKE_TO_DROP_DELAY = 100;
export const DROP_TO_GROUND_DELAY = 3000;
export const BASKET_FILL_DELAY = 5000;

// ── Game phases (state-machine tokens) ────────────────────────
export const GamePhase = Object.freeze({
  IDLE:        'idle',
  PLAYING:     'playing',
  SHAKING:     'shaking',
  DROPPING:    'dropping',
  GROUNDED:    'grounded',
  BASKET_DONE: 'basketDone',
  ENDED:       'ended',
});

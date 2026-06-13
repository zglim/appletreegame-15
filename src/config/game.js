/**
 * Centralized game configuration.
 * All magic numbers live here so they can be tuned from a single place.
 */

export const GAME_CONFIG = Object.freeze({
  // Apples
  TREE_APPLE_COUNT: 15,
  BASKET_APPLE_COUNT: 10,
  APPLE_SIZE: { width: 40, height: 40 },

  // Tree: random Y range for apples on the tree
  TREE_Y_MIN: 30,
  TREE_Y_MAX: 340,

  // Basket layout
  BASKET_X_MIN: 22,
  BASKET_X_OFFSET: 25,
  BASKET_LINE_1_Y: 52, // bottom row
  BASKET_LINE_2_Y: 30, // top row
  BASKET_ROW_SIZE: 5,

  // Animation timings (ms)
  SHAKE_DELAY: 100,           // delay before apples start dropping after shake
  DROP_DURATION: 1000,        // how long a single apple takes to fall
  DROP_DELAY_MIN: 1000,       // min random delay per apple
  DROP_DELAY_MAX: 2000,       // max random delay per apple
  DROP_Y: 850,                // target Y when falling to ground
  GROUND_SETTLE_TIME: 3000,   // when to mark "grounded" after shake
  BASKET_FILL_TIME: 5000,     // when basket fill completes (after grounded)

  // Tree X-position ranges indexed by Y band
  TREE_X_BANDS: Object.freeze([
    { maxY: 40,  xMin: 920,  xMax: 950 },
    { maxY: 90,  xMin: 750,  xMax: 1050 },
    { maxY: 130, xMin: 690,  xMax: 1200 },
    { maxY: 190, xMin: 650,  xMax: 1230 },
    { maxY: 285, xMin: 650,  xMax: 1250 },
    { maxY: 340, xMin: 750,  xMax: 1150 },
  ]),
  TREE_X_FALLBACK_MIN: 750,
  TREE_X_FALLBACK_MAX: 1150,
});

/**
 * Game phase enum-like values.
 * idle       -> before any interaction on the game page
 * shaking    -> tree is shaking, apples are about to drop
 * falling    -> apples are in transit (dropping)
 * grounded   -> apples have landed; basket starts filling
 * basketed   -> basket fill animation done; game effectively over
 */
export const PHASE = Object.freeze({
  IDLE: "idle",
  SHAKING: "shaking",
  FALLING: "falling",
  GROUNDED: "grounded",
  BASKETED: "basketed",
});

/**
 * Valid phase transitions. Each key lists the phases it may move to.
 */
export const PHASE_TRANSITIONS = Object.freeze({
  [PHASE.IDLE]:      [PHASE.SHAKING],
  [PHASE.SHAKING]:   [PHASE.FALLING, PHASE.IDLE],
  [PHASE.FALLING]:   [PHASE.GROUNDED, PHASE.IDLE],
  [PHASE.GROUNDED]:  [PHASE.BASKETED, PHASE.IDLE],
  [PHASE.BASKETED]:  [PHASE.IDLE],
});

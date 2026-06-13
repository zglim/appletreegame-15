import {
  TREE_X_BANDS,
  TREE_X_FALLBACK,
  TREE_Y_MIN,
  TREE_Y_MAX,
  BASKET_MIN_X,
  BASKET_OFFSET_X,
  BASKET_COLS,
  BASKET_FIRST_ROW_Y,
  BASKET_SECOND_ROW_Y,
} from '@/config/gameConfig';

export function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * X position for the i-th apple inside the basket.
 * Two rows of BASKET_COLS each, stacked horizontally.
 */
export function xPos(i) {
  const col = i % BASKET_COLS;
  return BASKET_MIN_X + col * BASKET_OFFSET_X;
}

/**
 * Y position for the i-th apple inside the basket.
 * First BASKET_COLS → first row, next BASKET_COLS → second row.
 */
export function yPos(i) {
  if (i < BASKET_COLS) {
    return BASKET_FIRST_ROW_Y;
  }
  if (i < BASKET_COLS * 2) {
    return BASKET_SECOND_ROW_Y;
  }
  return (BASKET_FIRST_ROW_Y + BASKET_SECOND_ROW_Y) / 2;
}

/**
 * Given a Y position on the tree, pick a random X that fits the canopy shape.
 */
export function treeXPos(yPosValue) {
  for (const [upper, xMin, xMax] of TREE_X_BANDS) {
    if (yPosValue < upper) {
      return randomInt(xMin, xMax);
    }
  }
  const [xMin, xMax] = TREE_X_FALLBACK;
  return randomInt(xMin, xMax);
}

/**
 * Push a new random Y onto yPosValue and return [yPosValue, newY].
 */
export function treeYPos(i, yPosValue) {
  yPosValue.push(randomInt(TREE_Y_MIN, TREE_Y_MAX));
  return [yPosValue, yPosValue[i]];
}

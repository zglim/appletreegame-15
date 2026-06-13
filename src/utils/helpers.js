/**
 * Pure geometry helpers.
 * They take config values as arguments (defaulted to GAME_CONFIG) so that
 * they remain deterministic and easy to unit-test.
 */
import { GAME_CONFIG } from "@/config/game";

export function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function basketXPos(i, cfg = GAME_CONFIG) {
  const row = Math.floor(i / cfg.BASKET_ROW_SIZE);
  const col = i - row * cfg.BASKET_ROW_SIZE;
  return cfg.BASKET_X_MIN + col * cfg.BASKET_X_OFFSET;
}

export function basketYPos(i, cfg = GAME_CONFIG) {
  const row = Math.floor(i / cfg.BASKET_ROW_SIZE);
  if (row === 0) return cfg.BASKET_LINE_1_Y;
  if (row === 1) return cfg.BASKET_LINE_2_Y;
  return (cfg.BASKET_LINE_1_Y + cfg.BASKET_LINE_2_Y) / 2;
}

export function treeXPos(yValue, cfg = GAME_CONFIG) {
  for (const band of cfg.TREE_X_BANDS) {
    if (yValue < band.maxY) {
      return randomInt(band.xMin, band.xMax);
    }
  }
  return randomInt(cfg.TREE_X_FALLBACK_MIN, cfg.TREE_X_FALLBACK_MAX);
}

export function randomTreeY(cfg = GAME_CONFIG) {
  return randomInt(cfg.TREE_Y_MIN, cfg.TREE_Y_MAX);
}

import { describe, it, expect } from 'vitest';
import {
  TREE_APPLE_COUNT,
  BASKET_APPLE_COUNT,
  APPLE_SIZE,
  TREE_Y_MIN,
  TREE_Y_MAX,
  TREE_X_BANDS,
  TREE_X_FALLBACK,
  BASKET_MIN_X,
  BASKET_OFFSET_X,
  BASKET_COLS,
  BASKET_FIRST_ROW_Y,
  BASKET_SECOND_ROW_Y,
  DROP_DURATION,
  DROP_DELAY_MIN,
  DROP_DELAY_MAX,
  DROP_Y_TARGET,
  SHAKE_TO_DROP_DELAY,
  DROP_TO_GROUND_DELAY,
  BASKET_FILL_DELAY,
  GamePhase,
} from '@/config/gameConfig';

describe('gameConfig', () => {
  it('has positive apple counts', () => {
    expect(TREE_APPLE_COUNT).toBeGreaterThan(0);
    expect(BASKET_APPLE_COUNT).toBeGreaterThan(0);
  });

  it('has valid apple size', () => {
    expect(APPLE_SIZE.width).toBeGreaterThan(0);
    expect(APPLE_SIZE.height).toBeGreaterThan(0);
    expect(Object.isFrozen(APPLE_SIZE)).toBe(true);
  });

  it('has valid tree Y range', () => {
    expect(TREE_Y_MIN).toBeLessThan(TREE_Y_MAX);
  });

  it('has valid tree X bands', () => {
    expect(Array.isArray(TREE_X_BANDS)).toBe(true);
    expect(TREE_X_BANDS.length).toBeGreaterThan(0);
    for (const [upper, xMin, xMax] of TREE_X_BANDS) {
      expect(xMin).toBeLessThanOrEqual(xMax);
      expect(upper).toBeGreaterThan(0);
    }
  });

  it('has valid basket layout', () => {
    expect(BASKET_COLS).toBeGreaterThan(0);
    expect(BASKET_OFFSET_X).toBeGreaterThan(0);
    expect(BASKET_FIRST_ROW_Y).not.toBe(BASKET_SECOND_ROW_Y);
  });

  it('has positive animation timings', () => {
    expect(DROP_DURATION).toBeGreaterThan(0);
    expect(DROP_DELAY_MIN).toBeLessThanOrEqual(DROP_DELAY_MAX);
    expect(SHAKE_TO_DROP_DELAY).toBeGreaterThanOrEqual(0);
    expect(DROP_TO_GROUND_DELAY).toBeGreaterThan(0);
    expect(BASKET_FILL_DELAY).toBeGreaterThan(0);
  });

  it('has frozen GamePhase enum with expected keys', () => {
    expect(Object.isFrozen(GamePhase)).toBe(true);
    const expectedKeys = ['IDLE', 'PLAYING', 'SHAKING', 'DROPPING', 'GROUNDED', 'BASKET_DONE', 'ENDED'];
    for (const key of expectedKeys) {
      expect(GamePhase).toHaveProperty(key);
    }
  });
});

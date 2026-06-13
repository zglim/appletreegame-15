import { describe, it, expect } from 'vitest';
import { randomInt, xPos, yPos, treeXPos } from '@/utils/helpers';
import {
  BASKET_MIN_X,
  BASKET_OFFSET_X,
  BASKET_COLS,
  BASKET_FIRST_ROW_Y,
  BASKET_SECOND_ROW_Y,
} from '@/config/gameConfig';

describe('helpers', () => {
  describe('randomInt', () => {
    it('returns a value within [min, max]', () => {
      for (let i = 0; i < 100; i++) {
        const val = randomInt(10, 20);
        expect(val).toBeGreaterThanOrEqual(10);
        expect(val).toBeLessThanOrEqual(20);
      }
    });

    it('returns min when min === max', () => {
      expect(randomInt(5, 5)).toBe(5);
    });
  });

  describe('xPos (basket)', () => {
    it('places first-row apples correctly', () => {
      for (let i = 0; i < BASKET_COLS; i++) {
        expect(xPos(i)).toBe(BASKET_MIN_X + i * BASKET_OFFSET_X);
      }
    });

    it('places second-row apples in the same columns as first row', () => {
      for (let i = 0; i < BASKET_COLS; i++) {
        expect(xPos(BASKET_COLS + i)).toBe(xPos(i));
      }
    });
  });

  describe('yPos (basket)', () => {
    it('returns first-row Y for indices 0..4', () => {
      for (let i = 0; i < BASKET_COLS; i++) {
        expect(yPos(i)).toBe(BASKET_FIRST_ROW_Y);
      }
    });

    it('returns second-row Y for indices 5..9', () => {
      for (let i = BASKET_COLS; i < BASKET_COLS * 2; i++) {
        expect(yPos(i)).toBe(BASKET_SECOND_ROW_Y);
      }
    });

    it('returns average Y for index beyond two rows', () => {
      expect(yPos(10)).toBe((BASKET_FIRST_ROW_Y + BASKET_SECOND_ROW_Y) / 2);
    });
  });

  describe('treeXPos', () => {
    it('returns a value in the expected range for each Y band', () => {
      // Y < 40 → [920, 950]
      for (let i = 0; i < 20; i++) {
        const x = treeXPos(20);
        expect(x).toBeGreaterThanOrEqual(920);
        expect(x).toBeLessThanOrEqual(950);
      }
    });

    it('returns a fallback value for Y >= 340', () => {
      for (let i = 0; i < 20; i++) {
        const x = treeXPos(400);
        expect(x).toBeGreaterThanOrEqual(750);
        expect(x).toBeLessThanOrEqual(1150);
      }
    });
  });
});

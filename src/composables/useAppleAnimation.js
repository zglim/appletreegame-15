import * as d3 from 'd3';
import { useAppleTreeStore } from '@/stores/index';
import {
  TREE_APPLE_COUNT,
  BASKET_APPLE_COUNT,
  TREE_Y_MIN,
  TREE_Y_MAX,
  DROP_DURATION,
  DROP_DELAY_MIN,
  DROP_DELAY_MAX,
  DROP_Y_TARGET,
  SHAKE_TO_DROP_DELAY,
  DROP_TO_GROUND_DELAY,
  BASKET_FILL_DELAY,
} from '@/config/gameConfig';
import { xPos, yPos, randomInt, treeXPos } from '@/utils/helpers';

/**
 * Composable that owns all D3 / DOM animation concerns.
 * The store stays a pure state container; this composable
 * reads state, drives animations, and pushes phase transitions back.
 */
export function useAppleAnimation() {
  const store = useAppleTreeStore();

  // Internal D3 selection arrays — not exposed, not in store
  let treeAppleSelections = [];
  let basketAppleSelections = [];

  // ── Apple image URL (resolved once) ─────────────────────────
  const appleImgUrl = new URL('../assets/simple-apple.svg', import.meta.url).href;

  // ── Tree apples ─────────────────────────────────────────────
  function createTreeApples() {
    treeAppleSelections = [];
    store.yPosValue = [];

    for (let i = 0; i < TREE_APPLE_COUNT; i++) {
      const y = randomInt(TREE_Y_MIN, TREE_Y_MAX);
      store.pushTreeYPos(y);

      const sel = d3
        .select('#apples')
        .append('svg:image')
        .attr('xlink:href', appleImgUrl)
        .attr('width', store.appleSize.width)
        .attr('height', store.appleSize.height)
        .attr('y', y)
        .attr('x', treeXPos(y));

      treeAppleSelections.push(sel);
    }
  }

  // ── Basket apples ───────────────────────────────────────────
  function createBasketApples() {
    basketAppleSelections = [];

    for (let i = 0; i < BASKET_APPLE_COUNT; i++) {
      const sel = d3
        .select('#basket_apples')
        .append('svg:image')
        .attr('xlink:href', appleImgUrl)
        .attr('width', store.appleSize.width)
        .attr('height', store.appleSize.height)
        .attr('x', xPos(i))
        .attr('y', yPos(i));

      basketAppleSelections.push(sel);
    }

    setTimeout(() => {
      store.basketFilled();
    }, BASKET_FILL_DELAY);
  }

  // ── Drop animation ──────────────────────────────────────────
  function dropApples() {
    store.startDrop();

    for (const sel of treeAppleSelections) {
      sel
        .transition()
        .attr('y', DROP_Y_TARGET)
        .duration(DROP_DURATION)
        .delay(d3.randomInt(DROP_DELAY_MIN, DROP_DELAY_MAX));
    }

    setTimeout(() => {
      store.applesLanded();
    }, DROP_TO_GROUND_DELAY);
  }

  // ── Shake orchestration ─────────────────────────────────────
  function shakeAndDrop() {
    store.shakeTree();
    setTimeout(() => {
      dropApples();
    }, SHAKE_TO_DROP_DELAY);
  }

  // ── Init: create all apple SVGs and start basket timer ──────
  function initApples() {
    createTreeApples();
    createBasketApples();
  }

  // ── Cleanup ─────────────────────────────────────────────────
  function cleanup() {
    // Remove D3 selections
    d3.select('#apples').selectAll('*').remove();
    d3.select('#basket_apples').selectAll('*').remove();
    treeAppleSelections = [];
    basketAppleSelections = [];
  }

  return {
    initApples,
    shakeAndDrop,
    cleanup,
  };
}

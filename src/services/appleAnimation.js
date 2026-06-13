/**
 * D3 / DOM animation service.
 * Pure functions that receive everything they need as arguments.
 * The store never touches D3 directly — it delegates here.
 */
import * as d3 from "d3";
import { GAME_CONFIG } from "@/config/game";
import { basketXPos, basketYPos, treeXPos, randomTreeY } from "@/utils/helpers";

const APPLE_IMG_URL = new URL("../assets/simple-apple.svg", import.meta.url).href;

/**
 * Generate initial apple positions on the tree.
 * Returns an array of { x, y } describing where each apple should be placed.
 */
export function generateTreeApples(count = GAME_CONFIG.TREE_APPLE_COUNT, cfg = GAME_CONFIG) {
  const positions = [];
  for (let i = 0; i < count; i++) {
    const y = randomTreeY(cfg);
    const x = treeXPos(y, cfg);
    positions.push({ x, y });
  }
  return positions;
}

/**
 * Render apple <image> nodes inside the #apples svg group.
 * Returns the d3 selections so the caller can animate them later.
 */
export function renderTreeApples(positions, cfg = GAME_CONFIG) {
  const container = d3.select("#apples");
  return positions.map((pos) =>
    container
      .append("svg:image")
      .attr("xlink:href", APPLE_IMG_URL)
      .attr("width", cfg.APPLE_SIZE.width)
      .attr("height", cfg.APPLE_SIZE.height)
      .attr("x", pos.x)
      .attr("y", pos.y),
  );
}

/**
 * Render apple nodes inside the #basket_apples svg group (hidden initially).
 */
export function renderBasketApples(count = GAME_CONFIG.BASKET_APPLE_COUNT, cfg = GAME_CONFIG) {
  const container = d3.select("#basket_apples");
  const nodes = [];
  for (let i = 0; i < count; i++) {
    nodes.push(
      container
        .append("svg:image")
        .attr("xlink:href", APPLE_IMG_URL)
        .attr("width", cfg.APPLE_SIZE.width)
        .attr("height", cfg.APPLE_SIZE.height)
        .attr("x", basketXPos(i, cfg))
        .attr("y", basketYPos(i, cfg)),
    );
  }
  return nodes;
}

/**
 * Animate an array of d3 selections dropping to the ground.
 * Uses per-apple random delay for a natural look.
 */
export function animateDrop(nodes, cfg = GAME_CONFIG) {
  for (const node of nodes) {
    node
      .transition()
      .attr("y", cfg.DROP_Y)
      .duration(cfg.DROP_DURATION)
      .delay(d3.randomInt(cfg.DROP_DELAY_MIN, cfg.DROP_DELAY_MAX));
  }
}

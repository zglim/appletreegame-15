import { defineStore } from "pinia";
import * as d3 from "d3";
import { xPos, yPos, randomInt, treeXPos } from "@/utils/helpers";

const HISTORY_KEY = "appleTreeHistory";
const BEST_SCORE_KEY = "appleTreeBestScore";
const MAX_HISTORY = 10;

/**
 * Load history records from localStorage.
 * @returns {Array} Array of game result objects.
 */
export function loadHistoryFromStorage() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Save history records to localStorage.
 * @param {Array} records - Array of game result objects.
 */
export function saveHistoryToStorage(records) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(records));
}

/**
 * Load best score from localStorage.
 * @returns {number} Best score or 0 if none.
 */
export function loadBestScoreFromStorage() {
  try {
    const raw = localStorage.getItem(BEST_SCORE_KEY);
    return raw ? Number(raw) : 0;
  } catch {
    return 0;
  }
}

/**
 * Save best score to localStorage.
 * @param {number} score
 */
export function saveBestScoreToStorage(score) {
  localStorage.setItem(BEST_SCORE_KEY, String(score));
}

/**
 * Calculate score from game duration in seconds.
 * @param {number} durationSeconds
 * @returns {number} Score between 0 and 1000.
 */
export function calculateScore(durationSeconds) {
  const baseScore = 1000;
  const timePenalty = Math.floor(durationSeconds * 5);
  return Math.max(0, baseScore - timePenalty);
}

/**
 * Get rating string from score.
 * @param {number} score
 * @returns {string} Rating: S, A, B, or C.
 */
export function getRating(score) {
  if (score >= 800) return "S";
  if (score >= 600) return "A";
  if (score >= 400) return "B";
  return "C";
}

/**
 * Build a game result object.
 * @param {number} durationMs - Duration in milliseconds.
 * @returns {object} Game result.
 */
export function buildGameResult(durationMs) {
  const durationSeconds = Math.round(durationMs / 100) / 10; // 1 decimal
  const score = calculateScore(durationSeconds);
  const rating = getRating(score);
  return {
    duration: durationSeconds,
    score,
    rating,
    date: new Date().toISOString(),
  };
}

export const useAppleTreeStore = defineStore("appleTree", {
  state: () => ({
    // --- In-progress game state ---
    shacking: false,
    playing: false,
    appleIsGround: false,
    appleIsBasket: false,
    appleSize: { width: 40, height: 40 },
    yPosValue: [],
    svg: [],
    basketSvg: [],
    gameStartTime: null,

    // --- Current game result (set when game ends) ---
    currentGameResult: null,

    // --- History & best score (persisted in localStorage) ---
    historyRecords: [],
    bestScore: 0,
    isNewRecord: false,
  }),
  getters: {
    shackingStatus: (state) => state.shacking,
    playingStatus: (state) => state.playing,
    appleIsGroundStatus: (state) => state.appleIsGround,
    svgData: (state) => state.svg,
    basketSvgData: (state) => state.basketSvg,
    appleIsBasketStatus: (state) => state.appleIsBasket,
    currentResult: (state) => state.currentGameResult,
    history: (state) => state.historyRecords,
    best: (state) => state.bestScore,
    newRecord: (state) => state.isNewRecord,
  },
  actions: {
    setPlayingStatus(status) {
      this.playing = status;
      sessionStorage.setItem("playing", status);
    },
    setShackingStatus(status) {
      this.shacking = status;
      sessionStorage.setItem("shacking", status);
    },
    setAppleIsGroundStatus(status) {
      this.appleIsGround = status;
      sessionStorage.setItem("appleIsGround", status);
    },
    setAppleIsBasketStatus(status) {
      this.appleIsBasket = status;
      sessionStorage.setItem("appleIsBasket", status);
    },

    /**
     * Load persisted history and best score from localStorage into state.
     */
    loadHistory() {
      this.historyRecords = loadHistoryFromStorage();
      this.bestScore = loadBestScoreFromStorage();
    },

    /**
     * Start a new game session: reset all in-progress state and record start time.
     */
    startGame() {
      // Reset in-progress state
      this.shacking = false;
      this.appleIsGround = false;
      this.appleIsBasket = false;
      this.yPosValue = [];
      this.svg = [];
      this.basketSvg = [];
      this.playing = true;
      this.gameStartTime = Date.now();
      this.currentGameResult = null;
      this.isNewRecord = false;

      sessionStorage.setItem("playing", "true");
      sessionStorage.setItem("shacking", "false");
      sessionStorage.setItem("appleIsGround", "false");
      sessionStorage.setItem("appleIsBasket", "false");
    },

    /**
     * End the current game: compute result, update history and best score, persist.
     */
    endGame() {
      const endTime = Date.now();
      const durationMs = this.gameStartTime ? endTime - this.gameStartTime : 0;
      const result = buildGameResult(durationMs);

      this.currentGameResult = result;
      this.playing = false;

      // Update history
      this.historyRecords = [result, ...this.historyRecords].slice(0, MAX_HISTORY);
      saveHistoryToStorage(this.historyRecords);

      // Update best score
      if (result.score > this.bestScore) {
        this.bestScore = result.score;
        this.isNewRecord = true;
        saveBestScoreToStorage(this.bestScore);
      } else {
        this.isNewRecord = false;
      }

      sessionStorage.setItem("playing", "false");
    },

    /**
     * Fully reset all game state (in-progress + result), keep history.
     */
    resetGameState() {
      this.shacking = false;
      this.playing = false;
      this.appleIsGround = false;
      this.appleIsBasket = false;
      this.yPosValue = [];
      this.svg = [];
      this.basketSvg = [];
      this.gameStartTime = null;
      this.currentGameResult = null;
      this.isNewRecord = false;

      sessionStorage.setItem("playing", "false");
      sessionStorage.setItem("shacking", "false");
      sessionStorage.setItem("appleIsGround", "false");
      sessionStorage.setItem("appleIsBasket", "false");
    },

    // Tree Random Seed yPos
    treeYPos(i) {
      const max = 340;
      const min = 30;
      this.yPosValue.push(randomInt(min, max));
      return this.yPosValue[i];
    },

    treeApple() {
      const imgUrl = new URL("../assets/simple-apple.svg", import.meta.url)
        .href;

      for (let i = 0; i < 15; i++) {
        const tree_apple = d3
          .select("#apples")
          .append("svg:image")
          .attr("xlink:href", imgUrl)
          .attr("width", this.appleSize.width)
          .attr("height", this.appleSize.height)
          .attr("y", this.treeYPos(i))
          .attr("x", treeXPos(this.yPosValue[i]));
        this.svg.push(tree_apple);
      }
    },
    basketApple() {
      const imgUrl = new URL("../assets/simple-apple.svg", import.meta.url)
        .href;
      for (let i = 0; i < 10; i++) {
        const basket_apple = d3
          .select("#basket_apples")
          .append("svg:image")
          .attr("xlink:href", imgUrl)
          .attr("width", this.appleSize.width)
          .attr("height", this.appleSize.height)
          .attr("x", xPos(i))
          .attr("y", yPos(i));
        this.basketSvg.push(basket_apple);
      }
      setTimeout(() => {
        this.setAppleIsBasketStatus(true);
      }, 5000);
    },
    dropDownApples() {
      for (let i = 0; i < this.svg.length; i++) {
        this.svg[i]
          .transition()
          .attr("y", 850)
          .duration(1000)
          .delay(d3.randomInt(1000, 2000));
      }
      setTimeout(() => {
        this.setAppleIsGroundStatus(true);
        this.setShackingStatus(false);
      }, 3000);
    },
    shakeTree() {
      this.setShackingStatus(true);
      setTimeout(() => {
        this.dropDownApples();
      }, 100);
    },
  },
});

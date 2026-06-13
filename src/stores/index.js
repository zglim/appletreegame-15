import { defineStore } from "pinia";
import * as d3 from "d3";
import {
  xPos,
  yPos,
  randomInt,
  treeXPos,
  calculateScore,
  getHistoryRecords,
  saveHistoryRecord,
  getBestScore,
  saveBestScore,
  isNewRecord,
} from "@/utils/helpers";

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
    timerInterval: null,
    elapsedSeconds: 0,

    // --- Current session result (filled when game ends) ---
    currentResult: null,

    // --- History & best (loaded from localStorage) ---
    bestScore: null,
    historyRecords: [],
    isRecord: false,
  }),

  getters: {
    shackingStatus: (state) => state.shacking,
    playingStatus: (state) => state.playing,
    appleIsGroundStatus: (state) => state.appleIsGround,
    svgData: (state) => state.svg,
    basketSvgData: (state) => state.basketSvg,
    appleIsBasketStatus: (state) => state.appleIsBasket,
    currentResultData: (state) => state.currentResult,
    bestScoreData: (state) => state.bestScore,
    historyData: (state) => state.historyRecords,
    isRecordData: (state) => state.isRecord,
    elapsedTime: (state) => state.elapsedSeconds,
  },

  actions: {
    // ----- setters for in-progress state -----
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

    // ----- timer -----
    startTimer() {
      this.gameStartTime = Date.now();
      this.elapsedSeconds = 0;
      this.timerInterval = setInterval(() => {
        this.elapsedSeconds = Math.floor(
          (Date.now() - this.gameStartTime) / 1000
        );
      }, 1000);
    },
    stopTimer() {
      if (this.timerInterval) {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
      }
    },

    // ----- history / best -----
    loadHistory() {
      this.historyRecords = getHistoryRecords();
      this.bestScore = getBestScore();
    },

    // ----- scoring -----
    finalizeGame() {
      this.stopTimer();
      const endTime = Date.now();
      const totalApples = 15;
      const collectedApples = 10;

      const result = calculateScore(
        this.gameStartTime,
        endTime,
        totalApples,
        collectedApples
      );

      this.currentResult = result;

      const best = getBestScore();
      if (isNewRecord(result, best)) {
        saveBestScore(result);
        this.bestScore = result;
        this.isRecord = true;
      } else {
        this.bestScore = best;
        this.isRecord = false;
      }

      saveHistoryRecord({
        ...result,
        date: new Date().toISOString(),
      });
      this.historyRecords = getHistoryRecords();
    },

    // ----- full reset for new game -----
    resetGameState() {
      this.stopTimer();

      // Clear D3 SVG elements
      try {
        d3.select("#apples").selectAll("*").remove();
        d3.select("#basket_apples").selectAll("*").remove();
      } catch (_) {
        // DOM may not be present in tests
      }

      this.shacking = false;
      this.appleIsGround = false;
      this.appleIsBasket = false;
      this.yPosValue = [];
      this.svg = [];
      this.basketSvg = [];
      this.gameStartTime = null;
      this.elapsedSeconds = 0;
      this.currentResult = null;
      this.isRecord = false;

      sessionStorage.removeItem("shacking");
      sessionStorage.removeItem("appleIsGround");
      sessionStorage.removeItem("appleIsBasket");
    },

    // ----- tree / apple logic -----
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
        this.finalizeGame();
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

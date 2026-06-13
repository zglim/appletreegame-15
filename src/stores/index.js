import { defineStore } from "pinia";
import * as d3 from "d3";
import { xPos, yPos, randomInt, treeXPos } from "@/utils/helpers";

export const useAppleTreeStore = defineStore("appleTree", {
  state: () => ({
    shacking: false,
    playing: false,
    appleIsGround: false,
    appleIsBasket: false,
    appleSize: { width: 40, height: 40 },
    yPosValue: [],
    svg: [],
    basketSvg: [],
    // Timer IDs for cleanup
    _basketTimer: null,
    _dropTimer: null,
    _shakeTimer: null,
    // Re-entry guard: true while shake+drop animation is in progress
    isAnimating: false,
  }),
  getters: {
    shackingStatus: (state) => state.shacking,
    playingStatus: (state) => state.playing,
    appleIsGroundStatus: (state) => state.appleIsGround,
    svgData: (state) => state.svg,
    basketSvgData: (state) => state.basketSvg,
    appleIsBasketStatus: (state) => state.appleIsBasket,
  },
  actions: {
    setPlayingStatus(status) {
      this.playing = status;
      sessionStorage.setItem("playing", String(status));
    },
    setShackingStatus(status) {
      this.shacking = status;
      sessionStorage.setItem("shacking", String(status));
    },
    setAppleIsGroundStatus(status) {
      this.appleIsGround = status;
      sessionStorage.setItem("appleIsGround", String(status));
    },
    setAppleIsBasketStatus(status) {
      this.appleIsBasket = status;
      sessionStorage.setItem("appleIsBasket", String(status));
    },

    // Tree Random Seed yPos
    treeYPos(i) {
      const max = 340;
      const min = 30;
      this.yPosValue.push(randomInt(min, max));
      return this.yPosValue[i];
    },

    treeApple() {
      // Clear any existing apple SVG nodes before creating new ones
      d3.select("#apples").selectAll("*").remove();
      this.svg = [];
      this.yPosValue = [];

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
      // Clear any existing basket apple SVG nodes before creating new ones
      d3.select("#basket_apples").selectAll("*").remove();
      this.basketSvg = [];

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
      // Clear any existing basket timer before setting a new one
      if (this._basketTimer !== null) {
        clearTimeout(this._basketTimer);
      }
      this._basketTimer = setTimeout(() => {
        this._basketTimer = null;
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
      // Clear any existing drop timer before setting a new one
      if (this._dropTimer !== null) {
        clearTimeout(this._dropTimer);
      }
      this._dropTimer = setTimeout(() => {
        this._dropTimer = null;
        this.setAppleIsGroundStatus(true);
        this.setShackingStatus(false);
        this.isAnimating = false;
      }, 3000);
    },
    shakeTree() {
      // Re-entry guard: prevent multiple shakes during animation
      if (this.isAnimating) {
        return;
      }
      this.isAnimating = true;
      this.setShackingStatus(true);
      // Clear any existing shake timer before setting a new one
      if (this._shakeTimer !== null) {
        clearTimeout(this._shakeTimer);
      }
      this._shakeTimer = setTimeout(() => {
        this._shakeTimer = null;
        this.dropDownApples();
      }, 100);
    },

    /**
     * Full game reset: clears timers, DOM nodes, arrays, and all state.
     * Used when returning to home from end screen or starting a new game.
     */
    resetGame() {
      // 1. Clear all pending timers
      if (this._basketTimer !== null) {
        clearTimeout(this._basketTimer);
        this._basketTimer = null;
      }
      if (this._dropTimer !== null) {
        clearTimeout(this._dropTimer);
        this._dropTimer = null;
      }
      if (this._shakeTimer !== null) {
        clearTimeout(this._shakeTimer);
        this._shakeTimer = null;
      }

      // 2. Clear D3 SVG DOM nodes
      d3.select("#apples").selectAll("*").remove();
      d3.select("#basket_apples").selectAll("*").remove();

      // 3. Reset arrays
      this.svg = [];
      this.basketSvg = [];
      this.yPosValue = [];

      // 4. Reset all boolean state
      this.shacking = false;
      this.playing = false;
      this.appleIsGround = false;
      this.appleIsBasket = false;
      this.isAnimating = false;

      // 5. Clear sessionStorage
      sessionStorage.removeItem("playing");
      sessionStorage.removeItem("shacking");
      sessionStorage.removeItem("appleIsGround");
      sessionStorage.removeItem("appleIsBasket");
    },
  },
});

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
    _timers: [],
    _dropping: false,
  }),
  getters: {
    shackingStatus: (state) => state.shacking,
    playingStatus: (state) => state.playing,
    appleIsGroundStatus: (state) => state.appleIsGround,
    svgData: (state) => state.svg,
    basketSvgData: (state) => state.basketSvg,
    appleIsBasketStatus: (state) => state.appleIsBasket,
    isDropping: (state) => state._dropping,
  },
  actions: {
    _addTimer(fn, delay) {
      const id = setTimeout(() => {
        // Remove from tracking list after execution
        const idx = this._timers.indexOf(id);
        if (idx !== -1) this._timers.splice(idx, 1);
        fn();
      }, delay);
      this._timers.push(id);
      return id;
    },

    cancelAllTimers() {
      for (const id of this._timers) {
        clearTimeout(id);
      }
      this._timers = [];
    },

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
      // Guard: don't create duplicate apples if already populated
      if (this.svg.length > 0) return;

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
      // Guard: don't create duplicate basket apples if already populated
      if (this.basketSvg.length > 0) return;

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
      this._addTimer(() => {
        this.setAppleIsBasketStatus(true);
      }, 5000);
    },
    dropDownApples() {
      // Guard: prevent duplicate drop animations
      if (this._dropping) return;
      this._dropping = true;

      for (let i = 0; i < this.svg.length; i++) {
        this.svg[i]
          .transition()
          .attr("y", 850)
          .duration(1000)
          .delay(d3.randomInt(1000, 2000));
      }
      this._addTimer(() => {
        this.setAppleIsGroundStatus(true);
        this.setShackingStatus(false);
        this._dropping = false;
      }, 3000);
    },
    shakeTree() {
      // Guard: only shake when playing, not already shaking, and not already dropped
      if (!this.playing || this.shacking || this.appleIsGround || this.appleIsBasket || this._dropping) {
        return;
      }
      this.setShackingStatus(true);
      this._addTimer(() => {
        this.dropDownApples();
      }, 100);
    },

    resetGame() {
      // 1. Cancel all pending timers
      this.cancelAllTimers();

      // 2. Remove D3 SVG elements from DOM
      try {
        d3.select("#apples").selectAll("*").remove();
        d3.select("#basket_apples").selectAll("*").remove();
      } catch (e) {
        // DOM elements may not exist, that's OK
      }

      // 3. Reset all in-memory state
      this.shacking = false;
      this.playing = false;
      this.appleIsGround = false;
      this.appleIsBasket = false;
      this.yPosValue = [];
      this.svg = [];
      this.basketSvg = [];
      this._dropping = false;

      // 4. Clear all sessionStorage game keys
      sessionStorage.removeItem("playing");
      sessionStorage.removeItem("shacking");
      sessionStorage.removeItem("appleIsGround");
      sessionStorage.removeItem("appleIsBasket");
    },
  },
});

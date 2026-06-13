import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, test } from "vitest";
import {
  useAppleTreeStore,
  calculateScore,
  getRating,
  buildGameResult,
  loadHistoryFromStorage,
  saveHistoryToStorage,
  loadBestScoreFromStorage,
  saveBestScoreToStorage,
} from "../stores/index.js";

describe("Store", () => {
  beforeEach(() => {
    const pinia = createPinia();
    setActivePinia(pinia);
    localStorage.clear();
  });

  test("shackingStatus", () => {
    const store = useAppleTreeStore();
    expect(store.shackingStatus).toBe(false);
  });

  test("playingStatus", () => {
    const store = useAppleTreeStore();
    expect(store.playingStatus).toBe(false);
  });

  test("appleIsGroundStatus", () => {
    const store = useAppleTreeStore();
    expect(store.appleIsGroundStatus).toBe(false);
  });

  test("svgData", () => {
    const store = useAppleTreeStore();
    expect(store.svgData).toStrictEqual([]);
  });

  test("basketSvgData", () => {
    const store = useAppleTreeStore();
    expect(store.basketSvgData).toStrictEqual([]);
  });

  test("setPlayingStatus", () => {
    const store = useAppleTreeStore();
    store.setPlayingStatus(true);
    expect(store.playingStatus).toBe(true);
  });

  test("setShackingStatus", () => {
    const store = useAppleTreeStore();
    store.setShackingStatus(true);
    expect(store.shackingStatus).toBe(true);
  });

  test("setAppleIsGroundStatus", () => {
    const store = useAppleTreeStore();
    store.setAppleIsGroundStatus(true);
    expect(store.appleIsGroundStatus).toBe(true);
  });

  // --- New state fields ---
  test("initial currentGameResult is null", () => {
    const store = useAppleTreeStore();
    expect(store.currentResult).toBeNull();
  });

  test("initial history is empty", () => {
    const store = useAppleTreeStore();
    expect(store.history).toStrictEqual([]);
  });

  test("initial bestScore is 0", () => {
    const store = useAppleTreeStore();
    expect(store.best).toBe(0);
  });

  test("initial isNewRecord is false", () => {
    const store = useAppleTreeStore();
    expect(store.newRecord).toBe(false);
  });
});

describe("Scoring", () => {
  test("calculateScore returns 1000 for 0 seconds", () => {
    expect(calculateScore(0)).toBe(1000);
  });

  test("calculateScore decreases with time", () => {
    const s1 = calculateScore(10);
    const s2 = calculateScore(20);
    expect(s1).toBeGreaterThan(s2);
  });

  test("calculateScore never goes below 0", () => {
    expect(calculateScore(9999)).toBe(0);
  });

  test("getRating S for high score", () => {
    expect(getRating(900)).toBe("S");
    expect(getRating(800)).toBe("S");
  });

  test("getRating A for medium-high score", () => {
    expect(getRating(700)).toBe("A");
    expect(getRating(600)).toBe("A");
  });

  test("getRating B for medium score", () => {
    expect(getRating(500)).toBe("B");
    expect(getRating(400)).toBe("B");
  });

  test("getRating C for low score", () => {
    expect(getRating(300)).toBe("C");
    expect(getRating(0)).toBe("C");
  });

  test("buildGameResult returns proper structure", () => {
    const result = buildGameResult(10000); // 10 seconds
    expect(result).toHaveProperty("duration");
    expect(result).toHaveProperty("score");
    expect(result).toHaveProperty("rating");
    expect(result).toHaveProperty("date");
    expect(result.duration).toBe(10.0);
    expect(typeof result.score).toBe("number");
    expect(typeof result.rating).toBe("string");
  });
});

describe("Persistence", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("loadHistoryFromStorage returns empty array when nothing stored", () => {
    expect(loadHistoryFromStorage()).toStrictEqual([]);
  });

  test("saveHistoryToStorage and loadHistoryFromStorage round-trip", () => {
    const records = [{ score: 500, rating: "B", duration: 50, date: "2024-01-01" }];
    saveHistoryToStorage(records);
    expect(loadHistoryFromStorage()).toStrictEqual(records);
  });

  test("loadBestScoreFromStorage returns 0 when nothing stored", () => {
    expect(loadBestScoreFromStorage()).toBe(0);
  });

  test("saveBestScoreToStorage and loadBestScoreFromStorage round-trip", () => {
    saveBestScoreToStorage(750);
    expect(loadBestScoreFromStorage()).toBe(750);
  });

  test("loadHistory handles corrupt localStorage gracefully", () => {
    localStorage.setItem("appleTreeHistory", "not-json");
    expect(loadHistoryFromStorage()).toStrictEqual([]);
  });
});

describe("Game flow: startGame, endGame, resetGameState", () => {
  beforeEach(() => {
    const pinia = createPinia();
    setActivePinia(pinia);
    localStorage.clear();
  });

  test("startGame sets playing=true and gameStartTime", () => {
    const store = useAppleTreeStore();
    store.startGame();
    expect(store.playing).toBe(true);
    expect(store.gameStartTime).not.toBeNull();
    expect(store.currentGameResult).toBeNull();
    expect(store.isNewRecord).toBe(false);
  });

  test("startGame clears previous in-progress state", () => {
    const store = useAppleTreeStore();
    // Simulate leftover state
    store.shacking = true;
    store.appleIsGround = true;
    store.yPosValue = [1, 2, 3];
    store.svg = ["a"];
    store.basketSvg = ["b"];

    store.startGame();

    expect(store.shacking).toBe(false);
    expect(store.appleIsGround).toBe(false);
    expect(store.appleIsBasket).toBe(false);
    expect(store.yPosValue).toStrictEqual([]);
    expect(store.svg).toStrictEqual([]);
    expect(store.basketSvg).toStrictEqual([]);
  });

  test("endGame computes result and saves to history", () => {
    const store = useAppleTreeStore();
    store.startGame();
    // Simulate elapsed time by backdating startTime
    store.gameStartTime = Date.now() - 10000; // 10 seconds ago

    store.endGame();

    expect(store.currentGameResult).not.toBeNull();
    expect(store.currentGameResult.duration).toBeGreaterThan(9);
    expect(store.currentGameResult.score).toBeGreaterThan(0);
    expect(store.history.length).toBe(1);
    expect(store.playing).toBe(false);
  });

  test("endGame updates bestScore and isNewRecord on new record", () => {
    const store = useAppleTreeStore();
    store.startGame();
    store.gameStartTime = Date.now() - 1000; // 1 second = high score

    store.endGame();

    expect(store.best).toBeGreaterThan(0);
    expect(store.isNewRecord).toBe(true);
    expect(loadBestScoreFromStorage()).toBe(store.best);
  });

  test("endGame does not set isNewRecord when score is lower", () => {
    const store = useAppleTreeStore();

    // First game: very fast
    store.startGame();
    store.gameStartTime = Date.now() - 1000;
    store.endGame();
    const firstBest = store.best;

    // Second game: very slow
    store.startGame();
    store.gameStartTime = Date.now() - 200000; // 200 seconds
    store.endGame();

    expect(store.best).toBe(firstBest);
    expect(store.isNewRecord).toBe(false);
  });

  test("history is limited to MAX_HISTORY entries", () => {
    const store = useAppleTreeStore();

    for (let i = 0; i < 15; i++) {
      store.startGame();
      store.gameStartTime = Date.now() - (i + 1) * 1000;
      store.endGame();
    }

    expect(store.history.length).toBeLessThanOrEqual(10);
  });

  test("loadHistory restores from localStorage", () => {
    // Pre-populate localStorage
    const records = [
      { score: 500, rating: "B", duration: 50, date: "2024-01-01" },
    ];
    saveHistoryToStorage(records);
    saveBestScoreToStorage(500);

    const store = useAppleTreeStore();
    store.loadHistory();

    expect(store.history).toStrictEqual(records);
    expect(store.best).toBe(500);
  });

  test("resetGameState clears all in-progress state and result, keeps history", () => {
    const store = useAppleTreeStore();

    // Play a game
    store.startGame();
    store.gameStartTime = Date.now() - 5000;
    store.endGame();

    expect(store.history.length).toBe(1);
    expect(store.currentGameResult).not.toBeNull();

    // Reset
    store.resetGameState();

    expect(store.playing).toBe(false);
    expect(store.shacking).toBe(false);
    expect(store.appleIsGround).toBe(false);
    expect(store.appleIsBasket).toBe(false);
    expect(store.yPosValue).toStrictEqual([]);
    expect(store.svg).toStrictEqual([]);
    expect(store.basketSvg).toStrictEqual([]);
    expect(store.gameStartTime).toBeNull();
    expect(store.currentGameResult).toBeNull();
    expect(store.isNewRecord).toBe(false);
    // History should be preserved
    expect(store.history.length).toBe(1);
  });

  test("consecutive games do not leak state", () => {
    const store = useAppleTreeStore();

    // Game 1
    store.startGame();
    store.shacking = true;
    store.yPosValue = [100, 200];
    store.gameStartTime = Date.now() - 5000;
    store.endGame();

    // Game 2
    store.startGame();
    expect(store.shacking).toBe(false);
    expect(store.yPosValue).toStrictEqual([]);
    expect(store.svg).toStrictEqual([]);
    expect(store.basketSvg).toStrictEqual([]);
    expect(store.appleIsGround).toBe(false);
    expect(store.appleIsBasket).toBe(false);
    expect(store.currentGameResult).toBeNull();
    expect(store.isNewRecord).toBe(false);
    expect(store.gameStartTime).not.toBeNull();
  });
});

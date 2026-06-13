import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, test, vi, afterEach } from "vitest";
import { useAppleTreeStore } from "../stores/index.js";

describe("Store - resetGame", () => {
  beforeEach(() => {
    const pinia = createPinia();
    setActivePinia(pinia);
    // Clean sessionStorage before each test
    sessionStorage.clear();
  });

  afterEach(() => {
    sessionStorage.clear();
  });

  test("resetGame clears all boolean state to false", () => {
    const store = useAppleTreeStore();
    // Set everything to true
    store.shacking = true;
    store.playing = true;
    store.appleIsGround = true;
    store.appleIsBasket = true;
    store.isAnimating = true;

    store.resetGame();

    expect(store.shacking).toBe(false);
    expect(store.playing).toBe(false);
    expect(store.appleIsGround).toBe(false);
    expect(store.appleIsBasket).toBe(false);
    expect(store.isAnimating).toBe(false);
  });

  test("resetGame clears svg, basketSvg, and yPosValue arrays", () => {
    const store = useAppleTreeStore();
    // Simulate populated arrays
    store.svg = [{}, {}, {}];
    store.basketSvg = [{}, {}];
    store.yPosValue = [10, 20, 30];

    store.resetGame();

    expect(store.svg).toStrictEqual([]);
    expect(store.basketSvg).toStrictEqual([]);
    expect(store.yPosValue).toStrictEqual([]);
  });

  test("resetGame clears sessionStorage entries", () => {
    const store = useAppleTreeStore();
    store.setPlayingStatus(true);
    store.setShackingStatus(true);
    store.setAppleIsGroundStatus(true);
    store.setAppleIsBasketStatus(true);

    expect(sessionStorage.getItem("playing")).toBe("true");
    expect(sessionStorage.getItem("shacking")).toBe("true");
    expect(sessionStorage.getItem("appleIsGround")).toBe("true");
    expect(sessionStorage.getItem("appleIsBasket")).toBe("true");

    store.resetGame();

    expect(sessionStorage.getItem("playing")).toBeNull();
    expect(sessionStorage.getItem("shacking")).toBeNull();
    expect(sessionStorage.getItem("appleIsGround")).toBeNull();
    expect(sessionStorage.getItem("appleIsBasket")).toBeNull();
  });

  test("resetGame clears pending timers", () => {
    vi.useFakeTimers();
    const store = useAppleTreeStore();

    // Simulate having active timers
    store._basketTimer = setTimeout(() => {}, 10000);
    store._dropTimer = setTimeout(() => {}, 10000);
    store._shakeTimer = setTimeout(() => {}, 10000);

    expect(store._basketTimer).not.toBeNull();
    expect(store._dropTimer).not.toBeNull();
    expect(store._shakeTimer).not.toBeNull();

    store.resetGame();

    expect(store._basketTimer).toBeNull();
    expect(store._dropTimer).toBeNull();
    expect(store._shakeTimer).toBeNull();

    vi.useRealTimers();
  });
});

describe("Store - shakeTree re-entry guard", () => {
  beforeEach(() => {
    const pinia = createPinia();
    setActivePinia(pinia);
    sessionStorage.clear();
  });

  afterEach(() => {
    sessionStorage.clear();
  });

  test("shakeTree sets isAnimating to true", () => {
    vi.useFakeTimers();
    const store = useAppleTreeStore();

    expect(store.isAnimating).toBe(false);
    store.shakeTree();
    expect(store.isAnimating).toBe(true);

    // After drop completes (100ms shake + 3000ms drop), isAnimating resets
    vi.advanceTimersByTime(3200);
    expect(store.isAnimating).toBe(false);

    vi.useRealTimers();
  });

  test("shakeTree blocks re-entry while animating", () => {
    vi.useFakeTimers();
    const store = useAppleTreeStore();

    store.shakeTree();
    expect(store.isAnimating).toBe(true);
    expect(store.shacking).toBe(true);

    // Try to shake again — should be blocked
    store.setShackingStatus(false); // simulate manual reset
    store.shakeTree();
    // shacking should still be false because the second call was blocked
    expect(store.shacking).toBe(false);

    vi.useRealTimers();
  });

  test("shakeTree allows shaking again after animation completes", () => {
    vi.useFakeTimers();
    const store = useAppleTreeStore();

    // First shake
    store.shakeTree();
    expect(store.isAnimating).toBe(true);

    // Wait for full animation cycle
    vi.advanceTimersByTime(3200);
    expect(store.isAnimating).toBe(false);

    // Now shake again — should work
    store.shakeTree();
    expect(store.isAnimating).toBe(true);
    expect(store.shacking).toBe(true);

    vi.useRealTimers();
  });
});

describe("Store - basketApple timer management", () => {
  beforeEach(() => {
    const pinia = createPinia();
    setActivePinia(pinia);
    sessionStorage.clear();
  });

  afterEach(() => {
    sessionStorage.clear();
  });

  test("basketApple sets appleIsBasket to true after 5 seconds", () => {
    vi.useFakeTimers();
    const store = useAppleTreeStore();

    expect(store.appleIsBasket).toBe(false);
    store.basketApple();
    expect(store.appleIsBasket).toBe(false);

    vi.advanceTimersByTime(5000);
    expect(store.appleIsBasket).toBe(true);

    vi.useRealTimers();
  });

  test("resetGame prevents stale basketApple timer from firing", () => {
    vi.useFakeTimers();
    const store = useAppleTreeStore();

    store.basketApple();
    expect(store._basketTimer).not.toBeNull();

    // Reset before the timer fires
    store.resetGame();
    expect(store._basketTimer).toBeNull();

    // Advance past the 5s mark — appleIsBasket should remain false
    vi.advanceTimersByTime(6000);
    expect(store.appleIsBasket).toBe(false);

    vi.useRealTimers();
  });
});

describe("Store - dropDownApples timer management", () => {
  beforeEach(() => {
    const pinia = createPinia();
    setActivePinia(pinia);
    sessionStorage.clear();
  });

  afterEach(() => {
    sessionStorage.clear();
  });

  test("resetGame prevents stale dropDownApples timer from firing", () => {
    vi.useFakeTimers();
    const store = useAppleTreeStore();

    // Simulate having svg elements (skip actual D3 calls for unit test)
    store.svg = [];
    store.isAnimating = true;
    store.shacking = true;

    // Manually trigger the drop timer path
    store._dropTimer = setTimeout(() => {
      store.setAppleIsGroundStatus(true);
      store.setShackingStatus(false);
      store.isAnimating = false;
    }, 3000);

    // Reset before timer fires
    store.resetGame();

    vi.advanceTimersByTime(4000);

    // The timer callback should NOT have fired
    expect(store.appleIsGround).toBe(false);
    expect(store.shacking).toBe(false); // reset by resetGame
    expect(store.isAnimating).toBe(false); // reset by resetGame

    vi.useRealTimers();
  });
});

describe("Store - sessionStorage consistency", () => {
  beforeEach(() => {
    const pinia = createPinia();
    setActivePinia(pinia);
    sessionStorage.clear();
  });

  afterEach(() => {
    sessionStorage.clear();
  });

  test("setPlayingStatus stores string representation", () => {
    const store = useAppleTreeStore();
    store.setPlayingStatus(true);
    expect(sessionStorage.getItem("playing")).toBe("true");
    store.setPlayingStatus(false);
    expect(sessionStorage.getItem("playing")).toBe("false");
  });

  test("route guard compatible values in sessionStorage", () => {
    const store = useAppleTreeStore();
    store.setPlayingStatus(true);
    // The route guard checks === "true"
    expect(sessionStorage.getItem("playing") === "true").toBe(true);

    store.setPlayingStatus(false);
    expect(sessionStorage.getItem("playing") === "true").toBe(false);
  });
});

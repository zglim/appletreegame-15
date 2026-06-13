import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, test } from 'vitest';
import { useAppleTreeStore } from '@/stores/index.js';
import { GamePhase } from '@/config/gameConfig';

describe('Store — state machine', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  test('initial state is IDLE', () => {
    const store = useAppleTreeStore();
    expect(store.phase).toBe(GamePhase.IDLE);
    expect(store.isIdle).toBe(true);
    expect(store.isPlaying).toBe(false);
    expect(store.playing).toBe(false);
    expect(store.shacking).toBe(false);
    expect(store.appleIsGround).toBe(false);
    expect(store.appleIsBasket).toBe(false);
  });

  test('startGame transitions to PLAYING', () => {
    const store = useAppleTreeStore();
    store.startGame();
    expect(store.phase).toBe(GamePhase.PLAYING);
    expect(store.playing).toBe(true);
    expect(store.isPlaying).toBe(true);
  });

  test('shakeTree transitions PLAYING → SHAKING', () => {
    const store = useAppleTreeStore();
    store.startGame();
    store.shakeTree();
    expect(store.phase).toBe(GamePhase.SHAKING);
    expect(store.shacking).toBe(true);
  });

  test('shakeTree is a no-op when not PLAYING', () => {
    const store = useAppleTreeStore();
    store.shakeTree();
    expect(store.phase).toBe(GamePhase.IDLE);
  });

  test('startDrop transitions SHAKING → DROPPING', () => {
    const store = useAppleTreeStore();
    store.startGame();
    store.shakeTree();
    store.startDrop();
    expect(store.phase).toBe(GamePhase.DROPPING);
    expect(store.isDropping).toBe(true);
  });

  test('startDrop is a no-op when not SHAKING', () => {
    const store = useAppleTreeStore();
    store.startGame();
    store.startDrop();
    expect(store.phase).toBe(GamePhase.PLAYING);
  });

  test('applesLanded transitions DROPPING → GROUNDED', () => {
    const store = useAppleTreeStore();
    store.startGame();
    store.shakeTree();
    store.startDrop();
    store.applesLanded();
    expect(store.phase).toBe(GamePhase.GROUNDED);
    expect(store.appleIsGround).toBe(true);
    expect(store.isGrounded).toBe(true);
  });

  test('applesLanded is a no-op when not DROPPING', () => {
    const store = useAppleTreeStore();
    store.startGame();
    store.shakeTree();
    store.applesLanded();
    expect(store.phase).toBe(GamePhase.SHAKING);
  });

  test('basketFilled transitions GROUNDED → BASKET_DONE', () => {
    const store = useAppleTreeStore();
    store.startGame();
    store.shakeTree();
    store.startDrop();
    store.applesLanded();
    store.basketFilled();
    expect(store.phase).toBe(GamePhase.BASKET_DONE);
    expect(store.appleIsBasket).toBe(true);
    expect(store.isBasketDone).toBe(true);
  });

  test('basketFilled is a no-op when not GROUNDED', () => {
    const store = useAppleTreeStore();
    store.startGame();
    store.basketFilled();
    expect(store.phase).toBe(GamePhase.PLAYING);
  });

  test('full lifecycle: IDLE → PLAYING → SHAKING → DROPPING → GROUNDED → BASKET_DONE → ENDED', () => {
    const store = useAppleTreeStore();
    expect(store.phase).toBe(GamePhase.IDLE);

    store.startGame();
    expect(store.phase).toBe(GamePhase.PLAYING);

    store.shakeTree();
    expect(store.phase).toBe(GamePhase.SHAKING);

    store.startDrop();
    expect(store.phase).toBe(GamePhase.DROPPING);

    store.applesLanded();
    expect(store.phase).toBe(GamePhase.GROUNDED);

    store.basketFilled();
    expect(store.phase).toBe(GamePhase.BASKET_DONE);

    store.endGame();
    expect(store.phase).toBe(GamePhase.ENDED);
    expect(store.isEnded).toBe(true);
  });

  test('reset clears everything back to IDLE', () => {
    const store = useAppleTreeStore();
    store.startGame();
    store.shakeTree();
    store.startDrop();
    store.applesLanded();
    store.basketFilled();

    store.pushTreeYPos(100);
    store.pushTreeYPos(200);
    expect(store.yPosValue).toEqual([100, 200]);

    store.reset();
    expect(store.phase).toBe(GamePhase.IDLE);
    expect(store.playing).toBe(false);
    expect(store.yPosValue).toEqual([]);
    expect(store.shacking).toBe(false);
    expect(store.appleIsGround).toBe(false);
    expect(store.appleIsBasket).toBe(false);
  });

  // ── Legacy compat ──────────────────────────────────────────
  test('setPlayingStatus(true) moves IDLE → PLAYING', () => {
    const store = useAppleTreeStore();
    store.setPlayingStatus(true);
    expect(store.playing).toBe(true);
    expect(store.phase).toBe(GamePhase.PLAYING);
  });

  test('setShackingStatus syncs boolean', () => {
    const store = useAppleTreeStore();
    store.setShackingStatus(true);
    expect(store.shackingStatus).toBe(true);
  });

  test('setAppleIsGroundStatus syncs boolean', () => {
    const store = useAppleTreeStore();
    store.setAppleIsGroundStatus(true);
    expect(store.appleIsGroundStatus).toBe(true);
  });

  test('setAppleIsBasketStatus syncs boolean', () => {
    const store = useAppleTreeStore();
    store.setAppleIsBasketStatus(true);
    expect(store.appleIsBasketStatus).toBe(true);
  });

  test('pushTreeYPos appends values', () => {
    const store = useAppleTreeStore();
    store.pushTreeYPos(42);
    store.pushTreeYPos(99);
    expect(store.yPosValue).toEqual([42, 99]);
  });

  test('appleSize matches config', () => {
    const store = useAppleTreeStore();
    expect(store.appleSize).toEqual({ width: 40, height: 40 });
  });

  test('treeAppleCount and basketAppleCount from config', () => {
    const store = useAppleTreeStore();
    expect(store.treeAppleCount).toBe(15);
    expect(store.basketAppleCount).toBe(10);
  });
});

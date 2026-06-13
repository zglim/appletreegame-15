import { beforeEach, describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import EndScreen from "../components/EndScreen.vue";
import { useAppleTreeStore } from "../stores/index.js";

vi.mock("@/router/index.js", () => ({
  default: {
    push: vi.fn(),
  },
}));

describe("EndScreen.vue", () => {
  beforeEach(() => {
    const pinia = createPinia();
    setActivePinia(pinia);
    localStorage.clear();
  });

  it("renders properly", () => {
    const wrapper = mount(EndScreen);
    expect(wrapper.exists()).toBe(true);
  });

  it("shows result card when currentResult exists", () => {
    const store = useAppleTreeStore();
    store.currentGameResult = { duration: 10.5, score: 947, rating: "S", date: "2024-01-01" };

    const wrapper = mount(EndScreen);
    expect(wrapper.find(".result-card").exists()).toBe(true);
    expect(wrapper.text()).toContain("947");
    expect(wrapper.text()).toContain("10.5s");
    expect(wrapper.text()).toContain("S");
  });

  it("shows new record badge when isNewRecord is true", () => {
    const store = useAppleTreeStore();
    store.isNewRecord = true;
    store.currentGameResult = { duration: 5, score: 975, rating: "S", date: "2024-01-01" };

    const wrapper = mount(EndScreen);
    expect(wrapper.find(".new-record-badge").exists()).toBe(true);
    expect(wrapper.text()).toContain("新纪录");
  });

  it("does not show new record badge when isNewRecord is false", () => {
    const store = useAppleTreeStore();
    store.isNewRecord = false;
    store.currentGameResult = { duration: 50, score: 500, rating: "B", date: "2024-01-01" };

    const wrapper = mount(EndScreen);
    expect(wrapper.find(".new-record-badge").exists()).toBe(false);
  });

  it("shows best score when available", () => {
    const store = useAppleTreeStore();
    store.bestScore = 800;
    store.currentGameResult = { duration: 20, score: 700, rating: "A", date: "2024-01-01" };

    const wrapper = mount(EndScreen);
    expect(wrapper.find(".best-section").exists()).toBe(true);
    expect(wrapper.text()).toContain("800");
  });

  it("has play again and go home buttons", () => {
    const wrapper = mount(EndScreen);
    expect(wrapper.find(".play-again").exists()).toBe(true);
    expect(wrapper.find(".go-home").exists()).toBe(true);
  });
});

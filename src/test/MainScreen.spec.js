import { beforeEach, describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { createPinia } from "pinia";
import MainScreen from "../components/MainScreen.vue";

vi.mock("@/router/index.js", () => ({
  default: {
    push: vi.fn(),
  },
}));

describe("MainScreen.vue", () => {
  let wrapper = null;
  beforeEach(() => {
    const pinia = createPinia();
    localStorage.clear();
    wrapper = mount(MainScreen, {
      global: {
        plugins: [pinia],
      },
    });
  });

  it("renders properly", () => {
    expect(wrapper.exists()).toBe(true);
  });

  it("shows play button", () => {
    expect(wrapper.find(".home-button").exists()).toBe(true);
  });

  it("does not show best score when no history", () => {
    expect(wrapper.find(".best-score").exists()).toBe(false);
  });

  it("does not show recent games when no history", () => {
    expect(wrapper.find(".recent-games").exists()).toBe(false);
  });
});

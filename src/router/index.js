import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import { GamePhase } from "@/config/gameConfig";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/game",
      name: "game",
      component: () => import("../views/GameView.vue"),
      beforeEnter: (_to, _from, next) => {
        sessionStorage.getItem("playing") === "true" ? next() : next("/");
      },
    },
    {
      path: "/:pathMatch(.*)*",
      name: "not-found",
      component: () => import("../views/NotFoundView.vue"),
    }
  ],
});

export default router;

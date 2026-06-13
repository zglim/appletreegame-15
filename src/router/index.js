import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

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
      beforeEnter: (to, from, next) => {
        // Only allow entering the game if sessionStorage indicates active play
        const isPlaying = sessionStorage.getItem("playing") === "true";
        if (!isPlaying) {
          next({ name: "home" });
        } else {
          next();
        }
      },
    },
    {
      path: "/:pathMatch(.*)*",
      name: "not-found",
      component: () => import("../views/NotFoundView.vue"),
    },
  ],
});

export default router;

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
        const playing = sessionStorage.getItem("playing");
        const appleIsBasket = sessionStorage.getItem("appleIsBasket");
        // Allow entry only if game is active and not already finished
        if (playing === "true" && appleIsBasket !== "true") {
          next();
        } else {
          // Clean up stale session data before redirecting
          sessionStorage.removeItem("playing");
          sessionStorage.removeItem("shacking");
          sessionStorage.removeItem("appleIsGround");
          sessionStorage.removeItem("appleIsBasket");
          next({ name: "home" });
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

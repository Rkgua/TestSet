import Home from "../views/Home.vue";
import Eggs from "../views/Eggs.vue";
import { createRouter, createWebHashHistory } from "vue-router";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: "/", component: Home },
    { path: "/eggs/:type", component: Eggs },
  ],
});
export default router;

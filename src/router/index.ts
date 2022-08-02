import { createRouter, createWebHistory } from "vue-router";
import CreateCampaing from '../views/CreateCampaing.vue';
import GameView from '../views/Game.vue';


export default createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: CreateCampaing
    },
    {
      path: '/v0/:id',
      component: GameView
    },
  ]
})
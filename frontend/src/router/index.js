import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'inicio',
      component: HomeView,
    },
    // Enlaces antiguos a /carta llevan a la sección de la carta
    { path: '/carta', redirect: { path: '/', hash: '#carta' } },
  ],
})

export default router

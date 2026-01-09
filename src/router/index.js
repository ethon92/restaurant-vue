import Home from '@/views/Home.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [{
    path: '/',
    component: Home,
    name: 'home'
  }],
})

export default router

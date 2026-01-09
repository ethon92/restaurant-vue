import Detail from '@/views/Detail.vue'
import Home from '@/views/Home.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [{
    path: '/',
    component: Home,
    name: 'home'
  },
  {
  path: '/restaurant/:name',
  name: 'restaurant-detail',
  component: Detail,
  props: true // 這行很重要，它會把網址的 :name 自動變成 DetailView 的 props
  },
],
})

export default router

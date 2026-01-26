import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import RestaurantDetail from '../views/RestaurantDetail.vue' 

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/restaurant/:id',
      name: 'RestaurantDetail',
      component: RestaurantDetail, 
      props: true 
    }
  ]
})

export default router
import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import RestaurantDetail from '../views/RestaurantDetail.vue' 
import BookingRecordPage from "@/views/BookingRecordPage.vue";
import FavoriteRestaurant from "@/views/FavoriteRestaurant.vue";


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
    },
    {
      path: "/favorite-restaurant",
      component: FavoriteRestaurant,
      name: "favoriteRestaurant",
    },
    {
      path: "/booking-record",
      component: BookingRecordPage,
      name: "bookingRecord"
    },
  ]
})

export default router;

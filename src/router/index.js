import BookingRecordPage from "@/views/BookingRecordPage.vue";
import FavoriteRestaurant from "@/views/FavoriteRestaurant.vue";
import Home from "@/views/Home.vue";
import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: Home,
      name: "home",
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
  ],
});

export default router;

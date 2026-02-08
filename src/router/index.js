import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/Home.vue";
import RestaurantDetail from "../views/RestaurantDetail.vue";
import BookingRecord from "@/views/ProfileDetail/BookingRecord.vue";
import FavoriteRestaurant from "@/views/ProfileDetail/FavoriteRestaurant.vue";
import Login from "@/views/auth/Login.vue";
import Register from "@/views/auth/Register.vue";
import ForgotPassword from "@/views/auth/ForgotPassword.vue";
import Profile from "@/views/auth/Profile.vue";
import VerifyIdentity from "@/views/auth/VerifyIdentity.vue";
import ResetPassword from "@/views/auth/ResetPassword.vue";
<<<<<<< HEAD
import SearchPage from '@/views/SearchPage.vue';
=======
import AccountDetail from "@/views/ProfileDetail/AccountDetail.vue";

>>>>>>> feature/profile


const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
    },
    {
      path: "/restaurant/:id",
      name: "RestaurantDetail",
      component: RestaurantDetail,
      props: true,
    },
<<<<<<< HEAD
    {
      path:'/search',
      component: SearchPage,
      name: 'Search',
    },
    {
      path: "/favorite-restaurant",
      component: FavoriteRestaurant,
      name: "favoriteRestaurant",
    },
    {
      path: "/booking-record",
      component: BookingRecordPage,
      name: "bookingRecord",
    },
    { path: "/login", 
      component: Login, 
      name: "login" 
    },
    { path: "/register", 
      component: Register, 
      name: "register" 
    },
=======
    { path: "/login", component: Login, name: "login" },
    { path: "/register", component: Register, name: "register" },
>>>>>>> feature/profile
    {
      path: "/forgot-password",
      component: ForgotPassword,
      name: "forgot-password",
    },
    // 未登入不能進 Profile
    {
      path: "/profile",
      component: Profile,
      name: "profile",
      meta: { requiresAuth: true },
      children: [
        {
          path: "booking-record",
          component: BookingRecord,
          name: "bookingRecord",
        },
        {
          path: "favorite-restaurant",
          component: FavoriteRestaurant,
          name: "favoriteRestaurant",
        },
        {
          path: "account-detail",
          component: AccountDetail,
          name: "accountDetail",
        },
      ],
    },
    {
      path: "/verify-identity",
      component: VerifyIdentity,
      name: "verify-identity",
    },
    {
      path: "/reset-password",
      component: ResetPassword,
      name: "reset-password",
    },
  ],
});


const isAuthenticated = () => Boolean(localStorage.getItem("auth_user_id"));

router.beforeEach((to) => {
  if (to.meta?.requiresAuth && !isAuthenticated()) {
    return { name: "login" };
  }
});

export default router;

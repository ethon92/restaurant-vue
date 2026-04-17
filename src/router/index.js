//
import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/Home.vue";
import RestaurantDetail from "../views/RestaurantDetail.vue";
import BookingRecord from "@/views/ProfileDetail/BookingRecord.vue";
import FavoriteRestaurant from "@/views/ProfileDetail/FavoriteRestaurant.vue";
import Login from "@/views/auth/Login.vue";
import Register from "@/views/auth/Register.vue";
import ForgotPassword from "@/views/auth/ForgotPassword.vue";
import Profile from "@/views/auth/Profile.vue";
import SearchPage from "@/views/SearchPage.vue";
import AccountDetail from "@/views/ProfileDetail/AccountDetail.vue";
import ChangePassword from "@/views/ProfileDetail/ChangePassword.vue";
import UserComment from "@/views/UserComment.vue";

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
    {
      path: "/search",
      component: SearchPage,
      name: "Search",
    },
    {
      path: "/favorite-restaurant",
      component: FavoriteRestaurant,
      name: "favoriteRestaurant",
    },
    {
      path: "/User-Comments",
      component: UserComment,
      name: "userComments",
    },
    {
      path: "/booking-record",
      component: BookingRecord,
      name: "bookingRecord",
    },
    { path: "/login", component: Login, name: "login" },
    { path: "/register", component: Register, name: "register" },
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
        // ✅ 進 /profile 自動顯示訂位紀錄
        {
          path: "",
          redirect: { name: "bookingRecord" },
        },
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
        {
          path: "change-password",
          component: ChangePassword,
          name: "changePassword",
        },
      ],
    },
  ],
});

/**
 * * ✅ 目前用 localStorage 的 "auth_access_token" 當登入旗標
 * [原本看 auth_user_id
 * 現在改成看 auth_access_token]
 */
const isAuthenticated = () =>
  Boolean(localStorage.getItem("auth_access_token"));

router.beforeEach((to) => {
  if (to.meta?.requiresAuth && !isAuthenticated()) {
    return { name: "login" };
  }
});

export default router;

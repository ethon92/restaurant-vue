import Home from "@/views/Home.vue";
import { createRouter, createWebHistory } from "vue-router";
import Login from "@/views/auth/Login.vue";
import Register from "@/views/auth/Register.vue";
import ForgotPassword from "@/views/auth/ForgotPassword.vue";
import Profile from "@/views/auth/Profile.vue";
import VerifyIdentity from "@/views/auth/VerifyIdentity.vue";
import ResetPassword from "@/views/auth/ResetPassword.vue";

// 先用 placeholder，之後合併再換成真正頁面
const BookingRecordPlaceholder = {
  template: "<div>Booking Record Page（待合併）</div>",
};
const FavoriteRestaurantPlaceholder = {
  template: "<div>Favorite Restaurant Page（待合併）</div>",
};

const routes = [
  { path: "/", component: Home, name: "home" },
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
  },
  {
    path: "/verify-identity",
    component: VerifyIdentity,
    name: "verify-identity",
  },
  { path: "/reset-password", component: ResetPassword, name: "reset-password" },

  //合併再換成真正頁面
  {
    path: "/booking-record",
    name: "booking-record",
    component: BookingRecordPlaceholder,
  },
  {
    path: "/favorite-restaurant",
    name: "favorite-restaurant",
    component: FavoriteRestaurantPlaceholder,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const isAuthenticated = () => Boolean(localStorage.getItem("auth_email"));

router.beforeEach((to) => {
  if (to.meta?.requiresAuth && !isAuthenticated()) {
    return { name: "login" };
  }
});

export default router;

import Home from "@/views/Home.vue";
import { createRouter, createWebHistory } from "vue-router";
import Login from "@/views/auth/Login.vue";
import Register from "@/views/auth/Register.vue";
import ForgotPassword from "@/views/auth/ForgotPassword.vue";
import Profile from "@/views/auth/Profile.vue";
import VerifyIdentity from "@/views/auth/VerifyIdentity.vue";
import ResetPassword from "@/views/auth/ResetPassword.vue";

const routes = [
  { path: "/", component: Home, name: "home" },
  { path: "/login", component: Login, name: "login" },
  { path: "/register", component: Register, name: "register" },
  {
    path: "/forgot-password",
    component: ForgotPassword,
    name: "forgot-password",
  },
  { path: "/profile", component: Profile, name: "profile" },
  {
    path: "/verify-identity",
    component: VerifyIdentity,
    name: "verify-identity",
  },
  { path: "/reset-password", component: ResetPassword, name: "reset-password" },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

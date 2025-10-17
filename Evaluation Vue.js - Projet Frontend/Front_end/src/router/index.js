import { createRouter, createWebHistory } from 'vue-router';
import Register from '../component/Register.vue';
import Login from '../component/Login.vue';
import ForgotPassword from '../component/ForgotPassword.vue';

const routes = [
  { path: '/', name: 'Register', component: Register },
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },
  { path: '/forgot-password', name: 'ForgotPassword', component: ForgotPassword }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
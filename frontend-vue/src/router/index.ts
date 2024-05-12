import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '../layout/MainLayout/index.vue'
import NotFound from '../views/Home/NotFound.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: MainLayout,
      children: [
        {
          path: '',
          redirect: 'dashboard'
        },
        {
          path: 'dashboard',
          component: () => import('../views/Home/Dashboard.vue')
        },
        {
          path: '/:pathMatch',
          name: 'NotFound',
          component: NotFound
        }
      ]
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/Login/LoginView.vue')
    }
  ]
})

export default router

import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores'
import AppLayout from '@/components/AppLayout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/',
      component: AppLayout, // Rutas protegidas usan layout
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('../views/HomeView.vue'),
        },
        {
          path: 'categorias',
          name: 'categorias',
          component: () => import('../views/CategoriaView.vue'),
          meta: { requiresAdmin: true },
        },
        {
          path: 'servicios',
          name: 'servicios',
          component: () => import('../views/ServicioView.vue'),
        },
        {
          path: 'clientes',
          name: 'clientes',
          component: () => import('../views/ClienteView.vue'),
        },
        {
          path: 'llantas',
          name: 'llantas',
          component: () => import('../views/LlantaView.vue'),
        },
        {
          path: 'inventario',
          name: 'inventario',
          component: () => import('../views/LlantaView.vue'),
          meta: { requiresAdmin: true },
        },
        {
          path: 'ventas',
          name: 'ventas',
          component: () => import('../views/VentaView.vue'),
        },
        {
          path: 'ventas',
          name: 'ventas',
          component: () => import('../views/VentaView.vue'),
        },
      ],
    },
  ],
})

// Guard autenticación
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
  const requiresAdmin = to.matched.some((record) => record.meta.requiresAdmin)

  // Seccion autenticación
  if (requiresAuth && !authStore.token) {
    next({ name: 'login' })
    return
  }

  // Sie requiere admin, sino ir a home
  if (requiresAdmin && !authStore.isAdmin) {
    next({ name: 'home' })
    return
  }

  next()
})

export default router

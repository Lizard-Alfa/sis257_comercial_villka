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
      meta: { requiresGuest: true },
    },
    {
      path: '/',
      component: AppLayout,
      meta: { requiresAuth: true },
      children: [
        { path: '', name: 'home', component: () => import('../views/HomeView.vue') },

        // RUTAS PARA TODOS (admin y empleado)
        { path: 'ventas', name: 'ventas', component: () => import('../views/VentaView.vue') },
        { path: 'llantas', name: 'llantas', component: () => import('../views/LlantaView.vue') },
        { path: 'clientes', name: 'clientes', component: () => import('../views/ClienteView.vue') },
        { path: 'servicios', name: 'servicios', component: () => import('../views/ServicioView.vue') },

        // SOLO ADMIN
        { path: 'historial-ventas', name: 'historial-ventas', component: () => import('../views/HistorialVentas.vue'), meta: { requiresAdmin: true } },
        { path: 'marcas', name: 'marcas', component: () => import('../views/MarcaView.vue'), meta: { requiresAdmin: true } },
        { path: 'compras', name: 'compras', component: () => import('../views/CompraView.vue'), meta: { requiresAdmin: true } },
        { path: 'proveedores', name: 'proveedores', component: () => import('../views/ProveedorView.vue'), meta: { requiresAdmin: true } },
      ],
    },
  ],
})

router.beforeEach((to) => {
  const authStore = useAuthStore()
  const requiresAuth = to.matched.some((r) => r.meta.requiresAuth)
  const requiresGuest = to.matched.some((r) => r.meta.requiresGuest)
  const requiresAdmin = to.matched.some((r) => r.meta.requiresAdmin)

  if (requiresAuth && !authStore.token) return { name: 'login' }
  if (requiresGuest && authStore.token) return { name: 'home' }
  if (requiresAdmin && !authStore.isAdmin) return { name: 'home' }
  return true
})

export default router

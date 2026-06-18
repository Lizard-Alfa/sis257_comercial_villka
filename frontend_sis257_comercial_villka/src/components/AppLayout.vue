<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores'
import type { MenuItem } from 'primevue/menuitem'
import Menubar from 'primevue/menubar'
import Button from 'primevue/button'
//import Badge from 'primevue/badge'

const router = useRouter()
const authStore = useAuthStore()

const menuItems = computed<MenuItem[]>(() => {
  const items: MenuItem[] = [
    {
      label: 'Dashboard',
      //icon: 'pi pi-home',
      command: () => router.push('/'),
    },
    {
      label: 'Ventas',
      icon: 'pi pi-shopping-cart',
      command: () => router.push('/ventas'),
    },
    {
      label: 'Llantas',
      icon: 'pi pi-discord',
      command: () => router.push('/llantas'),
    },
    {
      label: 'Clientes',
      icon: 'pi pi-users',
      command: () => router.push('/clientes'),
    },
  ]

  if (authStore.isAdmin) {
    items.push(
      {
        label: 'Historial Ventas',
        icon: 'pi pi-history',
        command: () => router.push('/historial-ventas'),
      },
      {
        label: 'Compras',
        icon: 'pi pi-shopping-bag',
        items: [
          { label: 'Registrar Compra', icon: 'pi pi-plus', command: () => router.push('/compras') },
          { label: 'Proveedores', icon: 'pi pi-truck', command: () => router.push('/proveedores') },
        ],
      },
      {
        label: 'Marcas',
        icon: 'pi pi-tag',
        command: () => router.push('/marcas'),
      }
    )
  }
  return items
})

const handleLogout = () => {
  authStore.logout()
}
</script>
//Parte superior
<template>
  <div class="layout-wrapper">
    <!-- Topbar estilo CarServ -->
    <div class="topbar bg-light p-2">
      <div class="container-fluid">
        <div class="row gx-0 d-none d-lg-flex">
          <div class="col-lg-7 px-5 text-start">
            <div class="h-100 d-inline-flex align-items-center py-2 me-4">
              <i class="pi pi-map-marker text-primary me-2"></i>
              <small>Comercial Vill-K, Uyuni - Bolivia</small>
            </div>
            <div class="h-100 d-inline-flex align-items-center py-2">
              <i class="pi pi-clock text-primary me-2"></i>
              <small>Lun - Vie : 09:00 - 19:00</small>
            </div>
          </div>
          <div class="col-lg-5 px-5 text-end">
            <div class="h-100 d-inline-flex align-items-center py-2 me-4">
              <i class="pi pi-phone text-primary me-2"></i>
              <small>+591 72422803</small>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Navbar / La barra de navegacion -->
    <nav class="navbar navbar-expand-lg bg-white navbar-light shadow sticky-top p-0">
      <div class="container-fluid px-4">
        <a href="#" class="navbar-brand d-flex align-items-center">
          <h2 class="m-0 text-primary">
            <i class="pi pi-car me-3"></i>Vill-K
          </h2>
        </a>

        <button type="button" class="navbar-toggler me-4" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarCollapse">
          <div class="navbar-nav ms-auto p-4 p-lg-0">
            <Menubar :model="menuItems" class="border-0">
              <template #item="{ item, props, hasSubmenu }">
                <a v-ripple class="flex align-items-center p-menuitem-link" v-bind="props.action">
                  <span :class="item.icon" />
                  <span class="ml-2">{{ item.label }}</span>
                  <span v-if="hasSubmenu" class="pi pi-angle-down ml-auto" />
                </a>
              </template>
            </Menubar>
          </div>

          <div class="d-flex align-items-center gap-3">
            <div class="text-end">
              <div class="fw-semibold">{{ authStore.user }}</div>
              <Tag
                :value="authStore.isAdmin ? 'ADMIN' : 'EMPLEADO'"
                :severity="authStore.isAdmin ? 'danger' : 'success'"
                class="text-xs"
              />
            </div>
            <Button
              icon="pi pi-sign-out"
              label="Salir"
              class="p-button-danger p-button-sm"
              @click="handleLogout"
            />
          </div>
        </div>
      </div>
    </nav>

    <!-- Contenido principal -->
    <main class="layout-content">
      <RouterView />
    </main>

    <!-- Footer estilo CarServ 1ra Columna de Info -->
    <footer class="bg-dark text-light footer pt-5 mt-5">
      <div class="container py-5">
        <div class="row g-5">
          <div class="col-lg-3 col-md-6">
            <h4 class="text-light mb-4">Comercial Vill-K</h4>
            <p class="mb-2"><i class="pi pi-map-marker me-3"></i>Uyuni, Bolivia</p>
            <p class="mb-2"><i class="pi pi-phone me-3"></i>+591 72422803</p>
            <p class="mb-2"><i class="pi pi-envelope me-3"></i>info@villk.com</p>
          </div>
          <div class="col-lg-3 col-md-6">
            <h4 class="text-light mb-4">Horario</h4>
            <h6 class="text-light">Lunes - Viernes:</h6>
            <p class="mb-4">09:00 - 19:00</p>
            <h6 class="text-light">Sábado:</h6>
            <p class="mb-0">09:00 - 13:00</p>
          </div>
          <div class="col-lg-3 col-md-6">
            <h4 class="text-light mb-4">Servicios</h4>
            <a class="btn btn-link text-light" href="#">Venta de Llantas</a>
            <a class="btn btn-link text-light" href="#">Lavado</a>
            <a class="btn btn-link text-light" href="#">Alineamiento</a>
          </div>
        </div>
      </div>
      <div class="container">
       <!-- Parte inferior del Todo -->
        <div class="copyright py-4 border-top">
          <div class="row">
            <div class="col-md-6 text-center text-md-start">
              &copy; {{ new Date().getFullYear() }} Comercial Vill-K
            </div>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<!-- La barra de menus -->
<style scoped>
.layout-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.topbar {
  background: #f8f9fa !important;
}

.navbar {
  background: white !important;
}

.layout-content {
  flex: 1;
  padding: 2rem;
  background: #f8f9fa;
}

/* Colores del template CarServ */
:deep(.text-primary) {
  color: #FF6B00 !important;
}

:deep(.btn-primary) {
  background-color: #FF6B00 !important;
  border-color: #FF6B00 !important;
}

:deep(.p-button-primary) {
  background-color: #FF6B00 !important;
  border-color: #FF6B00 !important;
}

.footer {
  background: #111 !important;
}

:deep(.p-menubar .p-menuitem-link) {
  padding: 0.75rem 0.5rem;
  font-size: 0.9rem;
}

:deep(.p-menubar .p-menuitem-text) {
  font-size: 0.9rem;
}
</style>

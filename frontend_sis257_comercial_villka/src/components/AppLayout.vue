<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores'
import Menubar from 'primevue/menubar'
import Button from 'primevue/button'
import Badge from 'primevue/badge'

const router = useRouter()
const authStore = useAuthStore()

const menuItems = computed(() => {
  const items = [
    {
      label: 'Dashboard',
      icon: 'pi pi-home',
      command: () => router.push('/'),
    },
    {
      label: 'Ventas',
      icon: 'pi pi-shopping-cart',
      command: () => router.push('/ventas'),
    },
    {
      label: 'Servicios',
      icon: 'pi pi-wrench',
      items: [
        {
          label: 'Venta de Llantas',
          icon: 'pi pi-circle',
          command: () => router.push('/llantas'),
        },
        {
          label: 'Lavado de Autos',
          icon: 'pi pi-car',
          command: () => router.push('/servicios?tipo=lavado'),
        },
        {
          label: 'Alineamiento',
          icon: 'pi pi-sliders-h',
          command: () => router.push('/servicios?tipo=alineamiento'),
        },
      ],
    },
    {
      label: 'Clientes',
      icon: 'pi pi-users',
      command: () => router.push('/clientes'),
    },
  ]

  // ✅ Solo ADMIN ve estas opciones
  if (authStore.isAdmin) {
    items.push(
      {
        label: 'Inventario',
        icon: 'pi pi-box',
        command: () => router.push('/inventario'),
      },
      {
        label: 'Categorías',
        icon: 'pi pi-tags',
        command: () => router.push('/categorias'),
      },
      {
        label: 'Reportes',
        icon: 'pi pi-chart-bar',
        command: () => router.push('/reportes'),
      },
      {
        label: 'Usuarios',
        icon: 'pi pi-user',
        command: () => router.push('/usuarios'),
      }
    )
  }

  return items
})

const handleLogout = () => {
  authStore.logout()
}
</script>

<template>
  <div class="layout-wrapper">
    <!-- Menú Superior -->
    <Menubar :model="menuItems" class="layout-menubar">
      <template #start>
        <div class="flex align-items-center gap-2">
          <i class="pi pi-car text-primary text-2xl"></i>
          <span class="font-bold text-xl">Comercial Vill-K</span>
        </div>
      </template>
      <template #end>
        <div class="flex align-items-center gap-3">
          <div class="flex flex-column align-items-end">
            <span class="font-semibold">{{ authStore.user }}</span>
            <Badge
              :value="authStore.isAdmin ? 'ADMIN' : 'EMPLEADO'"
              :severity="authStore.isAdmin ? 'danger' : 'success'"
            />
          </div>
          <Button
            icon="pi pi-sign-out"
            label="Salir"
            class="p-button-danger p-button-sm"
            @click="handleLogout"
          />
        </div>
      </template>
    </Menubar>

    <!-- Contenido Principal -->
    <main class="layout-content">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.layout-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f8f9fa;
}

.layout-menubar {
  border-radius: 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.layout-content {
  flex: 1;
  padding: 1.5rem;
  overflow-x: hidden;
}
</style>

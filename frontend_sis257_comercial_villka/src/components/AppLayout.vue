<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores'
import Menubar from 'primevue/menubar'
import Button from 'primevue/button'
import Badge from 'primevue/badge'
import type { MenuItem } from 'primevue/menuitem' // ← AGREGAR

const router = useRouter()
const authStore = useAuthStore()

const menuItems = computed<MenuItem[]>(() => {  // ← TIPAR como MenuItem[]
  const items: MenuItem[] = [
    {
      label: 'Dashboard',
      icon: 'pi pi-home',
      command: () => router.push('/'),
    },
    {
      label: 'Servicios',
      icon: 'pi pi-wrench',
      items: [
        { label: 'Venta de Llantas', icon: 'pi pi-circle', command: () => router.push('/ventas') },
        { label: 'Lavado', icon: 'pi pi-car', command: () => router.push('/servicios?tipo=lavado') },
        { label: 'Alineamiento', icon: 'pi pi-sliders-h', command: () => router.push('/servicios?tipo=alineamiento') },
      ],
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
        items: [  // ← AHORA SÍ FUNCIONA
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

<template>
  <div class="layout-wrapper">
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

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import http from '@/plugins/axios'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'
import { useAuthStore } from '@/stores'

const toast = useToast()
const authStore = useAuthStore()
const ventas = ref<any[]>([])
const loading = ref(false)

interface Venta {
  id: number
  fecha: string
  cliente: { nombre_completo: string } | null
  total: number
  estado: string
  metodo_pago: string
}

const loadVentas = async () => {
  loading.value = true
  try {
    const res = await http.get<Venta[]>('/ventas')
    ventas.value = res.data
  } catch {
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar las ventas', life: 3000 })
  } finally {
    loading.value = false
  }
}

const anularVenta = async (venta: Venta) => {
  if (!confirm(`¿Está seguro de anular la venta #${venta.id}? Se regenerará el stock de los productos.`)) {
    return
  }

  try {
    await http.patch(`/ventas/${venta.id}/anular`)
    toast.add({ severity: 'success', summary: 'Éxito', detail: 'Venta anulada correctamente', life: 3000 })
    await loadVentas()
  } catch (error: any) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: error.response?.data?.message || 'No se pudo anular la venta',
      life: 3000
    })
  }
}

const formatearFecha = (fecha: string) => {
  return new Date(fecha).toLocaleString('es-BO', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(loadVentas)
</script>

<template>
  <div class="card">
    <Toast />
    <div class="flex justify-content-between align-items-center mb-4">
      <h2 class="m-0">
        <i class="pi pi-history mr-2"></i>Historial de Ventas
      </h2>
      <Button icon="pi pi-refresh" label="Actualizar" class="p-button-outlined" @click="loadVentas"
        :loading="loading" />
    </div>

    <DataTable :value="ventas" :loading="loading" tableStyle="min-width: 60rem" stripedRows :paginator="true" :rows="15"
      :rowsPerPageOptions="[10, 15, 25, 50]" sortField="fecha" :sortOrder="-1">
      <Column field="id" header="N° Venta" style="width: 80px" />
      <Column header="Fecha" style="width: 160px">
        <template #body="{ data }">
          {{ formatearFecha(data.fecha) }}
        </template>
      </Column>
      <Column header="Cliente" style="width: 200px">
        <template #body="{ data }">
          {{ data.cliente?.nombre_completo || 'Consumidor Final' }}
        </template>
      </Column>
      <Column field="metodo_pago" header="Método Pago" style="width: 120px" />
      <Column header="Total" style="width: 120px">
        <template #body="{ data }">
          <span class="font-bold">{{ data.total.toFixed(2) }} Bs.</span>
        </template>
      </Column>
      <Column header="Estado" style="width: 120px">
        <template #body="{ data }">
          <Tag :value="data.estado" :severity="data.estado === 'activa' ? 'success' : 'danger'" />
        </template>
      </Column>
      <Column header="Acciones" style="width: 120px">
        <template #body="{ data }">
          <Button v-if="authStore.isAdmin && data.estado === 'activa'" icon="pi pi-times" label="Anular"
            class="p-button-sm p-button-danger" @click="anularVenta(data)" />
          <span v-else class="text-500 text-sm">-</span>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

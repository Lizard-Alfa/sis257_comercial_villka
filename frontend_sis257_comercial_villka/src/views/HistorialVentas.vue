<script setup lang="ts">
import { ref, onMounted } from 'vue'
import http from '@/plugins/axios'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import Message from 'primevue/message'
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'
import { useAuthStore } from '@/stores'

interface Cliente {
  id: number
  nombre_completo: string
}

interface DetalleVenta {
  id: number
  tipo: string
  item_id: number
  descripcion: string
  precio_unitario: number
  cantidad: number
  subtotal: number
}

interface Venta {
  id: number
  fecha: string
  cliente: Cliente | null
  total: number
  estado: string
  detalles: DetalleVenta[]
}

const toast = useToast()
const authStore = useAuthStore()
const ventas = ref<Venta[]>([])
const loading = ref(false)
const errorMsg = ref('')

const loadVentas = async () => {
  loading.value = true
  errorMsg.value = ''
  try {
    const res = await http.get<Venta[]>('/ventas')
    ventas.value = res.data || []
  } catch (error) {
    const err = error as { response?: { data?: { message?: string } } }
    errorMsg.value = err.response?.data?.message || 'No se pudieron cargar las ventas'
    ventas.value = []
  } finally {
    loading.value = false
  }
}

const anularVenta = async (venta: Venta) => {
  if (!confirm(`¿Está seguro de anular la venta #${venta.id}? Se regenerará el stock.`)) return

  try {
    await http.patch(`/ventas/${venta.id}/anular`)
    toast.add({ severity: 'success', summary: 'Éxito', detail: 'Venta anulada', life: 3000 })
    await loadVentas()
  } catch (error) {
    const err = error as { response?: { data?: { message?: string } } }
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: err.response?.data?.message || 'No se pudo anular',
      life: 3000
    })
  }
}

const formatearFecha = (fecha: string) => {
  if (!fecha) return '-'
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
      <h2 class="m-0"><i class="pi pi-history mr-2"></i>Historial de Ventas</h2>
      <Button
        icon="pi pi-refresh"
        label="Actualizar"
        class="p-button-outlined"
        @click="loadVentas"
        :loading="loading"
      />
    </div>

    <Message v-if="errorMsg" severity="error" class="mb-3" :closable="false">
      {{ errorMsg }}
    </Message>

    <DataTable
      :value="ventas"
      :loading="loading"
      tableStyle="min-width: 60rem"
      stripedRows
      :paginator="ventas.length > 10"
      :rows="10"
      sortField="id"
      :sortOrder="-1"
      emptyMessage="No hay ventas registradas"
    >
      <Column field="id" header="N°" style="width: 80px" />
      <Column header="Fecha" style="width: 160px">
        <template #body="{ data }">{{ formatearFecha(data.fecha) }}</template>
      </Column>
      <Column header="Cliente" style="width: 200px">
        <template #body="{ data }">
          {{ data.cliente?.nombre_completo || 'Consumidor Final' }}
        </template>
      </Column>
      <Column field="estado" header="Método Pago" style="width: 120px" />
      <Column header="Total" style="width: 120px">
        <template #body="{ data }">
          <span class="font-bold">{{ Number(data.total).toFixed(2) }} Bs.</span>
        </template>
      </Column>
      <Column header="Estado" style="width: 120px">
        <template #body="{ data }">
          <Tag
            :value="data.estado === 'anulada' ? 'Anulada' : 'Activa'"
            :severity="data.estado === 'anulada' ? 'danger' : 'success'"
          />
        </template>
      </Column>
      <Column header="Acciones" style="width: 120px">
        <template #body="{ data }">
          <Button
            v-if="authStore.isAdmin && data.estado !== 'anulada'"
            icon="pi pi-times"
            label="Anular"
            class="p-button-sm p-button-danger"
            @click="anularVenta(data)"
          />
          <span v-else class="text-500 text-sm">-</span>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

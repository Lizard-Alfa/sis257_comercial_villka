<script setup lang="ts">
import { ref, onMounted } from 'vue'
import http from '@/plugins/axios'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import Dropdown from 'primevue/dropdown'
import InputNumber from 'primevue/inputnumber'
import Calendar from 'primevue/calendar'
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'

interface Proveedor {
  id: number
  nombre: string
}

interface Llanta {
  id: number
  codigo: string
  marca: { nombre: string }
  modelo: string
  medida: string
}

// DTO para crear compra
interface CompraDTO {
  fecha: string
  proveedor_id: number | null
  total: number
  detalles: Array<{ llanta_id: number; cantidad: number; precio_compra: number }>
}

interface Compra {
  id: number
  fecha: string
  proveedor: { nombre: string } | null
  total: number
  detalles: Array<{
    llanta: Llanta
    cantidad: number
    precio_compra: number
    subtotal: number
  }>
}

interface DetalleForm {
  llanta_id: number
  cantidad: number
  precio_compra: number
}

const toast = useToast()
const compras = ref<Compra[]>([])
const proveedores = ref<Proveedor[]>([])
const llantas = ref<Llanta[]>([])
const showDialog = ref(false)
const editingFecha = ref<Date>(new Date())
const editingProveedorId = ref<number | null>(null)
const detallesCompra = ref<DetalleForm[]>([])

const CompraAPI = {
  getAll: () => http.get<Compra[]>('/compras'),
  create: (data: CompraDTO) => http.post<Compra>('/compras', data),
}

const loadCompras = async () => {
  try {
    // Cargar proveedores y llantas
    const [resProveedores, resLlantas] = await Promise.all([
      http.get<Proveedor[]>('/proveedores'),
      http.get<Llanta[]>('/llantas'),
    ])
    proveedores.value = resProveedores.data
    llantas.value = resLlantas.data
  } catch {
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar proveedores/llantas', life: 3000 })
  }
  // Compras por separado
  try {
    const resCompras = await CompraAPI.getAll()
    compras.value = resCompras.data
  } catch {
    console.warn('No se pudieron cargar las compras')
    compras.value = []
  }
}

const openNew = () => {
  editingFecha.value = new Date()
  editingProveedorId.value = null
  detallesCompra.value = []
  showDialog.value = true
}

const agregarDetalle = () => {
  detallesCompra.value.push({ llanta_id: 0, cantidad: 1, precio_compra: 0 })
}

const eliminarDetalle = (index: number) => {
  detallesCompra.value.splice(index, 1)
}

const calcularTotal = () => {
  return detallesCompra.value.reduce((sum, d) => sum + (d.cantidad * d.precio_compra), 0)
}

const guardarCompra = async () => {
  try {
    const dataToSend: CompraDTO = {
      fecha: editingFecha.value.toISOString(),
      proveedor_id: editingProveedorId.value,
      total: calcularTotal(),
      detalles: detallesCompra.value,
    }
    await CompraAPI.create(dataToSend)
    toast.add({ severity: 'success', summary: 'Éxito', detail: 'Compra registrada', life: 3000 })
    showDialog.value = false
    await loadCompras()
  } catch {
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo guardar', life: 3000 })
  }
}

const formatearFecha = (fecha: string) => {
  return new Date(fecha).toLocaleDateString('es-BO')
}

onMounted(loadCompras)
</script>

<template>
  <div class="card">
    <Toast />
    <div class="flex justify-content-between align-items-center mb-4">
      <h2 class="m-0">Historial de Compras</h2>
      <Button label="Nueva Compra" icon="pi pi-plus" @click="openNew" class="p-button-success" />
    </div>
    <DataTable :value="compras" tableStyle="min-width: 60rem" stripedRows :paginator="true" :rows="10">
      <Column field="id" header="N°" style="width: 80px"></Column>
      <Column header="Fecha" style="width: 120px">
        <template #body="{ data }">{{ formatearFecha(data.fecha) }}</template>
      </Column>
      <Column header="Proveedor" style="width: 200px">
        <template #body="{ data }">{{ data.proveedor?.nombre || '-' }}</template>
      </Column>
      <Column header="Total" style="width: 120px">
        <template #body="{ data }">{{ data.total.toFixed(2) }} Bs.</template>
      </Column>
      <Column header="Detalle">
        <template #body="{ data }">
          <span v-if="data.detalles">{{ data.detalles.length }} productos</span>
        </template>
      </Column>
    </DataTable>

    <Dialog v-model:visible="showDialog" modal header="Registrar Compra" :style="{ width: '700px' }">
  <div class="flex flex-column gap-3">
    <div class="flex gap-3">
      <div class="flex-1 flex flex-column gap-2">
        <label>Fecha *</label>
        <Calendar v-model="editingFecha" dateFormat="dd/mm/yy" class="w-full" />
      </div>
      <div class="flex-1 flex flex-column gap-2">
        <label>Proveedor *</label>
        <Dropdown
          v-model="editingProveedorId"
          :options="proveedores"
          optionLabel="nombre"
          optionValue="id"
          placeholder="Seleccionar proveedor"
          class="w-full"
        />
      </div>
    </div>

    <div class="border-top-1 surface-border pt-3">
      <div class="flex justify-content-between align-items-center mb-2">
        <h5 class="m-0">Detalle de Productos</h5>
        <Button label="Agregar Producto" icon="pi pi-plus" @click="agregarDetalle" class="p-button-sm" />
      </div>

      <div v-for="(detalle, index) in detallesCompra" :key="index" class="flex gap-2 mb-2 align-items-end">
        <div class="flex-1">
          <label>Llanta</label>
          <Dropdown
            v-model="detalle.llanta_id"
            :options="llantas"
            optionLabel="modelo"
            optionValue="id"
            placeholder="Seleccionar llanta"
            class="w-full"
          />
        </div>
        <div style="width: 100px">
          <label>Cantidad</label>
          <InputNumber v-model="detalle.cantidad" :min="1" class="w-full" />
        </div>
        <div style="width: 120px">
          <label>Precio Compra</label>
          <InputNumber v-model="detalle.precio_compra" :min="0" mode="decimal" :minFractionDigits="2" class="w-full" />
        </div>
        <Button icon="pi pi-trash" class="p-button-danger p-button-sm" @click="eliminarDetalle(index)" />
      </div>

      <div class="flex justify-content-end mt-3">
        <h4>Total: {{ calcularTotal().toFixed(2) }} Bs.</h4>
      </div>
    </div>
  </div>
  <template #footer>
    <Button label="Cancelar" icon="pi pi-times" class="p-button-text" @click="showDialog = false" />
    <Button
      label="Guardar Compra"
      icon="pi pi-check"
      @click="guardarCompra"
      :disabled="!editingProveedorId || detallesCompra.length === 0"
    />
  </template>
</Dialog>
  </div>
</template>

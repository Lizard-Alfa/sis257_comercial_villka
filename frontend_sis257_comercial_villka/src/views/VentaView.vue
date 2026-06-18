<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { LlantasService, type Llanta } from '@/services/llantas.service'
import { ClientesService, type Cliente } from '@/services/clientes.service'
import { VentasService, type DetalleVenta } from '@/services/ventas.service'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import AutoComplete from 'primevue/autocomplete'
import Dialog from 'primevue/dialog'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'
import Dropdown from 'primevue/dropdown'
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'

const toast = useToast()
const clientes = ref<Cliente[]>([])
const clienteSeleccionado = ref<Cliente | null>(null)
const clientesSugeridos = ref<Cliente[]>([])
const showNuevoCliente = ref(false)
const nuevoCliente = ref<Partial<Cliente>>({})
const llantas = ref<Llanta[]>([])
const tabActiva = ref(0)
const itemsVenta = ref<DetalleVenta[]>([])
const metodoPago = ref('Efectivo')
const metodosPago = ['Efectivo', 'Tarjeta', 'Transferencia', 'QR']

onMounted(async () => {
  try {
    const [resLlantas, resClientes] = await Promise.all([
      LlantasService.getAll(),
      ClientesService.getAll(),
    ])
    llantas.value = resLlantas.data
    clientes.value = resClientes.data
  } catch {
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los datos', life: 3000 })
  }
})

// Mostrar últimos 3 clientes
const buscarCliente = async (event: { query: string }) => {
  const query = event.query.toLowerCase()

  if (query.length === 0) {
    // Mostrar últimos 3 clientes registrados
    clientesSugeridos.value = clientes.value.slice(-3).reverse()
    return
  }

  if (query.length < 2) {
    clientesSugeridos.value = []
    return
  }

  clientesSugeridos.value = clientes.value.filter(c =>
    c.ci_nit.toLowerCase().includes(query) ||
    c.nombre_completo.toLowerCase().includes(query)
  ).slice(0, 10)
}
//Para encontrar las llantas
const buscadorLlantas = ref('')

const llantasFiltradas = computed(() => {
  const query = buscadorLlantas.value.toLowerCase().trim()
  if (!query) return llantas.value

  return llantas.value.filter(l =>
    l.codigo?.toLowerCase().includes(query) ||
    l.marca?.nombre?.toLowerCase().includes(query) ||
    l.modelo?.toLowerCase().includes(query) ||
    l.medida?.toLowerCase().includes(query)
  )
})

const agregarLlanta = (llanta: Llanta) => {
  if (llanta.stock <= 0) {
    toast.add({ severity: 'warn', summary: 'Sin stock', life: 3000 })
    return
  }
  const existente = itemsVenta.value.find(i => i.tipo === 'llanta' && i.item_id === llanta.id)
  if (existente) {
    if (existente.cantidad < llanta.stock) {
      existente.cantidad++
      existente.subtotal = existente.cantidad * existente.precio_unitario
    } else {
      toast.add({ severity: 'warn', summary: 'Stock máximo', detail: 'No hay más unidades disponibles', life: 3000 })
    }
  } else {
    itemsVenta.value.push({
      tipo: 'llanta', item_id: llanta.id,
      descripcion: `${llanta.marca?.nombre || ''} ${llanta.modelo} ${llanta.medida}`,
      precio_unitario: llanta.precio, cantidad: 1, subtotal: llanta.precio,
    })
  }
}

const agregarServicio = (servicio: { id: number; nombre: string; precio: number }) => {
  const existente = itemsVenta.value.find(i => i.tipo === 'servicio' && i.item_id === servicio.id)
  if (existente) {
    existente.cantidad++
    existente.subtotal = existente.cantidad * existente.precio_unitario
  } else {
    itemsVenta.value.push({
      tipo: 'servicio', item_id: servicio.id, descripcion: servicio.nombre,
      precio_unitario: servicio.precio, cantidad: 1, subtotal: servicio.precio,
    })
  }
}

const eliminarItem = (index: number) => itemsVenta.value.splice(index, 1)

// Disminuir cantidad (se detiene en 1)
const disminuirCantidad = (index: number) => {
  const item = itemsVenta.value[index]
  if (item && item.cantidad > 1) {
    item.cantidad--
    item.subtotal = item.cantidad * item.precio_unitario
  } else if (item && item.cantidad === 1) {
    toast.add({
      severity: 'warn',
      summary: 'Cantidad mínima',
      detail: 'No se puede reducir más. Use el botón eliminar si desea quitar el producto.',
      life: 3000
    })
  }
}

const subtotal = computed(() => itemsVenta.value.reduce((sum, i) => sum + i.subtotal, 0))

const crearCliente = async () => {
  try {
    const res = await ClientesService.create(nuevoCliente.value)
    clienteSeleccionado.value = res.data
    clientes.value.push(res.data)
    showNuevoCliente.value = false
    nuevoCliente.value = {}
    toast.add({ severity: 'success', summary: 'Cliente creado', life: 3000 })
  } catch {
    toast.add({ severity: 'error', summary: 'Error al crear cliente', life: 3000 })
  }
}

const guardarVenta = async () => {
  if (itemsVenta.value.length === 0) {
    toast.add({ severity: 'warn', summary: 'Agrega productos', life: 3000 })
    return
  }
  try {
    await VentasService.create({
      cliente_id: clienteSeleccionado.value?.id || null,
      estado: metodoPago.value, total: subtotal.value, detalles: itemsVenta.value,
    })
    toast.add({ severity: 'success', summary: 'Venta registrada', life: 3000 })
    itemsVenta.value = []
    clienteSeleccionado.value = null
  } catch {
    toast.add({ severity: 'error', summary: 'Error al guardar venta', life: 3000 })
  }
}

const servicios = ref([
  { id: 1, nombre: 'Lavado Básico', precio: 30 },
  { id: 2, nombre: 'Lavado Completo', precio: 50 },
  { id: 3, nombre: 'Lavado Premium', precio: 80 },
  { id: 4, nombre: 'Alineamiento', precio: 100 },
  { id: 5, nombre: 'Balanceo', precio: 80 },
])
</script>

<template>
  <div class="venta-container">
    <Toast />
    <div class="venta-header">
      <h2 class="m-0"><i class="pi pi-shopping-cart mr-2"></i>Nueva Venta</h2>
      <div class="flex gap-2">
        <Button label="Cancelar" icon="pi pi-times" class="p-button-secondary" @click="$router.push('/')" />
        <Button label="Guardar Venta" icon="pi pi-check" class="p-button-success" @click="guardarVenta"
          :disabled="itemsVenta.length === 0" />
      </div>
    </div>
    <div class="venta-body">
      <div class="columna-izquierda">
        <div class="card cliente-card">
          <h5 class="mt-0 mb-3"><i class="pi pi-user mr-2"></i>Cliente</h5>
          <div class="flex gap-2 mb-3">
            <AutoComplete v-model="clienteSeleccionado" :suggestions="clientesSugeridos" @complete="buscarCliente"
              optionLabel="nombre_completo" placeholder="Buscar por CI/NIT o Nombre..." class="flex-1" dropdown />
            <Button icon="pi pi-plus" label="Nuevo" class="p-button-success" @click="showNuevoCliente = true" />
          </div>
          <div v-if="clienteSeleccionado" class="cliente-info p-3 bg-gray-100 border-round">
            <div class="font-bold">{{ clienteSeleccionado.nombre_completo }}</div>
            <div class="text-sm text-500">
              <span>CI/NIT: {{ clienteSeleccionado.ci_nit }}</span>
              <span v-if="clienteSeleccionado.telefono" class="ml-3">📞 {{ clienteSeleccionado.telefono }}</span>
            </div>
          </div>
          <div v-else class="text-500 text-center py-2">
            <i class="pi pi-info-circle mr-2"></i>Venta sin cliente (consumidor final)
          </div>
        </div>
        <div class="card productos-card">
          <TabView v-model:activeIndex="tabActiva">
            <TabPanel value="llantas">
              <template #header><span>Llantas ({{ llantasFiltradas.length }})</span></template>

              <!-- Buscador local -->
              <div class="flex gap-2 mb-2">
                <span class="p-input-icon-left flex-1">
                  <i class="pi pi-search" />
                  <InputText v-model="buscadorLlantas" placeholder="Buscar por código, marca, modelo o medida..."
                    class="w-full" />
                </span>
              </div>

              <DataTable :value="llantasFiltradas" class="p-datatable-sm" scrollable scrollHeight="350px"
                :paginator="llantasFiltradas.length > 10" :rows="10" :rowsPerPageOptions="[10, 20, 50]"
                emptyMessage="No se encontraron llantas">
                <Column field="codigo" header="Código" style="width: 100px"></Column>
                <Column header="Marca" style="width: 120px">
                  <template #body="{ data }">{{ data.marca?.nombre || '' }}</template>
                </Column>
                <Column field="modelo" header="Modelo"></Column>
                <Column field="medida" header="Medida" style="width: 120px"></Column>
                <Column header="Precio" style="width: 100px">
                  <template #body="{ data }">{{ data.precio }} Bs.</template>
                </Column>
                <Column field="stock" header="Stock" style="width: 80px">
                  <template #body="{ data }">
                    <span :class="data.stock > 0 ? 'text-green-600 font-bold' : 'text-red-600'">
                      {{ data.stock }}
                    </span>
                  </template>
                </Column>
                <Column header="" style="width: 60px">
                  <template #body="{ data }">
                    <Button icon="pi pi-plus" class="p-button-sm p-button-success" @click="agregarLlanta(data)"
                      :disabled="data.stock <= 0" />
                  </template>
                </Column>
              </DataTable>
            </TabPanel>
            <TabPanel value="servicios">
              <template #header><span>Servicios</span></template>
              <DataTable :value="servicios" class="p-datatable-sm" scrollable scrollHeight="flex">
                <Column field="nombre" header="Servicio"></Column>
                <Column header="Precio" style="width: 120px">
                  <template #body="{ data }">{{ data.precio }} Bs.</template>
                </Column>
                <Column header="" style="width: 80px">
                  <template #body="{ data }">
                    <Button icon="pi pi-plus" class="p-button-sm p-button-success" @click="agregarServicio(data)" />
                  </template>
                </Column>
              </DataTable>
            </TabPanel>
          </TabView>
        </div>
      </div>
      <div class="columna-derecha">
        <div class="card resumen-card">
          <h5 class="mt-0 mb-3"><i class="pi pi-receipt mr-2"></i>Resumen</h5>
          <div class="items-lista">
            <div v-if="itemsVenta.length === 0" class="text-center text-500 py-4">
              <i class="pi pi-shopping-bag text-4xl mb-2"></i>
              <p>No hay productos agregados</p>
            </div>
            <div v-else>
              <div v-for="(item, index) in itemsVenta" :key="index" class="item-row">
                <div class="flex-1">
                  <div class="font-semibold">{{ item.descripcion }}</div>
                  <div class="text-sm text-500">{{ item.cantidad }} x {{ item.precio_unitario }} Bs.</div>
                </div>
                <div class="text-right font-bold">{{ item.subtotal }} Bs.</div>
                <!-- Botones disminuir y eliminar -->
                <div class="flex gap-1">
                  <Button icon="pi pi-minus" class="p-button-sm p-button-rounded p-button-warning"
                    @click="disminuirCantidad(index)" v-tooltip.top="'Disminuir cantidad'" />
                  <Button icon="pi pi-times" class="p-button-sm p-button-rounded p-button-danger"
                    @click="eliminarItem(index)" v-tooltip.top="'Eliminar producto'" />
                </div>
              </div>
            </div>
          </div>
          <div class="totales mt-3 pt-3 border-top-1 surface-border">
            <div class="flex justify-content-between mb-3 text-xl">
              <span class="font-bold">TOTAL:</span>
              <span class="font-bold text-primary">{{ subtotal.toFixed(2) }} Bs.</span>
            </div>
          </div>
          <div class="mt-3">
            <label class="block mb-2 font-semibold">Método de Pago</label>
            <Dropdown v-model="metodoPago" :options="metodosPago" class="w-full" />
          </div>
        </div>
      </div>
    </div>
    <Dialog v-model:visible="showNuevoCliente" modal header="Nuevo Cliente" :style="{ width: '450px' }">
      <div class="flex flex-column gap-3">
        <div class="flex flex-column gap-2">
          <label>CI/NIT *</label>
          <InputText v-model="nuevoCliente.ci_nit" placeholder="Ej: 1234567" />
        </div>
        <div class="flex flex-column gap-2">
          <label>Nombre Completo *</label>
          <InputText v-model="nuevoCliente.nombre_completo" />
        </div>
        <div class="flex flex-column gap-2">
          <label>Teléfono *</label>
          <InputText v-model="nuevoCliente.telefono" placeholder="Ej: 70012345" />
        </div>
      </div>
      <template #footer>
        <Button label="Cancelar" icon="pi pi-times" class="p-button-text" @click="showNuevoCliente = false" />
        <Button label="Guardar y Seleccionar" icon="pi pi-check" @click="crearCliente"
          :disabled="!nuevoCliente.ci_nit || !nuevoCliente.nombre_completo" />
      </template>
    </Dialog>
  </div>
</template>

<style scoped>
.venta-container {
  height: calc(100vh - 120px);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.venta-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  margin-bottom: 1rem;
  flex-shrink: 0;
}

.venta-body {
  flex: 1;
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1rem;
  overflow: hidden;
  min-height: 0;
}

.columna-izquierda {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow: hidden;
  min-height: 0;
}

.cliente-card {
  flex-shrink: 0;
  margin: 0;
}

.productos-card {
  flex: 1;
  margin: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.productos-card :deep(.p-tabview-panels) {
  flex: 1;
  overflow: hidden;
  padding: 0;
}

.productos-card :deep(.p-tabview) {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.columna-derecha {
  overflow: hidden;
  min-height: 0;
}

.resumen-card {
  height: 100%;
  margin: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.items-lista {
  flex: 1;
  overflow-y: auto;
  padding-right: 0.5rem;
}

.item-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  border-bottom: 1px solid #eee;
}

.item-row:hover {
  background: #f8f9fa;
}

.cliente-info {
  border-left: 4px solid #4caf50;
}

@media (max-width: 992px) {
  .venta-body {
    grid-template-columns: 1fr;
    overflow-y: auto;
  }
}
</style>

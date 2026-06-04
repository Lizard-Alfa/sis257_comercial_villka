<script setup lang="ts">
import { ref, onMounted } from 'vue'
import http from '@/plugins/axios'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'

interface Servicio {
  id: number
  nombre: string
  precio: number
}

const toast = useToast()
const servicios = ref<Servicio[]>([])
const showDialog = ref(false)
const editingServicio = ref<Partial<Servicio>>({})
const isEdit = ref(false)

const ServicioAPI = {
  getAll: () => http.get<Servicio[]>('/servicios'),
  create: (data: Partial<Servicio>) => http.post<Servicio>('/servicios', data),
  update: (id: number, data: Partial<Servicio>) => http.patch<Servicio>(`/servicios/${id}`, data),
  delete: (id: number) => http.delete(`/servicios/${id}`),
}

const loadServicios = async () => {
  try {
    const res = await ServicioAPI.getAll()
    servicios.value = res.data
  } catch {
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los servicios', life: 3000 })
  }
}

const openNew = () => {
  editingServicio.value = { precio: 0 }
  isEdit.value = false
  showDialog.value = true
}

const editServicio = (servicio: Servicio) => {
  editingServicio.value = { ...servicio }
  isEdit.value = true
  showDialog.value = true
}

const deleteServicio = async (servicio: Servicio) => {
  try {
    await ServicioAPI.delete(servicio.id)
    toast.add({ severity: 'success', summary: 'Éxito', detail: 'Servicio eliminado', life: 3000 })
    await loadServicios()
  } catch {
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el servicio', life: 3000 })
  }
}

const saveServicio = async () => {
  try {
    if (isEdit.value && editingServicio.value.id) {
      await ServicioAPI.update(editingServicio.value.id, editingServicio.value)
      toast.add({ severity: 'success', summary: 'Éxito', detail: 'Servicio actualizado', life: 3000 })
    } else {
      await ServicioAPI.create(editingServicio.value)
      toast.add({ severity: 'success', summary: 'Éxito', detail: 'Servicio creado', life: 3000 })
    }
    showDialog.value = false
    await loadServicios()
  } catch {
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo guardar el servicio', life: 3000 })
  }
}

const hideDialog = () => {
  showDialog.value = false
}

onMounted(async () => {
  await loadServicios()
})
</script>

<template>
  <div class="card">
    <Toast />
    <div class="flex justify-content-between align-items-center mb-4">
      <h2 class="m-0">Servicios</h2>
      <Button label="Nuevo Servicio" icon="pi pi-plus" @click="openNew" class="p-button-success" />
    </div>

    <DataTable :value="servicios" tableStyle="min-width: 50rem" stripedRows>
      <Column field="nombre" header="Servicio"></Column>
      <Column field="precio" header="Precio">
        <template #body="slotProps">
          {{ new Intl.NumberFormat('es-BO', { style: 'currency', currency: 'BOB' }).format(slotProps.data.precio) }}
        </template>
      </Column>
      <Column header="Acciones">
        <template #body="slotProps">
          <Button icon="pi pi-pencil" class="p-button-sm p-button-warning mr-2" @click="editServicio(slotProps.data)" />
          <Button icon="pi pi-trash" class="p-button-sm p-button-danger" @click="deleteServicio(slotProps.data)" />
        </template>
      </Column>
    </DataTable>

    <Dialog v-model:visible="showDialog" modal header="Servicio" :style="{ width: '450px' }">
      <div class="flex flex-col gap-3">
        <div>
          <label for="nombre">Nombre</label>
          <InputText id="nombre" v-model="editingServicio.nombre" class="w-full" />
        </div>
        <div>
          <label for="precio">Precio</label>
          <InputNumber id="precio" v-model="editingServicio.precio" mode="currency" currency="BOB" locale="es-BO" class="w-full" />
        </div>
      </div>
      <template #footer>
        <Button label="Cancelar" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
        <Button label="Guardar" icon="pi pi-check" class="p-button-text" @click="saveServicio" />
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import http from '@/plugins/axios'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'

interface Proveedor {
  id: number
  nombre: string
  contacto: string
  telefono: string
  email: string
  direccion: string
}

const toast = useToast()
const proveedores = ref<Proveedor[]>([])
const showDialog = ref(false)
const editingProveedor = ref<Partial<Proveedor>>({})
const isEdit = ref(false)

const ProveedorAPI = {
  getAll: () => http.get<Proveedor[]>('/proveedores'),
  create: (data: Partial<Proveedor>) => http.post<Proveedor>('/proveedores', data),
  update: (id: number, data: Partial<Proveedor>) => http.patch<Proveedor>(`/proveedores/${id}`, data),
  delete: (id: number) => http.delete(`/proveedores/${id}`),
}

const loadProveedores = async () => {
  try {
    const res = await ProveedorAPI.getAll()
    proveedores.value = res.data
  } catch {
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los proveedores', life: 3000 })
  }
}

const openNew = () => {
  editingProveedor.value = {}
  isEdit.value = false
  showDialog.value = true
}

const editProveedor = (proveedor: Proveedor) => {
  editingProveedor.value = { ...proveedor }
  isEdit.value = true
  showDialog.value = true
}

const deleteProveedor = async (proveedor: Proveedor) => {
  if (confirm(`¿Está seguro de eliminar al proveedor ${proveedor.nombre}?`)) {
    try {
      await ProveedorAPI.delete(proveedor.id)
      toast.add({ severity: 'success', summary: 'Éxito', detail: 'Proveedor eliminado', life: 3000 })
      await loadProveedores()
    } catch {
      toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar', life: 3000 })
    }
  }
}

const saveProveedor = async () => {
  try {
    if (isEdit.value && editingProveedor.value.id) {
      await ProveedorAPI.update(editingProveedor.value.id, editingProveedor.value)
    } else {
      await ProveedorAPI.create(editingProveedor.value)
    }
    toast.add({ severity: 'success', summary: 'Éxito', detail: 'Proveedor guardado', life: 3000 })
    showDialog.value = false
    await loadProveedores()
  } catch {
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo guardar', life: 3000 })
  }
}

onMounted(loadProveedores)
</script>

<template>
  <div class="card">
    <Toast />
    <div class="flex justify-content-between align-items-center mb-4">
      <h2 class="m-0">Proveedores</h2>
      <Button label="Nuevo Proveedor" icon="pi pi-plus" @click="openNew" class="p-button-success" />
    </div>
    <DataTable :value="proveedores" tableStyle="min-width: 50rem" stripedRows :paginator="true" :rows="10">
      <Column field="id" header="ID" style="width: 80px"></Column>
      <Column field="nombre" header="Nombre"></Column>
      <Column field="contacto" header="Contacto"></Column>
      <Column field="telefono" header="Teléfono" style="width: 120px"></Column>
      <Column field="email" header="Email"></Column>
      <Column header="Acciones" style="width: 150px">
        <template #body="slotProps">
          <Button icon="pi pi-pencil" class="p-button-sm p-button-warning mr-2" @click="editProveedor(slotProps.data)" />
          <Button icon="pi pi-trash" class="p-button-sm p-button-danger" @click="deleteProveedor(slotProps.data)" />
        </template>
      </Column>
    </DataTable>
    <Dialog v-model:visible="showDialog" modal header="Proveedor" :style="{ width: '500px' }">
      <div class="flex flex-column gap-3">
        <div class="flex flex-column gap-2">
          <label>Nombre *</label>
          <InputText v-model="editingProveedor.nombre" placeholder="Ej: AUTOFAX, RUEMAX, etc." />
        </div>
        <div class="flex flex-column gap-2">
          <label>Contacto</label>
          <InputText v-model="editingProveedor.contacto" placeholder="Nombre del contacto" />
        </div>
        <div class="flex flex-column gap-2">
          <label>Teléfono</label>
          <InputText v-model="editingProveedor.telefono" placeholder="Ej: 70012345" />
        </div>
        <div class="flex flex-column gap-2">
          <label>Email</label>
          <InputText v-model="editingProveedor.email" placeholder="Ej: proveedor@email.com" />
        </div>
        <div class="flex flex-column gap-2">
          <label>Dirección</label>
          <InputText v-model="editingProveedor.direccion" />
        </div>
      </div>
      <template #footer>
        <Button label="Cancelar" icon="pi pi-times" class="p-button-text" @click="showDialog = false" />
        <Button label="Guardar" icon="pi pi-check" class="p-button-text" @click="saveProveedor" :disabled="!editingProveedor.nombre" />
      </template>
    </Dialog>
  </div>
</template>

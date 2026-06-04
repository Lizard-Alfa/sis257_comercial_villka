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

interface Cliente {
  id: number
  nombre: string
  email: string
  telefono: string | null
  direccion: string | null
}

const toast = useToast()
const clientes = ref<Cliente[]>([])
const showDialog = ref(false)
const editingCliente = ref<Partial<Cliente>>({})
const isEdit = ref(false)

const ClienteAPI = {
  getAll: () => http.get<Cliente[]>('/clientes'),
  create: (data: Partial<Cliente>) => http.post<Cliente>('/clientes', data),
  update: (id: number, data: Partial<Cliente>) => http.patch<Cliente>(`/clientes/${id}`, data),
  delete: (id: number) => http.delete(`/clientes/${id}`),
}

const loadClientes = async () => {
  try {
    const res = await ClienteAPI.getAll()
    clientes.value = res.data
  } catch {
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los clientes', life: 3000 })
  }
}

const openNew = () => {
  editingCliente.value = {}
  isEdit.value = false
  showDialog.value = true
}

const editCliente = (cliente: Cliente) => {
  editingCliente.value = { ...cliente }
  isEdit.value = true
  showDialog.value = true
}

const deleteCliente = async (cliente: Cliente) => {
  try {
    await ClienteAPI.delete(cliente.id)
    toast.add({ severity: 'success', summary: 'Éxito', detail: 'Cliente eliminado', life: 3000 })
    await loadClientes()
  } catch {
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el cliente', life: 3000 })
  }
}

const saveCliente = async () => {
  try {
    if (isEdit.value && editingCliente.value.id) {
      await ClienteAPI.update(editingCliente.value.id, editingCliente.value)
      toast.add({ severity: 'success', summary: 'Éxito', detail: 'Cliente actualizado', life: 3000 })
    } else {
      await ClienteAPI.create(editingCliente.value)
      toast.add({ severity: 'success', summary: 'Éxito', detail: 'Cliente creado', life: 3000 })
    }
    showDialog.value = false
    await loadClientes()
  } catch {
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo guardar el cliente', life: 3000 })
  }
}

const hideDialog = () => {
  showDialog.value = false
}

onMounted(async () => {
  await loadClientes()
})
</script>

<template>
  <div class="card">
    <Toast />
    <div class="flex justify-content-between align-items-center mb-4">
      <h2 class="m-0">Clientes</h2>
      <Button label="Nuevo Cliente" icon="pi pi-plus" @click="openNew" class="p-button-success" />
    </div>

    <DataTable :value="clientes" tableStyle="min-width: 50rem" stripedRows>
      <Column field="nombre" header="Nombre"></Column>
      <Column field="email" header="Email"></Column>
      <Column field="telefono" header="Teléfono"></Column>
      <Column field="direccion" header="Dirección"></Column>
      <Column header="Acciones">
        <template #body="slotProps">
          <Button icon="pi pi-pencil" class="p-button-sm p-button-warning mr-2" @click="editCliente(slotProps.data)" />
          <Button icon="pi pi-trash" class="p-button-sm p-button-danger" @click="deleteCliente(slotProps.data)" />
        </template>
      </Column>
    </DataTable>

    <Dialog v-model:visible="showDialog" modal header="Cliente" :style="{ width: '450px' }">
      <div class="flex flex-col gap-3">
        <div>
          <label for="nombre">Nombre</label>
          <InputText id="nombre" v-model="editingCliente.nombre" class="w-full" />
        </div>
        <div>
          <label for="email">Email</label>
          <InputText id="email" v-model="editingCliente.email" class="w-full" />
        </div>
        <div>
          <label for="telefono">Teléfono</label>
          <InputText id="telefono" v-model="editingCliente.telefono" class="w-full" />
        </div>
        <div>
          <label for="direccion">Dirección</label>
          <InputText id="direccion" v-model="editingCliente.direccion" class="w-full" />
        </div>
      </div>
      <template #footer>
        <Button label="Cancelar" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
        <Button label="Guardar" icon="pi pi-check" class="p-button-text" @click="saveCliente" />
      </template>
    </Dialog>
  </div>
</template>

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
  ci_nit: string
  nombre_completo: string
  telefono: string
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
  if (confirm(`¿Está seguro de eliminar al cliente ${cliente.nombre_completo}?`)) {
    try {
      await ClienteAPI.delete(cliente.id)
      toast.add({ severity: 'success', summary: 'Éxito', detail: 'Cliente eliminado', life: 3000 })
      await loadClientes()
    } catch {
      toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar', life: 3000 })
    }
  }
}

const saveCliente = async () => {
  try {
    if (isEdit.value && editingCliente.value.id) {
      await ClienteAPI.update(editingCliente.value.id, editingCliente.value)
    } else {
      await ClienteAPI.create(editingCliente.value)
    }
    toast.add({ severity: 'success', summary: 'Éxito', detail: 'Cliente guardado', life: 3000 })
    showDialog.value = false
    await loadClientes()
  } catch {
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo guardar', life: 3000 })
  }
}

onMounted(loadClientes)
</script>

<template>
  <div class="card">
    <Toast />
    <div class="flex justify-content-between align-items-center mb-4">
      <h2 class="m-0">Clientes</h2>
      <Button label="Nuevo Cliente" icon="pi pi-plus" @click="openNew" class="p-button-success" />
    </div>
    <DataTable :value="clientes" tableStyle="min-width: 50rem" stripedRows>
      <Column field="ci_nit" header="CI/NIT" style="width: 120px"></Column>
      <Column field="nombre_completo" header="Nombre Completo"></Column>
      <Column field="telefono" header="Teléfono" style="width: 120px"></Column>
      <Column header="Acciones">
        <template #body="slotProps">
          <Button icon="pi pi-pencil" class="p-button-sm p-button-warning mr-2" @click="editCliente(slotProps.data)" />
          <Button icon="pi pi-trash" class="p-button-sm p-button-danger" @click="deleteCliente(slotProps.data)" />
        </template>
      </Column>
    </DataTable>
    <Dialog v-model:visible="showDialog" modal header="Cliente" :style="{ width: '450px' }">
      <div class="flex flex-column gap-3">
        <div class="flex flex-column gap-2">
          <label>CI/NIT *</label>
          <InputText v-model="editingCliente.ci_nit" placeholder="Ej: 1234567" />
        </div>
        <div class="flex flex-column gap-2">
          <label>Nombre Completo *</label>
          <InputText v-model="editingCliente.nombre_completo" />
        </div>
        <div class="flex flex-column gap-2">
          <label>Teléfono *</label>
          <InputText v-model="editingCliente.telefono" placeholder="Ej: 70012345" />
        </div>
      </div>
      <template #footer>
        <Button label="Cancelar" icon="pi pi-times" class="p-button-text" @click="showDialog = false" />
        <Button label="Guardar" icon="pi pi-check" class="p-button-text" @click="saveCliente" />
      </template>
    </Dialog>
  </div>
</template>

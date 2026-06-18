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

interface Marca {
  id: number
  nombre: string
}

const toast = useToast()
const marcas = ref<Marca[]>([])
const showDialog = ref(false)
const editingMarca = ref<Partial<Marca>>({})
const isEdit = ref(false)

const MarcaAPI = {
  getAll: () => http.get<Marca[]>('/marcas'),
  create: (data: Partial<Marca>) => http.post<Marca>('/marcas', data),
  update: (id: number, data: Partial<Marca>) => http.patch<Marca>(`/marcas/${id}`, data),
  delete: (id: number) => http.delete(`/marcas/${id}`),
}

const loadMarcas = async () => {
  try {
    const res = await MarcaAPI.getAll()
    marcas.value = res.data
  } catch {
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar las marcas', life: 3000 })
  }
}

const openNew = () => {
  editingMarca.value = {}
  isEdit.value = false
  showDialog.value = true
}

const editMarca = (marca: Marca) => {
  editingMarca.value = { ...marca }
  isEdit.value = true
  showDialog.value = true
}

const deleteMarca = async (marca: Marca) => {
  if (confirm(`¿Está seguro de eliminar la marca ${marca.nombre}?`)) {
    try {
      await MarcaAPI.delete(marca.id)
      toast.add({ severity: 'success', summary: 'Éxito', detail: 'Marca eliminada', life: 3000 })
      await loadMarcas()
    } catch {
      toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar', life: 3000 })
    }
  }
}

const saveMarca = async () => {
  try {
    if (isEdit.value && editingMarca.value.id) {
      await MarcaAPI.update(editingMarca.value.id, editingMarca.value)
    } else {
      await MarcaAPI.create(editingMarca.value)
    }
    toast.add({ severity: 'success', summary: 'Éxito', detail: 'Marca guardada', life: 3000 })
    showDialog.value = false
    await loadMarcas()
  } catch {
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo guardar', life: 3000 })
  }
}

onMounted(loadMarcas)
</script>

<template>
  <div class="card">
    <Toast />
    <div class="flex justify-content-between align-items-center mb-4">
      <h2 class="m-0">Marcas</h2>
      <Button label="Nueva Marca" icon="pi pi-plus" @click="openNew" class="p-button-success" />
    </div>
    <DataTable :value="marcas" tableStyle="min-width: 30rem" stripedRows :paginator="true" :rows="10">
      <Column field="id" header="ID" style="width: 80px"></Column>
      <Column field="nombre" header="Nombre"></Column>
      <Column header="Acciones" style="width: 150px">
        <template #body="slotProps">
          <Button icon="pi pi-pencil" class="p-button-sm p-button-warning mr-2" @click="editMarca(slotProps.data)" />
          <Button icon="pi pi-trash" class="p-button-sm p-button-danger" @click="deleteMarca(slotProps.data)" />
        </template>
      </Column>
    </DataTable>
    <Dialog v-model:visible="showDialog" modal header="Marca" :style="{ width: '400px' }">
      <div class="flex flex-column gap-3">
        <div class="flex flex-column gap-2">
          <label>Nombre *</label>
          <InputText v-model="editingMarca.nombre" placeholder="Ej: DURUN, MICHELIN, etc." />
        </div>
      </div>
      <template #footer>
        <Button label="Cancelar" icon="pi pi-times" class="p-button-text" @click="showDialog = false" />
        <Button label="Guardar" icon="pi pi-check" class="p-button-text" @click="saveMarca" :disabled="!editingMarca.nombre" />
      </template>
    </Dialog>
  </div>
</template>

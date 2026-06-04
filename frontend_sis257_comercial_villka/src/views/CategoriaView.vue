<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { CategoriasService, type Categoria } from '@/services/categorias.service'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'

const toast = useToast()
const categorias = ref<Categoria[]>([])
const showDialog = ref(false)
const editingCategoria = ref<Partial<Categoria>>({})
const isEdit = ref(false)

const loadCategorias = async () => {
  try {
    const res = await CategoriasService.getAll()
    categorias.value = res.data
  } catch {
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar las categorías', life: 3000 })
  }
}

const openNew = () => {
  editingCategoria.value = {}
  isEdit.value = false
  showDialog.value = true
}

const editCategoria = (categoria: Categoria) => {
  editingCategoria.value = { ...categoria }
  isEdit.value = true
  showDialog.value = true
}

const deleteCategoria = async (categoria: Categoria) => {
  try {
    await CategoriasService.delete(categoria.id)
    toast.add({ severity: 'success', summary: 'Éxito', detail: 'Categoría eliminada', life: 3000 })
    await loadCategorias()
  } catch {
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar la categoría', life: 3000 })
  }
}

const saveCategoria = async () => {
  try {
    if (isEdit.value && editingCategoria.value.id) {
      await CategoriasService.update(editingCategoria.value.id, editingCategoria.value)
      toast.add({ severity: 'success', summary: 'Éxito', detail: 'Categoría actualizada', life: 3000 })
    } else {
      await CategoriasService.create(editingCategoria.value)
      toast.add({ severity: 'success', summary: 'Éxito', detail: 'Categoría creada', life: 3000 })
    }
    showDialog.value = false
    await loadCategorias()
  } catch {
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo guardar la categoría', life: 3000 })
  }
}

const hideDialog = () => {
  showDialog.value = false
}

onMounted(async () => {
  await loadCategorias()
})
</script>

<template>
  <div class="card">
    <Toast />
    <div class="flex justify-content-between align-items-center mb-4">
      <h2 class="m-0">Categorías</h2>
      <Button label="Nueva Categoría" icon="pi pi-plus" @click="openNew" class="p-button-success" />
    </div>

    <DataTable :value="categorias" tableStyle="min-width: 50rem" stripedRows>
      <Column field="nombre" header="Nombre"></Column>
      <Column header="Acciones">
        <template #body="slotProps">
          <Button icon="pi pi-pencil" class="p-button-sm p-button-warning mr-2" @click="editCategoria(slotProps.data)" />
          <Button icon="pi pi-trash" class="p-button-sm p-button-danger" @click="deleteCategoria(slotProps.data)" />
        </template>
      </Column>
    </DataTable>

    <Dialog v-model:visible="showDialog" modal header="Categoría" :style="{ width: '450px' }">
      <div class="flex flex-col gap-3">
        <div>
          <label for="nombre">Nombre</label>
          <InputText id="nombre" v-model="editingCategoria.nombre" class="w-full" />
        </div>
      </div>
      <template #footer>
        <Button label="Cancelar" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
        <Button label="Guardar" icon="pi pi-check" class="p-button-text" @click="saveCategoria" />
      </template>
    </Dialog>
  </div>
</template>
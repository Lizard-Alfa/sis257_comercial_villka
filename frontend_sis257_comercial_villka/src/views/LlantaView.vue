<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { LlantasService, type Llanta } from '@/services/llantas.service'
import { CategoriasService, type Categoria } from '@/services/categorias.service'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Dropdown from 'primevue/dropdown'
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'

const toast = useToast()
const llantas = ref<Llanta[]>([])
const categorias = ref<Categoria[]>([])
const showDialog = ref(false)
const editingLlanta = ref<Partial<Llanta>>({})
const isEdit = ref(false)

onMounted(async () => {
  await loadLlantas()
  await loadCategorias()
})

const loadLlantas = async () => {
  try {
    const res = await LlantasService.getAll()
    llantas.value = res.data
  } catch {
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar las llantas', life: 3000 })
  }
}

const loadCategorias = async () => {
  try {
    const res = await CategoriasService.getAll()
    categorias.value = res.data
  } catch {
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar las categorías', life: 3000 })
  }
}

const openNew = () => {
  editingLlanta.value = { stock: 0, precio: 0 }
  isEdit.value = false
  showDialog.value = true
}

const editLlanta = (llanta: Llanta) => {
  editingLlanta.value = { ...llanta }
  isEdit.value = true
  showDialog.value = true
}

const deleteLlanta = async (llanta: Llanta) => {
  try {
    await LlantasService.delete(llanta.id)
    toast.add({ severity: 'success', summary: 'Éxito', detail: 'Llanta eliminada', life: 3000 })
    await loadLlantas()
  } catch {
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar la llanta', life: 3000 })
  }
}

const saveLlanta = async () => {
  try {
    if (isEdit.value && editingLlanta.value.id) {
      await LlantasService.update(editingLlanta.value.id, editingLlanta.value)
      toast.add({ severity: 'success', summary: 'Éxito', detail: 'Llanta actualizada', life: 3000 })
    } else {
      await LlantasService.create(editingLlanta.value)
      toast.add({ severity: 'success', summary: 'Éxito', detail: 'Llanta creada', life: 3000 })
    }
    showDialog.value = false
    await loadLlantas()
  } catch {
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo guardar la llanta', life: 3000 })
  }
}

const hideDialog = () => {
  showDialog.value = false
}
</script>

<template>
  <div class="card">
    <Toast />
    <div class="flex justify-content-between align-items-center mb-4">
      <h2 class="m-0">Catálogo de Llantas</h2>
      <Button label="Nueva Llanta" icon="pi pi-plus" @click="openNew" class="p-button-success" />
    </div>

    <DataTable :value="llantas" tableStyle="min-width: 50rem" stripedRows>
      <Column field="codigo" header="Código"></Column>
      <Column field="marca" header="Marca"></Column>
      <Column field="modelo" header="Modelo"></Column>
      <Column field="medida" header="Medida"></Column>
      <Column field="precio" header="Precio">
        <template #body="slotProps">
          {{ new Intl.NumberFormat('es-BO', { style: 'currency', currency: 'BOB' }).format(slotProps.data.precio) }}
        </template>
      </Column>
      <Column field="stock" header="Stock"></Column>
      <Column field="categoria.nombre" header="Categoría"></Column>
      <Column header="Acciones">
        <template #body="slotProps">
          <Button icon="pi pi-pencil" class="p-button-sm p-button-warning mr-2" @click="editLlanta(slotProps.data)" />
          <Button icon="pi pi-trash" class="p-button-sm p-button-danger" @click="deleteLlanta(slotProps.data)" />
        </template>
      </Column>
    </DataTable>

    <Dialog v-model:visible="showDialog" modal header="Llanta" :style="{ width: '450px' }">
      <div class="flex flex-col gap-3">
        <div>
          <label for="codigo">Código</label>
          <InputText id="codigo" v-model="editingLlanta.codigo" class="w-full" />
        </div>
        <div>
          <label for="marca">Marca</label>
          <InputText id="marca" v-model="editingLlanta.marca" class="w-full" />
        </div>
        <div>
          <label for="modelo">Modelo</label>
          <InputText id="modelo" v-model="editingLlanta.modelo" class="w-full" />
        </div>
        <div>
          <label for="medida">Medida</label>
          <InputText id="medida" v-model="editingLlanta.medida" class="w-full" />
        </div>
        <div>
          <label for="precio">Precio</label>
          <InputNumber id="precio" v-model="editingLlanta.precio" mode="currency" currency="BOB" locale="es-BO" class="w-full" />
        </div>
        <div>
          <label for="stock">Stock</label>
          <InputNumber id="stock" v-model="editingLlanta.stock" class="w-full" />
        </div>
        <div>
          <label for="categoria">Categoría</label>
          <Dropdown id="categoria" v-model="editingLlanta.categoria_id" :options="categorias" optionLabel="nombre" optionValue="id" placeholder="Seleccione una categoría" class="w-full" />
        </div>
      </div>
      <template #footer>
        <Button label="Cancelar" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
        <Button label="Guardar" icon="pi pi-check" class="p-button-text" @click="saveLlanta" />
      </template>
    </Dialog>
  </div>
</template>

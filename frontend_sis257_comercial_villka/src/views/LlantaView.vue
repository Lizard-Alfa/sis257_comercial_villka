<template>
  <div class="card">
    <Toolbar class="mb-4">
      <template #start>
        <Button label="Nueva" icon="pi pi-plus" @click="openNew" />
      </template>
    </Toolbar>

    <DataTable :value="llantas" :paginator="true" :rows="10" responsiveLayout="scroll">
      <Column field="codigo" header="Código" />
      <Column header="Marca">
        <template #body="{ data }">
          {{ data.marca?.nombre || 'Sin marca' }}
        </template>
      </Column>
      <Column field="modelo" header="Modelo" />
      <Column field="medida" header="Medida" />
      <Column field="precio" header="Precio" />
      <Column field="stock" header="Stock" />
      <Column header="Acciones">
        <template #body="{ data }">
          <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="editLlanta(data)" />
          <Button icon="pi pi-trash" class="p-button-rounded p-button-warning" @click="deleteLlanta(data)" />
        </template>
      </Column>
    </DataTable>

    <Dialog v-model:visible="showDialog" modal header="Llanta" :style="{ width: '450px' }">
      <div class="flex flex-column gap-3">
        <div class="flex flex-column gap-2">
          <label>Marca *</label>
          <Dropdown v-model="form.marca_id" :options="marcas" optionLabel="nombre" optionValue="id"
            placeholder="Seleccionar marca" class="w-full" showClear />
        </div>
        <div class="flex flex-column gap-2">
          <label>Modelo *</label>
          <InputText v-model="form.modelo" />
        </div>
        <div class="flex flex-column gap-2">
          <label>Medida *</label>
          <InputText v-model="form.medida" />
        </div>
        <div class="flex flex-column gap-2">
          <label>Precio *</label>
          <InputNumber v-model="form.precio" mode="decimal" :minFractionDigits="2" class="w-full" />
        </div>
        <div class="flex flex-column gap-2">
          <label>Stock *</label>
          <InputNumber v-model="form.stock" class="w-full" />
        </div>
      </div>
      <template #footer>
        <Button label="Cancelar" icon="pi pi-times" class="p-button-text" @click="showDialog = false" />
        <Button label="Guardar" icon="pi pi-check" class="p-button-text" @click="save" />
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import Dropdown from 'primevue/dropdown';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Toolbar from 'primevue/toolbar';
import { LlantasService, type Llanta } from '@/services/llantas.service'; // Importar servicio

interface Marca {
  id: number;
  nombre: string;
}

// onMounted antes de cualquier función async
onMounted(() => {
  load();
});

const llantas = ref<Llanta[]>([]);
const marcas = ref<Marca[]>([]);
const showDialog = ref(false);
const form = ref<Partial<Llanta>>({
  marca_id: undefined,
  modelo: '',
  medida: '',
  precio: 0,
  stock: 0
});

const load = async () => {
  try {
    const [llantasRes, marcasRes] = await Promise.all([
      LlantasService.getAll(), // Usar servicio
      axios.get('http://localhost:3000/api/marcas') // URL al backend
    ]);
    llantas.value = llantasRes.data || [];
    marcas.value = marcasRes.data || [];
  } catch (error) {
    console.error('Error cargando datos:', error);
    llantas.value = [];
    marcas.value = [];
  }
};

const openNew = () => {
  form.value = {
    marca_id: undefined,
    modelo: '',
    medida: '',
    precio: 0,
    stock: 0
  };
  showDialog.value = true;
};

const editLlanta = (data: Llanta) => {
  form.value = {
    ...data,
    marca_id: data.marca?.id
  };
  showDialog.value = true;
};

const save = async () => {
  const dataToSend = {
    marca_id: form.value.marca_id,
    modelo: form.value.modelo,
    medida: form.value.medida,
    precio: form.value.precio,
    stock: form.value.stock
  };
  try {
    if (form.value.id) {
      await LlantasService.update(form.value.id, dataToSend);
    } else {
      await LlantasService.create(dataToSend);
    }
    showDialog.value = false;
    load();
  } catch (error) {
    console.error('Error guardando:', error);
  }
};

const deleteLlanta = async (data: Llanta) => {
  if (confirm('¿Eliminar?') && data.id) {
    try {
      await axios.delete(`/api/llantas/${data.id}`);
      load();
    } catch (error) {
      console.error('Error eliminando:', error);
    }
  }
};
</script>

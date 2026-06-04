<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import { useToast } from 'primevue/usetoast'

const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()

const usuario = ref('')
const clave = ref('')
const loading = ref(false)

const handleLogin = async () => {
  loading.value = true
  try {
    await authStore.login(usuario.value, clave.value)
    toast.add({ severity: 'success', summary: 'Bienvenido', detail: 'Sesión iniciada correctamente', life: 3000 })
    router.push('/llantas')
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Usuario o clave incorrectos', life: 3000 })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="flex justify-content-center align-items-center min-h-screen bg-gray-100">
    <div class="card p-5 shadow-3" style="width: 400px;">
      <Toast />
      <h2 class="text-center mb-4">Comercial Vill-K</h2>
      <div class="flex flex-column gap-3">
        <div>
          <label for="usuario" class="block mb-2">Usuario</label>
          <InputText id="usuario" v-model="usuario" class="w-full" placeholder="admin" />
        </div>
        <div>
          <label for="clave" class="block mb-2">Clave</label>
          <InputText id="clave" type="password" v-model="clave" class="w-full" placeholder="••••••" />
        </div>
        <Button
          label="Ingresar"
          icon="pi pi-sign-in"
          @click="handleLogin"
          :loading="loading"
          class="w-full mt-3"
        />
      </div>
    </div>
  </div>
</template>

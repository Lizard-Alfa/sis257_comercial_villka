<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'

const authStore = useAuthStore()
const toast = useToast()

const usuario = ref('')
const clave = ref('')
const loading = ref(false)

const handleLogin = async () => {
  loading.value = true
  try {
    await authStore.login(usuario.value, clave.value)
    toast.add({
      severity: 'success',
      summary: 'Bienvenido',
      detail: `Hola ${authStore.user}`,
      life: 3000
    })
  } catch {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Usuario o clave incorrectos',
      life: 3000
    })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login-container">
    <Toast />
    <div class="login-card">
      <div class="login-header">
        <i class="pi pi-car text-primary text-5xl"></i>
        <h2>Comercial Vill-K</h2>
        <p class="text-500">Sistema de Gestión</p>
      </div>

      <div class="flex flex-column gap-3">
        <div class="flex flex-column gap-2">
          <label for="usuario">Usuario</label>
          <InputText
            id="usuario"
            v-model="usuario"
            placeholder="admin"
            @keyup.enter="handleLogin"
          />
        </div>
        <div class="flex flex-column gap-2">
          <label for="clave">Contraseña</label>
          <InputText
            id="clave"
            type="password"
            v-model="clave"
            placeholder="••••••"
            @keyup.enter="handleLogin"
          />
        </div>
        <Button
          label="Ingresar"
          icon="pi pi-sign-in"
          @click="handleLogin"
          :loading="loading"
          class="mt-3"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-card {
  background: white;
  padding: 3rem;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 400px;
}

.login-header {
  text-align: center;
  margin-bottom: 2rem;
}

.login-header h2 {
  margin: 0.5rem 0 0.25rem;
  color: #333;
}
</style>

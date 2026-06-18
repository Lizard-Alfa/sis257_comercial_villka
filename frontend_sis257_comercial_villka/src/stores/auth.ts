import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('token'))
  const user = ref<string>(localStorage.getItem('user') || '')
  const role = ref<string>(localStorage.getItem('role') || '')

  const isAdmin = computed(() => role.value === 'admin')
  const isAuthenticated = computed(() => !!token.value)

  const login = async (usuario: string, clave: string) => {
    const { data } = await axios.post('/api/auth/login', { usuario, clave })

    token.value = data.access_token
    user.value = data.usuario
    role.value = data.rol

    localStorage.setItem('token', data.access_token)
    localStorage.setItem('user', data.usuario)
    localStorage.setItem('role', data.rol)

    axios.defaults.headers.common['Authorization'] = `Bearer ${data.access_token}`
  }

  const logout = () => {
    token.value = null
    user.value = ''
    role.value = ''
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('role')
    delete axios.defaults.headers.common['Authorization']
  }

  if (token.value) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token.value}`
  }

  return { token, user, role, isAdmin, isAuthenticated, login, logout }
})

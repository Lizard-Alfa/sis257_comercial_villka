import { defineStore } from 'pinia'
import router from '@/router'
import axios from '@/plugins/axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: localStorage.getItem('user') || '',
    token: localStorage.getItem('token') || null,
    rol: localStorage.getItem('rol') || null,
  }),
  getters: {
    isAdmin: (state) => state.rol === 'admin',
    isEmpleado: (state) => state.rol === 'empleado',
    isAuthenticated: (state) => !!state.token,
  },
  actions: {
    async login(usuario: string, clave: string) {
      const response = await axios.post('auth/login', { usuario, clave })

      this.user = response.data.usuario
      this.token = response.data.access_token
      this.rol = response.data.rol

      localStorage.setItem('user', this.user)
      localStorage.setItem('token', this.token || '')
      localStorage.setItem('rol', this.rol || '')
      //El inicio
      router.push('/')
    },
    logout() {
      localStorage.clear()
      this.user = ''
      this.token = null
      this.rol = null
      router.push('/login')
    },
  },
})

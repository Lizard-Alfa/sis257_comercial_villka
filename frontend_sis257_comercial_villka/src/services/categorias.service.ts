import http from '@/plugins/axios'

export interface Categoria {
  id: number
  nombre: string
}

export const CategoriasService = {
  getAll: () => http.get<Categoria[]>('/categorias'),
}

import http from '@/plugins/axios'

export interface Llanta {
  id: number
  codigo: string
  marca: string
  modelo: string
  medida: string
  precio: number
  stock: number
  imagen_url: string | null
  categoria_id: number
  categoria: { id: number, nombre: string }
}

export const LlantasService = {
  getAll: () => http.get<Llanta[]>('/llantas'),
  getById: (id: number) => http.get<Llanta>(`/llantas/${id}`),
  create: (data: Partial<Llanta>) => http.post<Llanta>('/llantas', data),
  update: (id: number, data: Partial<Llanta>) => http.patch<Llanta>(`/llantas/${id}`, data),
  delete: (id: number) => http.delete(`/llantas/${id}`),
}

import http from '@/plugins/axios'

export interface Marca {
  id: number
  nombre: string
}

export interface Llanta {
  id: number
  codigo: string
  marca_id: number
  marca: Marca | null
  modelo: string
  medida: string
  precio: number
  stock: number
}

export const LlantasService = {
  getAll: () => http.get<Llanta[]>('/llantas'),
  getById: (id: number) => http.get<Llanta>(`/llantas/${id}`),
  create: (data: Partial<Llanta>) => http.post<Llanta>('/llantas', data),
  update: (id: number, data: Partial<Llanta>) => http.patch<Llanta>(`/llantas/${id}`, data),
  delete: (id: number) => http.delete(`/llantas/${id}`),
}

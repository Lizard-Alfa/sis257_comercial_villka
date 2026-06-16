import axios from '@/plugins/axios'

export interface DetalleVenta {
  tipo: 'llanta' | 'servicio'
  item_id: number
  descripcion: string
  precio_unitario: number
  cantidad: number
  subtotal: number
}

export interface Venta {
  id?: number
  cliente_id: number | null
  estado: string
  total: number
  detalles: DetalleVenta[]
  fecha_creacion?: string
}

export const VentasService = {
  getAll: () => axios.get<Venta[]>('/ventas'),
  getOne: (id: number) => axios.get<Venta>(`/ventas/${id}`),
  create: (data: Venta) => axios.post<Venta>('/ventas', data),
}

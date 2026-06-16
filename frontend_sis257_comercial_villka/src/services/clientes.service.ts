import axios from '@/plugins/axios'

export interface Cliente {
  id: number;
  ci_nit: string;
  nombre_completo: string;
  telefono: string;
}

export const ClientesService = {
  getAll: () => axios.get<Cliente[]>('/clientes'),
  getOne: (id: number) => axios.get<Cliente>(`/clientes/${id}`),
  search: (query: string) => axios.get<Cliente[]>(`/clientes/buscar?q=${encodeURIComponent(query)}`),
  create: (data: Partial<Cliente>) => axios.post<Cliente>('/clientes', data),
  update: (id: number, data: Partial<Cliente>) => axios.patch<Cliente>(`/clientes/${id}`, data),
  delete: (id: number) => axios.delete(`/clientes/${id}`),
}

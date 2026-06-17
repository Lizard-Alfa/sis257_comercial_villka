import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Proveedor } from '../../proveedores/entities/proveedor.entity';
import { DetalleCompra } from '../../detalle-compras/entities/detalle-compra.entity';

@Entity('compras')
export class Compra {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column({ name: 'proveedor_id' })
  proveedor_id: number;

  @ManyToOne(() => Proveedor, (proveedor) => proveedor.compras)
  proveedor: Proveedor;

  @Column('date', { default: () => 'CURRENT_DATE' })
  fecha: Date;

  @Column('numeric', { precision: 10, scale: 2, default: 0 })
  total: number;

  @Column('varchar', { length: 20, default: 'pendiente' })
  estado: string;

  @Column('varchar', { length: 500, nullable: true })
  observaciones: string;

  @OneToMany(() => DetalleCompra, (detalle) => detalle.compra)
  detalles: DetalleCompra[];
}

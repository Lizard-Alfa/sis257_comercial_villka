import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Compra } from '../../compras/entities/compra.entity';
import { Llanta } from '../../llantas/entities/llanta.entity';

@Entity('detalle_compras')
export class DetalleCompra {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column({ name: 'compra_id' })
  compra_id: number;

  @ManyToOne(() => Compra, (compra) => compra.detalles)
  compra: Compra;

  @Column({ name: 'llanta_id' })
  llanta_id: number;

  @ManyToOne(() => Llanta)
  llanta: Llanta;

  @Column('integer', { default: 1 })
  cantidad: number;

  @Column('numeric', { precision: 10, scale: 2 })
  precio_unitario: number;

  @Column('numeric', { precision: 10, scale: 2 })
  subtotal: number;
}

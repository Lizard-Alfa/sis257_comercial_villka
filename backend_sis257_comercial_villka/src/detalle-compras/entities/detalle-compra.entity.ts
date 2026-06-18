import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Compra } from '../../compras/entities/compra.entity';
import { Llanta } from '../../llantas/entities/llanta.entity';

@Entity('detalle_compras')
export class DetalleCompra {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column({ name: 'compra_id' })
  compra_id: number;

  @ManyToOne(() => Compra, (compra) => compra.detalles, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'compra_id' })
  compra: Compra;

  @Column({ name: 'llanta_id' })
  llanta_id: number;

  @ManyToOne(() => Llanta, { eager: true })
  @JoinColumn({ name: 'llanta_id' })
  llanta: Llanta;

  @Column('int')
  cantidad: number;

  @Column('decimal', { precision: 10, scale: 2 })
  precio_compra: number;

  @Column('decimal', { precision: 10, scale: 2 })
  subtotal: number;
}

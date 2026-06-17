import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Marca } from '../../marcas/entities/marca.entity';

@Entity('llantas')
export class Llanta {
  @PrimaryGeneratedColumn('identity') id: number;
  @Column({ name: 'marca_id', nullable: true }) marca_id: number;
  @ManyToOne(() => Marca, { nullable: true }) marca: Marca;
  @Column('varchar', { length: 100 }) modelo: string;
  @Column('varchar', { length: 20 }) medida: string;
  @Column('numeric', { precision: 10, scale: 2 }) precio: number;
  @Column('integer', { default: 0 }) stock: number;
}

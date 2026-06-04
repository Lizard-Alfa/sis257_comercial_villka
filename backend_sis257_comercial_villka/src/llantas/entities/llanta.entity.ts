import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Categoria } from '../../categorias/entities/categoria.entity';

@Entity('llantas')
export class Llanta {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column('varchar', { length: 50, unique: true })
  codigo: string;

  @Column('varchar', { length: 100 })
  marca: string;

  @Column('varchar', { length: 100 })
  modelo: string;

  @Column('varchar', { length: 50 })
  medida: string;

  @Column('decimal', { precision: 10, scale: 2 })
  precio: number;

  @Column('int', { default: 0 })
  stock: number;

  @Column('varchar', { length: 255, nullable: true })
  imagen_url: string;

  @Column('int')
  categoria_id: number;

  @ManyToOne(() => Categoria, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'categoria_id' })
  categoria: Categoria;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fecha_modificacion' })
  fechaModificacion: Date;

  @DeleteDateColumn({ name: 'fecha_eliminacion' })
  fechaEliminacion: Date;
}
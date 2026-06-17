import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Marca } from '../../marcas/entities/marca.entity';

@Entity('modelos')
export class Modelo {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column('varchar', { length: 100 })
  nombre: string;

  @Column({ name: 'marca_id' })
  marca_id: number;

  @ManyToOne(() => Marca, { nullable: false })
  marca: Marca;
}

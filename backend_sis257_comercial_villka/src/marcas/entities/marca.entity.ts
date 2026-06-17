import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity('marcas')
export class Marca {
  @PrimaryGeneratedColumn('identity') id: number;
  @Column('varchar', { length: 50, unique: true }) nombre: string;
}

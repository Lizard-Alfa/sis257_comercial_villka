import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('clientes')
export class Cliente {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column('varchar', { length: 20, unique: true })
  ci_nit: string;

  @Column('varchar', { length: 100 })
  nombre_completo: string;

  @Column('varchar', { length: 15 })
  telefono: string;
}

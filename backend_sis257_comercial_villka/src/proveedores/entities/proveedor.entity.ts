import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Compra } from '../../compras/entities/compra.entity';

@Entity('proveedores')
export class Proveedor {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column('varchar', { length: 100 })
  nombre: string;

  @Column('varchar', { length: 50, nullable: true })
  ciudad: string;

  @Column('varchar', { length: 100, nullable: true })
  contacto: string;

  @Column('varchar', { length: 15, nullable: true })
  telefono: string;

  @Column('varchar', { length: 200, nullable: true })
  condiciones_pago: string;

  @OneToMany(() => Compra, (compra) => compra.proveedor)
  compras: Compra[];
}

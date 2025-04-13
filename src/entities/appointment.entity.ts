import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Elderly } from './elderly.entity';

@Entity()
export class Appointment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  specialty: string;

  @Column()
  datetime: Date;

  @Column()
  locationOrLink: string;

  @Column({ nullable: true })
  notes: string;

  @ManyToOne(() => Elderly, elderly => elderly.appointments)
  elderly: Elderly;

  @Column()
  elderlyId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

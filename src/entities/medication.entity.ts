import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Elderly } from './elderly.entity';

@Entity()
export class Medication {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('simple-json')
  times: string[]; // Armazena horários como array de strings

  @Column({ nullable: true })
  dosage: string;

  @Column({ nullable: true })
  notes: string;

  @ManyToOne(() => Elderly, elderly => elderly.medications)
  elderly: Elderly;

  @Column()
  elderlyId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

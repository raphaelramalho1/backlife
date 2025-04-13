import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Elderly } from './elderly.entity';

@Entity()
export class Reminder {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  message: string;

  @Column()
  datetime: Date;

  @Column({ default: false })
  isRecurring: boolean;

  @Column({ nullable: true })
  recurrencePattern: string;

  @ManyToOne(() => Elderly, elderly => elderly.reminders)
  elderly: Elderly;

  @Column()
  elderlyId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

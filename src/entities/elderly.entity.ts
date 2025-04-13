import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { Caregiver } from './caregiver.entity';
import { Reminder } from './reminder.entity';
import { Medication } from './medication.entity';
import { Appointment } from './appointment.entity';

@Entity()
export class Elderly {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'date' })
  birthDate: Date;

  @Column({ nullable: true })
  photo: string;

  @Column({ nullable: true })
  medicalInfo: string;

  @Column({ nullable: true })
  contactInfo: string;

  @Column()
  pin: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Caregiver, caregiver => caregiver.elderly)
  caregiver: Caregiver;

  @Column()
  caregiverId: string;

  @OneToMany(() => Reminder, reminder => reminder.elderly)
  reminders: Reminder[];

  @OneToMany(() => Medication, medication => medication.elderly)
  medications: Medication[];

  @OneToMany(() => Appointment, appointment => appointment.elderly)
  appointments: Appointment[];
}

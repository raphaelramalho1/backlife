import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { Elderly } from './elderly.entity';

@Entity()
export class ActionLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  actionType: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: true })
  completed: boolean;

  @CreateDateColumn()
  timestamp: Date;

  @ManyToOne(() => Elderly)
  elderly: Elderly;
}

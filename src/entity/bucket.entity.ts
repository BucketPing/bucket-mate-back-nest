import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Participant } from './participant.entity';

@Entity('buckets')
export class Bucket {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'owner_id' })
  ownerId: number;

  @Column('simple-array')
  categories: string[];

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column({ name: 'max_capacity' })
  maxCapacity: number;

  @Column({ name: 'progress_status' })
  progressStatus: number;

  @Column({ name: 'start_date' })
  startDate: string;

  @Column({ name: 'end_date' })
  endDate: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => Participant, (participant) => participant.bucketId)
  participant: Participant[];
}

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Participant } from './participant.entity';
import { BucketCategory } from './bucket-category.entity';

@Entity('Bucket')
export class Bucket {
  @PrimaryGeneratedColumn()
  bucketId: number; // DB 스키마와 일치하도록 id -> bucketId

  @Column()
  ownerId: number;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column()
  maxCapacity: number;

  @Column()
  progressStatus: number;

  @Column()
  startDate: string;

  @Column()
  endDate: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Participant, (participant) => participant.bucket)
  participant: Participant[];

  @OneToMany(() => BucketCategory, (category) => category.bucket)
  categories: BucketCategory[];
}

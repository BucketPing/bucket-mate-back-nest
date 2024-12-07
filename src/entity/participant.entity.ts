import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Bucket } from './bucket.entity';

@Entity('participants')
export class Participant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ name: 'bucket_id' })
  bucketId: number;

  @Column()
  nickname: string;

  @Column()
  profile: string;

  @ManyToOne(() => Bucket, (bucket) => bucket.participant)
  @JoinColumn({ name: 'bucket_id' })
  bucket: Bucket;
}

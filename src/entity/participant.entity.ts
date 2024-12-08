import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Bucket } from './bucket.entity';
import { User } from './user.entity';

@Entity('bucket_participant')
export class Participant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  bucketId: number;

  @Column()
  participantId: number;

  @ManyToOne(() => Bucket, (bucket) => bucket.participant, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'bucketId' })
  bucket: Bucket;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'participantId' })
  user: User;
}

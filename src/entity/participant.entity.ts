import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

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
}

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { UserBookmark } from './user-bookmark.entity';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  userId: number;

  @Column()
  nickname: string;

  @Column({ nullable: true })
  profile: string;

  @Column({ unique: true })
  email: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => UserBookmark, (bookmark) => bookmark.user)
  bookmarks: UserBookmark[];
}

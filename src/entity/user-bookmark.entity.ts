import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Bucket } from './bucket.entity';

@Entity('user_bookmarks')
export class UserBookmark {
  @PrimaryColumn()
  userId: number;

  @PrimaryColumn()
  bookmarkId: number;

  @ManyToOne(() => User, (user) => user.bookmarks, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Bucket)
  @JoinColumn({ name: 'bookmarkId' })
  bucket: Bucket;
}

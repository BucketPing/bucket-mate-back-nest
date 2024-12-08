import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Bucket } from './bucket.entity';

@Entity('Bucket_Category')
export class BucketCategory {
  @PrimaryGeneratedColumn()
  categoryId: number;

  @Column()
  bucketId: number;

  @Column({ type: 'tinyint' })
  categoryCode: number;

  @ManyToOne(() => Bucket, (bucket) => bucket.categories, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'bucketId' })
  bucket: Bucket;

  // 카테고리 코드에 대한 getter 메서드
  getCategoryName(): string {
    const categoryMap = {
      1: '운동',
      2: '여행',
      3: '학습',
      4: '취미',
      5: '음식',
      6: '문화',
      7: '봉사',
      8: '기타',
    };

    return categoryMap[this.categoryCode] || '기타';
  }
}

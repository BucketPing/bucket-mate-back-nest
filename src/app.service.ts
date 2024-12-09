import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Category } from './types';
import { Bucket } from './entity/bucket.entity';
import { Repository, Brackets } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BucketCategory } from './entity/bucket-category.entity';
import { User } from './entity/user.entity';
import { CreateBucketDto } from './dto/create.bucket.dto';

@Injectable()
export class AppService {
  private readonly categoryKeywords = {
    운동: ['운동', '조깅', '헬스', '요가', '등산', '수영', '러닝', '스포츠'],
    여행: ['여행', '관광', '투어', '배낭여행', '트립', '휴가', '방문'],
    학습: [
      '학습',
      '공부',
      '스터디',
      '교육',
      '강의',
      '학원',
      '시험',
      '토익',
      '코딩',
    ],
    취미: ['취미', '독서', '그림', '음악', '게임', '사진', '드로잉'],
    음식: ['음식', '요리', '베이킹', '맛집', '쿠킹', '식사', '디저트'],
    문화: ['문화', '영화', '공연', '전시', '박물관', '연극', '뮤지컬'],
    봉사: ['봉사', '도움', '나눔', '자원봉사', '돌봄', '케어'],
    기타: ['기타', '그외', '다양', '기타활동'],
  };

  private getCategoryCode(category: Category): number {
    const categoryMap = {
      운동: 1,
      여행: 2,
      학습: 3,
      취미: 4,
      음식: 5,
      문화: 6,
      봉사: 7,
      기타: 8,
    };

    return categoryMap[category] || 8; // 기본값은 기타(8)
  }

  constructor(
    @InjectRepository(Bucket)
    private bucketRepository: Repository<Bucket>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(BucketCategory)
    private bucketCategoryRepository: Repository<BucketCategory>,
  ) {}

  async search(searchTerm?: string) {
    if (!searchTerm) {
      return {
        results: [],
        total: 0,
        searchTerm: '',
      };
    }

    const searchLower = searchTerm.toLowerCase();

    const matchedCategories = Object.entries(this.categoryKeywords)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .filter(([_, keywords]) =>
        keywords.some(
          (keyword) =>
            keyword.toLowerCase().includes(searchLower) ||
            searchLower.includes(keyword.toLowerCase()),
        ),
      )
      .map(([category]) => category as Category);

    // participant로 수정 (participants -> participant)
    const query = this.bucketRepository
      .createQueryBuilder('bucket')
      .leftJoinAndSelect('bucket.participant', 'participant')
      .leftJoinAndSelect('bucket.categories', 'bucket_category')
      .where(
        new Brackets((qb) => {
          qb.where('LOWER(bucket.title) LIKE :search', {
            search: `%${searchLower}%`,
          }).orWhere('LOWER(bucket.description) LIKE :search', {
            search: `%${searchLower}%`,
          });
        }),
      );

    if (matchedCategories.length > 0) {
      query.orWhere(
        new Brackets((qb) => {
          matchedCategories.forEach((category, index) => {
            qb.orWhere('bucket_category.categoryCode = :categoryCode' + index, {
              ['categoryCode' + index]: this.getCategoryCode(category),
            });
          });
        }),
      );
    }

    const [results, total] = await query.getManyAndCount();

    return {
      results,
      total,
      searchTerm,
      matchedCategories,
    };
  }

  async getBucketList(limit: number = 5, offset: number = 0) {
    const take = Number(limit) || 5;
    const skip = Number(offset) || 0;

    try {
      const [buckets, totalCount] = await this.bucketRepository
        .createQueryBuilder('bucket')
        .leftJoinAndSelect('bucket.participant', 'participant')
        .leftJoinAndSelect('bucket.categories', 'bucket_category')
        .orderBy('bucket.createdAt', 'DESC')
        .take(take)
        .skip(skip)
        .getManyAndCount();

      // Entity의 getCategoryName 메소드를 사용
      const bucketsWithCategories = buckets.map((bucket) => ({
        ...bucket,
        categoryNames: bucket.categories.map((category) =>
          category.getCategoryName(),
        ),
      }));

      return {
        buckets: bucketsWithCategories,
        totalCount,
      };
    } catch (error) {
      throw new Error(`Failed to fetch bucket list: ${error.message}`);
    }
  }

  async getBucketListById(bucketId: number) {
    try {
      const bucket = await this.bucketRepository
        .createQueryBuilder('bucket')
        .leftJoinAndSelect('bucket.participant', 'participant')
        .leftJoinAndSelect('bucket.categories', 'bucket_category')
        // 필요한 경우 participant의 user 정보도 가져올 수 있습니다
        // .leftJoinAndSelect('participant.user', 'user')
        .where('bucket.bucketId = :bucketId', { bucketId })
        .getOne();

      if (!bucket) {
        throw new NotFoundException(`Bucket with ID ${bucketId} not found`);
      }

      // 카테고리 정보를 가공하여 반환
      const bucketWithCategories = {
        ...bucket,
        categoryNames: bucket.categories.map((category) =>
          category.getCategoryName(),
        ),
      };

      return bucketWithCategories;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Failed to fetch bucket details: ${error.message}`);
    }
  }

  async createBucket(createBucketDto: CreateBucketDto): Promise<Bucket> {
    const user = await this.userRepository.findOne({
      where: { userId: createBucketDto.userId },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    // Validate dates
    const startDate = new Date(createBucketDto.startDate);
    const endDate = new Date(createBucketDto.endDate);

    if (endDate < startDate) {
      throw new BadRequestException('End date must be after start date');
    }

    // Create new bucket
    const bucket = this.bucketRepository.create({
      ownerId: user.userId,
      title: createBucketDto.title,
      description: createBucketDto.content,
      maxCapacity: createBucketDto.maxCapacity,
      progressStatus: 0,
      startDate: createBucketDto.startDate,
      endDate: createBucketDto.endDate,
    });

    // Save bucket first
    const savedBucket = await this.bucketRepository.save(bucket);

    // Create bucket category with category code
    const bucketCategory = new BucketCategory();
    bucketCategory.bucketId = savedBucket.bucketId;
    bucketCategory.categoryCode = this.getCategoryCode(
      createBucketDto.category,
    );

    await this.bucketCategoryRepository.save(bucketCategory);

    // Return saved bucket with category
    return this.bucketRepository.findOne({
      where: { bucketId: savedBucket.bucketId },
      relations: ['categories'],
    });
  }
}

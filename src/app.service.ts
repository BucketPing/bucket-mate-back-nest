import { Injectable } from '@nestjs/common';
import { Category } from './types';
import { Bucket } from './entity/bucket.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Bucket)
    private bucketRepository: Repository<Bucket>,
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
    },
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

    // 검색어와 관련된 카테고리들 찾기
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

    // QueryBuilder를 사용하여 검색 쿼리 작성
    const query = this.bucketRepository
      .createQueryBuilder('bucket')
      .leftJoinAndSelect('bucket.participant', 'participant')
      .where(
        // 제목이나 설명에서 검색
        '(LOWER(bucket.title) LIKE :search OR LOWER(bucket.description) LIKE :search)',
        { search: `%${searchLower}%` },
      )
      .orWhere(
        // 카테고리로 검색
        'bucket.categories && :categories',
        { categories: matchedCategories },
      );

    const [results, total] = await query.getManyAndCount();

    return {
      results,
      total,
      searchTerm,
      matchedCategories,
    };
  }
}

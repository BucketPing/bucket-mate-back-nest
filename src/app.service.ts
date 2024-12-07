import { Injectable } from '@nestjs/common';
import { Category } from './types';
import { SAMPLE_DATA } from '../sample';

@Injectable()
export class AppService {
  private readonly buckets = SAMPLE_DATA;

  // 검색어와 카테고리 매핑 정보
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

  search(searchTerm?: string) {
    if (!searchTerm) {
      return {
        results: [],
        total: 0,
        searchTerm: '',
      };
    }

    // 검색어를 소문자로 변환
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

    // 검색어와 직접 매칭되는 버킷들 찾기
    const directMatches = this.buckets.filter(
      (bucket) =>
        bucket.title.toLowerCase().includes(searchLower) ||
        bucket.description.toLowerCase().includes(searchLower),
    );

    // 찾은 카테고리와 매칭되는 버킷들 찾기
    const categoryMatches = this.buckets.filter((bucket) =>
      bucket.categories.some((category) =>
        matchedCategories.includes(category),
      ),
    );

    // 결과 합치기 (중복 제거)
    const combinedResults = [
      ...new Set([...directMatches, ...categoryMatches]),
    ];

    return {
      results: combinedResults,
      total: combinedResults.length,
      searchTerm,
      matchedCategories,
    };
  }
}

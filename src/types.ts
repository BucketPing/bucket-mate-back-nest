export interface BucketParticipant {
  userId: number;
  nickname: string;
  profile: string;
}

export type Category =
  | '운동'
  | '여행'
  | '학습'
  | '취미'
  | '음식'
  | '문화'
  | '봉사'
  | '기타';

export interface Bucket {
  id: number;
  ownerId: number;
  categories: Category[];
  title: string;
  description: string;
  participant: BucketParticipant[];
  maxCapacity: number;
  progressStatus: 0 | 1 | 2;
  startDate: string;
  endDate: string;
  createdAt: string;
}

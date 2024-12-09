export interface CreateBucketDto {
  userId: number;
  category:
    | '운동'
    | '여행'
    | '학습'
    | '취미'
    | '음식'
    | '문화'
    | '봉사'
    | '기타';
  title: string;
  content: string;
  maxCapacity: number;
  startDate: string;
  endDate: string;
}

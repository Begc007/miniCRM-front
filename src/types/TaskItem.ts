export interface TaskItem {
  Name: string;
  Details?: string;
  Percent: number;
  ExpiredAt?: Date;
  CompletedAt?: Date;
  UserId: number;
}

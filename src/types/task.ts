import { PaginationMetadata } from "./pagination";

export interface TaskItem {
  Name: string;
  Details?: string;
  Percent: number;
  ExpiredAt?: Date;
  CompletedAt?: Date;
  UserId: number;
}

export interface TaskItemResponse {
  data: TaskItem[];
  pagination: PaginationMetadata;
}

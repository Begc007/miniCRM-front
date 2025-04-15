import { PaginationMetadata } from "./pagination";

export interface TaskItem {
  name: string;
  details: string;
  percent: number;
  startDate: Date;
  expiredAt: Date;
  completedAt: Date;
  targetDate: Date;
  userId: number;
  id: number;
}

export interface TaskItemForCreationDto {
  name: string;
  details: string;
  percent: number;
  startDate: Date;
  expiredAt: Date;
  completedAt: Date;
  userId: number;
}

export interface TaskItemResponse {
  data: TaskItem[];
  pagination: PaginationMetadata;
}

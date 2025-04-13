import { PaginationMetadata } from "./pagination";

export interface User {
  Id: number;
  Name: string;
  FIO?: string;
  Position?: string;
}

export interface UserResponse {
  data: User[];
  pagination: PaginationMetadata;
}

export interface TasksGroupedByUserResponse {
  userId: number;
  userName: string;
  fio: string;
  position: string;
  taskItemCount: number;
  completedPercent: number;
}

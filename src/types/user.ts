import { PaginationMetadata } from "./pagination";

export interface User {
  id: number;
  name: string;
  fio?: string;
  password: string;
  position?: string;
}

export interface UserForCreationDto {
  name: string;
  fio?: string;
  password: string;
  position: string;
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

export interface UserForUpdateDto {
  id: number;
  name: string;
  password: string;
  fio: string;
  position: string;
}

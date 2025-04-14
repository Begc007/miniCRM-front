import { ApiResponse } from "../types/common";
import { PaginationParams } from "../types/pagination";
import {
  TasksGroupedByUserResponse,
  User,
  UserForCreationDto,
  UserForUpdateDto,
  UserResponse,
} from "../types/user";
import { getQueryString } from "../utils/utils";
import { apiClient, post, put } from "./api";

export const userService = {
  getById: (id: number): Promise<ApiResponse<User>> => {
    return apiClient<User>(`user/${id}`);
  },
  getAll: (params?: PaginationParams): Promise<ApiResponse<UserResponse>> => {
    const queryString = getQueryString(params);
    return apiClient<UserResponse>(`user${queryString}`);
  },
  getTasksGroupedByUser: (
    params?: PaginationParams
  ): Promise<ApiResponse<TasksGroupedByUserResponse[]>> => {
    const queryString = getQueryString(params);
    return apiClient<TasksGroupedByUserResponse[]>(`user${queryString}`);
  },
  create: (dto: UserForCreationDto): Promise<ApiResponse<User>> => {
    return post<User>("user", dto);
  },
  edit: (userId: number, dto: UserForUpdateDto): Promise<ApiResponse<User>> => {
    return put<User>(`user/${userId}`, dto);
  },
};

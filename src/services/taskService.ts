import { ApiResponse } from "../types/common";
import { PaginationParams } from "../types/pagination";
import {
  TaskItem,
  TaskItemForCreationDto,
  TaskItemResponse,
} from "../types/task";
import { getQueryString } from "../utils/utils";
import { apiClient, del, post, put } from "./api";

export const taskService = {
  getById: (id: number): Promise<ApiResponse<TaskItem>> => {
    return apiClient<TaskItem>(`taskItem/${id}`);
  },
  getAll: (
    params?: PaginationParams
  ): Promise<ApiResponse<TaskItemResponse>> => {
    const queryString = getQueryString(params);
    return apiClient<TaskItemResponse>(`TaskItem${queryString}`);
  },
  getTasksByUserId: (
    userId: number,
    params?: PaginationParams
  ): Promise<ApiResponse<TaskItemResponse>> => {
    const queryString = getQueryString(params);
    return apiClient<TaskItemResponse>(`TaskItem/user/${userId}${queryString}`);
  },
  create: (data: TaskItemForCreationDto): Promise<ApiResponse<TaskItem>> => {
    return post<TaskItem>("taskItem", data);
  },
  delete: (id: number) => {
    return del<number>(`taskItem/${id}`);
  },
  update: (id: number, data: TaskItem): Promise<ApiResponse<TaskItem>> => {
    return put<TaskItem>(`taskItem/${id}`, data);
  },
};

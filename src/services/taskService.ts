import { ApiResponse } from "../types/common";
import { PaginationParams } from "../types/pagination";
import {
  TaskItem,
  TaskItemForCreationDto,
  TaskItemResponse,
} from "../types/task";
import { getQueryString } from "../utils/utils";
import { apiClient, post } from "./api";

export const taskService = {
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
};

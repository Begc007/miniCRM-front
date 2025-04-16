import { CommentDto, CommentForCreateDto } from "../types/comment";
import { ApiResponse } from "../types/common";
import { apiClient, del, post } from "./api";

export const commentService = {
  uploadFile: (
    file: File,
    taskItemId: number,
    userId: number,
    text: string
  ): Promise<ApiResponse<CommentDto>> => {
    const formData = new FormData();
    formData.append("file", file);

    return post<CommentDto>(
      `Comment/upload?taskItemId=${taskItemId}&userId=${userId}&text=${text}`,
      formData
    );
  },
  downloadFile: (commentId: number): Promise<ApiResponse<void>> => {
    return apiClient(`Comment/file/${commentId}`);
  },
  create: (data: CommentForCreateDto): Promise<ApiResponse<CommentDto>> => {
    return post<CommentDto>("Comment", data);
  },
  getByTaskId: (taskId: number): Promise<ApiResponse<CommentDto>> => {
    return apiClient(`Comment/task/${taskId}`);
  },
  delete: (id: number): Promise<ApiResponse<void>> => {
    return del<void>(`Comment/${id}`);
  },
};

export interface CommentDto {
  id: number;
  createTimestamp: Date;
  userId: number;
  text: string;
  taskItemId: number;
  fileName: string;
  filePath: string;
  contentType: string;
  size: number;
}

export interface CommentForCreateDto {
  userId: number;
  text: string;
  taskItemId: number;
  createTimestamp: Date;
  //Attachment
  fileName?: string;
  filePath?: string;
  contentType?: string;
  size?: number;
}

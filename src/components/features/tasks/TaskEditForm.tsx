import { useEffect, useState, useRef, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { TaskItem } from "../../../types/task";
import { taskService } from "../../../services/taskService";
import { CommentDto, CommentForCreateDto } from "../../../types/comment";
import { formatDate } from "../../../utils/utils";
import { commentService } from "../../../services/commentService";

const taskSchema = z.object({
  name: z.string().min(1, "Обязательно"),
  details: z.string().optional(),
  percent: z.coerce.number().min(0).max(100, "Процент должен быть от 0 до 100"),
  startDate: z.string().min(1, "Обязательно"),
  expiredAt: z.string().min(1, "Обязательно"),
  completedAt: z.string().optional(),
});

interface HistoryItem {
  timestamp: Date;
  text: string;
  commentId?: number;
  attachment?: {
    fileName: string;
    filePath: string;
  };
}

type TaskFormValues = z.infer<typeof taskSchema>;

interface TaskEditFormProps {
  taskId: number;
  onUpdate: (taskId: number, data: TaskItem) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export const TaskEditForm = ({
  taskId,
  onUpdate,
  onCancel,
  isLoading = false,
}: TaskEditFormProps) => {
  const [task, setTask] = useState<TaskItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [initialPercent, setInitialPercent] = useState(0);
  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "https://localhost:7138/api/v1/";

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
  });

  const currentPercent = watch("percent");

  const buildHistoryFromComments = useCallback(async (taskData: TaskItem) => {
    const historyItems: HistoryItem[] = [
      {
        timestamp: new Date(taskData.startDate),
        text: "задача создана",
      },
    ];

    const commentsResponse = await commentService.getByTaskId(taskData.id);
    if (commentsResponse.success && Array.isArray(commentsResponse.data)) {
      commentsResponse.data.forEach((comment: CommentDto) => {
        historyItems.push({
          timestamp: new Date(comment.createTimestamp),
          text: comment.text,
          commentId: comment.id,
          attachment: comment.fileName
            ? {
                fileName: comment.fileName,
                filePath: comment.filePath,
              }
            : undefined,
        });
      });
    }

    historyItems.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

    return historyItems;
  }, []);

  useEffect(() => {
    const fetchTaskAndComments = async () => {
      try {
        const resp = await taskService.getById(taskId);
        if (resp.success && resp.data) {
          const taskData = resp.data;
          setTask(taskData);
          setInitialPercent(taskData.percent);

          reset({
            name: taskData.name,
            details: taskData.details || "",
            percent: taskData.percent,
            startDate: new Date(taskData.startDate).toISOString().split("T")[0],
            expiredAt: new Date(taskData.expiredAt).toISOString().split("T")[0],
            completedAt: taskData.completedAt
              ? new Date(taskData.completedAt).toISOString().split("T")[0]
              : "",
          });

          const historyItems = await buildHistoryFromComments(taskData);
          setHistory(historyItems);
        }
      } catch (error) {
        console.error("Error fetching task and comments:", error);
      }
    };

    if (taskId) {
      fetchTaskAndComments();
    }
  }, [taskId, reset]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);

    if (file) {
      setCommentText(`Добавлен файл "${file.name}"`);
    }
  };

  const createComment = useCallback(
    async (text: string): Promise<boolean> => {
      if (!task) return false;

      const commentData: CommentForCreateDto = {
        userId: task.userId,
        taskItemId: taskId,
        text: text,
        createTimestamp: new Date(),
      };

      const response = await commentService.create(commentData);
      if (!response.success) {
        console.error("Failed to create comment:", response.message);
        return false;
      }
      return true;
    },
    [task, taskId]
  );

  //TODO: make this method into separate file since it is too big
  const PERCENT_CHANGE_PREFIX = "Обновлен процент выполнения";

  const handleFormSubmit = async (data: TaskFormValues) => {
    if (!task) return;

    setIsSubmitting(true);
    try {
      const isPercentChange = data.percent !== initialPercent;
      const hasUserComment = !!commentText.trim();
      const defaultPercentChangeText = `${PERCENT_CHANGE_PREFIX}, с ${initialPercent} до ${data.percent}`;

      if (selectedFile) {
        await commentService.uploadFile(
          selectedFile,
          taskId,
          task.userId,
          commentText || `Добавлен файл "${selectedFile.name}"`
        );
      } else {
        if (hasUserComment) {
          await createComment(commentText);
        }

        if (
          isPercentChange &&
          (!hasUserComment || !commentText.includes(PERCENT_CHANGE_PREFIX))
        ) {
          await createComment(defaultPercentChangeText);
        }
      }

      const taskData: TaskItem = {
        ...data,
        id: taskId,
        startDate: new Date(data.startDate),
        expiredAt: new Date(data.expiredAt),
        completedAt:
          data.completedAt && data.completedAt.trim() !== ""
            ? new Date(data.completedAt)
            : null,
        userId: task.userId,
      };

      await onUpdate(taskId, taskData);

      const updatedHistory = await buildHistoryFromComments(taskData);
      setHistory(updatedHistory);
      setCommentText("");
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Error updating task:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (
      task &&
      currentPercent !== undefined &&
      initialPercent !== currentPercent
    ) {
      const newCommentText = `Обновлен процент выполнения, с ${initialPercent} до ${currentPercent}`;
      setCommentText(newCommentText);
    }
  }, [currentPercent, initialPercent, task]);

  if (!task) {
    return <div className="p-6 text-center">Загрузка задачи...</div>;
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="w-full lg:w-2/3">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Изменение задачи
          </h2>

          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Наименование задачи <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                type="text"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.name ? "border-red-500" : "border-gray-300"
                }`}
                {...register("name")}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="details"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Описание задачи
              </label>
              <textarea
                id="details"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                {...register("details")}
              />
            </div>

            <div>
              <label
                htmlFor="startDate"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Дата старта
              </label>
              <input
                id="startDate"
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                {...register("startDate")}
                disabled
              />
            </div>

            <div>
              <label
                htmlFor="expiredAt"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Дата завершения <span className="text-red-500">*</span>
              </label>
              <input
                id="expiredAt"
                type="date"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.expiredAt ? "border-red-500" : "border-gray-300"
                }`}
                {...register("expiredAt")}
              />
              {errors.expiredAt && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.expiredAt.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="completedAt"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Дата фактического выполнения
              </label>
              <input
                id="completedAt"
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                {...register("completedAt")}
              />
            </div>

            <div>
              <label
                htmlFor="percent"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Процент выполнения <span className="text-red-500">*</span>
              </label>
              <input
                id="percent"
                type="number"
                min="0"
                max="100"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.percent ? "border-red-500" : "border-gray-300"
                }`}
                {...register("percent", { valueAsNumber: true })}
              />
              {errors.percent && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.percent.message}
                </p>
              )}
            </div>

            <div className="border-t pt-4 mt-4">
              <div className="mb-4">
                <label
                  htmlFor="comment"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Комментарий
                </label>
                <textarea
                  id="comment"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="file"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Приложить файл
                </label>
                <input
                  id="file"
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                {selectedFile && (
                  <p className="mt-1 text-sm text-blue-600">
                    Выбран файл: {selectedFile.name} (
                    {(selectedFile.size / 1024).toFixed(2)} КБ)
                  </p>
                )}
              </div>
            </div>

            <div className="pt-4 flex justify-between">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md transition-colors"
              >
                Отмена
              </button>

              <button
                type="submit"
                disabled={isSubmitting || isLoading}
                className={`bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors 
                  ${
                    isSubmitting || isLoading
                      ? "opacity-70 cursor-not-allowed"
                      : ""
                  }`}
              >
                {isSubmitting || isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Обновление...
                  </div>
                ) : (
                  "Обновить"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Right side*/}
      <div className="w-full lg:w-1/3 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          История работы с задачей
        </h2>

        <div className="space-y-3">
          {history.map((item, index) => (
            <div key={index} className="text-sm">
              <div className="text-gray-600">
                {formatDate(item.timestamp)} - {item.text}
              </div>

              {item.attachment && item.commentId && (
                <div className="mt-1 mb-2">
                  <div className="flex flex-col">
                    {item.attachment.fileName.match(
                      /\.(jpeg|jpg|gif|png)$/i
                    ) && (
                      <img
                        src={`${API_BASE_URL}Comment/file/${item.commentId}`}
                        alt={`Файл: ${item.attachment.fileName}`}
                        className="w-full max-w-[300px] rounded border border-gray-200 mb-2"
                      />
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}

          {history.length === 0 && (
            <div className="text-gray-500 italic">История пуста</div>
          )}
        </div>
      </div>
    </div>
  );
};

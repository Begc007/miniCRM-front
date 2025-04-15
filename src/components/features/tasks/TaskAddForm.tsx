import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { TaskItemForCreationDto } from "../../../types/task";

const taskSchema = z.object({
  name: z.string().min(1, "Обязательно"),
  details: z.string().optional(),
  percent: z.coerce.number().min(0).max(100, "Процент должен быть от 0 до 100"),
  startDate: z.string().min(1, "Обязательно"),
  expiredAt: z.string().min(1, "Обязательно"),
  completedAt: z.string().optional(),
});

type TaskFormValues = z.infer<typeof taskSchema>;

interface TaskAddFormProps {
  userId: number;
  onCreate: (data: TaskItemForCreationDto) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export const TaskAddForm = ({
  userId,
  onCreate,
  onCancel,
  isLoading = false,
}: TaskAddFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      name: "",
      details: "",
      percent: 0,
      startDate: new Date().toISOString().split("T")[0],
      expiredAt: new Date().toISOString().split("T")[0],
      completedAt: new Date().toISOString().split("T")[0],
    },
  });
  console.log(userId);

  const handleFormSubmit = async (data: TaskFormValues) => {
    try {
      // Transform form data to match TaskItemForCreationDto
      const taskData: TaskItemForCreationDto = {
        ...data,
        startDate: new Date(data.startDate),
        expiredAt: new Date(data.expiredAt),
        completedAt: data.completedAt ? new Date(data.completedAt) : new Date(),
        userId: userId,
      };

      await onCreate(taskData);
      reset();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        Создание новой задачи
      </h2>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Наименование <span className="text-red-500">*</span>
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
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="details"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Детали
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

        <div>
          <label
            htmlFor="startDate"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Дата старта <span className="text-red-500">*</span>
          </label>
          <input
            id="startDate"
            type="date"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.startDate ? "border-red-500" : "border-gray-300"
            }`}
            {...register("startDate")}
          />
          {errors.startDate && (
            <p className="mt-1 text-sm text-red-600">
              {errors.startDate.message}
            </p>
          )}
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
                isSubmitting || isLoading ? "opacity-70 cursor-not-allowed" : ""
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
                Создание...
              </div>
            ) : (
              "Создать"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

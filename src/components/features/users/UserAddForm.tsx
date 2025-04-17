import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { UserForCreationDto } from "../../../types/user";
import { useNavigate } from "react-router";

const userSchema = z.object({
  name: z.string().min(1, "Обязательно"),
  fio: z.string().optional(),
  password: z
    .string()
    .min(8, "Минимум 8 символов")
    .regex(/[A-Z]/, "Хотя бы одна буква в верхнем регистре")
    .regex(/[a-z]/, "Хотя бы одна буква в нижнем регистре")
    .regex(/[0-9]/, "Хотя бы одна цифра"),
  position: z.string().min(1, "Обязательно"),
});

type UserFormValues = z.infer<typeof userSchema>;

interface UserAddFormProps {
  onSubmit: (data: UserForCreationDto) => Promise<void>;
  isLoading?: boolean;
}

export const UserAddForm = ({
  onSubmit,
  isLoading = false,
}: UserAddFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      fio: "",
      password: "",
      position: "",
    },
  });

  const handleFormSubmit = async (data: UserFormValues) => {
    try {
      await onSubmit(data);
      reset();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        Создание нового пользователя
      </h2>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Имя пользователя <span className="text-red-500">*</span>
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
            htmlFor="fio"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            ФИО
          </label>
          <input
            id="fio"
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            {...register("fio")}
          />
          {errors.fio && (
            <p className="mt-1 text-sm text-red-600">{errors.fio.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Пароль <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
              {...register("password")}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <span className="text-sm">Hide</span>
              ) : (
                <span className="text-sm">Show</span>
              )}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">
              {errors.password.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="position"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Должность <span className="text-red-500">*</span>
          </label>
          <input
            id="position"
            type="text"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.position ? "border-red-500" : "border-gray-300"
            }`}
            {...register("position")}
          />
          {errors.position && (
            <p className="mt-1 text-sm text-red-600">
              {errors.position.message}
            </p>
          )}
        </div>

        <div className="flex justify-between space-x-3">
          <button
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500"
            onClick={() => navigate(`/users`)}
          >
            Отмена
          </button>
          <button
            type="submit"
            disabled={isSubmitting || isLoading}
            className={` bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors 
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

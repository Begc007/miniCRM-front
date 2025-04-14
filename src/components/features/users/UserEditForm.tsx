import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { User, UserForUpdateDto } from "../../../types/user";
import { userService } from "../../../services/userService";

const userEditSchema = z.object({
  name: z.string().min(1, "Обязательно"),
  fio: z.string().optional(),
  password: z
    .string()
    .optional()
    .refine(
      (val) => {
        // If password is provided, validate it
        if (val && val.length > 0) {
          return (
            val.length >= 8 &&
            /[A-Z]/.test(val) &&
            /[a-z]/.test(val) &&
            /[0-9]/.test(val)
          );
        }
        // If no password is provided (empty string), that's fine
        return true;
      },
      {
        message:
          "Пароль должен содержать минимум 8 символов, одну заглавную букву, одну строчную букву и одну цифру",
      }
    ),
  position: z.string().min(1, "Обязательно"),
});

type UserEditFormValues = z.infer<typeof userEditSchema>;

interface UserEditFormProps {
  id: number;
  onSubmit: (id: number, data: UserForUpdateDto) => Promise<void>;
  isLoading?: boolean;
}

export const UserEditForm = ({
  id,
  onSubmit,
  isLoading = false,
}: UserEditFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useState<User>();

  useEffect(() => {
    const fetchData = async () => {
      const resp = await userService.getById(id);
      if (resp.success) {
        setUser(resp.data);
      } else {
        console.error(resp.message); //TODO: make error component later
      }
    };
    fetchData();
  }, [id]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<UserEditFormValues>({
    resolver: zodResolver(userEditSchema),
    defaultValues: {
      name: user?.name,
      fio: user?.fio || "",
      password: "", // Empty by default for editing
      position: user?.position || "",
    },
  });

  // Reset form when user changes
  useEffect(() => {
    reset({
      name: user?.name,
      fio: user?.fio || "",
      password: "",
      position: user?.position || "",
    });
  }, [user, reset]);

  const handleFormSubmit = async (data: UserEditFormValues) => {
    try {
      // Create the update DTO with the user's ID and current data
      const updateDto: UserForUpdateDto = {
        id: id,
        name: data.name,
        // If password is empty, use the existing password (or handle this on the server)
        password: data.password || user.password,
        // Ensure fio is a string, not undefined
        fio: data.fio || "",
        position: data.position,
      };

      await onSubmit(id, updateDto);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        Редактирование пользователя
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
            Пароль{" "}
            <span className="text-gray-500">
              (оставьте пустым, чтобы не менять)
            </span>
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
              {...register("password")}
              placeholder="Введите новый пароль"
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

        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting || isLoading}
            className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors 
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
                Сохранение...
              </div>
            ) : (
              "Сохранить"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

import { useEffect, useState } from "react";
import { PaginationParams } from "../../../types/pagination";
import { userService } from "../../../services/userService";
import { TasksGroupedByUserResponse } from "../../../types/user";
import { useForm } from "react-hook-form";
import { UserTablePanel } from "./UserTablePanel";

interface UserTableProps {
  paginationParams?: PaginationParams;
}

export const UserTable = ({ paginationParams }: UserTableProps) => {
  const [tasksByUser, setTasksByUser] = useState<
    TasksGroupedByUserResponse[] | undefined
  >([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  // Watch ONLY the users array for changes
  const users = watch("users");
  // Update selected users whenever users array changes
  useEffect(() => {
    if (users) {
      const selected = users
        .filter((user: any) => user?.selected)
        .map((user: any) => user?.id)
        .filter(Boolean); // Filter out any undefined IDs
      setSelectedUsers(selected);
    }
  }, [users]);
  useEffect(() => {
    const fetchData = async () => {
      const resp = await userService.getTasksGroupedByUser(paginationParams);
      if (!resp.success) {
        console.error(`${resp.errorCode} ${resp.message}`); //TODO: make this error message. Create common component of error
      }
      setTasksByUser(resp.data);
    };
    fetchData();
  }, [paginationParams]);

  const onSubmit = (data: unknown) => {
    const data2 = data as TasksGroupedByUserResponse[];
    //TODO: submit the changes to backend
    console.log("Form submitted:", data2);

    const formData = data as {
      users: Array<{ selected?: boolean; id: string }>;
    };
    const selectedUsers = formData.users?.filter((user) => user.selected);

    if (selectedUsers && selectedUsers.length > 0) {
      console.log(
        "Selected user IDs:",
        selectedUsers.map((user) => user.id)
      );
      console.log("Number of selected rows:", selectedUsers.length);
    } else {
      console.log("No users selected");
    }
  };

  const handleAdd = () => {};
  const handleEdit = () => {};
  const handleDelete = () => {};
  const handleSearch = () => {};

  return (
    <>
      <UserTablePanel
        EditDisabled={selectedUsers.length !== 1}
        DeleteDisabled={selectedUsers.length === 0}
        TasksDisabled={selectedUsers.length !== 1}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onSearch={handleSearch}
      />
      <div className="w-full">
        <form onSubmit={handleSubmit(onSubmit)}>
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border-b text-left">#</th>
                <th className="py-2 px-4 border-b text-left">
                  Имя пользователя
                </th>
                <th className="py-2 px-4 border-b text-left">ФИО</th>
                <th className="py-2 px-4 border-b text-left">Должность</th>
                <th className="py-2 px-4 border-b text-left">Задач</th>
                <th className="py-2 px-4 border-b text-left">Выполнено</th>
                <th className="py-2 px-4 border-b text-left">Выбрать</th>
              </tr>
            </thead>
            <tbody>
              {tasksByUser &&
                tasksByUser.map((user, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-4">{user.userId}</td>
                    <td className="py-2 px-4">{user.userName}</td>
                    <td className="py-2 px-4">{user.fio}</td>
                    <td className="py-2 px-4">{user.position}</td>
                    <td className="py-2 px-4">{user.taskItemCount}</td>
                    <td className="py-2 px-4">{user.completedPercent}%</td>
                    <td className="py-2 px-4">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id={`select-user-${index}`}
                          {...register(`users[${index}].selected`)}
                          className="mr-2"
                        />
                        <input
                          type="hidden"
                          {...register(`users[${index}].id`)}
                          defaultValue={user.userId}
                        />
                        <label htmlFor={`select-user-${index}`}>Выбрать</label>
                      </div>
                    </td>
                  </tr>
                ))}
              {(!tasksByUser || tasksByUser.length === 0) && (
                <tr>
                  <td
                    colSpan={7}
                    className="py-4 px-4 text-center text-gray-500"
                  >
                    Нет пользователей с задачами
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="mt-4 flex justify-end">
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              Сохранить
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

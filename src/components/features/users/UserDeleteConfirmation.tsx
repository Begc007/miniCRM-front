import { User } from "../../../types/user";

interface UserDeleteConfirmationProps {
  users: User[];
  taskCount: number;
  isOpen: boolean;
  onConfirm: (users: User[]) => void;
  onCancel: () => void;
}
export const UserDeleteConfirmation = ({
  users,
  taskCount,
  isOpen,
  onConfirm,
  onCancel,
}: UserDeleteConfirmationProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 shadow-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Подтверждение удаления</h2>

        <p className="mb-3">
          {users.length > 1
            ? `Вы действительно хотите удалить следующих пользователей?`
            : `Вы действительно хотите удалить выбранного пользователя?`}
        </p>

        <div className="mb-6 max-h-40 overflow-y-auto">
          <ul className="list-disc pl-5">
            {users.map((user, index) => (
              <li key={index} className="mb-1">
                {user.FIO || user.Name || "Без ФИО"}
              </li>
            ))}
          </ul>

          {taskCount > 0 && (
            <p className="mt-3 text-red-600">
              Внимание: У этих пользователей имеется {taskCount} задач, которые
              также будут удалены.
            </p>
          )}
        </div>

        <div className="flex justify-end space-x-3">
          <button
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
            onClick={onCancel}
          >
            Отмена
          </button>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            onClick={() => onConfirm(users)}
          >
            Удалить
          </button>
        </div>
      </div>
    </div>
  );
};

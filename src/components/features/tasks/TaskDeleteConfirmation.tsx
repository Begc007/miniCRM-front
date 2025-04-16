import { useEffect, useState } from "react";
import { TaskItem } from "../../../types/task";
import { taskService } from "../../../services/taskService";

interface TaskDeleteConfirmationProps {
  id: number;
  onConfirm: (id: number) => Promise<void>;
  onCancel: () => void;
}

export const TaskDeleteConfirmation = ({
  id,
  onConfirm,
  onCancel,
}: TaskDeleteConfirmationProps) => {
  const [task, setTask] = useState<TaskItem>();

  useEffect(() => {
    const fetchData = async () => {
      const resp = await taskService.getById(id);
      if (resp.success) {
        setTask(resp.data);
      } else {
        console.error(resp.message); //TODO: make error component later
      }
    };
    fetchData();
  }, [id]);

  const handleConfirm = () => {
    onConfirm(id);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 shadow-lg max-w-md w-full">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Подтверждение удаления
        </h2>

        {task && (
          <div className="mb-6">
            <p className="mb-3 text-gray-700">
              Вы действительно хотите удалить задачу{" "}
              <span className="font-semibold">{task.name}</span>?
            </p>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3">
              <p className="text-yellow-700">
                <span className="font-medium">Внимание:</span> Это действие
                нельзя отменить.
              </p>
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-3">
          <button
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500"
            onClick={onCancel}
          >
            Отмена
          </button>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            onClick={handleConfirm}
          >
            Удалить
          </button>
        </div>
      </div>
    </div>
  );
};

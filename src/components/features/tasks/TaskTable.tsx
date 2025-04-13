import { useEffect, useState } from "react";
import { TaskItem } from "../../../types/task";
import { taskService } from "../../../services/taskService";
import { PaginationParams } from "../../../types/pagination";

interface TaskTableProps {
  userId: number;
  paginationParams?: PaginationParams;
}

export const TaskTable = ({ userId = 1, paginationParams }: TaskTableProps) => {
  const [taskList, setTaskList] = useState<TaskItem[] | undefined>([]);

  useEffect(() => {
    const fetchData = async () => {
      const tasks = await taskService.getTasksByUserId(
        userId,
        paginationParams
      );
      setTaskList(tasks.data?.data);
    };
    fetchData();
  }, [userId, paginationParams]);

  return (
    <ul>
      {taskList?.map((x) => (
        <li>{x.Name}</li>
      ))}
    </ul>
  );
};

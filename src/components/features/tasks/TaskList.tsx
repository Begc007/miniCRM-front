import { useEffect, useState } from "react";
import { TaskItem } from "../../../types/TaskItem";

interface TaskListProps {
  userId: number;
}
export const TaskList = ({ userId }: TaskListProps) => {
  const [taskList, setTaskList] = useState<TaskItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {};
    fetchData();
  }, []);
};

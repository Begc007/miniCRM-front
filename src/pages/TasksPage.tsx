import { useMatch } from "react-router";
import { TaskTable } from "../components/features/tasks/TaskTable";

export const TasksPage = () => {
  const isNewTask = useMatch("/tasks/new");
  const isEditTask = useMatch("/tasks/:id/edit");
  const isTaskList = useMatch("/tasks");

  if (isNewTask) {
    return <div>New Task</div>;
  }
  if (isEditTask) {
    return <div>Edit Task</div>;
  }
  if (isTaskList) {
    return (
      <div>
        <TaskTable userId={1} />
      </div>
    );
  }
};

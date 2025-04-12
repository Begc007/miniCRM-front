import { useParams, useLocation, useMatch } from "react-router";

export const TasksPage = () => {
  const params = useParams();
  const location = useLocation();
  console.log(location);
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
    return <div>Tasks List</div>;
  }
};

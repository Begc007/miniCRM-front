import { useMatch, useParams, useLocation } from "react-router";
import { UserTable } from "../components/features/users/UserTable";

export const UsersPage = () => {
  const params = useParams();
  const location = useLocation();
  const isNewUser = useMatch("/users/new");
  const isEditUser = useMatch("/users/:id/edit");
  const isUsersList = useMatch("/users");

  if (isNewUser) {
    return <div>New Task</div>;
  }
  if (isEditUser) {
    return <div>Edit Task</div>;
  }
  if (isUsersList) {
    return (
      <div>
        <UserTable />
      </div>
    );
  }
};

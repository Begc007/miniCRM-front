import { BrowserRouter, Routes, Route, Outlet } from "react-router";
import { LoginPage } from "./pages/LoginPage";
import { TasksPage } from "./pages/TasksPage";
import { UsersPage } from "./pages/UsersPage";
import { ReportsPage } from "./pages/ReportsPage";
import { MainLayout } from "./components/layout/main";

const ProtectedLayout = () => {
  // later authentication logic here
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* protected routes */}
        <Route element={<ProtectedLayout />}>
          <Route path="/login" element={<LoginPage />} />
          {/* tasks */}
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/tasks/:userId/new" element={<TasksPage />} />
          <Route path="/tasks/:id/edit" element={<TasksPage />} />
          <Route path="/tasks/:id/delete" element={<TasksPage />} />
          <Route path="/tasks/:userId" element={<TasksPage />} />

          {/* reports */}
          <Route path="/reports" element={<ReportsPage />} />
          {/* users */}
          <Route path="/users" element={<UsersPage />} />
          <Route path="/users/new" element={<UsersPage />} />
          <Route path="/users/:id/edit" element={<UsersPage />} />
          <Route path="/users/:id/delete" element={<UsersPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

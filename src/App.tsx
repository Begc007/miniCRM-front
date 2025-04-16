import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
  Navigate,
  useLocation,
} from "react-router";
import { LoginPage } from "./pages/LoginPage";
import { TasksPage } from "./pages/TasksPage";
import { UsersPage } from "./pages/UsersPage";
import { ReportsPage } from "./pages/ReportsPage";
import { MainLayout } from "./components/layout/main";
import { authService } from "./services/authService";

const ProtectedRoute = () => {
  const isAuthenticated = authService.isAuthenticated();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
};

const AuthRoute = () => {
  const isAuthenticated = authService.isAuthenticated();

  if (isAuthenticated) {
    return <Navigate to="/tasks" replace />;
  }

  return <LoginPage />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth routes */}
        <Route path="/login" element={<AuthRoute />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          {/* tasks */}
          <Route path="/" element={<Navigate to="/tasks" replace />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/tasks/:userId/new" element={<TasksPage />} />
          <Route path="/tasks/:id/edit" element={<TasksPage />} />
          <Route path="/tasks/:id/delete" element={<TasksPage />} />
          <Route path="/tasks/:userId" element={<TasksPage />} />

          {/* reports */}
          <Route path="/reports/expired-tasks" element={<ReportsPage />} />

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

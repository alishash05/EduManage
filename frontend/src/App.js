import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Link,
  useNavigate,
} from "react-router-dom";

import Login from "./pages/Login";
import PrincipalDashboard from "./pages/PrincipalDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import ManagementPage from "./pages/ManagementPage";
import ProtectedRoute from "./components/ProtectedRoute";
import ManageTeachers from "./pages/ManageTeachers";
import ManageStudents from "./pages/ManageStudents"; 
import ManageClasses from "./pages/ManageClasses";
import "./App.css";

function Navbar() {
  const navigate = useNavigate();

  let user = null;

  try {
    user = JSON.parse(localStorage.getItem("edumanage_user"));
  } catch {
    user = null;
  }

  const logout = () => {
    localStorage.removeItem("edumanage_user");
    navigate("/", { replace: true });
  };

  if (!user) return null;

  return (
    <nav className="navbar">
      <Link to="/" className="brand">
        EduManage
      </Link>

      <div className="nav-right">
        <span className="role-badge">
          {user.role}
        </span>

        <button onClick={logout} className="logout-button">
          Logout
        </button>
      </div>
    </nav>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Login />} />

        <Route
          path="/principal-dashboard"
          element={
            <ProtectedRoute allowedRoles={["principal"]}>
              <PrincipalDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/teacher-dashboard"
          element={
            <ProtectedRoute allowedRoles={["teacher"]}>
              <TeacherDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student-dashboard"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/manage-teachers"
          element={
            <ProtectedRoute allowedRoles={["principal"]}>
              <ManageTeachers />
            </ProtectedRoute>
          }
        />

        <Route
          path="/manage-students"
          element={
            <ProtectedRoute allowedRoles={["principal"]}>
              <ManageStudents />
            </ProtectedRoute>
          }
        />

        <Route
          path="/manage-classes"
          element={
            <ProtectedRoute allowedRoles={["principal"]}>
              <ManageClasses />
            </ProtectedRoute>
          }
        />

        <Route
          path="/attendance"
          element={
            <ProtectedRoute
              allowedRoles={["principal", "teacher", "student"]}
            >
              <ManagementPage
                title="Attendance Management"
                description="Manage or view attendance records."
              />
            </ProtectedRoute>
          }
        />

        <Route
          path="/marks-results"
          element={
            <ProtectedRoute
              allowedRoles={["principal", "teacher", "student"]}
            >
              <ManagementPage
                title="Marks and Results"
                description="Manage or view academic results."
              />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute
              allowedRoles={["teacher", "student"]}
            >
              <ManagementPage
                title="My Profile"
                description="View your profile information."
              />
            </ProtectedRoute>
          }
        />

        <Route
          path="/unauthorized"
          element={
            <div className="dashboard-container">
              <h1>Access Denied</h1>
              <p>You do not have permission to access this page.</p>
              <Link to="/">Return to Login</Link>
            </div>
          }
        />

        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import Auth0ProviderWithHistory from "../auth0Provider"; 

// Common Auth Components
import Login from "./component/comm/Login";
import Signup from "./component/comm/Sign-up";
import ForgotPassword from "./component/comm/ForgotPassword.jsx";
import { ResetPassword } from "./component/comm/ResetPassword.jsx";
import Welcome from "./component/comm/Welcome";

// Admin Components
import AdminSidebar from "./component/layouts/Adminsidebar";
import AddProject from "./component/admin/AddProject";
import UserManagment from "./component/admin/UserManagment";
import ProjectManagment from "./component/admin/ProjectManagment";
import TaskManagment from "./component/admin/TaskManagment";
import SysteamSettings from "./component/admin/SysteamSetting";
import Dash from "./component/admin/Dash";

// Developer Components
import DeveloperSidebar from "./component/layouts/DevloperSidebar";
import DeveloperProfile from "./component/developer/DeveloperProfile";
import Project from "./component/developer/Project"; // ✅ Shows assigned projects

// Manager Components
import ManagerSidebar from "./component/layouts/ManagerSidebar";
import ManagerProfile from "./component/manager/ManagerProfile";
import ProjectManagement from "./component/manager/ProjectManagment"; // ✅ Manager project view

// Styles
import "./assets/adminlte.css";
import "./assets/adminlte.min.css";
import "./component/comm/Login.css";

// ✅ Protected Route Component
const ProtectedRoute = ({ element }) => {
  const isAuthenticated = localStorage.getItem("token");
  return isAuthenticated ? element : <Navigate to="/login" />;
};

const App = () => {
  return (
    <Auth0ProviderWithHistory>
      <div className="app-wrapper layout-fixed sidebar-expand-lg bg-body-tertiary app-loaded sidebar-open">
        <Routes>
          {/* ✅ Public Routes */}
          <Route path="/" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* ✅ Developer Dashboard */}
          <Route path="/developer-dashboard/*" element={<ProtectedRoute element={<DeveloperSidebar />} />}>
            <Route path="profile" element={<DeveloperProfile />} />
            <Route path="projectmanagement" element={<Project />} /> {/* <-- Assigned projects */}
          </Route>

          {/* ✅ Manager Dashboard */}
          <Route path="/manager-dashboard/*" element={<ProtectedRoute element={<ManagerSidebar />} />}>
            <Route path="profile" element={<ManagerProfile />} />
            <Route path="projectmanagement" element={<ProjectManagement />} />
          </Route>

          {/* ✅ Admin Dashboard */}
          <Route path="/admin-dashboard/*" element={<ProtectedRoute element={<AdminSidebar />} />}>
            <Route index element={<Dash />} />
            <Route path="addproject" element={<AddProject />} />
            <Route path="usermanagment" element={<UserManagment />} />
            <Route path="projectmanagment" element={<ProjectManagment />} />
            <Route path="taskmanagment" element={<TaskManagment />} />
            <Route path="systeamsetting" element={<SysteamSettings />} />
          </Route>

          {/* ✅ 404 Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Auth0ProviderWithHistory>
  );
};

export default App;

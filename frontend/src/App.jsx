import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import Auth0ProviderWithHistory from "../auth0Provider"; // ✅ Ensure Auth0 Context is available

import Login from "./component/comm/Login";
import Signup from "./component/comm/Sign-up";
import AdminSidebar from "./component/layouts/Adminsidebar";
import AddProject from "./component/admin/AddProject";
import UserManagment from "./component/admin/UserManagment";
import ProjectManagment from "./component/admin/ProjectManagment";
import TaskManagment from "./component/admin/TaskManagment";
import SysteamSettings from "./component/admin/SysteamSetting";

import DeveloperSidebar from "./component/layouts/DevloperSidebar";
import DeveloperProfile from "./component/developer/DeveloperProfile";
import ManagerSidebar from "./component/layouts/ManagerSidebar";
import ManagerProfile from "./component/manager/ManagerProfile";


import "./assets/adminlte.css";
import "./assets/adminlte.min.css";
import "../src/component/comm/Login.css";
import  Dash  from "./component/admin/Dash";
import ProjectManagement from "./component/manager/ProjectManagment";
// import SystemSetings from "./component/admin/SysteamSeting";
// import SystemSettings from "./component/admin/SysteamSetting";



// ✅ Authentication Wrapper
const ProtectedRoute = ({ element }) => {
  const isAuthenticated = localStorage.getItem("token"); // ✅ Use localStorage

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  return element;
};

const App = () => {
  return (
    <Auth0ProviderWithHistory>
      <div className="app-wrapper layout-fixed sidebar-expand-lg bg-body-tertiary app-loaded sidebar-open">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Developer Dashboard */}
          <Route path="/developer-dashboard/*" element={<ProtectedRoute element={<DeveloperSidebar />} />}>
            <Route path="profile" element={<DeveloperProfile />} />
          </Route>

          {/* Protected Manager Dashboard */}
          <Route path="/manager-dashboard/*" element={<ProtectedRoute element={<ManagerSidebar />} />}>
            <Route path="profile" element={<ManagerProfile />} />
            <Route path="projectmanagement" element={<ProjectManagement />} />
          </Route>

          {/* Protected Admin Dashboard */}
          <Route path="/admin-dashboard/*" element={<ProtectedRoute element={<AdminSidebar />} />}>
          <Route path="" element={<Dash />} />
            <Route path="addproject" element={<AddProject />} />
            <Route path="usermanagment" element={<UserManagment />} />
            <Route path="projectmanagment" element={<ProjectManagment />} />
            <Route path="taskmanagment" element={<TaskManagment />} />
            <Route path="systeamsetting" element={<SysteamSettings />} />
          </Route>
        </Routes>
      </div>
    </Auth0ProviderWithHistory>
  );
};

export default App;

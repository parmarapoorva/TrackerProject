import React, { useEffect, useState } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Adminnavbar } from "./Adminnavbar"; 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faLock, faTachometerAlt, faUsers, faFolderPlus, 
  faListCheck, faChartBar, faProjectDiagram, 
  faClipboardList, faCogs, faKey, faSignOutAlt, 
  faUserCircle
} from "@fortawesome/free-solid-svg-icons";

export default function AdminSidebar() {
  const [admin, setAdmin] = useState(null);
  const navigate = useNavigate();

  // ✅ Fetch Admin Data from LocalStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));  // Extract the user object
    if (storedUser) {
      setAdmin(storedUser);  // Set the admin data
    } else {
      navigate("/login");
    }
  }, [navigate]);

  // ✅ Logout Handler
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <>
      <Adminnavbar />
      <aside className="app-sidebar bg-body-secondary shadow mt-2" data-bs-theme="light">
        {/* ✅ Admin Info */}
        <div className="sidebar-brand text-center p-3 border-bottom">
          <FontAwesomeIcon icon={faUserCircle} className="fs-2 text-info me-2" />
          <span className="fw-bold">
            {admin ? admin.name : "Admin"} {/* ✅ Display name from localStorage */}
          </span>
        </div>

        <nav className="mt-2">
          <ul className="nav sidebar-menu flex-column" role="menu">
            <li className="nav-item">
              <Link to="/admin-dashboard" className="nav-link active">
                <FontAwesomeIcon icon={faTachometerAlt} className="nav-icon" />
                <p>Dashboard</p>
              </Link>
            </li>

            <li className="nav-item">
              <Link to="/admin-dashboard/usermanagment" className="nav-link">
                <FontAwesomeIcon icon={faUsers} className="nav-icon" />
                <p>User Management</p>
              </Link>
            </li>

            <li className="nav-item">
              <Link to="/admin-dashboard/projectmanagment" className="nav-link">
                <FontAwesomeIcon icon={faFolderPlus} className="nav-icon" />
                <p>Project Management</p>
              </Link>
            </li>

            <li className="nav-item">
              <Link to="/admin-dashboard/taskmanagment" className="nav-link">
                <FontAwesomeIcon icon={faListCheck} className="nav-icon" />
                <p>Task Management</p>
              </Link>
            </li>

            <li className="nav-item">
              <Link to="/admin-dashboard/reports" className="nav-link">
                <FontAwesomeIcon icon={faChartBar} className="nav-icon" />
                <p>Performance Reports</p>
              </Link>
            </li>

            <li className="nav-item">
              <Link to="/admin-dashboard/resources" className="nav-link">
                <FontAwesomeIcon icon={faProjectDiagram} className="nav-icon" />
                <p>Resource Allocation</p>
              </Link>
            </li>

            

            <li className="nav-item">
              <Link to="/admin-dashboard/systeamsetting" className="nav-link">
                <FontAwesomeIcon icon={faCogs} className="nav-icon" />
                <p>System Settings</p>
              </Link>
            </li>

            <li className="nav-item">
              <Link to="/admin-dashboard/change-password" className="nav-link">
                <FontAwesomeIcon icon={faKey} className="nav-icon" />
                <p>Change Password</p>
              </Link>
            </li>

            {/* ✅ Logout Button */}
            <li className="nav-item">
              <button className="nav-link btn btn-link text-danger" onClick={handleLogout}>
                <FontAwesomeIcon icon={faSignOutAlt} className="nav-icon" />
                <p>Logout</p>
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      <main className="app-main">
        <Outlet />
      </main>
    </>
  );
}

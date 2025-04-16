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
    <style>{`
  .app-sidebar {
    width: 250px;
    height: 100vh;
    position: fixed;
    background-color: #1e1e2f;
    color: #ddd;
    padding-top: 10px;
    z-index: 1000;
    border-right: 1px solid #2c2c3a;
  }

  .app-sidebar .sidebar-brand {
    background-color: #27293d;
    color: #fff;
    font-size: 1.1rem;
  }

  .sidebar-menu {
    list-style: none;
    padding-left: 0;
  }

  .sidebar-menu .nav-item {
    margin: 5px 0;
  }

  .sidebar-menu .nav-link {
    display: flex;
    align-items: center;
    color: #cfd8dc;
    padding: 10px 15px;
    transition: all 0.3s ease;
    border-radius: 6px;
  }

  .sidebar-menu .nav-link:hover,
  .sidebar-menu .nav-link.active {
    background-color: #39414f;
    color: #fff;
  }

  .sidebar-menu .nav-link p {
    margin: 0;
    margin-left: 10px;
    font-size: 0.95rem;
    flex: 1;
  }

  .sidebar-menu .nav-icon {
    font-size: 1rem;
    width: 20px;
    text-align: center;
  }

  .nav-link.btn {
    text-align: left;
    width: 100%;
  }

  .app-main {
    margin-left: 0;
    padding: 20px;
    background-color: #f8f9fa;
    min-height: 100vh;
  }

  @media (max-width: 768px) {
    .app-sidebar {
      width: 100%;
      height: auto;
      position: relative;
    }
    .app-main {
      margin-left: 0;
    }
  }
`}</style>

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
              <Link to="/admin-dashboard/systeamsetting" className="nav-link">
                <FontAwesomeIcon icon={faCogs} className="nav-icon" />
                <p>System Settings</p>
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

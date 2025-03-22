import React, { useEffect, useState } from 'react';
import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { ManagerNavbar } from './MangaerNavbar';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faProjectDiagram, faKey, faSignOutAlt, faUserCircle 
} from "@fortawesome/free-solid-svg-icons";

export default function ManagerSidebar() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [manager, setManager] = useState(null);  // ✅ State for manager info

  // ✅ Fetch Manager Info from LocalStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));  // Get stored manager info
    if (storedUser) {
      setManager(storedUser);  // Set manager info
    } else {
      navigate("/login");
    }
  }, [navigate]);

  // ✅ Fetch assigned projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem("token");  // Get the token

        if (!token) {
          console.error("No token found in localStorage");
          return;
        }

        const response = await axios.get("http://localhost:9000/api/projects/assigned-projects", {
          headers: {
            Authorization: `Bearer ${token}`
          },
          withCredentials: true
        });

        setProjects(response.data.projects);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching projects:", error);
        setError("Failed to load projects.");
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // ✅ Logout handler
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <>
      <ManagerNavbar />

      <aside className="app-sidebar bg-body-secondary shadow" data-bs-theme="light">
        {/* ✅ Manager Info */}
        <div className="sidebar-brand text-center p-3 border-bottom">
          <FontAwesomeIcon icon={faUserCircle} className="fs-2 text-info me-2" />
          <span className="fw-bold">
            {manager ? manager.name : "Manager"}  {/* ✅ Display name */}
          </span>
        </div>

        <div className="overflow-auto" style={{ maxHeight: '90vh' }}>
          <nav className="mt-2">
            <ul className="nav sidebar-menu flex-column" role="menu">

              {/* ✅ Projects Section */}
              <li className="nav-item">
                <Link to="/manager-dashboard/projectmanagement" className="nav-link" activeClassName="active">
                  <FontAwesomeIcon icon={faProjectDiagram} className="nav-icon" />
                  <p>Projects</p>
                </Link>
              </li>

              {/* ✅ Display Assigned Projects */}
              <li className="nav-item">
                <div className="nav-link">
                  <FontAwesomeIcon icon={faProjectDiagram} className="nav-icon" />
                  <p>Assigned Projects</p>
                </div>

                {loading ? (
                  <p>Loading...</p>
                ) : error ? (
                  <p className="text-danger">{error}</p>
                ) : (
                  <ul className="list-group">
                    {projects.map((project) => (
                      <li key={project._id} className="list-group-item">
                        <strong>{project.name}</strong> - {project.description}
                      </li>
                    ))}
                  </ul>
                )}
              </li>

              {/* ✅ Change Password */}
              <li className="nav-item">
                <NavLink to="/change-password" className="nav-link" activeClassName="active">
                  <FontAwesomeIcon icon={faKey} className="nav-icon" />
                  <p>Change Password</p>
                </NavLink>
              </li>

              {/* ✅ Logout */}
              <li className="nav-item">
                <button onClick={handleLogout} className="nav-link btn btn-link text-danger">
                  <FontAwesomeIcon icon={faSignOutAlt} className="nav-icon" />
                  <p>Logout</p>
                </button>
              </li>

            </ul>
          </nav>
        </div>
      </aside>

      <main className="app-main">
        <Outlet />
      </main>
    </>
  );
}

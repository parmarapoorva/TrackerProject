import React, { useEffect, useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { DeveloperNavbar } from './DeveloperNavbar';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faProjectDiagram, faSignOutAlt, faUserCircle } from "@fortawesome/free-solid-svg-icons";

export default function DeveloperSidebar() {
  const navigate = useNavigate();
  const [developer, setDeveloper] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setDeveloper(storedUser);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <>
      <DeveloperNavbar />

      <aside className="app-sidebar bg-body-secondary shadow" data-bs-theme="light">
        <div className="sidebar-brand text-center p-3 border-bottom">
          <FontAwesomeIcon icon={faUserCircle} className="fs-2 text-info me-2" />
          <Link to="profile" className="fw-bold text-decoration-none text-dark">
            {developer ? developer.name : "Developer"}
          </Link>
        </div>

        <div className="overflow-auto" style={{ maxHeight: '90vh' }}>
          <nav className="mt-2">
            <ul className="nav sidebar-menu flex-column" role="menu">

              {/* ✅ Projects Section */}
              <li className="nav-item">
                <Link to="/developer-dashboard/projectmanagement" className="nav-link">
                  <FontAwesomeIcon icon={faProjectDiagram} className="nav-icon" />
                  <p>Projects</p>
                </Link>
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

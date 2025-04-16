import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

export const ManagerNavbar = () => {
  return (
    <nav className="navbar navbar-expand-lg bg-light border-bottom shadow-sm">
      <div className="container-fluid">
        {/* Sidebar Toggle */}
        <button
          className="btn btn-outline-secondary me-3"
          onClick={() => {
            document.body.classList.toggle("sidebar-collapse");
          }}
        >
          <FontAwesomeIcon icon={faBars} />
        </button>

        {/* Navbar links */}
        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
          <li className="nav-item d-none d-md-block">
            <a href="#" className="nav-link">
              Home
            </a>
          </li>
          <li className="nav-item d-none d-md-block">
            <a href="#" className="nav-link">
              Contact
            </a>
          </li>
        </ul>

        {/* Right side (future use: profile dropdown, notifications, etc.) */}
        <div className="d-flex align-items-center gap-2">
          {/* Placeholder for right-side content */}
        </div>
      </div>
    </nav>
  );
};

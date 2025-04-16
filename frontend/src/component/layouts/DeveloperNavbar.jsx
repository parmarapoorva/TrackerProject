import React from "react";
import { Link } from "react-router-dom";

export const DeveloperNavbar = () => {
    return (
        <nav className="app-header navbar navbar-expand bg-body">
            {/*begin::Container*/}
            <div className="container-fluid">
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <Link
                            className="nav-link"
                            href="#"
                            role="button"
                            onClick={() => {
                                document.body.classList.toggle("sidebar-collapse");
                            }}
                        >
                            <i class="fa-solid fa-bars"></i>
                        </Link>
                    </li>

                    
                </ul>

               
            </div>
        </nav>
    );
};
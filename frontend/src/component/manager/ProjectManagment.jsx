import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./ProjectManagment.css"
const ProjectManagement = () => {
    const [projects, setProjects] = useState([]);
    const [expandedProject, setExpandedProject] = useState(null);
    const [teamMembers, setTeamMembers] = useState({});
    const [modules, setModules] = useState({});
    const [error, setError] = useState("");

    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");
    const managerId = user?.role === "Manager" ? user.id : null;


    useEffect(() => {
        console.log("🔍 Manager ID from localStorage:", managerId); // 👈 log here
    
        if (managerId && token) {
            fetchAssignedProjects();
        }
    }, [managerId]);
    

    const fetchAssignedProjects = async () => {
        try {
            const response = await axios.get(
                `http://localhost:9000/api/projects/manager-projects/${managerId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log("✅ Fetched projects:", response.data);
            setProjects(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error("❌ Error fetching projects:", error);
            setError("Failed to load assigned projects.");
        }
    };

    const toggleDetails = async (projectId) => {
        if (expandedProject === projectId) {
            setExpandedProject(null);
        } else {
            setExpandedProject(projectId);
            await fetchTeamMembers(projectId);
            await fetchProjectModules(projectId);
        }
    };

    const fetchTeamMembers = async (projectId) => {
        try {
            const response = await axios.get(
                `http://localhost:9000/api/project-team/all-members/${projectId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            console.log("👥 Team members fetched:", response.data); // ✅ ADD THIS
            setTeamMembers((prev) => ({
                ...prev,
                [projectId]: response.data || [],
            }));
        } catch (error) {
            console.error("❌ Error fetching team members:", error);
        }
    };
    
    const fetchProjectModules = async (projectId) => {
        try {
            const response = await axios.get(
                `http://localhost:9000/api/module/project-modules/${projectId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            console.log("📌 Modules fetched:", response.data); // ✅ ADD THIS
            setModules((prev) => ({
                ...prev,
                [projectId]: response.data.modules || [],
            }));
        } catch (error) {
            console.error("❌ Error fetching modules:", error);
        }
    };
    
    return (
        <div className="container mt-4" style={{
            maxHeight: "100%",
            overflowY: "auto",
            padding: "10px",
            border: "1px solid #ddd",
            borderRadius: "5px",
            background: "#f9f9f9"
        }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>📁 Assigned Projects</h2>
                <Link to="/manager-dashboard" className="btn btn-info">⬅️ Back to Dashboard</Link>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            <div className="row">
                {projects.length > 0 ? (
                    projects.map((project) => (
                        <div className="col-md-6 mb-4" key={project._id}>
                            <div className="card shadow-sm border-0">
                                <div className="card-body">
                                    <h5>📌 {project.pname}</h5>
                                    <p className="card-text text-muted">📋 {project.description}</p>
                                    <p><strong>🛠 Tech:</strong> {project.technology}</p>
                                    <p><strong>📅 Start:</strong> {new Date(project.startDate).toLocaleDateString()}</p>
                                    <p><strong>📅 End:</strong> {project.completionDate ? new Date(project.completionDate).toLocaleDateString() : "N/A"}</p>

                                    <button className="btn btn-info btn-sm me-2" onClick={() => toggleDetails(project._id)}>
                                        {expandedProject === project._id ? "Hide Details" : "View Details"}
                                    </button>

                                    {expandedProject === project._id && (
                                        <div className="mt-3">
                                            <h6>👥 Team Members</h6>
                                            <ul className="list-group">
                                                {teamMembers[project._id]?.map((member) => (
                                                    <li key={member._id} className="list-group-item">
                                                        {member.name} ({member.email})
                                                    </li>
                                                ))}
                                            </ul>

                                            <h6 className="mt-3">📌 Project Modules</h6>
                                            <ul className="list-group">
                                                {modules[project._id]?.map((module) => (
                                                    <li key={module._id} className="list-group-item">
                                                        {module.moduleName} - {module.status} ({module.estimatedHours} hrs)
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-muted">No assigned projects found.</p>
                )}
            </div>
        </div>
    );
};

export default ProjectManagement;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const ProjectManagement = () => {
    const [projects, setProjects] = useState([]);
    const [expandedProject, setExpandedProject] = useState(null);
    const [teamMembers, setTeamMembers] = useState({});
    const [modules, setModules] = useState({});
    const managerId = localStorage.getItem("managerId");  // 🟢 Get manager ID from localStorage

    useEffect(() => {
        if (managerId) {
            fetchAssignedProjects();
        }
    }, [managerId]);

    // ✅ Fetch only assigned projects for the logged-in manager
    const fetchAssignedProjects = async () => {
        try {
            const response = await axios.get(`http://localhost:9000/api/projects/manager-projects/${managerId}`);
            setProjects(response.data);
        } catch (error) {
            console.error("Error fetching assigned projects:", error);
        }
    };

    // ✅ Toggle project details (expand/collapse)
    const toggleDetails = async (projectId) => {
        if (expandedProject === projectId) {
            setExpandedProject(null);
        } else {
            setExpandedProject(projectId);
            await fetchTeamMembers(projectId);
            await fetchProjectModules(projectId);
        }
    };

    // ✅ Fetch team members for a project
    const fetchTeamMembers = async (projectId) => {
        try {
            const response = await axios.get(`http://localhost:9000/api/project-team/all-members/${projectId}`);
            setTeamMembers((prev) => ({
                ...prev,
                [projectId]: response.data || []
            }));
        } catch (error) {
            console.error("Error fetching team members:", error);
        }
    };

    // ✅ Fetch modules for a project
    const fetchProjectModules = async (projectId) => {
        try {
            const response = await axios.get(`http://localhost:9000/api/module/project-modules/${projectId}`);
            setModules((prev) => ({
                ...prev,
                [projectId]: response.data.modules || []
            }));
        } catch (error) {
            console.error("Error fetching modules:", error);
        }
    };

    return (
        <div className="container mt-4" style={{ maxHeight: "100%", overflowY: "auto", padding: "10px", border: "1px solid #ddd", borderRadius: "5px", background: "#f9f9f9" }}>
            
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>📁 Assigned Projects</h2>
                <Link to="/manager-dashboard" className="btn btn-info">⬅️ Back to Dashboard</Link>
            </div>

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
                                                {teamMembers[project._id]?.map(member => (
                                                    <li key={member._id} className="list-group-item">{member.name} ({member.email})</li>
                                                ))}
                                            </ul>

                                            <h6 className="mt-3">📌 Project Modules</h6>
                                            <ul className="list-group">
                                                {modules[project._id]?.map(module => (
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

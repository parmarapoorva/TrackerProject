import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Project = () => {
    const [projects, setProjects] = useState([]);
    const [expandedProject, setExpandedProject] = useState(null);
    const [modules, setModules] = useState({});
    const [tasks, setTasks] = useState({});
    const [error, setError] = useState("");

    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");
    const developerId = user?.role === "Developer" ? user.id : null;

    useEffect(() => {
        console.log("🔍 Developer ID from localStorage:", developerId);

        if (developerId && token) {
            fetchAssignedProjects();
        }
    }, [developerId, token]);

    const fetchAssignedProjects = async () => {
        try {
            const response = await axios.get(
                `http://localhost:9000/api/project-team/developer/${developerId}`,
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
            await fetchProjectModules(projectId);
            await fetchProjectTasks(projectId);
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
            console.log("📌 Modules fetched:", response.data);
            setModules((prev) => ({
                ...prev,
                [projectId]: response.data.modules || [],
            }));
        } catch (error) {
            console.error("❌ Error fetching modules:", error);
        }
    };

    const fetchProjectTasks = async (projectId) => {
        try {
            const response = await axios.get(
                `http://localhost:9000/api/tasks/project/${projectId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            console.log("🧩 Tasks fetched:", response.data);
            setTasks((prev) => ({
                ...prev,
                [projectId]: response.data || [],
            }));
        } catch (error) {
            console.error("❌ Error fetching tasks:", error);
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
                <Link to="/developer-dashboard" className="btn btn-info">⬅️ Back to Dashboard</Link>
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
                                            <h6 className="mt-3">📌 Project Modules</h6>
                                            <ul className="list-group">
                                                {modules[project._id]?.map((module) => (
                                                    <li key={module._id} className="list-group-item">
                                                        <strong>{module.moduleName}</strong> - {module.status} ({module.estimatedHours} hrs)
                                                    </li>
                                                ))}
                                            </ul>

                                            <h6 className="mt-3">🧩 Project Tasks</h6>
                                            <ul className="list-group">
                                                {tasks[project._id]?.length > 0 ? (
                                                    tasks[project._id].map((task) => (
                                                        <li key={task._id} className="list-group-item">
                                                            <strong>{task.title}</strong> - {task.status} ({task.priority})<br />
                                                            Due: {new Date(task.dueDate).toLocaleDateString()} <br />
                                                            ⏳ Estimated Hours: {task.totalMinutes || "N/A"}
                                                        </li>
                                                    ))
                                                ) : (
                                                    <li className="list-group-item text-muted">No tasks found.</li>
                                                )}
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

export default Project;

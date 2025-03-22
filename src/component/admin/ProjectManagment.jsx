import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaPlus, FaUsers, FaCogs, FaCalendarAlt, FaTimes, FaUserPlus, FaFolderOpen } from "react-icons/fa";
import "./ProjectManagement.css";

const ProjectManagement = () => {
    const [projects, setProjects] = useState([]);
    const [expandedProject, setExpandedProject] = useState(null);
    const [teamMembers, setTeamMembers] = useState({});
    const [modules, setModules] = useState({});
    const [newMemberEmail, setNewMemberEmail] = useState("");
    const [newModule, setNewModule] = useState({
        moduleName: "",
        description: "",
        estimatedHours: "",
        status: "Not Started",
        startDate: ""
    });

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const response = await axios.get("http://localhost:9000/api/projects/all-projects");
            setProjects(response.data);
        } catch (error) {
            console.error("Error fetching projects:", error);
        }
    };

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

    const toggleDetails = async (projectId) => {
        if (expandedProject === projectId) {
            setExpandedProject(null);
        } else {
            setExpandedProject(projectId);
            await fetchTeamMembers(projectId);
            await fetchProjectModules(projectId);
        }
    };

    const addTeamMember = async (projectId) => {
        if (!newMemberEmail) {
            alert("Please enter an email.");
            return;
        }
        try {
            await axios.post("http://localhost:9000/api/project-team/add-member", { projectId, email: newMemberEmail });
            await fetchTeamMembers(projectId);
            setNewMemberEmail("");
            alert("Team member added successfully!");
        } catch (error) {
            console.error("Error adding team member:", error);
            alert("Failed to add member.");
        }
    };

    const addModule = async (projectId) => {
        const { moduleName, description, estimatedHours, status, startDate } = newModule;

        if (!moduleName || !description || !estimatedHours || !startDate) {
            alert("Please fill in all module details.");
            return;
        }

        try {
            await axios.post("http://localhost:9000/api/module/project-modules", {
                projectId,
                moduleName,
                description,
                estimatedHours,
                status,
                startDate
            });

            await fetchProjectModules(projectId);
            setNewModule({
                moduleName: "",
                description: "",
                estimatedHours: "",
                status: "Not Started",
                startDate: ""
            });

            alert("Module added successfully!");
        } catch (error) {
            console.error("Error adding module:", error);
            alert("Failed to add module.");
        }
    };

    const renderTeamMembers = (projectId) => (
        <div className="mt-3">
            <h6 className="text-primary"><FaUsers /> Team Members</h6>
            <div className="border rounded p-3 bg-light">
                {teamMembers[projectId]?.length > 0 ? (
                    <ul className="list-group">
                        {teamMembers[projectId].map((member) => (
                            <li key={member._id} className="list-group-item d-flex justify-content-between align-items-center">
                                {member.name} <span className="text-muted">({member.email})</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-muted">No team members assigned.</p>
                )}
            </div>
        </div>
    );

    const renderModules = (projectId) => (
        <div className="mt-3">
            <h6 className="text-success"><FaCogs /> Project Modules</h6>
            <div className="border rounded p-3 bg-light">
                {modules[projectId]?.length > 0 ? (
                    <ul className="list-group">
                        {modules[projectId].map((module) => (
                            <li key={module._id} className="list-group-item d-flex justify-content-between align-items-center">
                                <strong>{module.moduleName}</strong>
                                <span className={`badge ${module.status === "Completed" ? "bg-success" : "bg-warning"}`}>
                                    {module.status}
                                </span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-muted">No modules added.</p>
                )}
            </div>
        </div>
    );

    return (
        <div className="container-fluid project-management">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2><FaFolderOpen /> Project Management</h2>
                <Link to="/admin-dashboard/addproject" className="btn btn-primary shadow-lg">
                    <FaPlus /> Add Project
                </Link>
            </div>

            <div className="row">
                {projects.map((project) => (
                    <div className="col-lg-4 mb-4 " key={project._id}>
                        <div className="card project-card shadow-lg">
                            <div className="card-body">
                                <h5 className="card-title">{project.pname ?? "No Project Name"}</h5>
                                <br/>
                                <p className="text-muted">{project.description ?? "No description"}</p>
                                <div className="d-flex justify-content-between">
                                    <span><FaCalendarAlt /> Start: {project.startDate ? new Date(project.startDate).toLocaleDateString() : "N/A"}</span>
                                    <span><FaCalendarAlt /> End: {project.completionDate ? new Date(project.completionDate).toLocaleDateString() : "N/A"}</span>
                                </div>
                                <p className="mt-2"><strong>Tech:</strong> {project.technology ?? "N/A"}</p>
                                <p><strong>Manager:</strong> {project.manager?.name ?? "No Manager Assigned"}</p>

                                <button
                                    className={`btn btn-${expandedProject === project._id ? "danger" : "info"} btn-sm mt-3`}
                                    onClick={() => toggleDetails(project._id)}
                                >
                                    {expandedProject === project._id ? <FaTimes /> : <FaPlus />} 
                                    {expandedProject === project._id ? " Hide Details" : " View Details"}
                                </button>

                                {expandedProject === project._id && (
                                    <div className="mt-3 p-3 bg-light rounded border">
                                        {renderTeamMembers(project._id)}
                                        {renderModules(project._id)}

                                        <h6 className="mt-4">Add New Module</h6>
                                        <input type="text" placeholder="Module Name" value={newModule.moduleName} onChange={(e) => setNewModule({ ...newModule, moduleName: e.target.value })} className="form-control mb-2" />
                                        <input type="number" placeholder="Estimated Hours" value={newModule.estimatedHours} onChange={(e) => setNewModule({ ...newModule, estimatedHours: e.target.value })} className="form-control mb-2" />
                                        <input type="date" value={newModule.startDate} onChange={(e) => setNewModule({ ...newModule, startDate: e.target.value })} className="form-control mb-2" />
                                        <textarea placeholder="Description" value={newModule.description} onChange={(e) => setNewModule({ ...newModule, description: e.target.value })} className="form-control mb-2"></textarea>
                                        <button className="btn btn-success" onClick={() => addModule(project._id)}>Add Module</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProjectManagement;

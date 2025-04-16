import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
    FaPlus, FaUsers, FaCogs, FaCalendarAlt, FaUserPlus, FaFolderOpen, FaTrash
} from "react-icons/fa";
import "./ProjectManagement.css";

const ProjectManagement = () => {
    const [projects, setProjects] = useState([]);
    const [teamMembers, setTeamMembers] = useState({});
    const [modules, setModules] = useState({});
    const [newMemberEmail, setNewMemberEmail] = useState("");
    const [developers, setDevelopers] = useState([]);
    const [newModule, setNewModule] = useState({
        moduleName: "",
        description: "",
        estimatedHours: "",
        status: "Not Started",
        startDate: ""
    });

    const [showModal, setShowModal] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);

    useEffect(() => {
        fetchProjects();
        fetchDevelopers();
    }, []);

    const fetchProjects = async () => {
        try {
            const response = await axios.get("http://localhost:9000/api/projects/all-projects");
            setProjects(response.data);
        } catch (error) {
            console.error("Error fetching projects:", error);
        }
    };

    const fetchDevelopers = async () => {
        try {
            const response = await axios.get("http://localhost:9000/api/users/Developer");
            setDevelopers(response.data);
        } catch (error) {
            console.error("Error fetching developers:", error);
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

    const openDetailsModal = async (project) => {
        setSelectedProject(project);
        await fetchTeamMembers(project._id);
        await fetchProjectModules(project._id);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedProject(null);
    };

    const addTeamMember = async (projectId) => {
        if (!newMemberEmail) {
            alert("Please select a developer.");
            return;
        }

        try {
            await axios.post("http://localhost:9000/api/project-team/add-member", {
                projectId,
                email: newMemberEmail
            });
            await fetchTeamMembers(projectId);
            setNewMemberEmail("");
            alert("Team member added successfully!");
        } catch (error) {
            alert(error.response?.data?.message || "Failed to add member.");
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
            alert("Failed to add module.");
        }
    };

    const deleteProject = async (projectId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this project?");
        if (!confirmDelete) return;

        try {
            await axios.delete(`http://localhost:9000/api/projects/delete-project/${projectId}`);
            alert("Project deleted successfully!");
            fetchProjects();
        } catch (error) {
            console.error("Error deleting project:", error);
            alert("Failed to delete project.");
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

                <div className="mt-3">
                    <h6><FaUserPlus /> Add Team Member</h6>
                    <select
                        className="form-control mb-2"
                        value={newMemberEmail}
                        onChange={(e) => setNewMemberEmail(e.target.value)}
                    >
                        <option value="">-- Select Developer --</option>
                        {developers.map((dev) => (
                            <option key={dev._id} value={dev.email}>
                                {dev.name} ({dev.email})
                            </option>
                        ))}
                    </select>

                    <button className="btn btn-primary btn-sm" onClick={() => addTeamMember(projectId)}>
                        Add Developer
                    </button>
                </div>
            </div>
        </div>
    );

    const renderModules = (projectId) => (
        <div className="mt-4">
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
                    <div className="col-lg-4 mb-4" key={project._id}>
                        <div className="card project-card shadow-lg">
                            <div className="card-body">
                                <h5 className="card-title">{project.pname ?? "No Project Name"}</h5>
                                <br />
                                <span
  className={`status-badge ${
    project.status?.toLowerCase() === "working" ? "status-working" : "status-other"
  }`}
>
  {project.status ?? "No status found"}
</span>

                               
                                <p className="text-muted">{project.description ?? "No description"}</p>
                                <div className="d-flex justify-content-between">
                                    <span><FaCalendarAlt /> Start: {project.startDate ? new Date(project.startDate).toLocaleDateString() : "N/A"}</span>
                                    <span><FaCalendarAlt /> End: {project.completionDate ? new Date(project.completionDate).toLocaleDateString() : "N/A"}</span>
                                </div>
                                <p className="mt-2"><strong>Tech:</strong> {project.technology ?? "N/A"}</p>
                                <p><strong>Manager:</strong> {project.manager?.name ?? "No Manager Assigned"}</p>

                                <div className="d-flex justify-content-between mt-3">
                                    <button
                                        className="btn btn-info btn-sm"
                                        onClick={() => openDetailsModal(project)}
                                    >
                                        <FaPlus /> View Details
                                    </button>
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => deleteProject(project._id)}
                                    >
                                        <FaTrash /> Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {selectedProject && (
                <div className={`modal fade ${showModal ? "show d-block" : ""}`} tabIndex="-1">
                    <div className="modal-dialog modal-xl modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    Project: {selectedProject.pname}
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={closeModal}
                                ></button>
                            </div>
                            <div className="modal-body">
                                {renderTeamMembers(selectedProject._id)}
                                {renderModules(selectedProject._id)}

                                <div className="mt-4">
                                    <h6>Add New Module</h6>
                                    <input
                                        type="text"
                                        placeholder="Module Name"
                                        value={newModule.moduleName}
                                        onChange={(e) =>
                                            setNewModule({ ...newModule, moduleName: e.target.value })
                                        }
                                        className="form-control mb-2"
                                    />
                                    <input
                                        type="number"
                                        placeholder="Estimated Hours"
                                        value={newModule.estimatedHours}
                                        onChange={(e) =>
                                            setNewModule({ ...newModule, estimatedHours: e.target.value })
                                        }
                                        className="form-control mb-2"
                                    />
                                    <input
                                        type="date"
                                        value={newModule.startDate}
                                        onChange={(e) =>
                                            setNewModule({ ...newModule, startDate: e.target.value })
                                        }
                                        className="form-control mb-2"
                                    />
                                    <textarea
                                        placeholder="Description"
                                        value={newModule.description}
                                        onChange={(e) =>
                                            setNewModule({ ...newModule, description: e.target.value })
                                        }
                                        className="form-control mb-2"
                                    ></textarea>

                                    <select
                                        value={newModule.status}
                                        onChange={(e) =>
                                            setNewModule({ ...newModule, status: e.target.value })
                                        }
                                        className="form-control mb-3"
                                    >
                                        <option value="Not Started">Not Started</option>
                                        <option value="In Progress">In Progress</option>
                                        <option value="Completed">Completed</option>
                                        <option value="On Hold">On Hold</option>
                                    </select>

                                    <button
                                        className="btn btn-success"
                                        onClick={() => addModule(selectedProject._id)}
                                    >
                                        Add Module
                                    </button>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={closeModal}>
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectManagement;

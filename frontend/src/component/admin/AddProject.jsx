import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import "./AddProject.css";  // Custom CSS file

const API_BASE_URL = "https://trackerproject-backend.onrender.com";  // ✅ Render Backend URL

const AddProject = () => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const navigate = useNavigate();
    const [managers, setManagers] = useState([]);

    // 🚀 Fetch Managers from Backend
    useEffect(() => {
        const fetchManagers = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/users/managers`);
                setManagers(response.data);
            } catch (error) {
                console.error("Failed to fetch managers:", error);
                toast.error("❌ Failed to fetch managers");
            }
        };
        fetchManagers();
    }, []);

    // 🔥 Handle Project Form Submission
    const handleRegistration = async (data) => {
        const formData = new FormData();
        formData.append("projectId", Date.now());
        formData.append("pname", data.pname);
        formData.append("description", data.description);
        formData.append("technology", data.technology);
        formData.append("estimatedHours", data.estimatedHours);
        formData.append("startDate", data.startDate);
        formData.append("completionDate", data.completionDate);
        formData.append("file", data.file[0]);
        formData.append("status", data.status);
        formData.append("managerId", data.managerId);

        // ✅ Date Validation: Ensure Start Date is before Completion Date
        if (new Date(data.startDate) > new Date(data.completionDate)) {
            toast.error("❌ Start date cannot be after completion date!");
            return;
        }

        try {
            await axios.post(`${API_BASE_URL}/api/projects/add-project`, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            toast.success("✅ Project Added Successfully!");
            setTimeout(() => {
                navigate("/admin-dashboard/projectmanagment");
            }, 2000);

            reset();
        } catch (error) {
            console.error("Project Addition Error:", error);
            toast.error(`❌ Project Addition Failed: ${error.response?.data?.message || "Unknown error"}`);
        }
    };

    return (
        <div className="add-project-container">
            <div className="form-card">
                <h2 className="form-title">Add Project</h2>

                <form onSubmit={handleSubmit(handleRegistration)} encType="multipart/form-data">
                    {/* Project Name */}
                    <div className="form-group">
                        <label>Project Name</label>
                        <input
                            type="text"
                            placeholder="Enter Project Name"
                            {...register("pname", { required: "Project Name is required" })}
                        />
                        {errors.pname && <p className="error">{errors.pname.message}</p>}
                    </div>

                    {/* Description */}
                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            placeholder="Enter Project Description"
                            {...register("description", { required: "Description is required" })}
                        />
                        {errors.description && <p className="error">{errors.description.message}</p>}
                    </div>

                    {/* Technology */}
                    <div className="form-group">
                        <label>Technology</label>
                        <input
                            type="text"
                            placeholder="Enter Technology"
                            {...register("technology", { required: "Technology is required" })}
                        />
                        {errors.technology && <p className="error">{errors.technology.message}</p>}
                    </div>

                    {/* Estimated Hours */}
                    <div className="form-group">
                        <label>Estimated Hours</label>
                        <input
                            type="number"
                            placeholder="Estimated Hours"
                            {...register("estimatedHours", { required: "Estimated Hours are required" })}
                        />
                        {errors.estimatedHours && <p className="error">{errors.estimatedHours.message}</p>}
                    </div>

                    {/* Manager Dropdown */}
                    <div className="form-group">
                        <label>Manager</label>
                        <select {...register("managerId", { required: "Manager is required" })}>
                            <option value="">Select Manager</option>
                            {managers.map(manager => (
                                <option key={manager._id} value={manager._id}>
                                    {`${manager.name} (${manager.email})`}
                                </option>
                            ))}
                        </select>
                        {errors.managerId && <p className="error">{errors.managerId.message}</p>}
                    </div>

                    {/* Dates: Start and Completion */}
                    <div className="form-row">
                        <div className="form-group">
                            <label>Start Date</label>
                            <input
                                type="date"
                                {...register("startDate", { required: "Start Date is required" })}
                            />
                            {errors.startDate && <p className="error">{errors.startDate.message}</p>}
                        </div>

                        <div className="form-group">
                            <label>Completion Date</label>
                            <input
                                type="date"
                                {...register("completionDate", { required: "Completion Date is required" })}
                            />
                            {errors.completionDate && <p className="error">{errors.completionDate.message}</p>}
                        </div>
                    </div>

                    {/* File Upload */}
                    <div className="form-group">
                        <label>Upload File</label>
                        <input
                            type="file"
                            {...register("file", { required: "File is required" })}
                        />
                        {errors.file && <p className="error">{errors.file.message}</p>}
                    </div>

                    {/* Project Status */}
                    <div className="form-group">
                        <label>Status</label>
                        <select {...register("status", { required: "Status is required" })}>
                            <option value="Pending">Pending</option>
                            <option value="Working">Working</option>
                            <option value="Complete">Complete</option>
                        </select>
                        {errors.status && <p className="error">{errors.status.message}</p>}
                    </div>

                    {/* Submit Button */}
                    <div className="btn-container">
                        <button type="submit" className="btn-submit">Submit</button>
                    </div>
                </form>
            </div>
            <ToastContainer />
        </div>
    );
};

export default AddProject;

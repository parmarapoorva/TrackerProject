import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import logo from "../comm/Images/logo1-removebg-preview.png";

export default function Signup() {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm();

    const [roles, setRoles] = useState([]);
    const [selectedRole, setSelectedRole] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    // ✅ Fetch Roles from Backend
    useEffect(() => {
        axios.get("http://localhost:9000/api/roles")
            .then(response => setRoles(response.data))
            .catch(error => console.error("Error fetching roles:", error));
    }, []);

    // ✅ Handle Form Submission
    const SubmitHandler = async (data) => {
        try {
            const response = await axios.post("http://localhost:9000/api/users/signup", {
                name: data.fname,
                email: data.email,
                password: data.password,
                role: selectedRole,
                gender: data.gender
            });

            console.log("Signup Success:", response.data);
            alert("User registered successfully!");
            navigate("/login");
        } catch (error) {
            console.error("Signup Error:", error.response?.data || error.message);
            alert(error.response?.data?.error || "Error registering user");
        }
    };

    return (
        <>
            {/* 🎨 Styling */}
            <style>
{`
    .full-screen-container {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: linear-gradient(to right, #c9d6ff, #e2e2e2);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
    }

    .card-style {
        background: rgba(255, 255, 255, 0.2);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.3);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
        width: 90%;
        max-width: 450px;
        padding: 40px;
        border-radius: 16px;
        text-align: center;
        color: #333;
    }

    .input-group {
        background: rgba(255, 255, 255, 0.5);
        border-radius: 8px;
        overflow: hidden;
    }

    .form-control {
        background: transparent !important;
        color: #333 !important;
        border: none;
    }

    .form-control::placeholder {
        color: #666 !important;
    }

    .form-control:focus {
        box-shadow: none;
    }

    .btn-primary {
        background: #007bff;
        border: none;
        transition: background 0.3s ease;
    }

    .btn-primary:hover {
        background: #0056b3;
    }

    .social-btn {
        background: #f1f1f1;
        color: #333;
        border: none;
        transition: background 0.3s ease;
    }

    .social-btn:hover {
        background: #ddd;
    }

    a {
        color: #007bff;
        text-decoration: none;
    }

    a:hover {
        text-decoration: underline;
    }
`}
</style>


            <div className="full-screen-container">
                <div className="card-style">

                    {/* 🟠 Logo */}
                    <img src={logo} alt="Logo" width="120" className="mb-3" />

                    <h3 className="fw-bold">Create Your Account</h3>

                    {/* 🚀 Signup Form */}
                    <form onSubmit={handleSubmit(SubmitHandler)}>

                        {/* Full Name */}
                        <div className="mb-3">
                            <div className="input-group">
                                <span className="input-group-text"><i className="fas fa-user"></i></span>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Full Name"
                                    {...register("fname", { required: "Name is required" })}
                                />
                            </div>
                            {errors.fname && <small className="text-danger">{errors.fname.message}</small>}
                        </div>

                        {/* Email */}
                        <div className="mb-3">
                            <div className="input-group">
                                <span className="input-group-text"><i className="fas fa-envelope"></i></span>
                                <input
                                    type="email"
                                    className="form-control"
                                    placeholder="Email"
                                    {...register("email", {
                                        required: "Email is required",
                                        pattern: {
                                            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                                            message: "Invalid email"
                                        }
                                    })}
                                />
                            </div>
                            {errors.email && <small className="text-danger">{errors.email.message}</small>}
                        </div>

                        {/* Password */}
                        <div className="mb-3">
                            <div className="input-group">
                                <span className="input-group-text"><i className="fas fa-lock"></i></span>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="form-control"
                                    placeholder="Password"
                                    {...register("password", { required: "Password is required" })}
                                />
                                <span
                                    className="input-group-text"
                                    style={{ cursor: "pointer" }}
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    <i className={showPassword ? "fas fa-eye-slash" : "fas fa-eye"}></i>
                                </span>
                            </div>
                            {errors.password && <small className="text-danger">{errors.password.message}</small>}
                        </div>

                        {/* Role */}
                        <div className="mb-3">
                            <select 
                                className="form-control"
                                onChange={(e) => setSelectedRole(e.target.value)}
                                value={selectedRole}
                                required
                            >
                                <option value="" style={{color:"black"}}>Select Role</option>
                                {roles.map(role => (
                                    <option key={role._id} value={role._id} style={{color:"black"}}>{role.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Gender */}
                        <div className="mb-3">
                            <label className="form-label">Gender:</label>
                            <div className="d-flex gap-3 justify-content-center">
                                <label>
                                    <input type="radio" value="Male" {...register("gender", { required: true })} /> Male
                                </label>
                                <label>
                                    <input type="radio" value="Female" {...register("gender")} /> Female
                                </label>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button type="submit" className="btn btn-primary w-100">Sign Up</button>

                        <p className="mt-3">
                            Already have an account? 
                            <Link to="/login" className="ms-1">Login</Link>
                        </p>

                        <div className="text-center my-2">OR</div>

                        {/* Social Logins */}
                        <button className="btn social-btn w-100 mb-2">
                            <i className="fab fa-google me-2"></i> Sign up with Google
                        </button>
                        <button className="btn social-btn w-100">
                            <i className="fab fa-linkedin me-2"></i> Sign up with LinkedIn
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}

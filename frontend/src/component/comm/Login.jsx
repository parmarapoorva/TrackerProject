import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import logo from "../comm/Images/logo1-removebg-preview.png";

export default function Login() {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [loginError, setLoginError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [userName, setUserName] = useState("");
    const [userRole, setUserRole] = useState("");

    // ✅ Handle Login
    const SubmitHandler = async (data) => {
        try {
            const response = await axios.post("http://localhost:9000/api/users/login", {
                email: data.email,
                password: data.password,
            });

            const { token, user } = response.data;
            localStorage.setItem("token", token);
            localStorage.setItem("role", user.role);
            localStorage.setItem("user", JSON.stringify(user));

            // ✅ Store Manager ID if role is Manager
            if (user.role === "Manager") {
                localStorage.setItem("managerId", user.id);
                console.log("Manager ID stored:", user.id);
            }

            setUserName(user.name);
            setUserRole(user.role);
            console.log("Token saved:", token);

            // ✅ Navigate based on role
            switch (user.role) {
                case "Developer":
                    navigate("/developer-dashboard");
                    break;
                case "Manager":
                    navigate("/manager-dashboard");
                    break;
                case "Admin":
                default:
                    navigate("/admin-dashboard");
                    break;
            }
        } catch (error) {
            setLoginError(error.response?.data?.error || "Invalid email or password");
        }
    };

    return (
        <>
            {/* Full-Screen Styles */}
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
                    {/* Logo */}
                    <img src={logo} alt="Logo" width="120" className="mb-3" />

                    <h3>Welcome Back!</h3>

                    {/* Show logged-in user info */}
                    {userName && (
                        <p className="text-success">
                            Hello, {userName}! ({userRole})
                        </p>
                    )}

                    {/* Login Form */}
                    <form onSubmit={handleSubmit(SubmitHandler)}>

                        {/* Email */}
                        <div className="mb-3">
                            <div className="input-group">
                                <span className="input-group-text">
                                    <i className="fas fa-envelope"></i>
                                </span>
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
                                <span className="input-group-text">
                                    <i className="fas fa-lock"></i>
                                </span>
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

                        {/* Error Message */}
                        {loginError && <p className="text-danger">{loginError}</p>}

                        {/* Login Button */}
                        <button type="submit" className="btn btn-primary w-100">Login</button>

                        {/* OR Divider */}
                        <div className="text-center my-3">
                            <span>OR</span>
                        </div>

                        {/* Social Logins */}
                        <button type="button" className="btn social-btn w-100 mb-2">
                            <i className="fab fa-google me-2"></i> Login with Google
                        </button>

                        <button type="button" className="btn social-btn w-100">
                            <i className="fab fa-linkedin me-2"></i> Login with LinkedIn
                        </button>

                        {/* Links */}
                        <p className="mt-3">
                            <Link to="/forgot-password" className="text-decoration-none">Forgot password?</Link>
                        </p>
                        <p>
                            Don't have an account?
                            <Link to="/signup" className="text-decoration-none ms-1">Sign Up</Link>
                        </p>
                    </form>
                </div>
            </div>
        </>
    );
}

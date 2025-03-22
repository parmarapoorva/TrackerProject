import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import logo from "../comm/Images/logo1-removebg-preview.png";
import "../comm/Login.css";

export default function Login() {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [loginError, setLoginError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [userName, setUserName] = useState("");

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
            console.log("Token saved:", token);
            setUserName(user.name); // ✅ Store the user's name in state

            // ✅ Navigate based on role
            if (user.role === "Developer") {
                navigate("/developer-dashboard");
            } else if (user.role === "Manager") {
                navigate("/manager-dashboard");
            } else {
                navigate("/admin-dashboard");
            }
        } catch (error) {
            setLoginError(error.response?.data?.error || "Invalid email or password");
        }
    };

    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
            width: "100vw",
        }} id="Login">
            {/* Navbar */}
            <nav className="navbar navbar-expand-lg navbar-light fixed-top w-100"
                style={{
                    background: "transparent",
                    padding: "10px 20px",
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                    zIndex: "1000"
                }}>
                <div className="container-fluid">
                    <Link className="navbar-brand" to="/">
                        <img src={logo} alt="Logo" width="200" height="120" style={{ marginLeft: "30%", }} />
                    </Link>
                </div>
            </nav>

            {/* Login Form Card */}
            <div style={{
                width: "600px",
                background: "white",
                padding: "20px",
                borderRadius: "10px",
                boxShadow: "0px 4px 10px rgba(22, 22, 22, 0.2)",
            }}>
                <h3 className="text-center">Login</h3>
                {userName && <p className="text-success text-center">Welcome, {userName}!</p>} {/* ✅ Show user name */}

                <form onSubmit={handleSubmit(SubmitHandler)}>
                    {/* Email */}
                    <div className="mb-2">
                        <label htmlFor="email" className="form-label">Email Address</label>
                        <div className="input-group">
                            <span className="input-group-text"><i className="fas fa-envelope"></i></span>
                            <input type="email" className="form-control" id="email"
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
                    <div className="mb-2">
                        <label htmlFor="password" className="form-label">Password</label>
                        <div className="input-group">
                            <span className="input-group-text"><i className="fas fa-lock"></i></span>
                            <input
                                type={showPassword ? "text" : "password"}
                                className="form-control"
                                id="password"
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

                    {loginError && <p className="text-danger text-center">{loginError}</p>}

                    <button type="submit" className="btn btn-primary w-100">Login</button>

                    {/* OR Divider */}
                    <div className="text-center my-2">
                        <span>OR</span>
                    </div>

                    {/* Social Login Buttons */}
                    <div className="d-flex flex-column gap-2">
                        {/* Google Login */}
                        <button type="button" className="btn btn-danger w-100">
                            <i className="fab fa-google me-2"></i> Login with Google
                        </button>

                        {/* LinkedIn Login */}
                        <button type="button" className="btn btn-primary w-100" style={{ backgroundColor: "#0077b5", borderColor: "#0077b5" }}>
                            <i className="fab fa-linkedin me-2"></i> Login with LinkedIn
                        </button>
                    </div>

                    <p className="text-center mt-2">
                        <Link className="text-decoration-none" to="#" style={{ color: "rgb(66, 179, 245)" }}>Forgot password?</Link>
                    </p>
                    <p className="text-center">
                        <Link className="text-decoration-none" to="/signup" style={{ color: "rgb(66, 179, 245)" }}>
                            Don't have an account? <span style={{ color: "blue" }}>Sign Up</span>
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

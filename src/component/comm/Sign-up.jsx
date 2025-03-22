import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import logo from "./Images/logo1-removebg-preview.png";
import "./Sign.css"
export default function Signup() {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm();

    const [roles, setRoles] = useState([]);
    const [selectedRole, setSelectedRole] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    // Fetch Roles from Backend
    useEffect(() => {
        axios.get("http://localhost:9000/api/roles")
            .then(response => setRoles(response.data))
            .catch(error => console.error("Error fetching roles:", error));
    }, []);

    // Handle Form Submission
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
        <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
            width: "100vw",
            
        }} id="sign">
            {/* Your content here */}
       
        
            {/* Navbar */}
            <nav
                className="navbar navbar-expand-lg navbar-light fixed-top w-100"
                style={{
                    background: "white",
                    padding: "10px 20px",
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                    zIndex: "1000"
                }}
            >
                <div className="container-fluid">
                    <Link className="navbar-brand" to="/">
                        <img src={logo} alt="Logo" width="200" height="120" style={{ marginLeft: "30%" }} />
                    </Link>
                </div>
            </nav>

            {/* Signup Form */}
            <div style={{
                width: "600px",
                background: "white",
                padding: "20px",
                borderRadius: "10px",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)"
            }}>
                <h3 className="text-center">Sign Up</h3>
                
                <form onSubmit={handleSubmit(SubmitHandler)} style={{width:"400px",marginLeft:"15%"}}>

                    {/* Full Name */}
                    <div className="mb-2">
                        <label htmlFor="name" className="form-label">Full Name</label>
                        <div className="input-group">
                            <span className="input-group-text"><i className="fas fa-user"></i></span>
                            <input type="text" className="form-control" id="name" {...register("fname", { required: "Name is required" })} />
                        </div>
                        {errors.fname && <small className="text-danger">{errors.fname.message}</small>}
                    </div>

                    {/* Email */}
                    <div className="mb-2">
                        <label htmlFor="email" className="form-label">Email Address</label>
                        <div className="input-group">
                            <span className="input-group-text"><i className="fas fa-envelope"></i></span>
                            <input type="email" className="form-control" id="email" {...register("email", {
                                required: "Email is required",
                                pattern: { value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, message: "Invalid email" }
                            })} />
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

                    {/* Role */}
                    <div className="mb-2">
                        <label htmlFor="role" className="form-label">Role</label>
                        <div className="input-group">
                            <span className="input-group-text"><i className="fas fa-user-tag"></i></span>
                            <select
                                className="form-control"
                                id="role"
                                {...register("roleId", { required: "Role is required" })}
                                onChange={(e) => setSelectedRole(e.target.value)}
                                value={selectedRole}
                            >
                                <option value="">Select Role</option>
                                {roles.map(role => (
                                    <option key={role._id} value={role._id}>{role.name}</option>
                                ))}
                            </select>
                        </div>
                        {errors.roleId && <small className="text-danger">{errors.roleId.message}</small>}
                    </div>

                    {/* Gender */}
                    <div className="mb-3">
                        <label className="form-label">Gender:</label>
                        <div className="d-flex gap-3 align-items-center">
                            <label className="d-flex align-items-center">
                                <input
                                    type="radio"
                                    name="gender"
                                    value="Male"
                                    {...register("gender")}
                                    className="me-1"
                                /> Male
                            </label>
                            <label className="d-flex align-items-center">
                                <input
                                    type="radio"
                                    name="gender"
                                    value="Female"
                                    {...register("gender")}
                                    className="me-1"
                                /> Female
                            </label>
                        </div>
                    </div>


                    <button type="submit" className="btn btn-primary w-100">Sign Up</button>
                    <p className="text-center mt-2">
                        <Link className="text-decoration-none" to="/login" style={{ color: "rgb(66, 179, 245)" }}>Already have an account? Login</Link>
                    </p>
                    <div className="text-center my-2">
                        <span>OR</span>
                    </div>

                    {/* Social Login Buttons */}
                    <div className="d-flex flex-column gap-2">
                        {/* Google Login */}
                        <button type="button" className="btn btn-danger w-100">
                            <i className="fab fa-google me-2"></i> Sign up with Google
                        </button>

                        {/* LinkedIn Login */}
                        <button type="button" className="btn btn-primary w-100" style={{ backgroundColor: "#0077b5", borderColor: "#0077b5" }}>
                            <i className="fab fa-linkedin me-2"></i> Sign up with LinkedIn
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

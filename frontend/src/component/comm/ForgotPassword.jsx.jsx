import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:9000/api/users/forgot-password", { email });
            setMessage(response.data.message);
            setError("");
        } catch (error) {
            setError(error.response?.data?.error || "Error sending reset link");
            setMessage("");
        }
    };

    return (
        <div style={styles.fullScreenContainer}>
            <div style={styles.cardStyle}>
                <h3 className="mb-4">Forgot Password</h3>
                <form onSubmit={handleForgotPassword}>
                    <div className="mb-3 text-start">
                        <label className="form-label">Email Address</label>
                        <input
                            type="email"
                            className="form-control"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="d-grid">
                        <button type="submit" className="btn btn-primary">Send Reset Link</button>
                    </div>
                    {message && <div className="alert alert-success mt-3">{message}</div>}
                    {error && <div className="alert alert-danger mt-3">{error}</div>}
                </form>
            </div>
        </div>
    );
};

const styles = {
    fullScreenContainer: {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "linear-gradient(to right, #c9d6ff, #e2e2e2)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
    },
    cardStyle: {
        background: "rgba(255, 255, 255, 0.2)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255, 255, 255, 0.3)",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
        width: "90%",
        maxWidth: "450px",
        padding: "40px",
        borderRadius: "16px",
        color: "#333",
    },
};

export default ForgotPassword;

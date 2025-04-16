import axios from 'axios';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';

export const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const submitHandler = async (data) => {
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const obj = {
                token: token,
                newPassword: data.password
            };

            const res = await axios.post("http://localhost:9000/api/user/reset-password", obj);

            if (res.status === 200) {
                setSuccess("Password reset successfully! Redirecting...");
                setTimeout(() => navigate("/login"), 3000);
            }
        } catch (error) {
            setError(error.response?.data?.error || "Failed to reset password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.fullScreenContainer}>
            <div style={styles.cardStyle}>
                <h3 className="mb-4">Reset Password</h3>

                {error && <div className="alert alert-danger">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}

                <form onSubmit={handleSubmit(submitHandler)} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                    <div className="text-start">
                        <label className="form-label">New Password</label>
                        <input
                            type='password'
                            className="form-control"
                            {...register("password", { required: "Password is required", minLength: { value: 6, message: "Minimum 6 characters" } })}
                            placeholder="Enter new password"
                        />
                        {errors.password && <small className="text-danger">{errors.password.message}</small>}
                    </div>

                    <button type='submit' disabled={loading} className="btn btn-success w-100">
                        {loading ? "Resetting..." : "Reset Password"}
                    </button>
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

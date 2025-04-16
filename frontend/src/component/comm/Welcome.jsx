import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./index.css";  // Ensure you import your global styles

const Welcome = () => {
  return (
    <div className="welcome-container">
      <div
        className="card shadow-lg p-5 text-center border-0 rounded-4"
        style={{
          maxWidth: "1200px",
          width: "90%",
          background: "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(12px)",
          boxShadow: "0 12px 30px rgba(0, 0, 0, 0.3)",
          transition: "transform 0.3s ease"
        }}
      >
        <div className="mb-4">
          <h1 className="display-3 fw-bold text-primary">🚀 Project Tracker</h1>
          <p className="lead text-secondary">
            Organize, collaborate, and achieve your goals efficiently.
            <br />
            Manage your projects with ease and precision.
          </p>
        </div>

        <div className="row text-center my-5">
          <div className="col-md-4 mb-4">
            <i className="fas fa-tasks fa-4x text-info"></i>
            <h5 className="mt-3 fw-bold">Project Management</h5>
            <p className="text-muted">Track tasks, deadlines, and milestones.</p>
          </div>
          <div className="col-md-4 mb-4">
            <i className="fas fa-users fa-4x text-warning"></i>
            <h5 className="mt-3 fw-bold">Team Collaboration</h5>
            <p className="text-muted">Seamlessly collaborate with your team.</p>
          </div>
          <div className="col-md-4 mb-4">
            <i className="fas fa-chart-line fa-4x text-success"></i>
            <h5 className="mt-3 fw-bold">Analytics & Reports</h5>
            <p className="text-muted">Get detailed insights and reports.</p>
          </div>
        </div>

        <div className="d-flex justify-content-center gap-4 mt-4">
          <Link to="/signup">
            <button
              className="btn btn-primary btn-lg px-5 py-2 shadow rounded-pill"
              style={{ transition: "0.3s" }}
            >
              🚀 Get Started → Sign Up
            </button>
          </Link>
          <Link to="/login">
            <button
              className="btn btn-outline-primary btn-lg px-5 py-2 shadow rounded-pill"
              style={{ transition: "0.3s" }}
            >
              🔑 Login
            </button>
          </Link>
        </div>

        <p className="mt-5 text-muted">Empower your productivity 🌟</p>
      </div>
    </div>
  );
};

export default Welcome;

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  CheckCircle,
  Briefcase,
  AlertCircle,
  Users,
  Folder,
  Calendar,
} from "lucide-react";
import {
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Line,
  CartesianGrid,
} from "recharts";
import "./Dash.css";

export default function Dash() {
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersResponse, projectsResponse] = await Promise.all([
          axios.get("http://localhost:9000/api/users/users", {
            withCredentials: true,
          }),
          axios.get("http://localhost:9000/api/projects/all-projects", {
            withCredentials: true,
          }),
        ]);
        setUsers(usersResponse.data);
        setProjects(projectsResponse.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Derived Stats
  const totalProjects = projects.length;
  const workingProjects = projects.filter(
    (p) => p.status === "Working"
  ).length;
  const completedProjects = projects.filter(
    (p) => p.status === "Completed"
  ).length;

  // Sample Chart Data
  const data = [
    { day: "Mon", tasks: 2 },
    { day: "Tue", tasks: 4 },
    { day: "Wed", tasks: 1 },
    { day: "Thu", tasks: 5 },
    { day: "Fri", tasks: 3 },
  ];

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Overview of Users, Projects, and Tasks</p>
      </header>

      {loading ? (
        <div className="loading">Loading data...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <div className="dashboard-content">
          {/* Statistics Cards */}
          <div className="stats-grid">
            {/* Total Users */}
            <div className="card">
              <div className="card-icon users-icon">
                <Users size={40} />
              </div>
              <div className="card-info">
                <h3>{users.length}</h3>
                <p>Total Users</p>
              </div>
            </div>

            {/* Total Projects */}
            <div className="card">
              <div className="card-icon projects-icon">
                <Folder size={40} />
              </div>
              <div className="card-info">
                <h3>{totalProjects}</h3>
                <p>Total Projects</p>
              </div>
            </div>

            {/* Working Projects */}
            <div className="card">
              <div className="card-icon projects-icon">
                <Briefcase size={40} />
              </div>
              <div className="card-info">
                <h3>{workingProjects}</h3>
                <p>Working Projects</p>
              </div>
            </div>

            {/* Completed Projects */}
            <div className="card">
              <div className="card-icon projects-icon">
                <CheckCircle size={40} />
              </div>
              <div className="card-info">
                <h3>{completedProjects}</h3>
                <p>Completed Projects</p>
              </div>
            </div>

            {/* Overdue Tasks */}
            <div className="card">
              <div className="card-icon overdue-icon">
                <AlertCircle size={40} />
              </div>
              <div className="card-info">
                <h3>3</h3>
                <p>Overdue Tasks</p>
              </div>
            </div>

            {/* Upcoming Events */}
            <div className="card">
              <div className="card-icon events-icon">
                <Calendar size={40} />
              </div>
              <div className="card-info">
                <h3>5</h3>
                <p>Upcoming Events</p>
              </div>
            </div>
          </div>

          {/* Line Chart */}
          <div className="chart-container">
            <h2>Tasks Completed Over the Week</h2>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="tasks"
                  stroke="#4CAF50"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}

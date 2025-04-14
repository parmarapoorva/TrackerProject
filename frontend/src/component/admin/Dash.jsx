import React, { useEffect, useState } from "react";
import axios from "axios";
import { Users, Folder, AlertCircle, Calendar } from "lucide-react";
import { LineChart, XAxis, YAxis, Tooltip, ResponsiveContainer, Line, CartesianGrid } from "recharts";
import "./Dash.css";

const API_BASE_URL = "https://trackerproject-backend.onrender.com";  // Render backend URL

export default function Dash() {
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersResponse, projectsResponse] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/users/users`, { withCredentials: true }),
          axios.get(`${API_BASE_URL}/api/projects/all-projects`, { withCredentials: true }),
        ]);

        setUsers(usersResponse.data);
        setProjects(projectsResponse.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data. Please try again later.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate statistics
  const overdueTasks = projects.filter(
    (project) => new Date(project.completionDate) < new Date() && project.status !== "Complete"
  ).length;

  const upcomingEvents = projects.filter(
    (project) => new Date(project.startDate) > new Date()
  ).length;

  // Generate dynamic chart data (Projects added by day)
  const getChartData = () => {
    const today = new Date();
    const chartData = [];

    for (let i = 6; i >= 0; i--) {
      const day = new Date(today);
      day.setDate(today.getDate() - i);

      const dayLabel = day.toLocaleDateString("en-US", { weekday: "short" });
      const projectsOnDay = projects.filter(
        (project) => new Date(project.startDate).toDateString() === day.toDateString()
      ).length;

      chartData.push({ day: dayLabel, projects: projectsOnDay });
    }

    return chartData;
  };

  const chartData = getChartData();

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
              <div className="card-icon users-icon"><Users size={40} /></div>
              <div className="card-info">
                <h3>{users.length}</h3>
                <p>Total Users</p>
              </div>
            </div>

            {/* Total Projects */}
            <div className="card">
              <div className="card-icon projects-icon"><Folder size={40} /></div>
              <div className="card-info">
                <h3>{projects.length}</h3>
                <p>Total Projects</p>
              </div>
            </div>

            {/* Overdue Tasks */}
            <div className="card">
              <div className="card-icon overdue-icon"><AlertCircle size={40} /></div>
              <div className="card-info">
                <h3>{overdueTasks}</h3>
                <p>Overdue Tasks</p>
              </div>
            </div>

            {/* Upcoming Events */}
            <div className="card">
              <div className="card-icon events-icon"><Calendar size={40} /></div>
              <div className="card-info">
                <h3>{upcomingEvents}</h3>
                <p>Upcoming Events</p>
              </div>
            </div>
          </div>

          {/* Line Chart */}
          <div className="chart-container">
            <h2>Projects Created Over the Week</h2>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="projects" stroke="#4CAF50" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}

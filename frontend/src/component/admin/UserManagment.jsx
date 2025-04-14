import React, { useEffect, useState } from "react";
import axios from "axios";
import "./UserManagement.css";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("");
  const [role, setRole] = useState("");
  const [roles, setRoles] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const API_BASE_URL = "https://trackerproject-backend.onrender.com/api";

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  const fetchUsers = () => {
    axios
      .get(`${API_BASE_URL}/users/users`, { withCredentials: true })
      .then((response) => {
        setUsers(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
        setError("Failed to load users.");
        setLoading(false);
      });
  };

  const fetchRoles = () => {
    axios
      .get(`${API_BASE_URL}/roles`)
      .then((response) => setRoles(response.data))
      .catch((error) => console.error("Error fetching roles:", error));
  };

  const handleAddUser = (e) => {
    e.preventDefault();
    axios
      .post(
        `${API_BASE_URL}/users/signup`,
        { name, email, password, gender, role },
        { withCredentials: true }
      )
      .then((response) => {
        setUsers([...users, response.data]);
        setName("");
        setEmail("");
        setPassword("");
        setGender("");
        setRole("");
        setShowForm(false);
      })
      .catch((error) => {
        console.error("Error adding user:", error);
        setError("Failed to add user.");
      });
  };

  const handleDeleteUser = (userId) => {
    axios
      .delete(`${API_BASE_URL}/users/delete/${userId}`, { withCredentials: true })
      .then(() => {
        setUsers(users.filter((user) => user._id !== userId));
      })
      .catch((error) => {
        console.error("Error deleting user:", error);
        setError("Failed to delete user.");
      });
  };

  return (
    <div className="content">
      {/* ✅ Header Section */}
      <div className="user-management-header">
        <h1>👥 User Management</h1>
        <button onClick={() => setShowForm(!showForm)}>
          {showForm ? "➖ Hide Form" : "➕ Add User"}
        </button>
      </div>

      {/* ✅ Add User Form */}
      {showForm && (
        <form className="user-form" onSubmit={handleAddUser}>
          <div className="form-group">
            <label>Name:</label>
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Gender:</label>
            <select value={gender} onChange={(e) => setGender(e.target.value)} required>
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>Role:</label>
            <select value={role} onChange={(e) => setRole(e.target.value)} required>
              <option value="">Select Role</option>
              {roles.map((r) => (
                <option key={r._id} value={r._id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className="btn-submit">
            Add User
          </button>
        </form>
      )}

      {/* ✅ Table with Users */}
      <div className="user-management-container">
        {loading ? (
          <p>Loading users...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : (
          <table className="user-management-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Gender</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user, index) => (
                  <tr key={user._id}>
                    <td>{index + 1}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.gender}</td>
                    <td>{user.roleName}</td>
                    <td>
                      <button
                        className="btn-delete"
                        onClick={() => handleDeleteUser(user._id)}
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

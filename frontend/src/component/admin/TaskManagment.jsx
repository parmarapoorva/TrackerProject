import React, { useState, useEffect } from "react";
import { Button, Form, Table, Pagination, Modal } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

export default function TaskManagement() {
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "Low",
    totalMinutes: "",
    moduleId: "",
    projectId: "",
    statusId: "",
  });

  const [projects, setProjects] = useState([]);
  const [modules, setModules] = useState([]);
  const [statuses, setStatuses] = useState([]);

  // ✅ Fetch initial data on load
  useEffect(() => {
    axios.get("http://localhost:9000/api/tasks")
      .then((res) => setTasks(res.data.tasks))
      .catch((error) => console.error("Error fetching tasks:", error));

    axios.get("http://localhost:9000/api/projects/all-projects")
      .then((res) => setProjects(res.data))
      .catch((error) => console.error("Error fetching projects:", error));

    axios.get("http://localhost:9000/api/statuses")
      .then((res) => setStatuses(res.data))
      .catch((error) => console.error("Error fetching statuses:", error));
  }, []);

  // ✅ Fetch modules related to selected project
  const fetchModules = (projectId) => {
    if (projectId) {
      axios.get(`http://localhost:9000/api/module/project-modules/${projectId}`)
        .then((res) => {
          console.log("Modules response:", res.data);  // 👈 Check the response structure
          setModules(Array.isArray(res.data) ? res.data : res.data.modules || []);
        })
        .catch((error) => {
          console.error("Error fetching modules:", error);
          setModules([]);  // 👈 Ensure it falls back to an empty array
        });

    }
  };

  // ✅ Filter and Search Logic
  const filteredTasks = tasks
    .filter((task) =>
      (filter === "All" || task.statusId?.statusName === filter) &&
      task.title.toLowerCase().includes(search.toLowerCase())
    )
    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const totalPages = Math.ceil(tasks.length / itemsPerPage);

  // ✅ Pagination Controls
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // ✅ Handle Delete Action
  const handleDelete = (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this task?");
    if (confirmDelete) {
      axios.delete(`http://localhost:9000/api/tasks/${id}`)
        .then(() => {
          setTasks(tasks.filter((task) => task._id !== id));
        })
        .catch((error) => console.error("Error deleting task:", error));
    }
  };

  // ✅ Handle Add Task Form Submit
  const handleAddTask = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:9000/api/tasks", newTask);
      setShowModal(false);

      // ✅ Refresh the task list
      const response = await axios.get("http://localhost:9000/api/tasks");
      setTasks(response.data.tasks);

      // ✅ Clear the form
      setNewTask({
        title: "",
        description: "",
        priority: "Low",
        totalMinutes: "",
        moduleId: "",
        projectId: "",
        statusId: "",
      });
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  // ✅ Handle Form Field Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewTask({ ...newTask, [name]: value });

    // ✅ Trigger module fetch when selecting a project
    if (name === "projectId") {
      fetchModules(value);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Task Management</h1>

      {/* ✅ Controls */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <Form.Control
          type="text"
          placeholder="Search Tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-25"
        />
        <Form.Select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-25"
        >
          <option value="All">All</option>
          <option value="Not Started">Not Started</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
          <option value="On Hold">On Hold</option>
        </Form.Select>
        <Button variant="success" onClick={() => setShowModal(true)}>
          <FontAwesomeIcon icon={faPlus} /> Add Task
        </Button>
      </div>

      {/* ✅ Task Table */}
      <Table striped bordered hover responsive>
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Title</th>
            <th>Project</th>
            <th>Module</th>
            <th>Status</th>
            <th>Priority</th>
            <th>Total Minutes</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task, index) => (
              <tr key={task._id}>
                <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                <td>{task.title}</td>
                <td>{task.projectId?.pname || "N/A"}</td>
                <td>{task.moduleId?.moduleName || "N/A"}</td>
                <td>{task.statusId?.statusName || "N/A"}</td>
                <td>{task.priority}</td>
                <td>{task.totalMinutes}</td>
                <td>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(task._id)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="text-center">No tasks found.</td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* ✅ Add Task Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddTask}>
            <Form.Group>
              <Form.Label>Title</Form.Label>
              <Form.Control
                name="title"
                value={newTask.title}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mt-2">
              <Form.Label>Description</Form.Label>
              <Form.Control
                name="description" 
                value={newTask.description}
                onChange={handleChange}
                required
              />
            </Form.Group>


            <Form.Group className="mt-2">
              <Form.Label>Project</Form.Label>
              <Form.Select name="projectId" onChange={handleChange} required>
                <option value="">Select Project</option>
                {projects.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.pname}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mt-2">
              <Form.Label>Module</Form.Label>
              <Form.Select name="moduleId" onChange={handleChange} required>
                <option value="">Select Module</option>
                {modules.map((m) => (
                  <option key={m._id} value={m._id}>{m.moduleName}</option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mt-2">
              <Form.Label>Total Minutes</Form.Label>
              <Form.Control type="number" name="totalMinutes" value={newTask.totalMinutes} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="mt-2">
              <Form.Label>Status</Form.Label>
              <Form.Select name="statusId" onChange={handleChange} required>
                <option value="">Select Status</option>
                {statuses.map((s) => (
                  <option key={s._id} value={s._id}>{s.statusName}</option>
                ))}
              </Form.Select>
            </Form.Group>

            <Button className="mt-3" type="submit" variant="success">Add Task</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import TaskCard from '../components/TaskCard';
import TaskFormModal from '../components/TaskFormModal';

const API_BASE = 'http://localhost:5001/api/tasks';

const Dashboard = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);

  // Fetch all tasks for logged-in user
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('student_token');
      const response = await axios.get(API_BASE, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Save Task (Create or Update)
  const handleSaveTask = async (taskData) => {
    try {
      const token = localStorage.getItem('student_token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      if (taskToEdit) {
        await axios.put(`${API_BASE}/${taskToEdit._id}`, taskData, config);
      } else {
        await axios.post(API_BASE, taskData, config);
      }

      setIsModalOpen(false);
      setTaskToEdit(null);
      fetchTasks();
    } catch (err) {
      alert('Failed to save task');
    }
  };

  // Quick Status Change from card dropdown
  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('student_token');
      await axios.put(
        `${API_BASE}/${id}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks(tasks.map((t) => (t._id === id ? { ...t, status: newStatus } : t)));
    } catch (err) {
      alert('Failed to update status');
    }
  };

  // Delete Task
  const handleDeleteTask = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    try {
      const token = localStorage.getItem('student_token');
      await axios.delete(`${API_BASE}/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(tasks.filter((t) => t._id !== id));
    } catch (err) {
      alert('Failed to delete task');
    }
  };

  // Filter tasks using client-side JavaScript array methods
  const filteredTasks = tasks.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.subject && t.subject.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'All' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate stats
  const totalCount = tasks.length;
  const pendingCount = tasks.filter((t) => t.status === 'Pending').length;
  const completedCount = tasks.filter((t) => t.status === 'Completed').length;

  return (
    <div>
      {/* Header */}
      <div className="dashboard-header">
        <div className="dashboard-title">
          <h2>Welcome, {user?.name}</h2>
          <p>{user?.branch} {user?.rollNumber ? `| Roll No: ${user.rollNumber}` : ''}</p>
        </div>
        <button
          onClick={() => {
            setTaskToEdit(null);
            setIsModalOpen(true);
          }}
          className="btn btn-primary"
        >
          + Add Task
        </button>
      </div>

      {/* Simple Stats Summary */}
      <div className="stats-bar">
        <div className="stat-item">
          <span className="stat-label">Total Tasks</span>
          <span className="stat-number">{totalCount}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Pending</span>
          <span className="stat-number">{pendingCount}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Completed</span>
          <span className="stat-number">{completedCount}</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="filter-bar">
        <input
          type="text"
          className="search-input"
          placeholder="Search tasks by title or subject..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="filter-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {/* Tasks List */}
      {loading ? (
        <p style={{ textAlign: 'center', padding: '20px', color: '#6b7280' }}>
          Loading tasks...
        </p>
      ) : filteredTasks.length === 0 ? (
        <div className="empty-box">
          <p>No tasks found.</p>
          <button
            onClick={() => {
              setTaskToEdit(null);
              setIsModalOpen(true);
            }}
            className="btn btn-primary btn-sm"
          >
            Create a Task
          </button>
        </div>
      ) : (
        <div className="tasks-grid">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onUpdateStatus={handleUpdateStatus}
              onEdit={(t) => {
                setTaskToEdit(t);
                setIsModalOpen(true);
              }}
              onDelete={handleDeleteTask}
            />
          ))}
        </div>
      )}

      {/* Task Modal */}
      <TaskFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setTaskToEdit(null);
        }}
        onSave={handleSaveTask}
        taskToEdit={taskToEdit}
      />
    </div>
  );
};

export default Dashboard;

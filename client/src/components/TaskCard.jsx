import React from 'react';

const TaskCard = ({ task, onUpdateStatus, onEdit, onDelete }) => {
  const getPriorityClass = (priority) => {
    if (priority === 'High') return 'priority-high';
    if (priority === 'Medium') return 'priority-medium';
    return 'priority-low';
  };

  const formattedDate = task.dueDate ? task.dueDate.substring(0, 10) : 'No due date';

  return (
    <div className="task-card">
      <div className="task-card-header">
        <span className="task-subject">{task.subject || 'General'}</span>
        <span className={`task-priority ${getPriorityClass(task.priority)}`}>
          {task.priority}
        </span>
      </div>

      <h4 className={`task-title ${task.status === 'Completed' ? 'task-completed' : ''}`}>
        {task.title}
      </h4>

      {task.description && (
        <p className="task-desc">{task.description}</p>
      )}

      <div className="task-footer">
        <div className="task-due">Due: {formattedDate}</div>

        <div className="task-actions-row">
          <select
            value={task.status}
            onChange={(e) => onUpdateStatus(task._id, e.target.value)}
            className="status-dropdown"
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>

          <div className="task-btns">
            <button
              onClick={() => onEdit(task)}
              className="btn btn-secondary btn-sm"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(task._id)}
              className="btn btn-danger btn-sm"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;

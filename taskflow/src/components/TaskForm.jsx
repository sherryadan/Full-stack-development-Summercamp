import { useEffect, useState } from 'react'
import { useAuth } from './AuthProvider.jsx'
import {
  createTasks,
  deleteTasks,
  getTasks,
  updateTask,
} from '../services/taskservice.js'
import './TaskForm.css'

const PRIORITIES = ['low', 'medium', 'high']

function formatCreatedAt(value) {
  if (!value) return ''
  return new Date(value).toLocaleString()
}

function TaskForm() {
  const { user } = useAuth()
  const userId = user?.id ?? null
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState('medium')
  const [error, setError] = useState('')
  const [tasks, setTasks] = useState([])
  const [editingTask, setEditingTask] = useState(null)
  const [editTitle, setEditTitle] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [editPriority, setEditPriority] = useState('medium')
  const [editError, setEditError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function loadTasks() {
      const result = await getTasks(userId)
      if (cancelled) return

      if (result.error) {
        setError(result.error)
        setTasks([])
        return
      }

      setError('')
      setTasks(result.data)
    }

    loadTasks()

    return () => {
      cancelled = true
    }
  }, [userId])

  useEffect(() => {
    if (!editingTask) return

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    function handleKeyDown(event) {
      if (event.key === 'Escape') handleCloseEdit()
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = originalOverflow
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [editingTask])

  async function handleSubmit(event) {
    event.preventDefault()

    const result = await createTasks({
      title,
      description,
      priority,
      user_id: userId,
    })

    if (result.error) {
      setError(result.error)
      return
    }

    setTasks((current) => [result.data, ...current])
    setTitle('')
    setDescription('')
    setPriority('medium')
    setError('')
  }

  async function handleToggle(task) {
    const result = await updateTask(task.id, { completed: !task.completed })

    if (result.error) {
      setError(result.error)
      return
    }

    setTasks((current) =>
      current.map((item) => (item.id === task.id ? result.data : item)),
    )
    setError('')
  }

  function handleOpenEdit(task) {
    setEditingTask(task)
    setEditTitle(task.title)
    setEditDescription(task.description ?? '')
    setEditPriority(task.priority)
    setEditError('')
  }

  function handleCloseEdit() {
    setEditingTask(null)
    setEditError('')
  }

  async function handleSaveEdit(event) {
    event.preventDefault()

    if (!editingTask) return

    setSaving(true)

    const result = await updateTask(editingTask.id, {
      title: editTitle,
      description: editDescription,
      priority: editPriority,
    })

    setSaving(false)

    if (result.error) {
      setEditError(result.error)
      return
    }

    setTasks((current) =>
      current.map((item) => (item.id === editingTask.id ? result.data : item)),
    )
    handleCloseEdit()
  }

  async function handleDelete(taskId) {
    const result = await deleteTasks(taskId)

    if (result.error) {
      setError(result.error)
      return
    }

    setTasks((current) => current.filter((item) => item.id !== taskId))
    setError('')
  }

  return (
    <section id="tasks" className="task-form-section">
      <h2>Add a task</h2>
      <p>Title, description, and priority are stored with each task.</p>

      <form className="task-form" onSubmit={handleSubmit}>
        <label htmlFor="taskTitle">Title</label>
        <input
          id="taskTitle"
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="What needs to get done?"
          maxLength={200}
          autoComplete="off"
          required
        />

        <label htmlFor="taskDescription">Description</label>
        <textarea
          id="taskDescription"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Optional details"
          maxLength={2000}
          rows={3}
        />

        <div className="task-form-row">
          <label htmlFor="taskPriority">
            Priority
            <select
              id="taskPriority"
              value={priority}
              onChange={(event) => setPriority(event.target.value)}
            >
              {PRIORITIES.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </label>
          <button type="submit">Add task</button>
        </div>
      </form>

      {error ? <p className="task-form-error">{error}</p> : null}

      {tasks.length > 0 ? (
        <ul className="task-form-list">
          {tasks.map((task) => (
            <li
              key={task.id}
              className={task.completed ? 'is-completed' : undefined}
            >
              <div className="task-card-top">
                <h3>{task.title}</h3>
                <span className={`task-priority task-priority-${task.priority}`}>
                  {task.priority}
                </span>
              </div>
              {task.description ? <p>{task.description}</p> : null}
              <div className="task-card-meta">
                <span>{formatCreatedAt(task.created_at)}</span>
                <div className="task-card-actions">
                  <button type="button" onClick={() => handleToggle(task)}>
                    {task.completed ? 'Mark incomplete' : 'Mark complete'}
                  </button>
                  <button type="button" onClick={() => handleOpenEdit(task)}>
                    Edit
                  </button>
                  <button type="button" onClick={() => handleDelete(task.id)}>
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="task-form-empty">No tasks yet. Add your first one.</p>
      )}

      {editingTask ? (
        <div
          className="task-modal-overlay"
          role="presentation"
          onClick={handleCloseEdit}
        >
          <div
            className="task-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="taskEditTitle"
            onClick={(event) => event.stopPropagation()}
          >
            <h3 id="taskEditTitle">Edit task</h3>

            <form className="task-modal-form" onSubmit={handleSaveEdit}>
              <label htmlFor="taskEditTitleInput">Title</label>
              <input
                id="taskEditTitleInput"
                type="text"
                value={editTitle}
                onChange={(event) => setEditTitle(event.target.value)}
                placeholder="What needs to get done?"
                maxLength={200}
                autoComplete="off"
                required
              />

              <label htmlFor="taskEditDescriptionInput">Description</label>
              <textarea
                id="taskEditDescriptionInput"
                value={editDescription}
                onChange={(event) => setEditDescription(event.target.value)}
                placeholder="Optional details"
                maxLength={2000}
                rows={3}
              />

              <label htmlFor="taskEditPrioritySelect">
                Priority
                <select
                  id="taskEditPrioritySelect"
                  value={editPriority}
                  onChange={(event) => setEditPriority(event.target.value)}
                >
                  {PRIORITIES.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </label>

              {editError ? (
                <p className="task-form-error">{editError}</p>
              ) : null}

              <div className="task-modal-actions">
                <button
                  type="button"
                  className="task-modal-cancel"
                  onClick={handleCloseEdit}
                >
                  Cancel
                </button>
                <button type="submit" disabled={saving}>
                  {saving ? 'Saving…' : 'Save changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </section>
  )
}

export default TaskForm

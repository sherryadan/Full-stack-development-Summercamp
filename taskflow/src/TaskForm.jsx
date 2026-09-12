import { useState } from 'react'
import './TaskForm.css'

function TaskForm() {
  const [taskText, setTaskText] = useState('')
  const [error, setError] = useState('')
  const [tasks, setTasks] = useState([])

  function handleSubmit(event) {
    event.preventDefault()

    const text = taskText.trim()
    if (text === '') {
      setError('Please enter a task')
      return
    }

    setTasks((current) => [
      ...current,
      { id: Date.now(), text },
    ])
    setTaskText('')
    setError('')
  }

  return (
    <section id="tasks" className="task-form-section">
      <h2>Add a task</h2>
      <p>Enter something you need to get done.</p>

      <form className="task-form" onSubmit={handleSubmit}>
        <label className="sr-only" htmlFor="taskInput">
          New task
        </label>
        <input
          id="taskInput"
          type="text"
          value={taskText}
          onChange={(event) => setTaskText(event.target.value)}
          placeholder="Enter a new task"
          autoComplete="off"
        />
        <button type="submit">Add</button>
      </form>

      {error ? <p className="task-form-error">{error}</p> : null}

      {tasks.length > 0 ? (
        <ul className="task-form-list">
          {tasks.map((task) => (
            <li key={task.id}>{task.text}</li>
          ))}
        </ul>
      ) : (
        <p className="task-form-empty">No tasks yet. Add your first one.</p>
      )}
    </section>
  )
}

export default TaskForm

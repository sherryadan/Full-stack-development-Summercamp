import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Nav from './nav.jsx'
import TaskForm from './TaskForm.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Nav />
    <TaskForm />
  </StrictMode>,
)

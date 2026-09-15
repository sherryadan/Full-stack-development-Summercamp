import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import Nav from '../components/nav.jsx'
import { useAuth } from '../components/AuthProvider.jsx'
import { signIn } from '../services/authservice.js'
import './auth.css'

function Login() {
  const navigate = useNavigate()
  const { user, loading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (!loading && user) {
    return <Navigate to="/" replace />
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setSuccess('')
    setSubmitting(true)

    const result = await signIn({ email, password })
    setSubmitting(false)

    if (result.error) {
      setError(result.error)
      return
    }

    setSuccess('Logged in successfully.')
    navigate('/')
  }

  return (
    <>
      <Nav />
      <section className="auth-page">
        <div className="auth-card">
          <h1>Log in</h1>
          <p>Welcome back to Taskflow.</p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <label htmlFor="email">
              Email
              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                required
                disabled={submitting}
              />
            </label>
            <label htmlFor="password">
              Password
              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                required
                disabled={submitting}
              />
            </label>
            <button type="submit" disabled={submitting}>
              {submitting ? 'Logging in...' : 'Log in'}
            </button>
          </form>

          {error ? <p className="auth-error">{error}</p> : null}
          {success ? <p className="auth-success">{success}</p> : null}

          <p className="auth-switch">
            Need an account? <Link to="/signup">Sign up</Link>
          </p>
        </div>
      </section>
    </>
  )
}

export default Login

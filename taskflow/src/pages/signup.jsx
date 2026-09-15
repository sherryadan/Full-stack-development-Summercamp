import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import Nav from '../components/nav.jsx'
import { useAuth } from '../components/AuthProvider.jsx'
import { signUp } from '../services/authservice.js'
import './auth.css'

function Signup() {
  const navigate = useNavigate()
  const { user, loading } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
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

    const result = await signUp({ name, email, password, confirmPassword })
    setSubmitting(false)

    if (result.error) {
      setError(result.error)
      return
    }

    if (result.data?.session) {
      setSuccess('Account created. You are now logged in.')
      navigate('/')
      return
    }

    setSuccess('Account created. Check your email to confirm, then log in.')
    setPassword('')
    setConfirmPassword('')
  }

  return (
    <>
      <Nav />
      <section className="auth-page">
        <div className="auth-card">
          <h1>Sign up</h1>
          <p>Create your Taskflow account.</p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <label htmlFor="name">
              Name
              <input
                id="name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Your name"
                maxLength={80}
                autoComplete="name"
                required
                disabled={submitting}
              />
            </label>
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
                autoComplete="new-password"
                required
                minLength={6}
                disabled={submitting}
              />
            </label>
            <label htmlFor="confirmPassword">
              Retype password
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                autoComplete="new-password"
                required
                minLength={6}
                disabled={submitting}
              />
            </label>
            <button type="submit" disabled={submitting}>
              {submitting ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          {error ? <p className="auth-error">{error}</p> : null}
          {success ? <p className="auth-success">{success}</p> : null}

          <p className="auth-switch">
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </div>
      </section>
    </>
  )
}

export default Signup

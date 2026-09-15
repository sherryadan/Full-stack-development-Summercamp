import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from './AuthProvider.jsx'
import { signOut } from '../services/authservice.js'
import './nav.css'

function Nav() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)
  const [error, setError] = useState('')
  const menuRef = useRef(null)

  const closeMenu = () => setOpen(false)
  const closeProfileMenu = () => setMenuOpen(false)

  const displayName = user?.user_metadata?.name || user?.email?.split('@')[0] || ''
  const initial = (displayName || '?').charAt(0).toUpperCase()

  useEffect(() => {
    if (!menuOpen) return undefined

    function onPointerDown(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false)
      }
    }

    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [menuOpen])

  async function handleLogout() {
    setLoggingOut(true)
    setError('')

    const result = await signOut()
    setLoggingOut(false)

    if (result.error) {
      setError(result.error)
      return
    }

    closeMenu()
    closeProfileMenu()
    navigate('/login')
  }

  return (
    <header className="navbar">
      <Link className="navbar-brand" to="/" onClick={closeMenu}>
        <span className="navbar-mark" aria-hidden="true">
          TF
        </span>
        Taskflow
      </Link>

      <button
        type="button"
        className="navbar-toggle"
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <span />
        <span />
        <span />
      </button>

      <nav className={open ? 'navbar-links is-open' : 'navbar-links'} aria-label="Primary">
        {user ? (
          <NavLink to="/" end onClick={closeMenu}>
            Dashboard
          </NavLink>
        ) : (
          <>
            <NavLink to="/login" onClick={closeMenu}>
              Log in
            </NavLink>
            <NavLink className="navbar-cta" to="/signup" onClick={closeMenu}>
              Sign up
            </NavLink>
          </>
        )}
      </nav>

      {user ? (
        <div className="navbar-profile" ref={menuRef}>
          <button
            type="button"
            className="navbar-avatar"
            aria-label={`Account menu for ${displayName}`}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((value) => !value)}
          >
            {initial}
          </button>
          {menuOpen ? (
            <div className="navbar-menu">
              <p className="navbar-menu-name">{displayName}</p>
              <p className="navbar-menu-email">{user.email}</p>
              <button
                type="button"
                className="navbar-menu-logout"
                onClick={handleLogout}
                disabled={loggingOut}
              >
                {loggingOut ? 'Logging out...' : 'Log out'}
              </button>
              {error ? <p className="navbar-menu-error">{error}</p> : null}
            </div>
          ) : null}
        </div>
      ) : null}

      {error ? <p className="navbar-error">{error}</p> : null}
    </header>
  )
}

export default Nav

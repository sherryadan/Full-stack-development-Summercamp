import { useState } from 'react'
import './nav.css'

function Nav() {
  const [open, setOpen] = useState(false)

  const closeMenu = () => setOpen(false)

  return (
    <header className="navbar">
      <a className="navbar-brand" href="#center" onClick={closeMenu}>
        <span className="navbar-mark" aria-hidden="true">
          TF
        </span>
        Taskflow
      </a>

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
        <a href="#center" onClick={closeMenu}>
          Home
        </a>
        <a href="#tasks" onClick={closeMenu}>
          Tasks
        </a>
        <a href="#docs" onClick={closeMenu}>
          Docs
        </a>
        <a href="#social" onClick={closeMenu}>
          Community
        </a>
        <a className="navbar-cta" href="#center" onClick={closeMenu}>
          Get started
        </a>
      </nav>
    </header>
  )
}

export default Nav

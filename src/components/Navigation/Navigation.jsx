import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import styles from './Navigation.module.css'

/**
 * Navigation component with responsive mobile menu
 * Highlights active route and provides smooth transitions
 */
const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  const isActive = (path) => {
    return location.pathname === path
  }

  return (
    <nav className={styles.nav}>
      <button 
        className={styles.menuToggle}
        onClick={toggleMenu}
        aria-label="Toggle navigation menu"
      >
        <span className={styles.hamburger}></span>
        <span className={styles.hamburger}></span>
        <span className={styles.hamburger}></span>
      </button>
      
      <ul className={`${styles.navList} ${isMenuOpen ? styles.navListOpen : ''}`}>
        <li className={styles.navItem}>
          <Link 
            to="/" 
            className={`${styles.navLink} ${isActive('/') ? styles.navLinkActive : ''}`}
            onClick={closeMenu}
          >
            Home
          </Link>
        </li>
        <li className={styles.navItem}>
          <Link 
            to="/about" 
            className={`${styles.navLink} ${isActive('/about') ? styles.navLinkActive : ''}`}
            onClick={closeMenu}
          >
            About
          </Link>
        </li>
      </ul>
    </nav>
  )
}

export default Navigation
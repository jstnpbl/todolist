import React from 'react'
import styles from './Footer.module.css'

/**
 * Footer component with copyright information
 * Simple, clean design that sticks to the bottom
 */
const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <div className="container">
        <p className={styles.copyright}>
          © {currentYear} React To-Do Starter. Built with React & Vite.
        </p>
      </div>
    </footer>
  )
}

export default Footer
import React from 'react'
import Navigation from '../Navigation/Navigation'
import styles from './Header.module.css'

/**
 * Header component with site title and navigation
 * Responsive design with mobile-friendly navigation
 */
const Header = () => {
  return (
    <header className={styles.header}>
      <div className="container">
        <div className={styles.headerContent}>
          <h1 className={styles.title}>React To-Do Starter</h1>
          <Navigation />
        </div>
      </div>
    </header>
  )
}

export default Header
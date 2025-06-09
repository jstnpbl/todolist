import React from 'react'
import { Link } from 'react-router-dom'
import styles from './NotFound.module.css'

/**
 * 404 Not Found page component
 * Provides user-friendly error handling for invalid routes
 */
const NotFound = () => {
  return (
    <div className={styles.notFound}>
      <div className={styles.content}>
        <div className={styles.errorCode}>404</div>
        <h1 className={styles.title}>Page Not Found</h1>
        <p className={styles.message}>
          Oops! The page you're looking for doesn't exist. 
          It might have been moved, deleted, or you entered the wrong URL.
        </p>
        
        <div className={styles.actions}>
          <Link to="/" className="btn btn-primary">
            Go Home
          </Link>
          <Link to="/about" className="btn btn-secondary">
            Learn More
          </Link>
        </div>
      </div>
    </div>
  )
}
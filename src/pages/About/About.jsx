import React from 'react'
import { Link } from 'react-router-dom'
import styles from './About.module.css'

/**
 * About page component
 * Provides information about the application
 */
const About = () => {
  return (
    <div className={styles.about}>
      <div className={styles.content}>
        <h1>About This App</h1>
        
        <div className={styles.section}>
          <h2>What is this?</h2>
          <p>
            This is a modern React starter project featuring a fully functional to-do list application. 
            It demonstrates best practices for React development including component organization, 
            state management, and responsive design.
          </p>
        </div>

        <div className={styles.section}>
          <h2>Features</h2>
          <ul className={styles.featureList}>
            <li>✅ Add, remove, and mark tasks as completed</li>
            <li>📱 Fully responsive design</li>
            <li>🔍 Filter tasks by status (All, Active, Completed)</li>
            <li>📊 Real-time task statistics</li>
            <li>🎨 Clean, modern UI with CSS Modules</li>
            <li>🚀 Fast development with Vite</li>
            <li>📍 Client-side routing with React Router</li>
          </ul>
        </div>

        <div className={styles.section}>
          <h2>Technology Stack</h2>
          <div className={styles.techStack}>
            <span className={styles.tech}>React 18</span>
            <span className={styles.tech}>Vite</span>
            <span className={styles.tech}>React Router</span>
            <span className={styles.tech}>CSS Modules</span>
            <span className={styles.tech}>ES6+</span>
          </div>
        </div>

        <div className={styles.section}>
          <h2>Getting Started</h2>
          <p>
            This project is perfect for developers who want to quickly bootstrap a React application 
            with modern tooling and best practices. Check out the README for setup instructions.
          </p>
        </div>

        <div className={styles.cta}>
          <Link to="/" className="btn btn-primary">
            Try the To-Do List →
          </Link>
        </div>
      </div>
    </div>
  )
}

export default About
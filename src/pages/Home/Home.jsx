import React from 'react'
import TodoList from '../../components/TodoList/TodoList'
import styles from './Home.module.css'

/**
 * Home page component
 * Contains the main TodoList functionality
 */
const Home = () => {
  return (
    <div className={styles.home}>
      <div className={styles.welcome}>
        <h1>Welcome to Your To-Do App</h1>
        <p>Stay organized and productive with this simple task manager.</p>
      </div>
      <TodoList />
    </div>
  )
}

export default Home
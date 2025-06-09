import React, { useState } from 'react'
import styles from './TodoList.module.css'

/**
 * TodoList component with full CRUD functionality
 * Features: Add, remove, toggle completion, filter tasks
 * Uses React hooks for state management
 */
const TodoList = () => {
  const [todos, setTodos] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [filter, setFilter] = useState('all') // all, active, completed

  // Add a new todo
  const addTodo = () => {
    if (inputValue.trim() !== '') {
      const newTodo = {
        id: Date.now(), // Simple ID generation
        text: inputValue.trim(),
        completed: false,
        createdAt: new Date().toLocaleString()
      }
      setTodos([...todos, newTodo])
      setInputValue('')
    }
  }

  // Remove a todo by ID
  const removeTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  // Toggle todo completion status
  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  // Handle input key press (Enter to add)
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTodo()
    }
  }

  // Filter todos based on current filter
  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed
    if (filter === 'completed') return todo.completed
    return true // 'all'
  })

  // Get counts for different todo states
  const totalTodos = todos.length
  const completedTodos = todos.filter(todo => todo.completed).length
  const activeTodos = totalTodos - completedTodos

  return (
    <div className={styles.todoList}>
      <div className={styles.todoHeader}>
        <h2 className={styles.title}>My To-Do List</h2>
        <div className={styles.stats}>
          <span className={styles.stat}>Total: {totalTodos}</span>
          <span className={styles.stat}>Active: {activeTodos}</span>
          <span className={styles.stat}>Completed: {completedTodos}</span>
        </div>
      </div>

      <div className={styles.inputSection}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Add a new task..."
          className={styles.input}
        />
        <button 
          onClick={addTodo} 
          className="btn btn-primary"
          disabled={!inputValue.trim()}
        >
          Add Task
        </button>
      </div>

      <div className={styles.filterSection}>
        <button
          onClick={() => setFilter('all')}
          className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('active')}
          className={`btn ${filter === 'active' ? 'btn-primary' : 'btn-secondary'}`}
        >
          Active
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`btn ${filter === 'completed' ? 'btn-primary' : 'btn-secondary'}`}
        >
          Completed
        </button>
      </div>

      <div className={styles.todoItems}>
        {filteredTodos.length === 0 ? (
          <div className={styles.emptyState}>
            <p>
              {filter === 'all' 
                ? "No tasks yet. Add one above!" 
                : `No ${filter} tasks.`
              }
            </p>
          </div>
        ) : (
          filteredTodos.map(todo => (
            <div 
              key={todo.id} 
              className={`${styles.todoItem} ${todo.completed ? styles.completed : ''}`}
            >
              <div className={styles.todoContent}>
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                  className={styles.checkbox}
                />
                <div className={styles.todoText}>
                  <span className={styles.text}>{todo.text}</span>
                  <small className={styles.timestamp}>{todo.createdAt}</small>
                </div>
              </div>
              <button
                onClick={() => removeTodo(todo.id)}
                className="btn btn-danger"
                aria-label="Delete task"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default TodoList
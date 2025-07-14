'use client'

import { useState, useEffect } from 'react'
import TodoItem from './TodoItem'
import TodoForm from './TodoForm'

export default function TodoList() {
  const [todos, setTodos] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch todos
  const fetchTodos = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/todos')

      
      if (!response.ok) {
        throw new Error('Failed to fetch todos')
      }
      
      const data = await response.json()
      setTodos(data)
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  // Create todo
  const addTodo = async (title) => {
    try {
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to create todo')
      }
      
      const newTodo = await response.json()
      setTodos([newTodo, ...todos])
    } catch (err) {
      setError(err.message)
    }
  }

  // Update todo
  const updateTodo = async (id, data) => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      
      if (!response.ok) {
        throw new Error('Failed to update todo')
      }
      
      const updatedTodo = await response.json()
      console.log("updatedTodo", updatedTodo)
      setTodos(todos.map(todo => todo.id === id ? updatedTodo : todo))
    } catch (err) {
      setError(err.message)
    }
  }

  // Delete todo
  const deleteTodo = async (id) => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        throw new Error('Failed to delete todo')
      }
      
      setTodos(todos.filter(todo => todo.id !== id))
    } catch (err) {
      setError(err.message)
    }
  }

  // Load todos on component mount
  useEffect(() => {
    fetchTodos()
  }, [])

  return (
    <div className="w-full max-w-md mx-auto">
      <TodoForm onAddTodo={addTodo} />
      
      {isLoading && <p className="text-center py-4">Loading todos...</p>}
      
      {error && (
        <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
          {error}
        </div>
      )}
      
      {!isLoading && todos.length === 0 && (
        <p className="text-center py-4 text-gray-500">No todos yet. Add one above!</p>
      )}
      
      <div className="mt-4">
        {todos.map(todo => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onDelete={deleteTodo}
            onUpdate={updateTodo}
          />
        ))}
      </div>
    </div>
  )
} 
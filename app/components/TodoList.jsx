'use client'

import { useState, useEffect } from 'react'
import TodoItem from './TodoItem'
import TodoForm from './TodoForm'

export default function TodoList() {
  const [todos, setTodos] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [isSearching, setIsSearching] = useState(false)

  // Fetch todos
  const fetchTodos = async (search = '') => {
    try {
      setIsLoading(true)
      const queryParams = search.trim().length >= 3 ? `?search=${encodeURIComponent(search)}` : ''
      const response = await fetch(`/api/todos${queryParams}`)
      
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
      setIsSearching(false)
    }
  }

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value
    setSearchTerm(value)
    
    if (value.trim().length >= 3) {
      setIsSearching(true)
      fetchTodos(value)
    } else if (value.trim().length === 0) {
      fetchTodos('')
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
      
      {/* Search input */}
      <div className="mt-4 mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search todos..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full text-black px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {isSearching && (
            <div className="absolute right-3 top-2.5">
              <div className="w-5 h-5 border-t-2 border-blue-500 border-r-2 rounded-full animate-spin"></div>
            </div>
          )}
        </div>
      </div>
      
      {isLoading && !isSearching && <p className="text-center py-4">Loading todos...</p>}
      
      {error && (
        <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
          {error}
        </div>
      )}
      
      {!isLoading && todos.length === 0 && (
        <p className="text-center py-4 text-gray-500">
          {searchTerm.trim().length >= 3 ? 'No matching todos found.' : 'No todos yet. Add one above!'}
        </p>
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
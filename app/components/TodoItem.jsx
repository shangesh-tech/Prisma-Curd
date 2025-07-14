'use client'

import { useState } from 'react'

export default function TodoItem({ todo, onDelete, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(todo.title)
  const [isLoading, setIsLoading] = useState(false)

  const handleToggleComplete = async () => {
    try {
      setIsLoading(true)
      await onUpdate(todo.id, { completed: !todo.completed })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    if (title.trim() === '') return
    
    try {
      setIsLoading(true)
      await onUpdate(todo.id, { title })
      setIsEditing(false)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    try {
      setIsLoading(true)
      await onDelete(todo.id)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-between p-4 mb-2 bg-white rounded-lg shadow">
      <div className="flex items-center flex-1">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={handleToggleComplete}
          disabled={isLoading}
          className="w-4 h-4 mr-3 cursor-pointer"
        />
        
        {isEditing ? (
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex-1 p-1 border rounded"
            autoFocus
            onBlur={handleSave}
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
          />
        ) : (
          <span 
            className={`flex-1 ${todo.completed ? 'line-through text-gray-500' : ''}`}
            onClick={() => setIsEditing(true)}
          >
            {todo.title}
          </span>
        )}
      </div>
      
      <div className="flex space-x-2">
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            disabled={isLoading}
            className="px-2 py-1 text-xs text-blue-600 hover:text-blue-800"
          >
            Edit
          </button>
        )}
        
        {isEditing && (
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="px-2 py-1 text-xs text-green-600 hover:text-green-800"
          >
            Save
          </button>
        )}
        
        <button
          onClick={handleDelete}
          disabled={isLoading}
          className="px-2 py-1 text-xs text-red-600 hover:text-red-800"
        >
          Delete
        </button>
      </div>
    </div>
  )
} 
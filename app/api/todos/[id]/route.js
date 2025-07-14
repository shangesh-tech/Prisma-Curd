import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

// GET a single todo
export async function GET(request, { params }) {
  try {
    const {id} = await params
    console.log("id", id)
    
    const todo = await prisma.todo.findUnique({
      where: { id },
    })
    
    if (!todo) {
      return NextResponse.json(
        { error: 'Todo not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(todo)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// UPDATE a todo
export async function PATCH(request, { params }) {
  try {
    const {id} = await params
    const body = await request.json()
    
    // Check if todo exists
    const existingTodo = await prisma.todo.findUnique({
      where: { id },
    })
    
    if (!existingTodo) {
      return NextResponse.json(
        { error: 'Todo not found' },
        { status: 404 }
      )
    }
    
    // Update todo
    const updatedTodo = await prisma.todo.update({
      where: { id },
      data: {
        title: body.title !== undefined ? body.title : existingTodo.title,
        completed: body.completed !== undefined ? body.completed : existingTodo.completed,
      },
    })
    
    return NextResponse.json(updatedTodo)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// DELETE a todo
export async function DELETE(request, { params }) {
  try {
    const {id} = await params
    
    // Check if todo exists
    const existingTodo = await prisma.todo.findUnique({
      where: { id },
    })
    
    if (!existingTodo) {
      return NextResponse.json(
        { error: 'Todo not found' },
        { status: 404 }
      )
    }
    
    // Delete todo
    await prisma.todo.delete({
      where: { id },
    })
    
    return NextResponse.json({ message: 'Todo deleted successfully' })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
} 
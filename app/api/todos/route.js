import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

// GET all todos
export async function GET() {
  try {
    const todos = await prisma.todo.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })
    
    return NextResponse.json(todos)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// CREATE a new todo
export async function POST(request) {
  try {
    const body = await request.json()
    
    if (!body.title || body.title.trim() === '') {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      )
    }
    
    const todo = await prisma.todo.create({
      data: {
        title: body.title,
        completed: body.completed,
      },
    })
    
    return NextResponse.json(todo, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
} 
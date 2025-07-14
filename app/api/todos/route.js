import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

// GET all todos
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    
    let whereClause = {}
    
    if (search && search.trim().length >= 3) {
      whereClause = {
        title: {
          contains: search,
          mode: 'insensitive'
        }
      }
    }
    
    const todos = await prisma.todo.findMany({
      where: whereClause,
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
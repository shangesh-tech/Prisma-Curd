# Todo List with Prisma and Next.js

A simple Todo List application built with Next.js 15, Prisma ORM, and PostgreSQL (Neon).

## Features

- Create, read, update, and delete todos
- Mark todos as completed
- Edit todo titles
- Real-time UI updates
- PostgreSQL database with Prisma ORM

## Setup Instructions

### 1. Install dependencies

```bash
npm install
```

### 2. Set up your database

1. Create a Neon PostgreSQL database at [neon.tech](https://neon.tech)
2. Create a `.env` file in the root directory with the following variables:

```
DATABASE_URL="postgres://user:password@endpoint/neondb?sslmode=require&pgbouncer=true"
DIRECT_URL="postgres://user:password@endpoint/neondb?sslmode=require"
```

Replace the placeholder values with your actual Neon database credentials.

### 3. Generate Prisma Client and push schema

```bash
npx prisma generate
npx prisma db push
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `/prisma` - Prisma schema and migrations
- `/app` - Next.js app directory
  - `/api` - API routes for CRUD operations
  - `/components` - React components
- `/lib` - Utility functions and Prisma client instance

## Technologies Used

- Next.js 15
- Prisma ORM
- PostgreSQL (Neon)
- React
- Tailwind CSS

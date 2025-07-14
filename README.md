# Prisma Terminal Commands

| Command | Description |
|---------|-------------|
| `npx prisma init` | Initializes Prisma in your project, creates prisma directory with schema.prisma file |
| `npx prisma generate` | Generates Prisma Client based on your schema |
| `npx prisma db push` | Pushes the schema to the database without migrations |
| `npx prisma migrate dev` | Creates a migration and applies it to the database in development |
| `npx prisma migrate deploy` | Applies pending migrations to the database in production |
| `npx prisma studio` | Opens Prisma Studio, a visual database explorer |
| `npx prisma format` | Formats the schema.prisma file |
| `npx prisma validate` | Validates your Prisma schema |
| `npx prisma db seed` | Runs the seed script defined in package.json |
| `npx prisma db pull` | Pulls the database schema into your Prisma schema (introspection) |

## Detailed Migration Commands

### `npx prisma migrate dev`

Creates and applies migrations in development environment.

**What it does:**
- Creates migration files in your project's `prisma/migrations` folder
- Applies these migrations to your development database (including Neon PostgreSQL)
- Updates your database schema according to your `schema.prisma` file
- Generates Prisma Client by default
- You can see the changes in both Prisma Studio and your actual database

**Flags:**
- `--name <name>` - Specifies the name for the new migration
- `--create-only` - Creates a new migration but doesn't apply it
- `--skip-generate` - Skips generating the Prisma Client
- `--skip-seed` - Skips running seed script after applying the migration
- `--force` - Ignores the error when data would be lost due to the migration
- `--preview-feature` - Uses preview features

**Examples:**
```bash
# Create a migration named "add_user_model"
npx prisma migrate dev --name add_user_model

# Create a migration without applying it
npx prisma migrate dev --create-only --name add_user_model

# Apply migration but skip generating client
npx prisma migrate dev --skip-generate
```

### `npx prisma migrate deploy`

Applies pending migrations to the database in production environment.

**What it does:**
- Takes existing migration files from your project's `prisma/migrations` folder
- Applies them to your production database (e.g., your Neon PostgreSQL instance)
- Does NOT create new migration files
- Designed for production deployments or CI/CD pipelines
- Safe for production use as it follows your migration history

**Flags:**
- `--preview-feature` - Uses preview features
- `--schema <path>` - Specifies the path to the schema file

**Examples:**
```bash
# Deploy migrations in production
npx prisma migrate deploy

# Deploy migrations with a specific schema path
npx prisma migrate deploy --schema=./prisma/schema.prisma
```

### `npx prisma db push`

Directly updates the database schema without creating migrations.

**What it does:**
- Immediately pushes schema changes to your database (including Neon PostgreSQL)
- Does NOT create migration files
- Faster than migrations for quick prototyping
- Can be risky for production as it might cause data loss
- Changes are visible in both Prisma Studio and your actual database

**When to use:**
- During early development/prototyping
- When you don't need migration history
- For quick schema changes in development

**When to avoid:**
- Production environments
- When you need a record of schema changes
- When data preservation is critical

## Complete Migration Example

Let's walk through a complete example of using Prisma migrations to evolve your database schema:

### Initial Setup

1. **Start with a basic schema:**

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Todo {
  id        String   @id @default(uuid())
  title     String
  completed Boolean  @default(false)
  createdAt DateTime @default(now())
}
```

2. **Create your first migration:**

```bash
npx prisma migrate dev --name init
```

This creates a migration file in `prisma/migrations/TIMESTAMP_init/` and applies it to your database. Your database now has a `Todo` table.

### Adding a New Field

1. **Update your schema to add a new field:**

```prisma
model Todo {
  id          String   @id @default(uuid())
  title       String
  completed   Boolean  @default(false)
  description String?  // New optional field
  createdAt   DateTime @default(now())
}
```

2. **Create a migration for this change:**

```bash
npx prisma migrate dev --name add_description_field
```

This creates another migration file and updates your database. Your `Todo` table now has a `description` column.

### Adding a New Model

1. **Update your schema to add a User model and relate it to Todo:**

```prisma
model User {
  id    String @id @default(uuid())
  email String @unique
  name  String
  todos Todo[]
}

model Todo {
  id          String   @id @default(uuid())
  title       String
  completed   Boolean  @default(false)
  description String?
  createdAt   DateTime @default(now())
  userId      String?
  user        User?    @relation(fields: [userId], references: [id])
}
```

2. **Create a migration for these changes:**

```bash
npx prisma migrate dev --name add_user_model
```

This creates another migration file and updates your database with the new `User` table and relationship.

### Deploying to Production

When you're ready to deploy to production:

```bash
npx prisma migrate deploy
```

This applies all your migrations to your production database in the correct order.

### What Happens Behind the Scenes

1. **With `migrate dev`:**
   - Prisma creates SQL files in your migrations directory
   - These SQL files contain the exact changes needed (CREATE TABLE, ALTER TABLE, etc.)
   - Prisma executes these SQL commands on your database
   - Prisma tracks applied migrations in a `_prisma_migrations` table in your database

2. **With `migrate deploy`:**
   - Prisma checks which migrations are already applied by looking at the `_prisma_migrations` table
   - It applies only the new migrations that haven't been applied yet
   - This ensures consistent schema changes across environments

3. **With `db push`:**
   - Prisma compares your schema to the database directly
   - It makes the necessary changes to make the database match your schema
   - No migration files are created or tracked

---
---

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

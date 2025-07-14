import TodoList from './components/TodoList'

export default function Home() {
  return (
    <main className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-2xl mx-auto">
        <h1 className="mb-8 text-3xl font-bold text-center text-gray-800">
          Todo List with Prisma (Postgres sql) & Next.js
        </h1>
        
        <TodoList />
      </div>
    </main>
  )
}

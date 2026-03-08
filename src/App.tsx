import { Outlet } from 'react-router-dom'

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="border-b shadow-sm p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">SMS Frontend</h1>
      </header>
      <main className="flex-1 p-6 flex flex-col">
        <Outlet />
      </main>
    </div>
  )
}

export default App

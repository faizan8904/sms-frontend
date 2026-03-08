import { useState } from "react"
import { Outlet } from "react-router-dom"
import { Sidebar } from "./components/sidebar"
import { Topbar } from "./components/topbar"
import { cn } from "./lib/utils"

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((prev) => !prev)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      <div
        className={cn(
          "flex flex-col transition-all duration-300 ease-in-out",
          // On mobile no margin, on desktop use sidebar width
          "ml-0 md:ml-64",
          sidebarCollapsed && "md:ml-16"
        )}
      >
        <Topbar
          onMenuClick={() => {
            // On mobile toggle the overlay, on desktop toggle collapse
            if (window.innerWidth < 768) {
              setMobileOpen((prev) => !prev)
            } else {
              setSidebarCollapsed((prev) => !prev)
            }
          }}
        />
        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default App

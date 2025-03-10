import { Outlet } from "react-router-dom"
import { Sidebar } from "@/components/ui/Sidebar"

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-purple-50">
      <Sidebar />
      <main className="md:ml-64 pt-16">
        <div className="max-w-3xl mx-auto px-4 py-6">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

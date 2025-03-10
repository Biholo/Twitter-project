import { Link, useLocation } from "react-router-dom"
import { Home, User, Hash, MessageCircle, Bookmark, Settings } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Button } from "./Button"
import unicornLogo from '@/assets/icons/unicorn-logo.svg'

const menuItems = [
  { icon: Home, label: "Accueil", path: "/home" },
  { icon: Hash, label: "Explorer", path: "/explore" },
  { icon: Bookmark, label: "Favoris", path: "/bookmarks" },
  { icon: User, label: "Profil", path: "/profile" },
  { icon: Settings, label: "Paramètres", path: "/settings" },
]

export function Sidebar() {
  const location = useLocation()

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 bg-white/70 backdrop-blur-sm border-r border-pink-100 p-4">
      <Link to="/home" className="flex items-center gap-3 px-4 mb-8">
        <img src={unicornLogo} alt="Logo" className="w-8 h-8" />
        <span className="text-xl font-semibold bg-gradient-to-r from-pink-400 to-blue-400 bg-clip-text text-transparent">
          Tweeter
        </span>
      </Link>

      <nav className="flex-1">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                  "hover:bg-gradient-to-r hover:from-pink-50 hover:to-blue-50",
                  location.pathname === item.path
                    ? "bg-gradient-to-r from-pink-100 to-blue-100 text-gray-800 font-medium"
                    : "text-gray-600"
                )}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <Button
        className="w-full py-3 mt-4 bg-gradient-to-r from-pink-400 to-blue-400 
        text-white rounded-xl font-medium shadow-md hover:shadow-lg 
        transform transition-all duration-200 hover:-translate-y-0.5"
      >
        Tweeter
      </Button>
    </aside>
  )
}

import unicornLogo from '@/assets/icons/unicorn-logo.svg'
import { cn } from "@/lib/utils"
import { Bookmark, Hash, Home, Settings, User } from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import { Fragment } from 'react/jsx-runtime'

const menuItems = [
  { icon: Home, label: "Accueil", path: "/home", className: "text-pink-500" },
  { icon: Hash, label: "Explorer", path: "/explore", className: "text-blue-500" },
  { icon: Bookmark, label: "Favoris", path: "/signets", className: "text-purple-500" },
  { icon: User, label: "Profil", path: "/profil", className: "text-cyan-500" },
  // { icon: Settings, label: "Paramètres", path: "/settings", className: "text-rose-500" },
]

export function Sidebar() {
  const location = useLocation()

  return (
    <Fragment>
      {/* Sidebar pour desktop */}
      <aside className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 bg-white/70 backdrop-blur-sm border-r border-pink-100 p-4 z-20">
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
                  <item.icon size={20} className={item.className} />
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Navigation mobile en bas */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-pink-100 z-20">
        <ul className="flex justify-around items-center h-16">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={cn(
                  "flex flex-col items-center justify-center px-2 py-2 rounded-lg transition-all duration-200",
                  location.pathname === item.path
                    ? "text-pink-500 font-medium"
                    : "text-gray-600"
                )}
              >
                <item.icon size={24} className={item.className} />
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      {/* Espace réservé en bas pour la navigation mobile */}
      <div className="md:hidden h-16"></div>
    </Fragment>
  )
}

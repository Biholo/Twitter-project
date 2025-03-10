import { Button } from "./Button"
import { LogOut } from "lucide-react"
import Cookies from "js-cookie"
import { useNavigate } from "react-router-dom"

export function LogoutButton() {
  const navigate = useNavigate()

  const handleLogout = () => {
    Cookies.remove("token")
    navigate("/login")
  }

  return (
    <Button
      onClick={handleLogout}
      className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-pink-400 to-blue-400 
      hover:from-pink-500 hover:to-blue-500 text-white rounded-xl font-medium
      shadow-md hover:shadow-lg transform transition-all duration-200 hover:-translate-y-0.5
      focus:ring-2 focus:ring-pink-200 focus:ring-offset-2"
    >
      <LogOut size={18} className="text-white" />
      <span className="font-medium">Déconnexion</span>
    </Button>
  )
}

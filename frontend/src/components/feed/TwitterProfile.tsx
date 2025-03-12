import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar"
import { Button } from "@/components/ui/Button"
import { useAuthStore } from "@/stores/authStore";
import { Calendar, Link2, MapPin } from "lucide-react"

export default function TwitterProfile() {

  const { user } = useAuthStore();
  
  return (
    <div className="overflow-hidden rounded-xl bg-white/80 backdrop-blur-sm shadow-sm dark:bg-gray-800/80 mt-5">
      {/* Banner with gradient */}
      <div className="h-48 w-full bg-gradient-to-r from-pink-400 to-blue-500">
        
      </div>

      {/* Profile Info - Fix avatar overlap */}
      <div className="relative px-4 pb-4 pt-20">
        <div className="absolute -top-16 left-4 rounded-full border-4 border-white dark:border-gray-800">
          <Avatar className="h-32 w-32">
            <AvatarImage src="/placeholder.svg?height=128&width=128" alt="@username" />
            <AvatarFallback>{user?.username.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
        </div>

        <div className="flex justify-between">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text text-transparent">
              {user?.username}
            </h1>
            <p className="text-gray-500 dark:text-gray-400">@{user?.identifier_name}</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="border-pink-300 hover:bg-pink-50 dark:border-pink-800 dark:hover:bg-pink-950"
            >
              Partager
            </Button>
            <Button
              size="sm"
              className="bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600"
            >
              Suivre
            </Button>
          </div>
        </div>

        <p className="mt-4">
          {user?.bio}
        </p>

        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4 text-pink-500" />
            <span>Paris, France</span>
          </div>
          <div className="flex items-center gap-1">
            <Link2 className="h-4 w-4 text-blue-500" />
            <a href="#" className="text-blue-500 hover:underline">
              jeandupont.dev
            </a>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4 text-purple-500" />
            <span>A rejoint en {user?.created_at ? new Date(user.created_at).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }) : ''} </span>
          </div>
        </div>

        <div className="mt-4 flex gap-4">
          <div>
            <span className="font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
              1,245
            </span>{" "}
            <span className="text-gray-500 dark:text-gray-400">Abonnements</span>
          </div>
          <div>
            <span className="font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
              8,532
            </span>{" "}
            <span className="text-gray-500 dark:text-gray-400">Abonnés</span>
          </div>
          <div>
            <span className="font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
              3.2M
            </span>{" "}
            <span className="text-gray-500 dark:text-gray-400">Vues du profil</span>
          </div>
        </div>

       
      </div>
    </div>
  )
}


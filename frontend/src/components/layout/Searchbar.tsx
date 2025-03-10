import { Input } from "@/components/ui/Input"
import { Search } from "lucide-react"

export default function SearchBar() {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
        <Search className="h-4 w-4 text-gray-400" />
      </div>
      <Input
        placeholder="Rechercher sur Tweeter..."
        className="pl-10 bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 border-none rounded-full focus-visible:ring-pink-300 dark:focus-visible:ring-pink-800"
      />
    </div>
  )
}


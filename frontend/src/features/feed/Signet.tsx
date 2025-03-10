import BookmarkedTweet from "@/components/feed/BookmarkedTweet"
import { Button } from "@/components/ui/Button"
import { Sidebar } from "@/components/ui/Sidebar"
import { Trash2 } from "lucide-react"

export default function Signets() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <Sidebar />
      <div className="md:ml-64">
        <div className="container mx-auto max-w-7xl px-4 pb-4">
          <div className="sticky top-0 z-10 pt-4 pb-2 bg-gradient-to-br from-rose-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">Signets</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">@jean_dupont</p>
              </div>
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-red-50 dark:hover:bg-red-950">
                <Trash2 className="h-5 w-5 text-red-500" />
              </Button>
            </div>
          </div>

          <div className="mt-4">
            <BookmarkedTweet />
          </div>
        </div>
      </div>
    </div>
  )
}


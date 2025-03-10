import TwitterProfile from "@/components/feed/TwitterProfile"
import TweetFeed from "@/components/feed/TweetFeed"
import DetailedTweet from "@/components/feed/DetailedTweet"
import { Sidebar } from "@/components/ui/Sidebar"
export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto max-w-3xl">
      <Sidebar/>
        <TwitterProfile />
        <div className="mt-4 grid gap-4 md:grid-cols-[1fr_300px]">
          <div>
            <DetailedTweet />
            <div className="mt-4">
              <TweetFeed />
            </div>
          </div>
          <div className="hidden md:block">
            <div className="rounded-xl bg-white/80 backdrop-blur-sm p-4 shadow-sm dark:bg-gray-800/80">
              <h3 className="mb-3 font-semibold bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text text-transparent">
                Tendances pour vous
              </h3>
              <div className="space-y-4">
                {["Politique", "Sports", "Technologie", "Musique", "Cinéma"].map((topic) => (
                  <div
                    key={topic}
                    className="cursor-pointer hover:bg-gradient-to-r hover:from-pink-50 hover:to-blue-50 dark:hover:from-gray-700 dark:hover:to-gray-700 p-2 rounded-lg transition-all"
                  >
                    <div className="text-sm text-gray-500 dark:text-gray-400">Tendance en France</div>
                    <div className="font-medium">#{topic}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">2,543 posts</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


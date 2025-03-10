import DetailedTweet from "@/components/feed/DetailedTweet"
import TrendingSection from "@/components/feed/TrendingSection"
import TweetFeed from "@/components/feed/TweetFeed"
import TwitterProfile from "@/components/feed/TwitterProfile"
import { Sidebar } from "@/components/ui/Sidebar"

export default function Profil() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <Sidebar />
      <div className="md:ml-64">
        <div className="container mx-auto max-w-3xl px-4 pb-4">
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
                <div className="space-y-4">
                  <TrendingSection />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


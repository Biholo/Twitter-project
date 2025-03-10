import FeedTabs from "@/components/feed/FeedTabs"
import TrendingSection from "@/components/feed/TrendingSection"
import TweetFeed from "@/components/feed/TweetFeed"
import SearchBar from "@/components/layout/Searchbar"
import { Sidebar } from "@/components/ui/Sidebar"

export default function Home() {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-rose-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <Sidebar />
      <div className="flex-1 md:ml-64">
        <div className="container mx-auto max-w-6xl px-4 pb-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_300px]">
            <div>
              <div className="mb-4 sticky top-0 z-10 pt-4 bg-gradient-to-br from-rose-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
                <SearchBar />
                <div className="mt-4">
                  <FeedTabs />
                </div>
              </div>
              <TweetFeed />
            </div>
            <div className="hidden md:block">
              <div className="sticky top-4">
                <TrendingSection />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


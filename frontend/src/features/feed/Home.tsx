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
        <div className="container mx-auto px-4 pb-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Colonne principale */}
            <div className="flex-1 max-w-3xl">
              <div className="mb-4 sticky top-0 z-10 pt-4 bg-gradient-to-br from-rose-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
                <SearchBar />
                <div className="mt-4">
                  <FeedTabs />
                </div>
              </div>
              <TweetFeed />
            </div>
            
            {/* Colonne des tendances */}
            <div className="hidden md:block w-80 flex-shrink-0">
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


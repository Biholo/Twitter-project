import ExploreContent from "@/components/feed/ExploreContent"
import SearchBar from "@/components/layout/Searchbar"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/Tabs"

export default function Explorer() {
  return (
    <>
      <div className="sticky top-0 z-10 pt-4 pb-2 bg-gradient-to-br from-rose-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <SearchBar />

        <div className="mt-4">
          <Tabs defaultValue="for-you" className="w-full">
            <TabsList className="w-full bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 rounded-xl h-14">
              <TabsTrigger
                value="for-you"
                className="flex-1 h-full data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-xl data-[state=active]:border-b-2 data-[state=active]:border-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-blue-500"
              >
                Pour vous
              </TabsTrigger>
              <TabsTrigger
                value="trending"
                className="flex-1 h-full data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-xl data-[state=active]:border-b-2 data-[state=active]:border-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-blue-500"
              >
                Tendances
              </TabsTrigger>
              <TabsTrigger
                value="news"
                className="flex-1 h-full data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-xl data-[state=active]:border-b-2 data-[state=active]:border-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-blue-500"
              >
                Actualités
              </TabsTrigger>
              <TabsTrigger
                value="sports"
                className="flex-1 h-full data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-xl data-[state=active]:border-b-2 data-[state=active]:border-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-blue-500"
              >
                Sports
              </TabsTrigger>
              <TabsTrigger
                value="entertainment"
                className="flex-1 h-full data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-xl data-[state=active]:border-b-2 data-[state=active]:border-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-blue-500"
              >
                Divertissement
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="mt-4">
        <ExploreContent />
      </div>
    </>
  )
}


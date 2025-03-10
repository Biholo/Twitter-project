import { Tabs, TabsList, TabsTrigger } from "@/components/ui/Tabs"
import { Sparkles, Users } from "lucide-react"

export default function FeedTabs() {
  return (
    <Tabs defaultValue="for-you" className="w-full">
      <TabsList className="w-full bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 rounded-xl h-14">
        <TabsTrigger
          value="for-you"
          className="flex-1 h-full data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-xl data-[state=active]:border-b-2 data-[state=active]:border-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-blue-500"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-pink-500" />
            <span>Pour vous</span>
          </div>
        </TabsTrigger>
        <TabsTrigger
          value="following"
          className="flex-1 h-full data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-xl data-[state=active]:border-b-2 data-[state=active]:border-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-blue-500"
        >
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-blue-500" />
            <span>Abonnements</span>
          </div>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  )
}


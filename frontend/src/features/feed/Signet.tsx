import BookmarkedTweet from "@/components/feed/BookmarkedTweet"
import { Button } from "@/components/ui/Button"
import { Sidebar } from "@/components/ui/Sidebar"
import { Trash2 } from "lucide-react"
import { useGetTweets } from "@/api/queries/tweetQueries"
import { useAuthStore } from "@/stores/authStore"
import { Card, CardContent, CardFooter } from "@/components/ui/Card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar"
import { MessageCircle, MoreHorizontal, Repeat2, ThumbsUp, Bookmark } from "lucide-react"
import { Tweet } from "@/types/tweetType"
import { TTweet as TweetComponent } from "@/components/feed/Tweet"

export default function Signets() {
  const { user } = useAuthStore();
  const { data: tweets = [], isLoading, isError } = useGetTweets({
    include_saved: true,
    page: 1,
    limit: 10,
    user_id: user?._id
  });

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
            {/* <div className="space-y-4">
              {tweets.length === 0 ? (
                <div className="text-center py-12">
                  <h2 className="text-2xl font-bold mb-2">Sauvegardez des Tweets pour plus tard</h2>
                  <p className="text-gray-500 dark:text-gray-400 mb-6">
                    Ne perdez pas ce Tweet ! Sauvegardez-le dans vos signets pour y revenir facilement.
                  </p>
                </div>
              ) : (
                tweets.map((tweet: Tweet) => (
                  <TweetComponent
                    key={tweet._id}
                    tweet={tweet}
                  />
                ))
              )}
            </div> */}
          </div>
        </div>
      </div>
    </div>
  )
}


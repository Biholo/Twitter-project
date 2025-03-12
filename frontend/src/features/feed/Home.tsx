import FeedTabs from "@/components/feed/FeedTabs"
import SearchBar from "@/components/layout/Searchbar"
import { useGetTweetsCollection } from "@/api/queries/tweetQueries";
import { Tweet } from "@/types";
import { Tweet as TweetComponent } from "@/components/feed/Tweet";
import { useAuthStore } from "@/stores/authStore";
import { TweetComposer } from "@/components/feed/TweetComposer"

export default function Home() {
  const { user } = useAuthStore();
  const userId = user?._id || "";
  const { data: tweets, isLoading } = useGetTweetsCollection(userId);

  return (
    <>
      {/* En-tête fixe */}
      <div className="sticky top-0 z-20 pt-4 pb-2 bg-gradient-to-br from-rose-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <div className="mb-4">
          <SearchBar />
        </div>
        <FeedTabs />
      </div>

      {/* Contenu défilant */}
      <div className="space-y-4 py-4">
        <TweetComposer />
        {isLoading ? (
          <p className="text-center text-gray-500 dark:text-gray-400">Chargement des tweets...</p>
        ) : !tweets || tweets.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400">Aucun tweet n'est disponible</p>
        ) : (
          tweets.map((tweet: Tweet) => (
            <TweetComponent key={tweet._id} tweet={tweet} />
          ))
        )}
      </div>
    </>
  )
}


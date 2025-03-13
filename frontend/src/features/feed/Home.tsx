import { useGetTweetsCollectionInfinite } from "@/api/queries/tweetQueries";
import FeedTabs from "@/components/feed/FeedTabs";
import { Tweet as TweetComponent } from "@/components/feed/Tweet";
import { TweetComposer } from "@/components/feed/TweetComposer";
import SearchBar from "@/components/layout/Searchbar";
import { TweetWithAuthor } from "@/types";
import InfiniteScroll from "react-infinite-scroll-component";

export default function Home() {
  const { 
    data, 
    fetchNextPage, 
    hasNextPage, 
    isLoading 
  } = useGetTweetsCollectionInfinite();

  const tweets = data?.pages.flatMap(page => page.data) || [];

  return (
    <>
      {/* En-tête fixe */}
      <div className="sticky top-0 z-20 pt-4 pb-2 bg-gradient-to-br from-rose-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <div className="mb-4">
          <SearchBar />
        </div>
        {/* <FeedTabs /> */}
      </div>

      {/* Contenu défilant */}
      <div className="space-y-4 py-4">
        <TweetComposer />
        {isLoading ? (
          <p className="text-center text-gray-500 dark:text-gray-400">Chargement des tweets...</p>
        ) : !tweets || tweets.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400">Aucun tweet n'est disponible</p>
        ) : (
          <InfiniteScroll
            dataLength={tweets.length}
            next={fetchNextPage}
            hasMore={!!hasNextPage}
            loader={<p className="text-center text-gray-500 dark:text-gray-400">Chargement de plus de tweets...</p>}
            scrollThreshold={0.7}
          >
            {tweets.map((tweet: TweetWithAuthor, index: number) => (
              <div key={tweet._id} className="py-2">
                <TweetComponent tweet={tweet} key={index}/>
              </div>
            ))}
          </InfiniteScroll>
        )}
      </div>
    </>
  )
}


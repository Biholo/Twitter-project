import { useGetTweetsCollectionInfinite } from "@/api/queries/tweetQueries";
import { Tweet as TweetComponent } from "@/components/feed/Tweet";
import { TweetComposer } from "@/components/feed/TweetComposer";
import { TweetWithAuthor } from "@/types";
import InfiniteScroll from "react-infinite-scroll-component";

export default function Home() {
  const { 
    data, 
    fetchNextPage, 
    hasNextPage, 
    isLoading,
    isFetching,
    refetch
  } = useGetTweetsCollectionInfinite();

  const tweets = data?.pages.flatMap(page => page.data) || [];

  return (
    <>
      {/* En-tête fixe */}
      {/* <div className="sticky top-0 z-20 pt-4 pb-2 bg-gradient-to-br from-rose-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <div className="mb-4">
          <SearchBar />
        </div>
      </div> */}

      {/* Contenu défilant */}
      <div className="space-y-4 py-4 relative">
        {/* Indicateur de refetch */}
        {isFetching && (
          <div className="fixed top-4 right-8 bg-white dark:bg-gray-800 shadow-lg rounded-full p-2 z-50 flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-pink-500"></div>
            <span className="text-sm text-gray-600 dark:text-gray-300">Actualisation...</span>
          </div>
        )}

        <TweetComposer />
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mb-4"></div>
            <p className="text-center text-gray-500 dark:text-gray-400">Chargement des tweets...</p>
          </div>
        ) : !tweets || tweets.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">Aucun tweet n'est disponible</p>
            <button 
              onClick={() => refetch()} 
              className="mt-4 px-4 py-2 bg-pink-100 dark:bg-pink-900 text-pink-600 dark:text-pink-300 rounded-full hover:bg-pink-200 dark:hover:bg-pink-800 transition-colors"
            >
              Actualiser
            </button>
          </div>
        ) : (
          <InfiniteScroll
            dataLength={tweets.length}
            next={fetchNextPage}
            hasMore={!!hasNextPage}
            loader={
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
              </div>
            }
            scrollThreshold={0.7}
            pullDownToRefresh
            pullDownToRefreshThreshold={50}
            refreshFunction={() => refetch()}
            pullDownToRefreshContent={
              <div className="flex justify-center py-2 text-gray-500">
                ↓ Tirez vers le bas pour actualiser
              </div>
            }
            releaseToRefreshContent={
              <div className="flex justify-center py-2 text-pink-500">
                ↑ Relâchez pour actualiser
              </div>
            }
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


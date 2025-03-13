import ExploreContent from "@/components/feed/ExploreContent"
import SearchBar from "@/components/layout/Searchbar"
import { useSearchParams } from "react-router-dom"
import { useSearchTweets } from "@/api/queries/tweetQueries"
import { Tweet as TweetComponent } from "@/components/feed/Tweet";
import { TweetWithAuthor } from "@/types";
import Loader from "@/components/ui/Loader";

export default function Explorer() {
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get('q') || '';

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchParams(newValue ? { q: newValue } : {});
  }

  const { data: tweets, isLoading: isLoadingTweets } = useSearchTweets(search);

  return (
    <>
      <div className="sticky top-0 z-10 pt-4 pb-2 bg-gradient-to-br from-rose-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <SearchBar value={search} onChange={handleSearch} />
      </div>

      <div className="mt-4">
        {search ? (
          <>
            {isLoadingTweets ? (
              <div className="flex justify-center py-8">
                <Loader />
              </div>
            ) : (
              tweets?.map((tweet) => (
                <div key={tweet._id} className="py-2">
                  <TweetComponent tweet={tweet as TweetWithAuthor} />
                </div>
              ))
            )}
          </>
        ) : (
          <ExploreContent />
        )}
      </div>
    </>
  )
}


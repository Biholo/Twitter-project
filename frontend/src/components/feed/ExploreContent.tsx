import { Card, CardContent, CardHeader } from "@/components/ui/Card"
import { useTrendingTweets, useTrendingHashtags, useTrendingSuggestions } from "@/api/queries/trendingQueries";
import { Tweet as TweetComponent } from "@/components/feed/Tweet";
import TopicCard from "@/components/feed/TopicCard";
import SuggestionCard from "@/components/feed/SuggestionCard";
// Sample data for explore page


export default function ExploreContent() {
  const { data: trendingTweets = [], isLoading: _isLoadingTrendingTweets } = useTrendingTweets();
  const { data: trendingHashtags = [], isLoading: isLoadingTrendingHashtags } = useTrendingHashtags({
    timeframe: 'daily'
  });
  const { data: trendingSuggestions = [], isLoading: isLoadingTrendingSuggestions } = useTrendingSuggestions();
  return (
    <div className="space-y-6">
      {/* Trending Now Section */}
      <Card className="bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 border-none overflow-hidden">
        <CardHeader className="pb-2">
          <h2 className="text-xl font-bold bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text text-transparent">
            Tendances du moment
          </h2>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoadingTrendingHashtags ? (
            <div className="animate-pulse space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded-lg" />
              ))}
            </div>
          ) : trendingHashtags.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-400 py-4">
              Aucune tendance pour le moment
            </div>
          ) : (
            trendingHashtags.map((topic) => (
              <TopicCard key={topic._id} topic={topic} />
            ))
          )}
        </CardContent>
      </Card>

      {/* Trending Tweets */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold px-2 bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text text-transparent">
          Tweets populaires
        </h2>

        {trendingTweets.map((tweet) => (
          <TweetComponent key={tweet._id} tweet={tweet} />
        ))}
      </div>

      {/* Who to Follow */}
      <Card className="bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 border-none overflow-hidden">
        <CardHeader className="pb-2">
          <h2 className="text-xl font-bold bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text text-transparent">
            Suggestions à suivre
          </h2>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoadingTrendingSuggestions ? (
            <div className="animate-pulse space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded-lg" />
              ))}
            </div>
          ) : trendingSuggestions.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-400 py-4">
              Aucune suggestion pour le moment
            </div>
          ) : (
            trendingSuggestions.map((person) => (
              <SuggestionCard 
                id={person._id}
                key={person.username} 
                username={person.username} 
                identifier_name={person.identifier_name} 
                bio={person.bio} 
                avatar={person.avatar} 
              />
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}


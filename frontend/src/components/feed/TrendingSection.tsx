import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardHeader } from "@/components/ui/Card"
import SuggestionCard from "./SuggestionCard"
import TopicCard from "@/components/feed/TopicCard"
import { useTrendingHashtags, useTrendingSuggestions } from "@/api/queries/trendingQueries"
import { useState } from "react"

export default function TrendingSection() {
  const { data: trendingHashtag, isLoading: isLoadingTrendingHashtag } = useTrendingHashtags();
  const { data: trendingSuggestions = [], isLoading: isLoadingTrendingSuggestions } = useTrendingSuggestions();
  const [showAllSuggestions, setShowAllSuggestions] = useState(false);

  const displayedSuggestions = showAllSuggestions 
    ? trendingSuggestions 
    : trendingSuggestions.slice(0, 2);
 
  return (
    <div className="space-y-4">
      <Card className="bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 border-none">
        <CardHeader className="pb-2">
          <h3 className="font-semibold bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text text-transparent">
            Tendances pour vous
          </h3>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoadingTrendingHashtag ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-2">Chargement des tendances...</p>
          ) : !trendingHashtag || trendingHashtag.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-2">Aucune tendance disponible</p>
          ) : (
            <>
              {trendingHashtag.map((hashtag) => (
                <TopicCard key={hashtag.hashtag} topic={hashtag} />
              ))}
              {trendingHashtag.length > 0 && (
                <Button
                  variant="ghost"
                  className="w-full text-pink-500 hover:text-pink-600 hover:bg-pink-50 dark:hover:bg-pink-950"
                >
                  Voir plus
                </Button>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <Card className="bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 border-none">
        <CardHeader className="pb-2">
          <h3 className="font-semibold bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text text-transparent">
            Suggestions
          </h3>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoadingTrendingSuggestions ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-2">Chargement des suggestions...</p>
          ) : trendingSuggestions.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-2">Aucune suggestion disponible</p>
          ) : (
            <>
              {displayedSuggestions.map((person) => (
                <SuggestionCard 
                  id={person._id}
                  key={person.identifier_name} 
                  username={person.username} 
                  identifier_name={person.identifier_name} 
                  avatar={person.avatar} 
                />
              ))}
              {trendingSuggestions.length > 2 && (
                <Button
                  variant="ghost"
                  className="w-full text-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950"
                  onClick={() => setShowAllSuggestions(!showAllSuggestions)}
                >
                  {showAllSuggestions ? "Voir moins" : "Voir plus"}
                </Button>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
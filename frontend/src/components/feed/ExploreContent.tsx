import { Card, CardContent, CardHeader } from "@/components/ui/Card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/Button"
import { MessageCircle, MoreHorizontal, Repeat2, Share2, ThumbsUp } from "lucide-react"

// Sample data for explore page
const trendingTopics = [
  { id: 1, category: "Politique", title: "Élections 2025", tweets: "125K" },
  { id: 2, category: "Sports", title: "Ligue des Champions", tweets: "98K" },
  { id: 3, category: "Technologie", title: "Intelligence Artificielle", tweets: "87K" },
  { id: 4, category: "Musique", title: "#NouvelAlbum", tweets: "76K" },
  { id: 5, category: "Cinéma", title: "Festival de Cannes", tweets: "65K" },
]

const trendingTweets = [
  {
    id: 1,
    author: "Tech Insider",
    username: "techinsider",
    content:
      "La nouvelle génération d'IA générative révolutionne le développement web. Les développeurs peuvent désormais créer des interfaces complètes en quelques minutes ! 🚀 #IA #DevWeb",
    time: "2h",
    likes: 3245,
    comments: 428,
    reposts: 1287,
    hasImage: true,
    isVerified: true,
  },
  {
    id: 2,
    author: "Sports Actu",
    username: "sportsactu",
    content:
      "INCROYABLE ! 😱 Le but de dernière minute qui qualifie l'équipe pour la finale ! Un moment qui restera dans l'histoire du football. #ChampionsLeague #Finale",
    time: "5h",
    likes: 8921,
    comments: 1432,
    reposts: 3654,
    hasImage: true,
    isVerified: true,
  },
  {
    id: 3,
    author: "Ciné Passion",
    username: "cinepassion",
    content:
      "Le réalisateur vient d'annoncer la suite tant attendue de son chef-d'œuvre ! Le tournage commencera en septembre. 🎬 #Cinema #Blockbuster",
    time: "8h",
    likes: 5432,
    comments: 876,
    reposts: 2109,
    isVerified: true,
  },
]

const whoToFollow = [
  {
    name: "Marie Curie",
    username: "mariecurie",
    description: "Scientifique, double prix Nobel. Passionnée de recherche et d'innovation.",
    isVerified: true,
  },
  {
    name: "Albert Einstein",
    username: "alberteinstein",
    description: "Physicien théoricien. E=mc². La relativité, c'est relatif.",
    isVerified: true,
  },
  {
    name: "Ada Lovelace",
    username: "adalovelace",
    description: "Première programmeuse de l'histoire. Visionnaire de l'informatique.",
    isVerified: true,
  },
]

export default function ExploreContent() {
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
          {trendingTopics.map((topic) => (
            <div
              key={topic.id}
              className="cursor-pointer hover:bg-gradient-to-r hover:from-pink-50 hover:to-blue-50 dark:hover:from-gray-700 dark:hover:to-gray-700 p-3 rounded-lg transition-all"
            >
              <div className="text-sm text-gray-500 dark:text-gray-400">{topic.category} · Tendance</div>
              <div className="font-bold text-lg">{topic.title}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{topic.tweets} tweets</div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Trending Tweets */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold px-2 bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text text-transparent">
          Tweets populaires
        </h2>

        {trendingTweets.map((tweet) => (
          <Card key={tweet.id} className="overflow-hidden bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 border-none">
            <CardContent className="p-4">
              <div className="flex gap-3">
                <Avatar>
                  <AvatarImage src={`/placeholder.svg?height=40&width=40&text=${tweet.username}`} alt={tweet.author} />
                  <AvatarFallback>{tweet.author.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <span className="font-semibold bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text text-transparent">
                        {tweet.author}
                      </span>
                      {tweet.isVerified && (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-blue-500 text-xs text-white">
                          ✓
                        </span>
                      )}
                      <span className="text-gray-500 dark:text-gray-400">
                        @{tweet.username} · {tweet.time}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full hover:bg-pink-50 dark:hover:bg-pink-950"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="mt-2">{tweet.content}</p>
                  {tweet.hasImage && (
                    <div className="mt-3 overflow-hidden rounded-xl">
                      <img
                        src="/placeholder.svg?height=300&width=500"
                        alt="Tweet image"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}

                  <div className="mt-4 flex justify-between">
                    <Button variant="ghost" size="sm" className="gap-1 text-gray-500 hover:text-pink-500">
                      <MessageCircle className="h-4 w-4" />
                      <span>{tweet.comments}</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-1 text-gray-500 hover:text-purple-500">
                      <Repeat2 className="h-4 w-4" />
                      <span>{tweet.reposts}</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-1 text-gray-500 hover:text-red-500">
                      <ThumbsUp className="h-4 w-4" />
                      <span>{tweet.likes}</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-500 hover:text-blue-500">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
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
          {whoToFollow.map((person) => (
            <div key={person.username} className="flex items-center gap-3 p-2">
              <Avatar className="h-12 w-12">
                <AvatarImage src={`/placeholder.svg?height=48&width=48&text=${person.username}`} alt={person.name} />
                <AvatarFallback>{person.name.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <span className="font-semibold">{person.name}</span>
                  {person.isVerified && (
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-blue-500 text-[10px] text-white">
                      ✓
                    </span>
                  )}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">@{person.username}</div>
                <p className="text-sm truncate">{person.description}</p>
              </div>
              <Button
                size="sm"
                className="bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600"
              >
                Suivre
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}


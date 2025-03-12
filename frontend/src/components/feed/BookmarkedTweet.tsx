import { Card, CardContent, CardFooter } from "@/components/ui/Card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar"
import { Button } from "@/components/ui/Button"
import { MessageCircle, MoreHorizontal, Repeat2, ThumbsUp, Bookmark } from "lucide-react"

// Sample data for bookmarked tweets
const bookmarkedTweets = [
  {
    id: 1,
    author: "Tech Insider",
    username: "techinsider",
    content:
      "10 astuces pour améliorer votre productivité en tant que développeur. Le #7 va vous surprendre ! 💻✨ #DevTips #Productivité",
    time: "Sauvegardé le 12 mars",
    likes: 1245,
    comments: 128,
    reposts: 387,
    isVerified: true,
  },
  {
    id: 2,
    author: "Marie Laurent",
    username: "marie_laurent",
    content:
      "Voici ma nouvelle bibliothèque open source pour simplifier la gestion d'état dans React ! 🚀 N'hésitez pas à l'essayer et à me faire vos retours. #React #JavaScript #OpenSource",
    time: "Sauvegardé le 10 mars",
    likes: 824,
    comments: 93,
    reposts: 215,
    hasImage: true,
  },
  {
    id: 3,
    author: "Voyage Passion",
    username: "voyagepassion",
    content:
      "Les 5 destinations incontournables pour les digital nomads en 2025 ! 🌴 Wifi rapide, coût de la vie abordable et communautés dynamiques. #DigitalNomad #Voyage",
    time: "Sauvegardé le 5 mars",
    likes: 1876,
    comments: 243,
    reposts: 512,
    hasImage: true,
    isVerified: true,
  },
  {
    id: 4,
    author: "Cuisine Facile",
    username: "cuisinefacile",
    content:
      "Recette rapide : Pasta alla carbonara authentique en moins de 15 minutes ! 🍝 Le secret est dans la qualité du pecorino romano. #Cuisine #Recette #Italie",
    time: "Sauvegardé le 28 février",
    likes: 932,
    comments: 87,
    reposts: 156,
  },
]

export default function BookmarkedTweet() {
  return (
    <div className="space-y-4">
      {bookmarkedTweets.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-2">Sauvegardez des Tweets pour plus tard</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Ne perdez pas ce Tweet ! Sauvegardez-le dans vos signets pour y revenir facilement.
          </p>
        </div>
      ) : (
        bookmarkedTweets.map((tweet) => (
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
                      <span className="text-gray-500 dark:text-gray-400">@{tweet.username}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 dark:text-gray-400">{tweet.time}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full hover:bg-pink-50 dark:hover:bg-pink-950"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
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
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t p-2">
              <div className="flex w-full justify-between">
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
                  <Bookmark className="h-4 w-4 fill-blue-500" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))
      )}
    </div>
  )
}


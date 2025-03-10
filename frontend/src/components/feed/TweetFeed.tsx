import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/Button"
import { Card, CardFooter, CardHeader } from "@/components/ui/Card"
import { Textarea } from "@/components/ui/Textarea"
import { MessageCircle, MoreHorizontal, Repeat2, Share2, ThumbsUp, Image, Smile, Calendar } from "lucide-react"
import { Separator } from "@/components/ui/separator"

// Update the tweets with better emojis and gradient styling
const tweets = [
  {
    id: 1,
    author: "Marie Laurent",
    username: "marie_laurent",
    content:
      "Je viens de terminer mon nouveau projet open source ! 🎉 N'hésitez pas à y jeter un œil et à me faire vos retours. 💫",
    time: "2h",
    likes: 124,
    comments: 18,
    reposts: 32,
  },
  {
    id: 2,
    author: "Thomas Petit",
    username: "tpetit",
    content:
      "La nouvelle mise à jour de Next.js est incroyable ! ✨ Tellement de nouvelles fonctionnalités qui vont faciliter le développement. 🚀",
    time: "5h",
    likes: 89,
    comments: 7,
    reposts: 15,
  },
  {
    id: 3,
    author: "Sophie Martin",
    username: "smartin",
    content: "Journée parfaite pour coder en terrasse ☀️🌴 #DeveloperLife #CodeAndCoffee 💻☕",
    time: "8h",
    likes: 215,
    comments: 24,
    reposts: 41,
    hasImage: true,
  },
  {
    id: 4,
    author: "Jean Dupont",
    username: "jean_dupont",
    content:
      "Je suis ravi de vous annoncer le lancement de mon nouveau projet ! ✨ Après des mois de travail acharné, c'est enfin prêt. 🚀 Découvrez une nouvelle façon d'interagir avec vos données. #NouveauProjet #Innovation 💡",
    time: "3h",
    likes: 382,
    comments: 47,
    reposts: 112,
    hasImage: true,
    isVerified: true,
  },
  {
    id: 5,
    author: "Lucie Dubois",
    username: "luciedubois",
    content:
      "Félicitations pour cette réalisation ! 🎉 Le design est vraiment impressionnant. 💯 J'ai hâte de voir les prochaines évolutions !",
    time: "1h",
    likes: 42,
    comments: 5,
    reposts: 8,
    isVerified: true,
  },
]

export default function TweetFeed() {
  return (
    <div className="space-y-4">
      <Card className="overflow-hidden bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 border-none">
        <CardHeader className="p-4">
          <div className="flex gap-3">
            <Avatar className="h-10 w-10 ring-2 ring-pink-300 dark:ring-pink-800">
              <AvatarImage src="/placeholder.svg?height=40&width=40&text=ME" alt="Your avatar" />
              <AvatarFallback>ME</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Textarea
                placeholder="Quoi de neuf ?"
                className="border-none resize-none focus-visible:ring-0 p-0 text-lg"
              />
              <Separator className="my-3" />
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full text-pink-500 hover:bg-pink-50 dark:hover:bg-pink-950"
                  >
                    <Image className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950"
                  >
                    <Smile className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full text-purple-500 hover:bg-purple-50 dark:hover:bg-purple-950"
                  >
                    <Calendar className="h-5 w-5" />
                  </Button>
                </div>
                <Button className="rounded-full bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600">
                  Tweeter
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {tweets.map((tweet) => (
        <Card key={tweet.id} className="overflow-hidden bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 border-none">
          <CardHeader className="flex flex-row items-start gap-4 space-y-0 p-4">
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
            </div>
          </CardHeader>
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
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}


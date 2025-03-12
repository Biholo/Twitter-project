import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/Card"
import { Separator } from "@/components/ui/Separator"
import { MessageCircle, MoreHorizontal, Repeat2, Share2, ThumbsUp } from "lucide-react"

// Update the detailed tweet with gradient colors and better emojis
export default function DetailedTweet() {
  return (
    <Card className="overflow-hidden bg-white/80 backdrop-blur-sm dark:bg-gray-800/80">
      <CardHeader className="flex flex-row items-start gap-4 space-y-0 p-4 pb-2">
        <Avatar className="h-12 w-12 ring-2 ring-pink-300 dark:ring-pink-800">
          <AvatarImage src="/placeholder.svg?height=48&width=48&text=JD" alt="Jean Dupont" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1">
                <span className="font-semibold bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text text-transparent">
                  Jean Dupont
                </span>
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-blue-500 text-xs text-white">
                  ✓
                </span>
              </div>
              <span className="text-gray-500 dark:text-gray-400">@jean_dupont · 3h</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full hover:bg-pink-50 dark:hover:bg-pink-950"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-lg">
          Je suis ravi de vous annoncer le lancement de mon nouveau projet ! ✨ Après des mois de travail acharné, c'est
          enfin prêt. 🚀 Découvrez une nouvelle façon d'interagir avec vos données. #NouveauProjet #Innovation 💡
        </p>
        <div className="mt-4 overflow-hidden rounded-xl">
          <img
            src="/placeholder.svg?height=300&width=600&text=Project+Screenshot"
            alt="Project screenshot"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="mt-4 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <span>15:42 · 10 Mars 2025</span>
          <span>👁️ 12.5K vues</span>
        </div>
        <Separator className="my-4 bg-gradient-to-r from-pink-200 to-blue-200 dark:from-pink-800 dark:to-blue-800" />
        <div className="flex justify-between">
          <div className="flex items-center gap-1">
            <span className="font-semibold bg-gradient-to-r from-pink-500 to-purple-400 bg-clip-text text-transparent">
              482
            </span>
            <span className="text-gray-500 dark:text-gray-400">💬</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-semibold bg-gradient-to-r from-purple-500 to-blue-400 bg-clip-text text-transparent">
              1.2K
            </span>
            <span className="text-gray-500 dark:text-gray-400">🔄</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-semibold bg-gradient-to-r from-blue-400 to-pink-500 bg-clip-text text-transparent">
              3.8K
            </span>
            <span className="text-gray-500 dark:text-gray-400">❤️</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t border-b p-2">
        <div className="flex w-full justify-between">
          <Button variant="ghost" size="sm" className="gap-1 text-gray-500 hover:text-pink-500">
            <MessageCircle className="h-4 w-4" />
            <span>Répondre</span>
          </Button>
          <Button variant="ghost" size="sm" className="gap-1 text-gray-500 hover:text-purple-500">
            <Repeat2 className="h-4 w-4" />
            <span>Repost</span>
          </Button>
          <Button variant="ghost" size="sm" className="gap-1 text-gray-500 hover:text-red-500">
            <ThumbsUp className="h-4 w-4" />
            <span>J'aime</span>
          </Button>
          <Button variant="ghost" size="sm" className="text-gray-500 hover:text-blue-500">
            <Share2 className="h-4 w-4" />
            <span>Partager</span>
          </Button>
        </div>
      </CardFooter>
      <div className="p-4">
        <h3 className="mb-4 font-semibold bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text text-transparent">
          Réponses
        </h3>
        <div className="space-y-4">
          {replies.map((reply) => (
            <div key={reply.id} className="flex gap-3">
              <Avatar className={reply.isVerified ? "ring-2 ring-blue-300 dark:ring-blue-800" : ""}>
                <AvatarImage src={`/placeholder.svg?height=40&width=40&text=${reply.username}`} alt={reply.author} />
                <AvatarFallback>{reply.author.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-1">
                  <span className="font-semibold">{reply.author}</span>
                  {reply.isVerified && (
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-blue-500 text-[10px] text-white">
                      ✓
                    </span>
                  )}
                  <span className="text-gray-500 dark:text-gray-400">
                    @{reply.username} · {reply.time}
                  </span>
                </div>
                <p className="mt-1">{reply.content}</p>
                <div className="mt-2 flex gap-4">
                  <Button variant="ghost" size="sm" className="h-8 gap-1 text-gray-500 hover:text-pink-500">
                    <MessageCircle className="h-3 w-3" />
                    <span className="text-xs">Répondre</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 gap-1 text-gray-500 hover:text-red-500">
                    <ThumbsUp className="h-3 w-3" />
                    <span className="text-xs">{reply.likes}</span>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}

const replies = [
  {
    id: 1,
    author: "Lucie Dubois",
    username: "luciedubois",
    content: "Félicitations pour cette réalisation ! 🎉 Le design est vraiment impressionnant. 💯",
    time: "1h",
    likes: 42,
    isVerified: true,
  },
  {
    id: 2,
    author: "Marc Bernard",
    username: "mbernard",
    content: "J'ai testé l'application et elle fonctionne parfaitement. ✅ Bravo pour le travail accompli ! 👏",
    time: "45min",
    likes: 18,
  },
  {
    id: 3,
    author: "Emma Leroy",
    username: "emmaleroy",
    content: "Est-ce que vous prévoyez d'ajouter d'autres fonctionnalités dans les prochaines mises à jour ? 🤔",
    time: "30min",
    likes: 7,
  },
]


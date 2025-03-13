import { useCreateTweet } from "@/api/queries/tweetQueries"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar"
import { Button } from "@/components/ui/Button"
import { Card, CardHeader } from "@/components/ui/Card"
import { Separator } from "@/components/ui/Separator"
import { Textarea } from "@/components/ui/Textarea"
import { useAuthStore } from "@/stores/authStore"
import { Calendar, Image, Smile } from "lucide-react"
import { useState } from "react"
export function TweetComposer() {
  const { user } = useAuthStore();
  const { mutate: createTweet } = useCreateTweet();
  const [tweetText, setTweetText] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!tweetText.trim()) return
    
    setIsSubmitting(true)
    if (!user) {
      console.error("Utilisateur non connecté")
      return
    }
    
    // Créer le tweet avec mise à jour optimiste
    createTweet(
      {
        content: tweetText,
        tweet_type: "tweet",
      },
      {
        onSuccess: () => {
          setTweetText("")
          setIsSubmitting(false)
        },
        onError: (error) => {
          console.error("Erreur lors de l'envoi du tweet:", error)
          setIsSubmitting(false)
        }
      }
    )
  }

  return (
    <Card className="overflow-hidden bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 border-none">
      <CardHeader className="p-4">
        <div className="flex gap-3">
          <Avatar className="h-10 w-10 ring-2 ring-pink-300 dark:ring-pink-800">
            <AvatarImage src="/placeholder.svg?height=40&width=40&text=ME" alt="Your avatar" />
            <AvatarFallback>{user?.username.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <Textarea
              placeholder="Quoi de neuf ?"
              className="border-none resize-none focus-visible:ring-0 p-0 text-lg p-2"
              value={tweetText}
              onChange={(e) => setTweetText(e.target.value)}
              maxLength={280}
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
              <div className="flex items-center gap-3">
                {tweetText.length > 0 && (
                  <span className={`text-sm ${tweetText.length > 260 ? 'text-orange-500' : 'text-gray-500'}`}>
                    {tweetText.length}/280
                  </span>
                )}
                <Button 
                  className="rounded-full bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600"
                  onClick={handleSubmit}
                  disabled={!tweetText.trim() || isSubmitting}
                >
                  {isSubmitting ? "Envoi..." : "Tweeter"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
    </Card>
  )
}

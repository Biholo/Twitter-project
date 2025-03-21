import { useState } from "react"
import { useParams, Link } from "react-router-dom"
import { MessageCircle, MoreHorizontal, Repeat2, ThumbsUp, Bookmark, Share2, ArrowLeft } from "lucide-react"
import { Card, CardHeader, CardFooter, CardContent } from "@/components/ui/Card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/Avatar"
import { Button } from "@/components/ui/Button"
import { useGetTweetById, useUnbookmarkTweet, useUnlikeTweet } from "@/api/queries/tweetQueries"
import { useLikeTweet, useBookmarkTweet } from "@/api/queries/tweetQueries"
import dateService from "@/services/dateService"
import { useNavigate } from "react-router-dom"
import { TweetComposer } from "@/components/feed/TweetComposer"

export default function TweetDetails() {
  const params = useParams()
  const tweetId = params.id as string
  const { data: tweet, isLoading } = useGetTweetById(tweetId)
  const [imageError, setImageError] = useState(false)
  const navigate = useNavigate()

  const likeTweetMutation = useLikeTweet()
  const unlikeTweetMutation = useUnlikeTweet()
  const bookmarkTweetMutation = useBookmarkTweet()
  const unbookmarkTweetMutation = useUnbookmarkTweet()

  const commentAnAnswer = (commentId: string) => {
    navigate(`/tweet/${commentId}`)
  }

  const handleRetweet = () => {}
  const handleLike = () => {
    if(tweet?.is_liked) {
      unlikeTweetMutation.mutate(tweetId)
    } else {
      likeTweetMutation.mutate(tweetId)
    }
  }
  const handleBookmark = () => {
    if(tweet?.is_saved) {
      unbookmarkTweetMutation.mutate(tweetId)
    } else {
      bookmarkTweetMutation.mutate(tweetId)
    }
  }
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Partager ce tweet",
        url: window.location.href
      })
    }
  }

  const openImageInFullScreen = () => {
    if (tweet?.media_url) {
      window.open(tweet.media_url, "_blank")
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Chargement...</p>
      </div>
    )
  }

  if (!tweet) {
    return (
      <div className="text-center p-4">
        <p>Ce tweet n'existe pas ou a été supprimé.</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      {/* Header with back button */}
      <div className="mb-4 flex items-center">
        <Link to="/tweets">
          <Button variant="ghost" size="icon" className="mr-2" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-xl font-bold">Tweet</h1>
      </div>

      {/* Main Tweet */}
      <Card className="overflow-hidden bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 border-none mb-4">
        <CardHeader className="flex flex-row items-start gap-4 space-y-0 p-4">
          <Avatar>
            <AvatarImage src={tweet.author.avatar} alt={tweet.author.username} />
            <AvatarFallback>{tweet.author.username.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <span className="font-semibold bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text text-transparent">
                  {tweet.author.username}
                </span>
                <span className="text-gray-500 dark:text-gray-400">
                  @{tweet.author.identifier_name} · {dateService.formatTime(tweet.created_at)}
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
            <div 
              className="mt-2"
              dangerouslySetInnerHTML={{ __html: dateService.formatTweetContent(tweet.content) }}
            />
            {tweet.media_url && !imageError && (
              <div className="mt-3 overflow-hidden rounded-xl">
                <div className="grid grid-cols-2 gap-1">
                  {Array.isArray(tweet.media_url) ? (
                    tweet.media_url.map((url, index) => (
                      <div key={index} className="relative w-full max-h-[400px] overflow-hidden">
                        {url.toLowerCase().match(/\.(mp4|webm|ogg)$/) ? (
                          <video
                            src={url}
                            controls
                            className="w-full h-auto object-contain max-h-[400px] rounded-xl"
                            onError={() => setImageError(true)}
                          />
                        ) : (
                          <img
                            src={url}
                            alt={`Tweet media ${index + 1}`}
                            className="w-full h-auto object-contain max-h-[400px] rounded-xl"
                            onError={() => setImageError(true)}
                            loading="lazy"
                          />
                        )}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/30 rounded-xl">
                          <Button 
                            variant="secondary" 
                            size="sm" 
                            className="bg-white/80 backdrop-blur-sm"
                            onClick={() => openImageInFullScreen()}
                          >
                            {url.toLowerCase().match(/\.(mp4|webm|ogg)$/) ? 'Voir la vidéo' : 'Voir l\'image complète'}
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="relative w-full max-h-[400px] overflow-hidden">
                      {tweet.media_url.toLowerCase().match(/\.(mp4|webm|ogg)$/) ? (
                        <video
                          src={tweet.media_url}
                          controls
                          className="w-full h-auto object-contain max-h-[400px] rounded-xl"
                          onError={() => setImageError(true)}
                        />
                      ) : (
                        <img
                          src={tweet.media_url}
                          alt="Tweet media"
                          className="w-full h-auto object-contain max-h-[400px] rounded-xl"
                          onError={() => setImageError(true)}
                          loading="lazy"
                        />
                      )}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/30 rounded-xl">
                        <Button 
                          variant="secondary" 
                          size="sm" 
                          className="bg-white/80 backdrop-blur-sm"
                          onClick={() => openImageInFullScreen()}
                        >
                          {tweet.media_url.toLowerCase().match(/\.(mp4|webm|ogg)$/) ? 'Voir la vidéo' : 'Voir l\'image complète'}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </CardHeader>

        {/* Tweet stats */}
        <CardContent className="px-4 pb-2">
          <div className="flex gap-4 text-sm text-gray-500 dark:text-gray-400">
            <span>{tweet.replies_count} Réponses</span>
            <span>{tweet.retweets_count} Retweets</span>
            <span>{tweet.likes_count} J'aime</span>
            <span>{tweet.saves_count} Enregistrements</span>
          </div>
        </CardContent>

        <CardFooter className="border-t p-2">
          <div className="flex w-full justify-between">
            <Button
              variant="ghost"
              size="sm"
              className={`gap-1 text-gray-500 hover:text-pink-500 ${tweet.replies_count > 0 ? "text-pink-500" : ""}`}
              onClick={() => {}}
            >
              <MessageCircle className="h-4 w-4" />
              <span>{tweet.replies_count}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`gap-1 text-gray-500 hover:text-purple-500 ${tweet.is_retweeted ? "text-purple-500" : ""}`}
              onClick={handleRetweet}
            >
              <Repeat2 className="h-4 w-4" />
              <span>{tweet.retweets_count}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`gap-1 text-gray-500 hover:text-red-500 ${tweet.is_liked ? "text-red-500" : ""}`}
              onClick={handleLike}
            >
              <ThumbsUp className="h-4 w-4" />
              <span>{tweet.likes_count}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`${tweet.is_saved ? "text-blue-500" : "text-gray-500 hover:text-blue-500"}`}
              onClick={handleBookmark}
            >
              <Bookmark className={`h-4 w-4 ${tweet.is_saved ? "fill-blue-500" : ""}`} />
              <span>{tweet.saves_count}</span>
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-500 hover:text-blue-500" onClick={handleShare}>
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>

      {/* Comment input */}
      <TweetComposer parent_tweet_id={tweetId}/>

      {/* Comments section */}
      <h2 className="text-lg font-semibold mb-2">Réponses</h2>
      {tweet.replies.map((comment) => (
        <Card key={comment._id} className="mb-3 bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 border-none">
          <CardContent className="p-4">
            <div className="flex gap-3">
              <Avatar>
                <AvatarImage src={comment.author.avatar} alt={comment.author.username} />
                <AvatarFallback>{comment.author.username.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-1">
                  <span className="font-semibold">{comment.author.username}</span>
                  <span className="text-gray-500 dark:text-gray-400">
                    @{comment.author.identifier_name} · {dateService.formatTime(comment.created_at)}
                  </span>
                </div>
                <div 
                  className="mt-1"
                  dangerouslySetInnerHTML={{ __html: dateService.formatTweetContent(comment.content) }}
                />
                {comment.media_url && comment.media_url.length > 0 && (
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {Array.isArray(comment.media_url) ? (
                      comment.media_url.map((url, index) => (
                        <div key={index} className="relative rounded-xl overflow-hidden">
                          {url.endsWith('.mp4') || url.endsWith('.mov') ? (
                            <video 
                              src={url}
                              className="w-full h-48 object-cover"
                              controls
                            />
                          ) : (
                            <img 
                              src={url}
                              alt="Media content"
                              className="w-full h-48 object-cover"
                              onClick={() => window.open(url, "_blank")}
                            />
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="relative rounded-xl overflow-hidden">
                        {comment.media_url.endsWith('.mp4') || comment.media_url.endsWith('.mov') ? (
                          <video 
                            src={comment.media_url}
                            className="w-full h-48 object-cover"
                            controls
                          />
                        ) : (
                          <img 
                            src={comment.media_url}
                            alt="Media content"
                            className="w-full h-48 object-cover"
                            onClick={() => window.open(comment.media_url || "", "_blank")}
                          />
                        )}
                      </div>
                    )}
                  </div>
                )}
                <div className="mt-2 flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`gap-1 text-gray-500 hover:text-red-500 ${comment.is_liked ? "text-red-500" : ""}`}
                    onClick={() => likeTweetMutation.mutate(comment._id)}
                  >
                    <ThumbsUp className="h-3 w-3" />
                    <span className="text-xs">{comment.likes_count}</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="gap-1 text-gray-500 hover:text-blue-500" onClick={() => commentAnAnswer(comment._id)}>
                    <MessageCircle className="h-3 w-3" />
                    <span className="text-xs">Répondre</span>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

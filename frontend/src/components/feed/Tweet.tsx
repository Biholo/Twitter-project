import { useBookmarkTweet, useLikeTweet, useUnbookmarkTweet, useUnlikeTweet } from "@/api/queries/tweetQueries"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar"
import { Button } from "@/components/ui/Button"
import { Card, CardFooter, CardHeader } from "@/components/ui/Card"
import { useAuthStore } from "@/stores/authStore"
import { Tweet as TweetType } from "@/types"
import { Bookmark, MessageCircle, MoreHorizontal, Repeat2, Share2, ThumbsUp } from "lucide-react"
import { useState } from "react"
import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"

export function Tweet({ tweet }: { tweet: TweetType }) {
  const [imageError, setImageError] = useState(false);
  const { user } = useAuthStore();
  const { mutate: likeTweet, isPending: _isLikePending } = useLikeTweet();
  const { mutate: unlikeTweet, isPending: _isUnlikePending } = useUnlikeTweet();
  const { mutate: bookmarkTweet, isPending: _isBookmarkPending } = useBookmarkTweet();
  const { mutate: unbookmarkTweet, isPending: _isUnbookmarkPending } = useUnbookmarkTweet();
  const navigate = useNavigate();

  const openTweetDetails = () => {
    navigate(`/tweet/${tweet._id}`);
  }

  const handleShare = () => {
    // TODO: Implement share functionality
  };

  const handleBookmark = () => {
    if(!user) {
      return;
    }
    if(tweet.is_saved) {
      unbookmarkTweet(tweet._id);
    } else {
      bookmarkTweet(tweet._id);
    }
  };

  const handleLike = () => {
    if (user) {
      if(tweet.is_liked) {
        console.log("Unlike tweet", tweet._id);
        unlikeTweet(tweet._id);
      } else {
        console.log("Like tweet", tweet._id);
        likeTweet(tweet._id);
      }
    } else {
      console.log("Utilisateur non connecté, impossible de liker");
    }
  };

  const handleRetweet = () => {
    // TODO: Implement retweet functionality
  };

  const handleReply = () => {
    // TODO: Implement reply functionality
  };

  const openImageInFullScreen = () => {
    // TODO: Implement open image in full screen functionality
  };


  const formatTweetContent = (content: string) => {
    // Regex pour détecter les hashtags
    const hashtagRegex = /(#\w+)/g;
    
    // Diviser le contenu en segments (texte normal et hashtags)
    const segments = content.split(hashtagRegex);
    
    return segments.map((segment, index) => {
      // Vérifier si le segment est un hashtag
      if (segment.match(hashtagRegex)) {
        const hashtag = segment.substring(1); 
        return (
          <Link 
            key={index}
            to={`/explore/hashtag/${hashtag}`}
            className="text-blue-500 hover:underline"
          >
            {segment}
          </Link>
        );
      }

      return segment;
    });
  };
  
  return (
    <Card className="overflow-hidden bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 border-none">
      <CardHeader className="flex flex-row items-start gap-4 space-y-0 p-4 cursor-pointer" onClick={openTweetDetails}>
        <Avatar>
          <AvatarImage src={`/placeholder.svg?height=40&width=40&text=${tweet.author.username}`} alt={tweet.author.username} />
          <AvatarFallback>{tweet.author.username.substring(0, 2)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <span className="font-semibold bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text text-transparent">
                {tweet.author.username}
              </span>
              <span className="text-gray-500 dark:text-gray-400">
                @{tweet.author.identifier_name} · {(() => {
                  const now = new Date();
                  const tweetDate = new Date(tweet.created_at);
                  const diffMs = now.getTime() - tweetDate.getTime();
                  const diffSecs = Math.floor(diffMs / 1000);
                  const diffMins = Math.floor(diffSecs / 60);
                  const diffHours = Math.floor(diffMins / 60);
                  const diffDays = Math.floor(diffHours / 24);

                  if (diffDays > 0) return `${diffDays} j`;
                  if (diffHours > 0) return `${diffHours} h`;
                  if (diffMins > 0) return `${diffMins} min`;
                  return `${diffSecs} sec`;
                })()}
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
          <p className="mt-2">{formatTweetContent(tweet.content)}</p>
          {tweet.media_url && !imageError && (
            <div className="mt-3 overflow-hidden rounded-xl">
              <div className="relative w-full max-h-[400px] overflow-hidden">
                <img
                  src={tweet.media_url}
                  alt="Tweet media"
                  className="w-full h-auto object-contain max-h-[400px] rounded-xl"
                  onError={() => setImageError(true)}
                  loading="lazy"
                />
                {/* Overlay pour les images très grandes avec bouton pour voir en plein écran */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/30 rounded-xl">
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    className="bg-white/80 backdrop-blur-sm"
                    onClick={openImageInFullScreen}
                  >
                    Voir l'image complète
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardHeader>
      <CardFooter className="border-t p-2">
        <div className="flex w-full justify-between">
          <Button 
            variant="ghost" 
            size="sm" 
            className={`gap-1 text-gray-500 hover:text-pink-500 ${tweet.replies_count > 0 ? 'text-pink-500' : ''}`}
            onClick={handleReply}
          >
            <MessageCircle className="h-4 w-4" />
            <span>{tweet.replies.length}</span>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className={`gap-1 text-gray-500 hover:text-purple-500 ${tweet.is_retweeted ? 'text-purple-500' : ''}`}
            onClick={handleRetweet}
          >
            <Repeat2 className="h-4 w-4" />
            <span>{tweet.retweets_count}</span>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className={`gap-1 text-gray-500 hover:text-red-500 ${tweet.is_liked ? 'text-red-500' : ''}`}
            onClick={handleLike}
          >
            <ThumbsUp className="h-4 w-4" />
            <span>{tweet.likes_count}</span>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className={`${tweet.is_saved ? 'text-blue-500' : 'text-gray-500 hover:text-blue-500'}`}
            onClick={handleBookmark}
          >
            <Bookmark className={`h-4 w-4 ${tweet.is_saved ? 'fill-blue-500' : ''}`} />
            <span>{tweet.saves_count}</span>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-gray-500 hover:text-blue-500"
            onClick={handleShare}
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

import { Tweet } from "@/components/feed/Tweet"
import { TweetComposer } from "@/components/feed/TweetComposer"
import { Tweet as TweetType } from "@/types";

interface TweetFeedProps {
  tweets: TweetType[];
}

export default function TweetFeed({ tweets }: TweetFeedProps) {
  return (
    <div className="space-y-4">
      <TweetComposer />
      {tweets && tweets.length > 0 ? (
        tweets.map((tweet) => (
          <Tweet key={tweet._id} tweet={tweet} />
        ))
      ) : <p>Aucun tweet n'est disponible</p>}
    </div>
  )
}


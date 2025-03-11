import { Tweet } from "@/components/feed/Tweet"
import { TweetComposer } from "@/components/feed/TweetComposer"
import { Tweet as TweetType } from "@/types";

export default function TweetFeed(realTweets: TweetType[]) {

  return (
    <div className="space-y-4">
      <TweetComposer />
      {realTweets ? realTweets.tweets?.map((tweet) => (
        <Tweet key={tweet._id} tweet={tweet} />
      )) : <p>Aucun tweet n'est disponible</p>}
    </div>
  )
}


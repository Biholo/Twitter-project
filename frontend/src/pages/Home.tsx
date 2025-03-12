import { useGetTweetByUser } from "@/api/queries/tweetQueries";
import TweetFeed from "@/components/feed/TweetFeed";

export default function Home() {
    const { data: tweetsData, isLoading } = useGetTweetByUser();

    return (
        <div>
            {isLoading ? (
                <div>Chargement...</div>
            ) : (
                <TweetFeed tweets={tweetsData?.data || []} />
            )}
        </div>
    );
}
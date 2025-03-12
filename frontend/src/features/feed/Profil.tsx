import TwitterProfile from "@/components/feed/TwitterProfile"
import { useGetTweetsCollection, useGetTweets } from "@/api/queries/tweetQueries";
import { Tweet } from "@/types";
import { Tweet as TweetComponent } from "@/components/feed/Tweet";
import { useAuthStore } from "@/stores/authStore";
import { useState } from "react";
import { cn } from "@/lib/utils";

const tabs = [
  { id: 'posts', label: 'Posts' },
  { id: 'likes', label: 'J\'aime' },
  { id: 'retweets', label: 'Retweets' },
];

export default function Profil() {
  const { user } = useAuthStore();
  const [selectedTab, setSelectedTab] = useState<string>("posts");
  const userId = user?._id || "";
  
  const { data: tweets, isLoading: isLoadingTweets } = useGetTweets({ user_id: userId });
  const { data: tweetsLiked, isLoading: isLoadingLikes } = useGetTweetsCollection(userId, { type: 'liked', user_id: userId });
  const { data: tweetsRetweeted, isLoading: isLoadingRetweets } = useGetTweetsCollection(userId, { type: 'retweet', user_id: userId });

  const renderContent = () => {
    switch (selectedTab) {
      case 'likes':
        return isLoadingLikes ? (
          <p>Chargement des likes...</p>
        ) : tweetsLiked && tweetsLiked.length > 0 ? (
          tweetsLiked.map((tweet: Tweet) => (
            <TweetComponent key={tweet._id} tweet={tweet} />
          ))
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-center py-4">
            Aucun tweet liké
          </p>
        );

      case 'retweets':
        return isLoadingRetweets ? (
          <p>Chargement des retweets...</p>
        ) : tweetsRetweeted && tweetsRetweeted.length > 0 ? (
          tweetsRetweeted.map((tweet: Tweet) => (
            <TweetComponent key={tweet._id} tweet={tweet} />
          ))
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-center py-4">
            Aucun retweet
          </p>
        );

      default:
        return isLoadingTweets ? (
          <p>Chargement des tweets...</p>
        ) : tweets && tweets.length > 0 ? (
          tweets.map((tweet: Tweet) => (
            <TweetComponent key={tweet._id} tweet={tweet} />
          ))
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-center py-4">
            Aucun tweet n'est disponible
          </p>
        );
    }
  };

  return (
    <>
      <TwitterProfile />
      
      {/* Navigation par onglets */}
      <div className="mt-4">
        <nav className="w-full justify-start border-b bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 p-0" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={cn(
                "rounded-none border-b-2 border-transparent px-4 py-2",
                selectedTab === tab.id
                  ? "border-b-2 bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text text-transparent"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              )}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Contenu */}
      <div className="mt-4">
        <div className="space-y-4">
          {renderContent()}
        </div>
      </div>
    </>
  );
}


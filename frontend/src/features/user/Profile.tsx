import { useParams } from 'react-router-dom';
import { useGetTweetsCollection, useGetTweets } from "@/api/queries/tweetQueries";
import { Tweet, TweetWithAuthor } from "@/types";
import { useGetUserById, useGetFollowers, useGetFollowings } from "@/api/queries/userQueries";
import { Tweet as TweetComponent } from "@/components/feed/Tweet";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar"
import { Button } from "@/components/ui/Button"
import { useAuthStore } from "@/stores/authStore";
import { Calendar, Link2 } from "lucide-react"
import UserListModal from "@/components/profile/UserListModal";
import SearchBar from '@/components/layout/Searchbar';
import { Sidebar } from '@/components/ui/Sidebar';
import { Navigate } from 'react-router-dom';

const tabs = [
  { id: 'posts', label: 'Posts' },
  { id: 'likes', label: 'J\'aime' },
  { id: 'retweets', label: 'Retweets' },
];

export default function Profile() {
  const { id } = useParams();
  const [selectedTab, setSelectedTab] = useState<string>("posts");
  const { user } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);

  const { data: userData, isLoading: isLoadingUser } = useGetUserById(id || '');
  const { data: tweets, isLoading: isLoadingTweets } = useGetTweets(1);
  const { data: tweetsLiked, isLoading: isLoadingLikes } = useGetTweetsCollection(id || '', { type: 'liked', user_id: id });
  const { data: tweetsRetweeted, isLoading: isLoadingRetweets } = useGetTweetsCollection(id || '', { type: 'retweet', user_id: id });
  
  const userId = userData?._id || "";
  const { data: followers = [], isLoading: isLoadingFollowers } = useGetFollowers(userId);
  const { data: followings = [], isLoading: isLoadingFollowings } = useGetFollowings(userId);

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
          tweets.map((tweet: TweetWithAuthor) => (
            <TweetComponent key={tweet._id} tweet={tweet} />
          ))
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-center py-4">
            Aucun tweet n'est disponible
          </p>
        );
    }
  };

  if(user?._id == userData?._id) {
    return <Navigate to="/profil" />
  }

  if (isLoadingUser) {
    return <div>Chargement...</div>;
  }

  if (!userData) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-purple-50">

      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">


          <div className="overflow-hidden rounded-xl bg-white/80 backdrop-blur-sm shadow-sm dark:bg-gray-800/80">
            {/* Banner with gradient */}
            <div className="h-48 w-full bg-gradient-to-r from-pink-400 to-blue-500">
              <img
                src={userData.banner_photo || "/placeholder.svg?height=192&width=768"}
                alt="Profile banner"
                className="h-full w-full object-cover opacity-60"
              />
            </div>

            {/* Profile Info */}
            <div className="relative px-4 pb-4 pt-20">
              <div className="absolute -top-16 left-4 rounded-full border-4 border-white dark:border-gray-800">
                <Avatar className="h-32 w-32">
                  <AvatarImage src={userData.avatar || "/placeholder.svg?height=128&width=128"} alt={userData.username} />
                  <AvatarFallback>{userData.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
              </div>

              <div className="flex justify-between">
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text text-transparent">
                    {userData.username}
                  </h1>
                  <p className="text-gray-500 dark:text-gray-400">@{userData.identifier_name}</p>
                </div>
                <div className="flex gap-2">
                  {user?._id != userData._id && (
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600"
                    >
                      Suivre
                    </Button>
                  )}
                </div>
              </div>

              <p className="mt-4">{userData.bio}</p>

              <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-500 dark:text-gray-400">
                {userData.website_link && (
                  <div className="flex items-center gap-1">
                    <Link2 className="h-4 w-4 text-blue-500" />
                    <a href={userData.website_link} className="text-blue-500 hover:underline">
                      {userData.website_link}
                    </a>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4 text-purple-500" />
                  <span>A rejoint en {new Date(userData.created_at).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}</span>
                </div>
              </div>

              <div className="mt-4 flex gap-4">
                <button
                  onClick={() => setShowFollowingModal(true)}
                  className="hover:opacity-75 transition-opacity"
                >
                  <span className="font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                    {followings.length}
                  </span>{" "}
                  <span className="text-gray-500 dark:text-gray-400">Abonnements</span>
                </button>
                <button
                  onClick={() => setShowFollowersModal(true)}
                  className="hover:opacity-75 transition-opacity"
                >
                  <span className="font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
                    {followers.length}
                  </span>{" "}
                  <span className="text-gray-500 dark:text-gray-400">Abonnés</span>
                </button>
              </div>
            </div>
          </div>

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

          {/* Modales */}
          <UserListModal 
            isOpen={showFollowersModal} 
            onClose={() => setShowFollowersModal(false)} 
            type="followers" 
            persons={followers}
            isLoading={isLoadingFollowers}
          />
          <UserListModal 
            isOpen={showFollowingModal} 
            onClose={() => setShowFollowingModal(false)} 
            type="following" 
            persons={followings}
            isLoading={isLoadingFollowings}
          />
    </div>
  );
}

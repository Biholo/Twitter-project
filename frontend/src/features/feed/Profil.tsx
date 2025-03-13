import TwitterProfile from "@/components/feed/TwitterProfile"
import { useGetTweetsCollection, useGetTweets } from "@/api/queries/tweetQueries";
import { Tweet, UpdateUser, TweetWithAuthor } from "@/types";
import { Tweet as TweetComponent } from "@/components/feed/Tweet";
import { useAuthStore } from "@/stores/authStore";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { updateUserSchema, UpdateUserForm } from "@/validators/userValidator";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { useUpdateUser } from "@/api/queries/userQueries";

const tabs = [
  { id: 'posts', label: 'Posts' },
  { id: 'likes', label: 'J\'aime' },
  { id: 'retweets', label: 'Retweets' },
];

export default function Profil() {
  const { user } = useAuthStore();
  const [showUpdateProfileModal, setShowUpdateProfileModal] = useState(false);
  const [selectedTab, setSelectedTab] = useState<string>("posts");
  const userId = user?._id || "";
  const { mutate: updateUser, isPending: isUpdating } = useUpdateUser();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateUserForm>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      username: user?.username || "",
      identifier_name: user?.identifier_name || "",
      email: user?.email || "",
      bio: user?.bio || "",
      website_link: user?.website_link || "",
      accept_notifications: user?.accept_notifications || false,
    },
  });

  const onSubmit = async (values: UpdateUserForm) => {
    try {
      updateUser({ id: userId, data: values as UpdateUser });
      setShowUpdateProfileModal(false);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil:", error);
    }
  };

  const { data: tweets, isLoading: isLoadingTweets } = useGetTweets();
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

  return (
    <>
        <TwitterProfile setIsModalOpen={setShowUpdateProfileModal} />


      {showUpdateProfileModal && (
        <Modal
          isOpen={showUpdateProfileModal}
          onClose={() => setShowUpdateProfileModal(false)}
          title="Mettre à jour le profil"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nom d'utilisateur</label>
              <Input
                {...register("username")}
                placeholder="Nom d'utilisateur"
                error={errors.username?.message}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Identifiant</label>
              <Input
                {...register("identifier_name")}
                placeholder="Identifiant"
                error={errors.identifier_name?.message}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                {...register("email")}
                type="email"
                placeholder="Email"
                error={errors.email?.message}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Bio</label>
              <Textarea
                {...register("bio")}
                placeholder="Bio"
                maxLength={160}
                className="p-2"
                error={errors.bio?.message}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Site web</label>
              <Input
                {...register("website_link")}
                type="url"
                placeholder="https://..."
                error={errors.website_link?.message}
              />
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowUpdateProfileModal(false)}
              >
                Annuler
              </Button>
              <Button
              size="sm"
              type="submit"
              className="bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600"
              disabled={isUpdating}
            >
              {isUpdating ? "Enregistrement..." : "Enregistrer"}
            </Button>
            </div>
          </form>
        </Modal>
      )}
      
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


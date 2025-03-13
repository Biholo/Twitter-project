import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar"
import { Button } from "@/components/ui/Button"
import { useAuthStore } from "@/stores/authStore";
import { Calendar, Link2 } from "lucide-react"
import { useState } from "react"
import UserListModal from "@/components/profile/UserListModal";
import { useGetFollowers, useGetFollowings } from "@/api/queries/userQueries";

export default function TwitterProfile({ setIsModalOpen }: { setIsModalOpen: (isOpen: boolean) => void }) {
    const { user } = useAuthStore();
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);

  const userId = user?._id || "";
  const { data: followers = [], isLoading: isLoadingFollowers } = useGetFollowers(userId);
  const { data: followings = [], isLoading: isLoadingFollowings } = useGetFollowings(userId);

  return (
    <>
      <div className="overflow-hidden rounded-xl bg-white/80 backdrop-blur-sm shadow-sm dark:bg-gray-800/80">
        {/* Banner with gradient */}
        <div className="h-48 w-full bg-gradient-to-r from-pink-400 to-blue-500">
          <img
            src="/placeholder.svg?height=192&width=768"
            alt="Profile banner"
            className="h-full w-full object-cover opacity-60"
          />
        </div>

        {/* Profile Info */}
        <div className="relative px-4 pb-4 pt-20">
          <div className="absolute -top-16 left-4 rounded-full border-4 border-white dark:border-gray-800">
            <Avatar className="h-32 w-32">
              <AvatarImage src="/placeholder.svg?height=128&width=128" alt="@username" />
              <AvatarFallback>{user?.username.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
          </div>

          <div className="flex justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text text-transparent">
                {user?.username}
              </h1>
              <p className="text-gray-500 dark:text-gray-400">@{user?.identifier_name}</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="border-pink-300 hover:bg-pink-50 dark:border-pink-800 dark:hover:bg-pink-950"
                onClick={() => setIsModalOpen(true)}
              >
                Modifier le profil
              </Button>
            </div>
          </div>

          <p className="mt-4">
            {user?.bio}
          </p>

          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <Link2 className="h-4 w-4 text-blue-500" />
              <a href="#" className="text-blue-500 hover:underline">
                jeandupont.dev
              </a>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4 text-purple-500" />
              <span>A rejoint en {user?.created_at ? new Date(user.created_at).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }) : ''} </span>
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

      {/* Modales unifiées */}
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
    </>
  );
}


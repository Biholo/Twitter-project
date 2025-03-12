import { Button } from '@/components/ui/Button'
import { useFollowUser } from '@/api/queries/userQueries';

interface SuggestionCardProps {
  id: string;
  username: string;
  identifier_name: string;
  bio?: string;
  avatar?: string;
}

export default function SuggestionCard({ id, username, identifier_name, bio, avatar }: SuggestionCardProps) {
  const { mutate: followUser, isPending: isFollowing } = useFollowUser();

  const handleFollow = (id: string) => {
    followUser(id);
  }

  return (
    <div className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-full bg-gradient-to-r from-pink-300 to-blue-300 flex items-center justify-center text-white font-semibold">
          {avatar ? (
            <img src={avatar} alt={username} className="h-full w-full rounded-full object-cover" />
          ) : (
            username.charAt(0).toUpperCase()
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-medium">{username}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">@{identifier_name}</div>
          {bio && <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 truncate max-w-[200px]">{bio}</p>}
        </div>
      </div>
      <Button
        size="sm"
        className="bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600"
        onClick={() => handleFollow(id)}
        disabled={isFollowing}>
        {isFollowing ? "En cours" : "Suivre"}
      </Button>
    </div>
  )
}

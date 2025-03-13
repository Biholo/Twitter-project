import { useGetTweetsCollection } from "@/api/queries/tweetQueries";
import { useAuthStore } from "@/stores/authStore";
import { Tweet } from "@/types/tweetType";
import { Tweet as TweetComponent } from "@/components/feed/Tweet";

export default function Signets() {
  const { user } = useAuthStore();
  const userId = user?._id || "";
  const {
    data: tweets = [],
    isLoading,
    isError: _isError,
  } = useGetTweetsCollection(userId, {
    type: "saved",
    page: 1,
    limit: 10,
    user_id: user?._id,
  });

  return (
    <>
      <div className="sticky top-0 z-10 pt-4 pb-2 bg-gradient-to-br from-rose-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Signets</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              @{user?.identifier_name}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4">
        {isLoading ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-2">
              Chargement des signets...
            </h2>
          </div>
        ) : (
          <div className="space-y-4">
            {tweets.length === 0 ? (
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold mb-2">
                  Sauvegardez des Tweets pour plus tard
                </h2>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  Ne perdez pas ce Tweet ! Sauvegardez-le dans vos signets pour
                  y revenir facilement.
                </p>
              </div>
            ) : (
              tweets.map((tweet: Tweet) => (
                <TweetComponent key={tweet._id} tweet={tweet} />
              ))
            )}
          </div>
        )}
      </div>
    </>
  );
}

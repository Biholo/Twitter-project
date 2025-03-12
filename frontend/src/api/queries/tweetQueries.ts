import TweetApi from "@/api/tweetService";
import { queryClient } from "@/configs/queryClient";
import { useAuthStore } from "@/stores/authStore";
import { CreateTweet, Tweet, TweetQueryParams } from "@/types/tweetType";
import { useMutation, useQuery } from "@tanstack/react-query";

const tweetApi = new TweetApi();

export const useCreateTweet = () => {
  const { user } = useAuthStore();

  return useMutation({
    mutationFn: (tweetData: CreateTweet) =>
      tweetApi.createTweet(tweetData),

    // En cas d'erreur
    onError: (err) => {
      console.error("Erreur lors de la création du tweet:", err);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["tweet", data.data.parent_tweet_id] });
    },

    // Après la mutation (succès ou échec), invalider les requêtes pour rafraîchir les données
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tweets", user?._id] });
    },
  });
};

export const useLikeTweet = () => {
  const { user } = useAuthStore();
  
  return useMutation({
    mutationFn: (tweetId: string) => tweetApi.likeTweet(tweetId),
    onMutate: async (tweetId) => {
      await queryClient.cancelQueries({ queryKey: ["tweets", user?._id] });
      const previousTweets = queryClient.getQueryData<Tweet[]>(["tweets", user?._id]);

      queryClient.setQueryData<Tweet[]>(["tweets", user?._id], (old) => {
        if (!old) return [];
        
        return old.map((tweet) =>
          tweet._id === tweetId
            ? {
                ...tweet,
                likes_count: tweet.likes_count + 1,
                is_liked: true,
              }
            : tweet
        );
      });

      return { previousTweets };
    },
    onError: (_, __, context) => {
      if (context?.previousTweets) {
        queryClient.setQueryData(["tweets", user?._id], context.previousTweets);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tweets", user?._id] });
    },
  });
};

export const useUnlikeTweet = () => {
  const { user } = useAuthStore();
  return useMutation({
    mutationFn: (tweetId: string) => tweetApi.unlikeTweet(tweetId),
    onMutate: async (tweetId) => {
      await queryClient.cancelQueries({ queryKey: ["tweets", user?._id] });
      const previousTweets = queryClient.getQueryData<Tweet[]>(["tweets", user?._id]);

      queryClient.setQueryData<Tweet[]>(["tweets", user?._id], (old) => {
        if (!old) return [];
        
        return old.map((tweet) =>
          tweet._id === tweetId
            ? {
                ...tweet,
                likes_count: Math.max(0, tweet.likes_count - 1),
                is_liked: false,
              }
            : tweet
        );
      });

      return { previousTweets };
    },
    onError: (_, __, context) => {
      if (context?.previousTweets) {
        queryClient.setQueryData(["tweets", user?._id], context.previousTweets);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tweets", user?._id] });
    },
  });
};

export const useBookmarkTweet = () => {
  const { user } = useAuthStore();
  return useMutation({
    mutationFn: (tweetId: string) => tweetApi.bookmarkTweet(tweetId),
    onMutate: async (tweetId) => {
      await queryClient.cancelQueries({ queryKey: ["tweets", user?._id] });
      const previousTweets = queryClient.getQueryData<Tweet[]>(["tweets", user?._id]);

      queryClient.setQueryData<Tweet[]>(["tweets", user?._id], (old) => {
        if (!old) return [];
        
        return old.map((tweet) =>
          tweet._id === tweetId
            ? {
                ...tweet,
                saves_count: tweet.saves_count + 1,
                is_saved: true,
              }
            : tweet
        );
      });

      return { previousTweets };
    },
    onError: (_, __, context) => {
      if (context?.previousTweets) {
        queryClient.setQueryData(["tweets", user?._id], context.previousTweets);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tweets", user?._id] });
    },
  });
};

export const useUnbookmarkTweet = () => {
  const { user } = useAuthStore();

  return useMutation({
    mutationFn: (tweetId: string) => tweetApi.unbookmarkTweet(tweetId),
    onMutate: async (tweetId) => {
      await queryClient.cancelQueries({ queryKey: ["tweets", user?._id] });
      const previousTweets = queryClient.getQueryData<Tweet[]>(["tweets", user?._id]);

      queryClient.setQueryData<Tweet[]>(["tweets", user?._id], (old) => {
        if (!old) return [];
        
        return old.map((tweet) =>
          tweet._id === tweetId
            ? {
                ...tweet,
                saves_count: Math.max(0, tweet.saves_count - 1),
                is_saved: false,
              }
            : tweet
        );
      });

      return { previousTweets };
    },
    onError: (_, __, context) => {
      if (context?.previousTweets) {
        queryClient.setQueryData(["tweets", user?._id], context.previousTweets);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tweets", user?._id] });
    },
  });
};

export const useGetTweets = (params: TweetQueryParams = {}) => {
  const { user } = useAuthStore();
  const queryKey = ["tweets", user?._id];

  return useQuery<Tweet[], Error>({
    queryKey,
    queryFn: () =>
      tweetApi
        .getTweets(params)
        .then((response) =>
          Array.isArray(response) ? response : response.data
        ),
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60,
  });
};

export const useGetTweetsCollection = (
  userId: string,
  params: {
    type?: "liked" | "saved" | "retweet";
    page?: number;
    limit?: number;
    user_id?: string;
  } = {}
) => {
  const { user } = useAuthStore();
  const queryKey = ["tweets", user?._id];

  return useQuery<Tweet[], Error>({
    queryKey,
    queryFn: () =>
      tweetApi
        .getUserTweetCollection(userId, params)
        .then((response) =>
          Array.isArray(response) ? response : response.data
        ),
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60,
  });
};

export const useGetTweetById = (tweetId: string) => {
  return useQuery<Tweet, Error>({
    queryKey: ["tweet", tweetId],
    queryFn: () => tweetApi.getTweetById(tweetId).then((response) => response.data),
  });
};


export const useRetweetTweet = () => {
  return useMutation({
    mutationFn: (tweetId: string) => tweetApi.retweetTweet(tweetId),
    onMutate: async (tweetId) => {
      // Annuler les requêtes en cours pour éviter les conflits
      await queryClient.cancelQueries({ queryKey: ["tweets"] });
      await queryClient.cancelQueries({ queryKey: ["tweet", tweetId] });
      
      // Sauvegarder l'état précédent
      const previousTweets = queryClient.getQueryData<{ data: Tweet[] }>(["tweets"]);
      const previousTweet = queryClient.getQueryData<{ data: Tweet }>(["tweet", tweetId]);

      // Mettre à jour les tweets dans le cache
      queryClient.setQueryData<{ data: Tweet[] }>(["tweets"], (old) => {
        if (!old) return { data: [] };
        return {
          ...old,
          data: old.data.map((tweet) =>
            tweet._id === tweetId
              ? {
                  ...tweet,
                  retweets_count: tweet.retweets_count + 1,
                  is_retweeted: true,
                }
              : tweet
          ),
        };
      });

      // Mettre à jour le tweet individuel dans le cache si nécessaire
      if (previousTweet) {
        queryClient.setQueryData<{ data: Tweet }>(["tweet", tweetId], (old) => {
          if (!old) return previousTweet;
          return {
            ...old,
            data: {
              ...old.data,
              retweets_count: old.data.retweets_count + 1,
              is_retweeted: true,
            },
          };
        });
      }

      return { previousTweets, previousTweet };
    },
    onError: (_, __, context) => {
      // En cas d'erreur, restaurer l'état précédent
      if (context?.previousTweets) {
        queryClient.setQueryData(["tweets"], context.previousTweets);
      }
      if (context?.previousTweet) {
        queryClient.setQueryData(["tweet", context.tweetId], context.previousTweet);
      }
    },
    onSettled: (_, __, tweetId) => {
      // Invalider les requêtes pour rafraîchir les données
      queryClient.invalidateQueries({ queryKey: ["tweets"] });
      queryClient.invalidateQueries({ queryKey: ["tweet", tweetId] });
      // Invalider également les collections de tweets de l'utilisateur
      const { user } = useAuthStore.getState();
      if (user?._id) {
        queryClient.invalidateQueries({ queryKey: ["tweets", user._id] });
      }
    },
  });
};

export const useUnretweetTweet = () => {
  return useMutation({
    mutationFn: (tweetId: string) => tweetApi.unretweetTweet(tweetId),
    onMutate: async (tweetId) => {
      // Annuler les requêtes en cours pour éviter les conflits
      await queryClient.cancelQueries({ queryKey: ["tweets"] });
      await queryClient.cancelQueries({ queryKey: ["tweet", tweetId] });
      
      // Sauvegarder l'état précédent
      const previousTweets = queryClient.getQueryData<{ data: Tweet[] }>(["tweets"]);
      const previousTweet = queryClient.getQueryData<{ data: Tweet }>(["tweet", tweetId]);

      // Mettre à jour les tweets dans le cache
      queryClient.setQueryData<{ data: Tweet[] }>(["tweets"], (old) => {
        if (!old) return { data: [] };
        return {
          ...old,
          data: old.data.map((tweet) =>
            tweet._id === tweetId
              ? {
                  ...tweet,
                  retweets_count: Math.max(0, tweet.retweets_count - 1),
                  is_retweeted: false,
                }
              : tweet
          ),
        };
      });

      // Mettre à jour le tweet individuel dans le cache si nécessaire
      if (previousTweet) {
        queryClient.setQueryData<{ data: Tweet }>(["tweet", tweetId], (old) => {
          if (!old) return previousTweet;
          return {
            ...old,
            data: {
              ...old.data,
              retweets_count: Math.max(0, old.data.retweets_count - 1),
              is_retweeted: false,
            },
          };
        });
      }

      return { previousTweets, previousTweet, tweetId };
    },
    onError: (_, __, context) => {
      // En cas d'erreur, restaurer l'état précédent
      if (context?.previousTweets) {
        queryClient.setQueryData(["tweets"], context.previousTweets);
      }
      if (context?.previousTweet && context?.tweetId) {
        queryClient.setQueryData(["tweet", context.tweetId], context.previousTweet);
      }
    },
    onSettled: (_, __, tweetId) => {
      // Invalider les requêtes pour rafraîchir les données
      queryClient.invalidateQueries({ queryKey: ["tweets"] });
      queryClient.invalidateQueries({ queryKey: ["tweet", tweetId] });
      // Invalider également les collections de tweets de l'utilisateur
      const { user } = useAuthStore.getState();
      if (user?._id) {
        queryClient.invalidateQueries({ queryKey: ["tweets", user._id] });
      }
    },
  });
};

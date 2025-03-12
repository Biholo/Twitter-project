import TweetApi from "@/api/tweetService";
import queryClient from "@/configs/queryClient";
import { useAuthStore } from "@/stores/authStore";
import { Tweet, TweetQueryParams } from "@/types/tweetType";
import { useMutation, useQuery } from "@tanstack/react-query";

const tweetApi = new TweetApi();

export const useGetTweetByUser = () => {
    const { user } = useAuthStore();
    
    return useQuery({ 
        queryKey: ["tweets", user?._id], 
        queryFn: () => {
            if (user?._id) {
                return tweetApi.getTweets();
            }
            return null;
        },
        enabled: !!user?._id
    });
}

export const useCreateTweet = () => {
    const { user } = useAuthStore();
    
    return useMutation({ 
        mutationFn: (tweetData: Partial<Tweet>) => tweetApi.createTweet(tweetData as Tweet),
        
        // Mise à jour optimiste
        onMutate: async (newTweet) => {
            // Annuler les requêtes en cours pour éviter d'écraser notre mise à jour optimiste
            await queryClient.cancelQueries({ queryKey: ["tweets", user?._id] });
            
            // Sauvegarder l'état précédent
            const previousTweets = queryClient.getQueryData<{ data: Tweet[] }>(["tweets", user?._id]);
            
            // Créer un faux ID temporaire pour le nouveau tweet
            const tempId = `temp-${Date.now()}`;
            
            // Créer un tweet temporaire avec toutes les propriétés nécessaires
            const optimisticTweet: Tweet = {
                _id: tempId,
                content: newTweet.content || "",
                author: user!,
                likes_count: 0,
                retweets_count: 0,
                saves_count: 0,
                replies: [],
                // Ajouter d'autres propriétés par défaut si nécessaire
                ...newTweet,
            };
            
            // Mettre à jour le cache avec le nouveau tweet
            queryClient.setQueryData<{ data: Tweet[] }>(["tweets", user?._id], (old) => {
                if (!old) return { data: [optimisticTweet] };
                return { 
                    ...old,
                    data: [optimisticTweet, ...old.data] 
                };
            });
            
            // Retourner le contexte avec l'état précédent pour pouvoir revenir en arrière en cas d'erreur
            return { previousTweets };
        },
        
        // En cas d'erreur, revenir à l'état précédent
        onError: (err, newTweet, context) => {
            console.error("Erreur lors de la création du tweet:", err);
            if (context?.previousTweets) {
                queryClient.setQueryData(["tweets", user?._id], context.previousTweets);
            }
        },
        
        // Après la mutation (succès ou échec), invalider les requêtes pour rafraîchir les données
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["tweets", user?._id] });
        }
    });
}

export const useLikeTweet = () => {
    return useMutation({
        mutationFn: (tweetId: string) => tweetApi.likeTweet(tweetId),
        onMutate: async (tweetId) => {
            await queryClient.cancelQueries({ queryKey: ["tweets"] });
            const previousTweets = queryClient.getQueryData<{ data: Tweet[] }>(["tweets"]);

            queryClient.setQueryData<{ data: Tweet[] }>(["tweets"], (old) => {
                if (!old) return { data: [] };
                return {
                    ...old,
                    data: old.data.map(tweet => 
                        tweet._id === tweetId 
                            ? { 
                                ...tweet, 
                                likes_count: tweet.likes_count + 1,
                                is_liked: true 
                            } 
                            : tweet
                    )
                };
            });

            return { previousTweets };
        },
        onError: (_, __, context) => {
            if (context?.previousTweets) {
                queryClient.setQueryData(["tweets"], context.previousTweets);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["tweets"] });
        }
    });
};

export const useUnlikeTweet = () => {
    return useMutation({
        mutationFn: (tweetId: string) => tweetApi.unlikeTweet(tweetId),
        onMutate: async (tweetId) => {
            await queryClient.cancelQueries({ queryKey: ["tweets"] });
            const previousTweets = queryClient.getQueryData<{ data: Tweet[] }>(["tweets"]);

            queryClient.setQueryData<{ data: Tweet[] }>(["tweets"], (old) => {
                if (!old) return { data: [] };
                return {
                    ...old,
                    data: old.data.map(tweet => 
                        tweet._id === tweetId 
                            ? { 
                                ...tweet, 
                                likes_count: Math.max(0, tweet.likes_count - 1),
                                is_liked: false 
                            } 
                            : tweet
                    )
                };
            });

            return { previousTweets };
        },
        onError: (_, __, context) => {
            if (context?.previousTweets) {
                queryClient.setQueryData(["tweets"], context.previousTweets);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["tweets"] });
        }
    });
};

export const useBookmarkTweet = () => {
    return useMutation({
        mutationFn: (tweetId: string) => tweetApi.bookmarkTweet(tweetId),
        onMutate: async (tweetId) => {
            await queryClient.cancelQueries({ queryKey: ["tweets"] });
            const previousTweets = queryClient.getQueryData<{ data: Tweet[] }>(["tweets"]);

            queryClient.setQueryData<{ data: Tweet[] }>(["tweets"], (old) => {
                if (!old) return { data: [] };
                return {
                    ...old,
                    data: old.data.map(tweet => 
                        tweet._id === tweetId 
                            ? { 
                                ...tweet, 
                                saves_count: tweet.saves_count + 1,
                                is_saved: true 
                            } 
                            : tweet
                    )
                };
            });

            return { previousTweets };
        },
        onError: (_, __, context) => {
            if (context?.previousTweets) {
                queryClient.setQueryData(["tweets"], context.previousTweets);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["tweets"] });
        }
    });
};

export const useUnbookmarkTweet = () => {
    return useMutation({
        mutationFn: (tweetId: string) => tweetApi.unbookmarkTweet(tweetId),
        onMutate: async (tweetId) => {
            await queryClient.cancelQueries({ queryKey: ["tweets"] });
            const previousTweets = queryClient.getQueryData<{ data: Tweet[] }>(["tweets"]);

            queryClient.setQueryData<{ data: Tweet[] }>(["tweets"], (old) => {
                if (!old) return { data: [] };
                return {
                    ...old,
                    data: old.data.map(tweet => 
                        tweet._id === tweetId 
                            ? { 
                                ...tweet, 
                                saves_count: Math.max(0, tweet.saves_count - 1),
                                is_saved: false 
                            } 
                            : tweet
                    )
                };
            });

            return { previousTweets };
        },
        onError: (_, __, context) => {
            if (context?.previousTweets) {
                queryClient.setQueryData(["tweets"], context.previousTweets);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["tweets"] });
        }
    });
};

export const useGetTweets = (params: TweetQueryParams = {}) => {
    const queryKey = ['tweets', params];
    
    return useQuery({
        queryKey,
        queryFn: () => tweetApi.getTweets(params),
        select: (response) => ({
            tweets: response.data,
        }),
        placeholderData: (previousData) => previousData,
        staleTime: 1000 * 60
    });
};
import TweetApi from "@/api/tweetApi";
import queryClient from "@/configs/queryClient";
import { useAuthStore } from "@/stores/authStore";
import { Tweet } from "@/types";
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

// Vous pouvez ajouter d'autres hooks pour les autres opérations (like, retweet, bookmark, etc.)
export const useLikeTweet = () => {
    const { user } = useAuthStore();
    
    return useMutation({
        mutationFn: async (tweetId: string) => {
            const tweets = queryClient.getQueryData<{ data: Tweet[] }>(["tweets", user?._id]);
            const tweet = tweets?.data?.find(t => t._id === tweetId);
            
            if (tweet?.is_liked) {
                return tweetApi.unlikeTweet(tweetId);
            } else {
                return tweetApi.likeTweet(tweetId);
            }
        },

        onMutate: async (tweetId) => {
            await queryClient.cancelQueries({ queryKey: ["tweets", user?._id] });
            
            const previousTweets = queryClient.getQueryData<{ data: Tweet[] }>(["tweets", user?._id]);
            
            // Mise à jour optimiste du cache
            queryClient.setQueryData<{ data: Tweet[] }>(["tweets", user?._id], (old) => {
                if (!old?.data) return previousTweets;
                return {
                    ...old,
                    data: old.data.map(tweet => {
                        if (tweet._id === tweetId) {
                            const newIsLiked = !tweet.is_liked;
                            return {
                                ...tweet,
                                is_liked: newIsLiked,
                                likes_count: newIsLiked ? tweet.likes_count + 1 : tweet.likes_count - 1
                            };
                        }
                        return tweet;
                    })
                };
            });
            
            return { previousTweets };
        },

        onSuccess: () => {
            // Rafraîchir les tweets après un like réussi
            queryClient.invalidateQueries({ queryKey: ["tweets", user?._id] });
        },

        onError: (error, tweetId, context) => {
            console.error("Erreur lors du like:", error);
            if (context?.previousTweets) {
                queryClient.setQueryData(["tweets", user?._id], context.previousTweets);
            }
        }
    });
};

export const useBookmarkTweet = () => {
    return useMutation({
        mutationFn: (tweetId: string) => tweetApi.bookmarkTweet(tweetId),
        // Implémentez la mise à jour optimiste similaire à useCreateTweet
    });
}
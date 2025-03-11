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
            const previousTweets = queryClient.getQueryData(["tweets", user?._id]);
            
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
                created_at: new Date().toISOString(),
                ...newTweet,
            };
            
            // Mettre à jour le cache avec le nouveau tweet
            queryClient.setQueryData(["tweets", user?._id], (old: any) => {                
                // Si old est null ou undefined
                if (!old) return { data: [optimisticTweet] };
                
                // Si old est un tableau (la réponse directe est un tableau)
                if (Array.isArray(old)) {
                    return [optimisticTweet, ...old];
                }
                
                // Si old a une propriété data qui est un tableau
                if (old.data && Array.isArray(old.data)) {
                    return { 
                        ...old,
                        data: [optimisticTweet, ...old.data] 
                    };
                }
                
                // Si old est un objet mais sans propriété data ou data n'est pas un tableau
                return { data: [optimisticTweet] };
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
    return useMutation({
        mutationFn: (tweetId: string) => tweetApi.likeTweet(tweetId),
        // Implémentez la mise à jour optimiste similaire à useCreateTweet
    });
}

export const useBookmarkTweet = () => {
    return useMutation({
        mutationFn: (tweetId: string) => tweetApi.bookmarkTweet(tweetId),
        // Implémentez la mise à jour optimiste similaire à useCreateTweet
    });
}
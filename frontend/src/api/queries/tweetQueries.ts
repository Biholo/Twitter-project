import TweetApi from "@/api/tweetApi";
import { queryClient } from "@/configs/queryClient";
import { useAuthStore } from "@/stores/authStore";
import { ApiResponse, PaginatedTweets, Tweet, TweetPage, TweetWithAuthor } from "@/types";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

interface PreviousQueryData {
  [key: string]: PaginatedTweets | undefined;
}

const tweetApi = new TweetApi();

// Fonction utilitaire pour générer des clés de requête cohérentes
const getQueryKeys = (user_id?: string, params?: number) => {
  const baseKey = ["tweets"];
  
  // Clé pour les tweets standards (liste)
  const standardKey = [...baseKey, user_id];
  
  // Clé pour les tweets avec pagination infinie
  const infiniteKey = [...baseKey, "infinite", user_id];
  
  // Clé pour les collections de tweets (liked, saved, etc.)
  const collectionKey = [...baseKey, "collection", user_id];
  
  // Clé pour un tweet spécifique
  const tweetKey = (tweetId: string) => ["tweet", tweetId];
  
  // Si des paramètres sont fournis, les ajouter aux clés
  if (params) {
    return {
      standardKey: [...standardKey, params],
      infiniteKey: [...infiniteKey, params],
      collectionKey: [...collectionKey, params],
      tweetKey,
      all: [standardKey, infiniteKey, collectionKey]
    };
  }
  
  return {
    standardKey,
    infiniteKey,
    collectionKey,
    tweetKey,
    all: [standardKey, infiniteKey, collectionKey]
  };
};

export const useCreateTweet = () => {
  return useMutation({
    mutationFn: (tweetData: FormData) => {
      const toastId = toast.loading("Envoi du tweet en cours...");
      
      console.log("Tweet data", tweetData);
      
      return tweetApi.createTweet(tweetData)
        .then(response => {
          return { response, toastId };
        })
        .catch(error => {
          toast.update(toastId, { 
            render: "Erreur lors de l'envoi du tweet", 
            type: "error", 
            isLoading: false,
            autoClose: 3000
          });
          throw error;
        });
    },
    
    onError: (error) => {
      console.error("Erreur lors de la création du tweet:", error);
    },
    
    onSuccess: (data, formData) => {
      const { response, toastId } = data;
      
      toast.update(toastId, { 
        render: "Tweet publié avec succès !", 
        type: "success", 
        isLoading: false,
        autoClose: 2000
      });
      
      const parent_tweet_id = formData.get('parent_tweet_id') as string;
      
      if (parent_tweet_id) {
        queryClient.invalidateQueries({ 
          queryKey: ["tweet", parent_tweet_id] 
        });
      }
      
      queryClient.invalidateQueries({ 
        queryKey: ["tweets"] 
      });
      
      console.log("Tweet créé avec succès:", response);
    }
  });
};

export const useLikeTweet = () => {
  const { user } = useAuthStore();
  const keys = getQueryKeys(user?._id);
  
  return useMutation<ApiResponse<Tweet>, Error, string, { previousData: PreviousQueryData }>({
    mutationFn: (tweetId: string) => {
      return tweetApi.likeTweet(tweetId);
    },
    onMutate: async (tweetId) => {
      // Identifier toutes les clés de requête possibles qui pourraient contenir ce tweet
      const possibleQueryKeys = [...keys.all, keys.tweetKey(tweetId)];
      
      // Annuler toutes les requêtes en cours pour ces clés
      for (const key of possibleQueryKeys) {
        await queryClient.cancelQueries({ queryKey: key });
      }
      
      // Sauvegarder l'état précédent pour toutes les clés
      const previousData: PreviousQueryData = {};
      for (const key of possibleQueryKeys) {
        const keyString = JSON.stringify(key);
        previousData[keyString] = queryClient.getQueryData(key);
      }
      
      // Fonction utilitaire pour mettre à jour un tweet dans n'importe quelle structure
      const updateTweetInData = (oldData: PaginatedTweets | TweetPage[] | Tweet[] | Tweet | null): PaginatedTweets | TweetPage[] | Tweet[] | Tweet | null => {
        // Si les données sont null ou undefined, retourner tel quel
        if (!oldData) return oldData;
        
        // Si c'est un tweet unique
        if (!Array.isArray(oldData) && '_id' in oldData && oldData._id === tweetId) {
          return {
            ...oldData,
            likes_count: oldData.likes_count + 1,
            is_liked: true
          };
        }
        
        // Si c'est une structure paginée
        if (!Array.isArray(oldData) && 'pages' in oldData) {
          return {
            ...oldData,
            pages: oldData.pages.map((page: TweetPage) => ({
              ...page,
              data: page.data.map((tweet: TweetWithAuthor) => 
                tweet._id === tweetId 
                  ? { ...tweet, likes_count: tweet.likes_count + 1, is_liked: true }
                  : tweet
              )
            }))
          };
        }
          
        return oldData;
      };
      
      // Mettre à jour les données pour toutes les clés
      for (const key of possibleQueryKeys) {
        try {
          queryClient.setQueryData(key, (oldData: PaginatedTweets) => updateTweetInData(oldData));
        } catch (error) {
          console.error(`Erreur lors de la mise à jour des données pour la clé ${JSON.stringify(key)}:`, error);
        }
      }
      
      return { previousData };
    },
    onError: (error, tweetId, context) => {
      console.error("Erreur lors du like du tweet:", error, "pour le tweet:", tweetId);
      
      // Restaurer l'état précédent pour toutes les clés
      if (context?.previousData) {
        for (const [keyString, data] of Object.entries(context.previousData)) {
          if (data) {
            const key = JSON.parse(keyString);
            queryClient.setQueryData(key, data);
          }
        }
      }
    },
    onSettled: () => {
      // Invalider toutes les requêtes potentiellement affectées
      queryClient.invalidateQueries({ queryKey: ["tweets"] });
    },
  });
};

export const useUnlikeTweet = () => {
  const { user } = useAuthStore();
  
  return useMutation({
    mutationFn: (tweetId: string) => {
      return tweetApi.unlikeTweet(tweetId);
    },
    onMutate: async (tweetId) => {
      // Identifier toutes les clés de requête possibles qui pourraient contenir ce tweet
      const possibleQueryKeys = [
        ["tweet", tweetId],
        ["tweets", user?._id],
        ["tweets", "infinite", user?._id],
        ["tweets", "collection", "infinite", user?._id],
        ["tweets", "collection", "infinite", user?._id, user?._id]
      ];
      
      // Annuler toutes les requêtes en cours pour ces clés
      for (const key of possibleQueryKeys) {
        await queryClient.cancelQueries({ queryKey: key });
      }
      
      // Sauvegarder l'état précédent pour toutes les clés
      const previousData: PreviousQueryData = {};
      for (const key of possibleQueryKeys) {
        const keyString = JSON.stringify(key);
        previousData[keyString] = queryClient.getQueryData(key);
      }
      
      // Fonction utilitaire pour mettre à jour un tweet dans n'importe quelle structure
      const updateTweetInData = (oldData: PaginatedTweets | TweetPage[] | Tweet[] | Tweet | null): PaginatedTweets | TweetPage[] | Tweet[] | Tweet | null => {

        if (!oldData) return oldData;
        
        // Si c'est un tweet unique
        if (!Array.isArray(oldData) && '_id' in oldData && oldData._id === tweetId) {
          
          return {
            ...oldData,
            likes_count: oldData.likes_count - 1,
            is_liked: false
          };
        }
  
        // Si c'est une structure paginée
        if (!Array.isArray(oldData) && 'pages' in oldData) {
          return {
            ...oldData,
            pages: oldData.pages.map((page: TweetPage) => ({
              ...page,
              data: page.data.map((tweet: TweetWithAuthor) => 
                tweet._id === tweetId 
                  ? { ...tweet, likes_count: tweet.likes_count - 1, is_liked: false }
                  : tweet
              )
            }))
          };
        }
        
        // Si aucun format reconnu, retourner les données telles quelles
        return oldData;
      };
      
      // Mettre à jour les données pour toutes les clés
      for (const key of possibleQueryKeys) {
        try {
          queryClient.setQueryData(key, (oldData: PaginatedTweets) => updateTweetInData(oldData));
        } catch (error) {
          console.error(`Erreur lors de la mise à jour des données pour la clé ${JSON.stringify(key)}:`, error);
        }
      }
      
      return { previousData };
    },
    onError: (error, tweetId, context) => {
      console.error("Erreur lors de l'unlike du tweet:", error, "pour le tweet:", tweetId);
      
      // Restaurer l'état précédent pour toutes les clés
      if (context?.previousData) {
        for (const [keyString, data] of Object.entries(context.previousData)) {
          if (data) {
            const key = JSON.parse(keyString);
            queryClient.setQueryData(key, data);
          }
        }
      }
    },
    onSettled: () => {
      // Invalider toutes les requêtes potentiellement affectées
      queryClient.invalidateQueries({ queryKey: ["tweets"] });
    },
  });
};

export const useBookmarkTweet = () => {
  const { user } = useAuthStore();
  
  return useMutation({
    mutationFn: (tweetId: string) => {
      return tweetApi.bookmarkTweet(tweetId);
    },
    onMutate: async (tweetId) => {
      // Identifier toutes les clés de requête possibles qui pourraient contenir ce tweet
      const possibleQueryKeys = [
        ["tweet", tweetId],
        ["tweets", user?._id],
        ["tweets", "infinite", user?._id],
        ["tweets", "collection", "infinite", user?._id],
        ["tweets", "collection", "infinite", user?._id, user?._id]
      ];
      
      // Annuler toutes les requêtes en cours pour ces clés
      for (const key of possibleQueryKeys) {
        await queryClient.cancelQueries({ queryKey: key });
      }
      
      // Sauvegarder l'état précédent pour toutes les clés
      const previousData: PreviousQueryData = {};
      for (const key of possibleQueryKeys) {
        const keyString = JSON.stringify(key);
        previousData[keyString] = queryClient.getQueryData(key);
      }
      
      // Fonction utilitaire pour mettre à jour un tweet dans n'importe quelle structure
      const updateTweetInData = (oldData: PaginatedTweets | TweetPage[] | Tweet[] | Tweet | null): PaginatedTweets | TweetPage[] | Tweet[] | Tweet | null => {
        // Si les données sont null ou undefined, retourner tel quel
        if (!oldData) return oldData;

        if (!Array.isArray(oldData) && '_id' in oldData && oldData._id === tweetId) {
          return {
            ...oldData,
            saves_count: oldData.saves_count + 1,
            is_saved: true
          };
        }
      
        // Si c'est une structure paginée
        if (!Array.isArray(oldData) && 'pages' in oldData) {
          return {
            ...oldData,
            pages: oldData.pages.map((page: TweetPage) => ({
              ...page,
              data: page.data.map((tweet: TweetWithAuthor) => 
                tweet._id === tweetId 
                  ? { ...tweet, saves_count: tweet.saves_count + 1, is_saved: true }
                  : tweet
              )
            }))
          };
        }
        
        // Si aucun format reconnu, retourner les données telles quelles
        return oldData;
      };
      
      // Mettre à jour les données pour toutes les clés
      for (const key of possibleQueryKeys) {
        try {
          queryClient.setQueryData(key, (oldData: PaginatedTweets) => updateTweetInData(oldData));
        } catch (error) {
          console.error(`Erreur lors de la mise à jour des données pour la clé ${JSON.stringify(key)}:`, error);
        }
      }
      
      return { previousData };
    },
    onError: (error, tweetId, context) => {
      console.error("Erreur lors du bookmark du tweet:", error, "pour le tweet:", tweetId);
      
      // Restaurer l'état précédent pour toutes les clés
      if (context?.previousData) {
        for (const [keyString, data] of Object.entries(context.previousData)) {
          if (data) {
            const key = JSON.parse(keyString);
            queryClient.setQueryData(key, data);
          }
        }
      }
    },
    onSettled: () => {
      // Invalider toutes les requêtes potentiellement affectées
      queryClient.invalidateQueries({ queryKey: ["tweets"] });
    },
  });
};

export const useUnbookmarkTweet = () => {
  const { user } = useAuthStore();
  
  return useMutation({
    mutationFn: (tweetId: string) => {
      return tweetApi.unbookmarkTweet(tweetId);
    },
    onMutate: async (tweetId) => {
      // Identifier toutes les clés de requête possibles qui pourraient contenir ce tweet
      const possibleQueryKeys = [
        ["tweet", tweetId],
        ["tweets", user?._id],
        ["tweets", "infinite", user?._id],
        ["tweets", "collection", "infinite", user?._id],
        ["tweets", "collection", "infinite", user?._id, user?._id]
      ];
      
      // Annuler toutes les requêtes en cours pour ces clés
      for (const key of possibleQueryKeys) {
        await queryClient.cancelQueries({ queryKey: key });
      }
      
      // Sauvegarder l'état précédent pour toutes les clés
      const previousData: PreviousQueryData = {};
      for (const key of possibleQueryKeys) {
        const keyString = JSON.stringify(key);
        previousData[keyString] = queryClient.getQueryData(key);
      }

      // Fonction utilitaire pour mettre à jour un tweet dans n'importe quelle structure
      const updateTweetInData = (oldData: PaginatedTweets | TweetPage[] | Tweet[] | Tweet | null): PaginatedTweets | TweetPage[] | Tweet[] | Tweet | null => {
        // Si les données sont null ou undefined, retourner tel quel
        if (!oldData) return oldData;

        if (!Array.isArray(oldData) && '_id' in oldData && oldData._id === tweetId) {
          return {
            ...oldData,
            saves_count: oldData.saves_count - 1,
            is_saved: false
          };
        }
      
        // Si c'est une structure paginée (infinite query)
        if (!Array.isArray(oldData) && 'pages' in oldData) {
          return {
            ...oldData,
            pages: oldData.pages.map((page: TweetPage) => ({
              ...page,
              data: page.data.map((tweet: TweetWithAuthor) => 
                tweet._id === tweetId 
                  ? { ...tweet, saves_count: tweet.saves_count - 1, is_saved: false }
                  : tweet
              )
            }))
          };
        }
        
        // Si aucun format reconnu, retourner les données telles quelles
        return oldData;
      };
      
      // Mettre à jour les données pour toutes les clés
      for (const key of possibleQueryKeys) {
        try {
          queryClient.setQueryData(key, (oldData: PaginatedTweets) => updateTweetInData(oldData));
        } catch (error) {
          console.error(`Erreur lors de la mise à jour des données pour la clé ${JSON.stringify(key)}:`, error);
        }
      }
      
      return { previousData };
    },
    onError: (error, tweetId, context) => {
      console.error("Erreur lors du unbookmark du tweet:", error, "pour le tweet:", tweetId);
      
      // Restaurer l'état précédent pour toutes les clés
      if (context?.previousData) {
        for (const [keyString, data] of Object.entries(context.previousData)) {
          if (data) {
            const key = JSON.parse(keyString);
            queryClient.setQueryData(key, data);
          }
        }
      }
    },
    onSettled: () => {
      // Invalider toutes les requêtes potentiellement affectées
      queryClient.invalidateQueries({ queryKey: ["tweets"] });
    },
  });
};

export const useGetTweets = (params: number = 1) => {
  const { user } = useAuthStore();
  const keys = getQueryKeys(user?._id, params);
  
  return useQuery({
    queryKey: keys.standardKey,
    queryFn: () =>
      tweetApi
        .getTweets(params)
        .then((response) => {
          const data = Array.isArray(response) ? response : response.data;
          return data;
        }),
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
  const keys = getQueryKeys(user?._id, params.page);
  
  return useQuery<Tweet[], Error>({
    queryKey: keys.collectionKey,
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
  const { user } = useAuthStore();
  const keys = getQueryKeys(user?._id);
  
  return useQuery<Tweet, Error>({
    queryKey: keys.tweetKey(tweetId),
    queryFn: () => tweetApi.getTweetById(tweetId).then((response) => response.data),
  });
};

export const useGetTweetsCollectionInfinite = () => {
  const { user } = useAuthStore();
  const keys = getQueryKeys(user?._id);
  
  return useInfiniteQuery({
    queryKey: keys.standardKey,
    queryFn: ({ pageParam = 1 }) => {
      return tweetApi.getTweets(pageParam);
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage: TweetPage) => {
      const pagination = lastPage.pagination;
      if (pagination && pagination.has_more) {
        return pagination.page + 1;        
      }
      return undefined;
    },
    staleTime: 1000 * 60,
  });
};

export const useSearchTweets = (search: string) => {
  return useQuery({
    queryKey: ["tweets", "search", search],
    queryFn: () => tweetApi.searchTweets(search).then((response) => response.data),
  });
};

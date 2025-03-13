export const retweetTweet = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { id: tweet_id } = req.params;
        const userId = req.user?.id;

        if (!userId) {
            handleError(res, new Error("Utilisateur non authentifié"), "Utilisateur non authentifié");
            return;
        }

        // Vérifier si le tweet existe
        const originalTweet = await tweetRepository.findById(tweet_id);
        if (!originalTweet) {
            handleError(res, new Error("Tweet non trouvé"), "Le tweet que vous essayez de retweeter n'existe pas");
            return;
        }

        // Vérifier si l'utilisateur a déjà retweeté ce tweet
        const existingInteraction = await tweetInteractionRepository.findOne({
            tweet_id: tweet_id,
            user_id: userId,
            action_type: 'retweet'
        });

        if (existingInteraction) {
            handleError(res, new Error("Tweet déjà retweeté"), "Vous avez déjà retweeté ce tweet");
            return;
        }

        // Créer l'interaction de retweet
        const interaction = await tweetInteractionRepository.create({ 
            tweet_id: tweet_id, 
            user_id: userId, 
            action_type: 'retweet' 
        });

        // Incrémenter le compteur de retweets du tweet original
        await tweetRepository.updateById(tweet_id, {
            $inc: { retweets_count: 1 }
        });

        res.status(200).json({
            message: "Tweet retweeté avec succès",
            interaction
        });
    } catch (error) {
        handleError(res, error, "Erreur lors du retweet.");
    }
};export const retweetTweet = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { id: tweet_id } = req.params;
        const userId = req.user?.id;

        if (!userId) {
            handleError(res, new Error("Utilisateur non authentifié"), "Utilisateur non authentifié");
            return;
        }

        // Vérifier si le tweet existe
        const originalTweet = await tweetRepository.findById(tweet_id);
        if (!originalTweet) {
            handleError(res, new Error("Tweet non trouvé"), "Le tweet que vous essayez de retweeter n'existe pas");
            return;
        }

        // Vérifier si l'utilisateur a déjà retweeté ce tweet
        const existingInteraction = await tweetInteractionRepository.findOne({
            tweet_id: tweet_id,
            user_id: userId,
            action_type: 'retweet'
        });

        if (existingInteraction) {
            handleError(res, new Error("Tweet déjà retweeté"), "Vous avez déjà retweeté ce tweet");
            return;
        }

        // Créer l'interaction de retweet
        const interaction = await tweetInteractionRepository.create({ 
            tweet_id: tweet_id, 
            user_id: userId, 
            action_type: 'retweet' 
        });

        // Créer un nouveau tweet de type retweet qui référence le tweet original
        const retweet = await tweetRepository.create({
            content: originalTweet.content,
            parent_tweet_id: tweet_id,
            tweet_type: 'retweet',
            author_id: userId,
            media_url: originalTweet.media_url
        });

        // Incrémenter le compteur de retweets du tweet original
        await tweetRepository.updateById(tweet_id, {
            $inc: { retweets_count: 1 }
        });

        res.status(200).json({
            message: "Tweet retweeté avec succès",
            interaction,
            retweet
        });
    } catch (error) {
        handleError(res, error, "Erreur lors du retweet.");
    }
};

export const unretweetTweet = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { id: tweet_id } = req.params;
        const userId = req.user?.id;

        if (!userId) {
            handleError(res, new Error("Utilisateur non authentifié"), "Utilisateur non authentifié");
            return;
        }

        // Vérifier si l'interaction existe
        const existingInteraction = await tweetInteractionRepository.findOne({
            tweet_id: tweet_id,
            user_id: userId,
            action_type: 'retweet'
        });

        if (!existingInteraction) {
            handleError(res, new Error("Retweet non trouvé"), "Vous n'avez pas retweeté ce tweet");
            return;
        }

        // Supprimer l'interaction de retweet
        const interaction = await tweetInteractionRepository.delete({ 
            tweet_id: tweet_id, 
            user_id: userId, 
            action_type: 'retweet' 
        });

        // Trouver et supprimer le tweet de type retweet
        const retweet = await tweetRepository.findOne({
            parent_tweet_id: tweet_id,
            author_id: userId,
            tweet_type: 'retweet'
        });

        if (retweet) {
            await tweetRepository.delete({ _id: retweet._id });
        }

        // Décrémenter le compteur de retweets du tweet original
        await tweetRepository.updateById(tweet_id, {
            $inc: { retweets_count: -1 }
        });

        res.status(200).json({
            message: "Retweet supprimé avec succès",
            interaction,
            retweet
        });
    } catch (error) {
        handleError(res, error, "Erreur lors de la suppression du retweet.");
    }
};

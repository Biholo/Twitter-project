import { BaseRepository } from "./baseRepository";
import TweetInteraction, { ITweetInteraction } from "@/models/tweetInteractionModel";

class TweetInteractionRepository extends BaseRepository<ITweetInteraction> {
    constructor() {
        super(TweetInteraction);
    }
}

const tweetInteractionRepository = new TweetInteractionRepository();
export default tweetInteractionRepository;

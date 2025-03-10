import { BaseRepository } from "./baseRepository";
import TweetHashtagModel, { ITweetHashtag } from "@/models/tweetHashtagModel";

class TweetHashtagRepository extends BaseRepository<ITweetHashtag> {
    constructor() {
        super(TweetHashtagModel);
    }
}

const tweetHashtagRepository = new TweetHashtagRepository();
export default tweetHashtagRepository;


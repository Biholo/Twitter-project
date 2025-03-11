import { BaseRepository } from "./baseRepository";
import TweetHashtagModel, { ITweetHashtag } from "@/repositories/tweetHashtagModel";

class TweetHashtagRepository extends BaseRepository<ITweetHashtag> {
    constructor() {
        super(TweetHashtagModel);
    }
}

const tweetHashtagRepository = new TweetHashtagRepository();
export default tweetHashtagRepository;


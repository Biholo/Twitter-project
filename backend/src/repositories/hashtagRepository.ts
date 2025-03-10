import { BaseRepository } from "./baseRepository";
import Hashtag, { IHashtag } from "@/models/hashtagModel";

class HashtagRepository extends BaseRepository<IHashtag> {
    constructor() {
        super(Hashtag);
    }
}

const hashtagRepository = new HashtagRepository();
export default hashtagRepository;

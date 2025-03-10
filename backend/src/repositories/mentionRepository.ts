import { BaseRepository } from "./baseRepository";
import Mention, { IMention } from "@/models/mentionModel";

class MentionRepository extends BaseRepository<IMention> {
    constructor() {
        super(Mention);
    }
}

const mentionRepository = new MentionRepository();
export default mentionRepository;

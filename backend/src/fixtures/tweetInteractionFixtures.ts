import { ITweetInteraction } from "@/models/tweetInteractionModel";
import { fixtureIds } from "./userFixture";
import mongoose from "mongoose";
import { TweetInteractionType } from "@/models/tweetInteractionModel";

// Date de référence pour assurer la cohérence des timestamps
const now = new Date();

export const tweetInteractionFixtures: Partial<ITweetInteraction>[] = [
    // Likes
    {
        _id: new mongoose.Types.ObjectId(),
        user_id: fixtureIds.adminId,
        action_type: TweetInteractionType.LIKE,
        created_at: now,
        updated_at: now
    },
    {
        _id: new mongoose.Types.ObjectId(),
        user_id: fixtureIds.johnId,
        action_type: TweetInteractionType.LIKE,
        created_at: now,
        updated_at: now
    },
    {
        _id: new mongoose.Types.ObjectId(),
        user_id: fixtureIds.kilianId,
        action_type: TweetInteractionType.LIKE,
        created_at: now,
        updated_at: now
    },
    // Bookmarks
    {
        _id: new mongoose.Types.ObjectId(),
        user_id: fixtureIds.kilianId,
        action_type: TweetInteractionType.BOOKMARK,
        created_at: now,
        updated_at: now
    },
    {
        _id: new mongoose.Types.ObjectId(),
        user_id: fixtureIds.adminId,
        action_type: TweetInteractionType.BOOKMARK,
        created_at: now,
        updated_at: now
    },
    {
        _id: new mongoose.Types.ObjectId(),
        user_id: fixtureIds.johnId,
        action_type: TweetInteractionType.BOOKMARK,
        created_at: now,
        updated_at: now
    }
]; 
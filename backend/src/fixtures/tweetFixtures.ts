import { ITweet } from "@/models/tweetModel";
import mongoose from 'mongoose';
import { userFixtures } from "./userFixture";
import { fixtureIds } from "./userFixture";



export const tweetFixtures: Partial<ITweet>[] = [
  {
    content: "Premier tweet de test ! #javascript #typescript",
    post_date: new Date(),
    author_id: fixtureIds.kilianId,
    tweet_type: "tweet",
    likes_count: 5,
    retweets_count: 2,
    bookmarks_count: 3,
    media_url: "https://example.com/image1.jpg",
    is_edited: false,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    content: "Réponse au premier tweet",
    post_date: new Date(),
    author_id: fixtureIds.adminId,
    parent_tweet_id: fixtureIds.parentTweetId,
    tweet_type: "reply",
    likes_count: 2,
    retweets_count: 0,
    bookmarks_count: 1,
    is_edited: false,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    content: "Tweet avec du code #coding",
    post_date: new Date(),
    author_id: fixtureIds.kilianId,
    tweet_type: "tweet",
    likes_count: 10,
    retweets_count: 5,
    bookmarks_count: 7,
    media_url: "https://example.com/code-snippet.png",
    is_edited: true,
    created_at: new Date(Date.now() - 86400000), // 1 jour avant
    updated_at: new Date()
  },
  {
    content: "Retweet important !",
    post_date: new Date(),
    author_id: fixtureIds.adminId,
    tweet_type: "retweet",
    likes_count: 0,
    retweets_count: 1,
    bookmarks_count: 0,
    is_edited: false,
    created_at: new Date(),
    updated_at: new Date()
  }
];


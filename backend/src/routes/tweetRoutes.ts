import express, { Request, Response } from "express";
import { createTweet, likeTweet, unlikeTweet, saveTweet, unsaveTweet, getTweets, getTweetDetails, updateTweet, getUserTweetCollection } from "@/controllers/tweetController";
import { isAuthenticated } from "@/middlewares/auth";
import { validateZod } from "@/middlewares/validateZod";
import { createTweetSchema, getTweetsQuerySchema, tweetIdSchema, updateTweetSchema, getUserTweetCollectionQuerySchema } from "@/validators/tweetValidator";
import { uploadFields } from "@/middlewares/fileUploadMiddleware";


export function tweetRoutes() {
  const router = express.Router();

  router.post("/", isAuthenticated, uploadFields.tweet, createTweet);
  router.post("/:id/like", isAuthenticated, validateZod(tweetIdSchema, "params"), likeTweet);
  router.post("/:id/unlike", isAuthenticated, validateZod(tweetIdSchema, "params"), unlikeTweet);
  router.post("/:id/save", isAuthenticated, validateZod(tweetIdSchema, "params"), saveTweet);
  router.post("/:id/unsave", isAuthenticated, validateZod(tweetIdSchema, "params"), unsaveTweet);
  router.get("/", isAuthenticated, validateZod(getTweetsQuerySchema, "query"), getTweets);
  router.get("/:id", isAuthenticated, validateZod(tweetIdSchema, "params"), getTweetDetails);
  router.put("/:id", isAuthenticated, validateZod(tweetIdSchema, "params"), validateZod(updateTweetSchema, "body"), updateTweet);
  router.get("/:id/interactions", isAuthenticated, validateZod(tweetIdSchema, "params"), validateZod(getUserTweetCollectionQuerySchema, "query"), getUserTweetCollection);
  return router;
}


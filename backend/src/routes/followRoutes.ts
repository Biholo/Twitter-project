import express from "express";
import { isAuthenticated } from "@/middlewares/auth";
import { followUser, unfollowUser, getFollowers, getFollowing } from "@/controllers/followController";

export function followRoutes() {
  const router = express.Router();

  // **Suivre un utilisateur** 
  router.post("/:id", isAuthenticated, followUser);

  // **Se désabonner d'un utilisateur** : DELETE sur /unfollow/:id
  router.delete("/:id", isAuthenticated, unfollowUser);

  // **Obtenir les abonnés d'un utilisateur** : GET sur /followers/:id
  router.get("/:id", isAuthenticated, getFollowers);

  // **Obtenir les abonnements d'un utilisateur** : GET sur /following/:id
  router.get("/:id", isAuthenticated, getFollowing);

  return router;
}

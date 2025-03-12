import express from "express";
import {
  patchUser,
  getAllUsers,
  getUserById,
  deleteUser,
  followUser,
  unfollowUser,
  getFollowers,
  getFollowings,
} from "@/controllers/userController";
import { getUserTweetCollection } from "@/controllers/tweetController";
import { validateZod } from "@/middlewares/validateZod";
import { isAuthenticated } from "@/middlewares/auth";
import { verifyAccess } from "@/middlewares/verifyAccess";
import { Role } from "@/config/role";
import { updateUserSchema, filterUserSchema, idParamSchema } from "@/validators/userValidator";
import { followParamsValidator, followQueryValidator } from "@/validators/followValidator";

export function useRoutes() {
  const router = express.Router();

  // **Mise à jour d'un utilisateur**
  router.patch(
    "/:id",
    isAuthenticated,
    validateZod(updateUserSchema, "body"),
    patchUser
  );

  // **Récupérer tous les utilisateurs (avec filtres optionnels)**
  router.get(
    "/",
    isAuthenticated,
    verifyAccess(Role.Admin),
    validateZod(filterUserSchema, "query"),
    getAllUsers
  );

  // **Récupérer un utilisateur par ID**
  router.get("/:id", isAuthenticated, validateZod(idParamSchema, "params"), getUserById);

  // **Supprimer un utilisateur**
  router.delete("/:id", isAuthenticated, verifyAccess(Role.Admin), deleteUser);

  // **Suivre un utilisateur**
  router.post("/:id/follow", isAuthenticated, validateZod(idParamSchema, "params"), followUser);

  // **Ne plus suivre un utilisateur**
  router.post("/:id/unfollow", isAuthenticated, validateZod(idParamSchema, "params"), unfollowUser);

  // **Récupérer les favoris d'un utilisateur**
  router.get("/:id/interactions", isAuthenticated, validateZod(idParamSchema, "params"), getUserTweetCollection);

  // **Récupérer les followers d'un utilisateur**
  router.get(
    "/:userId/followers",
    isAuthenticated,
    validateZod(followParamsValidator, "params"),
    validateZod(followQueryValidator, "query"),
    getFollowers
  );

  // **Récupérer les followings d'un utilisateur**
  router.get(
    "/:userId/followings",
    isAuthenticated,
    validateZod(followParamsValidator, "params"),
    validateZod(followQueryValidator, "query"),
    getFollowings
  );

  return router;
}

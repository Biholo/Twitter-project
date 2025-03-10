import express from "express";
import {
  patchUser,
  getAllUsers,
  getUserById,
  deleteUser,
} from "@/controllers/userController";
import { validateZod } from "@/middlewares/validateZod";
import { isAuthenticated } from "@/middlewares/auth";
import { verifyAccess } from "@/middlewares/verifyAccess";
import { Role } from "@/config/role";
import { updateUserSchema, filterUserSchema } from "@/validators/userValidator";

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
  router.get("/:id", isAuthenticated, verifyAccess(Role.Admin), getUserById);

  // **Supprimer un utilisateur**
  router.delete("/:id", isAuthenticated, verifyAccess(Role.Admin), deleteUser);

  return router;
}

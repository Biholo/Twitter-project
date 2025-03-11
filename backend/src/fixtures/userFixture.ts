import User, { IUser } from "@/models/userModel";
import bcrypt from 'bcrypt';
import mongoose from "mongoose";

// Fonction pour générer un hash de mot de passe
const hashPassword = (password: string) => bcrypt.hashSync(password, 10);
// Création d'ObjectId pour les utilisateurs (à des fins de démonstration)
const kilianId = new mongoose.Types.ObjectId();
const adminId = new mongoose.Types.ObjectId();

// Tweet parent pour tester les réponses
const parentTweetId = new mongoose.Types.ObjectId();
// Export des IDs pour une utilisation dans d'autres fixtures si nécessaire
export const fixtureIds = {
  kilianId,
  adminId,
  parentTweetId
};


export const userFixtures: Partial<IUser>[] = [
  {
    _id: fixtureIds.kilianId,
    identifier_name: "kilian",
    username: "kilian",
    email: "kilian@gmail.com",
    password: hashPassword("Adminpassword123"),
    roles: ["ROLE_USER"],
    created_at: new Date(),
    updated_at: new Date(),
    bio: "Développeur passionné",
  },
  {
    _id: fixtureIds.adminId,
    identifier_name: "admin",
    username: "admin",
    email: "admin@gmail.com",
    password: hashPassword("Adminpassword123!"),
    roles: ["ROLE_ADMIN", "ROLE_USER"],
    created_at: new Date(),
    updated_at: new Date(),
    bio: "Administrateur du site",
  }
];
import User, { IUser } from "@/models/userModel";
import bcrypt from 'bcrypt';


// Fonction pour générer un hash de mot de passe
const hashPassword = (password: string) => bcrypt.hashSync(password, 10);

export const userFixtures: Partial<IUser>[] = [
  {
    first_name: "John",
    last_name: "Doe",
    email: "kilian@gmail.com",
    password: hashPassword("Adminpassword123"),
    roles: ["ROLE_USER"],
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    first_name: "Admin",
    last_name: "User",
    email: "admin@gmail.com",
    password: hashPassword("Adminpassword123!"),
    roles: ["ROLE_ADMIN", "ROLE_USER"],
    created_at: new Date(),
    updated_at: new Date()
  }
];
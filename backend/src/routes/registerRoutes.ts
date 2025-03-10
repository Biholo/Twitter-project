import { authRoutes } from "@/routes/authRoutes";
import { useRoutes } from "@/routes/userRoutes";
import { Express } from "express";

export function registerRoutes(app: Express) {
  app.use("/auth", authRoutes());
  app.use("/users", useRoutes());
}

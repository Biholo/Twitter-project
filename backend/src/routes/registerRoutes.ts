import { authRoutes } from "@/routes/authRoutes";
import { useRoutes } from "@/routes/userRoutes";
import { tweetRoutes } from "@/routes/tweetRoutes";
import { Express } from "express";
import { notificationRoutes } from "@/routes/notificationRoutes";
import { trendingRoutes } from "@/routes/trendingRoutes";

export function registerRoutes(app: Express) {
  app.use("/api/auth", authRoutes());
  app.use("/api/users", useRoutes());
  app.use("/api/tweets", tweetRoutes());
  app.use("/api/notifications", notificationRoutes());
  app.use("/api/trending", trendingRoutes());
}

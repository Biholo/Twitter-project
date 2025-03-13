import { authRoutes } from "@/routes/authRoutes";
import { useRoutes } from "@/routes/userRoutes";
import { tweetRoutes } from "@/routes/tweetRoutes";
import { Express } from "express";
import { notificationRoutes } from "@/routes/notificationRoutes";
import { trendingRoutes } from "@/routes/trendingRoutes";

export function registerRoutes(app: Express) {
  const prefix = process.env.NODE_ENV === "production" ? "" : "/api";

  app.use(`${prefix}/auth`, authRoutes());
  app.use(`${prefix}/users`, useRoutes());
  app.use(`${prefix}/tweets`, tweetRoutes());
  app.use(`${prefix}/notifications`, notificationRoutes());
  app.use(`${prefix}/trending`, trendingRoutes());
}

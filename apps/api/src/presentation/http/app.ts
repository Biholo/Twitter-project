import express from "express";
import cors from "cors";
import { loadDependencies } from "@/dependencies/loadDependencies";
import { setupRoutes } from "@/presentation/http/routes";

export async function createExpressApp(): Promise<express.Express> {
  const app = express();

  loadDependencies();
  setupExpressConfig(app);
  setupRoutes(app);

  return app;
}

function setupExpressConfig(app: express.Express): void {
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  app.disable("x-powered-by");

  app.use(
    cors({
      origin: ["http://localhost:3000", "http://localhost:5173"],
      credentials: true,
      allowedHeaders: ["Content-Type", "Accept", "Authorization"],
    })
  );
}

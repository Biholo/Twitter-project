import { createExpressApp } from "@/app";
import http from "http";
import WebSocketManager from "@/services/websocketManager";

export function runServer() {
  const app = createExpressApp();
  const server = http.createServer(app);
  const wss = new WebSocketManager(server);

  console.log("Démarrage du serveur...");

  server.once("error", (error) => {
    console.error("Erreur lors du démarrage du serveur:", error);
    process.exit(1);
  });

  server.listen(process.env.PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${process.env.PORT}`);
  });

  return server;
}

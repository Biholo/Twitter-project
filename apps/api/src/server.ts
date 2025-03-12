import { createExpressApp } from "@/presentation/http/app";
import * as http from "http2";

export async function createServer(): Promise<http.Http2Server> {
  const app = await createExpressApp();
  const server = http.createServer(app);
  return server;
}

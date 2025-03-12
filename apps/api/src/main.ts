import { connectToMongoDb } from "@/infrastructure/database/mongodb";
import { createServer } from "@/server";

async function main() {
  const { env } = await import("@/env");
  const server = await createServer();

  const connectionResult = await connectToMongoDb(env.MONGODB_URI);

  if (connectionResult.isErr()) {
    console.error(connectionResult.unwrapErr());
    process.exit(1);
  }

  server.listen(env.PORT, () => {
    console.log(`Server is running on port ${env.PORT}`);
  });

  server.once("error", (error) => {
    console.error(error);
    process.exit(1);
  });
}

main();
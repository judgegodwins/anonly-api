import { createConnection } from "./database";
import { createRedisConnection } from "./database/redis";

export default async () => {
  const redisConnection = await createRedisConnection();
  const dbConnection = await createConnection();

  // await utils.createSuperAdmin(); // RUN ONLY ONCE

  // const app = (await import("./app")).default;
  // const router = (await import("./routes")).default;

  // app.use(router);
  // app.use(notFoundHandler);
  // app.use(errorHandler);

  return {
    redisConnection,
    dbConnection,
  };
};

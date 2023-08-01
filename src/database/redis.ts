import { createClient } from "redis";
import config from "../config";
import Logger from "../core/Logger";

console.log('URL:', `redis://${config.redis.host}:${config.redis.port}`);

const redis = createClient({
  url: `redis://${config.redis.host}:${config.redis.port}`,
  password: config.redis.password,
});

export const createRedisConnection = async () => {
  await redis.connect().then(() => Logger.info("Redis connected"));

  redis.on("error", (err) => Logger.error("Redis Client Error", err));

  return redis;
};

export default redis;

import http from "http";
import stoppable from "stoppable";
import config from "./config";
import { generalLogger, errorLogger } from "./core/Logger";
import initialize from "./initialize";

global.server = {
  isStartingUp: false,
  isShuttingDown: false,
};

const startServer = async () => {
  global.server.isStartingUp = true;

  const { dbConnection, redisConnection, app } = await initialize();
  const server = stoppable(http.createServer(app));

  server.listen(config.app.port, () => {
    generalLogger.info(
      `Server Started and Listening on Port: ${config.app.port} with PID: ${process.pid}`
    );
    global.server.isStartingUp = false;
  });

  process.on("SIGINT", async () => {
    global.server.isShuttingDown = true;

    generalLogger.info("Starting graceful server shutdown");

    server.stop(async () => {
      await dbConnection
        .close()
        .then(() =>
          generalLogger.info(
            "Mongoose default connection disconnected through app termination"
          )
        )
        .catch(generalLogger.error);

      await redisConnection
        .quit()
        .then(() => generalLogger.info("Redis connection closed"))
        .catch(generalLogger.error);

      generalLogger.info("Graceful server shutdown completed");

      process.exit(0);
    });
  });
};

const start = async () => {
  try {
    await startServer();
  } catch (e) {
    errorLogger.error(e);
    process.exit(1);
  }
};

export default start();

import Logger from "../core/Logger";
import config from "../config";
import mongoose from "mongoose";

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

export const createConnection = async () => {
  await mongoose.connect(config.db.uri).then(() => Logger.info("MongoDB connected"));

  // If the connection throws an error
  mongoose.connection.on("error", (err) => {
    Logger.error("Mongoose default connection error: " + err);
  });

  // When the connection is disconnected
  mongoose.connection.on("disconnected", () => {
    Logger.info("Mongoose default connection disconnected");
  });

  return mongoose.connection;
};

export default mongoose.connection;

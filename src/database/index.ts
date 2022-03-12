import Logger from "../core/Logger";
import config from "../config";
import mongoose from "mongoose";

const {
  db: {
    dbUri,
    dnsSrv,
    user,
    password,
    host,
    port,
    name,
    options: dbUriOptions,
  },
} = config;

const dbURI =
  dbUri ||
  `mongodb${dnsSrv ? "+srv" : ""}://${user}:${encodeURIComponent(
    password
  )}@${host}${port ? ":" + port : ""}/${name}${dbUriOptions}`;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

export const createConnection = async () => {
  await mongoose.connect(dbURI).then(() => Logger.info("MongoDB connected"));

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

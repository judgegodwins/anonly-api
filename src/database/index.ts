import Logger from "../core/Logger";
import { dbConfig } from "../config";
import mongoose from 'mongoose';

console.log(dbConfig.options);

const dbURI = `mongodb${dbConfig.dnsSrv ? '+srv' : ''}://${dbConfig.user}:${encodeURIComponent(dbConfig.password)}@${dbConfig.host}:${dbConfig.port}/${dbConfig.name}${dbConfig.options}`;

console.log(dbURI);

const options = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
}


mongoose
  .connect(dbURI, options)
  .then((db) => Logger.info("DB connected"))
  .catch(e => {
    console.log('error connecting: ', e);
    Logger.info("Mongoose connection error");
    Logger.error(e);
  })

// If the connection throws an error
mongoose.connection.on('error', (err) => {
  Logger.error('Mongoose default connection error: ' + err);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', () => {
  Logger.info('Mongoose default connection disconnected');
});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    Logger.info('Mongoose default connection disconnected through app termination');
    process.exit(0);
  });
});

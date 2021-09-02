import app from './app';
import Logger from "./core/Logger";
import { port } from './config';

app
  .listen(port, () => {
    Logger.info(`server running on port ${port}`)
  })
  .on("error", (e) => Logger.error(e));
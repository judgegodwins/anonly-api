import app from './app';
import Logger from "./core/Logger";
import { port } from './config';

//temporary
const hold = {
  "username": {"type": "string"},
  "email": {"type": "string"},
  "password": {
    "type": "string", 
    "minimum": 6
  }
}

app
  .listen(port, () => {
    console.log('here')
    Logger.info(`server running on port ${port}`)
  })
  .on("error", (e) => Logger.error(e));
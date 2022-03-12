import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';
import Logger from './core/Logger';
import config from './config';
import './database';
import { ApiError, InternalError, NotFoundError } from './core/ApiError';
import routes from './routes';

import swaggerUI from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';


process.on('uncaughtException', (e) => {
  Logger.error(e);
});

const app = express();

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Anonymous Messaging API',
      description: 'API for sending anonymous messages.',
      version: '1.0.0'
    },
    servers: [
      { url: "https://anonly.herokuapp.com/", description: 'Staging server' }
    ]
  },
  apis: [path.join(__dirname, '/routes/**/*.js')]
}

const openapiSpec = swaggerJsDoc(options);

app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: '10mb', parameterLimit: 50000 }));
app.use(cors())
app.get('/test', async (req, res) => {
	const t = await new Promise((resolve, reject) => setTimeout(() => resolve('OK'), 20000));
	res.json({data: t});
});

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(openapiSpec));

app.use('/', routes);

app.use((req, res, next) => next(new NotFoundError()));

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ApiError) {
    ApiError.handle(err, res);
  } else {
    console.log('error: ', err);
    if (config.env.isDevelopment) {
      Logger.error(err)
      return res.status(500).send(err.message);
    }
    ApiError.handle(new InternalError(), res);
  }
})


export default app;

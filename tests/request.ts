import supertest from 'supertest';
import app from '../src/app';

export const addHeader = (request: any) => 
  request.set('Content-Type', 'application/json');


export default supertest(app);
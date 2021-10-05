import { Request } from 'express';
import User from '../database/models/User';

declare interface ProtectedRequest extends Request {
  user: User
} 
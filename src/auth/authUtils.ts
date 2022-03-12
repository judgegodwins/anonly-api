import config from '../config';
import User from '../database/models/User';
import jwt, { Secret } from 'jsonwebtoken';
import { AuthFailureError } from '../core/ApiError';
import _ from 'lodash';

export const createToken = (user: User): { accessToken: string, expiresOn: string } => {
  const expiresOn = new Date(Date.now() + 1000 * 60 * 60 * 24 * 15).toISOString()

  const accessToken = jwt.sign(
    _.pick(user, ["_id", "username", "email", "roles", "verified"]),
    config.app.jwtSecret as Secret,
    { expiresIn: '10d' }
  )

  return { accessToken, expiresOn };
}

export const getAccessToken = (authorization: string | undefined): string => {
  if (!authorization) throw new AuthFailureError("Authorization header not sent");
  if (!authorization.startsWith("Bearer ")) throw new AuthFailureError("Invalid authorization header");
  return authorization.split(" ")[1];
} 
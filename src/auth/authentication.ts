import { Request, Response, NextFunction } from "express";
import express from 'express';
import jwt, { Secret } from 'jsonwebtoken';
// import { ProtectedRequest } from "app-request";
import asyncHandler from "../helpers/asyncHandler";
import { getAccessToken } from "./authUtils";
import { jwtSecret } from "../config";
import UserRepo from "../database/repository/UserRepo";
import User from '../database/models/User';
import { AuthFailureError, InternalError } from "../core/ApiError";
import schema from './schema';
import validator, { ValidationSource } from '../helpers/validator';
import { ProtectedRequest } from "app-request";

const router = express.Router();

export default [
  // validator(schema.authHeader, ValidationSource.Header),
  asyncHandler(async (req: ProtectedRequest, res: Response, next: NextFunction) => {
    const token = getAccessToken(req.headers.authorization);

    jwt.verify(token, jwtSecret as Secret, async (err, decoded: User) => {
      if (err) next(err);
      if (!decoded) throw new AuthFailureError('Invalid token');

      const user = await UserRepo.findUserByUsername(decoded.username);

      if (!user) throw new AuthFailureError('Invalid token');

      req.user = decoded;
      
      next()
      
    })
  })
]
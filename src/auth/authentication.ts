import { Request, Response, NextFunction } from "express";
import express from "express";
import jwt, { Secret } from "jsonwebtoken";
import { Types } from "mongoose";
import { ProtectedRequest } from "app-request";
import asyncHandler from "../helpers/asyncHandler";
import { getAccessToken } from "./authUtils";
import config from "../config";
// import UserRepo from "../database/repository/UserRepo";
import User from "../database/models/User";
import { AuthFailureError, InternalError } from "../core/ApiError";

const router = express.Router();

export default [
  // validator(schema.authHeader, ValidationSource.Header),
  asyncHandler(
    async (req: ProtectedRequest, res: Response, next: NextFunction) => {
      const token = getAccessToken(req.headers.authorization);

      jwt.verify(token, config.app.jwtSecret as Secret, async (err, decoded: User) => {
        if (err) next(new AuthFailureError(err.message));

        if (!decoded) return next(new AuthFailureError("Invalid token"));

        // const user = await UserRepo.findUserByUsername(decoded.username);

        // if (!user) return next(new AuthFailureError("Invalid token"));

        req.user = decoded;

        req.user._id = new Types.ObjectId(req.user._id)

        next();
      });
    }
  ),
];

import express, { NextFunction, Request, Response } from "express";
import _ from "lodash";
import { Types } from "mongoose";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { ProtectedRequest } from "app-request";
import redis from "../../../database/redis";
import validator, { ValidationSource } from "../../../helpers/validator";
import {
  AuthFailureError,
  BadRequestError,
  InternalError,
  NotFoundError,
} from "../../../core/ApiError";
import asyncHandler from "../../../helpers/asyncHandler";
import UserRepo from "../../../database/repository/UserRepo";
import { SuccessMsgResponse } from "../../../core/ApiResponse";
import schema from "../schema";
import authentication from "../../../auth/authentication";
import sendVerificationEmail from "../../../helpers/sendVerificationEmail";
import { bcryptHash } from "../../../helpers";

const router = express.Router();

router.post(
  "/request",
  authentication,
  validator(schema.verification.request),
  asyncHandler(
    async (req: ProtectedRequest, res: Response, next: NextFunction) => {
      const { email }: { email: string } = req.body;

      const emailExists = await UserRepo.findUserByEmail(email);

      if (emailExists) throw new BadRequestError("Email already in use");

      const user = await UserRepo.findUserById(req.user._id);

      if (!user) throw new NotFoundError("User not found");

      if (user.email && user.verified)
        throw new BadRequestError("Email already verified");

      const lookupId = uuidv4();

      await redis.set(
        `verification:email:${user._id}`,
        JSON.stringify({ email, lookupId: await bcryptHash(lookupId) }),
        { EX: 30 * 60 }
      );

      const response = await sendVerificationEmail(email, user._id, lookupId);

      if (response) new SuccessMsgResponse("Verification email sent").send(res);
    }
  )
);

router.get(
  "/resend",
  authentication,
  asyncHandler(async (req: ProtectedRequest, res: Response) => {
    const user = await UserRepo.findUserById(req.user._id);
    if (!user) throw new BadRequestError("User not found");

    const { email }: { email: string } = req.body;

    const prev = await redis.get(`verification:email:${user._id}`);

    if (!prev) throw new BadRequestError("Details not found");

    const lookupId = await uuidv4();

    await redis.set(
      `verification:email:${user._id}`,
      JSON.stringify({
        email: req.body.email as string,
        lookupId: await bcryptHash(lookupId),
      }),
      { EX: 30 * 60 }
    );

    await sendVerificationEmail(email, user._id, lookupId);

    new SuccessMsgResponse("Verification email resent").send(res);
  })
);

router.put(
  "/verify",
  authentication,
  validator(schema.verification.verify, ValidationSource.Query),
  asyncHandler(async (req: ProtectedRequest, res: Response) => {
    const lookupId = req.query.id as string;

    const details = await redis.get(`verification:email:${req.user._id}`);

    if (!details) throw new AuthFailureError("Cannot verify email");

    const parsedDetails: { email: string; lookupId: string } =
      JSON.parse(details);

    const idsMatch = await bcrypt.compare(lookupId, parsedDetails.lookupId);

    if (!idsMatch) throw new AuthFailureError("Cannot verify email");

    await UserRepo.addVerifiedEmail(
      req.user._id,
      parsedDetails.email,
    );

    await redis.del(`verification:email:${req.user._id}`)

    new SuccessMsgResponse("User verified").send(res);
  })
);

export default router;

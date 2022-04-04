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
  validator(schema.verification.request.body),
  validator(schema.verification.request.query, ValidationSource.Query),
  asyncHandler(
    async (req: ProtectedRequest, res: Response, next: NextFunction) => {
      const { email }: { email: string } = req.body;

      // checks if request is to update email
      const forEmailUpdate: boolean =
        Boolean(req.query.updateEmail as string) &&
        JSON.parse(req.query.updateEmail as string);

      const emailExists = await UserRepo.findUserByEmail(email);

      if (emailExists) throw new BadRequestError("Email already in use");

      const user = await UserRepo.findUserById(req.user._id);

      if (!user) throw new NotFoundError("User not found");

      if (user.email && user.verified && !forEmailUpdate)
        throw new BadRequestError("Email already verified");

      const lookupId = uuidv4();

      const verificationString = `verification:email:${user._id}`;

      const dataExists = await redis.get(verificationString);

      if (dataExists)
        throw new BadRequestError(
          "Verification email has already been sent. Use /resend to request a new one"
        );

      await redis.set(
        verificationString,
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

    const prev = await redis.get(`verification:email:${user._id}`);

    if (!prev)
      throw new BadRequestError("Previous verification details not found");

    const parsed: { email: string; lookupId: string } = JSON.parse(prev);

    const lookupId = await uuidv4();

    await redis.set(
      `verification:email:${user._id}`,
      JSON.stringify({
        email: parsed.email,
        lookupId: await bcryptHash(lookupId),
      }),
      { EX: 30 * 60 }
    );

    await sendVerificationEmail(parsed.email, user._id, lookupId);

    new SuccessMsgResponse("Verification email resent").send(res);
  })
);

router.put(
  "/verify",
  authentication,
  validator(schema.verification.verify, ValidationSource.Query),
  asyncHandler(async (req: ProtectedRequest, res: Response) => {
    const lookupId = req.query.code as string;

    const details = await redis.get(`verification:email:${req.user._id}`);

    if (!details) throw new AuthFailureError("Cannot verify email");

    const parsedDetails: { email: string; lookupId: string } =
      JSON.parse(details);

    const idsMatch = await bcrypt.compare(lookupId, parsedDetails.lookupId);

    if (!idsMatch) throw new AuthFailureError("Cannot verify email");

    await UserRepo.addVerifiedEmail(req.user._id, parsedDetails.email);

    await redis.del(`verification:email:${req.user._id}`);

    new SuccessMsgResponse("User verified").send(res);
  })
);

export default router;

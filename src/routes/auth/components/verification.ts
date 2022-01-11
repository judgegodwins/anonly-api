import express, { NextFunction, Request, Response } from 'express';
import _ from 'lodash';
import { Types } from 'mongoose';
import bcrypt from 'bcrypt';
import { ProtectedRequest } from 'app-request';
import validator, { ValidationSource } from '../../../helpers/validator';
import { AuthFailureError, BadRequestError, InternalError } from '../../../core/ApiError';
import VerificationRepo from '../../../database/repository/VerificationRepo';
import asyncHandler from '../../../helpers/asyncHandler';
import UserRepo from '../../../database/repository/UserRepo';
import { SuccessResponse, SuccessMsgResponse } from '../../../core/ApiResponse';
import schema from '../schema';
import authentication from '../../../auth/authentication';
import sendEmail from '../../../helpers/sendEmail';


const router = express.Router();

const sendVerificationEmail = (email: string, userId: Types.ObjectId, lookupId: string) => {
  if (!process.env.CLIENT_URL) 
    return Promise.reject(new Error("Client URL not specified"));

  const link = `${process.env.CLIENT_URL}/${userId}/${lookupId}`

  return sendEmail({
    from: "Anonly <mailgun@sandbox18ed15bccce24869a3391d51ced7d77a.mailgun.org>",
    to: [email],
    subject: "Verify your email",
    html: `<p>Use the link to verify your email 
      <a href=${link}>${link}</a>
    </p>`
  })
}

router.post(
  '/request',
  authentication,
  validator(schema.verification.request),
  asyncHandler(async (req: ProtectedRequest, res: Response, next: NextFunction) => {
    const { email }: { email: string } = req.body;

    const pending = await VerificationRepo.findVerificationDetails(req.user._id);
    const emailExists = await UserRepo.findUserByEmail(email);
    const emailPending = await VerificationRepo.findWithEmail(email);

    if (pending) throw new BadRequestError('Email action already pending');
    if (emailExists || emailPending) throw new BadRequestError('Email already in use');

    const lookupId = await VerificationRepo.createDetails(req.user._id, email);

    const response = await sendVerificationEmail(email, req.user._id, lookupId);

    if (response)
      new SuccessMsgResponse("Verification email sent")
        .send(res);
  })
)

router.get(
  '/resend',
  authentication,
  asyncHandler(async (req: ProtectedRequest, res: Response) => {

    const details = await VerificationRepo.findVerificationDetails(req.user._id);
    
    if (!details) return new BadRequestError("Details not found");
    
    const newId = await VerificationRepo.resetLookupId(req.user._id);

    const response = await sendVerificationEmail(details.proposedEmail, req.user._id, newId);

    new SuccessMsgResponse("Verification email resent")
      .send(res);

  })
)

router.put(
  '/verify',
  validator(schema.verification.verify, ValidationSource.Query),
  asyncHandler(async (req: Request, res: Response) => {
    const userId = req.query.userId;
    const lookupId = req.query.id;

    const userIdAsObjectId = new Types.ObjectId(userId as string)
    const details = await VerificationRepo.findVerificationDetails(userIdAsObjectId)

    if (!details) throw new AuthFailureError();

    const valid = await bcrypt.compare(lookupId as string, details.lookupId);

    if (!valid) throw new AuthFailureError();

    const updatedUser = await UserRepo.addVerifiedEmail(userIdAsObjectId, details.proposedEmail);

    await VerificationRepo.delete(userIdAsObjectId);

    new SuccessResponse("User verified", {
      user: _.pick(updatedUser, ['_id', 'username', 'email', 'roles', 'verified'])
    }).send(res);
  })
)

export default router;
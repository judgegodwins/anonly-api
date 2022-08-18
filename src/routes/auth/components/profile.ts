import express from 'express';
import { omit } from 'lodash';
import { ProtectedRequest } from 'app-request';
import asyncHandler from '../../../helpers/asyncHandler';
import authentication from '../../../auth/authentication';
import UserRepo from '../../../database/repository/UserRepo';
import { AuthFailureError, BadRequestError } from '../../../core/ApiError';
import {SuccessResponse } from '../../../core/ApiResponse';
import { sensitiveFields } from '../../../database/models/User';

const router = express.Router();

router.use(authentication);

router.patch(
  '/username',
  asyncHandler(async (req: ProtectedRequest, res) => {
    const user = await UserRepo.findUserById(req.user._id);
    if (!user) throw new AuthFailureError("User not found");

    const userWithUsername = await UserRepo.findUserByUsername(req.body.username);

    if (userWithUsername) throw new BadRequestError('Username already in use'); 

    const newUserData = await UserRepo.updateUsername(user._id, req.body.username);

    console.log(omit(newUserData, sensitiveFields));

    return new SuccessResponse('Username updated', omit(newUserData?.toObject(), sensitiveFields)).send(res);
  })
);

router.get(
  '/',
  asyncHandler(async (req: ProtectedRequest, res) => {
    const user = await UserRepo.findUserById(req.user._id);
    if (!user) throw new AuthFailureError("User not found");

    return new SuccessResponse('User profile', omit(user, sensitiveFields)).send(res);
  })
);

export default router;
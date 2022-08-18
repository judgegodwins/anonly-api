import express from 'express';
import { ProtectedRequest } from 'app-request';
import asyncHandler from '../../../helpers/asyncHandler';
import authentication from '../../../auth/authentication';
import UserRepo from '../../../database/repository/UserRepo';
import { AuthFailureError, BadRequestError } from '../../../core/ApiError';
import validator, { ValidationSource } from "../../../helpers/validator";
import schema from "../schema";
import { bcryptCompare, bcryptHash } from '../../../helpers';
import { SuccessMsgResponse } from '../../../core/ApiResponse';

const router = express.Router();

router.use(authentication);

router.patch(
  '/password',
  validator(schema.updatePassword),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const user = await UserRepo.findUserById(req.user._id);
    if (!user) throw new AuthFailureError();

    const match = await bcryptCompare(req.body.oldPassword, user.password);

    if (!match) throw new BadRequestError('Current password is invalid');

    await UserRepo.updateUserById(user._id, { password: await bcryptHash(req.body.newPassword) })

    return new SuccessMsgResponse('Password updated').send(res);
  })
);

router.patch(
  '/theme',
  validator(schema.updateTheme),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const user = await UserRepo.updateUserById(req.user._id, {
      clientTheme: req.body.theme
    });

    return new SuccessMsgResponse('Client theme updated').send(res);
  })
)

export default router;
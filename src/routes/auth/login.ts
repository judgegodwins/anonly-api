import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import _ from 'lodash';
import schema from './schema';
import User from '../../database/models/User';
import UserRepo from '../../database/repository/UserRepo';
import { SuccessResponse } from '../../core/ApiResponse';
import asyncHandler from '../../helpers/asyncHandler';
import { createToken } from '../../auth/authUtils';
import { BadRequestError, NotFoundError } from '../../core/ApiError';
import validator from '../../helpers/validator';

const router = express.Router();

/**
 * @openapi
 * /auth/login:
 *  post:
 *    summary: Logins in a user by generating an auth token
 *    tags:
 *      - Authentication
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              username:
 *                type: string
 *                example: awesome-user
 *              password:
 *                type: string
 *                mininum: 6
 *                example: password
 *            required:
 *              - username
 *              - password
 *    responses:
 *      '200':
 *        description: Successful login.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: Login successful
 *                data:
 *                  $ref: '#/definitions/SuccessAuthResponse'
 *      '404':
 *        description: User not found
 *        content: 
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: User not found
 *      '400':
 *        description: Bad request, invalid body
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: username is required          
 */

router.post(
  '/',
  validator(schema.login),
  asyncHandler(async (req: Request, res: Response) => {
    const user = await UserRepo.findUserByUsername(req.body.username);

    if (!user) throw new NotFoundError('User not found');

    const same = await bcrypt.compare(req.body.password, user.password);

    if (!same) throw new BadRequestError('Invalid username or password')

    const tokenDetails = createToken(user);

    new SuccessResponse("Login successful", {
      user: _.pick(user, ['_id', 'username', 'email', 'roles', 'verified']),
      token: tokenDetails.accessToken,
      tokenExpiresOn: tokenDetails.expiresOn
    }).send(res);

  })
);

export default router;
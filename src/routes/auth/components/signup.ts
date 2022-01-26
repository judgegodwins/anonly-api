import express, { Request, Response } from 'express';
import _ from 'lodash';
import { BadRequestError } from '../../../core/ApiError';
import User from '../../../database/models/User';
import UserRepo from '../../../database/repository/UserRepo';
import asyncHandler from '../../../helpers/asyncHandler';
import { Role } from '../../../database/models/User';
import { createToken } from '../../../auth/authUtils';
import { SuccessResponse } from '../../../core/ApiResponse';
import validation from '../../../helpers/validator';
import schema from '../schema';

const router = express.Router();


/**
 * @openapi
 * definitions:
 *  SignupBody:
 *    type: object
 *    required:
 *      - username
 *      - password
 *    properties:
 *      username:
 *        type: string
 *        example: "awesome-user"
 *      email:
 *        type: string
 *        example: "awesome-user@test.com"
 *      password:
 *        type: string
 *        minimum: 6
 *        example: password
 */

/**
 * @openapi
 * /auth/signup:
 *  post:
 *    summary: Creates a new user account and returns a token for authorization.
 *    notes: tokenExpiresOn is an ISO date string. It indicates the date and time the JWT will expire.
 *    tags:
 *      - Authentication
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/definitions/SignupBody'
 *    responses:
 *      '200':
 *        description: Signup was successful and auth token generated.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: User created
 *                data:
 *                  $ref: '#/definitions/SuccessAuthResponse'
 *      '400':
 *        description: Bad request response.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/definitions/BadRequestResponse'
 *              example: 
 *                message: User with username already exists
 */

router.post(
  '/',
  validation(schema.signup),
  asyncHandler(async (req: Request, res: Response) => {
    const userWithUsername = await UserRepo.findUserByUsername(req.body.username);
    if (userWithUsername) throw new BadRequestError('User with username already exists');

    if (req.body.email) {
      const userWithEmail = await UserRepo.findUserByEmail(req.body.email);

      if (userWithEmail) throw new BadRequestError('User with email already exists');
    }

    console.log(req.body.email);

    const createdUser = await UserRepo.create(
      {
        username: req.body.username,
        password: req.body.password,
        email: req.body.email || undefined,
        verified: false,
        roles: [Role.User]
      } as User
    );
    
    const tokenDetails = createToken(createdUser);

    new SuccessResponse("User created", {
        user: _.pick(createdUser, ['_id', 'username', 'email', 'roles', 'verified']),
        token: tokenDetails.accessToken,
        tokenExpiresOn: tokenDetails.expiresOn
    }).send(res);
    
  })
)

export default router;
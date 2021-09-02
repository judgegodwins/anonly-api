import express, { NextFunction, Request, Response } from 'express';
import { MessageModel } from '../../database/models/Message';
import User, { UserModel } from '../../database/models/User';
import _ from 'lodash';
import { ProtectedRequest } from 'app-request';
import UserRepo from '../../database/repository/UserRepo';
import asyncHandler from '../../helpers/asyncHandler';
import { NotFoundError } from '../../core/ApiError';
import MessageRepo from '../../database/repository/MessageRepo';
import { PaginationResponse, SuccessResponse } from '../../core/ApiResponse';
import schema from './schema/schema';
import validator, { ValidationSource } from '../../helpers/validator';
import authentication from '../../auth/authentication';

const router = express.Router();

/**
 * @openapi
 * 
 * components:
 *  schemas:
 *    Message:
 *      type: object
 *      properties:
 *        _id:
 *          type: string
 *          example: 690038348ad943902dc
 *        text:
 *          type: string
 *          example: Hi awesomeuser, you're so cool.
 *        createdAt:
 *          type: string
 *          example: Hi awesomeuser, you're so cool.
 *      required:
 *        - text   
 */

/**
 * @openapi
 * 
 * /message/{username}:
 *  post:
 *    summary: Sends a message to a user.
 *    tags:
 *      - Messaging
 *    parameters:
 *      - name: username
 *        in: path
 *        required: true
 *        description: Username of user to receive the message
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              text:
 *                type: string
 *                example: Hi awesomeuser, you're so cool.
 *            required:
 *              - text
 *    responses:
 *      '200':
 *        description: Message has been sent.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: Message sent
 *                data:
 *                  $ref: '#/components/schemas/Message'
 *      '404':
 *        description: User with username does not exist.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: User with username not found
 */

router.post(
  '/:username',
  validator(schema.sendMessage.body, ValidationSource.Body),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { username } = req.params;
    const { text } = req.body;

    const user = await UserRepo.findUserByUsername(username)

    if (!user) throw new NotFoundError("User with username not found")

    const message = await MessageRepo.create(text, user);

    new SuccessResponse("Message sent", _.pick(message, "_id", "text", "createdAt")).send(res);

  })
);

/**
 * @openapi
 * 
 * /message/view/user-messages:
 *  get:
 *    summary: Route for user to see his messages. This route is paginated and requires authorization.
 *    security:
 *      - bearerAuth: []
 *    tags:
 *      - Messaging
 *    parameters:
 *      - in: query
 *        name: page
 *        schema:
 *          type: integer
 *        description: The page (or offset) to start getting the result from.
 *        required: true
 * 
 *      - in: query
 *        name: limit
 *        schema:
 *          type: integer
 *        description: The number of results to allow per page.
 *        required: true    
 * 
 *    responses:
 *      '200':
 *        description: Returns a list of messages sent to user.
 *      '401':
 *        description: User is not authorized.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/responses/UnauthorizedError'
 */

router.get(
  '/view/user-messages',
  authentication,
  validator(schema.viewMessages.query, ValidationSource.Query),
  asyncHandler(async (req: ProtectedRequest, res: Response) => {
    const result = await MessageRepo.findMessagesForUserWithId(req.user._id).paginate(req, res);
    new PaginationResponse(
      "User's messages",
      result
    ).send(res);
  })
)

export default router;
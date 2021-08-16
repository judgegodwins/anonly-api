import express from 'express';
import signup from './signup';
import login from './login';

const router = express.Router();

/**
 * @openapi
 * definitions:
 *  SuccessAuthResponse:
 *    type: object
 *    properties:
 *      user:
 *        $ref: '#/components/schemas/User'
 *      token:
 *        type: string
 *        example: eyJhbGciOiJIUzI1NiIsIn...
 *      tokenExpiresOn:
 *        type: string
 *        description: Date (in ISO string) the JWT expires.
 *        example: "2021-08-28T19:23:28.724Z"
 * 
 * components:
 *  schemas:
 *    User:
 *      type: object
 *      properties:
 *        _id:
 *          type: string
 *        username:
 *          type: string
 *        email:
 *          type: string
 *        roles:
 *          type: array
 *          items:
 *            type: string
 *        verified:
 *          type: boolean
 *      required:
 *        - _id
 *        - username
 *        - roles
 *      example:
 *          _id: 690038348ad943902dc
 *          username: awesome-user
 *          roles:
 *            - USER
 *          verified: false
 * 
 *  securitySchemes:
 *    bearerAuth:
 *     type: http
 *     scheme: bearer
 *     bearerFormat: JWT
 * 
 *  responses:
 *    UnauthorizedError:
 *      description: Access token is missing or invalid
 *      type: object
 *      properties:
 *        message:
 *          type: string
 *          example: Invalid token
 */

router.use('/signup', signup);
router.use('/login', login)

export default router;

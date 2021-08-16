"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const signup_1 = __importDefault(require("./signup"));
const login_1 = __importDefault(require("./login"));
const router = express_1.default.Router();
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
router.use('/signup', signup_1.default);
router.use('/login', login_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map
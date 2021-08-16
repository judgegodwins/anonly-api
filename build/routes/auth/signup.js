"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const lodash_1 = __importDefault(require("lodash"));
const ApiError_1 = require("../../core/ApiError");
const UserRepo_1 = __importDefault(require("../../database/repository/UserRepo"));
const asyncHandler_1 = __importDefault(require("../../helpers/asyncHandler"));
const User_1 = require("../../database/models/User");
const authUtils_1 = require("../../auth/authUtils");
const ApiResponse_1 = require("../../core/ApiResponse");
const validator_1 = __importDefault(require("../../helpers/validator"));
const schema_1 = __importDefault(require("./schema"));
const router = express_1.default.Router();
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
router.post('/', validator_1.default(schema_1.default.signup), asyncHandler_1.default(async (req, res) => {
    const userWithUsername = await UserRepo_1.default.findUserByUsername(req.body.username);
    if (userWithUsername)
        throw new ApiError_1.BadRequestError('User with username already exists');
    if (req.body.email) {
        const userWithEmail = await UserRepo_1.default.findUserByEmail(req.body.email);
        if (userWithEmail)
            throw new ApiError_1.BadRequestError('User with email already exists');
    }
    const createdUser = await UserRepo_1.default.create({
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        verified: false,
        roles: [User_1.Role.User]
    });
    const tokenDetails = authUtils_1.createToken(createdUser);
    new ApiResponse_1.SuccessResponse("User created", {
        user: lodash_1.default.pick(createdUser, ['_id', 'username', 'email', 'roles', 'verified']),
        token: tokenDetails.accessToken,
        tokenExpiresOn: tokenDetails.expiresOn
    }).send(res);
}));
exports.default = router;
//# sourceMappingURL=signup.js.map
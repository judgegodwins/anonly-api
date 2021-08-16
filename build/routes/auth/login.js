"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const lodash_1 = __importDefault(require("lodash"));
const schema_1 = __importDefault(require("./schema"));
const UserRepo_1 = __importDefault(require("../../database/repository/UserRepo"));
const ApiResponse_1 = require("../../core/ApiResponse");
const asyncHandler_1 = __importDefault(require("../../helpers/asyncHandler"));
const authUtils_1 = require("../../auth/authUtils");
const ApiError_1 = require("../../core/ApiError");
const validator_1 = __importDefault(require("../../helpers/validator"));
const router = express_1.default.Router();
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
router.post('/', validator_1.default(schema_1.default.login), asyncHandler_1.default(async (req, res) => {
    const user = await UserRepo_1.default.findUserByUsername(req.body.username);
    if (!user)
        throw new ApiError_1.NotFoundError('User not found');
    const same = await bcrypt_1.default.compare(req.body.password, user.password);
    if (!same)
        throw new ApiError_1.BadRequestError('Invalid username or password');
    const tokenDetails = authUtils_1.createToken(user);
    new ApiResponse_1.SuccessResponse("Login successful", {
        user: lodash_1.default.pick(user, ['_id', 'username', 'email', 'roles', 'verified']),
        token: tokenDetails.accessToken,
        tokenExpiresOn: tokenDetails.expiresOn
    }).send(res);
}));
exports.default = router;
//# sourceMappingURL=login.js.map
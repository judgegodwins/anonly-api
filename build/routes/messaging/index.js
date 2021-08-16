"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const lodash_1 = __importDefault(require("lodash"));
const UserRepo_1 = __importDefault(require("../../database/repository/UserRepo"));
const asyncHandler_1 = __importDefault(require("../../helpers/asyncHandler"));
const ApiError_1 = require("../../core/ApiError");
const MessageRepo_1 = __importDefault(require("../../database/repository/MessageRepo"));
const ApiResponse_1 = require("../../core/ApiResponse");
const schema_1 = __importDefault(require("./schema/schema"));
const validator_1 = __importStar(require("../../helpers/validator"));
const authentication_1 = __importDefault(require("../../auth/authentication"));
const router = express_1.default.Router();
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
router.post('/:username', validator_1.default(schema_1.default.body, validator_1.ValidationSource.Body), asyncHandler_1.default(async (req, res, next) => {
    const { username } = req.params;
    const { text } = req.body;
    const user = await UserRepo_1.default.findUserByUsername(username);
    if (!user)
        throw new ApiError_1.NotFoundError("User with username not found");
    const message = await MessageRepo_1.default.create(text, user);
    new ApiResponse_1.SuccessResponse("Message sent", lodash_1.default.pick(message, "_id", "text", "createdAt")).send(res);
}));
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
router.get('/view/user-messages', authentication_1.default, asyncHandler_1.default(async (req, res) => {
    const result = await MessageRepo_1.default.findMessagesForUserWithId(req.user._id).paginate(req, res);
    new ApiResponse_1.PaginationResponse("User's messages", result).send(res);
}));
exports.default = router;
//# sourceMappingURL=index.js.map
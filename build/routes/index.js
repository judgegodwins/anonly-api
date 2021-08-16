"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("./auth"));
const profile_1 = __importDefault(require("./profile"));
const messaging_1 = __importDefault(require("./messaging"));
const router = express_1.default.Router();
/**
 * @openapi
 * definitions:
 *  BadRequestResponse:
 *    type: object
 *    properties:
 *      message:
 *        type: string
 * tags:
 *  - name: Authentication
 *    description: All routes concerning auth.
 *  - name: Messaging
 *    description: All routes concerning messaging
 */
router.use('/auth', auth_1.default);
router.use('/profile', profile_1.default);
router.use('/message', messaging_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// import { ProtectedRequest } from "app-request";
const asyncHandler_1 = __importDefault(require("../helpers/asyncHandler"));
const authUtils_1 = require("./authUtils");
const config_1 = require("../config");
const UserRepo_1 = __importDefault(require("../database/repository/UserRepo"));
const ApiError_1 = require("../core/ApiError");
const router = express_1.default.Router();
exports.default = [
    // validator(schema.authHeader, ValidationSource.Header),
    asyncHandler_1.default(async (req, res, next) => {
        const token = authUtils_1.getAccessToken(req.headers.authorization);
        jsonwebtoken_1.default.verify(token, config_1.jwtSecret, async (err, decoded) => {
            if (err)
                next(err);
            if (!decoded)
                throw new ApiError_1.AuthFailureError('Invalid token');
            const user = await UserRepo_1.default.findUserByUsername(decoded.username);
            if (!user)
                throw new ApiError_1.AuthFailureError('Invalid token');
            req.user = decoded;
            next();
        });
    })
];
//# sourceMappingURL=authentication.js.map
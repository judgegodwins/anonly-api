"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAccessToken = exports.createToken = void 0;
const config_1 = require("../config");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ApiError_1 = require("../core/ApiError");
const createToken = (user) => {
    const expiresOn = new Date(Date.now() + 1000 * 60 * 60 * 24 * 15).toISOString();
    const accessToken = jsonwebtoken_1.default.sign(user, config_1.jwtSecret, { expiresIn: '10d' });
    return { accessToken, expiresOn };
};
exports.createToken = createToken;
const getAccessToken = (authorization) => {
    if (!authorization)
        throw new ApiError_1.AuthFailureError("Authorization header not sent");
    if (!authorization.startsWith("Bearer "))
        throw new ApiError_1.AuthFailureError("Invalid authorization header");
    return authorization.split(" ")[1];
};
exports.getAccessToken = getAccessToken;
//# sourceMappingURL=authUtils.js.map
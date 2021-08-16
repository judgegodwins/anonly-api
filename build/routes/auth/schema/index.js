"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
exports.default = {
    signup: joi_1.default.object({
        username: joi_1.default.string().required().min(5),
        email: joi_1.default.string().optional().email(),
        password: joi_1.default.string().required().min(6),
    }),
    login: joi_1.default.object({
        username: joi_1.default.string().required(),
        password: joi_1.default.string().required().min(6)
    })
};
//# sourceMappingURL=index.js.map
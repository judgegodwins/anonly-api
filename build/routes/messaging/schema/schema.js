"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
exports.default = {
    params: joi_1.default.object({
        username: joi_1.default.string().required()
    }),
    body: joi_1.default.object({
        text: joi_1.default.string().required()
    })
};
//# sourceMappingURL=schema.js.map
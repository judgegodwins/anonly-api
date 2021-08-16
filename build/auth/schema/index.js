"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
exports.default = {
    authHeader: joi_1.default.object().keys({
        authorization: joi_1.default.string().custom((value, helpers) => {
            if (!value.startsWith("Bearer "))
                return helpers.error('any.invalid');
            if (!value.split(' ')[1])
                return helpers.error('any.invalid');
            return value;
        }, "Auth header validation").required()
    })
};
//# sourceMappingURL=index.js.map
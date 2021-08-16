"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (exec) => (req, res, next) => {
    return exec(req, res, next).catch(next);
};
//# sourceMappingURL=asyncHandler.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationSource = void 0;
const ApiError_1 = require("../core/ApiError");
var ValidationSource;
(function (ValidationSource) {
    ValidationSource["Body"] = "body";
    ValidationSource["Header"] = "headers";
    ValidationSource["Query"] = "query";
    ValidationSource["Param"] = "params";
})(ValidationSource = exports.ValidationSource || (exports.ValidationSource = {}));
exports.default = (schema, source = ValidationSource.Body) => (req, res, next) => {
    // console.log('source: ', source);
    const { error } = schema.validate(req[source]);
    if (!error)
        return next();
    const { details } = error;
    // console.log('details: ', details);
    const message = details.map((i) => i.message.replace(/['"]+/g, '')).join(',');
    next(new ApiError_1.BadRequestError(message));
};
//# sourceMappingURL=validator.js.map
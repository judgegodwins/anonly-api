"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const Logger_1 = __importDefault(require("./core/Logger"));
const config_1 = require("./config");
//temporary
const hold = {
    "username": { "type": "string" },
    "email": { "type": "string" },
    "password": {
        "type": "string",
        "minimum": 6
    }
};
app_1.default
    .listen(config_1.port, () => {
    console.log('here');
    Logger_1.default.info(`server running on port ${config_1.port}`);
})
    .on("error", (e) => Logger_1.default.error(e));
//# sourceMappingURL=server.js.map
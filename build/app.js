"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const Logger_1 = __importDefault(require("./core/Logger"));
const config_1 = require("./config");
require("./database");
const ApiError_1 = require("./core/ApiError");
const routes_1 = __importDefault(require("./routes"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
process.on('uncaughtException', (e) => {
    console.log(e, 'about to log yo');
    Logger_1.default.error(e);
});
const app = express_1.default();
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Anonymous Messaging API',
            description: 'API for sending anonymous messages.',
            version: '1.0.0'
        },
    },
    apis: [path_1.default.join(__dirname, '/routes/**/*.js')]
};
const openapiSpec = swagger_jsdoc_1.default(options);
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb', parameterLimit: 50000 }));
app.use(cors_1.default({ origin: config_1.corsUrl, optionsSuccessStatus: 200 }));
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(openapiSpec));
app.use('/', routes_1.default);
app.use((req, res, next) => next(new ApiError_1.NotFoundError()));
app.use((err, req, res, next) => {
    if (err instanceof ApiError_1.ApiError) {
        ApiError_1.ApiError.handle(err, res);
    }
    else {
        console.log('error: ', err);
        if (config_1.environment == 'development') {
            Logger_1.default.error(err);
            return res.status(500).send(err.message);
        }
        ApiError_1.ApiError.handle(new ApiError_1.InternalError(), res);
    }
});
exports.default = app;
//# sourceMappingURL=app.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Logger_1 = __importDefault(require("../core/Logger"));
const config_1 = require("../config");
const mongoose_1 = __importDefault(require("mongoose"));
const dbURI = `mongodb://${config_1.dbConfig.user}:${encodeURIComponent(config_1.dbConfig.password)}@${config_1.dbConfig.host}:${config_1.dbConfig.port}/${config_1.dbConfig.name}`;
const options = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
};
mongoose_1.default
    .connect(dbURI, options)
    .then((db) => Logger_1.default.info("DB connected"))
    .catch(e => {
    console.log('error connecting: ', e);
    Logger_1.default.info("Mongoose connection error");
    Logger_1.default.error(e);
});
// If the connection throws an error
mongoose_1.default.connection.on('error', (err) => {
    Logger_1.default.error('Mongoose default connection error: ' + err);
});
// When the connection is disconnected
mongoose_1.default.connection.on('disconnected', () => {
    Logger_1.default.info('Mongoose default connection disconnected');
});
// If the Node process ends, close the Mongoose connection
process.on('SIGINT', () => {
    mongoose_1.default.connection.close(() => {
        Logger_1.default.info('Mongoose default connection disconnected through app termination');
        process.exit(0);
    });
});
//# sourceMappingURL=index.js.map
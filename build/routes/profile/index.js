"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authentication_1 = __importDefault(require("../../auth/authentication"));
const router = express_1.default.Router();
router.use(authentication_1.default);
router.get('/', (req, res) => {
    console.log(req);
    res.json({ text: 'hello' });
});
exports.default = router;
//# sourceMappingURL=index.js.map
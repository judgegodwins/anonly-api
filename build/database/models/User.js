"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = exports.Role = exports.COLLECTION_NAME = exports.DOCUMENT_NAME = void 0;
const mongoose_1 = require("mongoose");
const bcrypt_1 = __importDefault(require("bcrypt"));
exports.DOCUMENT_NAME = 'User';
exports.COLLECTION_NAME = 'users';
var Role;
(function (Role) {
    Role["User"] = "USER";
    Role["Admin"] = "ADMIN";
})(Role = exports.Role || (exports.Role = {}));
const schema = new mongoose_1.Schema({
    username: {
        type: mongoose_1.Schema.Types.String,
        required: true,
        trim: true,
        maxLength: 20
    },
    email: {
        type: mongoose_1.Schema.Types.String,
        unique: true,
        trim: true,
    },
    password: {
        type: mongoose_1.Schema.Types.String,
        required: true
    },
    verified: {
        type: mongoose_1.Schema.Types.Boolean,
        required: true,
        default: false
    },
    roles: {
        type: [
            {
                type: mongoose_1.Schema.Types.String,
                enum: [Role.User, Role.Admin]
            }
        ],
        default: Role.User,
        required: true
    },
    messages: {
        type: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Message' }]
    }
}, {
    timestamps: true
});
schema.pre('save', function (next) {
    if (!this.isModified('password'))
        return next();
    bcrypt_1.default.hash(this.password, 12, (err, hash) => {
        if (err)
            next(err);
        this.password = hash;
        next();
    });
});
exports.UserModel = mongoose_1.model(exports.DOCUMENT_NAME, schema, exports.COLLECTION_NAME);
//# sourceMappingURL=User.js.map
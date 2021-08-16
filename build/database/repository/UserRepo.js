"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = require("../models/User");
// import { LeanDocument, Document } from 'mongoose';
class UserRepo {
    static async create(user) {
        const createdUser = await User_1.UserModel.create(user);
        return createdUser.toObject();
    }
    static async findUserByUsername(username) {
        const user = await User_1.UserModel.findOne({ username });
        if (!user)
            return null;
        return user.toObject();
    }
    static findUserByEmail(email) {
        return User_1.UserModel.findOne({ email })
            .lean()
            .exec();
    }
}
exports.default = UserRepo;
//# sourceMappingURL=UserRepo.js.map
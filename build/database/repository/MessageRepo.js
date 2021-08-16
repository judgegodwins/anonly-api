"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Message_1 = require("../models/Message");
const User_1 = require("../models/User");
const BaseRepo_1 = __importDefault(require("./BaseRepo"));
class MessageRepo extends BaseRepo_1.default {
    static async create(text, user) {
        const message = await Message_1.MessageModel.create({ text, user: user._id });
        await User_1.UserModel.updateOne({ username: user.username }, { $push: { messages: message._id } });
        return message.toObject();
    }
    /**
     * Finds the messages sent to a user
     */
    static findMessagesForUserWithId(id) {
        const query = Message_1.MessageModel.find({ user: id });
        // const count = await MessageModel.countDocuments(query);
        return MessageRepo.paginate(query);
    }
}
exports.default = MessageRepo;
//# sourceMappingURL=MessageRepo.js.map
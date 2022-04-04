import { Schema, isValidObjectId, Types } from "mongoose";
import Pagination from "../../helpers/Pagination";
import Message, { MessageModel } from "../models/Message";
import User, { UserModel } from "../models/User";

interface PaginationOptions {
  limit: number;
  page: number;
}

export default class MessageRepo {
  public static async create(text: string, user: User) {
    const message = await MessageModel.create({ text, user: user._id });

    await UserModel.updateOne(
      { username: user.username },
      { $push: { messages: message._id } }
    );

    return message.toObject<Message>();
  }

  /**
   * Finds the messages sent to a user
   */
  public static findMessagesForUserWithId(
    id: Types.ObjectId | string
  ): Pagination<Message> {
    const query = MessageModel.find({ user: id });

    // const count = await MessageModel.countDocuments(query);
    return new Pagination<Message, Message[]>(query);
  }
}

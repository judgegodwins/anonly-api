import { ObjectId, Types } from "mongoose";
import Message, { MessageModel } from '../models/Message';
import User, { UserModel } from '../models/User';
import BaseRepo, { PaginationFunction } from './BaseRepo';

interface PaginationOptions {
  limit: number,
  page: number
}

export default class MessageRepo extends BaseRepo {
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
  public static findMessagesForUserWithId(id: ObjectId): {paginate: PaginationFunction} {

    const query = MessageModel.find({user: id})

    // const count = await MessageModel.countDocuments(query);
    return MessageRepo.paginate<Message>(query);
  }
}

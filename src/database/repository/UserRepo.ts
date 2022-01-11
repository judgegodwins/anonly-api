import { Schema, Types } from 'mongoose';
import User, { Role, UserModel } from '../models/User';
// import { LeanDocument, Document } from 'mongoose';

export default class UserRepo {
  public static async create(user: User): Promise<User> {
    if (!user.email) delete user.email;
    
    const createdUser = await UserModel.create(user);

    return createdUser.toObject();
  }

  public static addVerifiedEmail(userId: Types.ObjectId, email: string) {
    return UserModel.findByIdAndUpdate(userId, {
        email,
        verified: true
      }, 
      { new: true, useFindAndModify: false }
    )
      .lean<User>()
      .exec();
  }

  public static async findUserByUsername(username: string): Promise<User | null> {
    const user = await UserModel.findOne({ username });

    if (!user) return null;

    return user.toObject();
  }

  public static findUserByEmail(email: string): Promise<User | null> {
    return UserModel.findOne({ email })
      .lean<User>()
      .exec();
  }

}
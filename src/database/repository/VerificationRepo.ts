import { Types } from "mongoose";
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';

import { Verification, VerificationModel } from "../models/Verification";

export default class VerificationRepo {

  public static async createDetails(userID: Types.ObjectId, email: string) {
    const id = uuidv4();
    const details = await VerificationModel.create({
      lookupId: id,
      user: userID,
      proposedEmail: email
    });

    return id;
  }

  public static findVerificationDetails(userId: Types.ObjectId) {
    return VerificationModel.findOne({ user: userId })
      .lean<Verification>()
      .exec();
  }

  public static findWithEmail(email: string) {
    return VerificationModel.findOne({ proposedEmail: email })
      .lean<Verification>()
      .exec();
  }

  public static async resetLookupId(userId: Types.ObjectId) {
    const id = uuidv4();
    const hash = await bcrypt.hash(id, 12);

    const update = await VerificationModel.updateOne(
      { user: userId },
      { lookupId: hash }
    )

    return id;
  }

  public static async delete(userId: Types.ObjectId) {
    const d = await VerificationModel.deleteOne({ user: userId })

    return d;
  }
}
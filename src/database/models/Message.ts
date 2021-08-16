import { Document, Schema, model, Query, Model } from "mongoose";

export const DOCUMENT_NAME = 'Message';
export const COLLECTION_NAME = 'messages';

export default interface Message {
  text: string;
  user: Schema.Types.ObjectId,
  createdAt: Date;
  updatedAt: Date;
}

const schema = new Schema<Message>(
  {
    text: {
      type: Schema.Types.String,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    }
  }, { timestamps: true }
)

interface MessageQueryHelpers {
  paginate(page: number, limit: number): Query<any, Document<Message>> & MessageQueryHelpers;
}

schema.query.paginate = async function (page, limit): Promise<Query<any, Document<Message>> & MessageQueryHelpers> {
  const startIndex = (page - 1) * limit;

  const newQuery = this.limit(limit).skip(startIndex);
  const count = await this.model.countDocuments(this);

  return newQuery;
}

export const MessageModel = model<Message, Model<Message, MessageQueryHelpers>>(DOCUMENT_NAME, schema, COLLECTION_NAME);
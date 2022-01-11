import { Types, Document, Schema, model, Query, Model } from "mongoose";

export const DOCUMENT_NAME = 'Message';
export const COLLECTION_NAME = 'messages';

export default interface Message {
  text: string;
  user: Types.ObjectId,
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

export const MessageModel = model<Message>(DOCUMENT_NAME, schema, COLLECTION_NAME);
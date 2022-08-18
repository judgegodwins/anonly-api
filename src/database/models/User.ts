import { Schema, Types, model } from "mongoose";
import bcrypt from 'bcrypt';
import Message from './Message';

export const DOCUMENT_NAME = 'User';
export const COLLECTION_NAME = 'users';

export default interface User {
  _id: Types.ObjectId
  username: string;
  email?: string;
  password: string;
  verified: boolean;
  clientTheme?: string;
  roles: Role[];
  createdAt?: Date;
  updatedAt?: Date;
}

export enum Role {
  User = 'USER',
  Admin = 'ADMIN'
}

export const sensitiveFields = ['password'];

const schema = new Schema<User>(
  {
    username: {
      type: Schema.Types.String,
      required: true,
      trim: true,
      maxLength: 20
    },
    email: {
      type: Schema.Types.String,
      trim: true,
      index: { unique: true, sparse: true }
    },
    password: {
      type: Schema.Types.String,
      required: true
    },
    verified: {
      type: Schema.Types.Boolean,
      required: true,
      default: false  
    },
    roles: {
      type: [
        { 
          type: Schema.Types.String,
          enum: [Role.User, Role.Admin]
        }
      ],
      default: [Role.User],
      required: true
    },
    clientTheme: Schema.Types.String
  },
  {
    timestamps: true
  }
)

schema.pre('save', function (next) {
  if (!this.isModified('password')) return next();

  bcrypt.hash(this.password, 12, (err: Error, hash: string) => {
    if (err) next(err);
    this.password = hash;

    next();
  })
})

export const UserModel = model<User>(DOCUMENT_NAME, schema, COLLECTION_NAME)
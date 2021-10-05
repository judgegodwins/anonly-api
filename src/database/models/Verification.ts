import { Schema, Types, model, Query, Document } from "mongoose";

export const DOCUMENT_NAME = 'Verification';
export const COLLECTION_NAME = 'verification';

export interface Verification {
  lookupId: string;
  user: Types.ObjectId;
  proposedEmail: string;
}

const schema = new Schema<Verification>(
  {
    lookupId: {
      type: Schema.Types.String,
      required: true,
      unique: true
    },
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
      unique: true
    },
    proposedEmail: {
      type: Schema.Types.String,
      required: true,
      unique: true
    }
  },
  { timestamps: true }
);

// interface VerificationQueryHelpers {
//   updateId(): Query<any, Document<Verification>> & VerificationQueryHelpers;
// }

// schema.query.updateId = function (): Query<any, Document<Verification>> & VerificationQueryHelpers {
//   // const hash = await bcrypt.hash(id, 12);

//   console.log(this);
//   console.log(this.lookupId)
//   // const salt = bcrypt.genSaltSync(12);
//   // const hash = bcrypt.hashSync(this.lookupId, salt)
//   return this.find({})
// }

// schema.pre('save', function (next) {
//   if (!this.isModified('lookupId')) return next();

//   bcrypt.hash(this.lookupId, 12, (err: Error, hash: string) => {
//     if (err) next(err);
//     this.lookupId = hash;

//     next();
//   })
// })

export const VerificationModel = model<Verification>(DOCUMENT_NAME, schema, COLLECTION_NAME);
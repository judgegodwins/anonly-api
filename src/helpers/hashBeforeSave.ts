// import { CallbackError, Document } from "mongoose"
// import bcrypt from 'bcrypt';

// export default <T>(document: T & Document<any, any, T>, field: string) => 
//   (next: (err?: CallbackError | undefined) => void) => {
//   if (!document.isModified('password')) return next();

//   if (field in document) {
//     bcrypt.hash(document[field], 12, (err: Error, hash: string) => {
//       if (err) next(err);
//       document[field] = hash;
  
//       next();
//     })
//   }

// }
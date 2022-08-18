import bcrypt from "bcrypt";

export const bcryptHash = (data: string) => bcrypt.hash(data, 12);
export const bcryptCompare = (value: string, hash: string) => bcrypt.compare(value, hash);
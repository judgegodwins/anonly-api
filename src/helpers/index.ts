import bcrypt from "bcrypt";

export const bcryptHash = (data: string) => bcrypt.hash(data, 12);

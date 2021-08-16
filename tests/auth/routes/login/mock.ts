import User, { Role } from "../../../../src/database/models/User";

export const mockUser = {
  username: 'testuser',
  password: 'testpas3',
  email: 'test@test.com',
  verified: false,
  roles: [Role.User]
} as User
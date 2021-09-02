import User, { Role } from '../../src/database/models/User';

export const mockUser = {
  // _id: '612fa656924b90290ec46334',
  username: 'testuser',
  password: 'testpas3',
  email: 'test@test.com',
  verified: false,
  roles: [Role.User]
} as User
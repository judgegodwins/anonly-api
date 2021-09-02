import UserRepo from "../../../../src/database/repository/UserRepo"
import { mockUser } from "./mock";
import request, { addHeader } from "../../../request";

describe('Login route', () => {

  const endpoint = '/auth/login';

  beforeAll(async () => {
    await UserRepo.create(mockUser);
  });

  it('Should return bad request error if username is not in request body', async () => {
    const response = await addHeader(
      request.post(endpoint).send({
        // username: USERNAME,
        password: mockUser.password
      })
    );

    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/username/);
    expect(response.body.message).toMatch(/required/);
  })

  it('Should sign in user if correct details are sent', async () => {
    const response = await addHeader(
      request.post(endpoint).send({
        username: mockUser.username,
        password: mockUser.password
      })
    );

    expect(response.status).toBe(200);
    expect(response.body.message).toContain('Login successful')
    expect(response.body.data).toBeDefined();
    expect(response.body.data.user).toHaveProperty('username');
    expect(response.body.data.user).toHaveProperty('_id');
    expect(response.body.data.user).toHaveProperty('roles');
    expect(response.body.data.user).not.toHaveProperty('password');
    expect(response.body.data).toHaveProperty('token');
    expect(response.body.data).toHaveProperty('tokenExpiresOn');
  })

  it('Should send auth tokens and expiry date', async () => {
    const response = await addHeader(
      request.post(endpoint).send({
        username: mockUser.username,
        password: mockUser.password
      })
    );
    
    expect(response.body.data).toHaveProperty('token');
    expect(response.body.data).toHaveProperty('tokenExpiresOn');
  })

  it('Should respond with error if password is wrong', async () => {
    const response = await addHeader(
      request.post(endpoint).send({
        username: mockUser.username,
        password: '4739fh'
      })
    );

    expect(response.status).toBe(400);
    expect(response.body.message).toContain('Invalid username or password');
  })
})
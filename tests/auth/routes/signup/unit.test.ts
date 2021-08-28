
import mongoose from "mongoose";
import UserRepo from "../../../../src/database/repository/UserRepo";
import request, { addHeader } from "../../../request";
import { mockBody } from "./mock";

describe('Signup route', () => {
  const endpoint = '/auth/signup';

  const email = 'abc@xyz.com';

  it('Should return bad request error when empty body is sent', async () => {
    const response = await addHeader(request.post(endpoint));

    expect(response.status).toBe(400);
  })

  it('Should return bad request error if username is not in request body', async () => {
    const response = await addHeader(
      request.post(endpoint).send({
        // username: USERNAME,
        password: mockBody.PASSWORD
      })
    );

    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/username/);
    expect(response.body.message).toMatch(/required/);
  })

  it('Should return bad request error if password is not in request body', async () => {
    const response = await addHeader(
      request.post(endpoint).send({
        username: mockBody.USERNAME,
        // password: mockBody.PASSWORD
      })
    );

    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/password/);
    expect(response.body.message).toMatch(/required/);
  })

  it('Should create user if username and password are sent and send auth tokens and expiry', async () => {
    const response = await addHeader(
      request.post(endpoint).send({
        username: mockBody.USERNAME,
        password: mockBody.PASSWORD
      })
    )

    expect(response.status).toBe(200);
    expect(response.body.message).toMatch(/created/)
    expect(response.body.data).toBeDefined();
    expect(response.body.data.user).toHaveProperty('username');
    expect(response.body.data.user).toHaveProperty('_id');
    expect(response.body.data.user).toHaveProperty('roles');
    expect(response.body.data.user).not.toHaveProperty('password');
    expect(response.body.data).toHaveProperty('token');
    expect(response.body.data).toHaveProperty('tokenExpiresOn')
    
    expect(UserRepo.findUserByUsername(mockBody.USERNAME)).resolves.toBeDefined();
  })

  it('Should return user registered message when a duplicate username is registered', async () => {
    const reg = async () => {
      return await addHeader(
        request.post(endpoint).send({
          username: mockBody.USERNAME,
          password: mockBody.PASSWORD
        })
      );
    }
    const firstResponse = await reg();
    const secondResponse = await reg();

    expect(secondResponse.status).toBe(400)
    expect(secondResponse.body.message).toContain("username already exists")
  })
})

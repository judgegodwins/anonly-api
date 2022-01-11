import { mockUser } from "./mock";
import User from "../../src/database/models/User";
import UserRepo from "../../src/database/repository/UserRepo";
import request, { addHeader } from "../request";
import { MessageModel } from "../../src/database/models/Message";


describe('Messaging', () => {
  let user: User;

  beforeAll(async () => {
    user = await UserRepo.create(mockUser);
  });


  describe('Send message route /message/:username', () => {
    const endpoint = '/message/new';

    it('Should respond with 400 error if text field is not sent', async () => {
      const response = await addHeader(
        request.post(endpoint).query({ user: mockUser.username }).send({})
      );

      expect(response.status).toBe(400);
      expect(response.body.message).toContain("body");
    });

    it('Should respond with 400 error if username is not sent in query', async () => {
      const response = await addHeader(
        request.post(endpoint).query({}).send({text: 'Hello user'})
      );

      expect(response.status).toBe(400)
      expect(response.body.message).toContain("query")
    });

    it('Should return 404 if user with username is not found', async () => {
      const response = await addHeader(
        request.post('/message/new').query({ user: 'unknowntester' }).send({
          text: 'Hello unknowntester!'
        })
      );

      expect(response.status).toBe(404);
      expect(response.body.message).toMatch(/username not found/);
    })

    it('Should save message when text field is sent and username found', async () => {
      const response = await addHeader(
        request.post(endpoint).send({
          text: 'Hello tester!'
        })
      );

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('text');
      expect(MessageModel.findOne({ user: user._id })).resolves.toBeDefined()
      // expect(MessageRepo.findMessagesForUserWithId(user._id)).toBe(Pagination)
    })
  })


  describe('view messages', () => {
    const endpoint = '/message/view/user-messages'
    let authToken: string;

    beforeAll(async () => {
      const loginResponse = await addHeader(
        request.post('/auth/login').send({
          username: mockUser.username,
          password: mockUser.password
        })
      );
      authToken = loginResponse.body.data.token;
    })

    it('Should return 400 error if page and limit query params are not sent', async () => {
      const response = await addHeader(
        request.get(endpoint)
          .set('authorization', `Bearer ${authToken}`)
      );

      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(/required/)
    });

    it('Should return messages in paginated form', async () => {
      const response = await addHeader(
        request.get(endpoint)
          .query({ page: 1, limit: 10 })
          .set('authorization', `Bearer ${authToken}`)
      );

      expect(response.status).toBe(200);
      expect(response.body.data).toBeDefined();
      expect(response.body).toHaveProperty('pagesNecessary')
      expect(response.body.data.length).toBeGreaterThan(0);
    })
  })

  describe('Check user exists', () => {
    const endpoint = '/message/check-user';
    it('Should return success if user with username (in query) is found', async () => {
      const response = await request.get(endpoint)
        .query({ 'username': mockUser.username });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success');
      expect(response.body.success).toBeTruthy();
    })

    it('Should return with 404 error if user with username (in query) is not found', async () => {
      const response = await request.get(endpoint)
        .query({ 'username': 'unknown' });

      expect(response.status).toBe(404);
      expect(response.body.message).toMatch(/not found/);
    })
  })
})
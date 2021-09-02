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
    const endpoint = `/message/${mockUser.username}`;

    it('Should respond with 400 error if text field is not sent', async () => {
      const response = await addHeader(
        request.post(endpoint).send({})
      );

      expect(response.status).toBe(400)
    });

    it('Should return 404 if user with username is not found', async () => {
      const response = await addHeader(
        request.post('/message/unknowntester').send({
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
})
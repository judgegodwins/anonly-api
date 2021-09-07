import request, { addHeader } from "../../../request";

describe('Protected routes', () => {

  const endpoint = '/message/view/user-messages';

  it('Should respond with 401 Unauthorized error when requesting without access token', async () => {
    const response = await addHeader(
      request.get(endpoint)
    );

    expect(response.status).toBe(401);
    expect(response.body.message).toMatch(/header not sent/i);
  });

  it('Should respond with 401 error and "malformed token" msg when requesting with malformed token', async () => {
    const response = await addHeader(
      request.get(endpoint)
        .set('authorization', 'Bearer eyhey20GHs53shjfke...3')
    );

    expect(response.status).toBe(401);
    expect(response.body.message).toMatch(/malformed token/i);
  });

  // it('Should respond with 401 error when expired or wrong token is sent', async () => {
  //   const response = await addHeader(
  //     request.get(endpoint)
  //       .set('authorization', 'Bearer eyhey20GHs53shjfke...3')
  //   );

  //   expect(response.status).toBe(401);
  //   expect(response.body.message).toMatch(/malformed token/i);
  // })
})
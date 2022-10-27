import request from 'supertest';

import { app } from '../../app';

describe('current-user', () => {
  it('responds with details about the current user', async () => {
    const cookie = await global.signUp();

    const response = await request(app)
      .get('/api/users/current_user')
      .set('Cookie', cookie)
      .send()
      .expect(200);

    expect(response.body.currentUser.email).toEqual('test@test.com');
  });

  it('response with null if not authenticated', async () => {
    const response = await request(app)
      .get('/api/users/current_user')
      .send()
      .expect(200);

    expect(response.body.currentUser).toEqual(null);
  });
});

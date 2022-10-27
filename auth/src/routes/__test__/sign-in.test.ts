import request from 'supertest';

import { app } from '../../app';

describe('sign-in', () => {
  it('fails when an email that does not exist is supplied', async () => {
    await request(app)
      .post('/api/users/sign_in')
      .send({
        email: 'test@test.com',
        password: 'password',
      })
      .expect(400);
  });

  it('fails when an incorrect password is supplied', async () => {
    await global.signUp();

    await request(app)
      .post('/api/users/sign_in')
      .send({
        email: 'test@test.com',
        password: 'pas',
      })
      .expect(400);
  });

  it('response with a cookie when given valid credentials', async () => {
    await global.signUp();

    const response = await request(app)
      .post('/api/users/sign_in')
      .send({
        email: 'test@test.com',
        password: 'password',
      })
      .expect(200);

    expect(response.get('Set-Cookie')).toBeDefined();
  });
});

import request from 'supertest';

import { app } from '../../app';

const createWallet = (name = 'test', cookie = global.signUp()) => {
  return request(app)
    .post('/api/wallets')
    .set('Cookie', cookie)
    .send({ name })
    .expect(201);
};

describe('read-all', () => {
  it('has a route handler listening to /api/wallets for get request', async () => {
    const response = await request(app).get('/api/wallets').send();

    expect(response.status).not.toEqual(404);
  });

  it('can only be accessed if the user is signed in', async () => {
    await request(app).get('/api/wallets').send().expect(401);
  });

  it('returns a status other than 401 if the user is signed in', async () => {
    const response = await request(app)
      .post('/api/wallets')
      .set('Cookie', global.signUp())
      .send();

    expect(response.status).not.toEqual(401);
  });

  it('returns an empty list if user has no wallet', async () => {
    const response = await request(app)
      .get('/api/wallets')
      .set('Cookie', global.signUp())
      .expect(200);

    expect(response.body.length).toEqual(0);
  });

  it('returns the list of wallets if user has any', async () => {
    const name1 = 'test 1';
    const name2 = 'test 2';
    const cookie = global.signUp();

    await createWallet(name1, cookie);
    await createWallet(name2, cookie);

    const response = await request(app)
      .get('/api/wallets')
      .set('Cookie', cookie)
      .expect(200);

    expect(response.body.length).toEqual(2);
    expect(response.body[0].name).toEqual(name1);
    expect(response.body[1].name).toEqual(name2);
  });
});

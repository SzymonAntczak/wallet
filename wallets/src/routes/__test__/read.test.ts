import request from 'supertest';
import mongoose from 'mongoose';

import { app } from '../../app';

describe('read', () => {
  it('has a route handler listening to /api/wallets/:id for get request', async () => {
    const response = await request(app).get('/api/wallets/id').send();

    expect(response.status).not.toEqual(404);
  });

  it('can only be accessed if the user is signed in', async () => {
    await request(app).get('/api/wallets/id').send().expect(401);
  });

  it('returns a status other than 401 if the user is signed in', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

    const response = await request(app)
      .get(`/api/wallets/${id}`)
      .set('Cookie', global.signUp())
      .send();

    expect(response.status).not.toEqual(401);
  });

  it('returns a 404 if the wallet is not found', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

    await request(app)
      .get(`/api/wallets/${id}`)
      .set('Cookie', global.signUp())
      .send()
      .expect(404);
  });

  it('returns the wallet if the wallet is found', async () => {
    const cookie = global.signUp();
    const name = 'test';

    const createResponse = await request(app)
      .post('/api/wallets')
      .set('Cookie', cookie)
      .send({ name })
      .expect(201);

    const readResponse = await request(app)
      .get(`/api/wallets/${createResponse.body.id}`)
      .set('Cookie', cookie)
      .send()
      .expect(200);

    expect(readResponse.body.name).toEqual(name);
  });
});

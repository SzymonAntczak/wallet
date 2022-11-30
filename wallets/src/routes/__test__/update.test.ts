import mongoose from 'mongoose';
import request from 'supertest';

import { app } from '../../app';
import { natsWrapper } from '../../nats-wrapper';

describe('update', () => {
  it('has a route handler listening to /api/wallets/:id for put request', async () => {
    const response = await request(app).put('/api/wallets/id').send({});

    expect(response.status).not.toEqual(404);
  });

  it('can only be accessed if the user is signed in', async () => {
    await request(app).put('/api/wallets/id').send({}).expect(401);
  });

  it('returns a status other than 401 if the user is signed in', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

    const response = await request(app)
      .put(`/api/wallets/${id}`)
      .set('Cookie', global.signUp())
      .send({});

    expect(response.status).not.toEqual(401);
  });

  it('returns a 400 if invalid input is provided', async () => {
    const cookie = global.signUp();

    const response = await request(app)
      .post('/api/wallets')
      .set('Cookie', cookie)
      .send({
        name: 'test',
      })
      .expect(201);

    await request(app)
      .put(`/api/wallets/${response.body.id}`)
      .set('Cookie', cookie)
      .send({})
      .expect(400);

    await request(app)
      .put(`/api/wallets/${response.body.id}`)
      .set('Cookie', cookie)
      .send({ name: 1 })
      .expect(400);

    await request(app)
      .put(`/api/wallets/${response.body.id}`)
      .set('Cookie', cookie)
      .send({ name: '' })
      .expect(400);
  });

  it('returns a 404 if the wallet is not found', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

    await request(app)
      .put(`/api/wallets/${id}`)
      .set('Cookie', global.signUp())
      .send({ name: 'test' })
      .expect(404);
  });

  it('returns a 401 if user does not own the wallet', async () => {
    const response = await request(app)
      .post('/api/wallets')
      .set('Cookie', global.signUp())
      .send({ name: 'test 1' })
      .expect(201);

    await request(app)
      .put(`/api/wallets/${response.body.id}`)
      .set('Cookie', global.signUp())
      .send({ name: 'test 2' })
      .expect(401);
  });

  it('updates the wallet with valid input', async () => {
    const cookie = global.signUp();
    const updatedName = 'test 2';

    const createResponse = await request(app)
      .post('/api/wallets')
      .set('Cookie', cookie)
      .send({ name: 'test 1' })
      .expect(201);

    await request(app)
      .put(`/api/wallets/${createResponse.body.id}`)
      .set('Cookie', cookie)
      .send({ name: updatedName })
      .expect(200);

    const readResponse = await request(app)
      .get(`/api/wallets/${createResponse.body.id}`)
      .set('Cookie', cookie)
      .send()
      .expect(200);

    expect(readResponse.body.name).toEqual(updatedName);
  });

  it('publishes an event', async () => {
    const cookie = global.signUp();

    const createResponse = await request(app)
      .post('/api/wallets')
      .set('Cookie', cookie)
      .send({ name: 'test 1' })
      .expect(201);

    await request(app)
      .put(`/api/wallets/${createResponse.body.id}`)
      .set('Cookie', cookie)
      .send({ name: 'test 2' })
      .expect(200);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
  });
});

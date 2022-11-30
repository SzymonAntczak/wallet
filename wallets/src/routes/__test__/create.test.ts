import request from 'supertest';

import { app } from '../../app';
import { Wallet } from '../../models/wallet';
import { natsWrapper } from '../../nats-wrapper';

describe('create', () => {
  it('has a route handler listening to /api/wallets for post request', async () => {
    const response = await request(app).post('/api/wallets').send({});

    expect(response.status).not.toEqual(404);
  });

  it('can only be accessed if the user is signed in', async () => {
    await request(app).post('/api/wallets').send({}).expect(401);
  });

  it('returns a status other than 401 if the user is signed in', async () => {
    const response = await request(app)
      .post('/api/wallets')
      .set('Cookie', global.signUp())
      .send({});

    expect(response.status).not.toEqual(401);
  });

  it('returns a 400 if an invalid input is provided', async () => {
    await request(app)
      .post('/api/wallets')
      .set('Cookie', global.signUp())
      .send({})
      .expect(400);

    await request(app)
      .post('/api/wallets')
      .set('Cookie', global.signUp())
      .send({ name: 1 })
      .expect(400);

    await request(app)
      .post('/api/wallets')
      .set('Cookie', global.signUp())
      .send({ name: '' })
      .expect(400);
  });

  it('creates a wallet with valid input', async () => {
    const name = 'test';
    let wallets = await Wallet.find({});

    expect(wallets.length).toEqual(0);

    await request(app)
      .post('/api/wallets')
      .set('Cookie', global.signUp())
      .send({ name })
      .expect(201);

    wallets = await Wallet.find({});

    expect(wallets.length).toEqual(1);
    expect(wallets[0].name).toEqual(name);
  });

  it('publishes an event', async () => {
    const name = 'test';

    await request(app)
      .post('/api/wallets')
      .set('Cookie', global.signUp())
      .send({ name })
      .expect(201);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
  });
});

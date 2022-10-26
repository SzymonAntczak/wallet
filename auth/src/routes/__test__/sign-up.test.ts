import request from 'supertest';

import { app } from '../../app';

it('returns a 201 on successful sign up', async () => {
  return request(app)
    .post('/api/users/sign_up')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201);
});

it('returns a 400 with an invalid email', async () => {
  return request(app)
    .post('/api/users/sign_up')
    .send({
      email: 'test',
      password: 'password',
    })
    .expect(400);
});

it('returns a 400 with an invalid password', async () => {
  return request(app)
    .post('/api/users/sign_up')
    .send({
      email: 'test@test.com',
      password: 'pas',
    })
    .expect(400);
});

it('returns a 400 with missing email and password', async () => {
  await request(app)
    .post('/api/users/sign_up')
    .send({
      email: 'test@test.com',
    })
    .expect(400);

  await request(app)
    .post('/api/users/sign_up')
    .send({
      password: 'pas',
    })
    .expect(400);
});

it('disallows duplicate emails', async () => {
  await request(app)
    .post('/api/users/sign_up')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201);

  await request(app)
    .post('/api/users/sign_up')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(400);
});

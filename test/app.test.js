const request = require('supertest');

const app = require('../src/app');

describe('app', () => {
  it('responds with a not found message', async () => {
    await request(app)
      .get('/what-is-this-even')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(404);
  });

  it('describes the local service at the root', async () => {
    const response = await request(app)
      .get('/')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toEqual({
      name: 'Email Domain Verifier API',
      endpoint: '/api/validate-email?email=name@example.com',
      deployed: false,
    });
  });
});

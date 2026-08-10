const dns = require('node:dns').promises;
const request = require('supertest');

const app = require('../src/app');

describe('GET /api', () => {
  it('describes the API', async () => {
    const response = await request(app)
      .get('/api')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toEqual({ message: 'Email Domain Verifier API' });
  });
});

describe('GET /api/emojis', () => {
  it('keeps the starter example route', async () => {
    await request(app)
      .get('/api/emojis')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, ['😀', '😳', '🙄']);
  });
});

describe('GET /api/validate-email', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('requires an email query parameter', async () => {
    await request(app)
      .get('/api/validate-email')
      .expect(400, { success: false, error: 'Missing email parameter' });
  });

  it('rejects invalid syntax without a DNS lookup', async () => {
    const lookup = jest.spyOn(dns, 'resolveMx');
    const response = await request(app)
      .get('/api/validate-email')
      .query({ email: 'not-an-email' })
      .expect(200);

    expect(lookup).not.toHaveBeenCalled();
    expect(response.body).toMatchObject({
      formatValid: false,
      domainHasMx: false,
      isValid: false,
    });
  });

  it('accepts valid syntax when MX records exist', async () => {
    jest.spyOn(dns, 'resolveMx').mockResolvedValue([
      { exchange: 'mx2.example.com', priority: 20 },
      { exchange: 'mx1.example.com', priority: 10 },
    ]);
    const response = await request(app)
      .get('/api/validate-email')
      .query({ email: 'person@example.com' })
      .expect(200);

    expect(response.body).toMatchObject({
      domain: 'example.com',
      formatValid: true,
      domainHasMx: true,
      isValid: true,
    });
    expect(response.body.mxRecords[0].priority).toBe(10);
  });

  it('rejects a domain with no MX records', async () => {
    const error = Object.assign(new Error('not found'), { code: 'ENOTFOUND' });
    jest.spyOn(dns, 'resolveMx').mockRejectedValue(error);
    const response = await request(app)
      .get('/api/validate-email')
      .query({ email: 'person@does-not-exist.invalid' })
      .expect(200);

    expect(response.body).toMatchObject({
      formatValid: true,
      domainHasMx: false,
      isValid: false,
    });
  });
});

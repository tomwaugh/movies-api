const app = require('../src/app');
const supertest = require('supertest');
const request = supertest(app);

describe('Get endpoint with simple query', () => {
  it('Should return 200', async done => {
    const res = await request.get('/api/v1/suggestions?q=a');
    expect(res.status).toBe(200);
    done();
  })
});

describe('Get endpoint with malformed sortBy', () => {
  it('Should return 400 and an error message', async done => {
    const res = await request.get('/api/v1/suggestions?q=a&sortBy=foo');
    expect(res.statusCode).toEqual(400);
    expect(res.body.error).toBeDefined();
    done();
  })
});

describe('Get invalid endpoint', () => {
  it('Should return 404 and and an error message', async done => {
    const res = await request.get('/');
    expect(res.status).toBe(404);
    expect(res.body.error).toBeDefined();
    done();
  })
});


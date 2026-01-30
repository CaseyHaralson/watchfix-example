import { describe, it, expect } from 'vitest';
import request from 'supertest';
import express from 'express';
import usersRouter from '../src/routes/users.js';

const app = express();
app.use(express.json());
app.use('/api/users', usersRouter);

describe('Users API', () => {
  it('should return all users', async () => {
    const res = await request(app).get('/api/users');
    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should return a specific user', async () => {
    const res = await request(app).get('/api/users/1');
    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Alice Johnson');
  });

  it('should return 404 for non-existent user', async () => {
    // This test will fail until the bug is fixed
    // Currently the route crashes instead of returning 404
    const res = await request(app).get('/api/users/999');
    expect(res.status).toBe(404);
  });
});

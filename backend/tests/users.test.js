import { describe, it, expect } from 'vitest';
import request from 'supertest';
import express from 'express';
import usersRouter from '../src/routes/users.js';

const app = express();
app.use(express.json());
app.use('/api/users', usersRouter);

// Error handler to prevent unhandled errors from crashing tests
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});

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
    expect(res.body.email).toBe('alice@example.com');
  });

  it('should return user 2 correctly', async () => {
    const res = await request(app).get('/api/users/2');
    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Bob Smith');
  });
});
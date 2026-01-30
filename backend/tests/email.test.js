import { describe, it, expect } from 'vitest';
import request from 'supertest';
import express from 'express';
import emailRouter from '../src/routes/email.js';

const app = express();
app.use(express.json());
app.use('/api/email', emailRouter);

// Error handler to prevent unhandled errors from crashing tests
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});

describe('Email API', () => {
  it('should return 404 for non-existent user', async () => {
    const res = await request(app).post('/api/email/send-welcome/999');
    expect(res.status).toBe(404);
    expect(res.body.error).toBe('User not found');
  });

  it('should return 404 for invalid user id', async () => {
    const res = await request(app).post('/api/email/send-welcome/0');
    expect(res.status).toBe(404);
  });

  it('should accept request for valid user', async () => {
    // Note: This triggers the fire-and-forget email send
    // We only test that the endpoint responds, not that email succeeds
    const res = await request(app).post('/api/email/send-welcome/1');
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Welcome email queued');
  });
});
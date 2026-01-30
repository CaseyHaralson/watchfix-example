import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import express from 'express';
import emailRouter from '../src/routes/email.js';

const app = express();
app.use(express.json());
app.use('/api/email', emailRouter);

// Error handler to catch errors
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});

describe('Email API', () => {
  it('should return 404 for non-existent user', async () => {
    const res = await request(app).post('/api/email/send-welcome/999');
    expect(res.status).toBe(404);
  });

  it('should handle email sending errors gracefully', async () => {
    // Listen for unhandled rejections during this test
    // This test verifies that the promise rejection is handled
    let unhandledRejection = false;
    const handler = () => { unhandledRejection = true; };
    process.on('unhandledRejection', handler);

    const res = await request(app).post('/api/email/send-welcome/1');
    
    // Give time for any unhandled rejection to surface
    await new Promise(resolve => setTimeout(resolve, 200));
    
    process.off('unhandledRejection', handler);
    
    // This assertion will fail until the bug is fixed
    // The promise rejection should be caught, not left unhandled
    expect(unhandledRejection).toBe(false);
  });
});

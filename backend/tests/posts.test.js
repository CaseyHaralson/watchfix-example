import { describe, it, expect } from 'vitest';
import request from 'supertest';
import express from 'express';
import postsRouter from '../src/routes/posts.js';

const app = express();
app.use(express.json());
app.use('/api/posts', postsRouter);

// Error handler to prevent unhandled errors from crashing tests
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});

describe('Posts API', () => {
  it('should return all posts', async () => {
    const res = await request(app).get('/api/posts');
    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should have correct post structure in list', async () => {
    const res = await request(app).get('/api/posts');
    expect(res.status).toBe(200);
    expect(res.body[0]).toHaveProperty('id');
    expect(res.body[0]).toHaveProperty('title');
    expect(res.body[0]).toHaveProperty('authorId');
  });

  it('should include expected posts in list', async () => {
    const res = await request(app).get('/api/posts');
    const titles = res.body.map(p => p.title);
    expect(titles).toContain('Getting Started with Node.js');
    expect(titles).toContain('React Best Practices');
  });
});
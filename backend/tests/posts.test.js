import { describe, it, expect } from 'vitest';
import request from 'supertest';
import express from 'express';
import postsRouter from '../src/routes/posts.js';

const app = express();
app.use(express.json());
app.use('/api/posts', postsRouter);

describe('Posts API', () => {
  it('should return all posts', async () => {
    const res = await request(app).get('/api/posts');
    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should return a specific post with author', async () => {
    // This test will fail until the bug is fixed
    // Currently fails because string "1" !== number 1
    const res = await request(app).get('/api/posts/1');
    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Getting Started with Node.js');
    expect(res.body.author).toBe('Alice Johnson');
  });

  it('should return 404 for non-existent post', async () => {
    const res = await request(app).get('/api/posts/999');
    expect(res.status).toBe(404);
  });
});

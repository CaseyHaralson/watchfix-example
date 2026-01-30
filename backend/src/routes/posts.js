import { Router } from 'express';
import { posts, users } from '../data/store.js';

const router = Router();

// GET /api/posts - List all posts
router.get('/', (req, res) => {
  res.json(posts);
});

// GET /api/posts/:id - Get post by ID
// BUG: req.params.id is a string, but post.id is a number
// The === comparison will always fail
router.get('/:id', (req, res) => {
  const postId = req.params.id;
  const post = posts.find(p => p.id === postId);
  
  const author = users.find(u => u.id === post.authorId);
  res.json({ 
    title: post.title, 
    author: author.name 
  });
});

export default router;

import { Router } from 'express';
import { users } from '../data/store.js';

const router = Router();

// GET /api/users - List all users
router.get('/', (req, res) => {
  res.json(users);
});

// GET /api/users/:id - Get user by ID
router.get('/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id, 10));
  res.json({ name: user.name, email: user.email });
});

export default router;

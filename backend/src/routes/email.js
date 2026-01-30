import { Router } from 'express';
import { users } from '../data/store.js';

const router = Router();

// Simulated email service that randomly fails
async function sendEmail(to, subject, body) {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // Simulate a failure (always fails for demo purposes)
  throw new Error('ECONNREFUSED: Connection refused to email service at 127.0.0.1:587');
}

// POST /api/send-welcome/:userId - Send welcome email
// BUG: Unhandled promise rejection - sendEmail is called without await or .catch()
router.post('/send-welcome/:userId', (req, res) => {
  const userId = parseInt(req.params.userId, 10);
  const user = users.find(u => u.id === userId);
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  // Fire and forget - but the promise rejection is unhandled!
  sendEmail(user.email, 'Welcome!', `Hello ${user.name}, welcome to our platform!`);
  
  res.json({ message: 'Welcome email queued' });
});

export default router;

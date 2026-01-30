import express from 'express';
import cors from 'cors';
import usersRouter from './routes/users.js';
import postsRouter from './routes/posts.js';
import emailRouter from './routes/email.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
  next();
});

// API Routes
app.use('/api/users', usersRouter);
app.use('/api/posts', postsRouter);
app.use('/api/email', emailRouter);

// Frontend error reporting endpoint
// Frontend errors are POSTed here and logged to stdout
// This mimics production error reporting (like Sentry)
app.post('/api/log-error', (req, res) => {
  const { message, stack, componentStack } = req.body;
  console.error(`[FRONTEND ERROR] ${message}`);
  if (stack) {
    console.error(stack);
  }
  if (componentStack) {
    console.error('Component Stack:', componentStack);
  }
  res.sendStatus(200);
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(`Error: ${err.message}`);
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('UnhandledPromiseRejection:', reason);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend server running on http://0.0.0.0:${PORT}`);
});

export default app;

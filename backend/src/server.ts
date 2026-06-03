import express from 'express';
import 'express-async-errors';
import mongoose from 'mongoose';
import { env } from './config/env.js';
import { connectDB } from './config/database.js';
import { errorHandler, corsMiddleware } from './middleware/index.js';

import workflowRoutes from './routes/workflows.js';
import executionRoutes from './routes/executions.js';
import logRoutes from './routes/logs.js';
import portfolioRoutes from './routes/portfolio.js';

const app = express();

// Middleware
app.use(corsMiddleware);
app.use(express.json());

// Routes
app.use('/api/workflows', workflowRoutes);
app.use('/api/executions', executionRoutes);
app.use('/api/logs', logRoutes);
app.use('/api/portfolio', portfolioRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handler (must be last)
app.use(errorHandler);

// Start server
async function startServer(): Promise<void> {
  try {
    await connectDB();

    // Keep-alive ping to MongoDB to prevent sleep on Railway free tiers
    setInterval(async () => {
      try {
        if (mongoose.connection.readyState === 1 && mongoose.connection.db) {
          await mongoose.connection.db.admin().ping();
        }
      } catch (err) {
        console.error('Database keep-alive ping failed:', err);
      }
    }, 4 * 60 * 1000); // Ping every 4 minutes (sleep starts after 5-10m)

    app.listen(env.PORT, () => {
      console.log(`Server running on http://localhost:${env.PORT}`);
      console.log(`Environment: ${env.NODE_ENV}`);
      console.log(`MongoDB: ${env.MONGODB_URI}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

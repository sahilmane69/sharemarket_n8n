import dotenv from 'dotenv';

dotenv.config();

export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '5000', 10),
  API_URL: process.env.API_URL || 'http://localhost:5000',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
  MONGODB_URI: process.env.MONGODB_URI || process.env.MONGO_URL || process.env.MONGODB_URL || 'mongodb://localhost:27017/workflow_automation',
  EXECUTION_TIMEOUT: parseInt(process.env.EXECUTION_TIMEOUT || '300000', 10),
  MAX_RETRIES: parseInt(process.env.MAX_RETRIES || '3', 10),
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
  ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY || '',
};

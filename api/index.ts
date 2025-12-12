/**
 * Vercel deploy entry handler, for serverless deployment, please don't modify this file
 */
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createServer } from '@vercel/node';
import app from './app.js';

// Create Vercel serverless handler from Express app
export default createServer(app);
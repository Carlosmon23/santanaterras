/**
 * Vercel deploy entry handler, for serverless deployment, please don't modify this file
 */
import type { VercelRequest, VercelResponse } from '@vercel/node';
import app from './app.js';

// Vercel serverless handler - Express app can be used directly
export default function handler(req: VercelRequest, res: VercelResponse) {
  // Express app can handle Vercel request/response directly
  return (app as any)(req, res);
}
import app from '../server.js';

export default async (req: any, res: any) => {
  try {
    return app(req, res);
  } catch (error: any) {
    console.error('Serverless function error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message || String(error) });
  }
};

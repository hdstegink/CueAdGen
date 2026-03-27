export default async (req: any, res: any) => {
  try {
    const { default: app } = await import('../server.js');
    return app(req, res);
  } catch (error: any) {
    console.error('Failed to load server module:', error);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ 
      error: 'Server module failed to load'
    }));
  }
};

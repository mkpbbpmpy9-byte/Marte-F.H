import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import path from 'path';

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  // JSON and URL-encoded body parsing with 50mb limit to handle high-resolution photos
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // Ensure persistent directories exist on disk
  const uploadsDir = path.resolve(process.cwd(), 'public/uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const dataDir = path.resolve(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  const storageFilePath = path.join(dataDir, 'portfolio-state.json');

  // Serve uploaded images statically
  app.use('/uploads', express.static(uploadsDir, {
    maxAge: '7d',
    immutable: true,
  }));

  // API: Health check
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // API: Upload an image file directly to disk
  // Accepts a base64 dataUrl or binary buffer, writes to public/uploads, and returns the persistent static URL.
  app.post('/api/upload', (req: Request, res: Response) => {
    try {
      const { dataUrl, filename } = req.body;
      if (!dataUrl || typeof dataUrl !== 'string') {
        return res.status(400).json({ error: 'Missing or invalid dataUrl' });
      }

      // Check if it's a data URL
      const matches = dataUrl.match(/^data:([A-Za-z0-9-+/]+);base64,(.+)$/);
      if (!matches || matches.length !== 3) {
        return res.status(400).json({ error: 'Invalid base64 data URL format' });
      }

      const mimeType = matches[1];
      const base64Data = matches[2];
      const buffer = Buffer.from(base64Data, 'base64');

      let ext = 'jpg';
      if (mimeType.includes('png')) ext = 'png';
      else if (mimeType.includes('webp')) ext = 'webp';
      else if (mimeType.includes('svg')) ext = 'svg';
      else if (mimeType.includes('gif')) ext = 'gif';
      else if (mimeType.includes('avif')) ext = 'avif';

      const cleanName = (filename || 'photo')
        .replace(/\.[^/.]+$/, '')
        .replace(/[^a-zA-Z0-9_-]/g, '_')
        .slice(0, 32);

      const uniqueFilename = `${cleanName}-${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
      const filePath = path.join(uploadsDir, uniqueFilename);

      fs.writeFileSync(filePath, buffer);

      const fileUrl = `/uploads/${uniqueFilename}`;
      console.log(`[Upload] Image saved successfully to disk: ${filePath} (${buffer.length} bytes) -> ${fileUrl}`);
      return res.json({ url: fileUrl, success: true, size: buffer.length });
    } catch (err: any) {
      console.error('[Upload] Error saving image to disk:', err);
      return res.status(500).json({ error: err.message || 'Failed to save image' });
    }
  });

  // API: Get portfolio state from disk
  app.get('/api/portfolio', (_req: Request, res: Response) => {
    try {
      if (fs.existsSync(storageFilePath)) {
        const raw = fs.readFileSync(storageFilePath, 'utf-8');
        const data = JSON.parse(raw);
        return res.json({ data, source: 'disk' });
      }
      return res.json({ data: null, source: 'none' });
    } catch (err: any) {
      console.error('[Portfolio] Error reading portfolio state:', err);
      return res.status(500).json({ error: 'Failed to read portfolio state' });
    }
  });

  // API: Save portfolio state to disk
  app.post('/api/portfolio', (req: Request, res: Response) => {
    try {
      const { data } = req.body;
      if (!data) {
        return res.status(400).json({ error: 'No data provided in request body' });
      }
      fs.writeFileSync(storageFilePath, JSON.stringify(data, null, 2), 'utf-8');
      console.log(`[Portfolio] Portfolio state successfully written to ${storageFilePath}`);
      return res.json({ success: true, timestamp: Date.now() });
    } catch (err: any) {
      console.error('[Portfolio] Error writing portfolio state:', err);
      return res.status(500).json({ error: 'Failed to save portfolio state' });
    }
  });

  // API: Reset portfolio state on disk
  app.post('/api/reset-portfolio', (_req: Request, res: Response) => {
    try {
      if (fs.existsSync(storageFilePath)) {
        fs.unlinkSync(storageFilePath);
      }
      return res.json({ success: true, message: 'Portfolio state reset on disk' });
    } catch (err: any) {
      console.error('[Portfolio] Error resetting portfolio state:', err);
      return res.status(500).json({ error: 'Failed to reset portfolio state' });
    }
  });

  // Development vs Production serving
  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(process.cwd(), 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(process.cwd(), 'dist/index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Portfolio server running at http://0.0.0.0:${PORT} [${isProd ? 'production' : 'development'}]`);
  });
}

startServer().catch((err) => {
  console.error('Fatal error starting server:', err);
  process.exit(1);
});

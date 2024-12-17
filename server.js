import fs from 'node:fs/promises'; // NodeJS async file system module
import express from 'express'; // Express is NodeJS library for building API

/**
 * This file sets up a NodeJS Express server to handle SSR for a React application.
 * Dynamically selects the appropriate SSR render function and template based on the environment.
 */

// Constants
const isProduction = process.env.NODE_ENV === 'production';
const port = process.env.PORT || 5173;
const base = process.env.BASE || '/';

// Cached production assets
let templateHtml = '';
let ssrManifest;

if (isProduction) {
  try {
    templateHtml = await fs.readFile('./dist/client/index.html', 'utf-8');
    ssrManifest = JSON.parse(
      await fs.readFile('./dist/client/.vite/ssr-manifest.json', 'utf-8')
    );
  } catch (e) {
    console.error('Failed to load production assets:', e);
    process.exit(1);
  }
}

// Create the HTTP server
const app = express();

// Middleware setup
let vite;
if (!isProduction) {
  // Development environment: Use Vite's middleware
  const { createServer } = await import('vite');
  vite = await createServer({
    server: { middlewareMode: true },
    appType: 'custom',
    base,
  });
  app.use(vite.middlewares);

  // Custom middleware for error handling in development
  app.use(async (req, res, next) => {
    try {
      next();
    } catch (error) {
      const statusCode = error.status || 500;
      const html = await vite.transformIndexHtml(
        req.url,
        `<h1>${statusCode} Error</h1>`
      );
      res.status(statusCode).set({ 'Content-Type': 'text/html' }).end(html);
    }
  });
} else {
  // Production environment: Serve static files and compression
  const compression = (await import('compression')).default;
  const sirv = (await import('sirv')).default;

  app.use(compression());
  app.use(base, sirv('./dist/client', { extensions: [] }));
}

// Serve HTML for all routes
app.use('*', async (req, res) => {
  try {
    const url = req.originalUrl.replace(base, '');

    let template;
    let render;

    if (!isProduction) {
      // Development: Fetch fresh template and SSR module
      template = await fs.readFile('./index.html', 'utf-8');
      template = await vite.transformIndexHtml(url, template);
      render = (await vite.ssrLoadModule('/src/entry-server.tsx')).render;
    } else {
      // Production: Use cached assets
      template = templateHtml;
      render = (await import('./dist/server/entry-server.js')).render;
    }

    const rendered = await render(url, ssrManifest);

    const html = template
      .replace(`<!--app-head-->`, rendered.head ?? '')
      .replace(`<!--app-html-->`, rendered.html ?? '');

    res.status(200).set({ 'Content-Type': 'text/html' }).send(html);
  } catch (e) {
    vite?.ssrFixStacktrace(e);
    console.error('Error during rendering:', e.stack);
    res.status(500).end('Internal Server Error');
  }
});

// Start HTTP server
app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});

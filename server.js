import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Health check endpoint (for Render / UptimeRobot cronjob)
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Your API is running',
        timestamp: new Date().toISOString()
    });
});

// Serve static files from dist/
app.use(express.static(join(__dirname, 'dist'), {
    maxAge: '1y',
    immutable: true,
}));

// Service worker should not be cached
app.get('/sw.js', (req, res) => {
    res.set('Cache-Control', 'no-cache');
    res.sendFile(join(__dirname, 'dist', 'sw.js'));
});

// SPA fallback — serve index.html for all non-file routes
app.use((req, res, next) => {
    if (req.path.includes('.')) return next();
    res.sendFile(join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`[CodArch] Production server running at http://localhost:${PORT}`);
});

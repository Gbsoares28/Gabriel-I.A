import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { storage } from './server/storage.js';
import { processConsultation } from './server/aiConsultant.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

app.use(express.json());

// Admin auth helper
const ADMIN_SECRET = '100130';
function checkAdminAuth(req: express.Request): boolean {
  const token = req.headers['x-admin-token'];
  return token === ADMIN_SECRET || token === 'admin-authenticated-token';
}

// === API ROUTES ===

// 1. Config
app.get('/api/config', (req, res) => {
  res.json(storage.getConfig());
});

app.get('/api/admin/config', (req, res) => {
  if (!checkAdminAuth(req)) {
    return res.status(401).json({ error: 'Não autorizado' });
  }
  res.json(storage.getConfig());
});

app.post('/api/admin/config', (req, res) => {
  if (!checkAdminAuth(req)) {
    return res.status(401).json({ error: 'Não autorizado' });
  }
  const updated = storage.updateConfig(req.body);
  res.json(updated);
});

// Admin login
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_SECRET) {
    res.json({ success: true, token: 'admin-authenticated-token' });
  } else {
    res.status(401).json({ success: false, message: 'Senha incorreta.' });
  }
});

// 2. Channels (The 7 Strategic Channels)
app.get('/api/channels', (req, res) => {
  const onlyActive = req.query.all !== 'true';
  const channels = storage.getChannels(onlyActive);
  res.json(channels);
});

app.post('/api/admin/channels', (req, res) => {
  if (!checkAdminAuth(req)) {
    return res.status(401).json({ error: 'Não autorizado' });
  }
  const saved = storage.saveChannels(req.body);
  res.json(saved);
});

app.put('/api/admin/channels/:id', (req, res) => {
  if (!checkAdminAuth(req)) {
    return res.status(401).json({ error: 'Não autorizado' });
  }
  const updated = storage.updateChannel(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Canal não encontrado' });
  res.json(updated);
});

// 3. Products
app.get('/api/products', (req, res) => {
  const onlyActive = req.query.all !== 'true';
  const products = storage.getProducts(onlyActive);
  res.json(products);
});

app.get('/api/products/:id', (req, res) => {
  const product = storage.getProductById(req.params.id);
  if (!product) return res.status(404).json({ error: 'Produto não encontrado' });
  res.json(product);
});

app.post('/api/products', (req, res) => {
  if (!checkAdminAuth(req)) {
    return res.status(401).json({ error: 'Não autorizado' });
  }
  const created = storage.createProduct(req.body);
  res.status(201).json(created);
});

app.put('/api/products/:id', (req, res) => {
  if (!checkAdminAuth(req)) {
    return res.status(401).json({ error: 'Não autorizado' });
  }
  const updated = storage.updateProduct(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Produto não encontrado' });
  res.json(updated);
});

app.delete('/api/products/:id', (req, res) => {
  if (!checkAdminAuth(req)) {
    return res.status(401).json({ error: 'Não autorizado' });
  }
  const success = storage.deleteProduct(req.params.id);
  res.json({ success });
});

app.post('/api/products/reset', (req, res) => {
  if (!checkAdminAuth(req)) {
    return res.status(401).json({ error: 'Não autorizado' });
  }
  const resetList = storage.resetProducts();
  res.json(resetList);
});

// 4. Testimonials ("O que dizem os clientes")
app.get('/api/testimonials', (req, res) => {
  const onlyAuth = req.query.all !== 'true';
  const testimonials = storage.getTestimonials(onlyAuth);
  res.json(testimonials);
});

app.post('/api/admin/testimonials', (req, res) => {
  if (!checkAdminAuth(req)) {
    return res.status(401).json({ error: 'Não autorizado' });
  }
  const saved = storage.saveTestimonials(req.body);
  res.json(saved);
});

// 5. Shortcuts
app.get('/api/shortcuts', (req, res) => {
  const shortcuts = storage.getShortcuts(true);
  res.json(shortcuts);
});

app.get('/api/admin/shortcuts', (req, res) => {
  if (!checkAdminAuth(req)) {
    return res.status(401).json({ error: 'Não autorizado' });
  }
  const shortcuts = storage.getShortcuts(false);
  res.json(shortcuts);
});

app.post('/api/admin/shortcuts', (req, res) => {
  if (!checkAdminAuth(req)) {
    return res.status(401).json({ error: 'Não autorizado' });
  }
  const saved = storage.saveShortcuts(req.body);
  res.json(saved);
});

// 6. Analytics
app.post('/api/analytics/event', (req, res) => {
  const { type, sessionId, metadata } = req.body;
  if (!type || !sessionId) {
    return res.status(400).json({ error: 'Dados incompletos para evento analítico' });
  }
  const recorded = storage.recordEvent({ type, sessionId, metadata });
  res.json({ success: true, eventId: recorded.id });
});

app.get('/api/admin/analytics', (req, res) => {
  if (!checkAdminAuth(req)) {
    return res.status(401).json({ error: 'Não autorizado' });
  }
  const stats = storage.getAnalytics();
  res.json(stats);
});

// 7. AI Consultation Endpoint
app.post('/api/consult', async (req, res) => {
  try {
    const { messages, sessionId } = req.body;
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Histórico de mensagens é obrigatório' });
    }

    const config = storage.getConfig();
    const activeChannels = storage.getChannels(true);
    const activeProducts = storage.getProducts(true);

    const result = await processConsultation(messages, config, activeChannels, activeProducts);

    // Track analytics event automatically
    if (result.status === 'recommendation' && result.recommendation) {
      storage.recordEvent({
        type: 'recommendation_viewed',
        sessionId: sessionId || 'anon',
        metadata: {
          channelId: result.recommendation.recommendedChannelId,
          channelName: result.recommendation.channel?.title,
          productId: result.recommendation.primaryProductId,
          productName: result.recommendation.primaryProduct?.name,
          category: result.recommendation.problemCategory,
          query: messages[messages.length - 1]?.content
        }
      });
    }

    res.json(result);
  } catch (err: any) {
    console.error('Error in /api/consult:', err);
    res.status(500).json({
      status: 'error',
      message: 'Ocorreu uma instabilidade momentânea na análise. Por favor, tente novamente.',
      error: err.message
    });
  }
});

// Check AI status
app.get('/api/ai/status', (req, res) => {
  const hasKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY');
  res.json({
    geminiConfigured: hasKey,
    model: 'gemini-3.8-flash',
    fallbackEngineReady: true
  });
});

// Vite Integration
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true'
      },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

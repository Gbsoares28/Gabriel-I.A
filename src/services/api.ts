import { ChannelItem, Product, Shortcut, AiConfig, Testimonial, AnalyticsStats, ChatMessage } from '../types.js';

const ADMIN_STORAGE_KEY = 'consultor_admin_token';
const SESSION_STORAGE_KEY = 'consultor_session_id';

export function getSessionId(): string {
  let sessionId = sessionStorage.getItem(SESSION_STORAGE_KEY);
  if (!sessionId) {
    sessionId = 'sess_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now().toString(36);
    sessionStorage.setItem(SESSION_STORAGE_KEY, sessionId);
  }
  return sessionId;
}

export function getAdminToken(): string | null {
  return localStorage.getItem(ADMIN_STORAGE_KEY);
}

export function setAdminToken(token: string | null) {
  if (token) {
    localStorage.setItem(ADMIN_STORAGE_KEY, token);
  } else {
    localStorage.removeItem(ADMIN_STORAGE_KEY);
  }
}

// 1. Config
export async function fetchPublicConfig(): Promise<AiConfig> {
  const res = await fetch('/api/config');
  if (!res.ok) throw new Error('Falha ao carregar configurações');
  return res.json();
}

export async function fetchAdminConfig(): Promise<AiConfig> {
  const token = getAdminToken();
  const res = await fetch('/api/admin/config', {
    headers: { 'x-admin-token': token || '' }
  });
  if (!res.ok) throw new Error('Não autorizado');
  return res.json();
}

export async function updateAdminConfig(config: Partial<AiConfig>): Promise<AiConfig> {
  const token = getAdminToken();
  const res = await fetch('/api/admin/config', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-token': token || ''
    },
    body: JSON.stringify(config)
  });
  if (!res.ok) throw new Error('Falha ao salvar configurações');
  return res.json();
}

export async function adminLogin(password: string): Promise<{ success: boolean; token?: string; message?: string }> {
  const res = await fetch('/api/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password })
  });
  const data = await res.json();
  if (data.success && data.token) {
    setAdminToken(data.token);
  }
  return data;
}

// 2. Channels (The 7 Strategic Channels)
export async function fetchChannels(all = false): Promise<ChannelItem[]> {
  const res = await fetch(`/api/channels${all ? '?all=true' : ''}`);
  if (!res.ok) throw new Error('Falha ao buscar canais');
  return res.json();
}

export async function saveChannels(channels: ChannelItem[]): Promise<ChannelItem[]> {
  const token = getAdminToken();
  const res = await fetch('/api/admin/channels', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-token': token || ''
    },
    body: JSON.stringify(channels)
  });
  if (!res.ok) throw new Error('Falha ao salvar canais');
  return res.json();
}

export async function updateChannel(id: string, updates: Partial<ChannelItem>): Promise<ChannelItem> {
  const token = getAdminToken();
  const res = await fetch(`/api/admin/channels/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-token': token || ''
    },
    body: JSON.stringify(updates)
  });
  if (!res.ok) throw new Error('Falha ao atualizar canal');
  return res.json();
}

// 3. Products
export async function fetchProducts(all = false): Promise<Product[]> {
  const res = await fetch(`/api/products${all ? '?all=true' : ''}`);
  if (!res.ok) throw new Error('Falha ao buscar produtos');
  return res.json();
}

export async function createProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
  const token = getAdminToken();
  const res = await fetch('/api/products', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-token': token || ''
    },
    body: JSON.stringify(product)
  });
  if (!res.ok) throw new Error('Falha ao criar produto');
  return res.json();
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
  const token = getAdminToken();
  const res = await fetch(`/api/products/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-token': token || ''
    },
    body: JSON.stringify(updates)
  });
  if (!res.ok) throw new Error('Falha ao atualizar produto');
  return res.json();
}

export async function deleteProduct(id: string): Promise<boolean> {
  const token = getAdminToken();
  const res = await fetch(`/api/products/${id}`, {
    method: 'DELETE',
    headers: { 'x-admin-token': token || '' }
  });
  if (!res.ok) throw new Error('Falha ao excluir produto');
  const data = await res.json();
  return data.success;
}

export async function resetProducts(): Promise<Product[]> {
  const token = getAdminToken();
  const res = await fetch('/api/products/reset', {
    method: 'POST',
    headers: { 'x-admin-token': token || '' }
  });
  if (!res.ok) throw new Error('Falha ao resetar produtos');
  return res.json();
}

// 4. Testimonials
export async function fetchTestimonials(all = false): Promise<Testimonial[]> {
  const res = await fetch(`/api/testimonials${all ? '?all=true' : ''}`);
  if (!res.ok) throw new Error('Falha ao buscar depoimentos');
  return res.json();
}

export async function saveTestimonials(testimonials: Testimonial[]): Promise<Testimonial[]> {
  const token = getAdminToken();
  const res = await fetch('/api/admin/testimonials', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-token': token || ''
    },
    body: JSON.stringify(testimonials)
  });
  if (!res.ok) throw new Error('Falha ao salvar depoimentos');
  return res.json();
}

// 5. Shortcuts
export async function fetchShortcuts(all = false): Promise<Shortcut[]> {
  const url = all ? '/api/admin/shortcuts' : '/api/shortcuts';
  const token = getAdminToken();
  const res = await fetch(url, {
    headers: all ? { 'x-admin-token': token || '' } : {}
  });
  if (!res.ok) throw new Error('Falha ao buscar atalhos');
  return res.json();
}

export async function saveShortcuts(shortcuts: Shortcut[]): Promise<Shortcut[]> {
  const token = getAdminToken();
  const res = await fetch('/api/admin/shortcuts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-token': token || ''
    },
    body: JSON.stringify(shortcuts)
  });
  if (!res.ok) throw new Error('Falha ao salvar atalhos');
  return res.json();
}

// 6. Analytics
export async function trackEvent(type: string, metadata: Record<string, any> = {}) {
  try {
    const sessionId = getSessionId();
    await fetch('/api/analytics/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, sessionId, metadata })
    });
  } catch (err) {
    console.debug('Analytics event dropped:', err);
  }
}

export async function trackChannelClick(channelId: string, channelName: string, targetUrl: string) {
  let specificType = 'channel_click';
  if (channelId === 'whatsapp') specificType = 'whatsapp_click';
  else if (channelId === 'petflow360') specificType = 'petflow_click';
  else if (channelId === 'mentoria') specificType = 'mentoria_click';

  await trackEvent(specificType, {
    channelId,
    channelName,
    targetUrl
  });
}

export async function fetchAnalytics(): Promise<AnalyticsStats> {
  const token = getAdminToken();
  const res = await fetch('/api/admin/analytics', {
    headers: { 'x-admin-token': token || '' }
  });
  if (!res.ok) throw new Error('Não autorizado');
  return res.json();
}

// 7. AI Consultation
export async function sendConsultation(messages: { role: 'user' | 'assistant'; content: string }[]) {
  const sessionId = getSessionId();
  const res = await fetch('/api/consult', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, sessionId })
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.message || 'Erro na consulta com a inteligência artificial');
  }
  return res.json();
}

export async function checkAiStatus(): Promise<{ geminiConfigured: boolean; model: string; fallbackEngineReady: boolean }> {
  const res = await fetch('/api/ai/status');
  return res.json();
}

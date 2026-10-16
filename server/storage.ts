import fs from 'fs';
import path from 'path';
import { ChannelItem, Product, Shortcut, AiConfig, Testimonial, AnalyticsEvent, AnalyticsStats } from '../src/types.js';
import { DEFAULT_CHANNELS, DEFAULT_PRODUCTS, DEFAULT_SHORTCUTS, DEFAULT_TESTIMONIALS, DEFAULT_AI_CONFIG } from './defaultData.js';

interface StoreData {
  channels: ChannelItem[];
  products: Product[];
  shortcuts: Shortcut[];
  testimonials: Testimonial[];
  config: AiConfig;
  events: AnalyticsEvent[];
}

const DATA_FILE = path.resolve(process.cwd(), 'data-store.json');

class StorageManager {
  private data: StoreData;

  constructor() {
    this.data = this.loadData();
  }

  private loadData(): StoreData {
    try {
      if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        return {
          channels: parsed.channels && parsed.channels.length > 0 ? parsed.channels : DEFAULT_CHANNELS,
          products: parsed.products && parsed.products.length > 0 ? parsed.products : DEFAULT_PRODUCTS,
          shortcuts: parsed.shortcuts && parsed.shortcuts.length > 0 ? parsed.shortcuts : DEFAULT_SHORTCUTS,
          testimonials: parsed.testimonials && parsed.testimonials.length > 0 ? parsed.testimonials : DEFAULT_TESTIMONIALS,
          config: parsed.config ? { ...DEFAULT_AI_CONFIG, ...parsed.config } : DEFAULT_AI_CONFIG,
          events: Array.isArray(parsed.events) ? parsed.events : []
        };
      }
    } catch (e) {
      console.warn('Could not read existing data store, initializing defaults:', e);
    }

    const initial: StoreData = {
      channels: DEFAULT_CHANNELS,
      products: DEFAULT_PRODUCTS,
      shortcuts: DEFAULT_SHORTCUTS,
      testimonials: DEFAULT_TESTIMONIALS,
      config: DEFAULT_AI_CONFIG,
      events: []
    };
    this.persist(initial);
    return initial;
  }

  private persist(dataToSave?: StoreData) {
    try {
      const data = dataToSave || this.data;
      fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (e) {
      console.error('Failed to persist data store:', e);
    }
  }

  // === CHANNELS ===
  getChannels(onlyActive = true): ChannelItem[] {
    const list = this.data.channels || DEFAULT_CHANNELS;
    if (onlyActive) {
      return list.filter(c => c.active).sort((a, b) => b.priority - a.priority);
    }
    return [...list];
  }

  getChannelById(id: string): ChannelItem | undefined {
    return (this.data.channels || DEFAULT_CHANNELS).find(c => c.id === id);
  }

  saveChannels(channels: ChannelItem[]): ChannelItem[] {
    this.data.channels = channels;
    this.persist();
    return this.data.channels;
  }

  updateChannel(id: string, updates: Partial<ChannelItem>): ChannelItem | null {
    const channels = this.data.channels || DEFAULT_CHANNELS;
    const index = channels.findIndex(c => c.id === id);
    if (index === -1) return null;
    channels[index] = { ...channels[index], ...updates };
    this.data.channels = channels;
    this.persist();
    return channels[index];
  }

  // === PRODUCTS ===
  getProducts(onlyActive = false): Product[] {
    if (onlyActive) {
      return this.data.products.filter(p => p.active);
    }
    return [...this.data.products];
  }

  getProductById(id: string): Product | undefined {
    return this.data.products.find(p => p.id === id);
  }

  createProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Product {
    const newProduct: Product = {
      ...product,
      id: 'prod-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 6),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.data.products.unshift(newProduct);
    this.persist();
    return newProduct;
  }

  updateProduct(id: string, updates: Partial<Product>): Product | null {
    const index = this.data.products.findIndex(p => p.id === id);
    if (index === -1) return null;
    this.data.products[index] = {
      ...this.data.products[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.persist();
    return this.data.products[index];
  }

  deleteProduct(id: string): boolean {
    const initialLen = this.data.products.length;
    this.data.products = this.data.products.filter(p => p.id !== id);
    if (this.data.products.length !== initialLen) {
      this.persist();
      return true;
    }
    return false;
  }

  resetProducts(): Product[] {
    this.data.products = [...DEFAULT_PRODUCTS];
    this.persist();
    return this.data.products;
  }

  // === TESTIMONIALS ===
  getTestimonials(onlyAuthorized = true): Testimonial[] {
    const list = this.data.testimonials || DEFAULT_TESTIMONIALS;
    if (onlyAuthorized) {
      return list.filter(t => t.authorized);
    }
    return [...list];
  }

  saveTestimonials(testimonials: Testimonial[]): Testimonial[] {
    this.data.testimonials = testimonials;
    this.persist();
    return this.data.testimonials;
  }

  // === SHORTCUTS ===
  getShortcuts(onlyActive = true): Shortcut[] {
    if (onlyActive) {
      return this.data.shortcuts.filter(s => s.active);
    }
    return [...this.data.shortcuts];
  }

  saveShortcuts(shortcuts: Shortcut[]): Shortcut[] {
    this.data.shortcuts = shortcuts;
    this.persist();
    return this.data.shortcuts;
  }

  // === CONFIG ===
  getConfig(): AiConfig {
    return { ...this.data.config };
  }

  updateConfig(updates: Partial<AiConfig>): AiConfig {
    this.data.config = {
      ...this.data.config,
      ...updates
    };
    this.persist();
    return this.data.config;
  }

  // === ANALYTICS ===
  recordEvent(event: Omit<AnalyticsEvent, 'id' | 'timestamp'>): AnalyticsEvent {
    const fullEvent: AnalyticsEvent = {
      ...event,
      id: 'evt-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 6),
      timestamp: Date.now()
    };

    this.data.events.push(fullEvent);
    if (this.data.events.length > 2000) {
      this.data.events = this.data.events.slice(-2000);
    }
    this.persist();
    return fullEvent;
  }

  getAnalytics(): AnalyticsStats {
    const events = this.data.events;
    const visits = events.filter(e => e.type === 'page_view').length;
    const chats = events.filter(e => e.type === 'chat_start').length;
    const recs = events.filter(e => e.type === 'recommendation_viewed').length;
    const waClicks = events.filter(e => e.type === 'whatsapp_click').length;
    const petflowClicks = events.filter(e => e.type === 'petflow_click').length;
    const mentoriaClicks = events.filter(e => e.type === 'mentoria_click').length;
    const prodClicks = events.filter(e => e.type === 'product_card_click' || e.type === 'product_link_click').length;
    const allClicks = waClicks + petflowClicks + mentoriaClicks + prodClicks;

    const categoryCounts: Record<string, number> = {};
    const problemCounts: Record<string, number> = {};
    const recommendedChannelCounts: Record<string, number> = {};
    const clickedChannelCounts: Record<string, number> = {};

    events.forEach(e => {
      if (e.metadata?.category) {
        categoryCounts[e.metadata.category] = (categoryCounts[e.metadata.category] || 0) + 1;
      }
      if (e.metadata?.query) {
        const querySnippet = e.metadata.query.trim().slice(0, 70);
        problemCounts[querySnippet] = (problemCounts[querySnippet] || 0) + 1;
      }
      if (e.type === 'recommendation_viewed' && e.metadata?.channelId) {
        recommendedChannelCounts[e.metadata.channelId] = (recommendedChannelCounts[e.metadata.channelId] || 0) + 1;
      }
      if ((e.type === 'channel_click' || e.type === 'whatsapp_click' || e.type === 'petflow_click' || e.type === 'mentoria_click') && e.metadata?.channelId) {
        clickedChannelCounts[e.metadata.channelId] = (clickedChannelCounts[e.metadata.channelId] || 0) + 1;
      }
    });

    const topCategories = Object.entries(categoryCounts)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);

    const topProblems = Object.entries(problemCounts)
      .map(([problem, count]) => ({ problem, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    const topChannelsRecommended = Object.entries(recommendedChannelCounts)
      .map(([channelId, count]) => {
        const ch = this.getChannelById(channelId);
        return {
          channelId,
          name: ch ? ch.title : channelId,
          count
        };
      })
      .sort((a, b) => b.count - a.count);

    const topChannelsClicked = Object.entries(clickedChannelCounts)
      .map(([channelId, count]) => {
        const ch = this.getChannelById(channelId);
        return {
          channelId,
          name: ch ? ch.title : channelId,
          count
        };
      })
      .sort((a, b) => b.count - a.count);

    const effectiveVisits = Math.max(visits, 1);
    const effectiveChats = Math.max(chats, 1);

    return {
      totalVisits: visits,
      totalConversationsStarted: chats,
      totalRecommendationsGiven: recs,
      totalWhatsAppClicks: waClicks,
      totalPetFlowClicks: petflowClicks,
      totalMentoriaClicks: mentoriaClicks,
      totalProductClicks: prodClicks,
      funnel: {
        visits,
        conversations: chats,
        recommendations: recs,
        clicks: allClicks,
        startConversionRate: Math.min(100, Math.round((chats / effectiveVisits) * 100)),
        recommendationRate: Math.min(100, Math.round((recs / effectiveChats) * 100)),
        clickThroughRate: Math.min(100, Math.round((allClicks / Math.max(recs, 1)) * 100))
      },
      topCategories,
      topProblems,
      topChannelsRecommended,
      topChannelsClicked,
      recentEvents: events.slice(-30).reverse()
    };
  }
}

export const storage = new StorageManager();

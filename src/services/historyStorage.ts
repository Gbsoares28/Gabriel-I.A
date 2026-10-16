import { ConsultationSession, ChatMessage } from '../types.js';

const HISTORY_STORAGE_KEY = 'consultor_user_history_v1';

export function getConsultationHistory(): ConsultationSession[] {
  try {
    const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.sort((a, b) => b.updatedAt - a.updatedAt);
    }
  } catch (err) {
    console.warn('Failed to parse consultation history:', err);
  }
  return [];
}

export function saveConsultationSession(session: ConsultationSession) {
  try {
    const history = getConsultationHistory();
    const existingIndex = history.findIndex(s => s.id === session.id);

    if (existingIndex >= 0) {
      history[existingIndex] = {
        ...history[existingIndex],
        ...session,
        updatedAt: Date.now()
      };
    } else {
      history.unshift({
        ...session,
        updatedAt: Date.now()
      });
    }

    const trimmed = history.slice(0, 50);
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(trimmed));
  } catch (err) {
    console.warn('Failed to save consultation session:', err);
  }
}

export function deleteConsultationSession(id: string): ConsultationSession[] {
  try {
    const history = getConsultationHistory().filter(s => s.id !== id);
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
    return history;
  } catch (err) {
    console.warn('Failed to delete consultation session:', err);
    return getConsultationHistory();
  }
}

export function clearAllConsultationHistory() {
  try {
    localStorage.removeItem(HISTORY_STORAGE_KEY);
  } catch (err) {
    console.warn('Failed to clear consultation history:', err);
  }
}

export function generateSessionTitle(prompt: string): string {
  const cleaned = prompt.replace(/\s+/g, ' ').trim();
  if (cleaned.length <= 48) return cleaned;
  return cleaned.slice(0, 48) + '...';
}

export function extractSessionSummary(messages: ChatMessage[]) {
  const userFirstMsg = messages.find(m => m.role === 'user');
  const aiRecMsg = [...messages].reverse().find(m => m.recommendation);

  const title = userFirstMsg ? generateSessionTitle(userFirstMsg.content) : 'Nova Consulta';
  const rec = aiRecMsg?.recommendation;

  return {
    title,
    identifiedNeed: rec?.identifiedNeed,
    problemCategory: rec?.problemCategory,
    recommendedChannel: rec?.channel
      ? {
          id: rec.channel.id,
          title: rec.channel.title
        }
      : undefined,
    recommendedProduct: rec?.primaryProduct
      ? {
          id: rec.primaryProduct.id,
          name: rec.primaryProduct.name,
          category: rec.primaryProduct.category,
          species: rec.primaryProduct.species,
          price: rec.primaryProduct.price,
          officialLink: rec.primaryProduct.officialLink,
          imageUrl: rec.primaryProduct.imageUrl
        }
      : undefined
  };
}

export type PetSpecies = 'Cão' | 'Gato' | 'Cão e Gato';

export interface ChannelItem {
  id: string; // 'whatsapp' | 'petflow360' | 'mentoria' | 'produtos' | 'youtube' | 'facebook' | 'instagram'
  title: string;
  subtitle?: string;
  callout: string;
  description: string;
  buttonText: string;
  link: string;
  badge?: string;
  iconName?: string;
  active: boolean;
  priority: number;
}

export interface Product {
  id: string;
  name: string;
  category: 'Enriquecimento Ambiental' | 'Equipamentos de Passeio' | 'Treinamento & Adestramento' | 'Higiene & Bem-estar' | 'Alimentação & Petiscos';
  species: PetSpecies;
  badge?: string;
  description: string;
  usageIndication: string;
  safetyNotes: string;
  price?: string;
  officialLink: string;
  imageUrl: string;
  affiliateNotice?: string;
  keywords: string[];
  priority: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Testimonial {
  id: string;
  authorName: string;
  petInfo: string; // e.g. "Tutora do Thor (Golden Retriever, 2 anos)"
  quote: string;
  photoUrl?: string;
  context?: string; // e.g. "Reatividade no passeio e ansiedade de separação"
  rating?: number; // e.g. 5
  publishedAt?: string; // e.g. "Há 2 semanas"
  highlight?: string; // e.g. "Ótimo preço", "Preço razoável"
  service?: string; // e.g. "Adestramento de cães"
  authorized: boolean;
}

export interface Shortcut {
  id: string;
  label: string;
  prompt: string;
  category: string;
  iconName?: string;
  active: boolean;
}

export interface AiConfig {
  companyName: string;
  consultantName: string;
  experienceYears: number;
  consultantTone: string;
  greetingTitle: string;
  greetingSubtitle: string;
  inputPlaceholder: string;
  systemInstructions: string;
  contactEmail: string;
  contactWhatsapp: string;
  whatsappDefaultMessage: string;
  instagramUrl: string;
  youtubeUrl: string;
  facebookUrl: string;
  petflowUrl: string;
}

export interface SolutionOption {
  id: string;
  order: number;
  title: string;
  subtitle?: string;
  description: string;
  buttonText: string;
  link: string;
  badge?: string;
  isPrimary?: boolean;
  variant?: 'whatsapp' | 'petflow' | 'youtube' | 'pdf' | 'mentoria' | 'toy';
  iconName?: string;
}

export interface RecommendationResult {
  explanation: string;
  identifiedNeed: string;
  problemCategory: string; // e.g. "Comportamento Canino", "Comportamento Felino", "Treinamento em Casa", "Mentoria Profissional", etc.
  recommendedChannelId?: string; // 'whatsapp' | 'petflow360' | 'mentoria' | 'produtos' | 'youtube' | 'instagram'
  channel?: ChannelItem;
  structuredSolutions?: SolutionOption[];
  primaryProductId?: string;
  primaryProduct?: Product;
  alternativeProductIds?: string[];
  alternativeProducts?: Product[];
  secondaryChannelId?: string;
  secondaryChannel?: ChannelItem;
  followUpOptions: string[];
  requiresVeterinaryNotice?: boolean;
}

export interface AnimalInfo {
  name?: string;
  age?: string;
  species?: 'Cão' | 'Gato' | 'Outro';
  breed?: string;
  size?: string;
}

export interface PreAttendanceCase {
  species?: 'Gatos' | 'Cães' | 'Outro';
  animals: AnimalInfo[];
  primaryProblem?: string;
  behaviorDetails?: string;
  onsetOrDuration?: string;
  householdContext?: string;
  neighborhood?: string;
  city?: string;
  missingInformation: string[];
  conversationSummary?: string;
  confirmationStatus: 'none' | 'pending' | 'confirmed' | 'correcting';
  contactReady: boolean;
  step: 'questioning' | 'awaiting_neighborhood' | 'awaiting_confirmation' | 'ready_for_whatsapp' | 'immediate_contact';
  prefilledWhatsAppMessage?: string;
  whatsappUrl?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  status?: 'clarification' | 'recommendation' | 'no_match' | 'general' | 'pre_attendance' | 'summary_confirmation' | 'ready_for_whatsapp';
  quickOptions?: string[];
  recommendation?: RecommendationResult;
  preAttendanceCase?: PreAttendanceCase;
  whatsappButton?: {
    text: string;
    url: string;
    badge?: string;
    subtitle?: string;
  };
}

export interface ConsultationSession {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  messages: ChatMessage[];
  problemCategory?: string;
  identifiedNeed?: string;
  recommendedChannelName?: string;
  recommendedProductName?: string;
}

export interface AnalyticsEvent {
  id: string;
  type: 'page_view' | 'chat_start' | 'message_sent' | 'clarification_answered' | 'recommendation_viewed' | 'channel_click' | 'whatsapp_click' | 'petflow_click' | 'mentoria_click' | 'product_card_click' | 'product_link_click' | 'shortcut_click';
  sessionId: string;
  timestamp: number;
  metadata?: {
    channelId?: string;
    channelName?: string;
    productId?: string;
    productName?: string;
    category?: string;
    query?: string;
    shortcutId?: string;
    targetUrl?: string;
    [key: string]: any;
  };
}

export interface AnalyticsStats {
  totalVisits: number;
  totalConversationsStarted: number;
  totalRecommendationsGiven: number;
  totalWhatsAppClicks: number;
  totalPetFlowClicks: number;
  totalMentoriaClicks: number;
  totalProductClicks: number;
  funnel: {
    visits: number;
    conversations: number;
    recommendations: number;
    clicks: number;
    startConversionRate: number;
    recommendationRate: number;
    clickThroughRate: number;
  };
  topCategories: { category: string; count: number }[];
  topProblems: { problem: string; count: number }[];
  topChannelsRecommended: { channelId: string; name: string; count: number }[];
  topChannelsClicked: { channelId: string; name: string; count: number }[];
  recentEvents: AnalyticsEvent[];
}

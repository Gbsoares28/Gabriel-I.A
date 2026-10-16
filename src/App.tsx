import { useState, useEffect } from 'react';
import { Header } from './components/Header.js';
import { HeroConsultant } from './components/HeroConsultant.js';
import { StrategicChannelsSection } from './components/StrategicChannelsSection.js';
import { TestimonialsSection } from './components/TestimonialsSection.js';
import { ChatInterface } from './components/ChatInterface.js';
import { AdminDashboard } from './components/admin/AdminDashboard.js';
import { HistoryModal } from './components/HistoryModal.js';
import { Footer } from './components/Footer.js';
import { ChannelItem, Product, Shortcut, Testimonial, AiConfig, ChatMessage, ConsultationSession } from './types.js';
import {
  fetchPublicConfig,
  fetchChannels,
  fetchShortcuts,
  fetchProducts,
  fetchTestimonials,
  sendConsultation,
  trackEvent
} from './services/api.js';
import {
  getConsultationHistory,
  saveConsultationSession,
  deleteConsultationSession,
  clearAllConsultationHistory,
  extractSessionSummary
} from './services/historyStorage.js';

export default function App() {
  const [config, setConfig] = useState<AiConfig>({
    companyName: 'Gabriel | Adestrador de Cães e Gatos',
    consultantName: 'Gabriel Soares',
    experienceYears: 10,
    consultantTone: 'Acolhedor, técnico, empático e focado no bem-estar mútuo',
    greetingTitle: 'Como posso ajudar você e seu pet hoje?',
    greetingSubtitle:
      'Conte o que está acontecendo com seu cão ou gato, ou me diga o que você deseja aprender. Nossa inteligência artificial identifica sua necessidade e direciona para a melhor solução.',
    inputPlaceholder: 'Ex.: meu cachorro puxa muito no passeio, meu gato faz xixi fora da caixa ou quero me tornar adestrador...',
    systemInstructions: '',
    contactEmail: 'gabrieltreinadordeanimais@gmail.com',
    contactWhatsapp: '5521965107060',
    whatsappDefaultMessage: 'Olá, tudo bem? gostaria de saber mais a respeito de adestramento.',
    instagramUrl: 'https://www.instagram.com/gabrieltreinadordeanimais/',
    youtubeUrl: 'https://www.youtube.com/@gabrieltreinadordeanimais',
    facebookUrl: 'https://www.facebook.com/gabrieltreinadordeanimais',
    petflowUrl: 'https://clubepetflow360.netlify.app/'
  });

  const [channels, setChannels] = useState<ChannelItem[]>([]);
  const [shortcuts, setShortcuts] = useState<Shortcut[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [latestWhatsAppUrl, setLatestWhatsAppUrl] = useState<string | undefined>(undefined);

  // Session & History
  const [currentSessionId, setCurrentSessionId] = useState<string>(() => 'sess_' + Date.now().toString(36));
  const [historySessions, setHistorySessions] = useState<ConsultationSession[]>([]);

  // Modals
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);

  // Initial load
  useEffect(() => {
    trackEvent('page_view');
    loadInitialData();
    loadHistory();
  }, []);

  const loadInitialData = async () => {
    try {
      const [cfg, chs, scs, prods, tests] = await Promise.all([
        fetchPublicConfig().catch(() => config),
        fetchChannels().catch(() => []),
        fetchShortcuts().catch(() => []),
        fetchProducts().catch(() => []),
        fetchTestimonials().catch(() => [])
      ]);
      setConfig((prev) => ({ ...prev, ...cfg }));
      setChannels(chs);
      setShortcuts(scs);
      setProducts(prods);
      setTestimonials(tests);
    } catch (e) {
      console.warn('Initial data load warning:', e);
    }
  };

  const loadHistory = () => {
    const list = getConsultationHistory();
    setHistorySessions(list);
  };

  // Helper to persist current session into user history
  const persistSession = (currentMsgs: ChatMessage[]) => {
    if (currentMsgs.length === 0) return;
    const summary = extractSessionSummary(currentMsgs);

    const sessionObj: ConsultationSession = {
      id: currentSessionId,
      title: summary.title,
      createdAt: currentMsgs[0]?.timestamp || Date.now(),
      updatedAt: Date.now(),
      messages: currentMsgs,
      identifiedNeed: summary.identifiedNeed,
      problemCategory: summary.problemCategory,
      recommendedProductName: summary.recommendedProduct?.name
    };

    saveConsultationSession(sessionObj);
    loadHistory();
  };

  // Main Consultation Trigger
  const handleStartConsultation = async (userPrompt: string, category?: string) => {
    if (!userPrompt.trim() || isLoading) return;

    const isFirstMessage = messages.length === 0;
    if (isFirstMessage) {
      trackEvent('chat_start', {
        initialQuery: userPrompt,
        category: category || 'Geral'
      });
    } else {
      trackEvent('message_sent', { query: userPrompt });
    }

    const userMessage: ChatMessage = {
      id: 'msg-user-' + Date.now(),
      role: 'user',
      content: userPrompt,
      timestamp: Date.now()
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    persistSession(newMessages);
    setIsLoading(true);

    try {
      const apiHistory = newMessages.map((m) => ({
        role: m.role,
        content: m.content
      }));

      const response = await sendConsultation(apiHistory);

      const aiMessage: ChatMessage = {
        id: 'msg-ai-' + Date.now(),
        role: 'assistant',
        content: response.message || response.explanation || 'Análise concluída com sucesso.',
        timestamp: Date.now(),
        status: response.status,
        quickOptions: response.quickOptions,
        recommendation: response.recommendation,
        preAttendanceCase: response.preAttendanceCase,
        whatsappButton: response.whatsappButton
      };

      if (response.whatsappButton?.url) {
        setLatestWhatsAppUrl(response.whatsappButton.url);
      } else if (response.preAttendanceCase?.whatsappUrl) {
        setLatestWhatsAppUrl(response.preAttendanceCase.whatsappUrl);
      }

      const updatedWithAi = [...newMessages, aiMessage];
      setMessages(updatedWithAi);
      persistSession(updatedWithAi);

      if (response.status === 'clarification') {
        trackEvent('clarification_asked', { question: response.clarificationQuestion });
      } else if (response.status === 'recommendation') {
        trackEvent('recommendation_viewed', {
          channelId: response.recommendation?.recommendedChannelId,
          channelName: response.recommendation?.channel?.title,
          category: response.recommendation?.problemCategory
        });
      }
    } catch (error: any) {
      console.error('Error during consultation:', error);
      const fallbackAiMessage: ChatMessage = {
        id: 'msg-ai-err-' + Date.now(),
        role: 'assistant',
        content:
          'Entendi a sua situação com o pet. Para te direcionar para a melhor solução, selecione qual é o seu foco agora:',
        timestamp: Date.now(),
        status: 'clarification',
        quickOptions: [
          'Dificuldade com meu cão',
          'Dificuldade com meu gato',
          'Aprender a adestrar em casa',
          'Falar no WhatsApp com Gabriel'
        ]
      };
      const updatedWithFallback = [...newMessages, fallbackAiMessage];
      setMessages(updatedWithFallback);
      persistSession(updatedWithFallback);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    if (messages.length > 0) {
      persistSession(messages);
    }
    setMessages([]);
    setCurrentSessionId('sess_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 6));
  };

  const handleSelectHistorySession = (session: ConsultationSession) => {
    setCurrentSessionId(session.id);
    setMessages(session.messages);
    setIsHistoryOpen(false);
  };

  const handleDeleteHistorySession = (id: string) => {
    const updated = deleteConsultationSession(id);
    setHistorySessions(updated);
    if (currentSessionId === id) {
      handleResetChat();
    }
  };

  const handleClearAllHistory = () => {
    clearAllConsultationHistory();
    setHistorySessions([]);
    handleResetChat();
  };

  const hasActiveChat = messages.length > 0;

  return (
    <div className="min-h-screen flex flex-col bg-[#8d272b] text-white selection:bg-emerald-500/30 selection:text-emerald-200 relative">
      {/* Global Full-Page Background (Exact #8d272b from https://share.google/5hHPp8HXLvxLwgBgw) */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden" aria-hidden="true">
        {/* Exact solid wine tone #8d272b */}
        <div className="absolute inset-0 bg-[#8d272b]" />

        {/* Soft fabric / photographic texture */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-15 mix-blend-overlay scale-100 sm:scale-105 transition-opacity duration-700"
          style={{
            backgroundImage: `url('https://i.ibb.co/5hcmPkW2/MG-9611.jpg')`,
            backgroundAttachment: 'fixed'
          }}
        />

        {/* Seamless tonal wine gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#9b2a2f]/40 via-[#8d272b]/50 to-[#781f23]/60 backdrop-blur-[1px]" />
      </div>

      {/* Header */}
      <Header
        config={config}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        historyCount={historySessions.length}
        onResetChat={handleResetChat}
        hasActiveChat={hasActiveChat}
      />

      {/* Main Content Area - Mobile First Single Column Spacing */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-3.5 sm:px-6 lg:px-8 relative z-10 py-4 sm:py-8 space-y-8 sm:space-y-14">
        {!hasActiveChat ? (
          <>
            {/* 1. Hero Consultation Hub */}
            <HeroConsultant
              config={config}
              shortcuts={shortcuts}
              onStartConsultation={(prompt, category) => handleStartConsultation(prompt, category)}
              isLoading={isLoading}
            />

            {/* 2. Structured Bento Grid: The 5 Strategic Channels */}
            <StrategicChannelsSection
              channels={channels}
              config={config}
              onStartConsultationForChannel={(prompt) => handleStartConsultation(prompt)}
              latestWhatsAppUrl={latestWhatsAppUrl}
            />

            {/* 3. Verified Client Testimonials */}
            <TestimonialsSection
              testimonials={testimonials}
              config={config}
            />
          </>
        ) : (
          /* Active Conversational Consultation Stream */
          <div className="w-full max-w-4xl mx-auto space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#26282c]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs font-semibold text-white tracking-wide">
                  Orientação Inteligente • Assistente do Gabriel
                </span>
                <span className="text-xs text-[#8e939b] hidden sm:inline">
                  (Histórico ativo)
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsHistoryOpen(true)}
                  className="text-xs text-[#ea580c] hover:underline transition-colors font-medium"
                >
                  Consultas Salvas ({historySessions.length})
                </button>
                <span className="text-[#383a40]">|</span>
                <button
                  onClick={handleResetChat}
                  className="text-xs text-[#8e939b] hover:text-white transition-colors"
                >
                  Nova Pergunta
                </button>
              </div>
            </div>

            <ChatInterface
              messages={messages}
              isLoading={isLoading}
              onSendMessage={(text) => handleStartConsultation(text)}
              config={config}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer
        config={config}
        channels={channels}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Modals */}
      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        sessions={historySessions}
        onSelectSession={handleSelectHistorySession}
        onDeleteSession={handleDeleteHistorySession}
        onClearAll={handleClearAllHistory}
        currentSessionId={currentSessionId}
      />

      <AdminDashboard
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        onRefreshData={loadInitialData}
      />
    </div>
  );
}

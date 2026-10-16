import React, { useRef, useEffect } from 'react';
import { User, ArrowRight, ArrowUpRight, Loader2, MessageCircle, AlertTriangle, HelpCircle, Sparkles } from 'lucide-react';
import { ChatMessage, AiConfig } from '../types.js';
import { RecommendationCard } from './RecommendationCard.js';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  isLoading: boolean;
  onSendMessage: (text: string) => void;
  config: AiConfig;
  onOpenCatalog?: () => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  isLoading,
  onSendMessage,
  config
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [inputText, setInputText] = React.useState('');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    onSendMessage(inputText);
    setInputText('');
  };

  return (
    <div className="w-full flex flex-col space-y-6">
      {/* Messages Stream */}
      <div className="space-y-6">
        {messages.map((message) => {
          const isUser = message.role === 'user';

          return (
            <div
              key={message.id}
              className={`flex gap-3 sm:gap-4 ${
                isUser ? 'justify-end' : 'justify-start'
              } animate-in fade-in duration-300`}
            >
              {/* Consultant Avatar */}
              {!isUser && (
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#16171a] border border-[#2a2c31] shrink-0 shadow-sm flex items-center justify-center text-emerald-400">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                </div>
              )}

              {/* Message Bubble & Content */}
              <div
                className={`max-w-[92%] sm:max-w-[85%] md:max-w-[78%] flex flex-col ${
                  isUser ? 'items-end' : 'items-start'
                }`}
              >
                {/* Author Name */}
                <div className="text-[11px] text-[#8e939b] mb-1 px-1 flex items-center gap-1.5 font-medium">
                  {isUser ? (
                    <>
                      <span>Você</span>
                      <User className="w-3 h-3 text-neutral-500" />
                    </>
                  ) : (
                    <>
                      <img
                        src="https://i.ibb.co/CKXP3vRs/IMG-7987.jpg"
                        alt="Gabriel Soares"
                        className="w-4 h-4 rounded-full object-cover object-top border border-emerald-500/50"
                      />
                      <span className="text-white font-bold">
                        {config.consultantName || 'Gabriel Soares'}
                      </span>
                      <span className="text-emerald-400 font-medium">• Assistente Virtual</span>
                    </>
                  )}
                </div>

                {/* Text Bubble */}
                <div
                  className={`p-4 sm:p-5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? 'bg-[#3d0a20]/90 text-white rounded-tr-sm border border-rose-400/30 shadow-md'
                      : 'bg-[#1e0712]/90 text-white rounded-tl-sm border border-white/15 shadow-md'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>

                  {/* Direct WhatsApp Pre-Attendance Button */}
                  {message.whatsappButton && (
                    <div className="mt-4 p-4 sm:p-5 rounded-2xl bg-[#16a34a]/15 border border-[#16a34a]/40 space-y-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-[#16a34a] flex items-center justify-center text-white shadow-sm shrink-0">
                          <MessageCircle className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-white">
                            {message.whatsappButton.badge || 'Fale com Gabriel pelo WhatsApp'}
                          </h4>
                          <p className="text-xs text-emerald-200/90">
                            {message.whatsappButton.subtitle || 'Seu resumo está pronto para ser enviado'}
                          </p>
                        </div>
                      </div>

                      <div>
                        <a
                          href={message.whatsappButton.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-[#16a34a] hover:bg-[#15803d] text-white shadow-md shadow-emerald-950/30 transition-all active:scale-95"
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span>{message.whatsappButton.text || 'Continuar atendimento no WhatsApp'}</span>
                          <ArrowUpRight className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Clarification or Summary Confirmation Quick Options */}
                  {message.quickOptions && message.quickOptions.length > 0 && !message.recommendation && (
                    <div className="mt-4 pt-3 border-t border-[#26282c] space-y-2">
                      <span className="text-xs font-semibold text-[#8e939b] flex items-center gap-1">
                        <HelpCircle className="w-3.5 h-3.5 text-[#ea580c]" />
                        {message.status === 'summary_confirmation'
                          ? 'Confirme para prosseguir para o WhatsApp:'
                          : 'Selecione uma opção ou responda abaixo:'}
                      </span>
                      <div className="flex flex-wrap gap-2 pt-1">
                        {message.quickOptions.map((opt, i) => {
                          const isConfirm = opt.toLowerCase().includes('sim');
                          return (
                            <button
                              key={i}
                              disabled={isLoading}
                              onClick={() => onSendMessage(opt)}
                              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all text-left active:scale-[0.98] disabled:opacity-50 flex items-center gap-1.5 ${
                                isConfirm
                                  ? 'bg-[#16a34a] hover:bg-[#15803d] text-white shadow-sm'
                                  : 'bg-[#1e2024] hover:bg-[#282a30] text-neutral-300 hover:text-white border border-[#2f3238]'
                              }`}
                            >
                              <span>{opt}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* No Match Fallback */}
                  {message.status === 'no_match' && (
                    <div className="mt-4 p-4 rounded-xl bg-[#222428] border border-[#2e3137] text-xs sm:text-sm">
                      <div className="flex items-center gap-2 text-white font-semibold mb-1">
                        <AlertTriangle className="w-4 h-4 text-[#ea580c]" />
                        <span>Orientação Direta com Gabriel</span>
                      </div>
                      <p className="text-[#8e939b] leading-relaxed">
                        Como cada animal possui um histórico único de saúde e convivência, recomendamos conversar diretamente no WhatsApp para uma avaliação personalizada.
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {config.contactWhatsapp && (
                          <a
                            href={`https://api.whatsapp.com/send?phone=${(config.contactWhatsapp || '5521965107060').replace(/\D/g, '')}&text=${encodeURIComponent(config.whatsappDefaultMessage || 'Olá, tudo bem? gostaria de saber mais a respeito de adestramento.')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 rounded-xl bg-[#ea580c] hover:bg-[#d9480f] text-white font-semibold text-xs transition-colors inline-flex items-center gap-1.5"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            Falar no WhatsApp com Gabriel
                          </a>
                        )}
                        <a
                          href="https://drive.google.com/file/d/1-wMqvUYwpDE9f35rRf7Y8ChoP3OCLziS/view?usp=drive_link"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3.5 py-1.5 rounded-xl bg-[#18191b] hover:bg-[#222428] text-neutral-300 hover:text-white font-medium text-xs border border-[#26282c] transition-colors inline-flex items-center gap-1.5"
                        >
                          <span>Acessar Checklist de Enxoval</span>
                          <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400" />
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Recommendation Card */}
                  {message.recommendation && (
                    <div className="mt-4">
                      <RecommendationCard
                        data={message.recommendation}
                        onFollowUp={onSendMessage}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* User Avatar */}
              {isUser && (
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#222428] border border-[#2e3137] flex items-center justify-center shrink-0 text-neutral-400">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex gap-3 sm:gap-4 justify-start animate-in fade-in duration-300">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#18191b] border border-[#26282c] flex items-center justify-center shrink-0">
              <Loader2 className="w-4 h-4 text-[#ea580c] animate-spin" />
            </div>

            <div className="max-w-[85%] p-4 rounded-2xl bg-[#18191b] border border-[#26282c] rounded-tl-sm flex items-center gap-3">
              <div className="flex space-x-1.5">
                <div className="w-2 h-2 rounded-full bg-[#ea580c] animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 rounded-full bg-[#ea580c] animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 rounded-full bg-[#ea580c] animate-bounce"></div>
              </div>
              <span className="text-xs sm:text-sm text-neutral-300 font-medium">
                Analisando a situação e encontrando a melhor solução...
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Persistent Inline Chat Input Bar */}
      <div className="sticky bottom-4 z-20 pt-2">
        <form
          onSubmit={handleSubmit}
          className="relative rounded-2xl bg-[#1e0712]/95 backdrop-blur-xl border border-white/20 p-2 sm:p-2.5 shadow-2xl focus-within:border-emerald-400 transition-all"
        >
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Digite mais detalhes ou responda aqui..."
              disabled={isLoading}
              className="flex-1 bg-transparent px-3 py-2 text-xs sm:text-sm text-white placeholder-neutral-400 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              aria-label="Enviar mensagem"
              className="w-11 h-11 rounded-xl bg-[#16a34a] hover:bg-[#15803d] disabled:bg-white/10 disabled:text-neutral-500 text-white font-medium text-sm transition-all flex items-center justify-center shrink-0 active:scale-95 cursor-pointer shadow-md"
            >
              <ArrowRight className="w-4 h-4 text-white" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

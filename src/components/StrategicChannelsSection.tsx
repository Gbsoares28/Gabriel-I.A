import React, { useState } from 'react';
import {
  MessageCircle,
  Sparkles,
  Youtube,
  Package,
  GraduationCap,
  ArrowUpRight,
  ChevronDown,
  ChevronUp,
  HelpCircle
} from 'lucide-react';
import { ChannelItem, AiConfig } from '../types.js';
import { trackChannelClick } from '../services/api.js';

interface StrategicChannelsSectionProps {
  channels: ChannelItem[];
  config: AiConfig;
  onOpenProducts?: () => void;
  onStartConsultationForChannel: (prompt: string) => void;
  latestWhatsAppUrl?: string;
}

interface StrategicCardItem {
  id: string;
  order: number;
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
  link: string;
  aiPrompt?: string;
  aiButtonText?: string;
  icon: React.ComponentType<{ className?: string }>;
  bgColor: string;
  textColor: string;
  badgeBg: string;
  buttonBg: string;
  buttonTextCol: string;
  borderCol: string;
  secondaryTextCol: string;
}

export const StrategicChannelsSection: React.FC<StrategicChannelsSectionProps> = ({
  channels,
  config,
  onStartConsultationForChannel,
  latestWhatsAppUrl
}) => {
  const whatsapp = channels.find(c => c.id === 'whatsapp');
  const mentoria = channels.find(c => c.id === 'mentoria');
  const petflow = channels.find(c => c.id === 'petflow360');
  const produtos = channels.find(c => c.id === 'produtos');
  const youtube = channels.find(c => c.id === 'youtube');

  const defaultWaMessage = config.whatsappDefaultMessage || 'Olá, tudo bem? gostaria de saber mais a respeito de adestramento.';
  const waUrl = latestWhatsAppUrl || whatsapp?.link || `https://wa.me/5521965107060?text=${encodeURIComponent(defaultWaMessage)}`;
  const petflowUrl = petflow?.link || config.petflowUrl || 'https://clubepetflow360.netlify.app/';
  const youtubeUrl = youtube?.link || config.youtubeUrl || 'https://www.youtube.com/@gabrieltreinadordeanimais';
  const produtosUrl = produtos?.link || 'https://drive.google.com/file/d/1-wMqvUYwpDE9f35rRf7Y8ChoP3OCLziS/view?usp=drive_link';
  const mentoriaUrl = mentoria?.link || `https://wa.me/5521965107060?text=${encodeURIComponent('Olá, Gabriel! Tenho interesse na sua mentoria para adestradores e gostaria de entender como funciona, para quem é indicada e quais são os próximos passos.')}`;

  // Independent expand/collapse state for complementary texts
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpandedCards(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  /**
   * Exact Mandatory 5 Cards in Required Order:
   * 1. WhatsApp | Atendimento Direto
   * 2. Clube PetFlow 360
   * 3. YouTube | Vídeos Gratuitos
   * 4. Checklist Completo de Enxoval em PDF
   * 5. Mentoria para Adestradores
   * (Facebook completely excluded)
   */
  const cards: StrategicCardItem[] = [
    {
      id: 'whatsapp',
      order: 1,
      badge: 'Atendimento Direto',
      title: 'Contato com o Adestrador',
      subtitle: 'Fale comigo no WhatsApp',
      description: 'Conheça as possibilidades de atendimento com Gabriel, adestrador de cães e gatos com 10 anos de experiência, e descubra como receber orientação personalizada para as necessidades da sua família.',
      buttonText: 'Falar com Gabriel no WhatsApp',
      link: waUrl,
      aiPrompt: 'Quero falar diretamente com Gabriel sobre meu pet',
      aiButtonText: 'Tirar dúvidas com a IA →',
      icon: MessageCircle,
      bgColor: 'bg-[#16a34a]',
      textColor: 'text-white',
      badgeBg: 'bg-white/20 text-white',
      buttonBg: 'bg-white text-[#16a34a] hover:bg-emerald-50',
      buttonTextCol: 'text-[#16a34a]',
      borderCol: 'border-emerald-400/30',
      secondaryTextCol: 'text-emerald-100 hover:text-white'
    },
    {
      id: 'petflow360',
      order: 2,
      badge: 'Plataforma em Casa',
      title: 'Clube PetFlow 360',
      subtitle: 'Adestramento em casa',
      description: 'Treinamento contínuo para seu cão: foco, autocontrole, passeio sem puxões e rotina saudável. Planos Play (R$ 57/mês), Acompanhamento (R$ 157/mês) e Personal (R$ 257/mês).',
      buttonText: 'Conhecer o Clube PetFlow 360',
      link: petflowUrl,
      aiPrompt: 'Quero saber se o Clube PetFlow 360 é indicado para a raça e a idade do meu animal.',
      aiButtonText: 'É indicado para meu pet? Pergunte à IA →',
      icon: Sparkles,
      bgColor: 'bg-[#db2777]',
      textColor: 'text-white',
      badgeBg: 'bg-white/20 text-white',
      buttonBg: 'bg-white text-[#db2777] hover:bg-pink-50',
      buttonTextCol: 'text-[#db2777]',
      borderCol: 'border-pink-400/30',
      secondaryTextCol: 'text-pink-100 hover:text-white'
    },
    {
      id: 'youtube',
      order: 3,
      badge: 'Vídeos Gratuitos',
      title: 'Nosso canal no YouTube',
      subtitle: 'Dicas e conteúdos gratuitos',
      description: 'Assista aos vídeos de Gabriel, acompanhe demonstrações práticas de treinamento e aprenda sobre comportamento animal, educação, rotina e convivência com seu pet.',
      buttonText: 'Assistir aos vídeos',
      link: youtubeUrl,
      aiPrompt: 'Quero aprender com os vídeos gratuitos de Gabriel',
      aiButtonText: 'Ver vídeos educativos gratuitos →',
      icon: Youtube,
      bgColor: 'bg-[#dc2626]',
      textColor: 'text-white',
      badgeBg: 'bg-white/20 text-white',
      buttonBg: 'bg-white text-[#dc2626] hover:bg-red-50',
      buttonTextCol: 'text-[#dc2626]',
      borderCol: 'border-red-400/30',
      secondaryTextCol: 'text-red-100 hover:text-white'
    },
    {
      id: 'produtos',
      order: 4,
      badge: 'Curadoria Gabriel',
      title: 'Checklist Completo de Enxoval em PDF',
      subtitle: 'Itens essenciais para preparar a chegada do seu pet',
      description: 'Checklist completo de enxoval em PDF, comedouros lentos, guias de passeio seguro e brinquedos para estimulação mental e gasto de energia saudável.',
      buttonText: 'Acessar Checklist no Drive',
      link: produtosUrl,
      aiPrompt: 'Qual brinquedo é mais indicado para o meu pet?',
      aiButtonText: 'Qual brinquedo é ideal? →',
      icon: Package,
      bgColor: 'bg-[#f59e0b]',
      textColor: 'text-neutral-950',
      badgeBg: 'bg-black/15 text-neutral-900 font-extrabold',
      buttonBg: 'bg-neutral-950 text-white hover:bg-neutral-900',
      buttonTextCol: 'text-white',
      borderCol: 'border-amber-400/30',
      secondaryTextCol: 'text-neutral-950 font-bold hover:opacity-80'
    },
    {
      id: 'mentoria',
      order: 5,
      badge: 'Profissionais Pet',
      title: 'Mentoria para Adestradores',
      subtitle: 'Alavanque sua carreira',
      description: 'Um canal voltado a adestradores que desejam aprimorar seus conhecimentos técnicos, desenvolver sua atuação com clientes e encontrar caminhos sólidos para evoluir na carreira.',
      buttonText: 'Conhecer a Mentoria',
      link: mentoriaUrl,
      aiPrompt: 'Quero saber como funciona a mentoria para adestradores',
      aiButtonText: 'Dúvidas sobre carreira e mentoria →',
      icon: GraduationCap,
      bgColor: 'bg-[#8b5cf6]',
      textColor: 'text-white',
      badgeBg: 'bg-white/20 text-white',
      buttonBg: 'bg-white text-[#8b5cf6] hover:bg-purple-50',
      buttonTextCol: 'text-[#8b5cf6]',
      borderCol: 'border-purple-400/30',
      secondaryTextCol: 'text-purple-100 hover:text-white'
    }
  ];

  return (
    <section className="space-y-6 pt-4" aria-label="Canais e Soluções Oficiais de Gabriel">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-[12px] font-bold uppercase tracking-wider text-emerald-400 block mb-1">
            SOLUÇÕES & CANAIS OFICIAIS
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-[38px] font-bold text-white tracking-tight leading-tight font-serif">
            Caminhos pensados para cada momento
          </h2>
          <p className="text-xs sm:text-sm text-[#8e939b] mt-1 max-w-2xl leading-relaxed">
            Acesse diretamente os serviços de Gabriel ou utilize a assistente virtual para pré-atendimento inteligente e acolhedor.
          </p>
        </div>
      </div>

      {/*
        Balanced 5-Card Grid:
        - Mobile: Single column in exact order 1 to 5
        - Desktop / Tablet: 2-column grid, with the 5th card spanning gracefully across both columns
        - Zero empty spaces, compact layout, primary buttons directly visible
      */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
        {cards.map((item) => {
          const isExpanded = Boolean(expandedCards[item.id]);
          const Icon = item.icon;
          const isLastItem = item.order === 5;

          return (
            <div
              key={item.id}
              className={`rounded-[20px] ${item.bgColor} ${item.textColor} shadow-md transition-all duration-300 p-4 sm:p-5 flex flex-col justify-between border ${item.borderCol} ${
                isLastItem ? 'md:col-span-2' : ''
              }`}
            >
              {/* Card Header */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm ${item.badgeBg}`}>
                    {item.badge}
                  </span>

                  <div className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 opacity-90" />
                  </div>
                </div>

                <div>
                  <h3 className="text-lg sm:text-xl font-bold tracking-tight leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm font-medium opacity-90 mt-0.5">
                    {item.subtitle}
                  </p>
                </div>
              </div>

              {/* Action Bar (Always visible button + Saiba mais toggle) */}
              <div className="pt-4 mt-3 border-t border-black/10 sm:border-white/15 flex flex-wrap items-center justify-between gap-2.5">
                {/* Primary Action Button (Directly visible) */}
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackChannelClick(item.id, item.title, item.link)}
                  className={`px-4 py-2 rounded-xl font-bold text-xs sm:text-sm ${item.buttonBg} transition-all flex items-center gap-1.5 shadow-sm active:scale-95`}
                >
                  <span>{item.buttonText}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
                </a>

                {/* Saiba mais / Expand control */}
                <button
                  type="button"
                  onClick={() => toggleExpand(item.id)}
                  aria-expanded={isExpanded}
                  className="inline-flex items-center gap-1 text-xs font-semibold opacity-90 hover:opacity-100 transition-opacity cursor-pointer py-1 px-2 rounded-md hover:bg-black/10"
                >
                  <span>{isExpanded ? 'Menos detalhes' : 'Saiba mais'}</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-300 ${
                      isExpanded ? 'rotate-180' : ''
                    }`}
                  />
                </button>
              </div>

              {/* Collapsible Complementary Description & Secondary AI Option */}
              <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  isExpanded ? 'max-h-72 opacity-100 mt-3 pt-3 border-t border-black/10 sm:border-white/15' : 'max-h-0 opacity-0'
                }`}
              >
                <p className="text-xs sm:text-sm leading-relaxed opacity-95">
                  {item.description}
                </p>

                {item.aiPrompt && (
                  <div className="pt-2.5 flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5 opacity-80 shrink-0" />
                    <button
                      type="button"
                      onClick={() => onStartConsultationForChannel(item.aiPrompt!)}
                      className={`text-xs font-semibold underline underline-offset-2 transition-colors ${item.secondaryTextCol}`}
                    >
                      {item.aiButtonText}
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

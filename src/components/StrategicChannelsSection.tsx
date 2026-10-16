import React, { useState } from 'react';
import {
  MessageCircle,
  Instagram,
  Sparkles,
  Youtube,
  Package,
  GraduationCap,
  ArrowUpRight,
  ChevronDown,
  HelpCircle,
  Info
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

interface StrategicButtonItem {
  id: string;
  order: number;
  title: string;
  subtitle: string;
  badge: string;
  description: string;
  buttonText: string;
  link: string;
  aiPrompt?: string;
  aiButtonText?: string;
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  cardBg: string;
  borderCol: string;
  buttonBg: string;
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
  const instagramUrl = config.instagramUrl || 'https://www.instagram.com/gabrieltreinadordeanimais/';
  const petflowUrl = petflow?.link || config.petflowUrl || 'https://clubepetflow360.netlify.app/';
  const youtubeUrl = youtube?.link || config.youtubeUrl || 'https://www.youtube.com/@gabrieltreinadordeanimais';
  const produtosUrl = produtos?.link || 'https://drive.google.com/file/d/1-wMqvUYwpDE9f35rRf7Y8ChoP3OCLziS/view?usp=drive_link';
  const mentoriaUrl = mentoria?.link || `https://wa.me/5521965107060?text=${encodeURIComponent('Olá, Gabriel! Tenho interesse na sua mentoria para adestradores e gostaria de entender como funciona, para quem é indicada e quais são os próximos passos.')}`;

  // Independent expand/collapse state for details drawer
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setExpandedCards(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  /**
   * Compact Link-in-Bio buttons:
   * 1. WhatsApp
   * 2. Instagram
   * 3. Clube PetFlow 360
   * 4. Canal do YouTube
   * 5. Checklist Completo de Enxoval em PDF
   * 6. Mentoria para Adestradores
   */
  const buttons: StrategicButtonItem[] = [
    {
      id: 'whatsapp',
      order: 1,
      title: 'WhatsApp do Adestrador',
      subtitle: 'Atendimento direto com Gabriel Soares',
      badge: 'Atendimento Direto',
      description: 'Conheça as possibilidades de atendimento com Gabriel, adestrador de cães e gatos com 10 anos de experiência, e descubra como receber orientação personalizada para as necessidades da sua família.',
      buttonText: 'Falar com Gabriel no WhatsApp',
      link: waUrl,
      aiPrompt: 'Quero falar diretamente com Gabriel sobre meu pet',
      aiButtonText: 'Tirar dúvidas com a IA →',
      icon: MessageCircle,
      iconBg: 'bg-[#16a34a]',
      cardBg: 'bg-black/20 hover:bg-black/30',
      borderCol: 'border-emerald-400/30',
      buttonBg: 'bg-[#16a34a] hover:bg-[#15803d] text-white'
    },
    {
      id: 'instagram',
      order: 2,
      title: 'Instagram @gabrieltreinadordeanimais',
      subtitle: 'Bastidores, rotina e dicas nos Stories',
      badge: 'Rede Oficial',
      description: 'Acompanhe o dia a dia dos atendimentos, dicas práticas de adestramento e convivência harmoniosa com cães e gatos.',
      buttonText: 'Seguir no Instagram',
      link: instagramUrl,
      icon: Instagram,
      iconBg: 'bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888]',
      cardBg: 'bg-black/20 hover:bg-black/30',
      borderCol: 'border-pink-400/30',
      buttonBg: 'bg-gradient-to-r from-[#dc2743] to-[#bc1888] hover:opacity-90 text-white'
    },
    {
      id: 'petflow360',
      order: 3,
      title: 'Clube PetFlow 360',
      subtitle: 'Adestramento em casa para seu cão',
      badge: 'Plataforma Oficial',
      description: 'Treinamento contínuo para seu cão: foco, autocontrole, passeio sem puxões e rotina saudável. Planos Play (R$ 57/mês), Acompanhamento (R$ 157/mês) e Personal (R$ 257/mês).',
      buttonText: 'Conhecer o Clube PetFlow 360',
      link: petflowUrl,
      aiPrompt: 'Quero saber se o Clube PetFlow 360 é indicado para a raça e a idade do meu animal.',
      aiButtonText: 'É indicado para meu pet? Pergunte à IA →',
      icon: Sparkles,
      iconBg: 'bg-[#db2777]',
      cardBg: 'bg-black/20 hover:bg-black/30',
      borderCol: 'border-pink-400/30',
      buttonBg: 'bg-[#db2777] hover:bg-[#be185d] text-white'
    },
    {
      id: 'youtube',
      order: 4,
      title: 'Canal do YouTube',
      subtitle: 'Vídeos educativos e demonstrações práticas',
      badge: 'Conteúdo Gratuito',
      description: 'Assista aos vídeos de Gabriel, acompanhe demonstrações práticas de treinamento e aprenda sobre comportamento animal, educação, rotina e convivência.',
      buttonText: 'Assistir aos vídeos',
      link: youtubeUrl,
      aiPrompt: 'Quero aprender com os vídeos gratuitos de Gabriel',
      aiButtonText: 'Ver vídeos educativos gratuitos →',
      icon: Youtube,
      iconBg: 'bg-[#dc2626]',
      cardBg: 'bg-black/20 hover:bg-black/30',
      borderCol: 'border-red-400/30',
      buttonBg: 'bg-[#dc2626] hover:bg-[#b91c1c] text-white'
    },
    {
      id: 'produtos',
      order: 5,
      title: 'Checklist Completo de Enxoval em PDF',
      subtitle: 'Itens essenciais para preparar a chegada do seu pet',
      badge: 'Curadoria Gabriel',
      description: 'Checklist completo de enxoval em PDF, comedouros lentos, guias de passeio seguro e brinquedos para estimulação mental e gasto de energia saudável.',
      buttonText: 'Acessar Checklist no Drive',
      link: produtosUrl,
      aiPrompt: 'Qual brinquedo é mais indicado para o meu pet?',
      aiButtonText: 'Qual brinquedo é ideal? →',
      icon: Package,
      iconBg: 'bg-[#8d272b] border border-white/30',
      cardBg: 'bg-black/20 hover:bg-black/30',
      borderCol: 'border-white/30',
      buttonBg: 'bg-white/20 hover:bg-white/30 text-white border border-white/40'
    },
    {
      id: 'mentoria',
      order: 6,
      title: 'Mentoria para Adestradores',
      subtitle: 'Alavanque sua carreira profissional',
      badge: 'Profissionais Pet',
      description: 'Um canal voltado a adestradores que desejam aprimorar seus conhecimentos técnicos, desenvolver sua atuação com clientes e encontrar caminhos sólidos para evoluir na carreira.',
      buttonText: 'Conhecer a Mentoria',
      link: mentoriaUrl,
      aiPrompt: 'Quero saber como funciona a mentoria para adestradores',
      aiButtonText: 'Dúvidas sobre carreira e mentoria →',
      icon: GraduationCap,
      iconBg: 'bg-[#8b5cf6]',
      cardBg: 'bg-black/20 hover:bg-black/30',
      borderCol: 'border-purple-400/30',
      buttonBg: 'bg-[#8b5cf6] hover:bg-[#7c3aed] text-white'
    }
  ];

  return (
    <section className="space-y-3 max-w-2xl mx-auto w-full" aria-label="Canais Oficiais de Gabriel Soares">
      {/* Section Header */}
      <div className="text-center pb-0.5">
        <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300 block mb-0.5">
          CANAIS & SOLUÇÕES OFICIAIS
        </span>
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-tight font-serif">
          Acesse os canais de Gabriel Soares
        </h2>
        <p className="text-xs text-white/80 mt-1 max-w-md mx-auto">
          Toque para acessar ou clique em “Saiba mais” para ver os detalhes.
        </p>
      </div>

      {/* Compact Streamlined Button List */}
      <div className="flex flex-col space-y-2 sm:space-y-2.5">
        {buttons.map((item) => {
          const isExpanded = Boolean(expandedCards[item.id]);
          const Icon = item.icon;

          return (
            <div
              key={item.id}
              className={`rounded-xl ${item.cardBg} backdrop-blur-md border ${item.borderCol} transition-all duration-200 overflow-hidden shadow-sm`}
            >
              {/*
                Compact Primary Row:
                Contains ONLY the essential information:
                Icon + Title + Saiba mais toggle + Direct Action Arrow
              */}
              <div className="flex items-center justify-between p-2 sm:p-2.5 min-h-[46px] gap-2">
                {/* Direct Action Link Area */}
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackChannelClick(item.id, item.title, item.link)}
                  className="flex items-center gap-2.5 flex-1 min-w-0 group cursor-pointer"
                  title={item.title}
                >
                  {/* Compact Icon Badge */}
                  <div className={`w-8 h-8 rounded-lg ${item.iconBg} flex items-center justify-center shrink-0 text-white shadow-sm transition-transform group-hover:scale-105 group-active:scale-95`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>

                  {/* Clean Essential Title Only (No subtitles, no clutter) */}
                  <span className="font-semibold text-xs sm:text-sm text-white group-hover:underline underline-offset-2 tracking-tight truncate">
                    {item.title}
                  </span>
                </a>

                {/* Right Controls: Saiba mais button + Direct Arrow */}
                <div className="flex items-center gap-1.5 shrink-0">
                  {/* Saiba mais / Detalhes Toggle */}
                  <button
                    type="button"
                    onClick={(e) => toggleExpand(item.id, e)}
                    aria-expanded={isExpanded}
                    aria-label={`${isExpanded ? 'Ocultar' : 'Ver'} detalhes de ${item.title}`}
                    className="h-8 px-2.5 rounded-lg text-[11px] font-medium text-white/90 hover:text-white bg-white/10 hover:bg-white/20 active:bg-white/30 transition-all flex items-center gap-1 cursor-pointer border border-white/15"
                  >
                    <span>{isExpanded ? 'Menos' : 'Saiba mais'}</span>
                    <ChevronDown
                      className={`w-3 h-3 transition-transform duration-300 ${
                        isExpanded ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {/* Direct Arrow Button */}
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackChannelClick(item.id, item.title, item.link)}
                    className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 active:scale-95 text-white flex items-center justify-center transition-all cursor-pointer border border-white/15"
                    aria-label={`Acessar ${item.title}`}
                  >
                    <ArrowUpRight className="w-3.5 h-3.5 text-white" />
                  </a>
                </div>
              </div>

              {/* Collapsible Details (Appears ONLY if clicked) */}
              {isExpanded && (
                <div className="px-3.5 pb-3.5 pt-2 border-t border-white/15 space-y-2.5 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between gap-2 pt-0.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/20 text-white">
                      {item.badge}
                    </span>
                    <span className="text-xs text-white/85 font-medium truncate">
                      {item.subtitle}
                    </span>
                  </div>

                  <p className="text-xs text-white/95 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="pt-1 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
                    {/* Big Action Button */}
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => trackChannelClick(item.id, item.title, item.link)}
                      className={`w-full sm:w-auto h-9 px-4 rounded-lg font-bold text-xs ${item.buttonBg} transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-95 cursor-pointer`}
                    >
                      <span>{item.buttonText}</span>
                      <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
                    </a>

                    {item.aiPrompt && (
                      <button
                        type="button"
                        onClick={() => onStartConsultationForChannel(item.aiPrompt!)}
                        className="text-xs font-semibold text-white/90 hover:text-white underline underline-offset-2 transition-colors cursor-pointer text-center sm:text-left py-1"
                      >
                        {item.aiButtonText}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

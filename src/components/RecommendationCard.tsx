import React, { useState } from 'react';
import {
  ArrowUpRight,
  Sparkles,
  AlertTriangle,
  HelpCircle,
  MessageCircle,
  Package,
  Youtube,
  GraduationCap
} from 'lucide-react';
import { Product, RecommendationResult, SolutionOption } from '../types.js';
import { trackChannelClick, trackEvent } from '../services/api.js';

interface RecommendationCardProps {
  data: RecommendationResult;
  onFollowUp: (optionText: string) => void;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  data,
  onFollowUp
}) => {
  const [selectedProductDetails, setSelectedProductDetails] = useState<Product | null>(null);

  const channel = data.channel;
  const secondary = data.secondaryChannel;
  const product = data.primaryProduct;
  const structuredSolutions = data.structuredSolutions;

  const handleProductCardClick = (prod: Product) => {
    trackEvent('product_card_click', {
      productId: prod.id,
      productName: prod.name,
      category: prod.category
    });
    setSelectedProductDetails(prod);
  };

  const handleOfficialLinkClick = (e: React.MouseEvent, prod: Product) => {
    e.stopPropagation();
    trackEvent('product_link_click', {
      productId: prod.id,
      productName: prod.name,
      targetUrl: prod.officialLink
    });
  };

  const renderSolutionIcon = (variant?: string, iconName?: string) => {
    if (variant === 'whatsapp' || iconName === 'MessageCircle') {
      return <MessageCircle className="w-4 h-4 text-emerald-400" />;
    }
    if (variant === 'petflow' || iconName === 'Sparkles') {
      return <Sparkles className="w-4 h-4 text-pink-400" />;
    }
    if (variant === 'youtube' || iconName === 'Youtube') {
      return <Youtube className="w-4 h-4 text-red-400" />;
    }
    if (variant === 'mentoria' || iconName === 'GraduationCap') {
      return <GraduationCap className="w-4 h-4 text-purple-400" />;
    }
    return <Package className="w-4 h-4 text-amber-400" />;
  };

  const getSolutionStyles = (sol: SolutionOption) => {
    if (sol.variant === 'whatsapp') {
      return {
        cardBorder: sol.isPrimary ? 'border-emerald-500/50 hover:border-emerald-400 shadow-emerald-950/20' : 'border-[#26282c]',
        cardBg: sol.isPrimary ? 'bg-[#121c16]' : 'bg-[#18191b]',
        badgeBg: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
        buttonBg: 'bg-[#16a34a] hover:bg-[#15803d] text-white shadow-emerald-900/40'
      };
    }
    if (sol.variant === 'petflow') {
      return {
        cardBorder: 'border-pink-500/30 hover:border-pink-400/60 shadow-pink-950/20',
        cardBg: 'bg-[#1a1318]',
        badgeBg: 'bg-pink-500/15 text-pink-300 border-pink-500/30',
        buttonBg: 'bg-[#db2777] hover:bg-[#be185d] text-white shadow-pink-900/40'
      };
    }
    if (sol.variant === 'youtube') {
      return {
        cardBorder: 'border-red-500/30 hover:border-red-400/60 shadow-red-950/20',
        cardBg: 'bg-[#1a1314]',
        badgeBg: 'bg-red-500/15 text-red-300 border-red-500/30',
        buttonBg: 'bg-[#dc2626] hover:bg-[#b91c1c] text-white shadow-red-900/40'
      };
    }
    if (sol.variant === 'mentoria') {
      return {
        cardBorder: 'border-purple-500/30 hover:border-purple-400/60 shadow-purple-950/20',
        cardBg: 'bg-[#17131e]',
        badgeBg: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
        buttonBg: 'bg-[#9333ea] hover:bg-[#7e22ce] text-white shadow-purple-900/40'
      };
    }
    // PDF or Toy
    return {
      cardBorder: 'border-amber-500/30 hover:border-amber-400/60 shadow-amber-950/20',
      cardBg: 'bg-[#1b1713]',
      badgeBg: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
      buttonBg: 'bg-[#f59e0b] hover:bg-[#d97706] text-neutral-950 font-bold shadow-amber-900/40'
    };
  };

  return (
    <div className="w-full space-y-4 pt-1">
      {/* Veterinary Ethics Warning (When relevant) */}
      {data.requiresVeterinaryNotice && (
        <div className="p-4 rounded-2xl bg-[#1c1d20] border border-[#2e3036] flex items-start gap-3 text-xs sm:text-sm text-neutral-300">
          <AlertTriangle className="w-5 h-5 text-[#ea580c] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold text-white block">
              Orientações sobre Saúde e Segurança Animal
            </span>
            <p className="leading-relaxed text-[#8e939b]">
              Alterações comportamentais súbitas, desconfortos posturais ou dor física exigem avaliação médica preventiva. Recomendamos sempre manter o acompanhamento com seu médico veterinário.
            </p>
          </div>
        </div>
      )}

      {/* AI Explanation Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#141517] border border-[#26282c]">
        <div className="flex items-start gap-3">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-0.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 block mb-1">
              DIAGNÓSTICO E DIRECIONAMENTO
            </span>
            <p className="text-sm sm:text-base text-neutral-200 leading-relaxed font-normal">
              {data.explanation}
            </p>
          </div>
        </div>
      </div>

      {/* Mandatory Structured Solutions Sequence (Sections 2, 3, 4, 5, 8) */}
      {structuredSolutions && structuredSolutions.length > 0 ? (
        <div className="space-y-3.5">
          {structuredSolutions.map((sol) => {
            const styles = getSolutionStyles(sol);
            return (
              <div
                key={sol.id}
                className={`relative rounded-[22px] border ${styles.cardBorder} ${styles.cardBg} p-5 sm:p-6 shadow-xl transition-all`}
              >
                {/* Top Badge */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider border flex items-center gap-1.5 ${styles.badgeBg}`}>
                      {renderSolutionIcon(sol.variant, sol.iconName)}
                      {sol.badge || (sol.isPrimary ? 'Opção Prioritária' : `Opção ${sol.order}`)}
                    </span>
                    {sol.isPrimary && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-white/10 text-white">
                        Maior Destaque
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] font-semibold text-neutral-400">
                    {data.problemCategory}
                  </span>
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                    {sol.title}
                  </h3>
                  {sol.subtitle && (
                    <p className="text-xs sm:text-sm font-medium text-neutral-300">
                      "{sol.subtitle}"
                    </p>
                  )}
                  <p className="text-xs sm:text-sm text-[#cbd0d6] leading-relaxed">
                    {sol.description}
                  </p>
                </div>

                {/* CTA Button */}
                <div className="pt-4 mt-3 border-t border-white/10 flex items-center justify-between gap-3">
                  <a
                    href={sol.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackChannelClick(sol.id, sol.title, sol.link)}
                    className={`py-2.5 px-5 rounded-xl font-semibold text-xs sm:text-sm ${styles.buttonBg} transition-all inline-flex items-center justify-center gap-2 shadow-md active:scale-95`}
                  >
                    <span>{sol.buttonText}</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Fallback Single Channel Card */
        channel && (
          <div className="relative rounded-[24px] bg-[#18191b] border border-[#26282c] hover:border-neutral-600 shadow-xl overflow-hidden transition-all">
            <div className="p-5 sm:p-6 pb-0 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#16a34a] text-white flex items-center gap-1.5 shadow-sm">
                  <Sparkles className="w-3.5 h-3.5" />
                  Solução Recomendada
                </span>
                {channel.badge && (
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#222428] text-neutral-300 border border-[#2e3137]">
                    {channel.badge}
                  </span>
                )}
              </div>
              <span className="text-xs font-semibold text-[#8e939b]">
                {data.problemCategory}
              </span>
            </div>

            <div className="p-5 sm:p-6 space-y-4">
              <div>
                <h3 className="text-2xl font-bold text-white tracking-tight leading-snug">
                  {channel.title}
                </h3>
                {channel.callout && (
                  <p className="text-sm text-neutral-300 font-medium mt-1">
                    "{channel.callout}"
                  </p>
                )}
                <p className="mt-2 text-sm text-[#8e939b] leading-relaxed">
                  {channel.description}
                </p>
              </div>

              <div className="pt-4 border-t border-[#26282c] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <a
                  href={channel.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackChannelClick(channel.id, channel.title, channel.link)}
                  className="py-2.5 px-5 rounded-xl font-semibold text-xs sm:text-sm bg-[#16a34a] hover:bg-[#15803d] text-white transition-all flex items-center justify-center gap-2 shadow-md active:scale-95"
                >
                  <span>{channel.buttonText}</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>

                {secondary && (
                  <a
                    href={secondary.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackChannelClick(secondary.id, secondary.title, secondary.link)}
                    className="py-2.5 px-4 rounded-xl font-medium text-xs text-neutral-300 hover:text-white bg-[#222428] hover:bg-[#2b2d33] border border-[#2e3137] transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>Alternativa: {secondary.title}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400" />
                  </a>
                )}
              </div>
            </div>
          </div>
        )
      )}

      {/* Specific Recommended Product (if applicable) */}
      {product && (
        <div className="p-5 rounded-[22px] bg-[#18191b] border border-[#26282c] hover:border-neutral-600 transition-all">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-18 h-18 rounded-xl object-cover bg-neutral-900 border border-[#26282c] shrink-0"
              />
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    Produto: {product.species}
                  </span>
                  <span className="text-xs text-[#8e939b]">{product.category}</span>
                </div>
                <h4 className="font-bold text-base text-white">
                  {product.name}
                </h4>
                <p className="text-xs text-[#8e939b] mt-1 line-clamp-2">
                  {product.description}
                </p>
                {product.price && (
                  <span className="text-xs font-semibold text-emerald-400 mt-1 block">
                    {product.price}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
              <button
                onClick={() => handleProductCardClick(product)}
                className="px-3 py-2 rounded-xl text-xs font-medium bg-[#222428] hover:bg-[#2b2d33] text-neutral-300 hover:text-white border border-[#2e3137] transition-colors"
              >
                Detalhes
              </button>
              <a
                href={product.officialLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => handleOfficialLinkClick(e, product)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#16a34a] hover:bg-[#15803d] text-white flex items-center gap-1 shadow-sm transition-all"
              >
                <span>Acessar</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Follow-up / Continuation Options */}
      {data.followUpOptions && data.followUpOptions.length > 0 && (
        <div className="pt-2">
          <span className="text-xs font-semibold text-[#8e939b] block mb-2 flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
            Como você deseja continuar com a assistente?
          </span>

          <div className="flex flex-wrap gap-2">
            {data.followUpOptions.map((option, idx) => (
              <button
                key={idx}
                onClick={() => onFollowUp(option)}
                className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-[#18191b] hover:bg-[#222428] text-neutral-300 hover:text-white border border-[#26282c] hover:border-neutral-500 transition-all active:scale-[0.98]"
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

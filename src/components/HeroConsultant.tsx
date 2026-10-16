import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Sparkles, HelpCircle } from 'lucide-react';
import { Shortcut, AiConfig } from '../types.js';
import { TrainerCarousel } from './TrainerCarousel.js';

interface HeroConsultantProps {
  config: AiConfig;
  shortcuts: Shortcut[];
  onStartConsultation: (prompt: string, shortcutCategory?: string) => void;
  isLoading: boolean;
}

export const HeroConsultant: React.FC<HeroConsultantProps> = ({
  config,
  shortcuts,
  onStartConsultation,
  isLoading
}) => {
  const [problemText, setProblemText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!problemText.trim() || isLoading) return;
    onStartConsultation(problemText.trim());
    setProblemText('');
  };

  const handleShortcutClick = (prompt: string, category?: string) => {
    if (isLoading) return;
    onStartConsultation(prompt, category);
  };

  // Ensure "Qual brinquedo é mais indicado para o meu pet?" is always present as mandated in Section 8
  const hasToyShortcut = shortcuts.some(
    (s) => s.label.toLowerCase().includes('brinquedo') || s.prompt.toLowerCase().includes('brinquedo')
  );

  return (
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center pt-1 sm:pt-3">
      {/* Left Column: Conversational Area */}
      <div className="lg:col-span-7 flex flex-col justify-center space-y-4 sm:space-y-5">
        {/* Top Trainer Identity & Verified Badge */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 shadow-sm">
            <img
              src="https://i.ibb.co/CKXP3vRs/IMG-7987.jpg"
              alt="Gabriel Soares"
              className="w-5 h-5 sm:w-6 sm:h-6 rounded-full object-cover object-top border border-emerald-400"
            />
            <span className="text-[11px] sm:text-xs font-semibold text-white">
              Gabriel • Adestrador de Cães e Gatos
            </span>
          </div>

          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-bold text-emerald-300 bg-emerald-500/15 border border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            10 Anos de Experiência
          </span>
        </div>

        {/* Display headline */}
        <div>
          <h1 className="text-2xl sm:text-4xl lg:text-[46px] font-bold text-white tracking-tight leading-snug font-serif">
            {config.greetingTitle || 'Especialista em Comportamento Pet'}
          </h1>
          <p className="text-xs sm:text-sm text-neutral-200/90 font-normal leading-relaxed max-w-xl mt-1.5">
            {config.greetingSubtitle ||
              'Conte o que está acontecendo com seu cão ou gato. Nosso assistente inteligente identifica a necessidade e direciona para a melhor solução.'}
          </p>
        </div>

        {/* Search / Question input container */}
        <div className="w-full pt-0.5">
          <form
            onSubmit={handleSubmit}
            className="relative rounded-2xl bg-black/25 border border-white/20 focus-within:border-emerald-400 backdrop-blur-md transition-all p-2.5 sm:p-3 shadow-lg"
          >
            <div className="flex items-center gap-2 sm:gap-3">
              <input
                type="text"
                value={problemText}
                onChange={(e) => setProblemText(e.target.value)}
                placeholder={
                  config.inputPlaceholder ||
                  'Ex.: meu gato arranha o sofá, cachorro puxa a guia ou quero aprender a adestrar...'
                }
                disabled={isLoading}
                className="w-full bg-transparent text-white placeholder-neutral-300 text-xs sm:text-sm focus:outline-none px-2 py-1"
              />

              <button
                type="submit"
                disabled={!problemText.trim() || isLoading}
                aria-label="Enviar pergunta"
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#16a34a] hover:bg-[#15803d] disabled:bg-white/10 disabled:text-neutral-500 disabled:cursor-not-allowed text-white active:scale-95 transition-all flex items-center justify-center shrink-0 shadow-md cursor-pointer"
              >
                <ArrowRight className="w-4 h-4 text-white" />
              </button>
            </div>
          </form>
        </div>

        {/* Quick Suggestion Pills */}
        <div className="space-y-1.5 pt-0.5">
          <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-neutral-300 block">
            Sugestões rápidas de perguntas:
          </span>

          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {/* Mandatory Toy Recommendation Pill */}
            <button
              onClick={() => handleShortcutClick('Qual brinquedo é mais indicado para o meu pet?', 'Brinquedos & Enriquecimento')}
              disabled={isLoading}
              className="px-3 py-1.5 rounded-full text-xs font-semibold text-white bg-white/15 hover:bg-white/25 border border-white/30 transition-all text-left flex items-center gap-1.5 active:scale-95 disabled:opacity-50 shadow-sm cursor-pointer"
            >
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>Qual brinquedo é mais indicado para o meu pet?</span>
            </button>

            {/* Cat priority shortcut */}
            <button
              onClick={() => handleShortcutClick('Quero melhorar o comportamento do meu gato', 'Comportamento Felino')}
              disabled={isLoading}
              className="px-3 py-1.5 rounded-full text-xs font-medium text-emerald-200 bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-500/30 transition-all text-left active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              Quero melhorar o comportamento do meu gato
            </button>

            {/* Other shortcuts */}
            {shortcuts
              .filter(
                (s) =>
                  !s.label.toLowerCase().includes('qual brinquedo') &&
                  s.label !== 'Quero melhorar o comportamento do meu gato'
              )
              .slice(0, 3)
              .map((shortcut) => (
                <button
                  key={shortcut.id}
                  onClick={() => handleShortcutClick(shortcut.prompt, shortcut.category)}
                  disabled={isLoading}
                  className="px-3 py-1.5 rounded-full text-xs font-medium text-neutral-200 hover:text-white bg-white/10 hover:bg-white/15 border border-white/15 transition-all text-left active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  {shortcut.label}
                </button>
              ))}
          </div>
        </div>
      </div>

      {/* Right Column: Carousel of Photographs of Gabriel */}
      <div className="lg:col-span-5 w-full flex justify-center lg:justify-end">
        <TrainerCarousel />
      </div>
    </section>
  );
};

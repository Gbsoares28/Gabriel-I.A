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
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center pt-2 sm:pt-4">
      {/* Left Column: Conversational Area matching reference identity */}
      <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
        {/* Top Trainer Identity & Verified Badge matching paleta de cores.png */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-[#18191b] border border-[#26282c]">
            <img
              src="https://i.ibb.co/CKXP3vRs/IMG-7987.jpg"
              alt="Gabriel Soares"
              className="w-6 h-6 rounded-full object-cover object-top border border-emerald-500/40"
            />
            <span className="text-[12px] font-semibold text-neutral-300">
              Gabriel - Adestrador de cães e gatos
            </span>
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/25">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            Especialista única
          </span>
        </div>

        {/* Display headline */}
        <div>
          <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-bold text-white tracking-tight leading-[1.08] font-serif">
            {config.greetingTitle || 'Especialista em Comportamento Pet'}
          </h1>
          <p className="text-base sm:text-lg text-[#8e939b] font-normal leading-relaxed max-w-xl mt-3">
            {config.greetingSubtitle ||
              'Conte o que está acontecendo com seu cão ou gato. Nosso assistente inteligente identifica a necessidade e direciona para a melhor solução.'}
          </p>
        </div>

        {/* Search / Question input container */}
        <div className="w-full pt-1">
          <label className="text-xs font-semibold text-[#8e939b] block mb-2">
            Sua pergunta sobre cães ou gatos
          </label>

          <form
            onSubmit={handleSubmit}
            className="relative rounded-2xl bg-[#16171a] border border-[#2a2c31] focus-within:border-[#16a34a] transition-all p-3 sm:p-3.5 shadow-lg"
          >
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={problemText}
                onChange={(e) => setProblemText(e.target.value)}
                placeholder={
                  config.inputPlaceholder ||
                  'Ex.: meu gato arranha o sofá, cachorro puxa a guia ou quero aprender a adestrar...'
                }
                disabled={isLoading}
                className="w-full bg-transparent text-white placeholder-neutral-500 text-sm sm:text-base focus:outline-none px-2 py-1"
              />

              <button
                type="submit"
                disabled={!problemText.trim() || isLoading}
                aria-label="Enviar pergunta"
                className="w-12 h-12 rounded-xl bg-[#16a34a] hover:bg-[#15803d] disabled:bg-[#222428] disabled:text-neutral-600 disabled:cursor-not-allowed text-white active:scale-95 transition-all flex items-center justify-center shrink-0 shadow-md"
              >
                <ArrowRight className="w-5 h-5 text-white" />
              </button>
            </div>
          </form>
        </div>

        {/* Text Pills & Mandatory Suggestion Question (Section 8) */}
        <div className="space-y-2 pt-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 block">
            Sugestões rápidas de perguntas:
          </span>

          <div className="flex flex-wrap gap-2">
            {/* Mandatory Section 8 Toy Recommendation Pill */}
            <button
              onClick={() => handleShortcutClick('Qual brinquedo é mais indicado para o meu pet?', 'Brinquedos & Enriquecimento')}
              disabled={isLoading}
              className="px-3.5 py-2 rounded-full text-xs font-semibold text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition-all text-left flex items-center gap-1.5 active:scale-98 disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Qual brinquedo é mais indicado para o meu pet?</span>
            </button>

            {/* Cat priority shortcut */}
            <button
              onClick={() => handleShortcutClick('Quero melhorar o comportamento do meu gato', 'Comportamento Felino')}
              disabled={isLoading}
              className="px-3.5 py-2 rounded-full text-xs font-medium text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 transition-all text-left active:scale-98 disabled:opacity-50"
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
              .slice(0, 4)
              .map((shortcut) => (
                <button
                  key={shortcut.id}
                  onClick={() => handleShortcutClick(shortcut.prompt, shortcut.category)}
                  disabled={isLoading}
                  className="px-3.5 py-2 rounded-full text-xs font-medium text-[#b0b4ba] hover:text-white bg-[#18191b] hover:bg-[#222428] border border-[#26282c] hover:border-neutral-600 transition-all text-left active:scale-98 disabled:opacity-50"
                >
                  {shortcut.label}
                </button>
              ))}
          </div>
        </div>
      </div>

      {/* Right Column: Section 7 - Carousel of 9 Photographs of Gabriel */}
      <div className="lg:col-span-5 w-full flex justify-center lg:justify-end">
        <TrainerCarousel />
      </div>
    </section>
  );
};

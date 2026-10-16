import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Star,
  Instagram,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Clock,
  Sparkles,
  Pause,
  Play
} from 'lucide-react';
import { Testimonial, AiConfig } from '../types.js';

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
  config: AiConfig;
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({
  testimonials,
  config
}) => {
  const authorizedList = useMemo(() => testimonials.filter((t) => t.authorized), [testimonials]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [expandedReviews, setExpandedReviews] = useState<Record<string, boolean>>({});

  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Responsive itemsPerPage calculation
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerPage(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerPage(2);
      } else {
        setItemsPerPage(3);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const totalPages = Math.max(1, Math.ceil(authorizedList.length / itemsPerPage));

  // Reset index if out of bounds
  useEffect(() => {
    if (currentIndex >= totalPages) {
      setCurrentIndex(0);
    }
  }, [totalPages, currentIndex]);

  // Autoplay functionality with pause on hover / touch / while reading expanded review
  const hasAnyExpanded = Object.values(expandedReviews).some(Boolean);

  useEffect(() => {
    // Check prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) return;

    if (isPaused || hasAnyExpanded || totalPages <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalPages);
    }, 4800);

    return () => clearInterval(timer);
  }, [isPaused, hasAnyExpanded, totalPages]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? totalPages - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % totalPages);
  };

  const toggleExpandReview = (id: string) => {
    setExpandedReviews((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Touch swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsPaused(true);
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    setIsPaused(false);
    if (!touchStartX.current || !touchEndX.current) return;
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 45) {
      handleNext();
    } else if (diff < -45) {
      handlePrev();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  if (authorizedList.length === 0) return null;

  return (
    <section
      className="space-y-4 sm:space-y-5 pt-2 select-none"
      aria-label="Depoimentos e Avaliações de Clientes"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Header & Controls (Section 6: rating summary 5.0 / 18 reviews completely removed) */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 text-center sm:text-left">
        <div>
          <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-emerald-400 block mb-1">
            TRANSFORMAÇÕES REAIS
          </span>

          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-tight font-serif">
            O que dizem os clientes
          </h2>
          <p className="text-xs sm:text-sm text-neutral-300/80 mt-1 max-w-xl leading-relaxed">
            Resultados construídos com paciência, técnica positiva e respeito ao tempo de cada animal.
          </p>
        </div>

        {/* Action button & Navigation arrows */}
        <div className="flex items-center justify-center sm:justify-end gap-2.5 self-center sm:self-auto pt-1 sm:pt-0">
          <a
            href={config.instagramUrl || 'https://www.instagram.com/gabrieltreinadordeanimais/'}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#18191b]/90 hover:bg-[#222428] border border-white/10 text-neutral-200 hover:text-white transition-all group backdrop-blur-sm"
          >
            <Instagram className="w-3.5 h-3.5 text-pink-500" />
            <span>Instagram</span>
            <ArrowUpRight className="w-3 h-3 text-neutral-400 group-hover:text-white transition-transform" />
          </a>

          {/* Prev / Next Buttons */}
          <div className="flex items-center gap-1 bg-[#18191b]/90 p-1 rounded-full border border-white/10 backdrop-blur-sm">
            <button
              onClick={handlePrev}
              aria-label="Depoimento anterior"
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-neutral-300 hover:text-white hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              aria-label="Próximo depoimento"
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-neutral-300 hover:text-white hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Modern Compact Carousel Container */}
      <div
        ref={containerRef}
        className="relative overflow-hidden rounded-[22px]"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex transition-transform duration-500 ease-out will-change-transform"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`
          }}
        >
          {Array.from({ length: totalPages }).map((_, pageIdx) => {
            const pageItems = authorizedList.slice(
              pageIdx * itemsPerPage,
              (pageIdx + 1) * itemsPerPage
            );

            return (
              <div
                key={pageIdx}
                className="w-full shrink-0 grid gap-3 sm:gap-4"
                style={{
                  gridTemplateColumns: `repeat(${itemsPerPage}, minmax(0, 1fr))`
                }}
              >
                {pageItems.map((item) => {
                  const isExpanded = Boolean(expandedReviews[item.id]);
                  const isLongQuote = item.quote.length > 180;

                  return (
                    <div
                      key={item.id}
                      className="p-4 sm:p-5 rounded-[20px] bg-black/25 backdrop-blur-md border border-white/15 hover:border-white/25 transition-all flex flex-col justify-between space-y-3.5 shadow-md"
                    >
                      {/* Top Row: 5 Stars & Tags */}
                      <div className="space-y-2.5">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          {/* 5 Stars */}
                          <div className="flex items-center gap-1 text-amber-400">
                            {[...Array(item.rating || 5)].map((_, i) => (
                              <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            ))}
                          </div>

                          {/* Badges container */}
                          <div className="flex flex-wrap items-center gap-1.5">
                            {item.highlight && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/25">
                                <Sparkles className="w-2.5 h-2.5" />
                                {item.highlight}
                              </span>
                            )}

                            {item.publishedAt && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-medium text-neutral-400 bg-white/5 px-2 py-0.5 rounded-full border border-white/10">
                                <Clock className="w-2.5 h-2.5" />
                                {item.publishedAt}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Quote text with expand option */}
                        <div className="space-y-1.5">
                          <p
                            className={`text-xs sm:text-sm text-neutral-200 leading-relaxed font-normal ${
                              !isExpanded && isLongQuote ? 'line-clamp-4' : ''
                            }`}
                          >
                            "{item.quote}"
                          </p>

                          {isLongQuote && (
                            <button
                              type="button"
                              onClick={() => toggleExpandReview(item.id)}
                              className="text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 transition-colors inline-block cursor-pointer pt-0.5"
                            >
                              {isExpanded ? 'Recolher avaliação' : 'Ler avaliação completa'}
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Author & Service Footer */}
                      <div className="pt-2.5 border-t border-white/10 flex items-center justify-between gap-2.5">
                        <div className="flex items-center gap-2.5">
                          {item.photoUrl ? (
                            <img
                              src={item.photoUrl}
                              alt={item.authorName}
                              loading="lazy"
                              className="w-8 h-8 rounded-full object-cover border border-white/20 shrink-0"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#4a0d24] to-[#250410] border border-white/20 flex items-center justify-center text-white font-bold text-xs shrink-0">
                              {item.authorName.charAt(0)}
                            </div>
                          )}

                          <div className="min-w-0">
                            <h4 className="font-bold text-xs sm:text-sm text-white truncate flex items-center gap-1">
                              <span>{item.authorName}</span>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            </h4>
                            <p className="text-[11px] text-neutral-300/80 truncate">
                              {item.petInfo}
                            </p>
                          </div>
                        </div>

                        {item.service && (
                          <span className="hidden xs:inline-block text-[10px] text-neutral-300 bg-white/5 px-2 py-0.5 rounded-md border border-white/10 shrink-0">
                            {item.service}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {/* Dots and Controls */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-1.5">
          {Array.from({ length: totalPages }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Ir para avaliação ${idx + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                idx === currentIndex
                  ? 'w-6 bg-emerald-500'
                  : 'w-2 bg-white/20 hover:bg-white/40'
              }`}
            />
          ))}
        </div>

        <div className="flex items-center gap-2 text-[11px] text-neutral-400">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
            title={isPaused ? 'Retomar reprodução automática' : 'Pausar reprodução automática'}
          >
            {isPaused ? <Play className="w-3 h-3 text-emerald-400" /> : <Pause className="w-3 h-3" />}
            <span className="hidden sm:inline">{isPaused ? 'Pausado' : 'Automático'}</span>
          </button>
          <span>•</span>
          <span>
            {currentIndex + 1} / {totalPages}
          </span>
        </div>
      </div>
    </section>
  );
};

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
  const [itemsPerPage, setItemsPerPage] = useState(2);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

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

  // Autoplay functionality with pause on hover
  useEffect(() => {
    if (isPaused || totalPages <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalPages);
    }, 6000);

    return () => clearInterval(timer);
  }, [isPaused, totalPages]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? totalPages - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % totalPages);
  };

  // Touch swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 50) {
      handleNext();
    } else if (diff < -50) {
      handlePrev();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  if (authorizedList.length === 0) return null;

  return (
    <section
      className="space-y-6 pt-6 select-none"
      aria-label="Depoimentos e Avaliações de Clientes"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[12px] font-bold uppercase tracking-wider text-emerald-400">
              TRANSFORMAÇÕES REAIS
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-neutral-400 bg-[#1e2024] px-2.5 py-0.5 rounded-full border border-[#2a2d33]">
              <Star className="w-3 h-3 text-[#ea580c] fill-[#ea580c]" />
              <span>5.0 • {authorizedList.length} avaliações</span>
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-bold text-white tracking-tight leading-tight font-serif">
            O que dizem os clientes
          </h2>
          <p className="text-sm sm:text-base text-[#8e939b] mt-1.5 max-w-xl leading-relaxed">
            Resultados construídos com paciência, técnica positiva e respeito mútuo ao tempo de cada cão e gato.
          </p>
        </div>

        {/* Action button & Navigation arrows */}
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <a
            href={config.instagramUrl || 'https://www.instagram.com/gabrieltreinadordeanimais/'}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-semibold bg-[#18191b] hover:bg-[#222428] border border-[#26282c] text-neutral-300 hover:text-white transition-all group"
          >
            <Instagram className="w-3.5 h-3.5 text-[#ea580c]" />
            <span className="hidden xs:inline">Instagram</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-white transition-transform" />
          </a>

          {/* Prev / Next Buttons */}
          <div className="flex items-center gap-1.5 bg-[#18191b] p-1 rounded-full border border-[#26282c]">
            <button
              onClick={handlePrev}
              aria-label="Depoimento anterior"
              className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-300 hover:text-white hover:bg-[#25282d] active:scale-95 transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              aria-label="Próximo depoimento"
              className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-300 hover:text-white hover:bg-[#25282d] active:scale-95 transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Modern Compact Carousel Container */}
      <div
        className="relative overflow-hidden rounded-[26px]"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex transition-transform duration-500 ease-out"
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
                className="w-full shrink-0 grid gap-4"
                style={{
                  gridTemplateColumns: `repeat(${itemsPerPage}, minmax(0, 1fr))`
                }}
              >
                {pageItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-5 sm:p-6 rounded-[22px] bg-[#18191b] border border-[#26282c] hover:border-[#383b42] transition-all flex flex-col justify-between space-y-4 shadow-sm hover:shadow-md"
                  >
                    {/* Top Row: Stars, Badge, Published Date */}
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        {/* 5 Stars */}
                        <div className="flex items-center gap-1 text-[#ea580c]">
                          {[...Array(item.rating || 5)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-[#ea580c]" />
                          ))}
                        </div>

                        {/* Badges container */}
                        <div className="flex flex-wrap items-center gap-1.5">
                          {item.highlight && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/25">
                              <Sparkles className="w-2.5 h-2.5" />
                              {item.highlight}
                            </span>
                          )}

                          {item.publishedAt && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-medium text-neutral-400 bg-[#222428] px-2 py-0.5 rounded-full border border-[#2e3137]">
                              <Clock className="w-2.5 h-2.5" />
                              {item.publishedAt}
                            </span>
                          )}

                          {item.context && !item.publishedAt && (
                            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 bg-[#222428] px-2.5 py-0.5 rounded-full border border-[#2e3137]">
                              {item.context}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Quote text */}
                      <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed font-normal line-clamp-6">
                        "{item.quote}"
                      </p>
                    </div>

                    {/* Author & Service Footer */}
                    <div className="pt-3 border-t border-[#26282c] flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        {item.photoUrl ? (
                          <img
                            src={item.photoUrl}
                            alt={item.authorName}
                            className="w-9 h-9 rounded-full object-cover border border-[#26282c]"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#2a2c30] to-[#1e2023] border border-[#33363c] flex items-center justify-center text-white font-bold text-xs shadow-inner">
                            {item.authorName.charAt(0)}
                          </div>
                        )}

                        <div className="min-w-0">
                          <h4 className="font-bold text-xs sm:text-sm text-white truncate flex items-center gap-1">
                            <span>{item.authorName}</span>
                            <span title="Avaliação Verificada" className="inline-flex items-center">
                              <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                            </span>
                          </h4>
                          <p className="text-[11px] text-[#8e939b] truncate">
                            {item.petInfo}
                          </p>
                        </div>
                      </div>

                      {item.service && (
                        <span className="hidden xl:inline-block text-[10px] text-neutral-400 bg-[#202226] px-2 py-0.5 rounded-md border border-[#2d3036] shrink-0">
                          {item.service}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      {/* Dots and Page Indicator */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-1.5">
          {Array.from({ length: totalPages }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Ir para slide ${idx + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentIndex
                  ? 'w-6 bg-[#ea580c]'
                  : 'w-2 bg-[#2a2d33] hover:bg-[#3d424b]'
              }`}
            />
          ))}
        </div>

        <div className="flex items-center gap-2 text-[11px] text-[#8e939b]">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="flex items-center gap-1 hover:text-white transition-colors"
            title={isPaused ? 'Retomar reprodução automática' : 'Pausar reprodução automática'}
          >
            {isPaused ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
            <span className="hidden sm:inline">{isPaused ? 'Pausado' : 'Automático'}</span>
          </button>
          <span>•</span>
          <span>
            {currentIndex + 1} de {totalPages}
          </span>
        </div>
      </div>
    </section>
  );
};

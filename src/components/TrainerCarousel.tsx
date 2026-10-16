import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play, Sparkles } from 'lucide-react';

interface CarouselPhoto {
  url: string;
  alt: string;
  objectPosition: string;
  label?: string;
}

const TRAINER_PHOTOS: CarouselPhoto[] = [
  {
    url: 'https://i.ibb.co/CKXP3vRs/IMG-7987.jpg',
    alt: 'Gabriel Soares em treinamento e convivência com cachorro',
    objectPosition: 'center 15%',
    label: 'Atendimento & Convivência'
  },
  {
    url: 'https://i.ibb.co/BKwMZtnw/IMG-7562.jpg',
    alt: 'Gabriel Soares em momento de carinho e treino com cão',
    objectPosition: 'center 12%',
    label: 'Conexão e Confiança'
  },
  {
    url: 'https://i.ibb.co/Q3Y8rx6f/IMG-4847.jpg',
    alt: 'Gabriel Soares com cão em atividade educativa',
    objectPosition: 'center 20%',
    label: 'Educação Positiva'
  },
  {
    url: 'https://i.ibb.co/p6H0ZYBp/IMG-3094.jpg',
    alt: 'Gabriel com cão no treino de obediência e foco',
    objectPosition: 'center 18%',
    label: 'Foco & Autocontrole'
  },
  {
    url: 'https://i.ibb.co/B53n7YbW/IMG-2672.jpg',
    alt: 'Gabriel Soares com cachorro em passeio educativo',
    objectPosition: 'center 16%',
    label: 'Passeio sem Puxões'
  },
  {
    url: 'https://i.ibb.co/qFkWcZzx/IMG-1932.jpg',
    alt: 'Gabriel Soares orientando cão em treino comportamental',
    objectPosition: 'center 14%',
    label: 'Manejo Harmonioso'
  },
  {
    url: 'https://i.ibb.co/V0LwMcNy/IMG-9870.jpg',
    alt: 'Gabriel em atendimento de comportamento canino',
    objectPosition: 'center 18%',
    label: 'Socialização Segura'
  },
  {
    url: 'https://i.ibb.co/WvnVwMw0/IMG-7422.jpg',
    alt: 'Gabriel Soares trabalhando bem-estar do pet',
    objectPosition: 'center 16%',
    label: 'Bem-estar Mútuo'
  },
  {
    url: 'https://i.ibb.co/rGrwWnG6/IMG-6101.jpg',
    alt: 'Gabriel Soares interagindo com cão em treinamento',
    objectPosition: 'center 12%',
    label: 'Resultados Duradouros'
  }
];

export const TrainerCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const total = TRAINER_PHOTOS.length;

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Auto-play timer (5s)
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      handleNext();
    }, 5000);
    return () => clearInterval(timer);
  }, [isPaused, handleNext]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      handlePrev();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      handleNext();
    }
  };

  // Touch Swipe handlers
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const onTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (distance > minSwipeDistance) {
      handleNext();
    } else if (distance < -minSwipeDistance) {
      handlePrev();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  const currentPhoto = TRAINER_PHOTOS[currentIndex];

  return (
    <div
      ref={containerRef}
      role="region"
      aria-label="Carrossel de fotos de Gabriel Soares"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      className="relative w-full max-w-md aspect-[4/5] rounded-[30px] overflow-hidden bg-[#16171a] border border-[#2a2c31] shadow-2xl group focus:outline-none focus:ring-2 focus:ring-[#16a34a]/60 select-none"
    >
      {/* Background Images with smooth cross-fade */}
      {TRAINER_PHOTOS.map((photo, index) => {
        const isActive = index === currentIndex;
        return (
          <div
            key={photo.url}
            aria-hidden={!isActive}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            <img
              src={photo.url}
              alt={photo.alt}
              loading={index === 0 ? 'eager' : 'lazy'}
              style={{ objectPosition: photo.objectPosition }}
              className="w-full h-full object-cover transform scale-100 group-hover:scale-[1.02] transition-transform duration-700"
            />
          </div>
        );
      })}

      {/* Atmospheric Vignette Overlay */}
      <div className="absolute inset-0 z-20 pointer-events-none bg-gradient-to-t from-[#0f1011] via-[#0f1011]/30 to-transparent"></div>

      {/* Top Floating Badge */}
      <div className="absolute top-4 left-4 right-4 z-30 flex items-center justify-between pointer-events-auto">
        <span className="px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase bg-[#0f1011]/80 backdrop-blur-md text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5 shadow-sm">
          <Sparkles className="w-3 h-3 text-emerald-400" />
          {currentPhoto.label || 'Especialista em Comportamento'}
        </span>

        <div className="flex items-center gap-1.5 bg-[#0f1011]/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 text-[11px] font-medium text-neutral-300">
          <span>{currentIndex + 1}</span>
          <span className="text-neutral-500">/</span>
          <span className="text-neutral-500">{total}</span>
        </div>
      </div>

      {/* Arrow Controls */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          handlePrev();
        }}
        aria-label="Foto anterior"
        className="absolute left-3 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-[#0f1011]/70 hover:bg-[#16a34a] text-white border border-white/15 backdrop-blur-md flex items-center justify-center transition-all opacity-80 group-hover:opacity-100 active:scale-90"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          handleNext();
        }}
        aria-label="Próxima foto"
        className="absolute right-3 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-[#0f1011]/70 hover:bg-[#16a34a] text-white border border-white/15 backdrop-blur-md flex items-center justify-center transition-all opacity-80 group-hover:opacity-100 active:scale-90"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Bottom Content Area */}
      <div className="absolute bottom-5 left-5 right-5 z-30">
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-white tracking-tight drop-shadow-md">
              Gabriel Soares
            </h3>
            <span className="text-[11px] font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              10 anos de experiência
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#cbd0d6] font-normal leading-relaxed drop-shadow">
            Adestrador de cães e gatos, especialista em comportamento pet
          </p>
        </div>

        {/* Position Indicator Dots */}
        <div className="flex items-center justify-center gap-1.5 pt-3">
          {TRAINER_PHOTOS.map((_, idx) => (
            <button
              key={idx}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(idx);
              }}
              aria-label={`Ir para foto ${idx + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentIndex
                  ? 'w-6 bg-[#16a34a]'
                  : 'w-1.5 bg-white/30 hover:bg-white/60'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { ArrowUpRight, History, ShieldCheck, Sun, MessageSquare, Layers } from 'lucide-react';
import { AiConfig } from '../types.js';

interface HeaderProps {
  config: AiConfig;
  onOpenCatalog?: () => void;
  onOpenAdmin: () => void;
  onOpenHistory: () => void;
  historyCount: number;
  onResetChat?: () => void;
  hasActiveChat?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  config,
  onOpenAdmin,
  onOpenHistory,
  historyCount,
  onResetChat,
  hasActiveChat
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#8d272b]/90 border-b border-white/15 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 sm:h-18 flex items-center justify-between">
        {/* Left: Minimalist brand name */}
        <button
          onClick={onResetChat}
          className="text-left font-bold text-xl sm:text-2xl text-white tracking-tight hover:opacity-90 transition-opacity font-serif cursor-pointer"
        >
          Gabriel
        </button>

        {/* Right: Theme icon + social profile + minimalist actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {hasActiveChat && (
            <button
              onClick={onResetChat}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-white hover:text-white bg-white/10 hover:bg-white/20 border border-white/20 transition-all cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-300" />
              <span className="hidden sm:inline">Nova Pergunta</span>
            </button>
          )}

          {/* User History */}
          <button
            onClick={onOpenHistory}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-white/90 hover:text-white bg-white/10 hover:bg-white/20 border border-white/20 transition-all cursor-pointer"
            title="Ver histórico de conversas"
          >
            <History className="w-3.5 h-3.5 text-emerald-300" />
            <span className="hidden xs:inline">Histórico</span>
            {historyCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-emerald-500 text-white">
                {historyCount}
              </span>
            )}
          </button>

          {/* Instagram Handle with diagonal arrow ↗ */}
          <a
            href={config.instagramUrl || 'https://www.instagram.com/gabrieltreinadordeanimais/'}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs font-medium text-white/90 hover:text-white px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 transition-all group cursor-pointer"
          >
            <span className="hidden sm:inline">@gabrieltreinadordeanimais</span>
            <span className="sm:hidden">Instagram</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-white/70 group-hover:text-white transition-colors" />
          </a>

          {/* Admin link */}
          <button
            onClick={onOpenAdmin}
            className="p-1.5 rounded-full text-white/60 hover:text-white transition-colors cursor-pointer"
            title="Painel Administrativo"
          >
            <ShieldCheck className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};

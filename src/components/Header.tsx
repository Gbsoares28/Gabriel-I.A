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
    <header className="sticky top-0 z-40 w-full bg-[#0f1011]/95 border-b border-[#222427] backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-18 sm:h-20 flex items-center justify-between">
        {/* Left: Minimalist brand name like "Abramo" in screenshot */}
        <button
          onClick={onResetChat}
          className="text-left font-bold text-xl sm:text-2xl text-white tracking-tight hover:opacity-90 transition-opacity"
        >
          Gabriel
        </button>

        {/* Right: Theme icon + social profile + minimalist actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {hasActiveChat && (
            <button
              onClick={onResetChat}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-neutral-300 hover:text-white bg-[#18191b] hover:bg-[#222427] border border-[#282a2e] transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#ea580c]" />
              <span className="hidden sm:inline">Nova Pergunta</span>
            </button>
          )}

          {/* User History */}
          <button
            onClick={onOpenHistory}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-neutral-300 hover:text-white bg-[#18191b] hover:bg-[#222427] border border-[#282a2e] transition-colors"
            title="Ver histórico de conversas"
          >
            <History className="w-3.5 h-3.5 text-[#ea580c]" />
            <span className="hidden xs:inline">Histórico</span>
            {historyCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-[#ea580c] text-white">
                {historyCount}
              </span>
            )}
          </button>

          {/* Theme button icon from reference screenshot */}
          <div className="w-8 h-8 rounded-full bg-[#18191b] border border-[#282a2e] flex items-center justify-center text-neutral-400">
            <Sun className="w-4 h-4" />
          </div>

          {/* Instagram Handle with diagonal arrow ↗ from reference screenshot */}
          <a
            href={config.instagramUrl || 'https://www.instagram.com/gabrieltreinadordeanimais/'}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs font-medium text-neutral-300 hover:text-white px-3 py-1.5 rounded-full bg-[#18191b] hover:bg-[#222427] border border-[#282a2e] transition-colors group"
          >
            <span className="hidden sm:inline">@gabrieltreinadordeanimais</span>
            <span className="sm:hidden">Instagram</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-[#ea580c] transition-colors" />
          </a>

          {/* Admin link */}
          <button
            onClick={onOpenAdmin}
            className="p-1.5 rounded-full text-neutral-500 hover:text-neutral-300 transition-colors"
            title="Painel Administrativo"
          >
            <ShieldCheck className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};

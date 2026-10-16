import React from 'react';
import {
  X,
  History,
  Trash2,
  Calendar,
  MessageSquare,
  Sparkles
} from 'lucide-react';
import { ConsultationSession } from '../types.js';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: ConsultationSession[];
  onSelectSession: (session: ConsultationSession) => void;
  onDeleteSession: (id: string) => void;
  onClearAll: () => void;
  currentSessionId?: string;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  sessions,
  onSelectSession,
  onDeleteSession,
  onClearAll,
  currentSessionId
}) => {
  if (!isOpen) return null;

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();

    const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (isToday) {
      return `Hoje às ${timeStr}`;
    }
    return `${date.toLocaleDateString([], { day: '2-digit', month: '2-digit' })} às ${timeStr}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-[#18191b] border border-[#26282c] rounded-[26px] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-[#26282c] flex items-center justify-between bg-[#121315]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#ea580c]/15 border border-[#ea580c]/30 flex items-center justify-center text-[#ea580c]">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                Histórico de Perguntas & Orientações
              </h2>
              <p className="text-xs text-[#8e939b]">
                Acesse suas conversas anteriores e revisite as recomendações feitas para você e seu pet.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-[#222428] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sessions List */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-3">
          {sessions.length === 0 ? (
            <div className="py-16 text-center text-neutral-500 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#121315] border border-[#26282c] mx-auto flex items-center justify-center text-neutral-600">
                <MessageSquare className="w-6 h-6" />
              </div>
              <p className="text-sm text-neutral-300 font-medium">
                Nenhuma conversa registrada ainda neste navegador.
              </p>
              <p className="text-xs text-[#8e939b] max-w-sm mx-auto">
                Descreva a situação do seu cão ou gato na tela inicial para iniciar seu diagnóstico com a inteligência artificial.
              </p>
            </div>
          ) : (
            sessions.map((session) => {
              const isCurrent = session.id === currentSessionId;
              const hasRec = Boolean(session.recommendedProductName || session.recommendedChannelName);

              return (
                <div
                  key={session.id}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group ${
                    isCurrent
                      ? 'bg-[#222428] border-[#ea580c]/50 shadow-sm'
                      : 'bg-[#121315] border-[#26282c] hover:border-neutral-500 hover:bg-[#161719]'
                  }`}
                >
                  <div className="flex-1 min-w-0 space-y-2">
                    {/* Meta info */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[11px] text-[#8e939b] flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-neutral-500" />
                        {formatDate(session.updatedAt || session.createdAt)}
                      </span>

                      {session.problemCategory && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#222428] text-neutral-300 border border-[#2e3137]">
                          {session.problemCategory}
                        </span>
                      )}

                      <span className="text-[11px] text-[#8e939b]">
                        {session.messages.length} mensagens
                      </span>

                      {isCurrent && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#ea580c]/20 text-[#ea580c] border border-[#ea580c]/40">
                          Sessão Ativa
                        </span>
                      )}
                    </div>

                    {/* Question / Prompt Title */}
                    <h3 className="font-bold text-sm sm:text-base text-white group-hover:text-[#ea580c] transition-colors line-clamp-2">
                      "{session.title}"
                    </h3>

                    {/* Recommendation snippet if exists */}
                    {hasRec && (
                      <div className="mt-2 p-2.5 rounded-xl bg-[#18191b] border border-[#26282c] flex items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-6 h-6 rounded-md bg-[#ea580c]/15 flex items-center justify-center shrink-0">
                            <Sparkles className="w-3.5 h-3.5 text-[#ea580c]" />
                          </div>
                          <div className="truncate">
                            <span className="text-[#8e939b]">Recomendado: </span>
                            <span className="font-semibold text-white">
                              {session.recommendedChannelName || session.recommendedProductName}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <button
                      onClick={() => onSelectSession(session)}
                      className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#ea580c] hover:bg-[#d9480f] text-white transition-all shadow-sm"
                    >
                      Revisitar
                    </button>
                    <button
                      onClick={() => onDeleteSession(session.id)}
                      className="p-2 rounded-xl text-neutral-500 hover:text-rose-400 hover:bg-[#222428] transition-colors"
                      title="Excluir do histórico"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {sessions.length > 0 && (
          <div className="p-4 border-t border-[#26282c] bg-[#121315] flex items-center justify-between">
            <span className="text-xs text-[#8e939b]">
              Total de consultas salvas: <strong className="text-white">{sessions.length}</strong>
            </span>
            <button
              onClick={onClearAll}
              className="text-xs text-rose-400 hover:text-rose-300 transition-colors flex items-center gap-1.5 font-medium"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Limpar todo o histórico
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

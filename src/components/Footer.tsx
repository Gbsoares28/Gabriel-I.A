import React from 'react';
import { MessageCircle, Instagram, Youtube, Facebook, ArrowUpRight } from 'lucide-react';
import { AiConfig, ChannelItem } from '../types.js';

interface FooterProps {
  config: AiConfig;
  channels: ChannelItem[];
  onOpenAdmin: () => void;
  onOpenProducts?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  config,
  channels,
  onOpenAdmin
}) => {
  const currentYear = new Date().getFullYear();
  const produtos = channels.find(c => c.id === 'produtos');
  const produtosLink = produtos?.link || 'https://drive.google.com/file/d/1-wMqvUYwpDE9f35rRf7Y8ChoP3OCLziS/view?usp=drive_link';

  return (
    <footer className="w-full border-t border-[#222427] bg-[#0c0d0e] py-14 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          {/* Brand & Specialty */}
          <div className="space-y-2 max-w-md">
            <h3 className="font-bold text-xl text-white tracking-tight">
              Gabriel - Adestrador de Cães e Gatos
            </h3>
            <p className="text-xs sm:text-sm text-[#ea580c] font-semibold">
              Especialista em Comportamento Pet • 10 anos de experiência
            </p>
            <p className="text-xs text-[#8e939b] leading-relaxed">
              Orientação inteligente e acolhedora para transformar a rotina, o bem-estar e a convivência de famílias com cães e gatos.
            </p>
          </div>

          {/* Direct Channels Links */}
          <div className="flex flex-col sm:flex-row flex-wrap gap-x-6 gap-y-2.5 text-xs font-semibold text-neutral-300">
            <a
              href={`https://api.whatsapp.com/send?phone=${(config.contactWhatsapp || '5521965107060').replace(/\D/g, '')}&text=${encodeURIComponent(config.whatsappDefaultMessage || 'Olá, tudo bem? gostaria de saber mais a respeito de adestramento.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-emerald-400 transition-colors flex items-center gap-1"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              WhatsApp com Gabriel
            </a>

            <a
              href={config.petflowUrl || 'https://clubepetflow360.netlify.app/'}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#ea580c] transition-colors"
            >
              Clube PetFlow 360
            </a>

            <a
              href={`https://api.whatsapp.com/send?phone=${(config.contactWhatsapp || '5521965107060').replace(/\D/g, '')}&text=Ol%C3%A1%2C%20Gabriel!%20Gostaria%20de%20informa%C3%A7%C3%B5es%20sobre%20a%20mentoria%20para%20adestradores.`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-indigo-400 transition-colors"
            >
              Mentoria para Adestradores
            </a>

            <a
              href={produtosLink}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#ea580c] transition-colors text-left flex items-center gap-1"
            >
              <span>Checklist de Enxoval & Produtos</span>
              <ArrowUpRight className="w-3 h-3 text-neutral-400" />
            </a>

            <a
              href={config.youtubeUrl || 'https://www.youtube.com/@gabrieltreinadordeanimais'}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-red-400 transition-colors flex items-center gap-1"
            >
              <Youtube className="w-3.5 h-3.5" />
              YouTube
            </a>

            <a
              href={config.facebookUrl || 'https://www.facebook.com/gabrieltreinadordeanimais'}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-400 transition-colors flex items-center gap-1"
            >
              <Facebook className="w-3.5 h-3.5" />
              Facebook
            </a>

            <a
              href={config.instagramUrl || 'https://www.instagram.com/gabrieltreinadordeanimais/'}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#ea580c] transition-colors flex items-center gap-1"
            >
              <Instagram className="w-3.5 h-3.5" />
              Instagram
            </a>
          </div>
        </div>

        {/* Bottom Credits & Copyright */}
        <div className="pt-8 border-t border-[#222427] flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#8e939b]">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
            <span>
              Todos os direitos reservados © {currentYear} Gabriel - Adestrador de Cães e Gatos.
            </span>
            <button
              onClick={onOpenAdmin}
              className="text-neutral-500 hover:text-[#ea580c] transition-colors text-[11px]"
            >
              Painel Admin
            </button>
          </div>

          {/* Development Credit */}
          <div className="flex items-center gap-2">
            <span>Site criado e desenvolvido por <strong>Feed em Foco 360</strong>.</span>
            <a
              href="https://instagram.com/feedemfoco360"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#ea580c] hover:underline font-semibold inline-flex items-center gap-0.5"
            >
              <span>Conhecer a Agência</span>
              <ArrowUpRight className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

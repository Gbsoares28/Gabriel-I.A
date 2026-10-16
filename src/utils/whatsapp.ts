/**
 * WhatsApp Link Centralized Helper
 * Conforms to Section 10:
 * Format: https://wa.me/NUMERO_COM_DDI?text=TEXTO_CODIFICADO
 * Single reusable configuration with real commercial phone: 5521965107060
 */

export const COMMERCIAL_WHATSAPP_PHONE = '5521965107060';

/**
 * Base helper to create a validated wa.me link with URI encoded text
 */
export function buildWhatsAppUrl(messageText: string, phone: string = COMMERCIAL_WHATSAPP_PHONE): string {
  const cleanPhone = (phone || COMMERCIAL_WHATSAPP_PHONE).replace(/\D/g, '');
  const encoded = encodeURIComponent(messageText);
  return `https://wa.me/${cleanPhone}?text=${encoded}`;
}

/**
 * Section 2: Cat consultation WhatsApp link
 */
export function buildCatConsultationWhatsAppUrl(userQuestion: string = ''): string {
  const detail = userQuestion.trim() ? userQuestion.trim() : '[descreva aqui sua dúvida]';
  const text = `Olá, Gabriel! Acessei seu site e gostaria de conversar sobre o comportamento do meu gato. Minha dúvida é: ${detail}. Você pode me orientar sobre os próximos passos?`;
  return buildWhatsAppUrl(text);
}

/**
 * Section 3: Dog consultation WhatsApp link
 */
export function buildDogConsultationWhatsAppUrl(userQuestion: string = ''): string {
  const detail = userQuestion.trim() ? userQuestion.trim() : '[descreva sua dúvida]';
  const text = `Olá, Gabriel! Vim pelo seu assistente virtual e preciso de ajuda com meu cachorro. O comportamento ou a dificuldade que gostaria de melhorar é: ${detail}. Como você pode me orientar?`;
  return buildWhatsAppUrl(text);
}

/**
 * Section 4: Free PDF WhatsApp link
 */
export function buildFreePdfWhatsAppUrl(): string {
  const text = `Olá, Gabriel! Vim pelo seu site e gostaria de receber o PDF gratuito para ajudar na educação do meu cachorro. Quero aprender a trabalhar melhor o comportamento dele. Como posso receber o material?`;
  return buildWhatsAppUrl(text);
}

/**
 * Section 5: Trainer Mentorship WhatsApp link
 */
export function buildMentorshipWhatsAppUrl(): string {
  const text = `Olá, Gabriel! Tenho interesse na sua mentoria para adestradores e gostaria de entender como funciona, para quem é indicada e quais são os próximos passos.`;
  return buildWhatsAppUrl(text);
}

/**
 * Section 8: Toys and Environmental Enrichment Personalized Recommendation WhatsApp link
 */
export function buildToyConsultationWhatsAppUrl(details?: {
  species?: string;
  age?: string;
  size?: string;
  need?: string;
  toyName?: string;
}): string {
  const species = details?.species || '[cão ou gato]';
  const age = details?.age || '[idade do pet]';
  const size = details?.size || '[porte]';
  const need = details?.need || '[explique o que deseja trabalhar]';
  const toyName = details?.toyName || '[nome ou descrição]';

  const text = `Olá, Gabriel! Vim pelo seu assistente virtual e gostaria de uma indicação de brinquedo ou enriquecimento ambiental para meu pet, baseada na sua experiência.\n\nEspécie: ${species}\nIdade: ${age}\nPorte, quando aplicável: ${size}\nComportamento ou necessidade: ${need}\nBrinquedo ou produto sobre o qual tenho dúvida: ${toyName}\n\nGostaria de saber sua opinião e receber uma indicação adequada para o meu pet.`;

  return buildWhatsAppUrl(text);
}

/**
 * Section 7: Intelligent Pre-Attendance Contextual WhatsApp Message
 */
export interface PreAttendanceData {
  species?: string;
  animals?: string;
  primaryProblem?: string;
  behaviorDetails?: string;
  onsetOrDuration?: string;
  householdContext?: string;
  neighborhood?: string;
  conversationSummary?: string;
}

export function buildPreAttendanceMessage(data: PreAttendanceData): string {
  const parts: string[] = [
    'Olá, Gabriel! Vim pelo assistente virtual do seu site e gostaria de orientação sobre o comportamento do meu pet.'
  ];

  if (data.species && data.species.trim()) {
    parts.push(`\n\n*Espécie:* ${data.species.trim()}`);
  }
  if (data.animals && data.animals.trim()) {
    parts.push(`\n\n*Animais envolvidos:* ${data.animals.trim()}`);
  }
  if (data.primaryProblem && data.primaryProblem.trim()) {
    parts.push(`\n\n*Principal dificuldade:* ${data.primaryProblem.trim()}`);
  }
  if (data.behaviorDetails && data.behaviorDetails.trim()) {
    parts.push(`\n\n*Detalhes do comportamento:* ${data.behaviorDetails.trim()}`);
  }
  if (data.onsetOrDuration && data.onsetOrDuration.trim()) {
    parts.push(`\n\n*Tempo de convivência ou duração do problema:* ${data.onsetOrDuration.trim()}`);
  }
  if (data.householdContext && data.householdContext.trim()) {
    parts.push(`\n\n*Contexto relevante:* ${data.householdContext.trim()}`);
  }
  if (data.neighborhood && data.neighborhood.trim()) {
    parts.push(`\n\n*Bairro:* ${data.neighborhood.trim()}`);
  }
  if (data.conversationSummary && data.conversationSummary.trim()) {
    parts.push(`\n\n*Resumo da conversa:* ${data.conversationSummary.trim()}`);
  }

  parts.push('\n\nGostaria de conversar com você sobre os próximos passos.');

  return parts.join('');
}

export function buildPreAttendanceWhatsAppUrl(data: PreAttendanceData): string {
  const message = buildPreAttendanceMessage(data);
  return buildWhatsAppUrl(message);
}

/**
 * Default general greeting
 */
export function buildDefaultWhatsAppUrl(defaultMessage?: string): string {
  return buildWhatsAppUrl(defaultMessage || 'Olá, tudo bem? gostaria de saber mais a respeito de adestramento.');
}


/**
 * WhatsApp Link Centralized Helper
 * Conforms to Section 10 & Section 7.6:
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
 * Section 7.6: Intelligent Pre-Attendance Contextual WhatsApp Message
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
  const parts: string[] = [];

  const isCat = data.species && data.species.toLowerCase().includes('gato');
  const isDog = data.species && (data.species.toLowerCase().includes('cão') || data.species.toLowerCase().includes('cao'));

  if (isCat) {
    parts.push('Olá, Gabriel! Gostaria de orientação sobre o comportamento do meu pet felino.');
  } else if (isDog) {
    parts.push('Olá, Gabriel! Gostaria de orientação sobre o comportamento do meu cachorro.');
  } else {
    parts.push('Olá, Gabriel! Vim pelo assistente virtual do seu site e gostaria de orientação sobre o comportamento do meu pet.');
  }

  const detailsList: string[] = [];
  if (data.animals && data.animals.trim()) {
    detailsList.push(`Animais: ${data.animals.trim()}`);
  }
  if (data.primaryProblem && data.primaryProblem.trim()) {
    detailsList.push(`Situação relatada: ${data.primaryProblem.trim()}`);
  }
  if (data.behaviorDetails && data.behaviorDetails.trim()) {
    detailsList.push(`Comportamentos: ${data.behaviorDetails.trim()}`);
  }
  if (data.onsetOrDuration && data.onsetOrDuration.trim()) {
    detailsList.push(`Tempo de convivência / duração: ${data.onsetOrDuration.trim()}`);
  }
  if (data.neighborhood && data.neighborhood.trim()) {
    detailsList.push(`Bairro: ${data.neighborhood.trim()}`);
  }

  if (detailsList.length > 0) {
    parts.push('\n\n' + detailsList.join('\n'));
  }

  parts.push('\n\nGostaria de entender quais são os próximos passos para melhorar a convivência.');

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

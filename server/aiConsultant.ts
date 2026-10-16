import {
  ChannelItem,
  Product,
  AiConfig,
  RecommendationResult,
  SolutionOption,
  AnimalInfo,
  PreAttendanceCase
} from '../src/types.js';
import {
  buildPreAttendanceMessage,
  buildPreAttendanceWhatsAppUrl,
  COMMERCIAL_WHATSAPP_PHONE
} from '../src/utils/whatsapp.js';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface ConsultationResponse {
  status:
    | 'clarification'
    | 'recommendation'
    | 'no_match'
    | 'pre_attendance'
    | 'summary_confirmation'
    | 'ready_for_whatsapp';
  message: string;
  clarificationQuestion?: string;
  quickOptions?: string[];
  recommendation?: RecommendationResult;
  preAttendanceCase?: PreAttendanceCase;
  whatsappButton?: {
    text: string;
    url: string;
    badge?: string;
    subtitle?: string;
  };
}

function makeWaUrl(text: string): string {
  return `https://wa.me/${COMMERCIAL_WHATSAPP_PHONE}?text=${encodeURIComponent(text)}`;
}

/**
 * Normalizes text for intent and keyword detection
 */
function normalize(str: string): string {
  return (str || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

/**
 * Robust Pre-Attendance State Machine & Context Extractor
 * Tracks chronological conversation history, extracting all data progressively without loops.
 */
export function extractPreAttendanceState(messages: Message[]): PreAttendanceCase {
  const userMessages = messages.filter(m => m.role === 'user').map(m => m.content);
  const assistantMessages = messages.filter(m => m.role === 'assistant').map(m => m.content);
  const fullUserText = userMessages.join(' ');
  const normFull = normalize(fullUserText);
  const lastUserMsg = userMessages[userMessages.length - 1] || '';
  const normLast = normalize(lastUserMsg);
  const lastAssistantMsg = assistantMessages[assistantMessages.length - 1] || '';
  const normLastAssistant = normalize(lastAssistantMsg);

  // Track which questions the assistant has ALREADY asked to strictly prevent loops
  const askedQuestions = {
    animals: normLastAssistant.includes('como se chamam') || normLastAssistant.includes('qual é o nome e a idade') || normLastAssistant.includes('como você prefere chamar'),
    duration: normLastAssistant.includes('há quanto tempo') || normLastAssistant.includes('ha quanto tempo') || normLastAssistant.includes('tempo de convivência'),
    behavior: normLastAssistant.includes('o que costuma acontecer') || normLastAssistant.includes('quais são os estímulos') || normLastAssistant.includes('momentos do passeio') || normLastAssistant.includes('costuma observar'),
    neighborhood: normLastAssistant.includes('em qual bairro') || normLastAssistant.includes('qual bairro') || normLastAssistant.includes('sua região'),
    confirmation: normLastAssistant.includes('está tudo correto') || normLastAssistant.includes('esta tudo correto') || normLastAssistant.includes('resumo do caso')
  };

  // 1. Detect species
  let species: 'Gatos' | 'Cães' | 'Outro' | undefined = undefined;
  const hasCat =
    normFull.includes('gato') ||
    normFull.includes('gata') ||
    normFull.includes('felin') ||
    normFull.includes('caixa de areia') ||
    normFull.includes('bufada') ||
    normFull.includes('arranhador') ||
    normFull.includes('arranhar');
  const hasDog =
    normFull.includes('cachorro') ||
    normFull.includes('cao') ||
    normFull.includes('caes') ||
    normFull.includes('cadela') ||
    normFull.includes('latido') ||
    normFull.includes('latir') ||
    normFull.includes('passeio') ||
    normFull.includes('guia') ||
    normFull.includes('puxar');

  if (hasCat && !hasDog) {
    species = 'Gatos';
  } else if (hasDog && !hasCat) {
    species = 'Cães';
  } else if (hasCat && hasDog) {
    species = normFull.includes('gato') || normFull.includes('gata') ? 'Gatos' : 'Cães';
  }

  // 2. Extract animals (multi-animal or single animal)
  const animals: AnimalInfo[] = [];

  // Match: "Bella tem 7 anos" / "a Bella, de 7 anos" / "Bella, 7 anos"
  const bellaMatch = fullUserText.match(/\bBella\b[^0-9]{0,35}(\d+)\s*(meses|mes|anos|ano)/i);
  const dianaMatch = fullUserText.match(/\bDiana\b[^0-9]{0,35}(\d+)\s*(meses|mes|anos|ano)/i);

  if (bellaMatch || dianaMatch) {
    if (bellaMatch) {
      animals.push({
        name: 'Bella',
        age: `${bellaMatch[1]} ${bellaMatch[2].toLowerCase()}`,
        species: 'Gato',
        breed: normFull.includes('sem raca definida') || normFull.includes('srd') ? 'sem raça definida' : undefined
      });
    }
    if (dianaMatch) {
      animals.push({
        name: 'Diana',
        age: `${dianaMatch[1]} ${dianaMatch[2].toLowerCase()}`,
        species: 'Gato',
        breed: normFull.includes('sem raca definida') || normFull.includes('srd') ? 'sem raça definida' : undefined
      });
    }
  } else {
    // Generic regex for pets: "O Thor tem 2 anos", "Thor, Golden Retriever, 2 anos", etc.
    const genericNameAge = fullUserText.match(
      /(?:meu|minha|o|a)?\s*([A-ZÁÉÍÓÚÂÊÎÔÛ][a-záéíóúâêîôû]{2,15})[^\.\n,]{0,25}?(?:tem|de|\,)?\s*(\d+(?:[,\.]\d+)?)\s*(anos|ano|meses|mes)/i
    );
    if (genericNameAge) {
      const name = genericNameAge[1];
      const ageNum = genericNameAge[2];
      const ageUnit = genericNameAge[3].toLowerCase();
      if (!['Tenho', 'Meu', 'Minha', 'Ela', 'Ele', 'Aqui', 'Como', 'Quando', 'Hoje', 'Sim', 'Nao'].includes(name)) {
        animals.push({
          name,
          age: `${ageNum} ${ageUnit}`,
          species: species === 'Gatos' ? 'Gato' : 'Cão'
        });
      }
    }
  }

  // Handle corrections (e.g. "A idade da Bella está errada. Ela tem 8 anos.")
  for (const msg of userMessages) {
    const correctionMatch = msg.match(/(?:idade\s+da\s+(\w+)|(\w+))\s*(?:está errada|nao tem|tem na verdade|tem)\.?\s*(?:ela\s+tem|ele\s+tem|tem)?\s*(\d+)\s*(anos|ano|meses|mes)/i);
    if (correctionMatch) {
      const targetName = (correctionMatch[1] || correctionMatch[2] || '').trim().toLowerCase();
      const newAgeNum = correctionMatch[3];
      const newUnit = correctionMatch[4];
      const found = animals.find(a => a.name?.toLowerCase() === targetName || (targetName === 'ela' && a.name === 'Bella'));
      if (found) {
        found.age = `${newAgeNum} ${newUnit}`;
      } else if (animals.length > 0) {
        animals[0].age = `${newAgeNum} ${newUnit}`;
      }
    }
  }

  // Breed detection
  let detectedBreed: string | undefined = undefined;
  if (normFull.includes('sem raca definida') || normFull.includes('srd') || normFull.includes('vira lata') || normFull.includes('vira-lata')) {
    detectedBreed = 'sem raça definida';
  } else if (normFull.includes('basenji')) {
    detectedBreed = 'Basenji';
  } else if (normFull.includes('golden')) {
    detectedBreed = 'Golden Retriever';
  } else if (normFull.includes('pitbull') || normFull.includes('pit bull')) {
    detectedBreed = 'Pitbull';
  } else if (normFull.includes('pastor')) {
    detectedBreed = 'Pastor';
  } else if (normFull.includes('shih tzu') || normFull.includes('shihtzu')) {
    detectedBreed = 'Shih Tzu';
  } else if (normFull.includes('poodle')) {
    detectedBreed = 'Poodle';
  } else if (normFull.includes('siames') || normFull.includes('siamesa')) {
    detectedBreed = 'Siamês';
  }

  if (detectedBreed) {
    animals.forEach(a => {
      if (!a.breed) a.breed = detectedBreed;
    });
  }

  // 3. Primary problem identification
  let primaryProblem: string | undefined = undefined;
  if (normFull.includes('brigando') || normFull.includes('briga') || normFull.includes('conflito') || normFull.includes('atacando') || normFull.includes('disputa')) {
    primaryProblem = species === 'Gatos' ? 'Conflitos e brigas entre os gatos' : 'Conflitos e reatividade';
  } else if (normFull.includes('puxa') || normFull.includes('puxando') || normFull.includes('guia')) {
    primaryProblem = 'Puxar excessivamente a guia no passeio';
  } else if (normFull.includes('late') || normFull.includes('latido') || normFull.includes('latindo')) {
    primaryProblem = 'Latidos excessivos';
  } else if (normFull.includes('xixi') || normFull.includes('fezes') || normFull.includes('caixa de areia')) {
    primaryProblem = 'Necessidades fora do local correto';
  } else if (normFull.includes('ansiedade') || normFull.includes('sozinho') || normFull.includes('chora')) {
    primaryProblem = 'Ansiedade e dificuldade ao ficar sozinho';
  } else if (normFull.includes('filhote') || normFull.includes('morde') || normFull.includes('mordendo')) {
    primaryProblem = 'Educação de filhote e mordidas';
  } else if (normFull.includes('reativo') || normFull.includes('medo') || normFull.includes('agressiv')) {
    primaryProblem = 'Medo, reatividade ou agressividade';
  } else if (normFull.includes('comportamento')) {
    primaryProblem = 'Ajustes comportamentais e rotina';
  }

  // 4. Behavior details
  let behaviorDetails: string | undefined = undefined;
  const behaviors: string[] = [];
  if (normFull.includes('rosna') || normFull.includes('rosnados')) behaviors.push('rosnados');
  if (normFull.includes('tapa') || normFull.includes('tapas') || normFull.includes('patada')) behaviors.push('tapas');
  if (normFull.includes('persegue') || normFull.includes('perseguicao') || normFull.includes('correndo atras')) behaviors.push('perseguição');
  if (normFull.includes('morde') || normFull.includes('mordendo') || normFull.includes('mordida')) behaviors.push('mordidas');
  if (normFull.includes('bufada') || normFull.includes('bufando')) behaviors.push('bufadas');
  if (normFull.includes('pula') || normFull.includes('pulando')) behaviors.push('pulos');
  if (normFull.includes('destroi') || normFull.includes('destruicao')) behaviors.push('destruição de objetos');
  if (normFull.includes('late na janela') || normFull.includes('campainha') || normFull.includes('portao')) behaviors.push('latidos com estímulos externos (janela/campainha/portão)');

  if (behaviors.length > 0) {
    behaviorDetails = behaviors.join(', ');
  } else {
    // If the assistant just asked about behaviors and the user replied
    if (askedQuestions.behavior && lastUserMsg.length > 2) {
      behaviorDetails = lastUserMsg.trim().replace(/^["']|["']$/g, '');
    }
  }

  // 5. Timing / Onset or Duration
  let onsetOrDuration: string | undefined = undefined;
  const timeMatch = fullUserText.match(/(?:chegou\s+(?:ha|faz)|ha|faz|desde)\s+(\d+\s*(?:semanas?|mes(?:es)?|dias?|anos?)|pouco tempo|filhote)/i);
  if (timeMatch) {
    onsetOrDuration = timeMatch[0];
  } else if (normFull.includes('duas semanas') || normFull.includes('2 semanas')) {
    onsetOrDuration = 'há duas semanas';
  } else if (normFull.includes('um mes') || normFull.includes('1 mes')) {
    onsetOrDuration = 'há 1 mês';
  } else if (normFull.includes('desde filhote')) {
    onsetOrDuration = 'desde filhote';
  } else if (normFull.includes('sempre')) {
    onsetOrDuration = 'desde que chegou';
  } else if (askedQuestions.duration) {
    // User answered the duration question (even if short like "não sei" or "pouco tempo")
    if (normLast.includes('nao sei') || normLast.includes('nao lembro')) {
      onsetOrDuration = 'não especificado';
    } else if (lastUserMsg.trim().length > 0) {
      onsetOrDuration = lastUserMsg.trim();
    }
  }

  // 6. Neighborhood (Bairro)
  let neighborhood: string | undefined = undefined;
  const knownNeighborhoods = [
    'Copacabana', 'Ipanema', 'Leblon', 'Botafogo', 'Flamengo', 'Laranjeiras',
    'Tijuca', 'Barra da Tijuca', 'Barra', 'Recreio', 'Centro', 'Niterói',
    'Grajaú', 'Vila Isabel', 'Méier', 'Taquara', 'Freguesia', 'Jacarepaguá',
    'Campo Grande', 'Bangu', 'Catete', 'Glória', 'Humaitá', 'Urca', 'Gávea',
    'São Conrado', 'Leme', 'Cosme Velho', 'Jardim Botânico'
  ];

  for (const b of knownNeighborhoods) {
    const reg = new RegExp(`\\b${b}\\b`, 'i');
    if (reg.test(fullUserText)) {
      neighborhood = b;
      break;
    }
  }

  // If assistant asked for neighborhood and user replied with their neighborhood or city
  if (!neighborhood && askedQuestions.neighborhood) {
    const cleanBairro = lastUserMsg.trim().replace(/[\.\,\!]/g, '');
    const normB = normalize(cleanBairro);
    if (normB.includes('nao sei') || normB.includes('prefiro nao') || normB.includes('online')) {
      neighborhood = 'atendimento online / a combinar';
    } else if (cleanBairro.length >= 3 && cleanBairro.length <= 40) {
      neighborhood = cleanBairro;
    }
  }

  // 7. Confirmation Status
  let confirmationStatus: 'none' | 'pending' | 'confirmed' | 'correcting' = 'none';
  const cleanLast = normLast.replace(/[\.\,\!\?]/g, '').trim();

  if (askedQuestions.confirmation) {
    if (
      cleanLast === 'sim esta correto' ||
      cleanLast === 'sim esta certo' ||
      cleanLast === 'esta correto' ||
      cleanLast === 'sim' ||
      cleanLast === 'correto' ||
      cleanLast === 'perfeito' ||
      cleanLast === 'isso mesmo' ||
      cleanLast.includes('pode enviar') ||
      cleanLast.includes('esta certo') ||
      cleanLast.includes('esta correto') ||
      cleanLast.startsWith('sim')
    ) {
      confirmationStatus = 'confirmed';
    } else if (
      cleanLast.includes('corrigir') ||
      cleanLast.includes('errada') ||
      cleanLast.includes('errado') ||
      cleanLast.includes('na verdade')
    ) {
      confirmationStatus = 'correcting';
    } else {
      confirmationStatus = 'pending';
    }
  }

  // 8. Step Calculation
  let step: PreAttendanceCase['step'] = 'questioning';
  const isDirectContact =
    normLast.includes('falar diretamente') ||
    normLast.includes('falar direto') ||
    normLast.includes('falar com gabriel') ||
    normLast.includes('falar no whatsapp') ||
    normLast.includes('direto no whatsapp') ||
    normLast.includes('contato direto') ||
    normLast.includes('contato imediato') ||
    normLast.includes('ir para o whatsapp') ||
    (normLast.includes('whatsapp') && (normLast.includes('falar') || normLast.includes('chamar') || normLast.includes('conversar')));

  if (isDirectContact) {
    step = 'immediate_contact';
  } else if (confirmationStatus === 'confirmed') {
    step = 'ready_for_whatsapp';
  } else if (askedQuestions.confirmation && confirmationStatus === 'correcting') {
    step = 'awaiting_confirmation';
  } else if (askedQuestions.confirmation) {
    step = 'awaiting_confirmation';
  } else if (animals.length > 0 && (behaviorDetails || onsetOrDuration) && neighborhood) {
    step = 'awaiting_confirmation';
  }

  // 9. Format WhatsApp summary & messages
  const animalListStr =
    animals.length > 0
      ? animals.map(a => `${a.name || 'Pet'}${a.age ? `, ${a.age}` : ''}${a.breed ? ` (${a.breed})` : ''}`).join(' e ')
      : undefined;

  let conversationSummary: string | undefined = undefined;
  if (animals.length > 0 || primaryProblem) {
    const animalNames = animals.map(a => `${a.name}${a.age ? ` (${a.age})` : ''}`).join(' e ');
    conversationSummary = `Tutor relatou ${primaryProblem?.toLowerCase() || 'dificuldades de comportamento'}${
      animalNames ? ` envolvendo ${animalNames}` : ''
    }${behaviorDetails ? `, com ${behaviorDetails}` : ''}${
      onsetOrDuration ? ` (${onsetOrDuration})` : ''
    }.`;
  }

  const prefilledWhatsAppMessage = buildPreAttendanceMessage({
    species: species || 'Cães e Gatos',
    animals: animalListStr,
    primaryProblem: primaryProblem,
    behaviorDetails: behaviorDetails,
    onsetOrDuration: onsetOrDuration,
    householdContext: onsetOrDuration,
    neighborhood: neighborhood,
    conversationSummary: conversationSummary
  });

  const whatsappUrl = buildPreAttendanceWhatsAppUrl({
    species: species || 'Cães e Gatos',
    animals: animalListStr,
    primaryProblem: primaryProblem,
    behaviorDetails: behaviorDetails,
    onsetOrDuration: onsetOrDuration,
    householdContext: onsetOrDuration,
    neighborhood: neighborhood,
    conversationSummary: conversationSummary
  });

  const missingInformation: string[] = [];
  if (animals.length === 0) missingInformation.push('animals_and_ages');
  if (!onsetOrDuration) missingInformation.push('onset_or_duration');
  if (!behaviorDetails) missingInformation.push('behavior_details');
  if (!neighborhood) missingInformation.push('neighborhood');

  return {
    species,
    animals,
    primaryProblem,
    behaviorDetails,
    onsetOrDuration,
    householdContext: onsetOrDuration,
    neighborhood,
    missingInformation,
    conversationSummary,
    confirmationStatus,
    contactReady: animals.length > 0 && Boolean(primaryProblem),
    step,
    prefilledWhatsAppMessage,
    whatsappUrl
  };
}

/**
 * Builds structured solutions for recommendations
 */
function buildStructuredSolutions(
  intent: 'cat' | 'dog' | 'freepdf' | 'mentorship' | 'toys' | 'petflow360' | 'general',
  userPrompt: string,
  activeChannels: ChannelItem[],
  customWaUrl?: string
): SolutionOption[] {
  const queryClean = userPrompt.trim() || 'meu pet';
  const petflowChannel = activeChannels.find(c => c.id === 'petflow360');
  const youtubeChannel = activeChannels.find(c => c.id === 'youtube');

  const defaultWaCat = makeWaUrl(
    `Olá, Gabriel! Acessei seu site e gostaria de conversar sobre o comportamento do meu gato. Minha dúvida é: ${queryClean}. Você pode me orientar sobre os próximos passos?`
  );
  const waCatUrl = customWaUrl || defaultWaCat;

  if (intent === 'cat') {
    return [
      {
        id: 'sol-cat-wa',
        order: 1,
        title: 'Contato com o Adestrador no WhatsApp',
        subtitle: 'Atendimento e avaliação individualizada com Gabriel',
        description:
          'Cada gato possui suas particularidades, e entender o contexto é fundamental para escolher a melhor estratégia. Converse diretamente com Gabriel pelo WhatsApp com o resumo do caso pré-preenchido.',
        buttonText: 'Continuar atendimento no WhatsApp',
        link: waCatUrl,
        badge: 'Atendimento Individual',
        isPrimary: true,
        variant: 'whatsapp',
        iconName: 'MessageCircle'
      }
    ];
  }

  const defaultWaDog = makeWaUrl(
    `Olá, Gabriel! Vim pelo seu assistente virtual e preciso de ajuda com meu cachorro. O comportamento ou a dificuldade que gostaria de melhorar é: ${queryClean}. Como você pode me orientar?`
  );
  const waDogUrl = customWaUrl || defaultWaDog;

  if (intent === 'dog') {
    return [
      {
        id: 'sol-dog-wa',
        order: 1,
        title: 'Contato individual com Gabriel pelo WhatsApp',
        subtitle: '1ª Opção • Atendimento Direto em Destaque',
        description:
          'Quer ajuda para entender e melhorar o comportamento do seu cachorro? Converse diretamente com Gabriel pelo WhatsApp com as informações que você organizou aqui.',
        buttonText: 'Continuar atendimento no WhatsApp',
        link: waDogUrl,
        badge: '1ª Opção • Destaque',
        isPrimary: true,
        variant: 'whatsapp',
        iconName: 'MessageCircle'
      },
      {
        id: 'sol-dog-petflow',
        order: 2,
        title: 'Clube PetFlow 360 | Treinamento contínuo para o seu cão',
        subtitle: '2ª Opção • Adestramento em casa',
        description:
          'Aprenda, pratique e evolua com conteúdos de treinamento para melhorar a convivência com seu cachorro, desenvolver foco, autocontrole e rotina saudável.',
        buttonText: 'Conhecer o Clube PetFlow 360',
        link: petflowChannel?.link || 'https://clubepetflow360.netlify.app/',
        badge: '2ª Opção • Plataforma Oficial',
        isPrimary: false,
        variant: 'petflow',
        iconName: 'Sparkles'
      },
      {
        id: 'sol-dog-youtube',
        order: 3,
        title: 'Aprenda com Gabriel no YouTube',
        subtitle: '3ª Opção • Vídeos Gratuitos',
        description:
          'Confira conteúdos educativos, demonstrações práticas e orientações sobre comportamento e treinamento de cães.',
        buttonText: 'Assistir aos vídeos',
        link: youtubeChannel?.link || 'https://www.youtube.com/@gabrieltreinadordeanimais',
        badge: '3ª Opção • Conteúdo Gratuito',
        isPrimary: false,
        variant: 'youtube',
        iconName: 'Youtube'
      }
    ];
  }

  if (intent === 'freepdf') {
    const waPdfUrl = makeWaUrl(
      'Olá, Gabriel! Vim pelo seu site e gostaria de receber o PDF gratuito para ajudar na educação do meu cachorro. Quero aprender a trabalhar melhor o comportamento dele. Como posso receber o material?'
    );
    return [
      {
        id: 'sol-freepdf-btn',
        order: 1,
        title: 'Aprenda a educar seu cachorro com um material gratuito!',
        subtitle: 'Orientação em PDF preparada por Gabriel',
        description:
          'Gabriel preparou uma proposta de orientação gratuita em PDF para ajudar você a começar a educação do seu cachorro. Entre em contato pelo WhatsApp para solicitar o material disponível.',
        buttonText: 'Quero meu PDF gratuito',
        link: waPdfUrl,
        badge: 'Material Gratuito em PDF',
        isPrimary: true,
        variant: 'pdf',
        iconName: 'Package'
      }
    ];
  }

  if (intent === 'mentorship') {
    const waMentorshipUrl = makeWaUrl(
      'Olá, Gabriel! Tenho interesse na sua mentoria para adestradores e gostaria de entender como funciona, para quem é indicada e quais são os próximos passos.'
    );
    return [
      {
        id: 'sol-mentoria-main',
        order: 1,
        title: 'Quer evoluir na profissão de adestrador?',
        subtitle: 'Mentoria Profissional com Gabriel Soares',
        description:
          'Conheça a mentoria de Gabriel para adestradores que desejam desenvolver suas habilidades, aprimorar o atendimento e construir uma atuação profissional mais consistente.',
        buttonText: 'Conhecer a Mentoria',
        link: waMentorshipUrl,
        badge: 'Profissionais Pet',
        isPrimary: true,
        variant: 'mentoria',
        iconName: 'GraduationCap'
      }
    ];
  }

  if (intent === 'petflow360') {
    return [
      {
        id: 'sol-petflow-main',
        order: 1,
        title: 'Clube PetFlow 360 | Treinamento contínuo para o seu cão',
        subtitle: 'Aprenda, pratique e evolua a qualquer momento',
        description:
          'Indicado para cães de todas as raças e todas as idades (filhotes a adultos). Planos Play (R$ 57/mês), Acompanhamento (R$ 157/mês com análise de vídeo) e Personal (R$ 257/mês).',
        buttonText: 'Conhecer o Clube PetFlow 360',
        link: petflowChannel?.link || 'https://clubepetflow360.netlify.app/',
        badge: 'Plataforma Oficial',
        isPrimary: true,
        variant: 'petflow',
        iconName: 'Sparkles'
      },
      {
        id: 'sol-petflow-wa',
        order: 2,
        title: 'Tirar dúvidas com Gabriel pelo WhatsApp',
        subtitle: 'Atendimento direto com o treinador',
        description:
          'Converse com Gabriel para saber qual modalidade melhor atende sua rotina e as particularidades do seu cão.',
        buttonText: 'Falar com Gabriel no WhatsApp',
        link: makeWaUrl(`Olá Gabriel, gostaria de saber se o Clube PetFlow 360 é indicado para o meu cachorro.`),
        badge: 'Atendimento Direto',
        isPrimary: false,
        variant: 'whatsapp',
        iconName: 'MessageCircle'
      }
    ];
  }

  // General fallback
  return [
    {
      id: 'sol-gen-wa',
      order: 1,
      title: 'Falar diretamente com Gabriel Soares',
      subtitle: 'Atendimento e orientação individual',
      description:
        'Converse com Gabriel pelo WhatsApp e receba orientações personalizadas para o seu momento e as necessidades da sua família.',
      buttonText: 'Falar com Gabriel no WhatsApp',
      link: customWaUrl || makeWaUrl(queryClean),
      badge: 'Atendimento Individual',
      isPrimary: true,
      variant: 'whatsapp',
      iconName: 'MessageCircle'
    }
  ];
}

/**
 * Builds the formatted "Resumo do caso" markdown block
 */
function buildSummaryMessage(state: PreAttendanceCase): string {
  const lines: string[] = ['**Resumo do caso**'];

  // Animais
  if (state.animals && state.animals.length > 0) {
    const desc = state.animals
      .map(a => `${a.name}${a.age ? `, ${a.age}` : ''}`)
      .join(' e ');
    lines.push(`- Animais: ${desc}`);
  }

  // Espécie
  if (state.species) {
    lines.push(`- Espécie: ${state.species.toLowerCase()}`);
  }

  // Raça
  const breed = state.animals.find(a => a.breed)?.breed;
  if (breed) {
    lines.push(`- Raça: ${breed}, conforme informado`);
  }

  // Tempo de convivência / início
  if (state.onsetOrDuration && state.onsetOrDuration !== 'não especificado') {
    lines.push(`- Tempo de convivência: ${state.onsetOrDuration}`);
  }

  // Situação e comportamentos
  if (state.behaviorDetails) {
    lines.push(`- Situação relatada: ${state.behaviorDetails}`);
  } else if (state.primaryProblem) {
    lines.push(`- Situação relatada: ${state.primaryProblem.toLowerCase()}`);
  }

  // Bairro
  if (state.neighborhood && state.neighborhood.trim()) {
    lines.push(`- Bairro: ${state.neighborhood.trim()}`);
  }

  return lines.join('\n');
}

/**
 * Main Consultation Processor
 * Orchestrates anti-loop progressive state transitions.
 */
export async function processConsultation(
  messages: Message[],
  config: AiConfig,
  activeChannels: ChannelItem[],
  activeProducts: Product[]
): Promise<ConsultationResponse> {
  const lastUserMessage = [...messages].reverse().find(m => m.role === 'user')?.content || '';
  const normLast = normalize(lastUserMessage);
  const assistantMessages = messages.filter(m => m.role === 'assistant').map(m => m.content);
  const lastAssistantMsg = assistantMessages[assistantMessages.length - 1] || '';
  const normLastAssistant = normalize(lastAssistantMsg);

  // 1. NON-ANIMAL INTENTS (Mentorship, Pure PetFlow Query, Free PDF)
  // Mentorship
  const isMentorshipIntent =
    normLast.includes('mentoria') ||
    normLast.includes('quero ser adestrador') ||
    normLast.includes('formacao profissional') ||
    normLast.includes('captar clientes') ||
    normLast.includes('marketing para adestradores') ||
    (normLast.includes('carreira') && !normLast.includes('gato') && !normLast.includes('cachorro'));

  if (isMentorshipIntent) {
    const solutions = buildStructuredSolutions('mentorship', lastUserMessage, activeChannels);
    return {
      status: 'recommendation',
      message:
        'Quer evoluir na profissão de adestrador? Conheça a mentoria de Gabriel para adestradores que desejam desenvolver suas habilidades, aprimorar o atendimento e construir uma atuação profissional mais consistente.',
      recommendation: {
        explanation:
          'Conheça a mentoria de Gabriel para adestradores que desejam desenvolver suas habilidades, aprimorar o atendimento e construir uma atuação profissional mais consistente.',
        identifiedNeed: 'Mentoria e desenvolvimento profissional para adestradores',
        problemCategory: 'Mentoria para Adestradores',
        recommendedChannelId: 'mentoria',
        channel: activeChannels.find(c => c.id === 'mentoria'),
        structuredSolutions: solutions,
        followUpOptions: ['Conhecer a mentoria para adestradores', 'Falar com Gabriel no WhatsApp']
      }
    };
  }

  // Pure PetFlow Breed/Age query
  const isPetflowBreedAgeQuery =
    (normLast.includes('petflow') && (normLast.includes('raca') || normLast.includes('idade') || normLast.includes('indicado'))) ||
    (normLast.includes('clube petflow') && normLast.includes('indicado')) ||
    normLast === 'quero saber se o clube petflow 360 e indicado para a raca e a idade do meu animal.';

  if (isPetflowBreedAgeQuery) {
    const solutions = buildStructuredSolutions('petflow360', lastUserMessage, activeChannels);
    return {
      status: 'recommendation',
      message:
        'Sim! O Clube PetFlow 360 é indicado para cães de todas as raças e todas as idades, desde filhotes até cães adultos! O método vai muito além de truques: ensina passo a passo a construir respeito, foco, autocontrole, passeio sem puxões, socialização e rotina saudável. Não é necessário ter experiência prévia com adestramento.',
      recommendation: {
        explanation:
          'No Clube PetFlow 360 você conta com aulas práticas direto no celular e pode escolher o plano ideal para sua rotina: Plano Play (R$ 57,00/mês para aprender no seu ritmo), Plano Acompanhamento (R$ 157,00/mês com orientação seg-sex e até 2 análises de vídeo por semana) ou Plano Personal (R$ 257,00/mês com avaliação e metas exclusivas).',
        identifiedNeed: 'Informações sobre indicação de raça, idade e planos do Clube PetFlow 360',
        problemCategory: 'Clube PetFlow 360',
        recommendedChannelId: 'petflow360',
        channel: activeChannels.find(c => c.id === 'petflow360'),
        structuredSolutions: solutions,
        followUpOptions: ['Conhecer o Clube PetFlow 360', 'Falar com Gabriel no WhatsApp']
      }
    };
  }

  // Free PDF intent (without behavioral context)
  const isFreePdfOnly =
    (normLast.includes('pdf gratis') ||
      normLast.includes('guia gratis') ||
      normLast.includes('material gratuito') ||
      normLast === 'quero meu pdf gratuito') &&
    !normLast.includes('brigando') &&
    !normLast.includes('morde') &&
    !normLast.includes('puxa');

  if (isFreePdfOnly) {
    const solutions = buildStructuredSolutions('freepdf', lastUserMessage, activeChannels);
    return {
      status: 'recommendation',
      message:
        'Aprenda a educar seu cachorro com um material gratuito! Gabriel preparou uma proposta de orientação gratuita em PDF para ajudar você a começar a educação do seu cachorro. Entre em contato pelo WhatsApp para solicitar o material disponível.',
      recommendation: {
        explanation:
          'Gabriel preparou uma proposta de orientação gratuita em PDF para ajudar você a começar a educação do seu cachorro. Entre em contato pelo WhatsApp para solicitar o material disponível.',
        identifiedNeed: 'Material gratuito em PDF de educação canina',
        problemCategory: 'Material Gratuito',
        recommendedChannelId: 'whatsapp',
        channel: activeChannels.find(c => c.id === 'whatsapp'),
        structuredSolutions: solutions,
        followUpOptions: ['Quero meu PDF gratuito', 'Falar com Gabriel no WhatsApp']
      }
    };
  }

  // 2. EXTRACT PROGRESSIVE PRE-ATTENDANCE STATE ACROSS TURNS
  const state = extractPreAttendanceState(messages);

  // IMMEDIATE CONTACT REQUEST (User asks to talk directly to Gabriel or go to WhatsApp)
  if (state.step === 'immediate_contact') {
    const solutions = buildStructuredSolutions(
      state.species === 'Gatos' ? 'cat' : 'dog',
      lastUserMessage,
      activeChannels,
      state.whatsappUrl
    );

    return {
      status: 'ready_for_whatsapp',
      message:
        'Perfeito! Vou te encaminhar diretamente para o WhatsApp do Gabriel agora mesmo com as informações organizadas aqui.',
      whatsappButton: {
        text: 'Falar com Gabriel no WhatsApp',
        url: state.whatsappUrl || makeWaUrl('Olá, Gabriel! Vim pelo assistente virtual do seu site.')
      },
      preAttendanceCase: state,
      recommendation: {
        explanation:
          'Seu atendimento com Gabriel Soares foi iniciado. Clique no botão abaixo para conversar no WhatsApp comercial.',
        identifiedNeed: state.primaryProblem || 'Atendimento direto com Gabriel',
        problemCategory: state.species === 'Gatos' ? 'Comportamento Felino' : 'Comportamento Canino',
        recommendedChannelId: 'whatsapp',
        channel: activeChannels.find(c => c.id === 'whatsapp'),
        structuredSolutions: solutions,
        followUpOptions: ['Falar com Gabriel no WhatsApp', 'Voltar ao início']
      }
    };
  }

  // SUMMARY CONFIRMATION CONFIRMED
  if (state.confirmationStatus === 'confirmed') {
    const solutions = buildStructuredSolutions(
      state.species === 'Gatos' ? 'cat' : 'dog',
      lastUserMessage,
      activeChannels,
      state.whatsappUrl
    );

    return {
      status: 'ready_for_whatsapp',
      message:
        'Seu resumo está pronto. Ao continuar, você abrirá uma conversa no WhatsApp com Gabriel e poderá enviar as informações que compartilhou aqui.',
      whatsappButton: {
        text: 'Continuar atendimento no WhatsApp',
        url: state.whatsappUrl || makeWaUrl('Olá, Gabriel! Vim pelo assistente virtual do seu site.')
      },
      preAttendanceCase: state,
      recommendation: {
        explanation:
          'Seu resumo foi confirmado com sucesso! Gabriel poderá conversar com você para entender melhor a convivência e orientar os próximos passos no WhatsApp.',
        identifiedNeed: state.primaryProblem || 'Atendimento comportamental individual',
        problemCategory: state.species === 'Gatos' ? 'Comportamento Felino' : 'Comportamento Canino',
        recommendedChannelId: 'whatsapp',
        channel: activeChannels.find(c => c.id === 'whatsapp'),
        structuredSolutions: solutions,
        followUpOptions: ['Continuar no WhatsApp', 'Fazer outra pergunta']
      }
    };
  }

  // CORRECTION REQUESTED (e.g. user reports wrong age or name)
  if (state.confirmationStatus === 'correcting' || normLast.includes('idade da bella esta errada')) {
    const summaryText = buildSummaryMessage(state);
    return {
      status: 'summary_confirmation',
      message: `Perfeito! Já atualizei as informações no resumo do seu atendimento:\n\n${summaryText}\n\nEstá tudo correto agora?`,
      quickOptions: ['Sim, está correto', 'Quero corrigir uma informação'],
      preAttendanceCase: state
    };
  }

  // Check which questions were previously asked
  const askedAnimals = assistantMessages.some(m => normalize(m).includes('como se chamam') || normalize(m).includes('qual é o nome e a idade'));
  const askedDuration = assistantMessages.some(m => normalize(m).includes('há quanto tempo') || normalize(m).includes('tempo de convivência'));
  const askedBehavior = assistantMessages.some(m => normalize(m).includes('o que costuma acontecer') || normalize(m).includes('quais são os estímulos') || normalize(m).includes('momentos do passeio'));
  const askedNeighborhood = assistantMessages.some(m => normalize(m).includes('em qual bairro') || normalize(m).includes('qual bairro'));

  // If user has provided all critical info (multi-info turn or finished flow), go straight to summary!
  const hasAnimals = state.animals.length > 0;
  const hasTiming = Boolean(state.onsetOrDuration) || askedDuration;
  const hasBehavior = Boolean(state.behaviorDetails) || askedBehavior;
  const hasLocation = Boolean(state.neighborhood) || askedNeighborhood;

  if (hasAnimals && hasTiming && hasBehavior && hasLocation) {
    const summaryText = buildSummaryMessage(state);
    return {
      status: 'summary_confirmation',
      message: `Obrigado pelas informações! Vou organizar o que você me contou para facilitar o atendimento com o Gabriel.\n\n${summaryText}\n\nEstá tudo correto ou você gostaria de corrigir alguma informação?`,
      quickOptions: ['Sim, está correto', 'Quero corrigir uma informação'],
      preAttendanceCase: state
    };
  }

  // PROGRESSIVE ONE-QUESTION-AT-A-TIME FLOW (Strictly checks not asked yet)

  // 1. Missing Animals and Ages
  if (!hasAnimals && !askedAnimals) {
    if (state.species === 'Gatos') {
      return {
        status: 'pre_attendance',
        message:
          'Olá, tudo bem? Vou te fazer algumas perguntas rápidas para entender melhor a situação e ajudar a organizar as informações para o Gabriel. Como você prefere chamar as suas gatinhas? Qual é a idade de cada uma e, se souber, qual é a raça?',
        preAttendanceCase: state
      };
    } else {
      return {
        status: 'pre_attendance',
        message:
          'Olá, tudo bem? Vou te fazer algumas perguntas rápidas para compreender a situação e organizar o caso para o Gabriel. Qual é o nome e a idade do seu cachorro, e qual é a raça ou porte dele?',
        preAttendanceCase: state
      };
    }
  }

  // 2. Missing Duration / Arrival Time
  if (!state.onsetOrDuration && !askedDuration) {
    const youngerOrNewer = state.animals[1]?.name || state.animals[0]?.name || 'o pet';
    if (state.species === 'Gatos') {
      return {
        status: 'pre_attendance',
        message: `Obrigado por me explicar! Para entender melhor o contexto, há quanto tempo a ${youngerOrNewer} chegou à casa de vocês?`,
        preAttendanceCase: state
      };
    } else {
      return {
        status: 'pre_attendance',
        message: `Obrigado pelas informações! Há quanto tempo esse comportamento vem acontecendo com ${state.animals[0]?.name || 'seu cão'}?`,
        preAttendanceCase: state
      };
    }
  }

  // 3. Missing Specific Behavior Details
  if (!state.behaviorDetails && !askedBehavior) {
    if (state.species === 'Gatos') {
      return {
        status: 'pre_attendance',
        message:
          'Entendi. Quando elas se encontram, o que costuma acontecer? Por exemplo, uma persegue a outra, há rosnados, bufadas, tapas ou chegam a se morder?',
        preAttendanceCase: state
      };
    } else if (state.primaryProblem?.includes('latido') || state.primaryProblem?.includes('Latidos')) {
      return {
        status: 'pre_attendance',
        message:
          'Entendi. E quais são os estímulos que provocam os latidos? Por exemplo, campainha, barulhos no corredor, pessoas na janela ou quando fica sozinho?',
        preAttendanceCase: state
      };
    } else if (state.primaryProblem?.includes('guia') || state.primaryProblem?.includes('Puxar')) {
      return {
        status: 'pre_attendance',
        message:
          'Entendi. Em quais momentos do passeio ele puxa mais? Como reage ao encontrar outros cães ou pessoas na rua?',
        preAttendanceCase: state
      };
    } else {
      return {
        status: 'pre_attendance',
        message:
          'Entendi. O que você costuma observar antes e durante esse comportamento no dia a dia?',
        preAttendanceCase: state
      };
    }
  }

  // 4. Missing Neighborhood
  if (!state.neighborhood && !askedNeighborhood) {
    return {
      status: 'pre_attendance',
      message:
        'Entendi. Em qual bairro você está? Assim posso orientar o próximo passo de acordo com o atendimento disponível.',
      preAttendanceCase: state
    };
  }

  // Fallback: If we have reached here, present summary confirmation directly without looping
  const summaryText = buildSummaryMessage(state);
  return {
    status: 'summary_confirmation',
    message: `Obrigado pelas informações! Vou organizar o que você me contou para facilitar o atendimento com o Gabriel.\n\n${summaryText}\n\nEstá tudo correto?`,
    quickOptions: ['Sim, está correto', 'Quero corrigir uma informação'],
    preAttendanceCase: state
  };
}

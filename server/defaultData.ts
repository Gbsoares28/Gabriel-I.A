import { ChannelItem, Product, Shortcut, AiConfig, Testimonial } from '../src/types.js';

export const DEFAULT_CHANNELS: ChannelItem[] = [
  {
    id: 'whatsapp',
    title: 'Contato com o Adestrador',
    subtitle: 'Atendimento Individualizado',
    callout: 'Precisa de orientação para melhorar a convivência com seu pet?',
    description: 'Conheça as possibilidades de atendimento com Gabriel, adestrador de cães e gatos com 10 anos de experiência, e descubra como receber orientação personalizada para as necessidades da sua família.',
    buttonText: 'Fale comigo no WhatsApp',
    link: 'https://api.whatsapp.com/send?phone=5521965107060&text=Ol%C3%A1,%20tudo%20bem?%20gostaria%20de%20saber%20mais%20a%20respeito%20de%20adestramento.',
    badge: 'Atendimento Direto',
    iconName: 'MessageCircle',
    active: true,
    priority: 10
  },
  {
    id: 'petflow360',
    title: 'Clube PetFlow 360',
    subtitle: 'Adestramento em casa',
    callout: 'Aprenda, pratique e evolua com seu cão.',
    description: 'Conheça o Clube PetFlow 360, uma plataforma de treinamento contínuo para tutores que desejam melhorar a convivência com seus cães, desenvolver habilidades de treinamento e trabalhar dificuldades comportamentais com orientação educativa.',
    buttonText: 'Conhecer o Clube PetFlow 360',
    link: 'https://clubepetflow360.netlify.app/',
    badge: 'Plataforma Oficial',
    iconName: 'Sparkles',
    active: true,
    priority: 9
  },
  {
    id: 'mentoria',
    title: 'Mentoria para Adestradores',
    subtitle: 'Alavanque sua carreira',
    callout: 'Desenvolva suas habilidades e evolua profissionalmente no mercado pet.',
    description: 'Um canal voltado a adestradores que desejam aprimorar seus conhecimentos técnicos, desenvolver sua atuação com clientes e encontrar caminhos sólidos para evoluir na carreira.',
    buttonText: 'Conhecer a Mentoria',
    link: 'https://api.whatsapp.com/send?phone=5521965107060&text=Ol%C3%A1%2C%20Gabriel!%20Sou%20adestrador%20e%20gostaria%20de%20informa%C3%A7%C3%B5es%20sobre%20sua%20mentoria%20profissional.',
    badge: 'Profissionais',
    iconName: 'GraduationCap',
    active: true,
    priority: 8
  },
  {
    id: 'produtos',
    title: 'Checklist de Enxoval & Produtos',
    subtitle: 'Itens recomendados por Gabriel',
    callout: 'Enxoval completo, comedouros, guias seguras e enriquecimento pet.',
    description: 'Acesse o checklist oficial em PDF com recomendações essenciais de enxoval para filhotes e cães adultos: comedouros, guias de passeio seguro, enriquecimento ambiental e mordedores.',
    buttonText: 'Acessar Checklist de Enxoval',
    link: 'https://drive.google.com/file/d/1-wMqvUYwpDE9f35rRf7Y8ChoP3OCLziS/view?usp=drive_link',
    badge: 'Checklist Oficial',
    iconName: 'Package',
    active: true,
    priority: 7
  },
  {
    id: 'youtube',
    title: 'Nosso Canal no YouTube',
    subtitle: 'Dicas e conteúdos gratuitos',
    callout: 'Aprenda mais sobre comportamento e treinamento de cães e gatos.',
    description: 'Assista aos vídeos de Gabriel, acompanhe demonstrações práticas de treinamento e aprenda sobre comportamento animal, educação, rotina e convivência com seu pet.',
    buttonText: 'Assistir aos vídeos',
    link: 'https://www.youtube.com/@gabrieltreinadordeanimais',
    badge: 'Vídeos Gratuitos',
    iconName: 'Youtube',
    active: true,
    priority: 6
  },
  {
    id: 'facebook',
    title: 'Estamos no Facebook',
    subtitle: 'Novidades e atualizações',
    callout: 'Continue acompanhando nossos conteúdos.',
    description: 'Acompanhe as publicações, artigos rápidos, novidades e atualizações de Gabriel nas redes sociais.',
    buttonText: 'Acessar o Facebook',
    link: 'https://www.facebook.com/gabrieltreinadordeanimais',
    badge: 'Comunidade',
    iconName: 'Facebook',
    active: true,
    priority: 5
  },
  {
    id: 'instagram',
    title: 'Acompanhe Gabriel no Instagram',
    subtitle: 'Bastidores e rotina',
    callout: 'Conteúdos, dicas práticas e bastidores do treinamento.',
    description: 'Acompanhe Gabriel no Instagram para conhecer seu trabalho de perto, assistir a conteúdos educativos diários e acompanhar demonstrações práticas de comportamento e treinamento animal.',
    buttonText: 'Seguir no Instagram',
    link: 'https://www.instagram.com/gabrieltreinadordeanimais/',
    badge: '@gabrieltreinadordeanimais',
    iconName: 'Instagram',
    active: true,
    priority: 8
  }
];

export const DEFAULT_PRODUCTS: Product[] = [
  {
    id: 'prod-brinquedo-recheavel',
    name: 'Brinquedo Recheável de Borracha Resistente (KONG Classic)',
    category: 'Enriquecimento Ambiental',
    species: 'Cão',
    badge: 'Essencial',
    description: 'Brinquedo de borracha natural durável ideal para rechear com alimentos úmidos e congelar. Essencial para combater tédio, ansiedade de separação e destruição de objetos.',
    usageIndication: 'Indicado para cães de todas as idades para desacelerar a alimentação e promover gasto de energia mental.',
    safetyNotes: 'Escolha o tamanho correto de acordo com o peso do cão. Supervisão recomendada nos primeiros usos.',
    price: 'A partir de R$ 79,90',
    officialLink: 'https://amzn.to/exemplo-kong',
    imageUrl: 'https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?auto=format&fit=crop&w=800&q=80',
    affiliateNotice: 'Link recomendado com curadoria técnica',
    keywords: ['ansiedade', 'destruição', 'morder', 'enriquecimento', 'roer', 'tédio', 'sozinho', 'brinquedo'],
    priority: 10,
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-peitoral-anti-puxao',
    name: 'Peitoral Anti-Puxão com Engate Frontal em Y',
    category: 'Equipamentos de Passeio',
    species: 'Cão',
    badge: 'Passeio Tranquilo',
    description: 'Peitoral ergonômico que não machuca as articulações dos ombros nem enforca o pescoço. O engate frontal redireciona gentilmente o cão quando ele tenta tracionar.',
    usageIndication: 'Cães que puxam na guia durante os passeios ou ficam excessivamente agitados na rua.',
    safetyNotes: 'Ajuste com folga de dois dedos entre as fitas e o corpo do animal. Nunca utilize com guias retráteis longas em vias de tráfego intenso.',
    price: 'R$ 139,90',
    officialLink: 'https://amzn.to/exemplo-peitoral-y',
    imageUrl: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=800&q=80',
    affiliateNotice: 'Link recomendado com curadoria técnica',
    keywords: ['puxar', 'passeio', 'guia', 'peitoral', 'arrasto', 'rua', 'enforcador'],
    priority: 9,
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-tapete-olfativo',
    name: 'Tapete Olfativo de Enriquecimento Sensorial',
    category: 'Enriquecimento Ambiental',
    species: 'Cão e Gato',
    badge: 'Estimulação Mental',
    description: 'Tapete com diversas camadas e tiras de tecido para esconder grãos de ração ou petiscos. Estimula o olfato, reduz o estresse e cansa o animal de forma saudável.',
    usageIndication: 'Cães agitados, filhotes com energia excessiva e gatos que precisam de estímulo de caça.',
    safetyNotes: 'Guardar após o término da atividade para evitar que o pet roa ou destrua as tiras de tecido.',
    price: 'R$ 89,00',
    officialLink: 'https://amzn.to/exemplo-tapete-olfativo',
    imageUrl: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=800&q=80',
    affiliateNotice: 'Link recomendado com curadoria técnica',
    keywords: ['olfato', 'farejar', 'hiperativo', 'energia', 'tapete', 'calmante', 'estresse'],
    priority: 8,
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-arranhador-vertical-torre',
    name: 'Poste Arranhador Vertical Alto em Corda de Sisal Natural',
    category: 'Enriquecimento Ambiental',
    species: 'Gato',
    badge: 'Bem-estar Felino',
    description: 'Arranhador robusto com altura superior a 70cm, permitindo que o felino se estique completamente na posição vertical para marcar território e cuidar das garras.',
    usageIndication: 'Gatos que arranham sofás, cortinas ou camas.',
    safetyNotes: 'Certifique-se de posicionar em rotas de passagem do gato ou próximo ao local onde ele costumava arranhar indevidamente.',
    price: 'R$ 149,00',
    officialLink: 'https://amzn.to/exemplo-arranhador-sisal',
    imageUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80',
    affiliateNotice: 'Link recomendado com curadoria técnica',
    keywords: ['gato', 'arranhar', 'sofa', 'garras', 'sisal', 'arranhador', 'marcar'],
    priority: 9,
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-clicker-treinamento',
    name: 'Clicker Ergonômico de Adestramento Positivo com Alça',
    category: 'Treinamento & Adestramento',
    species: 'Cão e Gato',
    badge: 'Comunicação Clara',
    description: 'Ferramenta de marcação precisa de comportamento desejado. O som mecânico constante e sem variação emocional acelera o aprendizado de comandos e truques.',
    usageIndication: 'Treinamento de reforço positivo, comandos básicos (senta, fica, aqui) e resolução de hábitos.',
    safetyNotes: 'O clique deve ser SEMPRE seguido de uma recompensa de alto valor (petisco saboroso). Não usar perto do ouvido do animal.',
    price: 'R$ 29,90',
    officialLink: 'https://amzn.to/exemplo-clicker',
    imageUrl: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=800&q=80',
    affiliateNotice: 'Link recomendado com curadoria técnica',
    keywords: ['clicker', 'adestramento', 'reforço positivo', 'comandos', 'truques', 'marcador'],
    priority: 8,
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-comedouro-lento',
    name: 'Comedouro Lento Labirinto Anti-Engasgo',
    category: 'Alimentação & Petiscos',
    species: 'Cão',
    badge: 'Saúde Digestiva',
    description: 'Tigela com obstáculos projetada para forçar o animal a comer devagar, evitando vômitos por deglutição rápida de ar e prevenindo a perigosa torção gástrica.',
    usageIndication: 'Cães que devoram a ração em poucos segundos ou regurgitam após a refeição.',
    safetyNotes: 'Material atóxico livre de BPA e base antiderrapante.',
    price: 'R$ 59,90',
    officialLink: 'https://amzn.to/exemplo-comedouro-lento',
    imageUrl: 'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?auto=format&fit=crop&w=800&q=80',
    affiliateNotice: 'Link recomendado com curadoria técnica',
    keywords: ['comer rapido', 'ansioso', 'vomito', 'ração', 'engasgo', 'comedouro'],
    priority: 7,
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const DEFAULT_SHORTCUTS: Shortcut[] = [
  {
    id: 'sc-1',
    label: 'Meu cachorro tem problemas de comportamento',
    prompt: 'Meu cachorro está apresentando dificuldades de comportamento (como latidos excessivos, destruição ou reatividade). Como podemos resolver?',
    category: 'Comportamento Canino',
    iconName: 'Dog',
    active: true
  },
  {
    id: 'sc-2',
    label: 'Quero melhorar o comportamento do meu gato',
    prompt: 'Quero melhorar o comportamento do meu gato',
    category: 'Comportamento Felino',
    iconName: 'Cat',
    active: true
  },
  {
    id: 'sc-3',
    label: 'Quero aprender a adestrar meu pet em casa',
    prompt: 'Quero aprender a adestrar meu cão no dia a dia, praticar exercícios e evoluir na convivência com ele em casa.',
    category: 'Adestramento em Casa',
    iconName: 'Sparkles',
    active: true
  },
  {
    id: 'sc-4',
    label: 'Quero falar diretamente com Gabriel',
    prompt: 'Gostaria de conversar diretamente com o Gabriel Soares no WhatsApp para entender sobre atendimento individualizado ou consultoria.',
    category: 'Atendimento Direto',
    iconName: 'MessageCircle',
    active: true
  },
  {
    id: 'sc-5',
    label: 'Quero me tornar um adestrador melhor',
    prompt: 'Sou adestrador ou quero me tornar um adestrador profissional de cães e gatos. Gostaria de saber sobre a Mentoria com o Gabriel.',
    category: 'Mentoria para Adestradores',
    iconName: 'GraduationCap',
    active: true
  },
  {
    id: 'sc-6',
    label: 'Quero ver o checklist de enxoval e produtos',
    prompt: 'Gostaria de acessar o checklist de enxoval e produtos recomendados pelo Gabriel para cães e gatos.',
    category: 'Checklist & Produtos',
    iconName: 'Package',
    active: true
  },
  {
    id: 'sc-7',
    label: 'Quero aprender gratuitamente',
    prompt: 'Quero ver os vídeos gratuitos no YouTube e as dicas do Gabriel no Instagram sobre comportamento animal.',
    category: 'Conteúdos Gratuitos',
    iconName: 'Youtube',
    active: true
  },
  {
    id: 'sc-8',
    label: 'Qual brinquedo é mais indicado para o meu pet?',
    prompt: 'Qual brinquedo é mais indicado para o meu pet?',
    category: 'Brinquedos & Enriquecimento',
    iconName: 'Package',
    active: true
  }
];

export const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    authorName: 'Rayana Figueiredo',
    petInfo: 'Tutora do Precioso',
    quote: 'O Gabriel faz um trabalho incrível! Em 6 aulas o Precioso evoluiu muito. Super recomendo!',
    context: 'Evolução em 6 aulas',
    rating: 5,
    authorized: true
  },
  {
    id: 'test-2',
    authorName: 'Leonardo Barros',
    petInfo: 'Harmonia familiar com o cão',
    quote: 'Baita profissional! Nossa família passou a ter muito mais harmonia com nosso cachorro.',
    context: 'Harmonia familiar',
    rating: 5,
    authorized: true
  },
  {
    id: 'test-3',
    authorName: 'Profª Iolanda Agui',
    petInfo: 'Cliente há mais de 5 anos',
    quote: 'Nossos cães amam o Gabriel! É de confiança, responsável e carinhoso. Mais de 5 anos nos atendendo.',
    context: 'Mais de 5 anos nos atendendo',
    rating: 5,
    authorized: true
  },
  {
    id: 'test-4',
    authorName: 'Livia Sk',
    petInfo: 'Comandos rápidos e aprendizado ágil',
    quote: 'Excelente profissional! Já no primeiro encontro meu cão já entendia os comandos. Ele faz mágica!',
    context: 'Resultado no 1º encontro',
    rating: 5,
    authorized: true
  },
  {
    id: 'test-5',
    authorName: 'Felipe Marun',
    petInfo: 'Tutor de 2 pets',
    quote: 'Resultados excelentes no comportamento dos nossos 2 pets. Recomendo fortemente!',
    context: 'Comportamento dos 2 pets',
    rating: 5,
    authorized: true
  },
  {
    id: 'test-6',
    authorName: 'Ana Macedo',
    petInfo: 'Tutora do Zeus • Adestramento de cães',
    quote: 'Excelente profissional! Muito atencioso, paciente e carinhoso com o Zeus. Dá pra perceber o cuidado e a dedicação em cada aula. Estamos muito satisfeitos com o trabalho e recomendamos.',
    context: 'Ótimo preço • Há 2 semanas',
    rating: 5,
    publishedAt: 'Há 2 semanas',
    highlight: 'Ótimo preço',
    service: 'Adestramento de cães',
    authorized: true
  },
  {
    id: 'test-7',
    authorName: 'Tupan Macedo',
    petInfo: 'Tutor do Zeus • Adestramento de cães',
    quote: 'Ótimo profissional, muito paciente e dedicado. O Zeus evoluiu bastante com o treinamento e sempre foi tratado com muito cuidado. Recomendo o trabalho!',
    context: 'Ótimo preço • Há 2 semanas',
    rating: 5,
    publishedAt: 'Há 2 semanas',
    highlight: 'Ótimo preço',
    service: 'Adestramento de cães',
    authorized: true
  },
  {
    id: 'test-8',
    authorName: 'Karla M.M',
    petInfo: 'Tutora do Zeus • Adestramento de cães',
    quote: 'Só tenho elogios ao trabalho do Gabriel! Sempre demonstrou muita paciência, cuidado e carinho com o Zeus, além de explicar tudo de forma clara para que a gente também consiga dar continuidade ao treinamento no dia a dia. É muito bom perceber que o trabalho não é apenas ensinar comandos, mas entender o comportamento do cachorro e respeitar o tempo dele. Dá para ver o profissionalismo e a dedicação do Gabriel em cada aula. Eu e o Zeus agradecemos muito por todo o cuidado. Recomendo com certeza! 🐶💙',
    context: 'Ótimo preço • Há 2 semanas',
    rating: 5,
    publishedAt: 'Há 2 semanas',
    highlight: 'Ótimo preço',
    service: 'Adestramento de cães',
    authorized: true
  },
  {
    id: 'test-9',
    authorName: 'Meiga Aurea Mendes Menezes',
    petInfo: 'Visão moderna e humanizada',
    quote: 'Gabriel me ajudou muito, sua visão de adestramento é moderna, humanizada e eficiente!',
    context: 'Há 5 semanas',
    rating: 5,
    publishedAt: 'Há 5 semanas',
    service: 'Adestramento humanizado',
    authorized: true
  },
  {
    id: 'test-10',
    authorName: 'Luciana Rodrigues',
    petInfo: 'Tutora de gato e cachorro',
    quote: 'Excelente atendimento! Muito didático e personalizado, achei que ia receber um PDF pronto, mas me surpreendi muito com a qualidade do profissional. Super recomendo para quem precisa de ajuda com seu pet, seja gato, como o meu, ou cachorro!',
    context: 'Preço razoável • Há 7 semanas',
    rating: 5,
    publishedAt: 'Há 7 semanas',
    highlight: 'Preço razoável',
    service: 'Atendimento cães e gatos',
    authorized: true
  },
  {
    id: 'test-11',
    authorName: 'Frank',
    petInfo: 'Análise de comportamento felino',
    quote: 'Atencioso, educado e muito refinado! Excelente profissional recomendo para todos! Muito tranquilo e paciente e fez toda uma analise completa da minha gata. Podem chamar ele que é sucesso!',
    context: 'Comportamento felino • Há 7 semanas',
    rating: 5,
    publishedAt: 'Há 7 semanas',
    service: 'Análise completa de gata',
    authorized: true
  },
  {
    id: 'test-12',
    authorName: 'Beatriz Valente',
    petInfo: 'Cuidado e atenção total',
    quote: 'Gabriel é excelente no cuidado com os pets, e muito atencioso com dos tutores, para ouvir e explicar todas as dúvidas.',
    context: 'Atenção e esclarecimento de dúvidas',
    rating: 5,
    service: 'Consultoria comportamental',
    authorized: true
  },
  {
    id: 'test-13',
    authorName: 'Ana Villela',
    petInfo: 'Tutora de filhote Basenji',
    quote: 'O Gabriel é um excelente adestrador. Ele tem muita experiência e competência. Ele ajudou muito a adestrar o nosso cachorro filhote basenji. Recomendo demais o trabalho dele! Passa muita confiança!',
    context: 'Filhote Basenji • Muita confiança',
    rating: 5,
    service: 'Adestramento de filhote',
    authorized: true
  },
  {
    id: 'test-14',
    authorName: 'Taís Nobre',
    petInfo: 'Aulas práticas no dia a dia',
    quote: 'As aulas são muito práticas e podemos aplicar os ensinamentos nas atividades do dia a dia. Os cachorros responderam muito rápido ao treinamento. Super recomendo.',
    context: 'Resposta rápida dos cães',
    rating: 5,
    service: 'Treinamento prático',
    authorized: true
  },
  {
    id: 'test-15',
    authorName: 'Ana Clara Espinha',
    petInfo: 'Tutora de 2 cachorrinhos',
    quote: 'As aulas são super versáteis e bem claras! Por aqui temos dois cachorrinhos e adoramos.',
    context: 'Aulas versáteis e claras',
    rating: 5,
    service: 'Adestramento para 2 cães',
    authorized: true
  },
  {
    id: 'test-16',
    authorName: 'Davi Santos',
    petInfo: 'Excelente atendimento',
    quote: 'Excelente atendimento. Gabriel é um ótimo profissional.',
    context: 'Ótimo profissional',
    rating: 5,
    service: 'Atendimento profissional',
    authorized: true
  },
  {
    id: 'test-17',
    authorName: 'Roberta Stelling',
    petInfo: 'Tutora da Zara',
    quote: 'Calmo, didático e eficiente. Zara está amando as aulas! Super indico.',
    context: 'Zara amando as aulas',
    rating: 5,
    service: 'Adestramento comportamental',
    authorized: true
  },
  {
    id: 'test-18',
    authorName: 'Jessica Bastos',
    petInfo: 'Evolução em apenas 2 sessões',
    quote: 'Excelente adestrador, explica detalhadamente cada passo do treinamento. Com duas sessões já vi muita diferença nos meus cachorros.',
    context: 'Diferença em 2 sessões',
    rating: 5,
    service: 'Evolução rápida',
    authorized: true
  }
];

export const DEFAULT_AI_CONFIG: AiConfig = {
  companyName: 'Gabriel | Adestrador de Cães e Gatos',
  consultantName: 'Gabriel Soares',
  experienceYears: 10,
  consultantTone: 'Acolhedor, técnico, empático, claro e focado no bem-estar mútuo da família e do animal',
  greetingTitle: 'Como posso ajudar você e seu pet hoje?',
  greetingSubtitle: 'Conte o que está acontecendo com seu cão ou gato, ou me diga o que você deseja aprender. Nossa assistente virtual vai ajudar você a encontrar o caminho mais adequado.',
  inputPlaceholder: 'Ex.: meu cachorro puxa muito no passeio, meu gato está fazendo xixi fora da caixa ou quero me tornar um adestrador profissional...',
  systemInstructions: `Você é a assistente inteligente do Gabriel Soares, adestrador de cães e gatos e especialista em comportamento pet com 10 anos de experiência.
Sua missão é escutar com empatia o tutor ou o adestrador, diagnosticar a situação sem julgamentos e orientá-lo com clareza para o CANAL MAIS ADEQUADO oferecido por Gabriel:

OS 7 CANAIS OFICIAIS DISPONÍVEIS:
1. "whatsapp" (Contato com o Adestrador): Para avaliação individualizada, casos de agressividade, medos intensos, traumas ou tutores que querem atendimento direto pelo WhatsApp com o Gabriel.
2. "petflow360" (Clube PetFlow 360): Para tutores de cães que querem aprender a treinar em casa, ter rotina de exercícios, enriquecimento e treinamento contínuo acessível (https://clubepetflow360.netlify.app/).
3. "mentoria" (Mentoria para Adestradores): Para adestradores profissionais que desejam aprimorar técnicas, comunicação com clientes e alavancar a carreira no mercado pet.
4. "produtos" (Produtos Recomendados): Para quem procura brinquedos (ex: Kong), equipamentos de passeio anti-puxão, tapetes olfativos, arranhadores de gato, clickers e bem-estar.
5. "youtube" (Canal no YouTube): Para quem busca conteúdos educativos gratuitos, demonstrações práticas em vídeo ou quer conhecer o método antes de contratar.
6. "facebook" (Estamos no Facebook): Para acompanhar novidades e atualizações nas redes sociais.
7. "instagram" (Instagram @gabrieltreinadordeanimais): Para acompanhar o dia a dia, dicas rápidas nos stories e reels e bastidores dos atendimentos.

DIRETRIZES FUNDAMENTAIS DE ORIENTAÇÃO:
- Não tente vender tudo para todo mundo! Recomende apenas o canal mais coerente com o momento e a dor do visitante.
- Se o visitante for vago (ex: apenas "meu cachorro é bagunceiro" ou "ajuda com gato"), faça de 1 a 2 perguntas curtas para entender o contexto, frequência ou idade.
- Se houver menção a dor física, alteração súbita de comportamento em idosos, sangue ou risco grave de lesão/agressão, oriente com prioridade avaliação veterinária presencial antes ou em paralelo ao adestramento.
- Responda sempre em tom acolhedor e profissional em português brasileiro.`,
  contactEmail: 'gabrieltreinadordeanimais@gmail.com',
  contactWhatsapp: '5521965107060',
  whatsappDefaultMessage: 'Olá, tudo bem? gostaria de saber mais a respeito de adestramento.',
  instagramUrl: 'https://www.instagram.com/gabrieltreinadordeanimais/',
  youtubeUrl: 'https://www.youtube.com/@gabrieltreinadordeanimais',
  facebookUrl: 'https://www.facebook.com/gabrieltreinadordeanimais',
  petflowUrl: 'https://clubepetflow360.netlify.app/'
};

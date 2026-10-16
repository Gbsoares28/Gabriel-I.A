import React, { useState, useEffect } from 'react';
import {
  X,
  Lock,
  Package,
  Sparkles,
  BarChart3,
  Sliders,
  Plus,
  Trash2,
  Edit2,
  Check,
  AlertCircle,
  ExternalLink,
  RotateCcw,
  TrendingUp,
  MessageCircle,
  Eye,
  LogOut,
  Save,
  CheckCircle2,
  MessageSquare,
  Star,
  Layers,
  Dog,
  Cat
} from 'lucide-react';
import { ChannelItem, Product, Shortcut, Testimonial, AiConfig, AnalyticsStats } from '../../types.js';
import {
  adminLogin,
  getAdminToken,
  setAdminToken,
  fetchChannels,
  saveChannels,
  updateChannel,
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  resetProducts,
  fetchTestimonials,
  saveTestimonials,
  fetchShortcuts,
  saveShortcuts,
  fetchAdminConfig,
  updateAdminConfig,
  fetchAnalytics
} from '../../services/api.js';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  onRefreshData?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  onRefreshData
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(Boolean(getAdminToken()));
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState<'channels' | 'products' | 'testimonials' | 'ai' | 'analytics'>('channels');

  // Data states
  const [channels, setChannels] = useState<ChannelItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [shortcuts, setShortcuts] = useState<Shortcut[]>([]);
  const [config, setConfig] = useState<AiConfig | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  // Modals
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      loadAllAdminData();
    }
  }, [isOpen, isAuthenticated]);

  const loadAllAdminData = async () => {
    setLoading(true);
    try {
      const [chs, prods, tests, scs, cfg, ana] = await Promise.all([
        fetchChannels(true),
        fetchProducts(true),
        fetchTestimonials(true),
        fetchShortcuts(true),
        fetchAdminConfig(),
        fetchAnalytics()
      ]);
      setChannels(chs);
      setProducts(prods);
      setTestimonials(tests);
      setShortcuts(scs);
      setConfig(cfg);
      setAnalytics(ana);
    } catch (err: any) {
      console.error('Failed to load admin data:', err);
      if (err.message === 'Não autorizado') {
        setIsAuthenticated(false);
        setAdminToken(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await adminLogin(password);
      if (res.success) {
        setIsAuthenticated(true);
        loadAllAdminData();
      } else {
        setLoginError(res.message || 'Senha incorreta.');
      }
    } catch (err) {
      setLoginError('Erro de conexão ao autenticar.');
    }
  };

  const handleLogout = () => {
    setAdminToken(null);
    setIsAuthenticated(false);
    setPassword('');
  };

  const showToast = (msg: string) => {
    setSaveSuccessMsg(msg);
    setTimeout(() => setSaveSuccessMsg(''), 3000);
  };

  // Channel Save
  const handleSaveChannels = async () => {
    try {
      await saveChannels(channels);
      showToast('Canais atualizados com sucesso!');
      onRefreshData?.();
    } catch (err) {
      alert('Erro ao salvar canais');
    }
  };

  // Product Save
  const handleSaveProduct = async (productData: Partial<Product>) => {
    try {
      if (editingProduct && editingProduct.id) {
        await updateProduct(editingProduct.id, productData);
      } else {
        await createProduct(productData as any);
      }
      setIsProductModalOpen(false);
      setEditingProduct(null);
      await loadAllAdminData();
      onRefreshData?.();
      showToast('Produto salvo com sucesso!');
    } catch (err) {
      alert('Erro ao salvar produto');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Deseja realmente excluir este produto?')) return;
    try {
      await deleteProduct(id);
      await loadAllAdminData();
      onRefreshData?.();
      showToast('Produto excluído!');
    } catch (err) {
      alert('Erro ao excluir produto');
    }
  };

  // Testimonials Save
  const handleSaveTestimonials = async () => {
    try {
      await saveTestimonials(testimonials);
      showToast('Depoimentos salvos com sucesso!');
      onRefreshData?.();
    } catch (err) {
      alert('Erro ao salvar depoimentos');
    }
  };

  const handleAddTestimonial = () => {
    const newItem: Testimonial = {
      id: 'test-' + Date.now().toString(36),
      authorName: 'Novo Cliente',
      petInfo: 'Tutor(a) de cão/gato',
      quote: 'Descreva a experiência do cliente aqui...',
      context: 'Contexto do atendimento',
      rating: 5,
      publishedAt: 'Recente',
      highlight: 'Ótimo atendimento',
      service: 'Adestramento',
      authorized: true
    };
    setTestimonials([...testimonials, newItem]);
  };

  const handleLoadOfficialTestimonials = () => {
    const officials: Testimonial[] = [
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
    setTestimonials(officials);
    showToast('Todos os 18 depoimentos oficiais carregados! Clique em Salvar para persistir.');
  };

  // Config Save
  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!config) return;
    try {
      await updateAdminConfig(config);
      showToast('Configurações atualizadas!');
      onRefreshData?.();
    } catch (err) {
      alert('Erro ao salvar configurações');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-6xl bg-[#18191b] border border-[#26282c] rounded-[24px] shadow-2xl overflow-hidden max-h-[94vh] flex flex-col">
        {/* Top Bar */}
        <div className="p-4 sm:p-6 border-b border-[#26282c] flex items-center justify-between bg-[#121315]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#ea580c]/15 border border-[#ea580c]/30 flex items-center justify-center text-[#ea580c]">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                Painel Administrativo • Gabriel Soares
              </h2>
              <p className="text-xs text-[#8e939b]">
                Gerencie os 7 canais, produtos recomendados, depoimentos, WhatsApp e métricas.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 rounded-full text-xs font-medium text-neutral-400 hover:text-white bg-[#222428] border border-[#26282c] transition-colors flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sair</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-[#222428] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Success Toast */}
        {saveSuccessMsg && (
          <div className="bg-emerald-500/20 border-b border-emerald-500/30 px-6 py-2.5 text-xs font-semibold text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{saveSuccessMsg}</span>
          </div>
        )}

        {/* Login Screen */}
        {!isAuthenticated ? (
          <div className="p-8 sm:p-16 flex flex-col items-center justify-center text-center my-auto">
            <div className="w-16 h-16 rounded-2xl bg-[#ea580c]/15 border border-[#ea580c]/30 flex items-center justify-center mb-6 text-[#ea580c]">
              <Lock className="w-8 h-8" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
              Acesso ao Painel do Adestrador
            </h3>
            <p className="text-sm text-[#8e939b] max-w-sm mb-6">
              Digite a senha administrativa para configurar canais, produtos recomendados e diretrizes da IA.
            </p>

            <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4">
              <div className="text-left">
                <label className="text-xs font-medium text-neutral-300 block mb-1">
                  Senha de Acesso
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Digite sua senha de acesso"
                  className="w-full px-4 py-3 rounded-xl bg-[#121315] border border-[#26282c] text-white placeholder-neutral-600 focus:outline-none focus:border-[#16a34a] text-sm"
                  autoFocus
                />
              </div>

              {loginError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#ea580c] hover:bg-[#d9480f] text-white font-semibold text-sm transition-all shadow-md active:scale-98"
              >
                Entrar no Painel
              </button>
            </form>
          </div>
        ) : (
          /* Authenticated Dashboard Tabs */
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="px-4 sm:px-6 border-b border-[#26282c] bg-[#121315] flex gap-2 sm:gap-4 overflow-x-auto">
              <button
                onClick={() => setActiveTab('channels')}
                className={`py-3.5 px-3 border-b-2 text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                  activeTab === 'channels'
                    ? 'border-[#ea580c] text-[#ea580c]'
                    : 'border-transparent text-neutral-400 hover:text-white'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>Os 7 Canais Estratégicos</span>
              </button>

              <button
                onClick={() => setActiveTab('products')}
                className={`py-3.5 px-3 border-b-2 text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                  activeTab === 'products'
                    ? 'border-[#ea580c] text-[#ea580c]'
                    : 'border-transparent text-neutral-400 hover:text-white'
                }`}
              >
                <Package className="w-4 h-4" />
                <span>Produtos Recomendados ({products.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('testimonials')}
                className={`py-3.5 px-3 border-b-2 text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                  activeTab === 'testimonials'
                    ? 'border-[#ea580c] text-[#ea580c]'
                    : 'border-transparent text-neutral-400 hover:text-white'
                }`}
              >
                <Star className="w-4 h-4" />
                <span>Depoimentos Reais ({testimonials.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('ai')}
                className={`py-3.5 px-3 border-b-2 text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                  activeTab === 'ai'
                    ? 'border-[#ea580c] text-[#ea580c]'
                    : 'border-transparent text-neutral-400 hover:text-white'
                }`}
              >
                <Sliders className="w-4 h-4" />
                <span>IA & WhatsApp</span>
              </button>

              <button
                onClick={() => setActiveTab('analytics')}
                className={`py-3.5 px-3 border-b-2 text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                  activeTab === 'analytics'
                    ? 'border-[#ea580c] text-[#ea580c]'
                    : 'border-transparent text-neutral-400 hover:text-white'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span>Métricas de Conversão</span>
              </button>
            </div>

            {/* TAB CONTENTS */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              {/* TAB 1: CHANNELS */}
              {activeTab === 'channels' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-white">
                        Gerenciamento dos 7 Canais do Site
                      </h3>
                      <p className="text-xs text-neutral-400">
                        Altere os links, títulos, chamadas e botões. A IA consulta estes dados em tempo real.
                      </p>
                    </div>

                    <button
                      onClick={handleSaveChannels}
                      className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-neutral-950 bg-amber-400 hover:bg-amber-300 transition-colors flex items-center gap-1.5 shadow-md"
                    >
                      <Save className="w-4 h-4" />
                      <span>Salvar Canais</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {channels.map((ch, idx) => (
                      <div
                        key={ch.id}
                        className="p-5 rounded-2xl bg-[#121315] border border-[#26282c] space-y-3"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                            Canal {idx + 1} • {ch.id.toUpperCase()}
                          </span>
                          <button
                            onClick={() => {
                              const updated = [...channels];
                              updated[idx].active = !updated[idx].active;
                              setChannels(updated);
                            }}
                            className={`px-3 py-1 rounded-full text-xs font-bold ${
                              ch.active
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : 'bg-[#1f1015] text-neutral-500'
                            }`}
                          >
                            {ch.active ? 'Ativo' : 'Desativado'}
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="text-[11px] font-semibold text-neutral-400 block mb-1">
                              Título do Canal
                            </label>
                            <input
                              type="text"
                              value={ch.title}
                              onChange={(e) => {
                                const updated = [...channels];
                                updated[idx].title = e.target.value;
                                setChannels(updated);
                              }}
                              className="w-full px-3 py-2 rounded-xl bg-[#18191b] border border-[#26282c] text-xs text-white"
                            />
                          </div>

                          <div>
                            <label className="text-[11px] font-semibold text-neutral-400 block mb-1">
                              Texto do Botão de Ação
                            </label>
                            <input
                              type="text"
                              value={ch.buttonText}
                              onChange={(e) => {
                                const updated = [...channels];
                                updated[idx].buttonText = e.target.value;
                                setChannels(updated);
                              }}
                              className="w-full px-3 py-2 rounded-xl bg-[#18191b] border border-[#26282c] text-xs text-white"
                            />
                          </div>

                          <div className="sm:col-span-2">
                            <label className="text-[11px] font-semibold text-neutral-400 block mb-1">
                              Link Oficial de Destino (URL)
                            </label>
                            <input
                              type="text"
                              value={ch.link}
                              onChange={(e) => {
                                const updated = [...channels];
                                updated[idx].link = e.target.value;
                                setChannels(updated);
                              }}
                              className="w-full px-3 py-2 rounded-xl bg-[#18191b] border border-[#26282c] text-xs text-white"
                            />
                          </div>

                          <div className="sm:col-span-2">
                            <label className="text-[11px] font-semibold text-neutral-400 block mb-1">
                              Descrição Explicativa
                            </label>
                            <textarea
                              rows={2}
                              value={ch.description}
                              onChange={(e) => {
                                const updated = [...channels];
                                updated[idx].description = e.target.value;
                                setChannels(updated);
                              }}
                              className="w-full px-3 py-2 rounded-xl bg-[#18191b] border border-[#26282c] text-xs text-neutral-200 resize-none"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 2: PRODUCTS */}
              {activeTab === 'products' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-white">
                        Produtos Recomendados por Gabriel
                      </h3>
                      <p className="text-xs text-neutral-400">
                        Itens selecionados para enriquecimento, passeios sem puxões e treino seguro.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditingProduct(null);
                          setIsProductModalOpen(true);
                        }}
                        className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-neutral-950 bg-amber-400 hover:bg-amber-300 transition-colors flex items-center gap-1.5"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Cadastrar Produto</span>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {products.map((p) => (
                      <div
                        key={p.id}
                        className="p-4 rounded-2xl bg-[#121315] border border-[#26282c] flex items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={p.imageUrl}
                            alt={p.name}
                            className="w-14 h-14 rounded-xl object-cover bg-neutral-900 border border-[#26282c] shrink-0"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-sm text-white">{p.name}</h4>
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400/10 text-amber-300">
                                {p.species}
                              </span>
                            </div>
                            <p className="text-xs text-neutral-400 line-clamp-1 mt-0.5">
                              {p.description}
                            </p>
                            <span className="text-xs font-bold text-emerald-400 mt-1 block">
                              {p.price}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => {
                              setEditingProduct(p);
                              setIsProductModalOpen(true);
                            }}
                            className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-[#1f1015]"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            className="p-2 rounded-lg text-rose-400 hover:bg-rose-500/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: TESTIMONIALS */}
              {activeTab === 'testimonials' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-white">
                        Depoimentos Reais de Clientes
                      </h3>
                      <p className="text-xs text-neutral-400">
                        Histórias e avaliações autorizadas de famílias atendidas.
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={handleLoadOfficialTestimonials}
                        className="px-3 py-2 rounded-xl text-xs font-semibold text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 transition-all flex items-center gap-1.5"
                        title="Carregar os 5 depoimentos oficiais fornecidos"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Carregar Nomes Oficiais</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleAddTestimonial}
                        className="px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-[#1e2024] hover:bg-[#282a30] border border-[#2f3238] transition-all flex items-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Novo Depoimento</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleSaveTestimonials}
                        className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#16a34a] hover:bg-[#15803d] transition-all shadow-md active:scale-95"
                      >
                        Salvar Depoimentos
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {testimonials.map((t, idx) => (
                      <div
                        key={t.id}
                        className="p-5 rounded-2xl bg-[#121315] border border-[#26282c] space-y-3"
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="text-[11px] font-semibold text-neutral-400 block mb-1">
                              Nome do Cliente
                            </label>
                            <input
                              type="text"
                              value={t.authorName}
                              onChange={(e) => {
                                const updated = [...testimonials];
                                updated[idx].authorName = e.target.value;
                                setTestimonials(updated);
                              }}
                              className="w-full px-3 py-2 rounded-xl bg-[#18191b] border border-[#26282c] text-xs text-white"
                            />
                          </div>

                          <div>
                            <label className="text-[11px] font-semibold text-neutral-400 block mb-1">
                              Animal / Raça / Idade
                            </label>
                            <input
                              type="text"
                              value={t.petInfo}
                              onChange={(e) => {
                                const updated = [...testimonials];
                                updated[idx].petInfo = e.target.value;
                                setTestimonials(updated);
                              }}
                              className="w-full px-3 py-2 rounded-xl bg-[#18191b] border border-[#26282c] text-xs text-white"
                            />
                          </div>

                          <div>
                            <label className="text-[11px] font-semibold text-neutral-400 block mb-1">
                              Contexto do Atendimento
                            </label>
                            <input
                              type="text"
                              value={t.context || ''}
                              onChange={(e) => {
                                const updated = [...testimonials];
                                updated[idx].context = e.target.value;
                                setTestimonials(updated);
                              }}
                              className="w-full px-3 py-2 rounded-xl bg-[#18191b] border border-[#26282c] text-xs text-white"
                            />
                          </div>

                          <div>
                            <label className="text-[11px] font-semibold text-neutral-400 block mb-1">
                              Serviço Realizado
                            </label>
                            <input
                              type="text"
                              placeholder="ex.: Adestramento de cães"
                              value={t.service || ''}
                              onChange={(e) => {
                                const updated = [...testimonials];
                                updated[idx].service = e.target.value;
                                setTestimonials(updated);
                              }}
                              className="w-full px-3 py-2 rounded-xl bg-[#18191b] border border-[#26282c] text-xs text-white"
                            />
                          </div>

                          <div>
                            <label className="text-[11px] font-semibold text-neutral-400 block mb-1">
                              Destaque / Badge
                            </label>
                            <input
                              type="text"
                              placeholder="ex.: Ótimo preço, Preço razoável"
                              value={t.highlight || ''}
                              onChange={(e) => {
                                const updated = [...testimonials];
                                updated[idx].highlight = e.target.value;
                                setTestimonials(updated);
                              }}
                              className="w-full px-3 py-2 rounded-xl bg-[#18191b] border border-[#26282c] text-xs text-white"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="text-[11px] font-semibold text-neutral-400 block mb-1">
                                Publicação
                              </label>
                              <input
                                type="text"
                                placeholder="ex.: Há 2 semanas"
                                value={t.publishedAt || ''}
                                onChange={(e) => {
                                  const updated = [...testimonials];
                                  updated[idx].publishedAt = e.target.value;
                                  setTestimonials(updated);
                                }}
                                className="w-full px-3 py-2 rounded-xl bg-[#18191b] border border-[#26282c] text-xs text-white"
                              />
                            </div>
                            <div>
                              <label className="text-[11px] font-semibold text-neutral-400 block mb-1">
                                Estrelas
                              </label>
                              <select
                                value={t.rating || 5}
                                onChange={(e) => {
                                  const updated = [...testimonials];
                                  updated[idx].rating = Number(e.target.value);
                                  setTestimonials(updated);
                                }}
                                className="w-full px-3 py-2 rounded-xl bg-[#18191b] border border-[#26282c] text-xs text-white"
                              >
                                <option value={5}>5 estrelas</option>
                                <option value={4}>4 estrelas</option>
                                <option value={3}>3 estrelas</option>
                              </select>
                            </div>
                          </div>

                          <div className="sm:col-span-3">
                            <label className="text-[11px] font-semibold text-neutral-400 block mb-1">
                              Depoimento Autorizado
                            </label>
                            <textarea
                              rows={2}
                              value={t.quote}
                              onChange={(e) => {
                                const updated = [...testimonials];
                                updated[idx].quote = e.target.value;
                                setTestimonials(updated);
                              }}
                              className="w-full px-3 py-2 rounded-xl bg-[#18191b] border border-[#26282c] text-xs text-neutral-200 resize-none"
                            />
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                          <label className="flex items-center gap-2 text-xs text-neutral-300">
                            <input
                              type="checkbox"
                              checked={t.authorized}
                              onChange={(e) => {
                                const updated = [...testimonials];
                                updated[idx].authorized = e.target.checked;
                                setTestimonials(updated);
                              }}
                              className="rounded text-amber-500"
                            />
                            <span>Depoimento com autorização para exibição pública</span>
                          </label>

                          <button
                            onClick={() => setTestimonials(testimonials.filter((_, i) => i !== idx))}
                            className="text-xs text-rose-400 hover:text-rose-300"
                          >
                            Excluir
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: AI & WHATSAPP CONFIG */}
              {activeTab === 'ai' && config && (
                <form onSubmit={handleSaveConfig} className="space-y-6 max-w-4xl">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white">
                      Configurações da IA, WhatsApp e Redes
                    </h3>
                    <p className="text-xs text-neutral-400">
                      Configure o número oficial de WhatsApp, mensagens automáticas e o comportamento da assistente virtual.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-neutral-300 block mb-1">
                        WhatsApp Oficial (com DDD e código do país)
                      </label>
                      <input
                        type="text"
                        value={config.contactWhatsapp}
                        onChange={(e) => setConfig({ ...config, contactWhatsapp: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#121315] border border-[#26282c] text-sm text-white"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-neutral-300 block mb-1">
                        E-mail de Contato
                      </label>
                      <input
                        type="email"
                        value={config.contactEmail}
                        onChange={(e) => setConfig({ ...config, contactEmail: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#121315] border border-[#26282c] text-sm text-white"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-xs font-semibold text-neutral-300 block mb-1">
                        Mensagem Pré-configurada ao Abrir o WhatsApp
                      </label>
                      <input
                        type="text"
                        value={config.whatsappDefaultMessage}
                        onChange={(e) => setConfig({ ...config, whatsappDefaultMessage: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#121315] border border-[#26282c] text-sm text-white"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-neutral-300 block mb-1">
                        Link do Clube PetFlow 360
                      </label>
                      <input
                        type="url"
                        value={config.petflowUrl}
                        onChange={(e) => setConfig({ ...config, petflowUrl: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#121315] border border-[#26282c] text-sm text-white"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-neutral-300 block mb-1">
                        Perfil do Instagram
                      </label>
                      <input
                        type="url"
                        value={config.instagramUrl}
                        onChange={(e) => setConfig({ ...config, instagramUrl: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#121315] border border-[#26282c] text-sm text-white"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-xs font-semibold text-neutral-300 block mb-1">
                        Diretrizes de Sistema da IA (System Prompt)
                      </label>
                      <textarea
                        rows={8}
                        value={config.systemInstructions}
                        onChange={(e) => setConfig({ ...config, systemInstructions: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-[#121315] border border-[#26282c] text-xs text-neutral-200 font-mono leading-relaxed"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#26282c] flex justify-end">
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-sm shadow-md"
                    >
                      Salvar Configurações
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 5: ANALYTICS */}
              {activeTab === 'analytics' && analytics && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white">
                      Métricas & Conversão por Canal
                    </h3>
                    <p className="text-xs text-neutral-400">
                      Acompanhe quantas pessoas chegam, dialogam com a assistente e acessam cada um dos canais.
                    </p>
                  </div>

                  {/* Funnel KPIs */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    <div className="p-4 rounded-2xl bg-[#121315] border border-[#26282c]">
                      <span className="text-xs text-neutral-400 block mb-1">Visitas no Site</span>
                      <div className="text-2xl font-extrabold text-white">{analytics.totalVisits}</div>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#121315] border border-[#26282c]">
                      <span className="text-xs text-amber-400 block mb-1">Conversas Iniciadas</span>
                      <div className="text-2xl font-extrabold text-amber-400">{analytics.totalConversationsStarted}</div>
                      <span className="text-[11px] text-neutral-500">{analytics.funnel.startConversionRate}% taxa</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#121315] border border-[#26282c]">
                      <span className="text-xs text-emerald-400 block mb-1">Cliques no WhatsApp</span>
                      <div className="text-2xl font-extrabold text-emerald-400">{analytics.totalWhatsAppClicks}</div>
                      <span className="text-[11px] text-neutral-500">Contatos diretos</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#121315] border border-[#26282c]">
                      <span className="text-xs text-amber-300 block mb-1">Acessos PetFlow 360</span>
                      <div className="text-2xl font-extrabold text-amber-300">{analytics.totalPetFlowClicks}</div>
                      <span className="text-[11px] text-neutral-500">Treino em casa</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#121315] border border-[#26282c]">
                      <span className="text-xs text-indigo-400 block mb-1">Interesse Mentoria</span>
                      <div className="text-2xl font-extrabold text-indigo-400">{analytics.totalMentoriaClicks}</div>
                      <span className="text-[11px] text-neutral-500">Adestradores</span>
                    </div>
                  </div>

                  {/* Top Problems Reported */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-5 rounded-2xl bg-[#121315] border border-[#26282c]">
                      <h4 className="text-sm font-bold text-white mb-3">Dores e Questões Mais Frequentes</h4>
                      {analytics.topProblems.length === 0 ? (
                        <p className="text-xs text-neutral-500">Nenhuma dor registrada ainda.</p>
                      ) : (
                        <div className="space-y-2">
                          {analytics.topProblems.map((p, i) => (
                            <div key={i} className="flex items-center justify-between p-2 rounded-xl bg-[#18191b] text-xs">
                              <span className="text-neutral-300 truncate max-w-[80%]">"{p.problem}"</span>
                              <span className="font-bold text-amber-400">{p.count}x</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="p-5 rounded-2xl bg-[#121315] border border-[#26282c]">
                      <h4 className="text-sm font-bold text-white mb-3">Canais Mais Clicados</h4>
                      {analytics.topChannelsClicked.length === 0 ? (
                        <p className="text-xs text-neutral-500">Nenhum clique registrado ainda.</p>
                      ) : (
                        <div className="space-y-2">
                          {analytics.topChannelsClicked.map((c, i) => (
                            <div key={i} className="flex items-center justify-between p-2 rounded-xl bg-[#18191b] text-xs">
                              <span className="text-neutral-300">{c.name}</span>
                              <span className="font-bold text-emerald-400">{c.count} cliques</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Product Create/Edit Modal */}
      {isProductModalOpen && (
        <ProductFormModal
          product={editingProduct}
          onClose={() => setIsProductModalOpen(false)}
          onSave={handleSaveProduct}
        />
      )}
    </div>
  );
};

// Subcomponent: Product Form Modal
interface ProductFormModalProps {
  product: Product | null;
  onClose: () => void;
  onSave: (data: Partial<Product>) => void;
}

const ProductFormModal: React.FC<ProductFormModalProps> = ({
  product,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    category: product?.category || 'Enriquecimento Ambiental',
    species: product?.species || 'Cão',
    badge: product?.badge || '',
    description: product?.description || '',
    usageIndication: product?.usageIndication || '',
    safetyNotes: product?.safetyNotes || '',
    price: product?.price || 'R$ 79,90',
    officialLink: product?.officialLink || 'https://amzn.to/exemplo',
    imageUrl: product?.imageUrl || 'https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?auto=format&fit=crop&w=800&q=80',
    keywords: product?.keywords?.join(', ') || '',
    priority: product?.priority || 8,
    active: product?.active ?? true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return alert('Nome do produto é obrigatório.');

    onSave({
      name: formData.name.trim(),
      category: formData.category as any,
      species: formData.species as any,
      badge: formData.badge.trim(),
      description: formData.description.trim(),
      usageIndication: formData.usageIndication.trim(),
      safetyNotes: formData.safetyNotes.trim(),
      price: formData.price.trim(),
      officialLink: formData.officialLink.trim(),
      imageUrl: formData.imageUrl.trim(),
      keywords: formData.keywords.split(',').map(s => s.trim()).filter(Boolean),
      priority: Number(formData.priority) || 5,
      active: formData.active
    });
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-3 bg-black/85 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-[#18191b] border border-[#26282c] rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        <div className="p-4 sm:p-5 border-b border-[#26282c] flex items-center justify-between bg-[#121315]">
          <h3 className="font-bold text-white text-base">
            {product ? 'Editar Produto Pet' : 'Cadastrar Novo Produto Pet'}
          </h3>
          <button onClick={onClose} className="p-1 rounded-lg text-neutral-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-neutral-300 block mb-1">
                Nome do Produto *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#121315] border border-[#26282c] text-sm text-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-300 block mb-1">
                Espécie Indicada
              </label>
              <select
                value={formData.species}
                onChange={(e) => setFormData({ ...formData, species: e.target.value as any })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#121315] border border-[#26282c] text-sm text-white"
              >
                <option value="Cão">Cão</option>
                <option value="Gato">Gato</option>
                <option value="Cão e Gato">Cão e Gato</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-300 block mb-1">
                Categoria
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#121315] border border-[#26282c] text-sm text-white"
              >
                <option value="Enriquecimento Ambiental">Enriquecimento Ambiental</option>
                <option value="Equipamentos de Passeio">Equipamentos de Passeio</option>
                <option value="Treinamento & Adestramento">Treinamento & Adestramento</option>
                <option value="Higiene & Bem-estar">Higiene & Bem-estar</option>
                <option value="Alimentação & Petiscos">Alimentação & Petiscos</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-300 block mb-1">Preço</label>
              <input
                type="text"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#121315] border border-[#26282c] text-sm text-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-300 block mb-1">Destaque (Badge)</label>
              <input
                type="text"
                value={formData.badge}
                onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#121315] border border-[#26282c] text-sm text-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-neutral-300 block mb-1">Link de Compra</label>
              <input
                type="url"
                required
                value={formData.officialLink}
                onChange={(e) => setFormData({ ...formData, officialLink: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#121315] border border-[#26282c] text-sm text-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-neutral-300 block mb-1">URL da Imagem</label>
              <input
                type="url"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#121315] border border-[#26282c] text-sm text-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-neutral-300 block mb-1">Descrição</label>
              <textarea
                rows={2}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-[#121315] border border-[#26282c] text-sm text-white resize-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-neutral-300 block mb-1">Indicação de Uso</label>
              <input
                type="text"
                value={formData.usageIndication}
                onChange={(e) => setFormData({ ...formData, usageIndication: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#121315] border border-[#26282c] text-sm text-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-amber-300 block mb-1">Observações de Segurança</label>
              <input
                type="text"
                value={formData.safetyNotes}
                onChange={(e) => setFormData({ ...formData, safetyNotes: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#121315] border border-[#26282c] text-sm text-white"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-[#26282c] flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-neutral-400 hover:text-white"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-sm"
            >
              Salvar Produto
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

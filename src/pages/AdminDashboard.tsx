import { useState, useEffect } from "react";
import { listEvents } from "@/lib/services/event.service";
import { GetUserResponse, ListSubscriptionResponse } from "@/types/api";
import { ListEventResponse } from "@/types/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Shield,
  Calendar,
  Users,
  DollarSign,
  BarChart3,
  Search,
  Filter,
  Building2,
  Eye,
  Download,
  Loader2,
  LogOut,
  User,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { CriarEventoModal } from "@/components/CriarEventoModal";
import { DetalhesInscricaoModal } from "@/components/DetalhesInscricaoModal";
import { listSubscriptions } from "@/lib/services/subscription.service";
import {
  SubscriptionStatusEnum,
  EventStatusEnum,
  CategoryNameEnum,
} from "@/types/enums/api-enums";
import { formatDate, formatPrice } from "@/utils/format-data.util";
import { getMe } from "@/lib/services/user.service";
import { useAuth } from "@/contexts/AuthContext";
import {
  getCategoryNameMap,
  getEventStatusMap,
  getSubscriptionStatusMap,
} from "@/types/enums/enum-maps";

const AdminDashboard = () => {
  const [inscricaoSelecionada, setInscricaoSelecionada] =
    useState<ListSubscriptionResponse | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Filtros
  const [filtroEvento, setFiltroEvento] = useState<string>("todos");
  const [filtroCategoria, setFiltroCategoria] = useState<string>("todos");
  const [filtroStatus, setFiltroStatus] = useState<string>("todos");
  const [buscaNome, setBuscaNome] = useState<string>("");

  // Eventos do organizador vindos da API
  const [eventos, setEventos] = useState<ListEventResponse[]>([]);
  const [loadingEventos, setLoadingEventos] = useState(true);

  // Inscrições vindas da API
  const [inscricoes, setInscricoes] = useState<ListSubscriptionResponse[]>([]);
  const [loadingInscricoes, setLoadingInscricoes] = useState(true);

  const [usuario, setUsuario] = useState<GetUserResponse | null>(null);
  const [loadingUsuario, setLoadingUsuario] = useState(true);

  // Estatísticas calculadas
  const [stats, setStats] = useState({
    totalEventos: 0,
    totalInscricoes: 0,
    receitaTotal: 0,
    checkinsHoje: 0,
  });

  const { user, logout } = useAuth();

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    calcularEstatisticas();
  }, [eventos, inscricoes]);

  const fetchData = async () => {
    await Promise.all([fetchUsuario(), fetchEventos(), fetchInscricoes()]);
  };

  const fetchUsuario = async () => {
    try {
      setLoadingUsuario(true);
      const token = localStorage.getItem("token");

      const response = await getMe(token);
      const data = await response.json();
      setUsuario(data);
    } catch (err) {
      console.error("Erro ao carregar usuário:", err);
      setUsuario(null);
    } finally {
      setLoadingUsuario(false);
    }
  };

  const fetchEventos = async () => {
    try {
      setLoadingEventos(true);
      const response = await listEvents();
      setEventos(response.data ?? []);
    } catch (err) {
      console.error("Erro ao carregar eventos:", err);
      setEventos([]);
    } finally {
      setLoadingEventos(false);
    }
  };

  const fetchInscricoes = async () => {
    try {
      setLoadingInscricoes(true);
      const response = await listSubscriptions();
      setInscricoes(response ?? []);
    } catch (err) {
      console.error("Erro ao carregar inscrições:", err);
      setInscricoes([]);
    } finally {
      setLoadingInscricoes(false);
    }
  };

  const calcularEstatisticas = () => {
    const totalEventos = eventos.length;

    const totalInscricoes = inscricoes.length;

    const receitaTotal = inscricoes.reduce((total, inscricao) => {
      return total + (Number(inscricao.passwordPrice) || 0);
    }, 0);

    const hoje = new Date().toDateString();
    const checkinsHoje = inscricoes.filter((inscricao) => {
      const dataInscricao = new Date(inscricao.subscribedAt).toDateString();
      return (
        dataInscricao === hoje &&
        inscricao.status === SubscriptionStatusEnum.CONFIRMED
      );
    }).length;

    setStats({
      totalEventos,
      totalInscricoes,
      receitaTotal,
      checkinsHoje,
    });
  };

  const handleVerDetalhes = (inscricao: ListSubscriptionResponse) => {
    setInscricaoSelecionada(inscricao);
    setModalOpen(true);
  };

  // Função para filtrar inscrições vindas da API
  const inscricoesFiltradas = inscricoes.filter((inscricao) => {
    const matchEvento =
      filtroEvento === "todos" ||
      (inscricao.event?.id && inscricao.event.id.toString() === filtroEvento);

    const matchCategoria =
      filtroCategoria === "todos" ||
      inscricao.category?.name === filtroCategoria;

    const matchStatus =
      filtroStatus === "todos" || inscricao.status === filtroStatus;

    const matchNome =
      buscaNome === "" ||
      (inscricao.runner?.name &&
        inscricao.runner.name.toLowerCase().includes(buscaNome.toLowerCase()));

    return matchEvento && matchCategoria && matchStatus && matchNome;
  });

  // Obter categorias únicas para filtro
  const categoriasUnicas = [
    ...new Set(inscricoes.map((insc) => insc.category?.name).filter(Boolean)),
  ];

  // Mapeia para [{valor, label}] traduzido
  const categoriasFiltradas = categoriasUnicas.map((cat) => ({
    valor: cat,
    label: getCategoryNameMap(cat),
  }));

  // Obter eventos únicos para filtro
  const eventosUnicos = [
    ...new Set(inscricoes.map((insc) => insc.event?.id).filter(Boolean)),
  ];

  // Calcular financeiro por evento
  const financeiroPorEvento = eventos.map((evento) => {
    const inscricoesEvento = inscricoes.filter(
      (insc) => insc.event?.id.toString() === evento.id?.toString()
    );

    const receitaBruta = inscricoesEvento.reduce(
      (total, insc) => total + (Number(insc.passwordPrice) || 0),
      0
    );

    return {
      id: evento.id,
      nome: evento.name,
      data: new Date(evento.startAt).toLocaleDateString("pt-BR"),
      inscricoes: inscricoesEvento.length,
      receitaBruta,
      status: evento.status,
    };
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case SubscriptionStatusEnum.CONFIRMED:
        return "bg-green-500";
      case SubscriptionStatusEnum.PENDING:
        return "bg-yellow-500";
      case SubscriptionStatusEnum.CANCELLED:
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getEventStatusColor = (status: EventStatusEnum) => {
    switch (status) {
      case EventStatusEnum.SCHEDULED:
        return "bg-green-500";
      case EventStatusEnum.LIVE:
        return "bg-yellow-500";
      case EventStatusEnum.CANCELLED:
        return "bg-red-500";
      case EventStatusEnum.FINISHED:
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-primary/5">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-50 supports-backdrop-blur:bg-card/60">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-xl blur-sm"></div>
              <Shield className="h-8 w-8 text-primary relative z-10" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Painel do Organizador
              </h1>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Building2 className="h-4 w-4" />
                {loadingUsuario
                  ? "Carregando..."
                  : user?.name || usuario?.name || "Organizador"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 relative group">
            <div className="relative group">
              <Button
                variant="ghost"
                size="sm"
                className="rounded-xl flex items-center gap-2 px-3 py-2 hover:bg-primary/10 border border-transparent hover:border-primary/20"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-primary/70 flex items-center justify-center">
                    <User className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <span className="font-medium max-w-[120px] truncate hidden sm:block">
                    {user?.name || usuario?.name}
                  </span>
                </div>
              </Button>
              <div className="absolute right-0 top-full mt-2 min-w-[200px] bg-card/95 backdrop-blur-md border rounded-2xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden">
                <div className="p-2">
                  <div className="px-3 py-2 border-b border-border/50 mb-1">
                    <p className="text-sm font-medium text-foreground">
                      {user?.name || usuario?.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {user?.email || usuario?.email}
                    </p>
                  </div>
                  <Link
                    to="/admin/perfil"
                    className="flex items-center gap-3 px-3 py-2 text-sm text-foreground hover:bg-accent rounded-lg transition-all duration-200 group/item"
                  >
                    <User className="h-4 w-4 text-primary" />
                    <span>Meu Perfil</span>
                    <ArrowRight className="h-3 w-3 ml-auto opacity-0 group-hover/item:opacity-100 transition-opacity" />
                  </Link>
                  <button
                    onClick={logout}
                    className="flex items-center gap-3 w-full px-3 py-2 text-sm text-foreground hover:bg-destructive/10 hover:text-destructive rounded-lg transition-all duration-200 group/item"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sair</span>
                    <ArrowRight className="h-3 w-3 ml-auto opacity-0 group-hover/item:opacity-100 transition-opacity" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-card/80 backdrop-blur-sm border-2 hover:shadow-lg transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-sm font-medium">
                Eventos Ativos
              </CardTitle>
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <Calendar className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {stats.totalEventos}
              </div>
              <p className="text-xs text-muted-foreground">
                Total de eventos cadastrados
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur-sm border-2 hover:shadow-lg transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-sm font-medium">
                Total de Inscrições
              </CardTitle>
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <Users className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {stats.totalInscricoes}
              </div>
              <p className="text-xs text-muted-foreground">
                Inscrições em todos os eventos
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur-sm border-2 hover:shadow-lg transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-sm font-medium">
                Receita Total
              </CardTitle>
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <DollarSign className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {formatPrice(stats.receitaTotal)}
              </div>
              <p className="text-xs text-muted-foreground">
                Receita bruta acumulada
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="eventos" className="w-full">
          <TabsList className="grid w-full grid-cols-3 rounded-2xl bg-muted/50 p-1">
            <TabsTrigger
              value="eventos"
              className="rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Eventos
            </TabsTrigger>
            <TabsTrigger
              value="inscricoes"
              className="rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              <Users className="h-4 w-4 mr-2" />
              Inscrições
            </TabsTrigger>
            <TabsTrigger
              value="financeiro"
              className="rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              <DollarSign className="h-4 w-4 mr-2" />
              Financeiro
            </TabsTrigger>
          </TabsList>

          <TabsContent value="eventos" className="mt-6 space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  Meus Eventos
                </h2>
                <p className="text-muted-foreground">
                  Gerencie todos os eventos do seu parque
                </p>
              </div>
              <CriarEventoModal onEventCreated={fetchEventos} />
            </div>

            <div className="grid gap-4">
              {loadingEventos ? (
                <div className="text-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">Carregando eventos...</p>
                </div>
              ) : eventos.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">
                    Nenhum evento encontrado
                  </p>
                  <p className="text-sm">
                    Crie seu primeiro evento para começar
                  </p>
                </div>
              ) : (
                eventos.map((evento) => (
                  <Card
                    key={evento.id}
                    className="bg-card/80 backdrop-blur-sm border-2 hover:shadow-lg transition-all"
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-yellow-400 rounded-xl flex items-center justify-center">
                            <Calendar className="h-6 w-6 text-primary-foreground" />
                          </div>
                          <div className="flex-1">
                            <CardTitle className="text-xl">
                              {evento.name}
                            </CardTitle>
                            <CardDescription className="flex items-center gap-2 mt-1">
                              <Calendar className="h-4 w-4" />
                              {formatDate(evento.startAt)}
                              {evento.endAt && (
                                <>
                                  <span>até</span>
                                  {formatDate(evento.endAt)}
                                </>
                              )}
                            </CardDescription>
                            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                              <span>
                                {evento.address}, {evento.city} - {evento.state}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <div className="flex items-center gap-2 justify-end">
                              <div
                                className={`w-2 h-2 rounded-full ${getEventStatusColor(
                                  evento.status
                                )}`}
                              ></div>
                              <span className="text-sm font-medium">
                                {getEventStatusMap(evento.status)}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {
                                inscricoes.filter(
                                  (insc) =>
                                    insc.event?.id.toString() ===
                                    evento.id?.toString()
                                ).length
                              }{" "}
                              inscrições
                            </p>
                          </div>
                          <Button className="rounded-xl bg-primary hover:bg-primary/90">
                            Gerenciar
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="inscricoes" className="mt-6">
            <Card className="bg-card/80 backdrop-blur-sm border-2">
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <CardTitle className="text-2xl bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                      Inscrições
                    </CardTitle>
                    <CardDescription className="text-base">
                      {inscricoesFiltradas.length}{" "}
                      {inscricoesFiltradas.length === 1
                        ? "inscrição encontrada"
                        : "inscrições encontradas"}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Filter className="h-5 w-5" />
                    <span className="text-sm">Filtros</span>
                  </div>
                </div>

                {/* Filtros */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar por nome..."
                      value={buscaNome}
                      onChange={(e) => setBuscaNome(e.target.value)}
                      className="pl-10 rounded-xl border-2 focus:border-primary/50 bg-background/50"
                    />
                  </div>

                  <Select value={filtroEvento} onValueChange={setFiltroEvento}>
                    <SelectTrigger className="rounded-xl border-2 focus:border-primary/50 bg-background/50">
                      <SelectValue placeholder="Todos os eventos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos os eventos</SelectItem>
                      {eventosUnicos.map((eventoId) => {
                        const evento = eventos.find(
                          (e) => e.id?.toString() === eventoId
                        );
                        return (
                          <SelectItem key={eventoId} value={eventoId}>
                            {evento?.name || `Evento ${eventoId}`}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>

                  <Select
                    value={filtroCategoria}
                    onValueChange={setFiltroCategoria}
                  >
                    <SelectTrigger className="rounded-xl border-2 focus:border-primary/50 bg-background/50">
                      <SelectValue placeholder="Todas as categorias" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todas as categorias</SelectItem>
                      {categoriasFiltradas.map((categoria) => (
                        <SelectItem
                          key={categoria.valor}
                          value={categoria.valor}
                        >
                          {categoria.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={filtroStatus} onValueChange={setFiltroStatus}>
                    <SelectTrigger className="rounded-xl border-2 focus:border-primary/50 bg-background/50">
                      <SelectValue placeholder="Todos os status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos os status</SelectItem>
                      <SelectItem value={SubscriptionStatusEnum.CONFIRMED}>
                        Confirmado
                      </SelectItem>
                      <SelectItem value={SubscriptionStatusEnum.PENDING}>
                        Pendente
                      </SelectItem>
                      <SelectItem value={SubscriptionStatusEnum.CANCELLED}>
                        Cancelado
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {loadingInscricoes ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                      <p className="text-lg font-medium">
                        Carregando inscrições...
                      </p>
                    </div>
                  ) : inscricoesFiltradas.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium">
                        Nenhuma inscrição encontrada
                      </p>
                      <p className="text-sm">
                        Tente ajustar os filtros de busca
                      </p>
                    </div>
                  ) : (
                    inscricoesFiltradas.map((inscricao, index) => (
                      <div
                        key={inscricao.id || index}
                        className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border hover:border-primary/30 transition-all group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-primary-foreground" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                              {inscricao.runner?.name || "Nome não informado"}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {inscricao.event?.name || "Evento não encontrado"}{" "}
                              • {getCategoryNameMap(inscricao.category?.name)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-2 justify-end mb-2">
                            <div
                              className={`w-2 h-2 rounded-full ${getStatusColor(
                                inscricao.status
                              )}`}
                            ></div>
                            <span className="text-sm text-muted-foreground">
                              {getSubscriptionStatusMap(inscricao.status)}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(inscricao.subscribedAt)}
                          </p>
                          <p className="text-sm font-medium text-foreground">
                            {formatPrice(Number(inscricao.passwordPrice) || 0)}
                          </p>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleVerDetalhes(inscricao)}
                            className="mt-2 rounded-xl hover:bg-[#AF6B00] hover:text-white transition-colors"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Ver detalhes
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="financeiro" className="mt-6 space-y-6">
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent mb-2">
                Financeiro
              </h2>
              <p className="text-muted-foreground">
                Acompanhe a saúde financeira do seu parque
              </p>
            </div>

            <div className="grid gap-6">
              <Card className="bg-card/80 backdrop-blur-sm border-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-primary" />
                    Resumo Financeiro Geral
                  </CardTitle>
                  <CardDescription>
                    Todos os eventos - Dados em tempo real
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                      <span className="text-muted-foreground">
                        Receita bruta
                      </span>
                      <span className="text-2xl font-bold text-foreground">
                        {formatPrice(stats.receitaTotal)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-gradient-vaquejada rounded-lg text-primary-foreground">
                      <span className="font-medium">Receita líquida</span>
                      <span className="text-2xl font-bold">
                        {formatPrice(stats.receitaTotal)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/80 backdrop-blur-sm border-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    Financeiro por Evento
                  </CardTitle>
                  <CardDescription>
                    Detalhamento de receita por evento
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {financeiroPorEvento.map((evento, i) => (
                      <Card
                        key={evento.id || i}
                        className="border-2 bg-muted/20 hover:border-primary/30 transition-all"
                      >
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle className="text-lg">
                                {evento.nome}
                              </CardTitle>
                              <CardDescription>
                                {evento.data} • {evento.inscricoes} inscrições
                              </CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div className="text-center p-3 bg-background/50 rounded-lg">
                              <span className="text-muted-foreground">
                                Receita bruta
                              </span>
                              <p className="font-bold text-lg text-foreground">
                                {formatPrice(evento.receitaBruta)}
                              </p>
                            </div>
                          </div>
                          <div className="mt-4 flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 rounded-xl"
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Exportar CSV
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 rounded-xl"
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Ver detalhes
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <DetalhesInscricaoModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        inscricao={inscricaoSelecionada}
      />
    </div>
  );
};

export default AdminDashboard;

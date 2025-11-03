import { UsuariosTab } from "@/components/admin/UsuariosTab";
import { EventosTab } from "@/components/admin/EventosTab";
import { InscricoesTab } from "@/components/admin/InscricoesTab";
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
import {
  Shield,
  Calendar,
  Users,
  DollarSign,
  BarChart3,
  Building2,
  Eye,
  Download,
  LogOut,
  User,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { DetalhesInscricaoModal } from "@/components/DetalhesInscricaoModal";
import { listSubscriptions } from "@/lib/services/subscription.service";
import {
  SubscriptionStatusEnum,
  EventStatusEnum,
} from "@/types/enums/api-enums";
import { formatPrice } from "@/utils/format-data.util";
import { getMe } from "@/lib/services/user.service";
import { listUsers } from "@/lib/services/user.service";
import { useAuth } from "@/contexts/AuthContext";
import { getCategoryNameMap } from "@/types/enums/enum-maps";
import { CriarEventoModal } from "@/components/CriarEventoModal";

const AdminDashboard = () => {
  // Estados base
  const [usuarios, setUsuarios] = useState<GetUserResponse[]>([]);
  const [eventos, setEventos] = useState<ListEventResponse[]>([]);
  const [inscricoes, setInscricoes] = useState<ListSubscriptionResponse[]>([]);
  const [usuario, setUsuario] = useState<GetUserResponse | null>(null);

  // Estados de loading
  const [loadingUsuarios, setLoadingUsuarios] = useState(true);
  const [loadingEventos, setLoadingEventos] = useState(true);
  const [loadingInscricoes, setLoadingInscricoes] = useState(true);
  const [loadingUsuario, setLoadingUsuario] = useState(true);

  // Estados para modais
  const [inscricaoSelecionada, setInscricaoSelecionada] =
    useState<ListSubscriptionResponse | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // FILTROS USUÁRIOS - ATUALIZADO COM ROLE
  const [usuariosFiltro, setUsuariosFiltro] = useState("");
  const [usuariosFiltroRole, setUsuariosFiltroRole] = useState<string>("todos");
  const [usuariosPage, setUsuariosPage] = useState(1);
  const usuariosPerPage = 10;

  // FILTROS EVENTOS - ATUALIZADO COM STATUS, CIDADE, ESTADO
  const [eventosFiltro, setEventosFiltro] = useState("");
  const [eventosFiltroStatus, setEventosFiltroStatus] =
    useState<string>("todos");
  const [eventosFiltroCidade, setEventosFiltroCidade] =
    useState<string>("todos");
  const [eventosFiltroEstado, setEventosFiltroEstado] =
    useState<string>("todos");
  const [eventosPage, setEventosPage] = useState(1);
  const eventosPerPage = 10;

  // Filtros inscrições
  const [filtroEvento, setFiltroEvento] = useState<string>("todos");
  const [filtroCategoria, setFiltroCategoria] = useState<string>("todos");
  const [filtroStatus, setFiltroStatus] = useState<string>("todos");
  const [buscaNome, setBuscaNome] = useState<string>("");

  // Estatísticas
  const [stats, setStats] = useState({
    totalEventos: 0,
    totalInscricoes: 0,
    receitaTotal: 0,
    checkinsHoje: 0,
  });

  const { user, logout } = useAuth();

  // Efeitos para resetar paginação quando filtros mudam - ATUALIZADOS
  useEffect(() => {
    setUsuariosPage(1);
  }, [usuariosFiltro, usuariosFiltroRole]);

  useEffect(() => {
    setEventosPage(1);
  }, [
    eventosFiltro,
    eventosFiltroStatus,
    eventosFiltroCidade,
    eventosFiltroEstado,
  ]);

  // Carregar dados iniciais
  useEffect(() => {
    fetchData();
  }, []);

  // Calcular estatísticas quando eventos ou inscrições mudam
  useEffect(() => {
    calcularEstatisticas();
  }, [eventos, inscricoes]);

  const fetchData = async () => {
    await Promise.all([
      fetchUsuario(),
      fetchEventos(),
      fetchInscricoes(),
      fetchUsuarios(),
    ]);
  };

  const fetchUsuarios = async () => {
    try {
      setLoadingUsuarios(true);
      const response = await listUsers();
      setUsuarios(response ?? []);
    } catch (err) {
      console.error("Erro ao carregar usuários:", err);
      setUsuarios([]);
    } finally {
      setLoadingUsuarios(false);
    }
  };

  const fetchUsuario = async () => {
    try {
      setLoadingUsuario(true);
      const response = await getMe();
      setUsuario(response.data);
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

  // FILTROS USUÁRIOS - ATUALIZADO COM ROLE
  const usuariosFiltrados = usuarios.filter((u) => {
    const matchNomeEmail =
      u.name?.toLowerCase().includes(usuariosFiltro.toLowerCase()) ||
      u.email?.toLowerCase().includes(usuariosFiltro.toLowerCase());

    const matchRole =
      usuariosFiltroRole === "todos" || u.role === usuariosFiltroRole;

    return matchNomeEmail && matchRole;
  });

  const usuariosTotalPages = Math.max(
    1,
    Math.ceil(usuariosFiltrados.length / usuariosPerPage)
  );

  const usuariosPaginados = usuariosFiltrados.slice(
    (usuariosPage - 1) * usuariosPerPage,
    usuariosPage * usuariosPerPage
  );

  // Obter roles únicos para filtro
  const rolesUnicos = [...new Set(usuarios.map((u) => u.role).filter(Boolean))];

  // FILTROS EVENTOS - ATUALIZADO COM STATUS, CIDADE, ESTADO
  const eventosFiltrados = eventos.filter((e) => {
    const matchNome = e.name
      ?.toLowerCase()
      .includes(eventosFiltro.toLowerCase());
    const matchStatus =
      eventosFiltroStatus === "todos" || e.status === eventosFiltroStatus;
    const matchCidade =
      eventosFiltroCidade === "todos" || e.city === eventosFiltroCidade;
    const matchEstado =
      eventosFiltroEstado === "todos" || e.state === eventosFiltroEstado;

    return matchNome && matchStatus && matchCidade && matchEstado;
  });

  const eventosTotalPages = Math.max(
    1,
    Math.ceil(eventosFiltrados.length / eventosPerPage)
  );

  const eventosPaginados = eventosFiltrados.slice(
    (eventosPage - 1) * eventosPerPage,
    eventosPage * eventosPerPage
  );

  // Obter cidades, estados e status únicos para filtros
  const cidadesUnicas = [
    ...new Set(eventos.map((e) => e.city).filter(Boolean)),
  ];
  const estadosUnicos = [
    ...new Set(eventos.map((e) => e.state).filter(Boolean)),
  ];
  const statusUnicos = [
    ...new Set(eventos.map((e) => e.status).filter(Boolean)),
  ];

  // Filtros para inscrições
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

  const handleVerDetalhes = (inscricao: ListSubscriptionResponse) => {
    setInscricaoSelecionada(inscricao);
    setModalOpen(true);
  };

  // Obter categorias únicas para filtro
  const categoriasUnicas = [
    ...new Set(inscricoes.map((insc) => insc.category?.name).filter(Boolean)),
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
          <TabsList className="grid w-full grid-cols-4 rounded-2xl bg-muted/50 p-1">
            <TabsTrigger
              value="usuarios"
              className="rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              <User className="h-4 w-4 mr-2" />
              Usuários
            </TabsTrigger>
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

          <TabsContent value="usuarios" className="mt-6 space-y-6">
            <UsuariosTab
              usuarios={usuariosPaginados}
              loading={loadingUsuarios}
              page={usuariosPage}
              totalPages={usuariosTotalPages}
              onPageChange={setUsuariosPage}
              filtro={usuariosFiltro}
              onFiltroChange={setUsuariosFiltro}
              filtroRole={usuariosFiltroRole}
              onFiltroRoleChange={setUsuariosFiltroRole}
              totalUsuarios={usuariosFiltrados.length}
              rolesUnicos={rolesUnicos}
              onRefreshUsuarios={fetchUsuarios}
            />
          </TabsContent>

          <TabsContent value="eventos" className="mt-6 space-y-6">
            <EventosTab
              eventos={eventosPaginados}
              loading={loadingEventos}
              page={eventosPage}
              totalPages={eventosTotalPages}
              onPageChange={setEventosPage}
              filtro={eventosFiltro}
              onFiltroChange={setEventosFiltro}
              filtroStatus={eventosFiltroStatus}
              onFiltroStatusChange={setEventosFiltroStatus}
              filtroCidade={eventosFiltroCidade}
              onFiltroCidadeChange={setEventosFiltroCidade}
              filtroEstado={eventosFiltroEstado}
              onFiltroEstadoChange={setEventosFiltroEstado}
              totalEventos={eventosFiltrados.length}
              cidadesUnicas={cidadesUnicas}
              estadosUnicos={estadosUnicos}
              statusUnicos={statusUnicos}
              onEventCreated={fetchEventos}
            />
          </TabsContent>

          <TabsContent value="inscricoes" className="mt-6">
            <InscricoesTab
              inscricoes={inscricoes}
              loading={loadingInscricoes}
              filtroEvento={filtroEvento}
              filtroCategoria={filtroCategoria}
              filtroStatus={filtroStatus}
              buscaNome={buscaNome}
              onFiltroEventoChange={setFiltroEvento}
              onFiltroCategoriaChange={setFiltroCategoria}
              onFiltroStatusChange={setFiltroStatus}
              onBuscaNomeChange={setBuscaNome}
              inscricoesFiltradas={inscricoesFiltradas}
              onVerDetalhes={handleVerDetalhes}
            />
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
                            <div
                              className={`w-3 h-3 rounded-full ${getEventStatusColor(
                                evento.status as EventStatusEnum
                              )}`}
                            ></div>
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

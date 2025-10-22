import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Calendar,
  MapPin,
  Search,
  Users,
  LogOut,
  User,
  ArrowRight,
  ImageOff,
  Award,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { ListEventResponse } from "@/types/api";
import {
  listEvents,
  getEventRunners,
  submitVote,
} from "@/lib/services/event.service";
import { formatDate } from "@/utils/format-data.util";
import { UserRoleEnum } from "@/types/enums/api-enums";

interface Runner {
  id: string;
  name: string;
  number: string;
  category: string;
  hasVoted?: boolean;
  vote?: boolean | null;
}

const JudgePage = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [events, setEvents] = useState<ListEventResponse[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<ListEventResponse | null>(
    null
  );
  const [runners, setRunners] = useState<Runner[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingRunners, setLoadingRunners] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [submittingVote, setSubmittingVote] = useState<string | null>(null);

  // Verificar se o usuário é juiz
  const isJudge = user?.role === UserRoleEnum.JUDGE;

  useEffect(() => {
    async function fetchJudgeEvents() {
      if (!isJudge) return;

      try {
        const response = await listEvents();
        // Filtrar apenas eventos onde o usuário é juiz
        const judgeEvents =
          response.data?.filter((event) =>
            event.judges?.some((judge) => judge.id === user?.id)
          ) ?? [];
        setEvents(judgeEvents);
      } catch (err) {
        console.error("Erro ao carregar eventos do juiz:", err);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    }
    fetchJudgeEvents();
  }, [isJudge, user?.id]);

  const handleEventSelect = async (event: ListEventResponse) => {
    setSelectedEvent(event);
    setLoadingRunners(true);

    try {
      const runnersResponse = await getEventRunners(event.id);
      setRunners(runnersResponse ?? []);
    } catch (err) {
      console.error("Erro ao carregar corredores:", err);
      setRunners([]);
    } finally {
      setLoadingRunners(false);
    }
  };

  const handleVote = async (runnerId: string, approved: boolean) => {
    if (!selectedEvent) return;

    setSubmittingVote(runnerId);

    try {
      await submitVote(selectedEvent.id, runnerId, approved);

      // Atualizar estado local
      setRunners((prev) =>
        prev.map((runner) =>
          runner.id === runnerId
            ? { ...runner, hasVoted: true, vote: approved }
            : runner
        )
      );
    } catch (err) {
      console.error("Erro ao enviar voto:", err);
      alert("Erro ao enviar voto. Tente novamente.");
    } finally {
      setSubmittingVote(null);
    }
  };

  const filteredEvents = events.filter(
    (event) =>
      event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.city?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredRunners = runners.filter(
    (runner) =>
      runner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      runner.number.includes(searchTerm)
  );

  // Se não for juiz, mostrar mensagem de acesso negado
  if (!isJudge) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-destructive">
              Acesso Restrito
            </CardTitle>
            <CardDescription className="text-center">
              Esta área é exclusiva para juízes.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <XCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
            <p>Você não tem permissão para acessar esta página.</p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link to="/">Voltar para Home</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-md sticky top-0 z-50 supports-backdrop-blur:bg-background/60">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-xl blur-sm group-hover:blur-md transition-all"></div>
              <Award className="h-8 w-8 text-primary relative z-10 group-hover:scale-110 transition-transform" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Área do Juiz
            </h1>
          </Link>

          <div className="flex items-center gap-3">
            <div className="relative group">
              <Button
                variant="ghost"
                className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-primary/10 transition-all duration-200 border border-transparent hover:border-primary/20"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-primary/70 flex items-center justify-center">
                    <User className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <span className="font-medium max-w-[120px] truncate hidden sm:block">
                    {user?.name}
                  </span>
                </div>
              </Button>

              <div className="absolute right-0 top-full mt-2 min-w-[200px] bg-card/95 backdrop-blur-md border rounded-2xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden">
                <div className="p-2">
                  <div className="px-3 py-2 border-b border-border/50 mb-1">
                    <p className="text-sm font-medium text-foreground">
                      {user?.name}
                    </p>
                    <p className="text-xs text-muted-foreground">Juiz</p>
                  </div>
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

      <main className="container mx-auto px-4 py-8">
        {!selectedEvent ? (
          // Lista de eventos do juiz
          <div>
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Meus Eventos como Juiz
              </h1>
              <p className="text-lg text-muted-foreground">
                Selecione um evento para começar a avaliação
              </p>
            </div>

            {/* Search Bar */}
            <div className="max-w-xl mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Buscar eventos por cidade ou nome..."
                  className="pl-12 pr-4 py-2 text-base border-2 focus:border-primary/50 transition-all rounded-xl bg-background/50 backdrop-blur-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <Card
                    key={i}
                    className="overflow-hidden border-2 animate-pulse"
                  >
                    <div className="h-48 bg-muted"></div>
                    <CardHeader>
                      <div className="h-6 bg-muted rounded w-3/4"></div>
                      <div className="h-4 bg-muted rounded w-full mt-2"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="h-4 bg-muted rounded w-1/2 mb-4"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.map((event) => (
                  <Card
                    key={event.id}
                    className="overflow-hidden border-2 hover:border-primary/30 hover:shadow-2xl transition-all duration-300 group cursor-pointer bg-card/50 backdrop-blur-sm"
                    onClick={() => handleEventSelect(event)}
                  >
                    <div className="relative h-48 overflow-hidden bg-muted">
                      {event.bannerUrl ? (
                        <img
                          src={event.bannerUrl}
                          alt={`Banner do evento ${event.name}`}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/15 to-secondary/15 flex items-center justify-center">
                          <Award className="h-12 w-12 text-primary/30" />
                        </div>
                      )}
                    </div>

                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Award className="h-5 w-5 text-primary" />
                        {event.name}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {event.city && event.state
                          ? `${event.city}, ${event.state}`
                          : "Localização não informada"}
                      </CardDescription>
                    </CardHeader>

                    <CardContent>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {formatDate(event.startAt)} -{" "}
                          {formatDate(event.endAt)}
                        </span>
                      </div>
                    </CardContent>

                    <CardFooter>
                      <Button className="w-full group/btn">
                        <span>Avaliar Corredores</span>
                        <ArrowRight className="h-4 w-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <Award className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  Nenhum evento encontrado
                </h3>
                <p className="text-muted-foreground">
                  {searchTerm
                    ? `Não encontramos resultados para "${searchTerm}"`
                    : "Você não está designado como juiz em nenhum evento no momento"}
                </p>
              </div>
            )}
          </div>
        ) : (
          // Lista de corredores do evento selecionado
          <div>
            <div className="flex items-center gap-4 mb-6">
              <Button
                variant="outline"
                onClick={() => setSelectedEvent(null)}
                className="flex items-center gap-2"
              >
                <ArrowRight className="h-4 w-4 rotate-180" />
                Voltar
              </Button>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">
                  {selectedEvent.name}
                </h1>
                <p className="text-muted-foreground">
                  Avaliação de corredores - {selectedEvent.city},{" "}
                  {selectedEvent.state}
                </p>
              </div>
            </div>

            {/* Search Bar para corredores */}
            <div className="max-w-xl mb-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Buscar corredores por nome ou número..."
                  className="pl-12 pr-4 py-2 text-base border-2 focus:border-primary/50 transition-all rounded-xl bg-background/50 backdrop-blur-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {loadingRunners ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="h-20 bg-muted rounded-lg animate-pulse"
                  ></div>
                ))}
              </div>
            ) : filteredRunners.length > 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle>Corredores para Avaliação</CardTitle>
                  <CardDescription>
                    {runners.filter((r) => r.hasVoted).length} de{" "}
                    {runners.length} corredores avaliados
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Número</TableHead>
                        <TableHead>Nome</TableHead>
                        <TableHead>Categoria</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRunners.map((runner) => (
                        <TableRow key={runner.id}>
                          <TableCell className="font-mono font-bold">
                            #{runner.number}
                          </TableCell>
                          <TableCell className="font-medium">
                            {runner.name}
                          </TableCell>
                          <TableCell>
                            <span className="px-2 py-1 bg-secondary text-secondary-foreground rounded-full text-xs">
                              {runner.category}
                            </span>
                          </TableCell>
                          <TableCell>
                            {runner.hasVoted ? (
                              <div className="flex items-center gap-2">
                                {runner.vote ? (
                                  <>
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                    <span className="text-green-600">
                                      Aprovado
                                    </span>
                                  </>
                                ) : (
                                  <>
                                    <XCircle className="h-4 w-4 text-red-500" />
                                    <span className="text-red-600">
                                      Reprovado
                                    </span>
                                  </>
                                )}
                              </div>
                            ) : (
                              <span className="text-muted-foreground">
                                Pendente
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            {!runner.hasVoted ? (
                              <div className="flex gap-2 justify-end">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-red-600 border-red-200 hover:bg-red-50"
                                  onClick={() => handleVote(runner.id, false)}
                                  disabled={submittingVote === runner.id}
                                >
                                  {submittingVote === runner.id ? (
                                    "Enviando..."
                                  ) : (
                                    <>
                                      <XCircle className="h-4 w-4 mr-1" />
                                      Reprovar
                                    </>
                                  )}
                                </Button>
                                <Button
                                  size="sm"
                                  className="bg-green-600 hover:bg-green-700"
                                  onClick={() => handleVote(runner.id, true)}
                                  disabled={submittingVote === runner.id}
                                >
                                  {submittingVote === runner.id ? (
                                    "Enviando..."
                                  ) : (
                                    <>
                                      <CheckCircle className="h-4 w-4 mr-1" />
                                      Aprovar
                                    </>
                                  )}
                                </Button>
                              </div>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  // Permitir reavaliação removendo o voto anterior
                                  setRunners((prev) =>
                                    prev.map((r) =>
                                      r.id === runner.id
                                        ? { ...r, hasVoted: false, vote: null }
                                        : r
                                    )
                                  );
                                }}
                              >
                                Reavaliar
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="py-16 text-center">
                  <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-foreground mb-2">
                    Nenhum corredor encontrado
                  </h3>
                  <p className="text-muted-foreground">
                    {searchTerm
                      ? `Não encontramos corredores para "${searchTerm}"`
                      : "Não há corredores inscritos neste evento"}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default JudgePage;

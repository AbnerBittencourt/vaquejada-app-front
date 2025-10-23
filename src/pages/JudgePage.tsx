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
  Key,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { formatDate } from "@/utils/format-data.util";
import { UserRoleEnum } from "@/types/enums/api-enums";
import { listJudgeEvents } from "@/lib/services/staff.service";

interface Password {
  id: string;
  number: number;
  status: string;
  hasVoted?: boolean;
  vote?: boolean | null;
}

interface Subscription {
  id: string;
  createdAt: string;
  status: string;
  passwords: Password[];
}

interface Runner {
  id: string;
  name: string;
  subscriptions: Subscription[];
}

interface JudgeEvent {
  id: string;
  name: string;
  description: string;
  startAt: string;
  endAt: string;
  location: string;
  status: string;
  isActive: boolean;
  bannerUrl: string;
  judges: Array<{
    id: string;
    name: string;
  }>;
  runners: Runner[];
}

interface JudgeEventsResponse {
  events: JudgeEvent[];
  total: number;
}

const JudgePage = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [events, setEvents] = useState<JudgeEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<JudgeEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [submittingVote, setSubmittingVote] = useState<string | null>(null);

  const isJudge = user?.role === UserRoleEnum.JUDGE;

  useEffect(() => {
    async function fetchJudgeEvents() {
      if (!isJudge || !user?.id) return;

      try {
        const response: JudgeEventsResponse = await listJudgeEvents(user.id);
        console.log("Eventos do juiz:", response);
        setEvents(response.events || []);
      } catch (err) {
        console.error("Erro ao carregar eventos do juiz:", err);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    }
    fetchJudgeEvents();
  }, [isJudge, user?.id]);

  const handleEventSelect = (event: JudgeEvent) => {
    setSelectedEvent(event);
  };

  const handleVote = async (passwordId: string, approved: boolean) => {
    if (!selectedEvent) return;

    setSubmittingVote(passwordId);

    try {
      // TODO: Implementar serviço de votação para senhas específicas
      // await submitPasswordVote(selectedEvent.id, passwordId, approved);

      // Atualizar estado local
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.id === selectedEvent.id
            ? {
                ...event,
                runners: event.runners.map((runner) => ({
                  ...runner,
                  subscriptions: runner.subscriptions.map((sub) => ({
                    ...sub,
                    passwords: sub.passwords.map((password) =>
                      password.id === passwordId
                        ? { ...password, hasVoted: true, vote: approved }
                        : password
                    ),
                  })),
                })),
              }
            : event
        )
      );

      // Atualizar evento selecionado
      setSelectedEvent((prev) =>
        prev
          ? {
              ...prev,
              runners: prev.runners.map((runner) => ({
                ...runner,
                subscriptions: runner.subscriptions.map((sub) => ({
                  ...sub,
                  passwords: sub.passwords.map((password) =>
                    password.id === passwordId
                      ? { ...password, hasVoted: true, vote: approved }
                      : password
                  ),
                })),
              })),
            }
          : null
      );
    } catch (err) {
      console.error("Erro ao enviar voto:", err);
      alert("Erro ao enviar voto. Tente novamente.");
    } finally {
      setSubmittingVote(null);
    }
  };

  // Extrair cidade e estado da localização
  const getLocationInfo = (location: string) => {
    if (!location) return { city: "", state: "" };

    const parts = location.split(",");
    if (parts.length >= 2) {
      const cityStatePart = parts[parts.length - 1].trim();
      const cityStateMatch = cityStatePart.match(/([^-]+)-([A-Z]{2})/);

      if (cityStateMatch) {
        return {
          city: cityStateMatch[1].trim(),
          state: cityStateMatch[2].trim(),
        };
      }
    }

    return { city: location, state: "" };
  };

  // Obter todas as senhas de um runner
  const getAllPasswordsFromRunner = (runner: Runner): Password[] => {
    return runner.subscriptions.flatMap((sub) => sub.passwords);
  };

  // Obter estatísticas de votação
  const getVotingStats = () => {
    if (!selectedEvent) return { total: 0, voted: 0 };

    let totalPasswords = 0;
    let votedPasswords = 0;

    selectedEvent.runners.forEach((runner) => {
      const passwords = getAllPasswordsFromRunner(runner);
      totalPasswords += passwords.length;
      votedPasswords += passwords.filter((p) => p.hasVoted).length;
    });

    return { total: totalPasswords, voted: votedPasswords };
  };

  const filteredEvents = events.filter((event) => {
    const locationInfo = getLocationInfo(event.location);
    return (
      event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      locationInfo.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      locationInfo.state.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const filteredRunners =
    selectedEvent?.runners.filter((runner) =>
      runner.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

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
                Selecione um evento para começar a avaliação das senhas
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
                {filteredEvents.map((event) => {
                  const locationInfo = getLocationInfo(event.location);
                  const totalPasswords = event.runners.reduce(
                    (total, runner) =>
                      total + getAllPasswordsFromRunner(runner).length,
                    0
                  );

                  return (
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
                          {locationInfo.city && locationInfo.state
                            ? `${locationInfo.city}, ${locationInfo.state}`
                            : event.location || "Localização não informada"}
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
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                          <Key className="h-4 w-4" />
                          <span>{totalPasswords} senhas para avaliar</span>
                        </div>
                        <div className="mt-2">
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                              event.status === "scheduled"
                                ? "bg-blue-100 text-blue-800"
                                : event.status === "active"
                                ? "bg-green-100 text-green-800"
                                : event.status === "cancelled"
                                ? "bg-red-100 text-red-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {event.status === "scheduled" && "Agendado"}
                            {event.status === "active" && "Ativo"}
                            {event.status === "cancelled" && "Cancelado"}
                            {event.status || "Desconhecido"}
                          </span>
                        </div>
                      </CardContent>

                      <CardFooter>
                        <Button className="w-full group/btn">
                          <span>Avaliar Senhas</span>
                          <ArrowRight className="h-4 w-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                        </Button>
                      </CardFooter>
                    </Card>
                  );
                })}
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
          // Lista de senhas do evento selecionado
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
                  Avaliação de senhas -{" "}
                  {getLocationInfo(selectedEvent.location).city}
                  {getLocationInfo(selectedEvent.location).state &&
                    `, ${getLocationInfo(selectedEvent.location).state}`}
                </p>
              </div>
            </div>

            {/* Estatísticas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Total de Senhas
                      </p>
                      <p className="text-2xl font-bold">
                        {getVotingStats().total}
                      </p>
                    </div>
                    <Key className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Avaliadas
                      </p>
                      <p className="text-2xl font-bold text-green-600">
                        {getVotingStats().voted}
                      </p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Pendentes
                      </p>
                      <p className="text-2xl font-bold text-orange-600">
                        {getVotingStats().total - getVotingStats().voted}
                      </p>
                    </div>
                    <Users className="h-8 w-8 text-orange-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Search Bar para corredores */}
            <div className="max-w-xl mb-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Buscar corredores por nome..."
                  className="pl-12 pr-4 py-2 text-base border-2 focus:border-primary/50 transition-all rounded-xl bg-background/50 backdrop-blur-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {filteredRunners.length > 0 ? (
              <div className="space-y-6">
                {filteredRunners.map((runner) => {
                  const allPasswords = getAllPasswordsFromRunner(runner);

                  return (
                    <Card key={runner.id}>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <User className="h-5 w-5 text-primary" />
                          {runner.name}
                        </CardTitle>
                        <CardDescription>
                          {allPasswords.length} senha(s) para avaliação
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {allPasswords.map((password) => (
                            <div
                              key={password.id}
                              className="border rounded-lg p-4 flex flex-col gap-3"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Key className="h-4 w-4 text-muted-foreground" />
                                  <span className="font-mono font-bold text-lg">
                                    #{password.number}
                                  </span>
                                </div>
                                <span
                                  className={`px-2 py-1 rounded-full text-xs ${
                                    password.status === "reserved"
                                      ? "bg-blue-100 text-blue-800"
                                      : password.status === "used"
                                      ? "bg-gray-100 text-gray-800"
                                      : "bg-orange-100 text-orange-800"
                                  }`}
                                >
                                  {password.status === "reserved" &&
                                    "Reservada"}
                                  {password.status === "used" && "Utilizada"}
                                  {password.status || "Desconhecido"}
                                </span>
                              </div>

                              <div className="flex-1">
                                {password.hasVoted ? (
                                  <div className="flex items-center gap-2 justify-center py-2">
                                    {password.vote ? (
                                      <>
                                        <CheckCircle className="h-5 w-5 text-green-500" />
                                        <span className="text-green-600 font-medium">
                                          Aprovada
                                        </span>
                                      </>
                                    ) : (
                                      <>
                                        <XCircle className="h-5 w-5 text-red-500" />
                                        <span className="text-red-600 font-medium">
                                          Reprovada
                                        </span>
                                      </>
                                    )}
                                  </div>
                                ) : (
                                  <div className="text-sm text-muted-foreground text-center py-2">
                                    Aguardando avaliação
                                  </div>
                                )}
                              </div>

                              <div className="flex gap-2">
                                {!password.hasVoted ? (
                                  <>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
                                      onClick={() =>
                                        handleVote(password.id, false)
                                      }
                                      disabled={submittingVote === password.id}
                                    >
                                      {submittingVote === password.id ? (
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
                                      className="flex-1 bg-green-600 hover:bg-green-700"
                                      onClick={() =>
                                        handleVote(password.id, true)
                                      }
                                      disabled={submittingVote === password.id}
                                    >
                                      {submittingVote === password.id ? (
                                        "Enviando..."
                                      ) : (
                                        <>
                                          <CheckCircle className="h-4 w-4 mr-1" />
                                          Aprovar
                                        </>
                                      )}
                                    </Button>
                                  </>
                                ) : (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full"
                                    onClick={() => {
                                      // TODO: Implementar reavaliação
                                      console.log(
                                        "Reavaliar senha:",
                                        password.id
                                      );
                                    }}
                                  >
                                    Reavaliar
                                  </Button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
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

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Calendar,
  MapPin,
  Search,
  Users,
  ArrowRight,
  XCircle,
  Key,
  ThumbsUp,
  Ban,
  Tv,
  SkipForward,
  ChevronDown,
  ChevronUp,
  Mic,
  Volume2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { formatDate } from "@/utils/format-data.util";
import { UserRoleEnum, JudgeVoteEnum } from "@/types/enums/api-enums";
import {
  listSpeakerEvents,
  getEventVotesSummary,
} from "@/lib/services/staff.service";
import {
  EventVotesSummary,
  JudgeVoteInfo,
  SpeakerEvent,
} from "@/types/dtos/staff.dto";
import { RunnerWithPasswords } from "@/types/api";
import { useToast } from "@/hooks/use-toast";
import { Header } from "@/components/ui/header";

const SpeakerPage = () => {
  const { toast } = useToast();
  const { user, logout } = useAuth();
  const [events, setEvents] = useState<SpeakerEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<SpeakerEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [votesSummary, setVotesSummary] = useState<EventVotesSummary | null>(
    null
  );
  const [expandedRunners, setExpandedRunners] = useState<Set<string>>(
    new Set()
  );

  const isSpeaker = user?.role === UserRoleEnum.SPEAKER;

  const getPasswordStatusLabel = (status: string) => {
    switch (status) {
      case "reserved":
        return "Reservada";
      case "used":
        return "Utilizada";
      case "available":
        return "Disponível";
      case "expired":
        return "Expirada";
      case "cancelled":
        return "Cancelada";
      default:
        return "Desconhecido";
    }
  };

  // Função para obter as cores do status
  const getPasswordStatusColors = (status: string) => {
    switch (status) {
      case "reserved":
        return "bg-blue-100 text-blue-800";
      case "used":
        return "bg-gray-100 text-gray-800";
      case "available":
        return "bg-green-100 text-green-800";
      case "expired":
        return "bg-orange-100 text-orange-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Função para obter o label do status do evento em português
  const getEventStatusLabel = (status: string) => {
    switch (status) {
      case "scheduled":
        return "Agendado";
      case "active":
        return "Ativo";
      case "cancelled":
        return "Cancelado";
      case "completed":
        return "Concluído";
      default:
        return "Desconhecido";
    }
  };

  // Função para obter as cores do status do evento
  const getEventStatusColors = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      case "active":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  useEffect(() => {
    async function fetchSpeakerEvents() {
      if (!isSpeaker || !user?.id) return;

      try {
        const response = await listSpeakerEvents(user.id);
        console.log("Eventos do locutor:", response);
        setEvents(response);
      } catch (err) {
        console.error("Erro ao carregar eventos do locutor:", err);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    }
    fetchSpeakerEvents();
  }, [isSpeaker, user?.id]);

  useEffect(() => {
    async function fetchVotesSummary() {
      if (!selectedEvent) return;

      try {
        const summary = await getEventVotesSummary(selectedEvent.id);
        setVotesSummary(summary);
      } catch (err) {
        console.error("Erro ao carregar resumo de votos:", err);
        setVotesSummary(null);
      }
    }
    fetchVotesSummary();
  }, [selectedEvent]);

  const handleEventSelect = (event: SpeakerEvent) => {
    setSelectedEvent(event);
    setSearchTerm("");
    setExpandedRunners(new Set());
  };

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

  const getRunnersWithPasswords = (
    event: SpeakerEvent
  ): RunnerWithPasswords[] => {
    const runnersMap = new Map<string, RunnerWithPasswords>();

    event.runners.forEach((runner) => {
      runner.subscriptions.forEach((subscription) => {
        subscription.passwords.forEach((password) => {
          if (!runnersMap.has(runner.id)) {
            runnersMap.set(runner.id, {
              id: runner.id,
              name: runner.name,
              passwords: [],
              expanded: expandedRunners.has(runner.id),
            });
          }

          const runnerData = runnersMap.get(runner.id)!;
          runnerData.passwords.push({
            ...password,
            runnerName: runner.name,
            subscriptionId: subscription.id,
          });
        });
      });
    });

    return Array.from(runnersMap.values())
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((runner) => ({
        ...runner,
        passwords: runner.passwords.sort((a, b) => a.number - b.number),
      }));
  };

  const getVoteInfo = (vote: JudgeVoteEnum) => {
    switch (vote) {
      case JudgeVoteEnum.VALID:
        return {
          label: "Valeu o Boi",
          color: "text-green-600",
          bgColor: "bg-green-100",
          icon: ThumbsUp,
        };
      case JudgeVoteEnum.NULL:
        return {
          label: "Nulo",
          color: "text-yellow-600",
          bgColor: "bg-yellow-100",
          icon: Ban,
        };
      case JudgeVoteEnum.TV:
        return {
          label: "TV",
          color: "text-blue-600",
          bgColor: "bg-blue-100",
          icon: Tv,
        };
      case JudgeVoteEnum.DID_NOT_RUN:
        return {
          label: "Boi Não Quis Correr",
          color: "text-red-600",
          bgColor: "bg-red-100",
          icon: SkipForward,
        };
      default:
        return {
          label: "Desconhecido",
          color: "text-gray-600",
          bgColor: "bg-gray-100",
          icon: Ban,
        };
    }
  };

  const getVotesForPassword = (passwordId: string): JudgeVoteInfo[] => {
    if (!votesSummary) return [];

    const passwordVotes = votesSummary.passwordVotes.find(
      (pv) => pv.passwordId === passwordId
    );

    return passwordVotes?.votes || [];
  };

  const getVoteStatsForPassword = (passwordId: string) => {
    const votes = getVotesForPassword(passwordId);
    const stats = {
      total: votes.length,
      valid: votes.filter((v) => v.vote === JudgeVoteEnum.VALID).length,
      null: votes.filter((v) => v.vote === JudgeVoteEnum.NULL).length,
      tv: votes.filter((v) => v.vote === JudgeVoteEnum.TV).length,
      didNotRun: votes.filter((v) => v.vote === JudgeVoteEnum.DID_NOT_RUN)
        .length,
    };

    // Determinar resultado final baseado na maioria dos votos
    if (
      stats.valid > stats.null &&
      stats.valid > stats.tv &&
      stats.valid > stats.didNotRun
    ) {
      return { ...stats, result: "VALID", resultLabel: "Valeu o Boi" };
    } else if (
      stats.null > stats.valid &&
      stats.null > stats.tv &&
      stats.null > stats.didNotRun
    ) {
      return { ...stats, result: "NULL", resultLabel: "Nulo" };
    } else if (
      stats.tv > stats.valid &&
      stats.tv > stats.null &&
      stats.tv > stats.didNotRun
    ) {
      return { ...stats, result: "TV", resultLabel: "TV" };
    } else if (
      stats.didNotRun > stats.valid &&
      stats.didNotRun > stats.null &&
      stats.didNotRun > stats.tv
    ) {
      return { ...stats, result: "DID_NOT_RUN", resultLabel: "Não Correu" };
    } else {
      return { ...stats, result: "TIE", resultLabel: "Empate" };
    }
  };

  const toggleRunnerExpansion = (runnerId: string) => {
    setExpandedRunners((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(runnerId)) {
        newSet.delete(runnerId);
      } else {
        newSet.add(runnerId);
      }
      return newSet;
    });
  };

  const toggleAllRunners = (expand: boolean) => {
    if (!selectedEvent) return;

    if (expand) {
      const allRunnerIds = getRunnersWithPasswords(selectedEvent).map(
        (r) => r.id
      );
      setExpandedRunners(new Set(allRunnerIds));
    } else {
      setExpandedRunners(new Set());
    }
  };

  const filteredEvents = events.filter((event) => {
    const locationInfo = getLocationInfo(event.location);
    return (
      event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      locationInfo.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      locationInfo.state.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const getFilteredRunners = (): RunnerWithPasswords[] => {
    if (!selectedEvent) return [];

    const allRunners = getRunnersWithPasswords(selectedEvent);

    if (!searchTerm) return allRunners;

    const searchLower = searchTerm.toLowerCase();
    return allRunners
      .map((runner) => ({
        ...runner,
        passwords: runner.passwords.filter(
          (password) =>
            password.number.toString().includes(searchTerm) ||
            password.runnerName.toLowerCase().includes(searchLower) ||
            password.number.toString().includes(searchTerm)
        ),
      }))
      .filter((runner) => runner.passwords.length > 0);
  };

  const filteredRunners = getFilteredRunners();

  // Botão personalizado para voltar (quando um evento está selecionado)
  const backButton = selectedEvent ? (
    <Button
      variant="outline"
      onClick={() => setSelectedEvent(null)}
      className="flex items-center gap-2"
    >
      <ArrowRight className="h-4 w-4 rotate-180" />
      Voltar
    </Button>
  ) : null;

  if (!isSpeaker) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-destructive">
              Acesso Restrito
            </CardTitle>
            <CardDescription className="text-center">
              Esta área é exclusiva para locutores.
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
      {/* Header atualizado */}
      <Header
        user={user || { name: "Locutor", role: UserRoleEnum.SPEAKER }}
        onLogout={logout}
        isAuthenticated={true}
        title="Área do Locutor"
        customActions={backButton}
      />

      <main className="container mx-auto px-4 py-8">
        {!selectedEvent ? (
          <div>
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Meus Eventos como Locutor
              </h1>
              <p className="text-lg text-muted-foreground">
                Selecione um evento para acompanhar os votos dos juízes
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
                  const runners = getRunnersWithPasswords(event);
                  const totalPasswords = runners.reduce(
                    (total, runner) => total + runner.passwords.length,
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
                            <Volume2 className="h-12 w-12 text-primary/30" />
                          </div>
                        )}
                      </div>

                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Mic className="h-5 w-5 text-primary" />
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
                          <Users className="h-4 w-4" />
                          <span>{runners.length} corredores</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                          <Key className="h-4 w-4" />
                          <span>{totalPasswords} senhas</span>
                        </div>
                        <div className="mt-2">
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${getEventStatusColors(
                              event.status
                            )}`}
                          >
                            {getEventStatusLabel(event.status)}
                          </span>
                        </div>
                      </CardContent>

                      <CardFooter>
                        <Button className="w-full group/btn">
                          <span>Ver Votações</span>
                          <ArrowRight className="h-4 w-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                        </Button>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16">
                <Volume2 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  Nenhum evento encontrado
                </h3>
                <p className="text-muted-foreground">
                  {searchTerm
                    ? `Não encontramos resultados para "${searchTerm}"`
                    : "Você não está designado como locutor em nenhum evento no momento"}
                </p>
              </div>
            )}
          </div>
        ) : (
          // Lista de senhas do evento selecionado com votos dos juízes
          <div>
            <div className="flex items-center gap-4 mb-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">
                  {selectedEvent.name}
                </h1>
                <p className="text-muted-foreground">
                  Acompanhamento de votos -{" "}
                  {getLocationInfo(selectedEvent.location).city}
                  {getLocationInfo(selectedEvent.location).state &&
                    `, ${getLocationInfo(selectedEvent.location).state}`}
                </p>
              </div>
            </div>

            {/* Estatísticas Gerais */}
            {votesSummary && (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Juízes Ativos
                        </p>
                        <p className="text-2xl font-bold">
                          {votesSummary.activeJudges}
                        </p>
                      </div>
                      <Users className="h-8 w-8 text-primary" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Votos Validados
                        </p>
                        <p className="text-2xl font-bold text-green-600">
                          {votesSummary.validVotes}
                        </p>
                      </div>
                      <ThumbsUp className="h-8 w-8 text-green-500" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Votos Nulos
                        </p>
                        <p className="text-2xl font-bold text-yellow-600">
                          {votesSummary.nullVotes}
                        </p>
                      </div>
                      <Ban className="h-8 w-8 text-yellow-500" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Votos TV
                        </p>
                        <p className="text-2xl font-bold text-blue-600">
                          {votesSummary.tvVotes}
                        </p>
                      </div>
                      <Tv className="h-8 w-8 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Não Correram
                        </p>
                        <p className="text-2xl font-bold text-red-600">
                          {votesSummary.didNotRunVotes}
                        </p>
                      </div>
                      <SkipForward className="h-8 w-8 text-red-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            <div className="flex justify-between items-center mb-6">
              <div className="max-w-xl flex-1">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por corredor ou número da senha..."
                    className="pl-12 pr-4 py-2 text-base border-2 focus:border-primary/50 transition-all rounded-xl bg-background/50 backdrop-blur-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex gap-2 ml-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleAllRunners(true)}
                >
                  Expandir Todos
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleAllRunners(false)}
                >
                  Recolher Todos
                </Button>
              </div>
            </div>

            {filteredRunners.length > 0 ? (
              <div className="space-y-4">
                {filteredRunners.map((runner) => {
                  const isExpanded = expandedRunners.has(runner.id);

                  return (
                    <Card key={runner.id} className="overflow-hidden">
                      <CardHeader
                        className="pb-3 cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => toggleRunnerExpansion(runner.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-primary/70 flex items-center justify-center">
                              <Users className="h-5 w-5 text-primary-foreground" />
                            </div>
                            <div>
                              <CardTitle className="text-lg">
                                {runner.name}
                              </CardTitle>
                              <CardDescription>
                                {runner.passwords.length} senha(s)
                              </CardDescription>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              {isExpanded ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                      </CardHeader>

                      {isExpanded && (
                        <CardContent className="pt-0">
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 mt-4">
                            {runner.passwords.map((password) => {
                              const voteStats = getVoteStatsForPassword(
                                password.id
                              );
                              const votes = getVotesForPassword(password.id);

                              return (
                                <Card key={password.id} className="relative">
                                  <CardHeader className="pb-3">
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                      <Key className="h-5 w-5 text-primary" />
                                      Senha #{password.number}
                                    </CardTitle>
                                  </CardHeader>

                                  <CardContent className="pb-3">
                                    <div className="flex items-center justify-between mb-4">
                                      <span
                                        className={`px-2 py-1 rounded-full text-xs ${getPasswordStatusColors(
                                          password.status
                                        )}`}
                                      >
                                        {getPasswordStatusLabel(
                                          password.status
                                        )}
                                      </span>

                                      {voteStats.total > 0 && (
                                        <div
                                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            voteStats.result === "VALID"
                                              ? "bg-green-100 text-green-800"
                                              : voteStats.result === "NULL"
                                              ? "bg-yellow-100 text-yellow-800"
                                              : voteStats.result === "TV"
                                              ? "bg-blue-100 text-blue-800"
                                              : voteStats.result ===
                                                "DID_NOT_RUN"
                                              ? "bg-red-100 text-red-800"
                                              : "bg-gray-100 text-gray-800"
                                          }`}
                                        >
                                          {voteStats.resultLabel}
                                        </div>
                                      )}
                                    </div>

                                    {/* Estatísticas dos votos */}
                                    {voteStats.total > 0 ? (
                                      <div className="space-y-3">
                                        <div className="grid grid-cols-2 gap-2 text-xs">
                                          <div className="flex items-center gap-1 text-green-600">
                                            <ThumbsUp className="h-3 w-3" />
                                            <span>{voteStats.valid}</span>
                                          </div>
                                          <div className="flex items-center gap-1 text-yellow-600">
                                            <Ban className="h-3 w-3" />
                                            <span>{voteStats.null}</span>
                                          </div>
                                          <div className="flex items-center gap-1 text-blue-600">
                                            <Tv className="h-3 w-3" />
                                            <span>{voteStats.tv}</span>
                                          </div>
                                          <div className="flex items-center gap-1 text-red-600">
                                            <SkipForward className="h-3 w-3" />
                                            <span>{voteStats.didNotRun}</span>
                                          </div>
                                        </div>

                                        {/* Lista de juízes e seus votos */}
                                        <div className="space-y-2">
                                          <p className="text-xs font-medium text-muted-foreground">
                                            Votos dos juízes:
                                          </p>
                                          {votes.map((vote) => {
                                            const voteInfo = getVoteInfo(
                                              vote.vote
                                            );
                                            const VoteIcon = voteInfo.icon;

                                            return (
                                              <div
                                                key={vote.judgeId}
                                                className="flex items-center justify-between text-xs"
                                              >
                                                <span className="truncate flex-1">
                                                  {vote.judgeName}
                                                </span>
                                                <div
                                                  className={`flex items-center gap-1 px-2 py-1 rounded-full ${voteInfo.bgColor}`}
                                                >
                                                  <VoteIcon
                                                    className={`h-3 w-3 ${voteInfo.color}`}
                                                  />
                                                  <span
                                                    className={`font-medium ${voteInfo.color}`}
                                                  >
                                                    {voteInfo.label}
                                                  </span>
                                                </div>
                                              </div>
                                            );
                                          })}
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="text-center py-4">
                                        <p className="text-sm text-muted-foreground">
                                          Aguardando votos dos juízes...
                                        </p>
                                      </div>
                                    )}
                                  </CardContent>
                                </Card>
                              );
                            })}
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Card>
                <CardContent className="py-16 text-center">
                  <Key className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-foreground mb-2">
                    Nenhum corredor encontrado
                  </h3>
                  <p className="text-muted-foreground">
                    {searchTerm
                      ? `Não encontramos corredores ou senhas para "${searchTerm}"`
                      : "Não há corredores com senhas neste evento"}
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

export default SpeakerPage;

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
  Award,
  CheckCircle,
  XCircle,
  Key,
  ThumbsUp,
  Ban,
  Tv,
  SkipForward,
  ChevronDown,
  ChevronUp,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { formatDate } from "@/utils/format-data.util";
import { UserRoleEnum, JudgeVoteEnum } from "@/types/enums/api-enums";
import {
  listJudgeEvents,
  submitJudgeVote,
  updateJudgeVote,
  getJudgeVotesByEvent,
} from "@/lib/services/staff.service";
import { JudgeVoteResponse } from "@/types/dtos/staff.dto";
import { JudgeEvent, RunnerWithPasswords } from "@/types/api";
import { useToast } from "@/hooks/use-toast";
import { getEventStatusMap } from "@/types/enums/enum-maps";
import { Header } from "@/components/ui/header";

const JudgePage = () => {
  const { toast } = useToast();
  const { user, logout } = useAuth();
  const [events, setEvents] = useState<JudgeEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<JudgeEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [submittingVote, setSubmittingVote] = useState<string | null>(null);
  const [existingVotes, setExistingVotes] = useState<JudgeVoteResponse[]>([]);
  const [expandedRunners, setExpandedRunners] = useState<Set<string>>(
    new Set()
  );

  const isJudge = user?.role === UserRoleEnum.JUDGE;

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
    async function fetchJudgeEvents() {
      if (!isJudge || !user?.id) return;

      try {
        const response = await listJudgeEvents(user.id);
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

  useEffect(() => {
    async function fetchExistingVotes() {
      if (!selectedEvent || !user?.id) return;

      try {
        const votes = await getJudgeVotesByEvent(selectedEvent.id, user.id);
        setExistingVotes(votes);
      } catch (err) {
        console.error("Erro ao carregar votos existentes:", err);
        setExistingVotes([]);
      }
    }
    fetchExistingVotes();
  }, [selectedEvent, user?.id]);

  const handleEventSelect = (event: JudgeEvent) => {
    setSelectedEvent(event);
    setSearchTerm("");
    setExpandedRunners(new Set());
  };

  const handleVote = async (passwordId: string, vote: JudgeVoteEnum, cattleNumber?: number) => {
    if (!selectedEvent || !user?.id) return;

    const voteKey = cattleNumber ? `${passwordId}-${cattleNumber}` : passwordId;
    setSubmittingVote(voteKey);

    try {
      await submitJudgeVote({
        judgeId: user.id,
        eventId: selectedEvent.id,
        passwordId,
        vote,
        cattleNumber,
      });

      setExistingVotes((prev) => [
        ...prev.filter((v) => !(v.passwordId === passwordId && v.cattleNumber === cattleNumber)),
        {
          id: `temp-${voteKey}`,
          judgeId: user.id,
          eventId: selectedEvent.id,
          passwordId,
          vote,
          cattleNumber,
          createdAt: new Date().toISOString(),
        },
      ]);

      toast({
        title: "Voto registrado com sucesso!",
        description: cattleNumber ? `Voto do boi ${cattleNumber} computado.` : "Seu voto foi computado.",
        variant: "default",
      });
    } catch (err) {
      console.error("Erro ao enviar voto:", err);
      toast({
        title: "Erro ao enviar voto",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setSubmittingVote(null);
    }
  };

  const handleUpdateVote = async (
    scoreId: string,
    passwordId: string,
    newVote: JudgeVoteEnum,
    cattleNumber?: number
  ) => {
    if (!selectedEvent || !user?.id) return;

    const voteKey = cattleNumber ? `${passwordId}-${cattleNumber}` : passwordId;
    setSubmittingVote(voteKey);

    try {
      await updateJudgeVote(scoreId, {
        vote: newVote,
      });

      setExistingVotes((prev) =>
        prev.map((vote) =>
          vote.id === scoreId ? { ...vote, vote: newVote } : vote
        )
      );

      toast({
        title: "Voto atualizado com sucesso!",
        description: cattleNumber ? `Voto do boi ${cattleNumber} alterado.` : "Seu voto foi alterado.",
        variant: "default",
      });
    } catch (err) {
      console.error("Erro ao atualizar voto:", err);
      toast({
        title: "Erro ao atualizar voto",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setSubmittingVote(null);
    }
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
    event: JudgeEvent
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

  const getExistingVote = (passwordId: string, cattleNumber?: number): JudgeVoteResponse | null => {
    const vote = existingVotes.find((v) =>
      v.passwordId === passwordId &&
      (cattleNumber === undefined || v.cattleNumber === cattleNumber)
    );
    return vote || null;
  };

  const getExistingVotesForPassword = (passwordId: string): JudgeVoteResponse[] => {
    return existingVotes.filter((v) => v.passwordId === passwordId);
  };

  const canChangeVote = (existingVote: JudgeVoteResponse | null): boolean => {
    return existingVote?.vote === JudgeVoteEnum.TV;
  };

  const getCattlePerPassword = (): number => {
    return selectedEvent?.cattlePerPassword || 1;
  };

  const getVotingStats = () => {
    if (!selectedEvent) return { total: 0, voted: 0, totalCattle: 0, votedCattle: 0 };

    const runners = getRunnersWithPasswords(selectedEvent);
    const allPasswords = runners.flatMap((runner) => runner.passwords);
    const cattlePerPassword = getCattlePerPassword();
    const totalCattle = allPasswords.length * cattlePerPassword;
    const votedCattle = existingVotes.length;

    return {
      total: allPasswords.length,
      voted: allPasswords.filter((p) => getExistingVotesForPassword(p.id).length >= cattlePerPassword).length,
      totalCattle,
      votedCattle
    };
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
          label: "Zero",
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
          label: "Retorno",
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
      <Header
        user={user || { name: "Juiz", role: UserRoleEnum.JUDGE }}
        onLogout={logout}
        isAuthenticated={true}
        title="Área do Juiz"
      />

      <main className="container mx-auto px-4 py-8">
        {!selectedEvent ? (
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
                          <Users className="h-4 w-4" />
                          <span>{runners.length} corredores</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                          <Key className="h-4 w-4" />
                          <span>{totalPasswords} senhas para avaliar</span>
                        </div>
                        {event.cattlePerPassword && (
                          <div className="flex items-center gap-2 text-sm text-primary font-medium mt-2">
                            <Award className="h-4 w-4" />
                            <span>{event.cattlePerPassword} boi(s) por senha</span>
                          </div>
                        )}
                        <div className="mt-2">
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${getEventStatusColors(
                              event.status
                            )}`}
                          >
                            {getEventStatusMap(event.status)}
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
          // Lista de senhas do evento selecionado agrupadas por corredor
          <div>
            <div className="flex items-center gap-4 mb-6">
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              {selectedEvent.cattlePerPassword && (
                <Card className="border-2 border-primary/30 bg-primary/5">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Bois por Senha
                        </p>
                        <p className="text-2xl font-bold text-primary">
                          {selectedEvent.cattlePerPassword}
                        </p>
                      </div>
                      <Award className="h-8 w-8 text-primary" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Avalie {selectedEvent.cattlePerPassword} boi(s) por passada
                    </p>
                  </CardContent>
                </Card>
              )}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Total de Corredores
                      </p>
                      <p className="text-2xl font-bold">
                        {filteredRunners.length}
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
            </div>

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
                  const votedPasswords = runner.passwords.filter(
                    (password) => getExistingVote(password.id) !== null
                  );

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
                                {runner.passwords.length} senha(s) -
                                {votedPasswords.length} avaliada(s)
                              </CardDescription>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <div
                                className={`text-sm font-medium ${
                                  votedPasswords.length ===
                                  runner.passwords.length
                                    ? "text-green-600"
                                    : "text-orange-600"
                                }`}
                              >
                                {votedPasswords.length}/
                                {runner.passwords.length}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {Math.round(
                                  (votedPasswords.length /
                                    runner.passwords.length) *
                                    100
                                )}
                                % concluído
                              </div>
                            </div>
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
                          <div className="space-y-3 mt-4">
                            {runner.passwords.map((password) => {
                              const cattleCount = getCattlePerPassword();
                              const passwordVotes = getExistingVotesForPassword(password.id);
                              const allCattleVoted = passwordVotes.length >= cattleCount;

                              return (
                                <div key={password.id} className="border rounded-xl p-4 bg-card hover:shadow-md transition-shadow">
                                  {/* Layout horizontal: Info à esquerda, Votação à direita */}
                                  <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                                    {/* Coluna esquerda: Número da senha e info do corredor */}
                                    <div className="flex-shrink-0 lg:w-48">
                                      {/* Número da senha em destaque */}
                                      <div className="text-center lg:text-left mb-2">
                                        <span className="text-3xl font-bold text-primary">#{password.number}</span>
                                      </div>
                                      {/* Info do corredor */}
                                      <div className="text-center lg:text-left">
                                        <p className="text-sm font-medium text-foreground">{password.runnerName}</p>
                                        <div className="flex items-center justify-center lg:justify-start gap-2 mt-1">
                                          <span className={`px-2 py-0.5 rounded-full text-xs ${getPasswordStatusColors(password.status)}`}>
                                            {getPasswordStatusLabel(password.status)}
                                          </span>
                                          {cattleCount > 1 && (
                                            <span className={`text-xs font-medium ${allCattleVoted ? 'text-green-600' : 'text-orange-600'}`}>
                                              {passwordVotes.length}/{cattleCount} bois
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    </div>

                                    {/* Coluna direita: Área de votação */}
                                    <div className="flex-1">
                                      {cattleCount > 1 ? (
                                        // Múltiplos bois por senha
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                          {Array.from({ length: cattleCount }, (_, i) => i + 1).map((cattleNum) => {
                                            const existingVote = getExistingVote(password.id, cattleNum);
                                            const voteInfo = existingVote ? getVoteInfo(existingVote.vote) : null;
                                            const VoteIcon = voteInfo?.icon;
                                            const canChange = canChangeVote(existingVote);
                                            const voteKey = `${password.id}-${cattleNum}`;

                                            return (
                                              <div key={cattleNum} className="p-2 bg-muted/30 rounded-lg border">
                                                <div className="flex items-center justify-between mb-2">
                                                  <span className="text-sm font-semibold">Boi {cattleNum}</span>
                                                  {existingVote && VoteIcon && (
                                                    <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full ${voteInfo.bgColor}`}>
                                                      <VoteIcon className={`h-3 w-3 ${voteInfo.color}`} />
                                                      <span className={`text-xs font-medium ${voteInfo.color}`}>{voteInfo.label}</span>
                                                    </div>
                                                  )}
                                                </div>
                                                {!existingVote ? (
                                                  <div className="grid grid-cols-4 gap-1">
                                                    <Button size="sm" className="bg-green-600 hover:bg-green-700 text-xs px-1 h-8" onClick={() => handleVote(password.id, JudgeVoteEnum.VALID, cattleNum)} disabled={submittingVote === voteKey}>
                                                      <ThumbsUp className="h-3 w-3" />
                                                    </Button>
                                                    <Button variant="outline" size="sm" className="text-yellow-600 border-yellow-200 hover:bg-yellow-50 text-xs px-1 h-8" onClick={() => handleVote(password.id, JudgeVoteEnum.NULL, cattleNum)} disabled={submittingVote === voteKey}>
                                                      <Ban className="h-3 w-3" />
                                                    </Button>
                                                    <Button variant="outline" size="sm" className="text-blue-600 border-blue-200 hover:bg-blue-50 text-xs px-1 h-8" onClick={() => handleVote(password.id, JudgeVoteEnum.TV, cattleNum)} disabled={submittingVote === voteKey}>
                                                      <Tv className="h-3 w-3" />
                                                    </Button>
                                                    <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50 text-xs px-1 h-8" onClick={() => handleVote(password.id, JudgeVoteEnum.DID_NOT_RUN, cattleNum)} disabled={submittingVote === voteKey}>
                                                      <SkipForward className="h-3 w-3" />
                                                    </Button>
                                                  </div>
                                                ) : canChange ? (
                                                  <div className="grid grid-cols-4 gap-1">
                                                    <Button size="sm" className="bg-green-600 hover:bg-green-700 text-xs px-1 h-8" onClick={() => handleUpdateVote(existingVote.id, password.id, JudgeVoteEnum.VALID, cattleNum)} disabled={submittingVote === voteKey}>
                                                      <ThumbsUp className="h-3 w-3" />
                                                    </Button>
                                                    <Button variant="outline" size="sm" className="text-yellow-600 border-yellow-200 hover:bg-yellow-50 text-xs px-1 h-8" onClick={() => handleUpdateVote(existingVote.id, password.id, JudgeVoteEnum.NULL, cattleNum)} disabled={submittingVote === voteKey}>
                                                      <Ban className="h-3 w-3" />
                                                    </Button>
                                                    <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50 text-xs px-1 h-8" onClick={() => handleUpdateVote(existingVote.id, password.id, JudgeVoteEnum.DID_NOT_RUN, cattleNum)} disabled={submittingVote === voteKey}>
                                                      <SkipForward className="h-3 w-3" />
                                                    </Button>
                                                    <span className="text-xs text-blue-600 flex items-center justify-center">Editável</span>
                                                  </div>
                                                ) : (
                                                  <p className="text-xs text-green-600 text-center">Votado</p>
                                                )}
                                              </div>
                                            );
                                          })}
                                        </div>
                                      ) : (
                                        // Apenas 1 boi por senha
                                        (() => {
                                          const existingVote = getExistingVote(password.id, 1);
                                          const voteInfo = existingVote ? getVoteInfo(existingVote.vote) : null;
                                          const VoteIcon = voteInfo?.icon;
                                          const canChange = canChangeVote(existingVote);
                                          const voteKey = `${password.id}-1`;

                                          return (
                                            <div className="flex flex-col sm:flex-row items-center gap-3">
                                              {existingVote && VoteIcon && (
                                                <div className={`flex items-center gap-1 px-3 py-1 rounded-full ${voteInfo.bgColor}`}>
                                                  <VoteIcon className={`h-4 w-4 ${voteInfo.color}`} />
                                                  <span className={`text-sm font-medium ${voteInfo.color}`}>{voteInfo.label}</span>
                                                  {canChange && <span className="text-xs text-blue-600 ml-1">(Editável)</span>}
                                                </div>
                                              )}
                                              {!existingVote ? (
                                                <div className="flex flex-wrap gap-2">
                                                  <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handleVote(password.id, JudgeVoteEnum.VALID, 1)} disabled={submittingVote === voteKey}>
                                                    <ThumbsUp className="h-4 w-4 mr-1" />Valeu
                                                  </Button>
                                                  <Button variant="outline" size="sm" className="text-yellow-600 border-yellow-200 hover:bg-yellow-50" onClick={() => handleVote(password.id, JudgeVoteEnum.NULL, 1)} disabled={submittingVote === voteKey}>
                                                    <Ban className="h-4 w-4 mr-1" />Zero
                                                  </Button>
                                                  <Button variant="outline" size="sm" className="text-blue-600 border-blue-200 hover:bg-blue-50" onClick={() => handleVote(password.id, JudgeVoteEnum.TV, 1)} disabled={submittingVote === voteKey}>
                                                    <Tv className="h-4 w-4 mr-1" />TV
                                                  </Button>
                                                  <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50" onClick={() => handleVote(password.id, JudgeVoteEnum.DID_NOT_RUN, 1)} disabled={submittingVote === voteKey}>
                                                    <SkipForward className="h-4 w-4 mr-1" />Retorno
                                                  </Button>
                                                </div>
                                              ) : canChange ? (
                                                <div className="flex flex-wrap gap-2">
                                                  <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handleUpdateVote(existingVote.id, password.id, JudgeVoteEnum.VALID, 1)} disabled={submittingVote === voteKey}>
                                                    <ThumbsUp className="h-4 w-4 mr-1" />Valeu
                                                  </Button>
                                                  <Button variant="outline" size="sm" className="text-yellow-600 border-yellow-200 hover:bg-yellow-50" onClick={() => handleUpdateVote(existingVote.id, password.id, JudgeVoteEnum.NULL, 1)} disabled={submittingVote === voteKey}>
                                                    <Ban className="h-4 w-4 mr-1" />Zero
                                                  </Button>
                                                  <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50" onClick={() => handleUpdateVote(existingVote.id, password.id, JudgeVoteEnum.DID_NOT_RUN, 1)} disabled={submittingVote === voteKey}>
                                                    <SkipForward className="h-4 w-4 mr-1" />Retorno
                                                  </Button>
                                                </div>
                                              ) : null}
                                            </div>
                                          );
                                        })()
                                      )}
                                    </div>
                                  </div>
                                </div>
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
                      : "Não há corredores com senhas para avaliar neste evento"}
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

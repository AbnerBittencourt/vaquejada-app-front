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
  LogOut,
  User,
  ArrowRight,
  ImageOff,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { ListEventResponse } from "@/types/api";
import { listEvents } from "@/lib/services/event.service";
import { formatDate } from "@/utils/format-data.util";
import { CountdownTimer } from "../components/CountdownTimer";

const Index = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [events, setEvents] = useState<ListEventResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await listEvents();
        setEvents(response.data ?? []);
      } catch (err) {
        console.error("Erro ao carregar eventos:", err);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  const filteredEvents = events.filter(
    (event) =>
      event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.city?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header mantido igual */}
      <header className="border-b bg-background/80 backdrop-blur-md sticky top-0 z-50 supports-backdrop-blur:bg-background/60">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-xl blur-sm group-hover:blur-md transition-all"></div>
              <Users className="h-8 w-8 text-primary relative z-10 group-hover:scale-110 transition-transform" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Vaquejada APP
            </h1>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className="text-foreground/80 hover:text-primary font-medium transition-all duration-200 hover:scale-105"
            >
              Eventos
            </Link>
            {isAuthenticated && (
              <Link
                to="/meus-ingressos"
                className="text-foreground/80 hover:text-primary font-medium transition-all duration-200 hover:scale-105"
              >
                Meus Ingressos
              </Link>
            )}
            {isAuthenticated && (
              <Link
                to="/juiz"
                className="text-foreground/80 hover:text-primary font-medium transition-all duration-200 hover:scale-105"
              >
                Juiz
              </Link>
            )}
          </nav>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
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
                      <p className="text-xs text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                    <Link
                      to="/perfil-corredor"
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
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" asChild className="hover:bg-primary/10">
                  <Link to="/login">Entrar</Link>
                </Button>
                <Button
                  asChild
                  className="bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all"
                >
                  <Link to="/cadastro">Cadastrar</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      <section className="relative py-3 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-muted/20"></div>
        <div className="absolute top-10 left-10 w-56 h-56 bg-primary/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-secondary/10 rounded-full blur-2xl"></div>

        <div className="container mx-auto relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-br from-foreground from-30% to-foreground/60 bg-clip-text text-transparent leading-tight">
              Sua vaquejada
              <br />
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                começa aqui
              </span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-6 leading-relaxed max-w-2xl mx-auto">
              Compre senhas, gerencie suas inscrições e acompanhe eventos de
              maneira
              <span className="font-semibold text-foreground">
                {" "}
                simples e eficiente
              </span>
            </p>

            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Buscar eventos por cidade ou nome..."
                  className="pl-12 pr-4 py-2 text-base border-2 focus:border-primary/50 transition-all rounded-xl bg-background/50 backdrop-blur-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button
                size="lg"
                className="px-6 py-2 text-base rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                <Search className="h-5 w-5 mr-2" />
                Buscar
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-10">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Próximos Eventos
              </h2>
              <p className="text-muted-foreground text-base">
                Descubra as melhores vaquejadas da sua região
              </p>
            </div>
            <Button
              variant="outline"
              className="mt-4 sm:mt-0 rounded-xl border-2 hover:border-primary/50 transition-all group"
            >
              <span>Ver todos</span>
              <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <Card
                  key={i}
                  className="overflow-hidden border-2 animate-pulse"
                >
                  {/* Skeleton em portrait */}
                  <div className="h-48 bg-muted"></div>
                  <CardHeader>
                    <div className="h-6 bg-muted rounded w-3/4"></div>
                    <div className="h-4 bg-muted rounded w-full mt-2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-4 bg-muted rounded w-1/2 mb-4"></div>
                    <div className="h-8 bg-muted rounded w-1/3"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredEvents.map((event) => (
                <Card
                  key={event.id}
                  className="overflow-hidden border-2 hover:border-primary/30 hover:shadow-2xl transition-all duration-300 group cursor-pointer bg-card/50 backdrop-blur-sm"
                >
                  {/* ✅ BANNER EM PORTRAIT (EM PÉ) */}
                  <div className="relative h-48 overflow-hidden bg-muted">
                    {event.bannerUrl ? (
                      <>
                        <img
                          src={event.bannerUrl}
                          alt={`Banner do evento ${event.name}`}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          loading="lazy"
                          onError={(e) => {
                            // Fallback se a imagem não carregar
                            const target = e.target as HTMLImageElement;
                            target.style.display = "none";
                            const fallback =
                              target.nextElementSibling as HTMLElement;
                            if (fallback) fallback.classList.remove("hidden");
                          }}
                        />
                        {/* Fallback que aparece se a imagem der erro */}
                        <div className="hidden w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                          <div className="text-center">
                            <ImageOff className="h-12 w-12 text-primary/40 mx-auto mb-2" />
                            <p className="text-xs text-primary/60 font-medium">
                              Banner não carregado
                            </p>
                          </div>
                        </div>
                      </>
                    ) : (
                      // Placeholder quando não há banner
                      <div className="w-full h-full bg-gradient-to-br from-primary/15 to-secondary/15 flex items-center justify-center">
                        <div className="text-center">
                          <ImageOff className="h-12 w-12 text-primary/30 mx-auto mb-2" />
                          <p className="text-xs text-primary/50 font-medium">
                            Sem banner
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Overlay no hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                      <div className="p-3 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        <p className="text-sm font-medium mb-1">Ver detalhes</p>
                        <p className="text-xs opacity-90">
                          Clique para mais informações
                        </p>
                      </div>
                    </div>

                    {/* Badge de Status */}
                    <div className="absolute top-3 right-3">
                      <div
                        className={`px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${
                          event.purchaseClosedAt
                            ? "bg-green-500/90 text-green-50 shadow-lg"
                            : "bg-red-500/90 text-red-50 shadow-lg"
                        }`}
                      >
                        {event.purchaseClosedAt
                          ? "Inscrições Abertas"
                          : "Inscrições Encerradas"}
                      </div>
                    </div>

                    {/* Efeito de brilho no hover */}
                    <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-all duration-500"></div>
                  </div>

                  <CardHeader className="pb-3">
                    <CardTitle className="text-xl line-clamp-2 group-hover:text-primary transition-colors duration-300">
                      {event.name}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 flex-shrink-0" />
                      <span className="line-clamp-1">
                        {event.city && event.state
                          ? `${event.city}, ${event.state}`
                          : "Localização não informada"}
                      </span>
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="pb-4 space-y-4">
                    {/* Data do Evento */}
                    <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg border group-hover:bg-muted/40 transition-colors duration-300">
                      <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-full group-hover:bg-primary/15 transition-colors duration-300">
                        <Calendar className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">
                          Período do Evento
                        </p>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 text-xs text-muted-foreground">
                          <span className="font-semibold text-foreground/80">
                            {formatDate(event.startAt)}
                          </span>
                          <span>até</span>
                          <span className="font-semibold text-foreground/80">
                            {formatDate(event.endAt)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Countdown Timer para Inscrições */}
                    {event.purchaseClosedAt && (
                      <div className="p-3 bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg border border-primary/20 group-hover:from-primary/10 group-hover:to-primary/15 transition-all duration-300">
                        <CountdownTimer
                          purchaseClosedAt={event.purchaseClosedAt}
                        />
                      </div>
                    )}
                  </CardContent>

                  <CardFooter>
                    <Button
                      className="w-full rounded-xl py-3 font-medium group/btn bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300"
                      asChild
                    >
                      <Link to={`/evento/${event.id}`}>
                        <span>Ver detalhes do evento</span>
                        <ArrowRight className="h-4 w-4 ml-2 group-hover/btn:translate-x-1 transition-transform duration-300" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                <Search className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">
                Nenhum evento encontrado
              </h3>
              <p className="text-muted-foreground mb-6">
                {searchTerm
                  ? `Não encontramos resultados para "${searchTerm}"`
                  : "Não há eventos disponíveis no momento"}
              </p>
              {searchTerm && (
                <Button onClick={() => setSearchTerm("")} variant="outline">
                  Limpar busca
                </Button>
              )}
            </div>
          )}
        </div>
      </section>

      <section className="py-10 px-4 bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="container mx-auto text-center max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
            <Users className="h-4 w-4" />
            Para organizadores
          </div>

          <h3 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Organize seu evento conosco
          </h3>

          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Tenha acesso a ferramentas profissionais para gerenciar suas
            vaquejadas e alcançar mais participantes
          </p>

          <Button
            variant="outline"
            size="lg"
            asChild
            className="rounded-xl border-2 hover:border-primary/50 px-8 py-3 text-lg"
          >
            <Link to="/admin/login" className="flex items-center gap-2">
              <span>Área do Organizador</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      <footer className="border-t bg-card/50 backdrop-blur-sm py-10 px-4">
        <div className="container mx-auto">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Users className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Vaquejada APP
              </span>
            </div>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Simplificando a experiência em vaquejadas para participantes e
              organizadores
            </p>
            <p className="text-sm text-muted-foreground">
              © 2025 Vaquejada APP. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;

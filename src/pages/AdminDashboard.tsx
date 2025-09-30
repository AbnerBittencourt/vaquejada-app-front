import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Calendar, Users, DollarSign, Settings, LogOut, BarChart3, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-xl font-bold">Painel do Organizador</h1>
              <p className="text-xs text-muted-foreground">Parque Santa Cruz</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/admin/configuracoes">
                <Settings className="h-5 w-5" />
              </Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/" className="gap-2">
                <LogOut className="h-5 w-5" />
                Sair
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Eventos Ativos</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">+1 desde o mês passado</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total de Inscrições</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">247</div>
              <p className="text-xs text-muted-foreground">+42 esta semana</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ 45.890</div>
              <p className="text-xs text-muted-foreground">+12% desde o mês passado</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Check-ins Hoje</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">89</div>
              <p className="text-xs text-muted-foreground">68% dos inscritos</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="eventos" className="w-full">
          <TabsList>
            <TabsTrigger value="eventos">Eventos</TabsTrigger>
            <TabsTrigger value="inscricoes">Inscrições</TabsTrigger>
            <TabsTrigger value="financeiro">Financeiro</TabsTrigger>
            <TabsTrigger value="checkin">Check-in</TabsTrigger>
          </TabsList>

          <TabsContent value="eventos" className="mt-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Meus Eventos</h2>
              <Button>Criar novo evento</Button>
            </div>
            <div className="space-y-4">
              {[
                { nome: "Vaquejada do Parque Santa Cruz", data: "15/04/2025", inscricoes: 123, status: "Ativo" },
                { nome: "Rodeio de Verão 2025", data: "20/05/2025", inscricoes: 89, status: "Ativo" },
                { nome: "Vaquejada de São João", data: "24/06/2025", inscricoes: 35, status: "Inscrições abertas" }
              ].map((evento) => (
                <Card key={evento.nome}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>{evento.nome}</CardTitle>
                        <CardDescription>{evento.data}</CardDescription>
                      </div>
                      <Button variant="outline">Gerenciar</Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Inscrições:</span>
                        <p className="font-medium">{evento.inscricoes}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Status:</span>
                        <p className="font-medium">{evento.status}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="inscricoes" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Inscrições Recentes</CardTitle>
                <CardDescription>Últimas inscrições nos seus eventos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { corredor: "João Silva", evento: "Vaquejada Santa Cruz", categoria: "Amador", data: "Hoje, 14:30" },
                    { corredor: "Maria Santos", evento: "Vaquejada Santa Cruz", categoria: "Profissional", data: "Hoje, 13:15" },
                    { corredor: "Pedro Costa", evento: "Rodeio de Verão", categoria: "Aspirante", data: "Ontem, 18:45" }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between border-b pb-3 last:border-0">
                      <div>
                        <p className="font-medium">{item.corredor}</p>
                        <p className="text-sm text-muted-foreground">{item.evento} - {item.categoria}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">{item.data}</p>
                        <Button variant="ghost" size="sm">Ver detalhes</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="financeiro" className="mt-6">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Resumo Financeiro</CardTitle>
                  <CardDescription>Últimos 30 dias</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Receita bruta</span>
                      <span className="text-2xl font-bold">R$ 45.890,00</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Taxas de pagamento</span>
                      <span className="text-lg">- R$ 2.294,50</span>
                    </div>
                    <div className="border-t pt-4 flex justify-between items-center">
                      <span className="font-medium">Receita líquida</span>
                      <span className="text-2xl font-bold text-primary">R$ 43.595,50</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Relatórios</CardTitle>
                    <CardDescription>Exporte dados financeiros</CardDescription>
                  </div>
                  <BarChart3 className="h-5 w-5 text-muted-foreground" />
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    Exportar vendas (CSV)
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Relatório completo (PDF)
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="checkin" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Painel de Check-in</CardTitle>
                    <CardDescription>Status em tempo real</CardDescription>
                  </div>
                  <Button>Abrir scanner QR</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {[
                    { categoria: "Amador", total: 50, checkin: 38 },
                    { categoria: "Profissional", total: 40, checkin: 28 },
                    { categoria: "Aspirante", total: 50, checkin: 18 },
                    { categoria: "Mirim", total: 30, checkin: 5 }
                  ].map((cat) => (
                    <div key={cat.categoria}>
                      <div className="flex justify-between mb-2">
                        <span className="font-medium">{cat.categoria}</span>
                        <span className="text-sm text-muted-foreground">
                          {cat.checkin}/{cat.total} ({Math.round((cat.checkin/cat.total)*100)}%)
                        </span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary transition-all"
                          style={{ width: `${(cat.checkin/cat.total)*100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;

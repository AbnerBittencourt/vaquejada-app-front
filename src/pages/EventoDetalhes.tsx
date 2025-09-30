import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, MapPin, Trophy, FileText, Users, ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";

const EventoDetalhes = () => {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              <Users className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold">Vaquei Fácil</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Image */}
      <div className="relative h-80 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1553696590-4b3f68898333" 
          alt="Evento"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>
      </div>

      <div className="container mx-auto px-4 -mt-20 relative z-10">
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-3xl mb-2">Vaquejada do Parque Santa Cruz</CardTitle>
                <CardDescription className="flex items-center gap-2 text-base">
                  <MapPin className="h-5 w-5" />
                  Santa Cruz do Capibaribe - PE
                </CardDescription>
              </div>
              <Badge className="text-lg px-4 py-2">R$ 150,00</Badge>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground mt-4">
              <Calendar className="h-5 w-5" />
              <span>15 de Abril de 2025 - 08:00</span>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <Tabs defaultValue="info" className="w-full">
              <TabsList className="w-full justify-start">
                <TabsTrigger value="info" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Informações
                </TabsTrigger>
                <TabsTrigger value="categorias" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Categorias
                </TabsTrigger>
                <TabsTrigger value="premiacao" className="flex items-center gap-2">
                  <Trophy className="h-4 w-4" />
                  Premiação
                </TabsTrigger>
                <TabsTrigger value="local" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Local
                </TabsTrigger>
              </TabsList>

              <TabsContent value="info" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Sobre o evento</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 text-muted-foreground">
                    <p>
                      A Vaquejada do Parque Santa Cruz é um dos eventos mais tradicionais da região, reunindo os melhores vaqueiros do Nordeste para uma competição emocionante.
                    </p>
                    <p>
                      Com infraestrutura completa, o parque oferece estacionamento amplo, praça de alimentação, camarotes e arquibancadas cobertas para garantir o conforto de todos os participantes e espectadores.
                    </p>
                    <div className="pt-4">
                      <h4 className="font-semibold text-foreground mb-2">Regulamento:</h4>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Inscrição válida mediante pagamento confirmado</li>
                        <li>Apresentação de documentos obrigatórios</li>
                        <li>Cavalos com vacinação em dia</li>
                        <li>Uso de equipamentos de segurança obrigatório</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="categorias" className="mt-6">
                <div className="space-y-4">
                  {[
                    { name: "Amador", price: "R$ 150,00", vagas: "42/50" },
                    { name: "Profissional", price: "R$ 200,00", vagas: "28/40" },
                    { name: "Aspirante", price: "R$ 120,00", vagas: "35/50" },
                    { name: "Mirim", price: "R$ 100,00", vagas: "18/30" }
                  ].map((cat) => (
                    <Card key={cat.name}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-xl">{cat.name}</CardTitle>
                          <Badge variant="secondary">{cat.vagas} vagas</Badge>
                        </div>
                        <CardDescription className="text-lg font-semibold text-primary">
                          {cat.price}
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="premiacao" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Premiação</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {[
                        { categoria: "Profissional", premios: ["1º: R$ 10.000", "2º: R$ 5.000", "3º: R$ 2.500"] },
                        { categoria: "Amador", premios: ["1º: R$ 5.000", "2º: R$ 2.500", "3º: R$ 1.000"] },
                        { categoria: "Aspirante", premios: ["1º: R$ 3.000", "2º: R$ 1.500", "3º: R$ 800"] },
                        { categoria: "Mirim", premios: ["1º: R$ 1.500", "2º: R$ 800", "3º: R$ 400"] }
                      ].map((item) => (
                        <div key={item.categoria}>
                          <h4 className="font-semibold mb-2">{item.categoria}</h4>
                          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                            {item.premios.map((p) => (
                              <li key={p}>{p}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="local" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Localização</CardTitle>
                    <CardDescription>Parque de Vaquejada Santa Cruz</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-video bg-muted rounded-lg flex items-center justify-center mb-4">
                      <MapPin className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground">
                      Rodovia BR-104, Km 85 - Santa Cruz do Capibaribe, PE
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div>
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Comprar Senhas</CardTitle>
                <CardDescription>Selecione a categoria desejada</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full" size="lg" asChild>
                  <Link to={`/comprar-senhas/${id}`}>Selecionar senhas</Link>
                </Button>
                <div className="text-sm text-muted-foreground space-y-2">
                  <p className="flex items-center gap-2">
                    ✓ Confirmação imediata
                  </p>
                  <p className="flex items-center gap-2">
                    ✓ QR Code por e-mail
                  </p>
                  <p className="flex items-center gap-2">
                    ✓ Pagamento seguro
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventoDetalhes;

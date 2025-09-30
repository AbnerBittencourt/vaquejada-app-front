import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Users, ArrowLeft, Upload, Plus, Award, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

const PerfilCorredor = () => {
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

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Profile Header */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <Avatar className="h-32 w-32">
                  <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=rider" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-3xl font-bold mb-2">João da Silva</h2>
                  <p className="text-muted-foreground mb-4">Equipe Campeões do Agreste</p>
                  <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                    <Badge variant="secondary" className="gap-1">
                      <Award className="h-3 w-3" />
                      12 Vitórias
                    </Badge>
                    <Badge variant="secondary" className="gap-1">
                      <Calendar className="h-3 w-3" />
                      45 Eventos
                    </Badge>
                  </div>
                </div>
                <Button>Editar perfil</Button>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="dados" className="w-full">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="dados">Dados Pessoais</TabsTrigger>
              <TabsTrigger value="cavalos">Meus Cavalos</TabsTrigger>
              <TabsTrigger value="documentos">Documentos</TabsTrigger>
              <TabsTrigger value="historico">Histórico</TabsTrigger>
            </TabsList>

            <TabsContent value="dados" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Informações Pessoais</CardTitle>
                  <CardDescription>Mantenha seus dados atualizados</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nome">Nome completo</Label>
                      <Input id="nome" defaultValue="João da Silva" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cpf">CPF</Label>
                      <Input id="cpf" defaultValue="123.456.789-00" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="rg">RG</Label>
                      <Input id="rg" defaultValue="12.345.678-9" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="nascimento">Data de nascimento</Label>
                      <Input id="nascimento" type="date" defaultValue="1990-05-15" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="telefone">Telefone</Label>
                      <Input id="telefone" defaultValue="(87) 98888-7777" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">E-mail</Label>
                      <Input id="email" type="email" defaultValue="joao@email.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="equipe">Equipe/Estábulo</Label>
                      <Input id="equipe" defaultValue="Campeões do Agreste" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="haras">Haras</Label>
                      <Input id="haras" defaultValue="Haras Vale Verde" placeholder="Nome do haras" />
                    </div>
                  </div>
                  <Button className="w-full md:w-auto">Salvar alterações</Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="cavalos" className="mt-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold">Meus Cavalos</h3>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Adicionar cavalo
                  </Button>
                </div>

                {[
                  { nome: "Relâmpago", registro: "ABC-12345", raca: "Quarto de Milha", idade: "5 anos" },
                  { nome: "Trovão", registro: "ABC-67890", raca: "Paint Horse", idade: "7 anos" }
                ].map((cavalo) => (
                  <Card key={cavalo.nome}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle>{cavalo.nome}</CardTitle>
                          <CardDescription>Registro: {cavalo.registro}</CardDescription>
                        </div>
                        <Button variant="outline" size="sm">Editar</Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Raça:</span>
                          <p className="font-medium">{cavalo.raca}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Idade:</span>
                          <p className="font-medium">{cavalo.idade}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="documentos" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Documentos</CardTitle>
                  <CardDescription>Faça upload dos documentos necessários</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { nome: "RG/CPF", status: "Aprovado" },
                    { nome: "Atestado médico", status: "Pendente" },
                    { nome: "Cartão de vacina (Relâmpago)", status: "Aprovado" },
                    { nome: "Cartão de vacina (Trovão)", status: "Aprovado" }
                  ].map((doc) => (
                    <div key={doc.nome} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{doc.nome}</p>
                        <Badge variant={doc.status === "Aprovado" ? "default" : "secondary"} className="mt-1">
                          {doc.status}
                        </Badge>
                      </div>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Upload className="h-4 w-4" />
                        Upload
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="historico" className="mt-6">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Histórico de Eventos</h3>
                {[
                  { evento: "Vaquejada Caruaru 2024", data: "15/12/2024", categoria: "Amador", posicao: "1º lugar" },
                  { evento: "Rodeio Campina Grande 2024", data: "20/11/2024", categoria: "Amador", posicao: "3º lugar" },
                  { evento: "Vaquejada Petrolina 2024", data: "05/10/2024", categoria: "Aspirante", posicao: "2º lugar" }
                ].map((item) => (
                  <Card key={item.evento}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{item.evento}</CardTitle>
                          <CardDescription>{item.data}</CardDescription>
                        </div>
                        <Badge>{item.posicao}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">Categoria: {item.categoria}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default PerfilCorredor;

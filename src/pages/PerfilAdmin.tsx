import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Shield, ArrowLeft, MapPin, Calendar, TrendingUp, Building } from "lucide-react";
import { Link } from "react-router-dom";

const PerfilAdmin = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/admin/dashboard">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              <Shield className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold">Perfil do Organizador</h1>
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
                  <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=admin" />
                  <AvatarFallback>PS</AvatarFallback>
                </Avatar>
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-3xl font-bold mb-2">Parque Santa Cruz</h2>
                  <p className="text-muted-foreground mb-4 flex items-center gap-1 justify-center md:justify-start">
                    <MapPin className="h-4 w-4" />
                    Caruaru, PE
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                    <Badge variant="secondary" className="gap-1">
                      <Calendar className="h-3 w-3" />
                      28 Eventos realizados
                    </Badge>
                    <Badge variant="secondary" className="gap-1">
                      <TrendingUp className="h-3 w-3" />
                      4.8★ Avaliação
                    </Badge>
                    <Badge variant="secondary" className="gap-1">
                      <Building className="h-3 w-3" />
                      Desde 2018
                    </Badge>
                  </div>
                </div>
                <Button>Editar perfil</Button>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="dados" className="w-full">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="dados">Dados do Parque</TabsTrigger>
              <TabsTrigger value="contato">Contato</TabsTrigger>
              <TabsTrigger value="financeiro">Dados Financeiros</TabsTrigger>
              <TabsTrigger value="configuracoes">Configurações</TabsTrigger>
            </TabsList>

            <TabsContent value="dados" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Informações do Parque</CardTitle>
                  <CardDescription>Dados públicos do seu parque/organização</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nome-parque">Nome do Parque</Label>
                      <Input id="nome-parque" defaultValue="Parque Santa Cruz" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cnpj">CNPJ</Label>
                      <Input id="cnpj" defaultValue="12.345.678/0001-90" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="endereco">Endereço completo</Label>
                      <Input id="endereco" defaultValue="Rua das Vaquejadas, 123, Centro, Caruaru - PE" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cidade">Cidade</Label>
                      <Input id="cidade" defaultValue="Caruaru" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="estado">Estado</Label>
                      <Input id="estado" defaultValue="PE" maxLength={2} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cep">CEP</Label>
                      <Input id="cep" defaultValue="55000-000" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="capacidade">Capacidade</Label>
                      <Input id="capacidade" type="number" defaultValue="500" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="descricao">Descrição</Label>
                      <Input 
                        id="descricao" 
                        defaultValue="Parque de vaquejada com infraestrutura completa" 
                      />
                    </div>
                  </div>
                  <Button className="w-full md:w-auto">Salvar alterações</Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="contato" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Informações de Contato</CardTitle>
                  <CardDescription>Dados para comunicação com organizadores e vaqueiros</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="responsavel">Nome do responsável</Label>
                      <Input id="responsavel" defaultValue="José Carlos Silva" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="telefone">Telefone principal</Label>
                      <Input id="telefone" defaultValue="(81) 98888-7777" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="whatsapp">WhatsApp</Label>
                      <Input id="whatsapp" defaultValue="(81) 98888-7777" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">E-mail</Label>
                      <Input id="email" type="email" defaultValue="contato@parquesantacruz.com.br" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="instagram">Instagram</Label>
                      <Input id="instagram" defaultValue="@parquesantacruz" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="facebook">Facebook</Label>
                      <Input id="facebook" defaultValue="/parquesantacruz" />
                    </div>
                  </div>
                  <Button className="w-full md:w-auto">Salvar alterações</Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="financeiro" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Dados Financeiros</CardTitle>
                  <CardDescription>Informações para recebimento de pagamentos</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="banco">Banco</Label>
                      <Input id="banco" defaultValue="Banco do Brasil" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="agencia">Agência</Label>
                      <Input id="agencia" defaultValue="1234-5" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="conta">Conta corrente</Label>
                      <Input id="conta" defaultValue="12345-6" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pix">Chave PIX</Label>
                      <Input id="pix" defaultValue="12.345.678/0001-90" />
                    </div>
                  </div>
                  <Button className="w-full md:w-auto">Salvar alterações</Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="configuracoes" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Configurações da Conta</CardTitle>
                  <CardDescription>Gerencie suas preferências e segurança</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email-login">E-mail de login</Label>
                      <Input id="email-login" type="email" defaultValue="admin@parquesantacruz.com.br" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="senha-atual">Senha atual</Label>
                      <Input id="senha-atual" type="password" placeholder="••••••••" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="nova-senha">Nova senha</Label>
                      <Input id="nova-senha" type="password" placeholder="••••••••" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmar-senha">Confirmar nova senha</Label>
                      <Input id="confirmar-senha" type="password" placeholder="••••••••" />
                    </div>
                  </div>
                  <Button className="w-full md:w-auto">Atualizar senha</Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default PerfilAdmin;

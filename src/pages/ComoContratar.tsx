import { Header } from "@/components/ui/header";
import { useAuth } from "@/contexts/AuthContext";
import { UserRoleEnum } from "@/types/enums/api-enums";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Ticket,
  DollarSign,
  FileText,
  Users,
  Radio,
  CheckCircle2,
  MessageCircle,
  Sparkles,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const ComoContratar = () => {
  const { user, logout, isAuthenticated } = useAuth();

  // Número de WhatsApp para contato (substitua pelo número real)
  const whatsappNumber = "5511999999999"; // Formato: código do país + DDD + número
  const whatsappMessage = encodeURIComponent(
    "Olá! Gostaria de saber mais sobre como contratar o Vaquejada APP para meu evento."
  );
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  const features = [
    {
      icon: Calendar,
      title: "Criação do Evento",
      description:
        "Configure seu evento de forma simples e rápida, com todas as informações necessárias para os participantes.",
      color: "from-blue-500/20 to-blue-600/20",
      iconColor: "text-blue-500",
      borderColor: "border-blue-500/30",
    },
    {
      icon: Ticket,
      title: "Disponibilidade das Senhas",
      description:
        "Gerencie a venda de senhas de forma automatizada, com controle total de estoque e disponibilidade.",
      color: "from-purple-500/20 to-purple-600/20",
      iconColor: "text-purple-500",
      borderColor: "border-purple-500/30",
    },
    {
      icon: DollarSign,
      title: "Organização Financeira",
      description:
        "Acompanhe todas as transações financeiras do seu evento em tempo real, com relatórios detalhados.",
      color: "from-green-500/20 to-green-600/20",
      iconColor: "text-green-500",
      borderColor: "border-green-500/30",
    },
    {
      icon: FileText,
      title: "Organização da Secretaria",
      description:
        "Ferramentas completas para gestão administrativa do evento, facilitando o trabalho da secretaria.",
      color: "from-orange-500/20 to-orange-600/20",
      iconColor: "text-orange-500",
      borderColor: "border-orange-500/30",
    },
    {
      icon: Users,
      title: "Perfis de Locução, Juiz e Organizador",
      description:
        "Acesso diferenciado para cada função no evento, garantindo eficiência e organização.",
      color: "from-pink-500/20 to-pink-600/20",
      iconColor: "text-pink-500",
      borderColor: "border-pink-500/30",
    },
    {
      icon: Radio,
      title: "Transmissão em Tempo Real",
      description:
        "Resultados transmitidos instantaneamente pelo aplicativo Vaquejada App para todo o mundo.",
      color: "from-red-500/20 to-red-600/20",
      iconColor: "text-red-500",
      borderColor: "border-red-500/30",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Header
        user={user || { name: "Usuário", role: UserRoleEnum.USER }}
        onLogout={logout}
        isAuthenticated={isAuthenticated}
        title="Vaquejada APP"
      />

      {/* Hero Section */}
      <section className="relative py-16 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-muted/20"></div>
        <div className="absolute top-10 left-10 w-56 h-56 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-secondary/10 rounded-full blur-3xl"></div>

        <div className="container mx-auto max-w-4xl relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
              <Sparkles className="h-4 w-4" />
              Plano Completo
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              COMO CONTRATAR
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Profissionalize a gestão do seu evento com nossa plataforma
              completa de gerenciamento de vaquejadas
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              O que está incluído
            </h2>
            <p className="text-muted-foreground text-lg">
              Tudo que você precisa para gerenciar seu evento de forma
              profissional
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {features.map((feature, index) => (
              <Card
                key={index}
                className={`relative overflow-hidden border-2 ${feature.borderColor} hover:shadow-2xl transition-all duration-300 group bg-card/50 backdrop-blur-sm`}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                ></div>

                <CardHeader className="relative z-10">
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                    >
                      <feature.icon
                        className={`h-6 w-6 ${feature.iconColor}`}
                      />
                    </div>
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 border border-primary/20">
                      <span className="text-sm font-bold text-primary">
                        {index + 1}
                      </span>
                    </div>
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors duration-300">
                    {feature.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="relative z-10">
                  <CardDescription className="text-foreground/80 leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Benefits Section */}
          <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl p-8 md:p-12 border-2 border-primary/20 mb-16">
            <h3 className="text-2xl md:text-3xl font-bold mb-8 text-center text-foreground">
              Benefícios do Vaquejada APP
            </h3>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                "Redução de custos operacionais",
                "Maior controle sobre vendas e finanças",
                "Facilita a comunicação da equipe",
                "Resultados instantâneos para o público",
                "Interface intuitiva e fácil de usar",
                "Suporte técnico dedicado",
                "Atualizações constantes e gratuitas",
                "Relatórios completos e detalhados",
              ].map((benefit, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-4 rounded-xl bg-background/50 hover:bg-background/80 transition-colors duration-200"
                >
                  <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-foreground/90 font-medium">{benefit}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-8 md:p-12 text-center text-white shadow-2xl">
            <div className="max-w-2xl mx-auto">
              <MessageCircle className="h-16 w-16 mx-auto mb-6 animate-pulse" />

              <h3 className="text-3xl md:text-4xl font-bold mb-4">
                Pronto para começar?
              </h3>

              <p className="text-lg mb-8 text-white/90">
                Entre em contato conosco pelo WhatsApp e descubra como podemos
                transformar a gestão do seu evento de vaquejada.
              </p>

              <Button
                size="lg"
                className="bg-white text-primary hover:bg-white/90 shadow-xl hover:shadow-2xl transition-all duration-300 text-lg px-8 py-6 rounded-xl font-bold group"
                asChild
              >
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3"
                >
                  <MessageCircle className="h-6 w-6 group-hover:scale-110 transition-transform" />
                  <span>Fale Conosco no WhatsApp</span>
                </a>
              </Button>

              <p className="text-sm mt-6 text-white/80">
                Resposta rápida e atendimento personalizado
              </p>
            </div>
          </div>

          {/* Contact Info */}
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-muted/50 border">
              <MessageCircle className="h-5 w-5 text-primary" />
              <p className="text-sm text-muted-foreground">
                Dúvidas? Estamos disponíveis para ajudar você a escolher o
                melhor plano
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t bg-card/50 backdrop-blur-sm py-10 px-4">
        <div className="container mx-auto">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              © 2025 AMJ Group Softwares LTDA. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ComoContratar;

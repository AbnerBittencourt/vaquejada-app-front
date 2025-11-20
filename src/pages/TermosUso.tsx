import { Header } from "@/components/ui/header";
import { useAuth } from "@/contexts/AuthContext";
import { UserRoleEnum } from "@/types/enums/api-enums";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FileText,
  CheckCircle2,
  Target,
  UserCheck,
  CreditCard,
  XCircle,
  Shield,
  Copyright,
  AlertTriangle,
  RefreshCw,
  Mail,
  Phone,
  Building,
} from "lucide-react";

const TermosUso = () => {
  const { user, logout, isAuthenticated } = useAuth();

  const sections = [
    {
      icon: CheckCircle2,
      title: "1. Aceitação dos Termos",
      content: (
        <p>
          Ao utilizar este site, você declara estar ciente e de acordo com as
          regras estabelecidas neste documento. Se você não concordar com
          qualquer parte destes Termos, pedimos que não utilize o site.
        </p>
      ),
    },
    {
      icon: Target,
      title: "2. Objetivo do Site",
      content: (
        <p>
          Este site tem como finalidade a divulgação e inscrição em Vaquejadas
          organizadas por donos de parques, bem como empresas/associações
          realizadoras de Vaquejadas, além de fornecer informações relevantes
          sobre datas, regulamentos, formas de pagamento e comunicação com os
          participantes.
        </p>
      ),
    },
    {
      icon: UserCheck,
      title: "3. Cadastro e Inscrição",
      content: (
        <>
          <p className="mb-3">Para se inscrever nos eventos:</p>
          <ul className="space-y-2 ml-6 mb-3">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-1" />
              <span>
                O usuário deverá preencher corretamente todos os campos
                obrigatórios do formulário de inscrição.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-1" />
              <span>
                É de responsabilidade do usuário fornecer informações
                verdadeiras, atualizadas e completas.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-1" />
              <span>
                A inscrição será confirmada somente após a compensação do
                pagamento.
              </span>
            </li>
          </ul>
          <p className="text-sm text-muted-foreground">
            A organização se reserva o direito de cancelar inscrições com dados
            falsos, inconsistentes ou que descumpram regras do evento.
          </p>
        </>
      ),
    },
    {
      icon: CreditCard,
      title: "4. Pagamento",
      content: (
        <>
          <p className="mb-3">
            As inscrições estarão disponíveis mediante pagamento via os métodos
            oferecidos no site (cartão de crédito, boleto, Pix ou outros).
          </p>
          <ul className="space-y-2 ml-6">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-1" />
              <span>
                O valor da inscrição e os prazos de pagamento estão descritos
                na página específica do evento.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-1" />
              <span>
                A inscrição somente será válida após a confirmação do
                pagamento.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-1" />
              <span>
                Não nos responsabilizamos por falhas de terceiros, como
                operadoras de cartão ou plataformas de pagamento.
              </span>
            </li>
          </ul>
        </>
      ),
    },
    {
      icon: XCircle,
      title: "5. Cancelamento e Reembolso",
      content: (
        <>
          <p className="mb-3">
            O cancelamento da inscrição poderá ser solicitado com reembolso
            integral, desde que respeite os prazos descritos em nossa{" "}
            <a
              href="/politica-cancelamento"
              className="text-primary hover:underline font-medium"
            >
              Política de Cancelamento e Reembolso
            </a>
            .
          </p>
          <p className="mb-4">
            Após esse prazo, não haverá reembolso, conforme as condições
            previamente informadas.
          </p>
          <div className="p-4 bg-amber-50 border-2 border-amber-200 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-800 font-medium">
                O VALOR DE ACRÉSCIMO REFERENTE A TAXAS ADMINISTRATIVAS E JUROS
                DO CARTÃO DE CRÉDITO NÃO SERÃO DEVOLVIDOS.
              </p>
            </div>
          </div>
        </>
      ),
    },
    {
      icon: Shield,
      title: "6. Uso dos Dados Pessoais",
      content: (
        <>
          <p className="mb-3">
            Ao se inscrever, você autoriza o uso dos seus dados pessoais
            conforme nossa{" "}
            <a
              href="/politica-privacidade"
              className="text-primary hover:underline font-medium"
            >
              Política de Privacidade
            </a>
            , incluindo para:
          </p>
          <ul className="space-y-2 ml-6">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-1" />
              <span>Processamento da inscrição</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-1" />
              <span>Comunicação sobre o evento</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-1" />
              <span>
                Divulgação de resultados ou premiações (quando aplicável)
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-1" />
              <span>Envio de informações e materiais relacionados</span>
            </li>
          </ul>
        </>
      ),
    },
    {
      icon: Copyright,
      title: "7. Propriedade Intelectual",
      content: (
        <p>
          Todo o conteúdo presente neste site (textos, imagens, logos, vídeos e
          layout) é de propriedade da organização e protegido por direitos
          autorais. É proibida a reprodução, distribuição ou uso comercial sem
          autorização expressa.
        </p>
      ),
    },
    {
      icon: AlertTriangle,
      title: "8. Responsabilidades do Usuário",
      content: (
        <>
          <p className="mb-3">
            Ao utilizar este site, o usuário se compromete a:
          </p>
          <ul className="space-y-2 ml-6">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-1" />
              <span>
                Não realizar qualquer atividade ilegal ou que viole estes
                termos
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-1" />
              <span>
                Não inserir informações falsas ou de terceiros sem autorização
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-1" />
              <span>
                Respeitar a integridade do sistema e da organização do evento
              </span>
            </li>
          </ul>
        </>
      ),
    },
    {
      icon: RefreshCw,
      title: "9. Alterações nos Termos",
      content: (
        <p>
          A organização poderá atualizar estes Termos de Uso a qualquer
          momento, sendo responsabilidade do usuário verificar periodicamente o
          conteúdo. O uso contínuo do site após alterações representa aceitação
          dos novos termos.
        </p>
      ),
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
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 border-2 border-primary/20 mb-6">
              <FileText className="h-8 w-8 text-primary" />
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              TERMOS DE USO
            </h1>

            <p className="text-muted-foreground mb-2">
              Última atualização:{" "}
              <span className="font-medium text-foreground">
                {new Date().toLocaleDateString("pt-BR")}
              </span>
            </p>
          </div>

          <Card className="border-2 bg-card/50 backdrop-blur-sm mb-8">
            <CardHeader>
              <CardTitle className="text-xl">Bem-vindo ao Vaquejada App!</CardTitle>
              <CardDescription className="text-base leading-relaxed">
                Ao acessar e utilizar este site para realizar inscrições em
                nossos eventos esportivos, você concorda com os seguintes Termos
                de Uso. Por favor, leia com atenção antes de concluir sua
                inscrição.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-8 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="space-y-6">
            {sections.map((section, index) => (
              <Card
                key={index}
                className="border-2 hover:border-primary/30 transition-all duration-300 bg-card/50 backdrop-blur-sm"
              >
                <CardHeader>
                  <CardTitle className="flex items-start gap-3 text-xl">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 flex-shrink-0">
                      <section.icon className="h-5 w-5 text-primary" />
                    </div>
                    <span className="pt-1">{section.title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-foreground/90 leading-relaxed">
                  {section.content}
                </CardContent>
              </Card>
            ))}

            {/* Contact Section */}
            <Card className="border-2 bg-gradient-to-br from-primary/5 to-secondary/5">
              <CardHeader>
                <CardTitle className="flex items-start gap-3 text-xl">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 flex-shrink-0">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <span className="pt-1">10. Contato</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-foreground/90">
                  Em caso de dúvidas, sugestões ou problemas com a inscrição,
                  entre em contato conosco:
                </p>

                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-4 bg-background/50 rounded-lg border">
                    <Mail className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground mb-1">E-mail</p>
                      <a
                        href="mailto:contato@vaquejadaapp.com"
                        className="text-primary hover:underline"
                      >
                        contato@vaquejadaapp.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-background/50 rounded-lg border">
                    <Phone className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground mb-1">
                        Telefone
                      </p>
                      <a
                        href="tel:+5511999999999"
                        className="text-primary hover:underline"
                      >
                        (11) 99999-9999
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-background/50 rounded-lg border">
                    <Building className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground mb-1">
                        Responsável Legal
                      </p>
                      <p className="text-foreground/80">
                        AMJ Group Softwares LTDA
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Links */}
          <Card className="mt-8 border-2 border-primary/30">
            <CardHeader>
              <CardTitle className="text-lg">Documentos Relacionados</CardTitle>
              <CardDescription>
                Consulte também nossos outros documentos legais
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-3">
                <a
                  href="/politica-privacidade"
                  className="flex items-center gap-3 p-4 bg-muted/30 hover:bg-muted/50 rounded-lg border transition-colors group"
                >
                  <Shield className="h-5 w-5 text-primary" />
                  <div className="flex-1">
                    <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                      Política de Privacidade
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Como tratamos seus dados
                    </p>
                  </div>
                </a>

                <a
                  href="/politica-cancelamento"
                  className="flex items-center gap-3 p-4 bg-muted/30 hover:bg-muted/50 rounded-lg border transition-colors group"
                >
                  <RefreshCw className="h-5 w-5 text-primary" />
                  <div className="flex-1">
                    <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                      Cancelamento e Reembolso
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Regras e prazos
                    </p>
                  </div>
                </a>
              </div>
            </CardContent>
          </Card>

          {/* Footer Banner */}
          <div className="mt-8 p-6 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl border-2 border-primary/20 text-center">
            <p className="font-semibold text-lg text-foreground mb-2">
              Vaquejada App
            </p>
            <p className="text-sm text-muted-foreground">
              Compromisso com esporte, organização e respeito aos participantes.
            </p>
          </div>
        </div>
      </section>

      <footer className="border-t bg-card/50 backdrop-blur-sm py-10 px-4 mt-16">
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

export default TermosUso;

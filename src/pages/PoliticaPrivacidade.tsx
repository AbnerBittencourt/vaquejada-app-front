import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
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
  Shield,
  Lock,
  Database,
  Users,
  CheckCircle2,
  Mail,
  AlertCircle,
  FileText,
} from "lucide-react";

const PoliticaPrivacidade = () => {
  const { user, logout, isAuthenticated } = useAuth();

  const sections = [
    {
      icon: Database,
      title: "1. Coleta de Dados Pessoais",
      content: (
        <>
          <p className="mb-3">
            Coletamos as informações pessoais fornecidas voluntariamente por
            você no momento da inscrição e pagamento em nosso site, tais como:
          </p>
          <ul className="space-y-2 ml-6">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-1" />
              <span>Nome completo</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-1" />
              <span>E-mail</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-1" />
              <span>Telefone</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-1" />
              <span>CPF ou CNPJ</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-1" />
              <span>Endereço</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-1" />
              <span>
                Dados de pagamento (como dados parciais do cartão de crédito ou
                informações para boleto/pix)
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-1" />
              <span>
                Outras informações necessárias para a inscrição nos nossos
                serviços ou eventos
              </span>
            </li>
          </ul>
        </>
      ),
    },
    {
      icon: FileText,
      title: "2. Finalidade da Coleta",
      content: (
        <>
          <p className="mb-3">Os dados coletados serão utilizados para:</p>
          <ul className="space-y-2 ml-6">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-1" />
              <span>Processar e gerenciar inscrições e pagamentos</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-1" />
              <span>
                Enviar confirmações, comunicados e atualizações sobre o serviço
                adquirido
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-1" />
              <span>Cumprir obrigações legais e regulatórias</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-1" />
              <span>Garantir a segurança das transações realizadas</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-1" />
              <span>
                Realizar contato via e-mail, telefone ou outros meios
                fornecidos pelo cliente
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-1" />
              <span>
                Melhorar nossos serviços, comunicação e atendimento
              </span>
            </li>
          </ul>
        </>
      ),
    },
    {
      icon: Lock,
      title: "3. Armazenamento dos Dados",
      content: (
        <>
          <p className="mb-3">
            Os dados são armazenados em ambiente seguro e controlado, com
            medidas técnicas e administrativas adequadas para proteger a
            integridade e a confidencialidade das informações.
          </p>
          <p>
            Manteremos os dados pelo tempo necessário para cumprir com as
            finalidades descritas nesta Política ou conforme exigido por
            obrigações legais.
          </p>
        </>
      ),
    },
    {
      icon: Users,
      title: "4. Compartilhamento de Dados",
      content: (
        <>
          <p className="mb-3">
            Os dados poderão ser compartilhados com terceiros estritamente
            necessários para a execução dos serviços contratados, como:
          </p>
          <ul className="space-y-2 ml-6 mb-3">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-1" />
              <span>Prestadores de serviços de pagamento</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-1" />
              <span>
                Plataformas de inscrição ou gerenciamento de eventos
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-1" />
              <span>
                Empresas responsáveis pela hospedagem do site ou sistemas
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-1" />
              <span>Autoridades legais, se exigido por lei</span>
            </li>
          </ul>
          <p>
            Garantimos que todos os parceiros atuam em conformidade com a
            legislação de proteção de dados.
          </p>
        </>
      ),
    },
    {
      icon: CheckCircle2,
      title: "5. Consentimento",
      content: (
        <p>
          Ao fornecer suas informações pessoais neste site, você está
          consentindo com a coleta, uso e compartilhamento de dados conforme
          esta Política de Privacidade.
        </p>
      ),
    },
    {
      icon: Shield,
      title: "6. Direitos do Titular dos Dados",
      content: (
        <>
          <p className="mb-3">Você tem direito a:</p>
          <ul className="space-y-2 ml-6 mb-3">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-1" />
              <span>Confirmar a existência de tratamento de seus dados</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-1" />
              <span>Acessar os dados armazenados</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-1" />
              <span>
                Corrigir dados incompletos, inexatos ou desatualizados
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-1" />
              <span>
                Solicitar a anonimização, bloqueio ou eliminação dos dados
                desnecessários
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-1" />
              <span>Revogar o consentimento a qualquer momento</span>
            </li>
          </ul>
          <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
            <p className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-primary flex-shrink-0" />
              <span>
                Para exercer seus direitos, entre em contato conosco pelo
                e-mail:{" "}
                <a
                  href="mailto:privacidade@vaquejadaapp.com"
                  className="text-primary hover:underline font-medium"
                >
                  privacidade@vaquejadaapp.com
                </a>
              </span>
            </p>
          </div>
        </>
      ),
    },
    {
      icon: AlertCircle,
      title: "7. Alterações na Política de Privacidade",
      content: (
        <p>
          Esta Política pode ser atualizada a qualquer momento para refletir
          mudanças em nossas práticas. Recomendamos que você a revise
          periodicamente.
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
              <Shield className="h-8 w-8 text-primary" />
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              POLÍTICA DE PRIVACIDADE
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
              <CardTitle className="text-xl">Sobre esta política</CardTitle>
              <CardDescription className="text-base leading-relaxed">
                Esta Política de Privacidade descreve como coletamos, usamos,
                armazenamos e compartilhamos os dados pessoais fornecidos pelos
                usuários em nosso site. É nosso princípio manter a sua
                privacidade, bem como proteger seus dados pessoais. Ao utilizar
                nossos serviços, você concorda com os termos aqui descritos.
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
          </div>

          {/* Contact Card */}
          <Card className="mt-8 border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-secondary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary" />
                Dúvidas sobre Privacidade?
              </CardTitle>
              <CardDescription>
                Se você tiver alguma dúvida sobre nossa Política de Privacidade
                ou sobre como tratamos seus dados pessoais, entre em contato
                conosco.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 p-4 bg-background/50 rounded-lg border">
                  <p className="text-sm text-muted-foreground mb-1">
                    E-mail para questões de privacidade
                  </p>
                  <a
                    href="mailto:privacidade@vaquejadaapp.com"
                    className="text-primary hover:underline font-medium"
                  >
                    privacidade@vaquejadaapp.com
                  </a>
                </div>
                <div className="flex-1 p-4 bg-background/50 rounded-lg border">
                  <p className="text-sm text-muted-foreground mb-1">
                    E-mail geral
                  </p>
                  <a
                    href="mailto:contato@vaquejadaapp.com"
                    className="text-primary hover:underline font-medium"
                  >
                    contato@vaquejadaapp.com
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* LGPD Notice */}
          <div className="mt-8 p-6 bg-muted/30 rounded-xl border-2">
            <div className="flex items-start gap-3">
              <Shield className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  Conformidade com a LGPD
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Esta Política de Privacidade está em conformidade com a Lei
                  Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018) e
                  demais legislações aplicáveis sobre proteção de dados
                  pessoais no Brasil.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PoliticaPrivacidade;

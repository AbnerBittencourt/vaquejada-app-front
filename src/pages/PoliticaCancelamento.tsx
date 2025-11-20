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
  XCircle,
  Clock,
  Mail,
  DollarSign,
  AlertTriangle,
  FileText,
  RefreshCw,
  CheckCircle2,
  Info,
} from "lucide-react";

const PoliticaCancelamento = () => {
  const { user, logout, isAuthenticated } = useAuth();

  const sections = [
    {
      icon: XCircle,
      title: "1. Cancelamento da Inscrição",
      content: (
        <>
          <p className="mb-3">
            O participante poderá solicitar o cancelamento da sua inscrição com
            direito a <strong>reembolso integral</strong>, desde que o pedido
            seja realizado com no mínimo <strong>24 horas de antecedência</strong>{" "}
            ao encerramento oficial do período de inscrições, conforme
            divulgado na página do evento.
          </p>
          <p className="mb-4">
            Após esse prazo, não serão aceitos pedidos de cancelamento ou
            reembolso, independentemente do motivo.
          </p>

          <div className="p-4 bg-amber-50 border-2 border-amber-200 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-900 mb-1">
                  1.1 - Importante sobre Taxas
                </p>
                <p className="text-sm text-amber-800">
                  O VALOR DE ACRÉSCIMO REFERENTE A TAXAS ADMINISTRATIVAS E
                  JUROS DO CARTÃO DE CRÉDITO NÃO SERÃO DEVOLVIDOS.
                </p>
              </div>
            </div>
          </div>
        </>
      ),
    },
    {
      icon: Mail,
      title: "2. Como Solicitar o Cancelamento",
      content: (
        <>
          <p className="mb-3">
            O pedido de cancelamento deve ser feito por escrito, através do
            e-mail:{" "}
            <a
              href="mailto:cancelamento@vaquejadaapp.com"
              className="text-primary hover:underline font-medium"
            >
              cancelamento@vaquejadaapp.com
            </a>
            , informando:
          </p>
          <ul className="space-y-2 ml-6">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-1" />
              <span>Nome completo do inscrito</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-1" />
              <span>CPF</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-1" />
              <span>Nome do evento</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-1" />
              <span>Comprovante de inscrição ou número do pedido</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-1" />
              <span>
                Dados bancários (se necessário para reembolso via transferência)
              </span>
            </li>
          </ul>
        </>
      ),
    },
    {
      icon: Clock,
      title: "3. Prazo para Reembolso",
      content: (
        <>
          <p className="mb-3">
            O reembolso será processado em até <strong>48 horas</strong> após a
            confirmação do cancelamento.
          </p>

          <div className="space-y-3 mb-3">
            <div className="p-3 bg-muted/30 rounded-lg border">
              <p className="font-medium text-foreground mb-2 flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-primary" />
                Pagamento via Cartão de Crédito
              </p>
              <p className="text-sm text-muted-foreground">
                O estorno poderá levar de <strong>1 a 2 faturas</strong>,
                dependendo da operadora do cartão.
              </p>
            </div>

            <div className="p-3 bg-muted/30 rounded-lg border">
              <p className="font-medium text-foreground mb-2 flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                Pagamento via Boleto Bancário ou PIX
              </p>
              <p className="text-sm text-muted-foreground">
                O estorno será feito na conta bancária registrada no CPF do
                titular do cadastro ou do vaqueiro. Os dados devem ser enviados
                junto com a solicitação.
              </p>
            </div>
          </div>

          <p className="text-sm text-muted-foreground">
            Assim que confirmada a devolução do valor, a(s) inscrição(ões)
            serão automaticamente canceladas e disponibilizadas para
            comercialização.
          </p>
        </>
      ),
    },
    {
      icon: RefreshCw,
      title: "4. Reembolsos Parciais e Transferências",
      content: (
        <ul className="space-y-3">
          <li className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
            <XCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-foreground mb-1">
                Não realizamos reembolsos parciais
              </p>
              <p className="text-sm text-muted-foreground">
                Exemplo: desistência de parte do evento ou kit.
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
            <XCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-foreground mb-1">
                Não aceitamos transferência de inscrição
              </p>
              <p className="text-sm text-muted-foreground">
                Salvo quando explicitamente autorizado pela organização e
                dentro do prazo de alteração.
              </p>
            </div>
          </li>
        </ul>
      ),
    },
    {
      icon: AlertTriangle,
      title: "5. Cancelamento ou Alteração do Evento pela Organização",
      content: (
        <>
          <div className="space-y-3">
            <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-blue-900 mb-2">
                    Cancelamento do Evento
                  </p>
                  <p className="text-sm text-blue-800">
                    Em caso de cancelamento do evento por parte da organização,
                    os participantes serão <strong>reembolsados integralmente</strong>.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-green-50 border-2 border-green-200 rounded-lg">
              <div className="flex items-start gap-3">
                <RefreshCw className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-green-900 mb-2">
                    Alteração de Data, Local ou Formato
                  </p>
                  <p className="text-sm text-green-800">
                    Se houver alteração de data, local ou formato, o inscrito
                    poderá optar por <strong>manter a inscrição</strong> ou{" "}
                    <strong>solicitar reembolso</strong>, dentro do prazo
                    informado pela organização.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
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
              <RefreshCw className="h-8 w-8 text-primary" />
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              POLÍTICA DE CANCELAMENTO E REEMBOLSO
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
              <CardTitle className="text-xl">Termos importantes</CardTitle>
              <CardDescription className="text-base leading-relaxed">
                Ao se inscrever em nossos eventos esportivos, você concorda com
                os termos desta Política de Cancelamento e Reembolso.
                Recomendamos a leitura atenta antes de concluir sua inscrição.
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
                Dúvidas ou Solicitações?
              </CardTitle>
              <CardDescription>
                Entre em contato com nossa equipe para esclarecer dúvidas ou
                solicitar cancelamento.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 p-4 bg-background/50 rounded-lg border">
                  <p className="text-sm text-muted-foreground mb-1">
                    E-mail para cancelamentos
                  </p>
                  <a
                    href="mailto:cancelamento@vaquejadaapp.com"
                    className="text-primary hover:underline font-medium"
                  >
                    cancelamento@vaquejadaapp.com
                  </a>
                </div>
                <div className="flex-1 p-4 bg-background/50 rounded-lg border">
                  <p className="text-sm text-muted-foreground mb-1">
                    E-mail para dúvidas
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

          {/* Important Notice */}
          <div className="mt-8 p-6 bg-amber-50 rounded-xl border-2 border-amber-200">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-6 w-6 text-amber-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-amber-900 mb-2">
                  Atenção ao Prazo
                </h3>
                <p className="text-sm text-amber-800 leading-relaxed">
                  Lembre-se: o cancelamento deve ser solicitado com no mínimo{" "}
                  <strong>24 horas de antecedência</strong> ao encerramento das
                  inscrições. Após esse prazo, não será possível realizar
                  cancelamentos ou reembolsos.
                </p>
              </div>
            </div>
          </div>

          {/* Steps Guide */}
          <Card className="mt-8 border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Como Solicitar o Cancelamento (Passo a Passo)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      Verifique o prazo
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Certifique-se de que está dentro do prazo de 24h antes do
                      encerramento das inscrições
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      Reúna os documentos
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Tenha em mãos: CPF, nome completo, comprovante de
                      inscrição e dados bancários
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold flex-shrink-0">
                    3
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      Envie o e-mail
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Envie todas as informações para
                      cancelamento@vaquejadaapp.com
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold flex-shrink-0">
                    4
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      Aguarde a confirmação
                    </p>
                    <p className="text-sm text-muted-foreground">
                      O reembolso será processado em até 48 horas após a
                      confirmação
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PoliticaCancelamento;

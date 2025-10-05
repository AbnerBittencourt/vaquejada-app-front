import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  ArrowLeft,
  Download,
  Mail,
  Calendar,
  MapPin,
  Ticket,
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const MeusIngressos = () => {
  const ingressos = [
    {
      id: 1,
      evento: "Vaquejada do Parque Santa Cruz",
      data: "15/04/2025",
      local: "Santa Cruz do Capibaribe - PE",
      categoria: "Amador",
      senhas: [12, 23, 45],
      status: "confirmado",
      qrcode: "QR123456",
    },
    {
      id: 2,
      evento: "Rodeio Campina Grande",
      data: "22/04/2025",
      local: "Campina Grande - PB",
      categoria: "Profissional",
      senhas: [7],
      status: "confirmado",
      qrcode: "QR789012",
    },
    {
      id: 3,
      evento: "Vaquejada de Caruaru",
      data: "29/04/2025",
      local: "Caruaru - PE",
      categoria: "Aspirante",
      senhas: [34, 35],
      status: "pendente",
      qrcode: "QR345678",
    },
  ];

  const handleDownload = (eventoNome: string) => {
    toast.success(`Download do ingresso de ${eventoNome} iniciado`);
  };

  const handleResend = (eventoNome: string) => {
    toast.success(`E-mail reenviado para ${eventoNome}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              <Users className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold">Trilha do Vaqueiro</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">Meus Ingressos</h2>
            <p className="text-muted-foreground">
              Gerencie suas inscrições e ingressos
            </p>
          </div>

          {ingressos.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Ticket className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  Nenhum ingresso ainda
                </h3>
                <p className="text-muted-foreground mb-6">
                  Você ainda não comprou nenhum ingresso para eventos
                </p>
                <Button asChild>
                  <Link to="/">Explorar eventos</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {ingressos.map((ingresso) => (
                <Card key={ingresso.id} className="overflow-hidden">
                  <CardHeader className="bg-gradient-card">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2">
                          {ingresso.evento}
                        </CardTitle>
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            {ingresso.data}
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            {ingresso.local}
                          </div>
                        </div>
                      </div>
                      <Badge
                        variant={
                          ingresso.status === "confirmado"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {ingresso.status === "confirmado"
                          ? "Confirmado"
                          : "Pendente"}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">
                          Categoria
                        </p>
                        <p className="font-semibold">{ingresso.categoria}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">
                          Senhas
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {ingresso.senhas.map((senha) => (
                            <Badge
                              key={senha}
                              variant="outline"
                              className="font-mono"
                            >
                              #{senha}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* QR Code mockado */}
                    <div className="border rounded-lg p-4 bg-muted/30">
                      <div className="flex items-center gap-4">
                        <div className="w-24 h-24 bg-background border-2 border-primary rounded-lg flex items-center justify-center">
                          <div className="text-xs font-mono text-center">
                            QR
                            <br />
                            CODE
                          </div>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium mb-1">
                            Código de confirmação
                          </p>
                          <p className="text-xs text-muted-foreground font-mono">
                            {ingresso.qrcode}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        className="flex-1 gap-2"
                        onClick={() => handleDownload(ingresso.evento)}
                      >
                        <Download className="h-4 w-4" />
                        Baixar ingresso
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1 gap-2"
                        onClick={() => handleResend(ingresso.evento)}
                      >
                        <Mail className="h-4 w-4" />
                        Reenviar e-mail
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MeusIngressos;

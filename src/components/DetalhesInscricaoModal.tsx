import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, XCircle, User, Building2, MapPin, Calendar, CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface InscricaoDetalhes {
  corredor: string;
  cpf: string;
  telefone: string;
  email: string;
  evento: string;
  categoria: string;
  haras: string;
  cavalo: string;
  registroCavalo: string;
  data: string;
  valor: string;
  status: string;
  checkin: boolean;
}

interface DetalhesInscricaoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  inscricao: InscricaoDetalhes | null;
}

export const DetalhesInscricaoModal = ({ open, onOpenChange, inscricao }: DetalhesInscricaoModalProps) => {
  const { toast } = useToast();
  const [checkinRealizado, setCheckinRealizado] = useState(inscricao?.checkin || false);

  if (!inscricao) return null;

  const handleCheckin = () => {
    setCheckinRealizado(!checkinRealizado);
    toast({
      title: !checkinRealizado ? "Check-in realizado!" : "Check-in cancelado",
      description: !checkinRealizado 
        ? `Check-in de ${inscricao.corredor} confirmado com sucesso.`
        : `Check-in de ${inscricao.corredor} foi cancelado.`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Detalhes da Inscrição
          </DialogTitle>
          <DialogDescription>
            Informações completas do competidor
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Perfil do corredor */}
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${inscricao.corredor}`} />
              <AvatarFallback>{inscricao.corredor.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-xl font-bold">{inscricao.corredor}</h3>
              <p className="text-sm text-muted-foreground">{inscricao.cpf}</p>
            </div>
            <Badge variant={checkinRealizado ? "default" : "secondary"} className="gap-1">
              {checkinRealizado ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
              {checkinRealizado ? "Check-in feito" : "Aguardando check-in"}
            </Badge>
          </div>

          <Separator />

          {/* Informações de contato */}
          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <User className="h-4 w-4 text-primary" />
              Contato
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Telefone:</span>
                <p className="font-medium">{inscricao.telefone}</p>
              </div>
              <div>
                <span className="text-muted-foreground">E-mail:</span>
                <p className="font-medium">{inscricao.email}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Informações do evento */}
          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              Evento
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Evento:</span>
                <p className="font-medium">{inscricao.evento}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Categoria:</span>
                <p className="font-medium">{inscricao.categoria}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Data da inscrição:</span>
                <p className="font-medium">{inscricao.data}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Status:</span>
                <Badge variant="secondary">{inscricao.status}</Badge>
              </div>
            </div>
          </div>

          <Separator />

          {/* Informações do haras e cavalo */}
          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Building2 className="h-4 w-4 text-primary" />
              Haras e Cavalo
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Haras:</span>
                <p className="font-medium flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {inscricao.haras}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">Cavalo:</span>
                <p className="font-medium">{inscricao.cavalo}</p>
              </div>
              <div className="col-span-2">
                <span className="text-muted-foreground">Registro do cavalo:</span>
                <p className="font-medium">{inscricao.registroCavalo}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Informações de pagamento */}
          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-primary" />
              Pagamento
            </h4>
            <div className="text-sm">
              <span className="text-muted-foreground">Valor pago:</span>
              <p className="text-2xl font-bold text-primary">{inscricao.valor}</p>
            </div>
          </div>

          {/* Botões de ação */}
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Fechar
            </Button>
            <Button 
              onClick={handleCheckin}
              variant={checkinRealizado ? "destructive" : "default"}
              className="gap-2"
            >
              {checkinRealizado ? (
                <>
                  <XCircle className="h-4 w-4" />
                  Cancelar Check-in
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4" />
                  Realizar Check-in
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

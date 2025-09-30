import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const CriarEventoModal = () => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Evento criado!",
      description: "Seu evento foi criado com sucesso.",
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Criar novo evento
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Criar Novo Evento
          </DialogTitle>
          <DialogDescription>
            Preencha as informações do seu evento
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome do Evento *</Label>
              <Input id="nome" placeholder="Ex: Vaquejada de Primavera 2025" required />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="data">Data do Evento *</Label>
                <Input id="data" type="date" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="horario">Horário *</Label>
                <Input id="horario" type="time" defaultValue="14:00" required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="local">Local *</Label>
              <Input id="local" placeholder="Nome do parque ou endereço completo" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea 
                id="descricao" 
                placeholder="Descreva detalhes do evento, premiação, categorias..." 
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="vagas">Vagas Totais *</Label>
                <Input id="vagas" type="number" placeholder="Ex: 200" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="valor">Valor da Inscrição (R$) *</Label>
                <Input id="valor" type="number" step="0.01" placeholder="Ex: 150.00" required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="categorias">Categorias *</Label>
              <Input 
                id="categorias" 
                placeholder="Separe por vírgula: Amador, Profissional, Aspirante" 
                required 
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="inscricao-inicio">Início das Inscrições *</Label>
                <Input id="inscricao-inicio" type="date" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="inscricao-fim">Fim das Inscrições *</Label>
                <Input id="inscricao-fim" type="date" required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="premiacao">Premiação</Label>
              <Textarea 
                id="premiacao" 
                placeholder="Descreva a premiação por categoria" 
                rows={3}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">Criar Evento</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

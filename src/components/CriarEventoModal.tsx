import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Plus, MapPin, FileText, Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { createEvent } from "@/lib/services/event.service";
import { EventStatusEnum } from "@/types/enums/api-enums";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BRstates } from "@/shared/br-states";

interface CriarEventoModalProps {
  onEventCreated?: () => void;
  trigger?: React.ReactNode;
}

export const CriarEventoModal = ({
  onEventCreated,
  trigger,
}: CriarEventoModalProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Estados para os campos do formulário baseados no DTO
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    city: "",
    state: "",
    startAt: "",
    endAt: "",
    purchaseClosedAt: "",
    status: EventStatusEnum.SCHEDULED,
    bannerUrl: "",
    isPublic: true,
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validações básicas
      if (!formData.name || formData.name.length < 3) {
        toast({
          title: "Nome muito curto",
          description: "O nome do evento deve ter pelo menos 3 caracteres",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      if (!formData.description) {
        toast({
          title: "Descrição obrigatória",
          description: "Por favor, adicione uma descrição para o evento",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      if (formData.description.length > 1000) {
        toast({
          title: "Descrição muito longa",
          description: "A descrição deve ter no máximo 1000 caracteres",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // Validar datas
      if (!formData.startAt || !formData.endAt || !formData.purchaseClosedAt) {
        toast({
          title: "Datas obrigatórias",
          description: "Por favor, preencha todas as datas",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      const startDate = new Date(formData.startAt);
      const endDate = new Date(formData.endAt);
      const purchaseClosedDate = new Date(formData.purchaseClosedAt);

      if (startDate >= endDate) {
        toast({
          title: "Datas inválidas",
          description: "A data de início deve ser anterior à data de término",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      if (purchaseClosedDate > endDate) {
        toast({
          title: "Data de inscrição inválida",
          description:
            "A data limite para inscrições não pode ser após o término do evento",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // Preparar dados para a API conforme o DTO
      const eventData = {
        name: formData.name,
        description: formData.description,
        address: formData.address || undefined,
        city: formData.city || undefined,
        state: formData.state || undefined,
        startAt: new Date(formData.startAt).toISOString(),
        endAt: new Date(formData.endAt).toISOString(),
        purchaseClosedAt: new Date(formData.purchaseClosedAt).toISOString(),
        status: formData.status,
        bannerUrl: formData.bannerUrl || undefined,
        isPublic: formData.isPublic,
        organizerId: "",
      };

      const token = localStorage.getItem("token");
      if (!token) {
        toast({
          title: "Não autenticado",
          description: "Por favor, faça login novamente",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      const response = await createEvent(eventData);

      if (response) {
        toast({
          title: "Evento criado com sucesso!",
          description: "Seu evento foi criado e está disponível.",
        });

        setOpen(false);
        resetForm();

        if (onEventCreated) {
          onEventCreated();
        }
      }
    } catch (error) {
      console.error("Erro ao criar evento:", error);

      let errorMessage = "Ocorreu um erro ao criar o evento. Tente novamente.";

      if (error.response?.message) {
        errorMessage = error.response.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast({
        title: "Erro ao criar evento",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      address: "",
      city: "",
      state: "",
      startAt: "",
      endAt: "",
      purchaseClosedAt: "",
      status: EventStatusEnum.SCHEDULED,
      bannerUrl: "",
      isPublic: true,
    });
  };

  const getMinDate = () => {
    return new Date().toISOString().split("T")[0];
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="rounded-xl bg-primary hover:bg-primary/90 flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Novo Evento
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Calendar className="h-5 w-5 text-primary" />
            Criar Novo Evento
          </DialogTitle>
          <DialogDescription>
            Preencha as informações do seu evento de vaquejada
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {/* Informações Básicas */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                Informações Básicas
              </h3>

              {/* Nome do Evento */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Nome do Evento *
                </Label>
                <Input
                  id="name"
                  placeholder="Ex: Vaquejada de Primavera 2024"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  required
                  minLength={3}
                  maxLength={200}
                  className="rounded-xl border-2 focus:border-primary/50"
                />
                <p className="text-xs text-muted-foreground">
                  Mínimo 3 caracteres, máximo 200 caracteres
                </p>
              </div>

              {/* Descrição */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium">
                  Descrição do Evento *
                </Label>
                <Textarea
                  id="description"
                  placeholder="Descreva detalhes do evento, estrutura, atrações, regras..."
                  rows={4}
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  required
                  maxLength={1000}
                  className="rounded-xl border-2 focus:border-primary/50"
                />
                <p className="text-xs text-muted-foreground">
                  {formData.description.length}/1000 caracteres
                </p>
              </div>

              {/* Banner URL */}
              <div className="space-y-2">
                <Label htmlFor="bannerUrl" className="text-sm font-medium">
                  URL do Banner (Opcional)
                </Label>
                <Input
                  id="bannerUrl"
                  type="url"
                  placeholder="https://exemplo.com/banner.jpg"
                  value={formData.bannerUrl}
                  onChange={(e) =>
                    handleInputChange("bannerUrl", e.target.value)
                  }
                  className="rounded-xl border-2 focus:border-primary/50"
                />
              </div>
            </div>

            {/* Localização */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                Localização
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="address" className="text-sm font-medium">
                    Endereço (Opcional)
                  </Label>
                  <Input
                    id="address"
                    placeholder="Rua, número, bairro"
                    value={formData.address}
                    onChange={(e) =>
                      handleInputChange("address", e.target.value)
                    }
                    maxLength={500}
                    className="rounded-xl border-2 focus:border-primary/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city" className="text-sm font-medium">
                    Cidade (Opcional)
                  </Label>
                  <Input
                    id="city"
                    placeholder="Nome da cidade"
                    value={formData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    maxLength={100}
                    className="rounded-xl border-2 focus:border-primary/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state" className="text-sm font-medium">
                    Estado (Opcional)
                  </Label>
                  <Select
                    value={formData.state}
                    onValueChange={(value) => handleInputChange("state", value)}
                  >
                    <SelectTrigger className="rounded-xl border-2 focus:border-primary/50">
                      <SelectValue placeholder="Selecione o estado" />
                    </SelectTrigger>
                    <SelectContent>
                      {BRstates.map((estado) => (
                        <SelectItem key={estado} value={estado}>
                          {estado}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Datas e Horários */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                Datas e Horários
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startAt" className="text-sm font-medium">
                    Data de Início *
                  </Label>
                  <Input
                    id="startAt"
                    type="datetime-local"
                    value={formData.startAt}
                    onChange={(e) =>
                      handleInputChange("startAt", e.target.value)
                    }
                    required
                    min={getMinDate()}
                    className="rounded-xl border-2 focus:border-primary/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endAt" className="text-sm font-medium">
                    Data de Término *
                  </Label>
                  <Input
                    id="endAt"
                    type="datetime-local"
                    value={formData.endAt}
                    onChange={(e) => handleInputChange("endAt", e.target.value)}
                    required
                    min={formData.startAt || getMinDate()}
                    className="rounded-xl border-2 focus:border-primary/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="purchaseClosedAt"
                    className="text-sm font-medium"
                  >
                    Fim das Inscrições *
                  </Label>
                  <Input
                    id="purchaseClosedAt"
                    type="datetime-local"
                    value={formData.purchaseClosedAt}
                    onChange={(e) =>
                      handleInputChange("purchaseClosedAt", e.target.value)
                    }
                    required
                    min={getMinDate()}
                    max={formData.endAt}
                    className="rounded-xl border-2 focus:border-primary/50"
                  />
                </div>
              </div>
            </div>

            {/* Configurações */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Globe className="h-4 w-4 text-primary" />
                Configurações
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status" className="text-sm font-medium">
                    Status do Evento *
                  </Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: EventStatusEnum) =>
                      handleInputChange("status", value)
                    }
                  >
                    <SelectTrigger className="rounded-xl border-2 focus:border-primary/50">
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={EventStatusEnum.SCHEDULED}>
                        Agendado
                      </SelectItem>
                      <SelectItem value={EventStatusEnum.LIVE}>
                        Ao Vivo
                      </SelectItem>
                      <SelectItem value={EventStatusEnum.CANCELLED}>
                        Cancelado
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="isPublic" className="text-sm font-medium">
                    Visibilidade *
                  </Label>
                  <Select
                    value={formData.isPublic ? "public" : "private"}
                    onValueChange={(value) =>
                      handleInputChange("isPublic", value === "public")
                    }
                  >
                    <SelectTrigger className="rounded-xl border-2 focus:border-primary/50">
                      <SelectValue placeholder="Selecione a visibilidade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Público</SelectItem>
                      <SelectItem value="private">Privado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setOpen(false);
                resetForm();
              }}
              className="rounded-xl border-2"
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-primary hover:bg-primary/90"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin mr-2" />
                  Criando...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Evento
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

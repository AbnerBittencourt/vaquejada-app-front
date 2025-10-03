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
import { Calendar, Plus, MapPin, DollarSign, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { createEvent } from "@/lib/services/event.service";
import { EventStatusEnum, CategoryNameEnum } from "@/types/enums/api-enums";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CriarEventoModalProps {
  onEventCreated?: () => void;
}

export const CriarEventoModal = ({ onEventCreated }: CriarEventoModalProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Estados para os campos do formulário
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    city: "",
    state: "",
    startAt: "",
    endAt: "",
    purchaseStartAt: "",
    purchaseClosedAt: "",
    price: "",
    totalSpots: "",
    categories: [] as CategoryNameEnum[],
    status: EventStatusEnum.SCHEDULED,
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCategoryChange = (categories: CategoryNameEnum[]) => {
    setFormData((prev) => ({
      ...prev,
      categories,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Preparar dados para a API
      const eventData = {
        name: formData.name,
        description: formData.description,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        startAt: new Date(`${formData.startAt}T14:00:00`).toISOString(),
        endAt: new Date(`${formData.endAt}T23:59:59`).toISOString(),
        purchaseClosedAt: new Date(
          `${formData.purchaseClosedAt}T23:59:59`
        ).toISOString(),
        status: formData.status,
        isPublic: true, // ou false, conforme desejado
        organizerId: localStorage.getItem("organizerId") || "", // ajuste conforme sua lógica de autenticação
      };

      await createEvent(eventData);

      toast({
        title: "Evento criado com sucesso!",
        description: "Seu evento foi criado e está aguardando aprovação.",
      });

      setOpen(false);

      // Limpar formulário
      setFormData({
        name: "",
        description: "",
        address: "",
        city: "",
        state: "",
        startAt: "",
        endAt: "",
        purchaseStartAt: "",
        purchaseClosedAt: "",
        price: "",
        totalSpots: "",
        categories: [],
        status: EventStatusEnum.SCHEDULED,
      });

      if (onEventCreated) {
        onEventCreated();
      }
    } catch (error) {
      console.error("Erro ao criar evento:", error);
      toast({
        title: "Erro ao criar evento",
        description: "Ocorreu um erro ao criar o evento. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const categoriasDisponiveis = [
    { value: CategoryNameEnum.AMATEUR, label: "Amador" },
    { value: CategoryNameEnum.PROFESSIONAL, label: "Profissional" },
    { value: CategoryNameEnum.MASTER, label: "Master" },
    { value: CategoryNameEnum.FEMALE, label: "Feminino" },
    { value: CategoryNameEnum.JUNIOR, label: "Júnior" },
    { value: CategoryNameEnum.INTERMEDIARY, label: "Intermediário" },
    { value: CategoryNameEnum.DERBY, label: "Derby" },
    { value: CategoryNameEnum.ASPIRANT, label: "Aspirante" },
    { value: CategoryNameEnum.YOUNG, label: "Jovem" },
  ];

  const estadosBrasil = [
    "AC",
    "AL",
    "AP",
    "AM",
    "BA",
    "CE",
    "DF",
    "ES",
    "GO",
    "MA",
    "MT",
    "MS",
    "MG",
    "PA",
    "PB",
    "PR",
    "PE",
    "PI",
    "RJ",
    "RN",
    "RS",
    "RO",
    "RR",
    "SC",
    "SP",
    "SE",
    "TO",
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 rounded-xl bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4" />
          Criar novo evento
        </Button>
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
            {/* Nome do Evento */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Nome do Evento *
              </Label>
              <Input
                id="name"
                placeholder="Ex: Vaquejada de Primavera 2025"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                required
                className="rounded-xl border-2 focus:border-primary/50"
              />
            </div>

            {/* Descrição */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">
                Descrição do Evento
              </Label>
              <Textarea
                id="description"
                placeholder="Descreva detalhes do evento, estrutura, atrações..."
                rows={3}
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                className="rounded-xl border-2 focus:border-primary/50"
              />
            </div>

            {/* Localização */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="address" className="text-sm font-medium">
                  Endereço *
                </Label>
                <Input
                  id="address"
                  placeholder="Rua, número, bairro"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  required
                  className="rounded-xl border-2 focus:border-primary/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city" className="text-sm font-medium">
                  Cidade *
                </Label>
                <Input
                  id="city"
                  placeholder="Nome da cidade"
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  required
                  className="rounded-xl border-2 focus:border-primary/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="state" className="text-sm font-medium">
                  Estado *
                </Label>
                <Select
                  value={formData.state}
                  onValueChange={(value) => handleInputChange("state", value)}
                >
                  <SelectTrigger className="rounded-xl border-2 focus:border-primary/50">
                    <SelectValue placeholder="Selecione o estado" />
                  </SelectTrigger>
                  <SelectContent>
                    {estadosBrasil.map((estado) => (
                      <SelectItem key={estado} value={estado}>
                        {estado}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Datas do Evento */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startAt" className="text-sm font-medium">
                  Data de Início *
                </Label>
                <Input
                  id="startAt"
                  type="date"
                  value={formData.startAt}
                  onChange={(e) => handleInputChange("startAt", e.target.value)}
                  required
                  className="rounded-xl border-2 focus:border-primary/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endAt" className="text-sm font-medium">
                  Data de Término *
                </Label>
                <Input
                  id="endAt"
                  type="date"
                  value={formData.endAt}
                  onChange={(e) => handleInputChange("endAt", e.target.value)}
                  required
                  className="rounded-xl border-2 focus:border-primary/50"
                />
              </div>
            </div>

            {/* Período de Inscrições */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="purchaseStartAt"
                  className="text-sm font-medium"
                >
                  Início das Inscrições *
                </Label>
                <Input
                  id="purchaseStartAt"
                  type="date"
                  value={formData.purchaseStartAt}
                  onChange={(e) =>
                    handleInputChange("purchaseStartAt", e.target.value)
                  }
                  required
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
                  type="date"
                  value={formData.purchaseClosedAt}
                  onChange={(e) =>
                    handleInputChange("purchaseClosedAt", e.target.value)
                  }
                  required
                  className="rounded-xl border-2 focus:border-primary/50"
                />
              </div>
            </div>

            {/* Preço e Vagas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price" className="text-sm font-medium">
                  Valor da Inscrição (R$) *
                </Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  placeholder="Ex: 150.00"
                  value={formData.price}
                  onChange={(e) => handleInputChange("price", e.target.value)}
                  required
                  className="rounded-xl border-2 focus:border-primary/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="totalSpots" className="text-sm font-medium">
                  Vagas Totais *
                </Label>
                <Input
                  id="totalSpots"
                  type="number"
                  placeholder="Ex: 200"
                  value={formData.totalSpots}
                  onChange={(e) =>
                    handleInputChange("totalSpots", e.target.value)
                  }
                  required
                  className="rounded-xl border-2 focus:border-primary/50"
                />
              </div>
            </div>

            {/* Categorias */}
            <div className="space-y-2">
              <Label htmlFor="categories" className="text-sm font-medium">
                Categorias Disponíveis *
              </Label>
              <Select
                onValueChange={(value: CategoryNameEnum) => {
                  if (!formData.categories.includes(value)) {
                    handleCategoryChange([...formData.categories, value]);
                  }
                }}
              >
                <SelectTrigger className="rounded-xl border-2 focus:border-primary/50">
                  <SelectValue placeholder="Selecione as categorias" />
                </SelectTrigger>
                <SelectContent>
                  {categoriasDisponiveis.map((categoria) => (
                    <SelectItem
                      key={categoria.value}
                      value={categoria.value}
                      disabled={formData.categories.includes(categoria.value)}
                    >
                      {categoria.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Categorias selecionadas */}
              {formData.categories.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.categories.map((categoria) => {
                    const categoriaInfo = categoriasDisponiveis.find(
                      (c) => c.value === categoria
                    );
                    return (
                      <div
                        key={categoria}
                        className="flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                      >
                        <span>{categoriaInfo?.label}</span>
                        <button
                          type="button"
                          onClick={() =>
                            handleCategoryChange(
                              formData.categories.filter((c) => c !== categoria)
                            )
                          }
                          className="ml-1 hover:text-destructive"
                        >
                          ×
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="rounded-xl border-2"
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

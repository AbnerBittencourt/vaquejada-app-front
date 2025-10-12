import { useState, useRef } from "react";
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
import {
  Calendar,
  Plus,
  MapPin,
  FileText,
  Globe,
  Upload,
  X,
  Image,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  createEventWithBanner,
  createEvent,
} from "@/lib/services/event.service";
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
  const [uploadingImage, setUploadingImage] = useState(false);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Estados para os campos do formulário
  const [formData, setFormData] = useState({
    name: "",
    prize: "",
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

  const [selectedImage, setSelectedImage] = useState<{
    file: File;
    preview: string;
  } | null>(null);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validações da imagem
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Arquivo inválido",
        description: "Por favor, selecione uma imagem válida",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      // 5MB
      toast({
        title: "Imagem muito grande",
        description: "A imagem deve ter no máximo 5MB",
        variant: "destructive",
      });
      return;
    }

    // Verificar dimensões da imagem
    const img = document.createElement("img");
    img.onload = () => {
      const isPortrait = img.height > img.width;
      if (!isPortrait) {
        toast({
          title: "Imagem inadequada",
          description: "O banner deve estar em formato retrato (vertical)",
          variant: "destructive",
        });
        return;
      }

      // Criar preview e salvar arquivo
      const previewUrl = URL.createObjectURL(file);
      setSelectedImage({
        file,
        preview: previewUrl,
      });

      // Limpar o input file
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    };
    img.onerror = () => {
      toast({
        title: "Erro na imagem",
        description: "Não foi possível carregar a imagem selecionada",
        variant: "destructive",
      });
    };
    img.src = URL.createObjectURL(file);
  };

  const removeSelectedImage = () => {
    if (selectedImage?.preview) {
      URL.revokeObjectURL(selectedImage.preview);
    }
    setSelectedImage(null);
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

      let response;

      if (selectedImage) {
        setUploadingImage(true);

        const formDataToSend = new FormData();

        formDataToSend.append("name", formData.name);
        formDataToSend.append("description", formData.description);
        formDataToSend.append(
          "startAt",
          new Date(formData.startAt).toISOString()
        );
        formDataToSend.append("endAt", new Date(formData.endAt).toISOString());
        formDataToSend.append(
          "purchaseClosedAt",
          new Date(formData.purchaseClosedAt).toISOString()
        );
        formDataToSend.append("status", formData.status);
        formDataToSend.append("isPublic", formData.isPublic.toString());

        if (formData.prize) {
          formDataToSend.append(
            "prize",
            formData.prize.replace(/[^\d,]/g, "").replace(",", ".")
          );
        }
        if (formData.address)
          formDataToSend.append("address", formData.address);
        if (formData.city) formDataToSend.append("city", formData.city);
        if (formData.state) formDataToSend.append("state", formData.state);

        formDataToSend.append("banner", selectedImage.file);

        response = await createEventWithBanner(formDataToSend);
      } else {
        const eventData = {
          name: formData.name,
          description: formData.description,
          prize: formData.prize
            ? formData.prize.replace(/[^\d,]/g, "").replace(",", ".")
            : undefined,
          address: formData.address || undefined,
          city: formData.city || undefined,
          state: formData.state || undefined,
          startAt: new Date(formData.startAt).toISOString(),
          endAt: new Date(formData.endAt).toISOString(),
          purchaseClosedAt: new Date(formData.purchaseClosedAt).toISOString(),
          status: formData.status,
          isPublic: formData.isPublic,
        };

        response = await createEvent(eventData);
      }

      if (response) {
        toast({
          title: "Evento criado com sucesso!",
          description: selectedImage
            ? "Banner enviado e evento criado."
            : "Seu evento foi criado.",
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

      if (error.response?.status === 413) {
        errorMessage =
          "Arquivo de imagem muito grande. Tente uma imagem menor.";
      } else if (error.response?.status === 415) {
        errorMessage = "Tipo de arquivo não suportado. Use JPG, PNG ou WEBP.";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
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
      setUploadingImage(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      prize: "",
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

    if (selectedImage?.preview) {
      URL.revokeObjectURL(selectedImage.preview);
    }
    setSelectedImage(null);
  };

  const getMinDate = () => {
    return new Date().toISOString().split("T")[0];
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
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

              <div className="space-y-2">
                <Label htmlFor="prize" className="text-sm font-medium">
                  Premiação
                </Label>
                <Input
                  id="prize"
                  placeholder="Ex: R$ 10.000,00"
                  value={formData.prize}
                  onChange={(e) => {
                    let value = e.target.value.replace(/\D/g, "");
                    value = (Number(value) / 100).toFixed(2);
                    const masked = value
                      .replace(".", ",")
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
                    handleInputChange("prize", masked ? `R$ ${masked}` : "");
                  }}
                  minLength={3}
                  maxLength={200}
                  className="rounded-xl border-2 focus:border-primary/50"
                  inputMode="numeric"
                />
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

              {/* Upload de Banner - AJUSTADO PARA PORTRAIT */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">
                  Banner do Evento (Opcional)
                </Label>
                <p className="text-xs text-muted-foreground">
                  Formato retrato recomendado • PNG, JPG, WEBP até 5MB
                </p>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageSelect}
                  accept="image/*"
                  className="hidden"
                />

                {selectedImage ? (
                  <div className="relative group">
                    <div className="border-2 border-dashed border-primary/20 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-green-600 flex items-center gap-2">
                          <Image className="h-4 w-4" />
                          Imagem selecionada (Retrato)
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={removeSelectedImage}
                          className="h-8 w-8 p-0 hover:bg-destructive/10"
                        >
                          <X className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                      {/* Container portrait menor */}
                      <div className="flex justify-center">
                        <div className="relative w-48 h-64 bg-muted rounded-lg overflow-hidden border-2">
                          <img
                            src={selectedImage.preview}
                            alt="Preview do banner"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2 text-center">
                        {selectedImage.file.name} •{" "}
                        {(selectedImage.file.size / 1024 / 1024).toFixed(2)}MB
                      </p>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={triggerFileInput}
                    className="border-2 border-dashed border-muted-foreground/25 rounded-xl p-6 text-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors group"
                  >
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <Upload className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">
                          Clique para fazer upload do banner
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Formato retrato • PNG, JPG, WEBP até 5MB
                        </p>
                      </div>
                      {/* Preview do formato portrait */}
                      <div className="flex items-center justify-center gap-4 mt-2">
                        <div className="flex flex-col items-center gap-1">
                          <div className="w-16 h-20 border-2 border-dashed border-muted-foreground/30 rounded-lg flex items-center justify-center">
                            <div className="w-8 h-10 bg-primary/10 rounded" />
                          </div>
                          <span className="text-xs text-muted-foreground">
                            Recomendado
                          </span>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                          <div className="w-20 h-16 border border-muted-foreground/20 rounded-lg flex items-center justify-center">
                            <div className="w-10 h-8 bg-muted rounded" />
                          </div>
                          <span className="text-xs text-muted-foreground">
                            Paisagem
                          </span>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="rounded-lg mt-2"
                      >
                        Selecionar Imagem
                      </Button>
                    </div>
                  </div>
                )}

                {/* Campo de URL manual (fallback) */}
                {!selectedImage && (
                  <div className="space-y-2 pt-2">
                    <Label htmlFor="bannerUrl" className="text-sm font-medium">
                      Ou insira a URL do Banner (Opcional)
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
                )}
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
              disabled={loading || uploadingImage}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading || uploadingImage}
              className="rounded-xl bg-primary hover:bg-primary/90"
            >
              {loading || uploadingImage ? (
                <>
                  <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin mr-2" />
                  {uploadingImage ? "Enviando imagem..." : "Criando..."}
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

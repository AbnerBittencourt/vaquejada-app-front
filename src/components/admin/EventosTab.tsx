import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Calendar,
  Loader2,
  Search,
  MapPin,
  Pen,
  Plus,
  Trash2,
  Upload,
  Image,
  ImageOff,
  X,
} from "lucide-react";
import { ListEventResponse } from "@/types/api";
import React, { useState, useRef } from "react";
import { formatCurrency, formatDate } from "@/utils/format-data.util";
import { EventStatusEnum } from "@/types/enums/api-enums";
import { CriarEventoModal } from "../CriarEventoModal";
import { getCategoryNameMap, getEventStatusMap } from "@/types/enums/enum-maps";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  createEventCategory,
  deleteEventCategory,
  getEventCategories,
  updateEvent,
  updateEventCategory,
  uploadEventBanner,
  deleteEventBanner,
} from "@/lib/services/event.service";
import { CategoryNameEnum } from "@/types/enums/api-enums";
import { listCategories } from "@/lib/services/category.service";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { BRstates } from "@/shared/br-states";
import { CreateEventDto } from "@/types/dtos/event.dto";

interface EventosTabProps {
  eventos: ListEventResponse[];
  loading: boolean;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  filtro: string;
  onFiltroChange: (value: string) => void;
  filtroStatus: string;
  onFiltroStatusChange: (value: string) => void;
  filtroCidade: string;
  onFiltroCidadeChange: (value: string) => void;
  filtroEstado: string;
  onFiltroEstadoChange: (value: string) => void;
  totalEventos: number;
  cidadesUnicas: string[];
  estadosUnicos: string[];
  statusUnicos: string[];
  onEventCreated?: () => void;
}

interface CategoriaForm {
  id?: string;
  categoryId: string;
  price: string;
  maxRunners: string;
  passwordLimit: string;
  initialPassword: string;
  finalPassword: string;
  startAt: string;
  endAt: string;
  currentRunners?: number;
  isActive?: boolean;
  category?: {
    id: string;
    name: string;
    description: string;
    rules: string | null;
    isActive: boolean;
  };
}

interface EventFormData {
  name: string;
  startAt: string;
  endAt: string;
  purchaseClosedAt: string;
  prize: string;
  address: string;
  city: string;
  state: string;
  description: string;
  isActive: boolean;
  bannerUrl?: string;
}

interface SelectedImage {
  file: File;
  preview: string;
}

export const EventosTab: React.FC<EventosTabProps> = ({
  eventos,
  loading,
  page,
  totalPages,
  onPageChange,
  filtro,
  onFiltroChange,
  filtroStatus,
  onFiltroStatusChange,
  filtroCidade,
  onFiltroCidadeChange,
  filtroEstado,
  onFiltroEstadoChange,
  totalEventos,
  cidadesUnicas,
  estadosUnicos,
  statusUnicos,
  onEventCreated,
}) => {
  const { toast } = useToast();
  const [editingEvent, setEditingEvent] = useState<ListEventResponse | null>(
    null
  );
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [categoriasDoEvento, setCategoriasDoEvento] = useState<CategoriaForm[]>(
    []
  );
  const [loadingEvent, setLoadingEvent] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [selectedImage, setSelectedImage] = useState<SelectedImage | null>(
    null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<EventFormData>({
    name: "",
    prize: "",
    startAt: "",
    endAt: "",
    purchaseClosedAt: "",
    address: "",
    city: "",
    state: "",
    description: "",
    isActive: true,
    bannerUrl: "",
  });

  const [categoriasDoEventoDisponiveis, setCategoriasDoEventoDisponiveis] =
    useState<{ id: string; name: string }[]>([]);

  React.useEffect(() => {
    const fetchCategoriasDoEventoDisponiveis = async () => {
      try {
        const response = await listCategories();
        if (response.data && Array.isArray(response.data)) {
          setCategoriasDoEventoDisponiveis(
            response.data.map((cat) => ({
              id: cat.category?.id || cat.id,
              name: getCategoryNameMap(cat.name as CategoryNameEnum),
            }))
          );
        }
      } catch (err) {
        console.error("Erro ao buscar categoriasDoEvento disponíveis:", err);
        setCategoriasDoEventoDisponiveis([]);
      }
    };
    fetchCategoriasDoEventoDisponiveis();
  }, []);

  const getStatusColor = (status: EventStatusEnum) => {
    switch (status) {
      case EventStatusEnum.SCHEDULED:
        return "bg-green-500";
      case EventStatusEnum.LIVE:
        return "bg-yellow-500";
      case EventStatusEnum.CANCELLED:
        return "bg-red-500";
      case EventStatusEnum.FINISHED:
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  const handleInputChange = (field: keyof EventFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleEditEvent = async (evento: ListEventResponse) => {
    try {
      setLoadingEvent(true);
      setEditingEvent(evento);
      setIsEditModalOpen(true);
      setSelectedImage(null);

      setFormData({
        name: evento.name || "",
        prize: evento.prize ? formatCurrency(evento.prize) : "",
        startAt: evento.startAt
          ? new Date(evento.startAt).toISOString().split("T")[0]
          : "",
        endAt: evento.endAt
          ? new Date(evento.endAt).toISOString().split("T")[0]
          : "",
        purchaseClosedAt: evento.purchaseClosedAt
          ? new Date(evento.purchaseClosedAt).toISOString().split("T")[0]
          : "",
        address: evento.address || "",
        city: evento.city || "",
        state: evento.state || "",
        description: evento.description || "",
        isActive: evento.isActive || false,
        bannerUrl: evento.bannerUrl || "",
      });

      const response = await getEventCategories(evento.id);

      if (response.data && Array.isArray(response.data)) {
        const categoriasDoEventoMapeadas = response.data.map((cat) => ({
          id: cat.id,
          categoryId: cat.category?.id || "",
          price: cat.price?.toString() || "",
          maxRunners: cat.maxRunners?.toString() || "",
          startAt: cat.startAt
            ? new Date(cat.startAt).toISOString().split("T")[0]
            : "",
          endAt: cat.endAt
            ? new Date(cat.endAt).toISOString().split("T")[0]
            : "",
          currentRunners: cat.currentRunners || 0,
          passwordLimit: cat.passwordLimit || 0,
          isActive: cat.isActive || false,
          category: cat.category,
          initialPassword: cat.initialPassword || 0,
          finalPassword: cat.finalPassword || 0,
        }));
        setCategoriasDoEvento(categoriasDoEventoMapeadas);
      } else {
        setCategoriasDoEvento([]);
      }
    } catch (err) {
      console.error("Erro ao carregar evento:", err);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados do evento",
        variant: "destructive",
      });
      setCategoriasDoEvento([]);
    } finally {
      setLoadingEvent(false);
    }
  };

  // Funções para manipulação do banner
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validar tipo de arquivo
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Erro",
          description: "Por favor, selecione um arquivo de imagem válido",
          variant: "destructive",
        });
        return;
      }

      // Validar tamanho do arquivo (5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Erro",
          description: "A imagem deve ter no máximo 5MB",
          variant: "destructive",
        });
        return;
      }

      const preview = URL.createObjectURL(file);
      setSelectedImage({ file, preview });
    }
  };

  const removeSelectedImage = () => {
    if (selectedImage?.preview) {
      URL.revokeObjectURL(selectedImage.preview);
    }
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveBanner = async () => {
    if (!editingEvent?.id) return;

    try {
      setUploadingImage(true);
      await deleteEventBanner(editingEvent.id);

      setFormData((prev) => ({ ...prev, bannerUrl: "" }));
      toast({
        title: "Sucesso",
        description: "Banner removido com sucesso!",
      });
    } catch (err) {
      console.error("Erro ao remover banner:", err);
      toast({
        title: "Erro",
        description: "Não foi possível remover o banner",
        variant: "destructive",
      });
    } finally {
      setUploadingImage(false);
    }
  };

  const uploadBanner = async (): Promise<string | null> => {
    if (!selectedImage || !editingEvent?.id) return null;

    try {
      setUploadingImage(true);
      const formData = new FormData();
      formData.append("banner", selectedImage.file);

      const response = await uploadEventBanner(editingEvent.id, formData);

      toast({
        title: "Sucesso",
        description: "Banner atualizado com sucesso!",
      });

      return response.url || null;
    } catch (err) {
      console.error("Erro ao fazer upload do banner:", err);
      toast({
        title: "Erro",
        description: "Não foi possível fazer upload do banner",
        variant: "destructive",
      });
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

  const addCategoria = () => {
    setCategoriasDoEvento((prev) => [
      ...prev,
      {
        categoryId: "",
        price: "",
        maxRunners: "",
        passwordLimit: "",
        initialPassword: "",
        finalPassword: "",
        startAt: "",
        endAt: "",
      },
    ]);
  };

  const removeCategoria = async (index: number) => {
    const categoria = categoriasDoEvento[index];

    if (categoria.id && editingEvent?.id) {
      try {
        await deleteEventCategory(editingEvent.id, categoria.id);
        toast({
          title: "Sucesso",
          description: "Categoria removida com sucesso!",
        });
      } catch (err) {
        console.error("Erro ao remover categoria:", err);
        toast({
          title: "Erro",
          description: "Não foi possível remover a categoria",
          variant: "destructive",
        });
        return;
      }
    }

    setCategoriasDoEvento((prev) => prev.filter((_, i) => i !== index));
  };

  const updateCategoria = (
    index: number,
    field: keyof CategoriaForm,
    value: string
  ) => {
    setCategoriasDoEvento((prev) =>
      prev.map((cat, i) => (i === index ? { ...cat, [field]: value } : cat))
    );
  };

  const handleSaveEvent = async () => {
    try {
      let bannerUrl = formData.bannerUrl;

      // Upload do novo banner se houver imagem selecionada
      if (selectedImage) {
        const newBannerUrl = await uploadBanner();
        if (newBannerUrl) {
          bannerUrl = newBannerUrl;
        }
      }

      const updatedData: CreateEventDto = {
        name: formData.name,
        startAt: formData.startAt,
        endAt: formData.endAt,
        purchaseClosedAt: formData.purchaseClosedAt,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        description: formData.description,
        bannerUrl: bannerUrl,
      };

      await updateEvent(editingEvent!.id, updatedData);

      // Processar categorias
      for (const categoria of categoriasDoEvento) {
        const eventCategoryData = {
          eventId: editingEvent!.id,
          categoryId: categoria.categoryId,
          price: Number(categoria.price),
          startAt: categoria.startAt,
          endAt: categoria.endAt,
          maxRunners: Number(categoria.maxRunners),
          passwordLimit: Number(categoria.passwordLimit),
          initialPassword: Number(categoria.initialPassword),
          finalPassword: Number(categoria.finalPassword),
        };

        if (categoria.id) {
          await updateEventCategory(categoria.id, eventCategoryData);
        } else {
          await createEventCategory(eventCategoryData);
        }
      }

      toast({
        title: "Sucesso",
        description: "Evento atualizado com sucesso!",
      });

      setIsEditModalOpen(false);
      setEditingEvent(null);
      setCategoriasDoEvento([]);
      setSelectedImage(null);
      setFormData({
        name: "",
        prize: "",
        startAt: "",
        endAt: "",
        purchaseClosedAt: "",
        address: "",
        city: "",
        state: "",
        description: "",
        isActive: true,
        bannerUrl: "",
      });

      // Limpar o input de arquivo
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      console.error("Erro ao atualizar evento:", err);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o evento",
        variant: "destructive",
      });
    }
  };

  // Função para obter o nome amigável da categoria
  const getCategoriaDisplayName = (categoria: CategoriaForm) => {
    if (categoria.category?.name) {
      return (
        getCategoryNameMap(categoria.category.name as CategoryNameEnum) ||
        categoria.category.name
      );
    }
    return `Categoria`;
  };

  return (
    <>
      <Card className="bg-card/80 backdrop-blur-sm border-2">
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <div>
              <CardTitle className="text-2xl bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Eventos
              </CardTitle>
              <CardDescription className="text-base">
                {totalEventos}{" "}
                {totalEventos === 1
                  ? "evento encontrado"
                  : "eventos encontrados"}
              </CardDescription>
            </div>
            <CriarEventoModal onEventCreated={onEventCreated} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar eventos por nome..."
                value={filtro}
                onChange={(e) => onFiltroChange(e.target.value)}
                className="pl-10 rounded-xl border-2 focus:border-primary/50 bg-background/50"
              />
            </div>

            <select
              value={filtroStatus}
              onChange={(e) => onFiltroStatusChange(e.target.value)}
              className="rounded-xl border-2 focus:border-primary/50 bg-background/50 px-4 py-2"
            >
              <option value="todos">Todos</option>
              {statusUnicos.map((status) => (
                <option key={status} value={status}>
                  {getEventStatusMap(status as EventStatusEnum)}
                </option>
              ))}
            </select>

            <select
              value={filtroCidade}
              onChange={(e) => onFiltroCidadeChange(e.target.value)}
              className="rounded-xl border-2 focus:border-primary/50 bg-background/50 px-4 py-2"
            >
              <option value="todos">Todas as cidades</option>
              {cidadesUnicas.map((cidade) => (
                <option key={cidade} value={cidade}>
                  {cidade}
                </option>
              ))}
            </select>

            <select
              value={filtroEstado}
              onChange={(e) => onFiltroEstadoChange(e.target.value)}
              className="rounded-xl border-2 focus:border-primary/50 bg-background/50 px-4 py-2"
            >
              <option value="todos">Todos os estados</option>
              {estadosUnicos.map((estado) => (
                <option key={estado} value={estado}>
                  {estado}
                </option>
              ))}
            </select>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-12 text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                <p className="text-lg font-medium">Carregando eventos...</p>
              </div>
            ) : eventos.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">Nenhum evento encontrado</p>
                <p className="text-sm">Crie seu primeiro evento para começar</p>
              </div>
            ) : (
              eventos.map((evento) => (
                <Card
                  key={evento.id}
                  className="bg-card/80 backdrop-blur-sm border-2 hover:shadow-lg transition-all"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                          <Calendar className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-xl mb-2">
                            {evento.name}
                          </CardTitle>
                          <CardDescription className="flex items-center gap-2 mb-2">
                            <Calendar className="h-4 w-4" />
                            {formatDate(evento.startAt)}
                            {evento.endAt && (
                              <>
                                <span>até</span>
                                {formatDate(evento.endAt)}
                              </>
                            )}
                          </CardDescription>
                          {evento.address && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <MapPin className="h-4 w-4" />
                              <span>
                                {evento.address}, {evento.city} - {evento.state}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-3 h-3 rounded-full ${getStatusColor(
                              evento.status
                            )}`}
                          ></div>
                          <span className="text-sm text-muted-foreground">
                            {getEventStatusMap(evento.status)}
                          </span>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-xl"
                          onClick={() => handleEditEvent(evento)}
                        >
                          <Pen className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))
            )}
          </div>

          {/* Paginação */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-6 pt-4 border-t">
              <div className="text-sm text-muted-foreground">
                Página {page} de {totalPages}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 1}
                  onClick={() => onPageChange(page - 1)}
                  className="rounded-xl"
                >
                  Anterior
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === totalPages}
                  onClick={() => onPageChange(page + 1)}
                  className="rounded-xl"
                >
                  Próxima
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de Edição */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              Editar Evento: {editingEvent?.name}
            </DialogTitle>
            <DialogDescription>
              Atualize as informações do evento e gerencie as categorias
            </DialogDescription>
          </DialogHeader>

          {loadingEvent ? (
            <div className="text-center py-8">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p>Carregando dados do evento...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* ✅ SEÇÃO DE BANNER */}
              <Card>
                <CardHeader>
                  <CardTitle>Banner do Evento</CardTitle>
                  <DialogDescription>
                    Atualize a imagem do banner do evento
                  </DialogDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col md:flex-row gap-6 items-start">
                    {/* Preview do Banner Atual */}
                    <div className="flex-1">
                      <Label className="text-sm font-medium mb-3 block">
                        Banner Atual
                      </Label>
                      <div className="relative h-48 w-full md:w-64 overflow-hidden rounded-lg border-2 bg-muted">
                        {formData.bannerUrl ? (
                          <>
                            <img
                              src={formData.bannerUrl}
                              alt={`Banner atual do evento ${formData.name}`}
                              className="w-full h-full object-cover"
                            />
                            {/* Badge indicando banner atual */}
                            <div className="absolute top-2 left-2">
                              <Badge variant="secondary" className="text-xs">
                                Atual
                              </Badge>
                            </div>
                          </>
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-primary/15 to-secondary/15 flex items-center justify-center">
                            <div className="text-center">
                              <ImageOff className="h-12 w-12 text-primary/30 mx-auto mb-2" />
                              <p className="text-xs text-primary/50 font-medium">
                                Sem banner
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Upload de Novo Banner */}
                    {/* <div className="flex-1 space-y-4">
                      <Label className="text-sm font-medium">
                        Novo Banner (Opcional)
                      </Label>

                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageSelect}
                        accept="image/*"
                        className="hidden"
                      />

                      {selectedImage ? (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-green-600 flex items-center gap-2">
                              <Image className="h-4 w-4" />
                              Nova imagem selecionada
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

                          <div className="relative h-32 w-full overflow-hidden rounded-lg border-2">
                            <img
                              src={selectedImage.preview}
                              alt="Preview do novo banner"
                              className="w-full h-full object-cover"
                            />
                          </div>

                          <p className="text-xs text-muted-foreground">
                            {selectedImage.file.name} •
                            {(selectedImage.file.size / 1024 / 1024).toFixed(2)}
                            MB
                          </p>

                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={removeSelectedImage}
                            className="w-full"
                          >
                            Remover Nova Imagem
                          </Button>
                        </div>
                      ) : (
                        <div
                          onClick={triggerFileInput}
                          className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors group"
                        >
                          <div className="flex flex-col items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                              <Upload className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium text-sm">
                                Clique para selecionar novo banner
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                PNG, JPG, WEBP até 5MB
                              </p>
                            </div>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="rounded-lg"
                            >
                              Selecionar Imagem
                            </Button>
                          </div>
                        </div>
                      )} */}

                    {/* Opção para remover banner existente */}
                    {/* {formData.bannerUrl && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleRemoveBanner}
                          className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <X className="h-4 w-4 mr-2" />
                          Remover Banner Atual
                        </Button>
                      )}
                    </div> */}
                  </div>
                </CardContent>
              </Card>

              {/* Informações do Evento */}
              <Card>
                <CardHeader>
                  <CardTitle>Informações do Evento</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="eventName">Nome do Evento</Label>
                      <Input
                        id="eventName"
                        value={formData.name}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                        placeholder="Nome do evento"
                        className="bg-background"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="eventPrize">Premiação (R$)</Label>
                      <Input
                        id="eventPrize"
                        type="number"
                        value={formData.prize}
                        onChange={(e) =>
                          handleInputChange("prize", e.target.value)
                        }
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                        className="bg-background"
                        onBlur={(e) => {
                          if (e.target.value) {
                            const value = Number(e.target.value).toFixed(2);
                            handleInputChange("prize", value);
                          }
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="eventStart">Data de Início</Label>
                      <Input
                        id="eventStart"
                        type="date"
                        value={formData.startAt}
                        onChange={(e) =>
                          handleInputChange("startAt", e.target.value)
                        }
                        className="bg-background"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="eventEnd">Data de Término</Label>
                      <Input
                        id="eventEnd"
                        type="date"
                        value={formData.endAt}
                        onChange={(e) =>
                          handleInputChange("endAt", e.target.value)
                        }
                        className="bg-background"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="eventPurchaseClosedAt">
                        Data de Fechamento de Vendas
                      </Label>
                      <Input
                        id="eventPurchaseClosedAt"
                        type="date"
                        value={formData.purchaseClosedAt}
                        onChange={(e) =>
                          handleInputChange("purchaseClosedAt", e.target.value)
                        }
                        className="bg-background"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="eventAddress">Endereço</Label>
                      <Input
                        id="eventAddress"
                        type="text"
                        value={formData.address}
                        onChange={(e) =>
                          handleInputChange("address", e.target.value)
                        }
                        placeholder="Endereço completo"
                        className="bg-background"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="eventCity">Cidade</Label>
                      <Input
                        id="eventCity"
                        type="text"
                        value={formData.city}
                        onChange={(e) =>
                          handleInputChange("city", e.target.value)
                        }
                        placeholder="Cidade"
                        className="bg-background"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state" className="text-sm font-medium">
                        Estado
                      </Label>
                      <Select
                        value={formData.state}
                        onValueChange={(value) =>
                          handleInputChange("state", value)
                        }
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
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="eventDescription">Descrição</Label>
                      <textarea
                        id="eventDescription"
                        value={formData.description}
                        onChange={(e) =>
                          handleInputChange("description", e.target.value)
                        }
                        placeholder="Descrição detalhada do evento"
                        rows={4}
                        className="w-full rounded-lg border-2 px-3 py-2 bg-background resize-none"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Categorias do Evento */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Categorias do Evento</CardTitle>
                    <Button onClick={addCategoria} className="gap-2">
                      <Plus className="h-4 w-4" />
                      Adicionar Categoria
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {categoriasDoEvento.map((categoria, index) => (
                    <Card key={index} className="p-4 border-2">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="font-semibold">
                            {getCategoriaDisplayName(categoria)}
                          </h4>
                          {categoria.currentRunners !== undefined && (
                            <p className="text-sm text-muted-foreground">
                              {categoria.currentRunners} /{" "}
                              {categoria.maxRunners || 0} inscritos
                            </p>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeCategoria(index)}
                          className="text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`category-${index}`}>Categoria</Label>
                          <select
                            id={`category-${index}`}
                            value={categoria.categoryId}
                            onChange={(e) =>
                              updateCategoria(
                                index,
                                "categoryId",
                                e.target.value
                              )
                            }
                            className="w-full rounded-lg border-2 px-3 py-2 bg-background"
                          >
                            <option value="">Selecione uma categoria</option>
                            {categoriasDoEventoDisponiveis.map((cat) => (
                              <option key={cat.id} value={cat.id}>
                                {cat.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`price-${index}`}>Preço (R$)</Label>
                          <Input
                            id={`price-${index}`}
                            type="number"
                            value={categoria.price}
                            onChange={(e) =>
                              updateCategoria(index, "price", e.target.value)
                            }
                            placeholder="0.00"
                            min="0"
                            step="0.01"
                            className="bg-background"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`maxRunners-${index}`}>
                            Máximo de Participantes
                          </Label>
                          <Input
                            id={`maxRunners-${index}`}
                            type="number"
                            value={categoria.maxRunners}
                            onChange={(e) =>
                              updateCategoria(
                                index,
                                "maxRunners",
                                e.target.value
                              )
                            }
                            placeholder="0"
                            min="0"
                            className="bg-background"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`passwordLimit-${index}`}>
                            Limite de Senhas
                          </Label>
                          <Input
                            id={`passwordLimit-${index}`}
                            type="number"
                            value={categoria.passwordLimit}
                            onChange={(e) =>
                              updateCategoria(
                                index,
                                "passwordLimit",
                                e.target.value
                              )
                            }
                            placeholder="0"
                            min="0"
                            className="bg-background"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`initialPassword-${index}`}>
                            Senha Inicial
                          </Label>
                          <Input
                            id={`initialPassword-${index}`}
                            type="number"
                            value={categoria.initialPassword}
                            onChange={(e) =>
                              updateCategoria(
                                index,
                                "initialPassword",
                                e.target.value
                              )
                            }
                            placeholder="0"
                            min="0"
                            className="bg-background"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`finalPassword-${index}`}>
                            Senha Final
                          </Label>
                          <Input
                            id={`finalPassword-${index}`}
                            type="number"
                            value={categoria.finalPassword}
                            onChange={(e) =>
                              updateCategoria(
                                index,
                                "finalPassword",
                                e.target.value
                              )
                            }
                            placeholder="0"
                            min="0"
                            className="bg-background"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`startAt-${index}`}>
                            Início da Categoria
                          </Label>
                          <Input
                            id={`startAt-${index}`}
                            type="date"
                            value={categoria.startAt}
                            onChange={(e) =>
                              updateCategoria(index, "startAt", e.target.value)
                            }
                            className="bg-background"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`endAt-${index}`}>
                            Término da Categoria
                          </Label>
                          <Input
                            id={`endAt-${index}`}
                            type="date"
                            value={categoria.endAt}
                            onChange={(e) =>
                              updateCategoria(index, "endAt", e.target.value)
                            }
                            className="bg-background"
                          />
                        </div>
                      </div>
                    </Card>
                  ))}
                </CardContent>
              </Card>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleSaveEvent}
                  className="gap-2"
                  disabled={uploadingImage}
                >
                  {uploadingImage ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Enviando imagem...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      Salvar Alterações
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

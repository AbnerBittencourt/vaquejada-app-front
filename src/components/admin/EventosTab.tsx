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
} from "lucide-react";
import { ListEventResponse } from "@/types/api";
import React, { useState } from "react";
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
  getEventCategories,
  updateEvent,
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
import { start } from "repl";

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
  const [categorias, setCategorias] = useState<CategoriaForm[]>([]);
  const [loadingEvent, setLoadingEvent] = useState(false);
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
  });

  const [categoriasDisponiveis, setCategoriasDisponiveis] = useState<
    { id: string; name: string }[]
  >([]);

  React.useEffect(() => {
    const fetchCategoriasDisponiveis = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await listCategories(token);
        if (response.data && Array.isArray(response.data)) {
          setCategoriasDisponiveis(
            response.data.map((cat) => ({
              id: cat.category?.id || cat.id,
              name: getCategoryNameMap(cat.name as CategoryNameEnum),
            }))
          );
        }
      } catch (err) {
        console.error("Erro ao buscar categorias disponíveis:", err);
        setCategoriasDisponiveis([]);
      }
    };
    fetchCategoriasDisponiveis();
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

      console.log("Editing event:", evento);
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
      });

      const token = localStorage.getItem("token");
      const response = await getEventCategories(evento.id, token);

      if (response.data && Array.isArray(response.data)) {
        const categoriasMapeadas = response.data.map((cat) => ({
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
          isActive: cat.isActive || false,
          category: cat.category,
        }));
        setCategorias(categoriasMapeadas);
      } else {
        setCategorias([]);
      }
    } catch (err) {
      console.error("Erro ao carregar evento:", err);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados do evento",
        variant: "destructive",
      });
      setCategorias([]);
    } finally {
      setLoadingEvent(false);
    }
  };

  const addCategoria = () => {
    setCategorias((prev) => [
      ...prev,
      {
        categoryId: "",
        price: "",
        maxRunners: "",
        startAt: "",
        endAt: "",
      },
    ]);
  };

  const removeCategoria = (index: number) => {
    setCategorias((prev) => prev.filter((_, i) => i !== index));
  };

  const updateCategoria = (
    index: number,
    field: keyof CategoriaForm,
    value: string
  ) => {
    setCategorias((prev) =>
      prev.map((cat, i) => (i === index ? { ...cat, [field]: value } : cat))
    );
  };

  const handleSaveEvent = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log("Token:", token);
      const udpatedData: CreateEventDto = {
        name: formData.name,
        startAt: formData.startAt,
        endAt: formData.endAt,
        purchaseClosedAt: formData.purchaseClosedAt,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        description: formData.description,
      };
      console.log("Salvando evento:", formData);

      console.log("Categorias:", categorias);
      await updateEvent(editingEvent!.id, udpatedData, token);

      categorias.map(async (categoria) => {
        const eventCategoryData = {
          eventId: editingEvent!.id,
          categoryId: categoria.categoryId,
          price: Number(categoria.price),
          startAt: categoria.startAt,
          endAt: categoria.endAt,
          maxRunners: Number(categoria.maxRunners),
        };

        if (categoria.id) {
          //rota de put
        } else {
          await createEventCategory(eventCategoryData, token);
        }
      });

      toast({
        title: "Sucesso",
        description: "Evento atualizado com sucesso!",
      });

      setIsEditModalOpen(false);
      setEditingEvent(null);
      setCategorias([]);
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
      });
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
                  {categorias.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>Nenhuma categoria adicionada</p>
                      <p className="text-sm">
                        Adicione categorias para vender senhas
                      </p>
                    </div>
                  ) : (
                    categorias.map((categoria, index) => (
                      <Card key={categoria.id || index} className="border-2">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">
                              {getCategoriaDisplayName(categoria)} #{index + 1}
                            </CardTitle>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeCategoria(index)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor={`category-${index}`}>
                                Categoria
                              </Label>
                              <select
                                id={`category-${index}`}
                                value={
                                  categoria.categoryId ||
                                  categoria.category?.id ||
                                  ""
                                }
                                onChange={(e) =>
                                  updateCategoria(
                                    index,
                                    "categoryId",
                                    e.target.value
                                  )
                                }
                                className="w-full rounded-lg border-2 px-3 py-2 bg-background"
                              >
                                <option value="">
                                  Selecione uma categoria
                                </option>
                                {categoriasDisponiveis.map((cat) => (
                                  <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor={`price-${index}`}>
                                Valor da Senha (R$)
                              </Label>
                              <Input
                                id={`price-${index}`}
                                type="number"
                                value={categoria.price}
                                onChange={(e) =>
                                  updateCategoria(
                                    index,
                                    "price",
                                    e.target.value
                                  )
                                }
                                placeholder="0.00"
                                min="0"
                                step="0.01"
                                className="bg-background"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor={`maxRunners-${index}`}>
                                Quantidade de Senhas
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
                                min="1"
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
                                  updateCategoria(
                                    index,
                                    "startAt",
                                    e.target.value
                                  )
                                }
                                className="bg-background"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor={`endAt-${index}`}>
                                Fim da Categoria
                              </Label>
                              <Input
                                id={`endAt-${index}`}
                                type="date"
                                value={categoria.endAt}
                                onChange={(e) =>
                                  updateCategoria(
                                    index,
                                    "endAt",
                                    e.target.value
                                  )
                                }
                                className="bg-background"
                              />
                            </div>

                            {/* Informações adicionais para categorias existentes */}
                            {categoria.id && (
                              <>
                                <div className="space-y-2">
                                  <Label htmlFor={`currentRunners-${index}`}>
                                    Senhas Vendidas
                                  </Label>
                                  <Input
                                    id={`currentRunners-${index}`}
                                    type="number"
                                    value={categoria.currentRunners || 0}
                                    disabled
                                    className="bg-muted"
                                  />
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor={`isActive-${index}`}>
                                    Status
                                  </Label>
                                  <div className="flex items-center h-10">
                                    <Badge
                                      variant={
                                        categoria.isActive
                                          ? "default"
                                          : "secondary"
                                      }
                                    >
                                      {categoria.isActive ? "Ativa" : "Inativa"}
                                    </Badge>
                                  </div>
                                </div>
                              </>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </CardContent>
              </Card>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  Cancelar
                </Button>
                <Button onClick={handleSaveEvent} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Salvar Alterações
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

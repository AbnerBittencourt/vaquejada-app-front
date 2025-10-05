import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Eye, Loader2, Search, MapPin } from "lucide-react";
import { ListEventResponse } from "@/types/api";
import React from "react";
import { formatDate } from "@/utils/format-data.util";
import { EventStatusEnum } from "@/types/enums/api-enums";
import { CriarEventoModal } from "../CriarEventoModal";
import { getEventStatusMap } from "@/types/enums/enum-maps";

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

  return (
    <Card className="bg-card/80 backdrop-blur-sm border-2">
      <CardHeader>
        <div className="flex items-center justify-between mb-4">
          <div>
            <CardTitle className="text-2xl bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Eventos
            </CardTitle>
            <CardDescription className="text-base">
              {totalEventos}{" "}
              {totalEventos === 1 ? "evento encontrado" : "eventos encontrados"}
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

          {/* Filtro de Cidade */}
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

          {/* Filtro de Estado */}
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
                      >
                        <Eye className="h-4 w-4" />
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
  );
};

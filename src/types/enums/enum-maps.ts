import {
  EventStatusEnum,
  CategoryNameEnum,
  SubscriptionStatusEnum,
} from "./api-enums";

const categoryNameMap: Record<CategoryNameEnum, string> = {
  [CategoryNameEnum.AMATEUR]: "Amador",
  [CategoryNameEnum.PROFESSIONAL]: "Profissional",
  [CategoryNameEnum.MASTER]: "Master",
  [CategoryNameEnum.FEMALE]: "Feminino",
  [CategoryNameEnum.JUNIOR]: "Júnior",
  [CategoryNameEnum.INTERMEDIARY]: "Intermediário",
  [CategoryNameEnum.DERBY]: "Derby",
  [CategoryNameEnum.ASPIRANT]: "Aspirante",
  [CategoryNameEnum.YOUNG]: "Jovem",
};

export const getCategoryNameMap = (categoria: CategoryNameEnum) => {
  return categoryNameMap[categoria] ?? categoria;
};

const eventStatusMap: Record<EventStatusEnum, string> = {
  [EventStatusEnum.LIVE]: "Ao Vivo",
  [EventStatusEnum.SCHEDULED]: "Agendado",
  [EventStatusEnum.CANCELLED]: "Cancelado",
  [EventStatusEnum.FINISHED]: "Finalizado",
};

export const getEventStatusMap = (status: EventStatusEnum) => {
  return eventStatusMap[status] ?? status;
};

const subscriptionStatusMap: Record<SubscriptionStatusEnum, string> = {
  [SubscriptionStatusEnum.CONFIRMED]: "Confirmado",
  [SubscriptionStatusEnum.PENDING]: "Pendente",
  [SubscriptionStatusEnum.CANCELLED]: "Cancelado",
};

export const getSubscriptionStatusMap = (status: SubscriptionStatusEnum) => {
  return subscriptionStatusMap[status] ?? status;
};

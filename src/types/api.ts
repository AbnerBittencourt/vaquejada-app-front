import {
  UserRoleEnum,
  UserNatureEnum,
  EventStatusEnum,
  CategoryNameEnum,
  PasswordStatusEnum,
  SubscriptionStatusEnum,
} from "./enums/api-enums";

export type CreateUserResponse = {
  email: string;
  name: string;
  password: string;
  phone: string;
  cpf: string;
  access_token: string;
};

export type CreateFullUser = {
  email: string;
  name: string;
  password: string;
  cpf: string;
  nature: UserNatureEnum;
  phone: string;
  role: UserRoleEnum;
  city: string;
  state: string;
  isActive: boolean;
  organizerId?: string;
};

export type GetUserResponse = {
  id: string;
  email: string;
  name: string;
  cpf: string;
  nature: UserNatureEnum;
  role: UserRoleEnum;
  phone: string;
  city: string;
  state: string;
  isActive: boolean;
};

export type ListUserResponse = GetUserResponse;

export type UpdateUserResponse = {
  id: string;
  name: string;
};

export type EventResponse = {
  id: string;
  name: string;
  startAt: string;
  endAt: string;
  purchaseClosedAt: string;
  status: EventStatusEnum;
  prize: number;
  address?: string;
  city?: string;
  state?: string;
  description: string;
  bannerUrl?: string;
  isActive: boolean;
  isPublic: boolean;
  organizerId: string;
  createdAt: string;
  categories?: CategoryResponse[];
};

export type ListEventResponse = {
  id: string;
  name: string;
  startAt: string;
  endAt: string;
  status: EventStatusEnum;
  description: string;
  address: string;
  bannerUrl: string;
  prize: string;
  city: string;
  state: string;
  purchaseClosedAt: string;
  isActive: boolean;
};

export type CategoryResponse = {
  id: string;
  name: CategoryNameEnum;
  description?: string;
  rules?: string;
  isActive: boolean;
};

export type CreateCategoryResponse = {
  id: string;
  name: CategoryNameEnum;
  description: string;
  rules: string;
  isActive: boolean;
  createdAt: string;
};

export type EventCategoryResponse = {
  id: string;
  price: number;
  startAt: string;
  endAt: string;
  maxRunners: number;
  currentRunners: number;
  passwordLimit: number;
  isActive: boolean;
  category: CategoryResponse;
  isAvailable?: boolean;
  canRegister?: boolean;
  createdAt: string;
};

export type ListEventCategoryResponse = {
  id: string;
  price: number;
  startAt: string;
  endAt: string;
  maxRunners: number;
  currentRunners: number;
  isActive: boolean;
  eventId: string;
  categoryId: string;
};

export type PasswordResponse = {
  id: string;
  eventId: string;
  categoryId: string;
  price: number;
  number: string;
  status: PasswordStatusEnum;
  soldAt: string;
};

export type GetSubscriptionResponse = {
  id: string;
  runner: string;
  event: string;
  eventId: string;
  category: CategoryNameEnum;
  subscribedAt: string;
  status: SubscriptionStatusEnum;
  password: string;
  passwordPrice: string;
};

export type ListSubscriptionResponse = {
  id: string;
  runner: GetUserResponse;
  event: EventResponse;
  category: CategoryResponse;
  subscribedAt: string;
  status: SubscriptionStatusEnum;
  passwords: PasswordResponse[];
  passwordPrice: string;
};

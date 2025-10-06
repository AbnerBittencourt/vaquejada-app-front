import { EventStatusEnum } from "../enums/api-enums";

export class CreateEventDto {
  name: string;
  startAt: string;
  endAt: string;
  purchaseClosedAt: string;
  status?: EventStatusEnum;
  address?: string;
  city?: string;
  state?: string;
  description: string;
  bannerUrl?: string;
  isPublic?: boolean;
  organizerId?: string;
}

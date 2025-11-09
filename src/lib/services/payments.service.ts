import { api } from "@/api/api-connection";

export type CheckoutProPayload = {
  eventId: string;
  categoryId: string;
  passwordIds: string[];
  total: number;
};

export async function createCheckoutProSession(payload: CheckoutProPayload) {
  const { data } = await api.post("/payments/checkout-pro", payload);
  return data;
}

import { api } from "@/api/api-connection";

export type CheckoutProPayload = {
  eventId: string;
  categoryId: string;
  passwordIds: string[];
  total: number;
};

export type PixPayload = {
  eventId: string;
  categoryId: string;
  passwordIds: string[];
  total: number;
  email: string;
  first_name?: string;
  last_name?: string;
  doc_type?: string;
  doc_number?: string;
};

export type PixResponse = {
  paymentId: string;
  subscriptionId: string;
  qrCode: string;
  qrCodeBase64: string;
};

export async function createCheckoutProSession(payload: CheckoutProPayload) {
  const { data } = await api.post("/payments/checkout-pro", payload);
  return data;
}

export async function createPixPayment(
  payload: PixPayload
): Promise<PixResponse> {
  const { data } = await api.post("/payments/pix", payload);
  return data;
}

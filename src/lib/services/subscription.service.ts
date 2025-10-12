import { api } from "@/api/api-connection";

export async function listSubscriptions() {
  try {
    const response = await api.get("/subscriptions");

    return response.data;
  } catch (error) {
    throw new Error("Erro ao listar assinaturas");
  }
}

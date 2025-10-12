import { api } from "@/api/api-connection";

export const getCategoryPasswords = async (
  eventId: string,
  categoryId: string
) => {
  try {
    const response = await api.get(
      `/passwords?eventId=${eventId}&categoryId=${categoryId}`
    );
    return response.data;
  } catch (error) {
    throw new Error("Erro ao buscar senhas da categoria");
  }
};

export const purchasePasswords = async (data: {
  eventId: string;
  categoryId: string;
  passwordIds: string[];
}) => {
  try {
    const response = await api.post("/passwords/purchase", data);

    return response.data;
  } catch (error) {
    throw new Error("Erro ao processar compra");
  }
};

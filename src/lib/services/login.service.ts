import { api } from "@/api/api-connection";

export async function userLogin(email: string, password: string) {
  try {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  } catch (error) {
    throw new Error("Login falhou");
  }
}

import { api } from "@/api/api-connection";
import { QueryUserDto } from "@/types/dtos/user.dto";
import { CreateFullUser, GetUserResponse } from "@/types/api";

export async function getMe(): Promise<GetUserResponse> {
  try {
    const response = await api.get("/users/me");
    return response.data;
  } catch (error) {
    throw new Error("Erro ao buscar usuário logado");
  }
}

export async function createUser(dados: {
  nome: string;
  email: string;
  senha: string;
  cpf: string;
  telefone: string;
}) {
  const response = await api.post("/users", {
    name: dados.nome,
    email: dados.email,
    password: dados.senha,
    cpf: dados.cpf,
    phone: dados.telefone,
  });
  return response.data;
}

export async function listUsers(
  params?: QueryUserDto
): Promise<GetUserResponse[]> {
  const response = await api.get("/users", { params });
  return response.data;
}

export const createFullUser = async (userData: CreateFullUser) => {
  const response = await api.post("/users/full", userData);
  return response.data;
};

export const updateUser = async (
  userId: string,
  userData: Partial<CreateFullUser>
) => {
  const response = await api.put(`/users/${userId}`, userData);
  return response.data;
};

export const getUserById = async (userId: string) => {
  const response = await api.get(`/users/${userId}`);
  return response.data;
};

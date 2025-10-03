const API_URL = import.meta.env.API_URL || "http://localhost:3000";

export async function getMe(token: string) {
  return fetch(`${API_URL}/users/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function createUser(dados: {
  nome: string;
  email: string;
  senha: string;
  cpf: string;
  telefone: string;
}) {
  return fetch(`${API_URL}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: dados.nome,
      email: dados.email,
      password: dados.senha,
      cpf: dados.cpf,
      phone: dados.telefone,
    }),
  });
}

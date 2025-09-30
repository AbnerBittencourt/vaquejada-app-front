import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface User {
  id: string;
  nome: string;
  email: string;
  tipo: "usuario" | "corredor" | "admin";
}

interface AuthContextType {
  user: User | null;
  login: (email: string, senha: string) => Promise<void>;
  loginGoogle: () => Promise<void>;
  logout: () => void;
  cadastrar: (dados: { nome: string; email: string; senha: string }) => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock de usuários
const MOCK_USERS = [
  { id: "1", email: "usuario@email.com", senha: "123456", nome: "João Silva", tipo: "usuario" as const },
  { id: "2", email: "corredor@email.com", senha: "123456", nome: "Maria Santos", tipo: "corredor" as const },
  { id: "3", email: "admin@parque.com", senha: "admin123", nome: "Administrador", tipo: "admin" as const },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  // Carrega usuário do localStorage ao iniciar
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, senha: string) => {
    // Simula delay de API
    await new Promise(resolve => setTimeout(resolve, 800));

    const foundUser = MOCK_USERS.find(u => u.email === email && u.senha === senha);
    
    if (!foundUser) {
      throw new Error("E-mail ou senha incorretos");
    }

    const userData = {
      id: foundUser.id,
      nome: foundUser.nome,
      email: foundUser.email,
      tipo: foundUser.tipo,
    };

    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    
    toast.success(`Bem-vindo, ${foundUser.nome}!`);

    // Redireciona baseado no tipo de usuário
    if (foundUser.tipo === "admin") {
      navigate("/admin/dashboard");
    } else if (foundUser.tipo === "corredor") {
      navigate("/perfil-corredor");
    } else {
      navigate("/");
    }
  };

  const loginGoogle = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const userData = {
      id: "google-1",
      nome: "Usuário Google",
      email: "usuario@gmail.com",
      tipo: "usuario" as const,
    };

    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    
    toast.success(`Bem-vindo, ${userData.nome}!`);
    navigate("/");
  };

  const cadastrar = async (dados: { nome: string; email: string; senha: string }) => {
    await new Promise(resolve => setTimeout(resolve, 800));

    const userData = {
      id: `user-${Date.now()}`,
      nome: dados.nome,
      email: dados.email,
      tipo: "usuario" as const,
    };

    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    
    toast.success("Conta criada com sucesso!");
    navigate("/");
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    toast.success("Você saiu da sua conta");
    navigate("/");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        loginGoogle,
        logout,
        cadastrar,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}

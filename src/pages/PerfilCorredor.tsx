import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  ArrowLeft,
  Upload,
  Plus,
  Award,
  Calendar,
  User,
  LogOut,
  ArrowRight,
  Loader2,
  Save,
  Edit,
  MapPin,
  Phone,
  Mail,
  IdCard,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { getUserById, updateUser } from "@/lib/services/user.service";
import { GetUserResponse } from "@/types/api";
import { UserNatureEnum, UserRoleEnum } from "@/types/enums/api-enums";
import { getNatureMap, getRoleMap } from "@/types/enums/enum-maps";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // Certifique-se que BRstates está importado corretamente
import { BRstates } from "@/shared/br-states";

const PerfilCorredor = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const { toast } = useToast();

  const [profile, setProfile] = useState<GetUserResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    cpf: "",
    city: "",
    state: "",
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    carregarPerfil();
  }, [isAuthenticated, navigate]);

  const carregarPerfil = async () => {
    try {
      setLoading(true);
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");

      if (!userId || !token) {
        navigate("/login");
        return;
      }

      const response = await getUserById(userId, token);
      setProfile(response);
      setFormData({
        name: response.name || "",
        email: response.email || "",
        phone: response.phone || "",
        cpf: response.cpf || "",
        city: response.city || "",
        state: response.state || "",
      });
    } catch (err) {
      console.error("Erro ao carregar perfil:", err);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados do perfil",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      setUpdating(true);
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      if (!token || !userId) {
        navigate("/login");
        return;
      }

      await updateUser(userId, formData, token);

      toast({
        title: "Sucesso",
        description: "Perfil atualizado com sucesso!",
      });

      setEditing(false);
      carregarPerfil();
    } catch (err) {
      console.error("Erro ao atualizar perfil:", err);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o perfil",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header atualizado */}
      <header className="border-b bg-card/80 backdrop-blur-md sticky top-0 z-50 supports-backdrop-blur:bg-background/60">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="hover:bg-accent rounded-lg"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 rounded-xl blur-sm group-hover:blur-md transition-all"></div>
                <Users className="h-8 w-8 text-primary relative z-10 group-hover:scale-110 transition-transform" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Trilha do Vaqueiro
              </h1>
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className="text-foreground/80 hover:text-primary font-medium transition-all duration-200 hover:scale-105"
            >
              Eventos
            </Link>
            {isAuthenticated && (
              <Link
                to="/meus-ingressos"
                className="text-foreground/80 hover:text-primary font-medium transition-all duration-200 hover:scale-105"
              >
                Meus Ingressos
              </Link>
            )}
          </nav>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <div className="relative group">
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-primary/10 transition-all duration-200 border border-transparent hover:border-primary/20"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-primary/70 flex items-center justify-center">
                      <User className="h-4 w-4 text-primary-foreground" />
                    </div>
                    <span className="font-medium max-w-[120px] truncate hidden sm:block">
                      {user?.name}
                    </span>
                  </div>
                </Button>

                <div className="absolute right-0 top-full mt-2 min-w-[200px] bg-card/95 backdrop-blur-md border rounded-2xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden">
                  <div className="p-2">
                    <div className="px-3 py-2 border-b border-border/50 mb-1">
                      <p className="text-sm font-medium text-foreground">
                        {user?.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                    <Link
                      to="/perfil-corredor"
                      className="flex items-center gap-3 px-3 py-2 text-sm text-foreground hover:bg-accent rounded-lg transition-all duration-200 group/item"
                    >
                      <User className="h-4 w-4 text-primary" />
                      <span>Meu Perfil</span>
                      <ArrowRight className="h-3 w-3 ml-auto opacity-0 group-hover/item:opacity-100 transition-opacity" />
                    </Link>
                    <button
                      onClick={logout}
                      className="flex items-center gap-3 w-full px-3 py-2 text-sm text-foreground hover:bg-destructive/10 hover:text-destructive rounded-lg transition-all duration-200 group/item"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sair</span>
                      <ArrowRight className="h-3 w-3 ml-auto opacity-0 group-hover/item:opacity-100 transition-opacity" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" asChild className="hover:bg-primary/10">
                  <Link to="/login">Entrar</Link>
                </Button>
                <Button
                  asChild
                  className="bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all"
                >
                  <Link to="/cadastro">Cadastrar</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Profile Header */}
          <Card className="mb-8 border-2 shadow-lg">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <Avatar className="h-24 w-24 border-4 border-primary/10">
                  <AvatarFallback className="text-lg font-semibold bg-primary/10 text-primary">
                    {profile?.name ? getInitials(profile.name) : "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-2xl font-bold mb-2 text-foreground">
                    {profile?.name || "Usuário"}
                  </h2>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      <span className="text-sm">{profile?.email}</span>
                    </div>
                    {profile?.phone && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        <span className="text-sm">{profile.phone}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                    <Badge
                      variant="secondary"
                      className="gap-1 bg-blue-50 text-blue-700 border-blue-200"
                    >
                      <IdCard className="h-3 w-3" />
                      {getRoleMap(profile?.role || UserRoleEnum.USER)}
                    </Badge>
                    <Badge
                      variant={profile?.isActive ? "default" : "secondary"}
                      className="gap-1"
                    >
                      <div
                        className={`w-2 h-2 rounded-full ${
                          profile?.isActive ? "bg-green-500" : "bg-gray-400"
                        }`}
                      ></div>
                      {profile?.isActive ? "Ativo" : "Inativo"}
                    </Badge>
                  </div>
                </div>
                <Button
                  onClick={() => setEditing(!editing)}
                  variant={editing ? "outline" : "default"}
                  className="gap-2"
                >
                  {editing ? (
                    <>
                      <Edit className="h-4 w-4" />
                      Cancelar
                    </>
                  ) : (
                    <>
                      <Edit className="h-4 w-4" />
                      Editar perfil
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="dados" className="w-full">
            <TabsList className="w-full justify-start bg-muted/50 p-1 rounded-xl mb-6">
              <TabsTrigger
                value="dados"
                className="flex items-center gap-2 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all duration-200"
              >
                <User className="h-4 w-4" />
                Dados Pessoais
              </TabsTrigger>
              <TabsContent value="historico" className="mt-0">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-foreground">
                    Histórico de Eventos
                  </h3>
                  <Card className="border-2 text-center py-8">
                    <CardContent>
                      <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                      <p className="text-muted-foreground">
                        Nenhum evento participado
                      </p>
                      <Button className="mt-4" asChild>
                        <Link to="/">Explorar eventos</Link>
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </TabsList>

            <TabsContent value="dados" className="mt-0">
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <User className="h-5 w-5 text-primary" />
                    Informações Pessoais
                  </CardTitle>
                  <CardDescription>
                    {editing
                      ? "Atualize seus dados pessoais"
                      : "Visualize seus dados pessoais"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome completo</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                        disabled={!editing || updating}
                        placeholder="Seu nome completo"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cpf">CPF</Label>
                      <Input
                        id="cpf"
                        value={formData.cpf}
                        onChange={(e) =>
                          handleInputChange("cpf", e.target.value)
                        }
                        disabled={!editing || updating}
                        placeholder="000.000.000-00"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">E-mail</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        disabled={!editing || updating}
                        placeholder="seu@email.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefone</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) =>
                          handleInputChange("phone", e.target.value)
                        }
                        disabled={!editing || updating}
                        placeholder="(00) 00000-0000"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">Cidade</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) =>
                          handleInputChange("city", e.target.value)
                        }
                        disabled={!editing || updating}
                        placeholder="Sua cidade"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">Estado</Label>
                      <Select
                        value={formData.state}
                        onValueChange={(value) =>
                          handleInputChange("state", value)
                        }
                        disabled={!editing || updating}
                      >
                        <SelectTrigger id="state">
                          <SelectValue placeholder="Selecione o estado" />
                        </SelectTrigger>
                        <SelectContent>
                          {BRstates.map((estado) => (
                            <SelectItem key={estado} value={estado}>
                              {estado}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {editing && (
                    <Button
                      onClick={handleUpdateProfile}
                      disabled={updating}
                      className="gap-2 mt-4"
                    >
                      {updating ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Salvando...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4" />
                          Salvar alterações
                        </>
                      )}
                    </Button>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="cavalos" className="mt-0">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-foreground">
                    Meus Cavalos
                  </h3>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Adicionar cavalo
                  </Button>
                </div>

                <Card className="border-2 text-center py-8">
                  <CardContent>
                    <Award className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                    <p className="text-muted-foreground">
                      Nenhum cavalo cadastrado
                    </p>
                    <Button className="mt-4 gap-2">
                      <Plus className="h-4 w-4" />
                      Adicionar primeiro cavalo
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default PerfilCorredor;

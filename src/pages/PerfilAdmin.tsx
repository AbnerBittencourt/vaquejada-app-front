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
import { Shield, ArrowLeft, MapPin, Loader2, Save, Edit } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { getUserById, updateUser } from "@/lib/services/user.service";
import { GetUserResponse } from "@/types/api";
import { UserRoleEnum } from "@/types/enums/api-enums";
import { getRoleMap } from "@/types/enums/enum-maps";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BRstates } from "@/shared/br-states";
import { useAuth } from "@/contexts/AuthContext";
import { Header } from "@/components/ui/header";

interface AdminProfileFormData {
  name: string;
  email: string;
  phone: string;
  cnpj: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  capacity: string;
  description: string;
  responsibleName: string;
  whatsapp: string;
  instagram: string;
  facebook: string;
  bank: string;
  agency: string;
  account: string;
  pixKey: string;
}

const PerfilAdmin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, logout, isAuthenticated } = useAuth();

  const [profile, setProfile] = useState<GetUserResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("dados");

  const [formData, setFormData] = useState<AdminProfileFormData>({
    name: "",
    email: "",
    phone: "",
    cnpj: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    capacity: "",
    description: "",
    responsibleName: "",
    whatsapp: "",
    instagram: "",
    facebook: "",
    bank: "",
    agency: "",
    account: "",
    pixKey: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
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

      const response = await getUserById(userId);
      setProfile(response);

      setFormData({
        name: response.name || "",
        email: response.email || "",
        phone: response.phone || "",
        cnpj: response.cnpj || "",
        address: response.address || "",
        city: response.city || "",
        state: response.state || "",
        zipCode: response.zipCode || "",
        capacity: response.capacity?.toString() || "",
        description: response.description || "",
        responsibleName: response.responsibleName || "",
        whatsapp: response.whatsapp || "",
        instagram: response.instagram || "",
        facebook: response.facebook || "",
        bank: response.bank || "",
        agency: response.agency || "",
        account: response.account || "",
        pixKey: response.pixKey || "",
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

      const updateData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        cnpj: formData.cnpj,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        capacity: formData.capacity ? parseInt(formData.capacity) : undefined,
        description: formData.description,
        responsibleName: formData.responsibleName,
        whatsapp: formData.whatsapp,
        instagram: formData.instagram,
        facebook: formData.facebook,
        bank: formData.bank,
        agency: formData.agency,
        account: formData.account,
        pixKey: formData.pixKey,
      };

      await updateUser(userId, updateData);

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

  const handleInputChange = (
    field: keyof AdminProfileFormData,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePasswordChange = (
    field: keyof typeof passwordData,
    value: string
  ) => {
    setPasswordData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleUpdatePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem",
        variant: "destructive",
      });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast({
        title: "Erro",
        description: "A senha deve ter pelo menos 6 caracteres",
        variant: "destructive",
      });
      return;
    }

    try {
      setUpdating(true);

      toast({
        title: "Sucesso",
        description: "Senha atualizada com sucesso!",
      });

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      console.error("Erro ao atualizar senha:", err);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a senha",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getLocationText = () => {
    if (formData.city && formData.state) {
      return `${formData.city}, ${formData.state}`;
    }
    return "Localização não informada";
  };

  // Botão personalizado para voltar ao dashboard
  const backButton = (
    <Button variant="ghost" size="icon" asChild>
      <Link to="/admin/dashboard">
        <ArrowLeft className="h-5 w-5" />
      </Link>
    </Button>
  );

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
      <Header
        user={user || { name: "Organizador", role: UserRoleEnum.ADMIN }}
        onLogout={logout}
        isAuthenticated={isAuthenticated}
        title="Perfil do Organizador"
        customActions={backButton}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Profile Header */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <Avatar className="h-32 w-32 border-4 border-primary/10">
                  <AvatarFallback className="text-xl font-semibold bg-primary/10 text-primary">
                    {profile?.name ? getInitials(profile.name) : "O"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-3xl font-bold mb-2">
                    {formData.name || "Nome não informado"}
                  </h2>
                  <p className="text-muted-foreground mb-4 flex items-center gap-1 justify-center md:justify-start">
                    <MapPin className="h-4 w-4" />
                    {getLocationText()}
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                    <Badge variant="default" className="gap-1">
                      <Shield className="h-3 w-3" />
                      {getRoleMap(profile?.role || UserRoleEnum.ADMIN)}
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

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="w-full justify-start">
              <TabsTrigger value="dados">Dados do Parque</TabsTrigger>
              <TabsTrigger value="contato">Contato</TabsTrigger>
              <TabsTrigger value="financeiro">Dados Financeiros</TabsTrigger>
              <TabsTrigger value="configuracoes">Configurações</TabsTrigger>
            </TabsList>

            <TabsContent value="dados" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Informações do Parque</CardTitle>
                  <CardDescription>
                    {editing
                      ? "Atualize os dados públicos do seu parque/organização"
                      : "Dados públicos do seu parque/organização"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nome-parque">Nome do Parque</Label>
                      <Input
                        id="nome-parque"
                        value={formData.name}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                        disabled={!editing || updating}
                        placeholder="Nome do seu parque"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cnpj">CNPJ</Label>
                      <Input
                        id="cnpj"
                        value={formData.cnpj}
                        onChange={(e) =>
                          handleInputChange("cnpj", e.target.value)
                        }
                        disabled={!editing || updating}
                        placeholder="00.000.000/0000-00"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="endereco">Endereço completo</Label>
                      <Input
                        id="endereco"
                        value={formData.address}
                        onChange={(e) =>
                          handleInputChange("address", e.target.value)
                        }
                        disabled={!editing || updating}
                        placeholder="Rua, número, bairro, cidade - estado"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cidade">Cidade</Label>
                      <Input
                        id="cidade"
                        value={formData.city}
                        onChange={(e) =>
                          handleInputChange("city", e.target.value)
                        }
                        disabled={!editing || updating}
                        placeholder="Sua cidade"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="estado">Estado</Label>
                      <Select
                        value={formData.state}
                        onValueChange={(value) =>
                          handleInputChange("state", value)
                        }
                        disabled={!editing || updating}
                      >
                        <SelectTrigger>
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
                    <div className="space-y-2">
                      <Label htmlFor="cep">CEP</Label>
                      <Input
                        id="cep"
                        value={formData.zipCode}
                        onChange={(e) =>
                          handleInputChange("zipCode", e.target.value)
                        }
                        disabled={!editing || updating}
                        placeholder="00000-000"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="capacidade">Capacidade</Label>
                      <Input
                        id="capacidade"
                        type="number"
                        value={formData.capacity}
                        onChange={(e) =>
                          handleInputChange("capacity", e.target.value)
                        }
                        disabled={!editing || updating}
                        placeholder="500"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="descricao">Descrição</Label>
                      <Input
                        id="descricao"
                        value={formData.description}
                        onChange={(e) =>
                          handleInputChange("description", e.target.value)
                        }
                        disabled={!editing || updating}
                        placeholder="Descrição do seu parque e infraestrutura"
                      />
                    </div>
                  </div>

                  {editing && (
                    <Button
                      onClick={handleUpdateProfile}
                      disabled={updating}
                      className="w-full md:w-auto gap-2"
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

            <TabsContent value="contato" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Informações de Contato</CardTitle>
                  <CardDescription>
                    {editing
                      ? "Atualize os dados para comunicação"
                      : "Dados para comunicação com organizadores e vaqueiros"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="responsavel">Nome do responsável</Label>
                      <Input
                        id="responsavel"
                        value={formData.responsibleName}
                        onChange={(e) =>
                          handleInputChange("responsibleName", e.target.value)
                        }
                        disabled={!editing || updating}
                        placeholder="Nome do responsável"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="telefone">Telefone principal</Label>
                      <Input
                        id="telefone"
                        value={formData.phone}
                        onChange={(e) =>
                          handleInputChange("phone", e.target.value)
                        }
                        disabled={!editing || updating}
                        placeholder="(00) 00000-0000"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="whatsapp">WhatsApp</Label>
                      <Input
                        id="whatsapp"
                        value={formData.whatsapp}
                        onChange={(e) =>
                          handleInputChange("whatsapp", e.target.value)
                        }
                        disabled={!editing || updating}
                        placeholder="(00) 00000-0000"
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
                        placeholder="contato@exemplo.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="instagram">Instagram</Label>
                      <Input
                        id="instagram"
                        value={formData.instagram}
                        onChange={(e) =>
                          handleInputChange("instagram", e.target.value)
                        }
                        disabled={!editing || updating}
                        placeholder="@seuinstagram"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="facebook">Facebook</Label>
                      <Input
                        id="facebook"
                        value={formData.facebook}
                        onChange={(e) =>
                          handleInputChange("facebook", e.target.value)
                        }
                        disabled={!editing || updating}
                        placeholder="/seufacebook"
                      />
                    </div>
                  </div>

                  {editing && (
                    <Button
                      onClick={handleUpdateProfile}
                      disabled={updating}
                      className="w-full md:w-auto gap-2"
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

            <TabsContent value="financeiro" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Dados Financeiros</CardTitle>
                  <CardDescription>
                    {editing
                      ? "Atualize as informações para recebimento"
                      : "Informações para recebimento de pagamentos"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="banco">Banco</Label>
                      <Input
                        id="banco"
                        value={formData.bank}
                        onChange={(e) =>
                          handleInputChange("bank", e.target.value)
                        }
                        disabled={!editing || updating}
                        placeholder="Nome do banco"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="agencia">Agência</Label>
                      <Input
                        id="agencia"
                        value={formData.agency}
                        onChange={(e) =>
                          handleInputChange("agency", e.target.value)
                        }
                        disabled={!editing || updating}
                        placeholder="0000-0"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="conta">Conta corrente</Label>
                      <Input
                        id="conta"
                        value={formData.account}
                        onChange={(e) =>
                          handleInputChange("account", e.target.value)
                        }
                        disabled={!editing || updating}
                        placeholder="00000-0"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pix">Chave PIX</Label>
                      <Input
                        id="pix"
                        value={formData.pixKey}
                        onChange={(e) =>
                          handleInputChange("pixKey", e.target.value)
                        }
                        disabled={!editing || updating}
                        placeholder="Chave PIX"
                      />
                    </div>
                  </div>

                  {editing && (
                    <Button
                      onClick={handleUpdateProfile}
                      disabled={updating}
                      className="w-full md:w-auto gap-2"
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

            <TabsContent value="configuracoes" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Configurações da Conta</CardTitle>
                  <CardDescription>
                    Gerencie suas preferências e segurança
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email-login">E-mail de login</Label>
                      <Input
                        id="email-login"
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        disabled={!editing || updating}
                        placeholder="seu@email.com"
                      />
                    </div>

                    <div className="pt-4 border-t">
                      <h4 className="font-medium mb-4">Alterar Senha</h4>
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <Label htmlFor="senha-atual">Senha atual</Label>
                          <Input
                            id="senha-atual"
                            type="password"
                            value={passwordData.currentPassword}
                            onChange={(e) =>
                              handlePasswordChange(
                                "currentPassword",
                                e.target.value
                              )
                            }
                            placeholder="••••••••"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="nova-senha">Nova senha</Label>
                          <Input
                            id="nova-senha"
                            type="password"
                            value={passwordData.newPassword}
                            onChange={(e) =>
                              handlePasswordChange(
                                "newPassword",
                                e.target.value
                              )
                            }
                            placeholder="••••••••"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirmar-senha">
                            Confirmar nova senha
                          </Label>
                          <Input
                            id="confirmar-senha"
                            type="password"
                            value={passwordData.confirmPassword}
                            onChange={(e) =>
                              handlePasswordChange(
                                "confirmPassword",
                                e.target.value
                              )
                            }
                            placeholder="••••••••"
                          />
                        </div>
                      </div>
                      <Button
                        onClick={handleUpdatePassword}
                        disabled={updating}
                        className="mt-4 gap-2"
                      >
                        {updating ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Atualizando...
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4" />
                            Atualizar senha
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default PerfilAdmin;

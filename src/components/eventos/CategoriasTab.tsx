import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Loader2,
  Users,
  ShoppingCart,
  CheckCircle,
  MapPin,
  LogIn,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { EventCategoryResponse, PasswordResponse } from "@/types/api";
import { formatPrice } from "@/utils/format-data.util";
import { getCategoryNameMap } from "@/types/enums/enum-maps";
import { PasswordStatusEnum } from "@/types/enums/api-enums";
import {
  getCategoryPasswords,
  purchasePasswords,
} from "@/lib/services/password.service";

interface CategoriasTabProps {
  eventoId: string;
  categorias: EventCategoryResponse[];
  loading: boolean;
  eventoStatus: string;
}

export const CategoriasTab: React.FC<CategoriasTabProps> = ({
  eventoId,
  categorias,
  loading,
}) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] =
    useState<EventCategoryResponse | null>(null);
  const [passwords, setPasswords] = useState<PasswordResponse[]>([]);
  const [loadingPasswords, setLoadingPasswords] = useState(false);
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [selectedPasswordIds, setSelectedPasswordIds] = useState<string[]>([]);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = () => {
    const token = localStorage.getItem("token");
    const userIsAuthenticated = !!token;
    setIsAuthenticated(userIsAuthenticated);
    return userIsAuthenticated;
  };

  useEffect(() => {
    if (selectedCategory) {
      carregarPasswords();
    }
  }, [selectedCategory]);

  const carregarPasswords = async () => {
    if (!selectedCategory) return;

    try {
      setLoadingPasswords(true);
      const response = await getCategoryPasswords(
        eventoId,
        selectedCategory.category.id
      );
      setPasswords(response || []);

      // Limpar seleções quando as senhas são recarregadas
      setSelectedNumbers([]);
      setSelectedPasswordIds([]);
    } catch (err) {
      console.error("Erro ao carregar senhas:", err);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as senhas disponíveis",
        variant: "destructive",
      });
    } finally {
      setLoadingPasswords(false);
    }
  };

  // Sincronizar selectedNumbers e selectedPasswordIds
  useEffect(() => {
    if (selectedNumbers.length === 0 && selectedPasswordIds.length === 0)
      return;

    // Se houver inconsistência, corrigir
    if (selectedNumbers.length !== selectedPasswordIds.length) {
      console.warn("Inconsistência detectada, recalculando IDs...");

      const recalculatedIds = selectedNumbers
        .map((num) => {
          const password = passwords.find((p) => Number(p.number) === num);
          return password?.id;
        })
        .filter(Boolean) as string[];

      if (recalculatedIds.length === selectedNumbers.length) {
        setSelectedPasswordIds(recalculatedIds);
      } else {
        // Se não conseguir recalcular, limpar tudo
        setSelectedNumbers([]);
        setSelectedPasswordIds([]);
      }
    }
  }, [selectedNumbers, selectedPasswordIds, passwords]);

  const handleLoginRedirect = () => {
    const currentState = {
      eventoId,
      selectedCategory: selectedCategory?.id,
      selectedNumbers,
      selectedPasswordIds,
      categorias,
    };

    localStorage.setItem("loginRedirectState", JSON.stringify(currentState));
    localStorage.setItem(
      "loginRedirectUrl",
      window.location.pathname + window.location.search
    );

    navigate("/login");
  };

  const handleLoginForCheckout = () => {
    const checkoutState = {
      eventoId,
      selectedCategory: selectedCategory?.id,
      selectedNumbers,
      selectedPasswordIds,
      categorias,
      isCheckout: true,
    };

    localStorage.setItem("loginRedirectState", JSON.stringify(checkoutState));
    localStorage.setItem(
      "loginRedirectUrl",
      window.location.pathname + window.location.search
    );

    navigate("/login");
  };

  const restoreSelectionAfterLogin = () => {
    const savedState = localStorage.getItem("loginRedirectState");
    if (savedState) {
      try {
        const state = JSON.parse(savedState);

        if (state.selectedCategory) {
          const category = categorias.find(
            (cat) => cat.id === state.selectedCategory
          );
          if (category) {
            setSelectedCategory(category);
          }
        }

        if (state.selectedNumbers && state.selectedNumbers.length > 0) {
          setSelectedNumbers(state.selectedNumbers);
        }

        if (state.selectedPasswordIds && state.selectedPasswordIds.length > 0) {
          setSelectedPasswordIds(state.selectedPasswordIds);
        }

        localStorage.removeItem("loginRedirectState");
        localStorage.removeItem("loginRedirectUrl");

        toast({
          title: "Bem-vindo de volta!",
          description: state.isCheckout
            ? "Sua seleção foi restaurada. Continue para o checkout."
            : "Sua seleção foi restaurada.",
        });

        if (state.isCheckout) {
          setTimeout(() => {
            const checkoutButton = document.querySelector(
              'button[class*="h-12"]'
            );
            checkoutButton?.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
          }, 500);
        }
      } catch (error) {
        console.error("Erro ao restaurar estado:", error);
      }
    }
  };

  useEffect(() => {
    if (isAuthenticated && categorias.length > 0) {
      restoreSelectionAfterLogin();
    }
  }, [isAuthenticated, categorias]);

  const toggleNumber = (num: number) => {
    const numberInfo = passwords.find((n) => Number(n.number) === num);
    if (!numberInfo || numberInfo.status !== PasswordStatusEnum.AVAILABLE) {
      return;
    }

    const passwordId = numberInfo.id;
    if (!passwordId) {
      console.error("Password ID não encontrado para o número:", num);
      toast({
        title: "Erro",
        description: "Não foi possível selecionar esta senha. Tente novamente.",
        variant: "destructive",
      });
      return;
    }

    setSelectedNumbers((prev) => {
      const newSelectedNumbers = prev.includes(num)
        ? prev.filter((n) => n !== num)
        : [...prev, num];

      return newSelectedNumbers;
    });

    setSelectedPasswordIds((prev) => {
      const newSelectedPasswordIds = prev.includes(passwordId)
        ? prev.filter((id) => id !== passwordId)
        : [...prev, passwordId];

      return newSelectedPasswordIds;
    });
  };

  const getNumberColor = (numberInfo: PasswordResponse) => {
    if (numberInfo.status !== PasswordStatusEnum.AVAILABLE) {
      switch (numberInfo.status) {
        case PasswordStatusEnum.RESERVED:
          return "bg-green-500 text-white border-green-500";
        case PasswordStatusEnum.USED:
          return "bg-gray-400 text-white border-gray-500";
        default:
          return "bg-muted text-muted-foreground opacity-50";
      }
    }

    return selectedNumbers.includes(Number(numberInfo.number))
      ? "bg-primary text-white border-primary"
      : "bg-background hover:bg-accent hover:border-accent-foreground cursor-pointer";
  };

  const getNumberTooltip = (numberInfo: PasswordResponse) => {
    if (numberInfo.status !== PasswordStatusEnum.AVAILABLE) {
      const statusMap: Record<string, string> = {
        [PasswordStatusEnum.AVAILABLE]: "disponível",
        [PasswordStatusEnum.RESERVED]: "reservada",
        [PasswordStatusEnum.USED]: "usada",
      };
      return `Senha ${statusMap[numberInfo.status] || "indisponível"}`;
    }
    return "Disponível";
  };

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Login necessário",
        description: "Faça login para finalizar a compra",
        variant: "destructive",
      });
      handleLoginForCheckout();
      return;
    }

    if (selectedNumbers.length === 0) {
      toast({
        description: "Selecione ao menos uma senha para continuar",
        variant: "destructive",
      });
      return;
    }

    if (selectedPasswordIds.length === 0) {
      toast({
        description:
          "Erro nas senhas selecionadas. Por favor, recarregue a página.",
        variant: "destructive",
      });
      return;
    }

    if (!acceptedTerms) {
      toast({
        description: "Você precisa aceitar o regulamento do evento",
        variant: "destructive",
      });
      return;
    }

    // Verificar se há inconsistência
    if (selectedNumbers.length !== selectedPasswordIds.length) {
      toast({
        title: "Erro",
        description:
          "Inconsistência nas senhas selecionadas. Por favor, selecione novamente.",
        variant: "destructive",
      });
      return;
    }

    try {
      // console.log("Enviando para compra:", {
      //   eventId: eventoId,
      //   categoryId: selectedCategory?.category.id,
      //   passwordIds: selectedPasswordIds,
      //   selectedNumbers: selectedNumbers,
      // });

      const result = await purchasePasswords({
        eventId: eventoId,
        categoryId: selectedCategory?.category.id || "",
        passwordIds: selectedPasswordIds,
      });

      toast({
        title: "Sucesso!",
        description: "Compra realizada com sucesso!",
      });

      // Limpar seleções após compra bem-sucedida
      setSelectedNumbers([]);
      setSelectedPasswordIds([]);
      setAcceptedTerms(false);

      // Recarregar as senhas para atualizar o status
      carregarPasswords();
    } catch (error) {
      console.error("Erro na compra:", error);

      let errorMessage =
        "Não foi possível processar a compra. Tente novamente.";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast({
        title: "Erro na compra",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const resetSelection = () => {
    setSelectedCategory(null);
    setPasswords([]);
    setSelectedNumbers([]);
    setSelectedPasswordIds([]);
    setAcceptedTerms(false);
  };

  const getAvailableSpots = () => {
    if (!selectedCategory) return 0;
    const totalSpots = selectedCategory.maxRunners || 0;
    const occupiedSpots = passwords.filter(
      (p) => p.status !== PasswordStatusEnum.AVAILABLE
    ).length;
    return totalSpots - occupiedSpots;
  };

  const getOccupiedSpots = () => {
    return passwords.filter((p) => p.status !== PasswordStatusEnum.AVAILABLE)
      .length;
  };

  if (loading) {
    return (
      <Card className="border-2">
        <CardContent className="pt-8 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Carregando categorias...</p>
        </CardContent>
      </Card>
    );
  }

  if (categorias.length === 0) {
    return (
      <Card className="border-2">
        <CardContent className="pt-8 text-center text-muted-foreground">
          <Users className="h-16 w-16 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-semibold mb-2">
            Nenhuma categoria disponível
          </h3>
          <p>As categorias serão disponibilizadas em breve</p>
        </CardContent>
      </Card>
    );
  }

  const availableSpots = selectedCategory ? getAvailableSpots() : 0;
  const totalSpots = selectedCategory?.maxRunners || 0;
  const occupiedSpots = getOccupiedSpots();

  return (
    <div className="space-y-6">
      {!isAuthenticated && selectedNumbers.length > 0 && (
        <Card className="border-2 border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <LogIn className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium text-blue-800">
                    Faça login para finalizar sua compra
                  </p>
                  <p className="text-sm text-blue-600">
                    Sua seleção será salva e você poderá continuar de onde parou
                  </p>
                </div>
              </div>
              <Button onClick={handleLoginRedirect} size="sm">
                Fazer Login
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {!selectedCategory ? (
        <div>
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Selecione a Categoria
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categorias.map((categoria) => (
              <Card
                key={categoria.id}
                className="cursor-pointer hover:border-primary/50 transition-all border-2"
                onClick={() => setSelectedCategory(categoria)}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {getCategoryNameMap(categoria.category.name)}
                  </CardTitle>
                  <CardDescription className="text-lg font-semibold text-primary flex items-center gap-1">
                    {formatPrice(Number(categoria.price) || 0)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">
                      {categoria.maxRunners || 0} vagas totais
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {categoria.currentRunners || 0} ocupadas
                    </span>
                  </div>
                  {categoria.category.description && (
                    <p className="text-sm text-muted-foreground mt-2">
                      {categoria.category.description}
                    </p>
                  )}
                  <div className="mt-2 text-sm text-muted-foreground">
                    Período: {new Date(categoria.startAt).toLocaleDateString()}{" "}
                    - {new Date(categoria.endAt).toLocaleDateString()}
                  </div>
                  <div className="mt-2 text-sm text-muted-foreground">
                    Limite de senhas por participante:{" "}
                    <span className="font-semibold">
                      {categoria.passwordLimit || 1}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <Card className="border-2 bg-primary/5">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    {getCategoryNameMap(selectedCategory.category.name)}
                  </h3>
                  <p className="text-muted-foreground mt-1">
                    {formatPrice(Number(selectedCategory.price) || 0)} por senha
                    • {availableSpots} vagas disponíveis de {totalSpots}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Período da categoria:{" "}
                    {new Date(selectedCategory.startAt).toLocaleDateString()} -{" "}
                    {new Date(selectedCategory.endAt).toLocaleDateString()}
                  </p>
                </div>
                <Button variant="outline" onClick={resetSelection}>
                  Trocar categoria
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Mapa de Senhas
              </CardTitle>
              <CardDescription>
                {loadingPasswords
                  ? "Carregando senhas disponíveis..."
                  : `Selecione os números desejados (${
                      selectedNumbers.length
                    } selecionadas) • ${availableSpots} vagas livres de ${totalSpots} • LIMITE DE SENHAS: ${
                      selectedCategory.passwordLimit || 1
                    }`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingPasswords ? (
                <div className="text-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                  <p className="text-muted-foreground">
                    Carregando senhas disponíveis...
                  </p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2 mb-6">
                    {passwords
                      .slice()
                      .sort((a, b) => Number(a.number) - Number(b.number))
                      .map((numberInfo) => {
                        const isSelected = selectedNumbers.includes(
                          Number(numberInfo.number)
                        );
                        const selectionLimitReached =
                          !isSelected &&
                          selectedNumbers.length >=
                            (selectedCategory.passwordLimit || 1);

                        return (
                          <button
                            key={numberInfo.number}
                            onClick={() => {
                              if (
                                numberInfo.status ===
                                  PasswordStatusEnum.AVAILABLE &&
                                !selectionLimitReached
                              ) {
                                toggleNumber(Number(numberInfo.number));
                              }
                            }}
                            disabled={
                              numberInfo.status !==
                                PasswordStatusEnum.AVAILABLE ||
                              selectionLimitReached
                            }
                            title={
                              selectionLimitReached
                                ? `Limite de ${
                                    selectedCategory.passwordLimit || 1
                                  } senhas atingido`
                                : getNumberTooltip(numberInfo)
                            }
                            className={`
                              aspect-square rounded-lg border-2 font-semibold text-sm
                              transition-all relative
                              ${getNumberColor(numberInfo)}
                              ${
                                numberInfo.status !==
                                  PasswordStatusEnum.AVAILABLE ||
                                selectionLimitReached
                                  ? "cursor-not-allowed"
                                  : "cursor-pointer"
                              }
                            `}
                          >
                            {numberInfo.number}
                            {numberInfo.status !==
                              PasswordStatusEnum.AVAILABLE && (
                              <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-current"></div>
                            )}
                          </button>
                        );
                      })}
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded border-2 bg-background"></div>
                      <span className="text-muted-foreground">Disponível</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded border-2 bg-primary"></div>
                      <span className="text-muted-foreground">Selecionada</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded border-2 bg-green-500"></div>
                      <span className="text-muted-foreground">Confirmada</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded border-2 bg-orange-400"></div>
                      <span className="text-muted-foreground">Pendente</span>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {!loadingPasswords && (
            <Card className="border-2 bottom-6 bg-background/95 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Categoria:</span>
                      <p className="font-medium">
                        {getCategoryNameMap(selectedCategory.category.name)}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">
                        Senhas selecionadas:
                      </span>
                      <p className="font-medium">{selectedNumbers.length}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">
                        Valor unitário:
                      </span>
                      <p className="font-medium">
                        {formatPrice(Number(selectedCategory.price) || 0)}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Total:</span>
                      <p className="text-lg font-bold text-primary">
                        {formatPrice(
                          (Number(selectedCategory.price) || 0) *
                            selectedNumbers.length
                        )}
                      </p>
                    </div>
                  </div>

                  {selectedNumbers.length > 0 && (
                    <div className="text-xs text-muted-foreground bg-muted/30 p-2 rounded">
                      <strong>Números selecionados:</strong>{" "}
                      {selectedNumbers.sort((a, b) => a - b).join(", ")}
                    </div>
                  )}

                  <div className="flex items-start gap-3 pt-2">
                    <Checkbox
                      id="terms"
                      checked={acceptedTerms}
                      onCheckedChange={(checked) =>
                        setAcceptedTerms(checked as boolean)
                      }
                    />
                    <label
                      htmlFor="terms"
                      className="text-sm text-muted-foreground cursor-pointer"
                    >
                      Li e concordo com o regulamento do evento e com os termos
                      de uso da plataforma
                    </label>
                  </div>

                  {!isAuthenticated ? (
                    <div className="space-y-3">
                      <Button
                        className="w-full h-12 text-base"
                        size="lg"
                        onClick={handleLoginForCheckout}
                      >
                        <LogIn className="h-5 w-5 mr-2" />
                        Fazer Login para Finalizar Compra (
                        {selectedNumbers.length} senha
                        {selectedNumbers.length !== 1 ? "s" : ""})
                      </Button>
                      <p className="text-xs text-center text-muted-foreground">
                        Sua seleção será salva e você poderá continuar após o
                        login
                      </p>
                    </div>
                  ) : (
                    <Button
                      className="w-full h-12 text-base"
                      size="lg"
                      onClick={handleCheckout}
                      disabled={
                        selectedNumbers.length === 0 ||
                        !acceptedTerms ||
                        loadingPasswords
                      }
                    >
                      <ShoppingCart className="h-5 w-5 mr-2" />
                      Finalizar Compra ({selectedNumbers.length} senha
                      {selectedNumbers.length !== 1 ? "s" : ""})
                    </Button>
                  )}

                  <div className="flex items-center gap-2 text-xs text-muted-foreground justify-center">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    <span>Pagamento 100% seguro</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

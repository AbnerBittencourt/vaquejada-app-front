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
import { Checkbox } from "@/components/ui/checkbox";
import { Users, ArrowLeft, Shield, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { formatCPF, formatPhone } from "@/utils/format-data.util";

const Cadastro = () => {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cpf, setCpf] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmSenha, setConfirmSenha] = useState("");
  const [aceitouTermos, setAceitouTermos] = useState(false);
  const [loading, setLoading] = useState(false);
  const { cadastrar } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!aceitouTermos) {
      toast.error("Você precisa aceitar os termos de uso");
      return;
    }

    if (senha !== confirmSenha) {
      toast.error("As senhas não coincidem");
      return;
    }

    if (senha.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    setLoading(true);
    try {
      await cadastrar({ nome, email, senha, cpf, telefone });
    } catch (error) {
      toast.error("Erro ao criar conta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-primary/5 flex items-center justify-center p-4">
      <div className="absolute top-10 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"></div>

      <div className="w-full max-w-lg relative z-10">
        <div className="text-center mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6 group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Voltar para eventos
          </Link>

          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-xl blur-sm"></div>
              <Users className="h-10 w-10 text-primary relative z-10" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Trilha do Vaqueiro
            </h1>
          </div>
        </div>

        <Card className="bg-card/80 backdrop-blur-sm border-2 shadow-2xl">
          <CardHeader className="space-y-4 pb-6">
            <div className="text-center">
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                Criar Conta
              </CardTitle>
              <CardDescription className="text-base">
                Cadastre-se e comece a participar das melhores vaquejadas
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label htmlFor="nome" className="text-sm font-medium">
                    Nome completo *
                  </Label>
                  <Input
                    id="nome"
                    placeholder="Seu nome completo"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    required
                    className="rounded-xl border-2 focus:border-primary/50 transition-all bg-background/50"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="email" className="text-sm font-medium">
                    E-mail *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="rounded-xl border-2 focus:border-primary/50 transition-all bg-background/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label htmlFor="cpf" className="text-sm font-medium">
                    CPF *
                  </Label>
                  <Input
                    id="cpf"
                    type="text"
                    placeholder="000.000.000-00"
                    value={cpf}
                    onChange={(e) => {
                      const v = formatCPF(e.target.value);
                      setCpf(v);
                    }}
                    required
                    maxLength={14}
                    className="rounded-xl border-2 focus:border-primary/50 transition-all bg-background/50"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="telefone" className="text-sm font-medium">
                    Telefone
                  </Label>
                  <Input
                    id="telefone"
                    type="tel"
                    placeholder="(00) 00000-0000"
                    value={telefone}
                    onChange={(e) => {
                      const v = formatPhone(e.target.value);
                      setTelefone(v);
                    }}
                    className="rounded-xl border-2 focus:border-primary/50 transition-all bg-background/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Senha *
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    required
                    minLength={6}
                    className="rounded-xl border-2 focus:border-primary/50 transition-all bg-background/50"
                  />
                </div>

                <div className="space-y-3">
                  <Label
                    htmlFor="confirm-password"
                    className="text-sm font-medium"
                  >
                    Confirmar senha *
                  </Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="••••••••"
                    value={confirmSenha}
                    onChange={(e) => setConfirmSenha(e.target.value)}
                    required
                    className="rounded-xl border-2 focus:border-primary/50 transition-all bg-background/50"
                  />
                </div>
              </div>

              <div className="bg-muted/30 rounded-xl p-4 border">
                <h4 className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary" />
                  Sua senha deve conter:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <CheckCircle2
                      className={`h-3 w-3 ${
                        senha.length >= 6
                          ? "text-green-500"
                          : "text-muted-foreground"
                      }`}
                    />
                    <span>Mínimo 6 caracteres</span>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-3 bg-muted/30 rounded-xl p-4 border">
                <Checkbox
                  id="terms"
                  checked={aceitouTermos}
                  onCheckedChange={(checked) =>
                    setAceitouTermos(checked as boolean)
                  }
                  className="mt-0.5 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <label
                  htmlFor="terms"
                  className="text-sm text-foreground leading-relaxed cursor-pointer"
                >
                  Concordo com os{" "}
                  <Link
                    to="/termos"
                    className="text-primary hover:underline font-medium"
                  >
                    termos de uso
                  </Link>{" "}
                  e{" "}
                  <Link
                    to="/privacidade"
                    className="text-primary hover:underline font-medium"
                  >
                    política de privacidade
                  </Link>
                </label>
              </div>

              <Button
                className="w-full rounded-xl py-3 text-base font-medium shadow-lg hover:shadow-xl transition-all bg-primary hover:bg-primary/90"
                size="lg"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
                    Criando conta...
                  </div>
                ) : (
                  "Criar Minha Conta"
                )}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Já tem uma conta?
                </span>
              </div>
            </div>

            <div className="text-center">
              <Button
                variant="outline"
                className="w-full rounded-xl border-2 hover:border-primary/50"
                asChild
              >
                <Link to="/login" className="flex items-center gap-2">
                  Fazer Login
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Cadastro;

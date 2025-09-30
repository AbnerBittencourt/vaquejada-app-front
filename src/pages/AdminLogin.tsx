import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const AdminLogin = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4">
          <Button variant="ghost" size="sm" className="w-fit" asChild>
            <Link to="/" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Link>
          </Button>
          <div className="flex justify-center">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Shield className="h-8 w-8 text-primary" />
            </div>
          </div>
          <div className="text-center">
            <CardTitle className="text-2xl">Área do Administrador</CardTitle>
            <CardDescription>Acesso restrito para organizadores</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="admin-email">E-mail</Label>
              <Input id="admin-email" type="email" placeholder="admin@parque.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-password">Senha</Label>
              <Input id="admin-password" type="password" placeholder="••••••••" />
            </div>
          </div>

          <Button className="w-full" size="lg" asChild>
            <Link to="/admin/dashboard">Entrar no painel</Link>
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            Não tem acesso administrativo?{" "}
            <Link to="/admin/cadastro" className="text-primary hover:underline font-medium">
              Cadastre seu parque
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;

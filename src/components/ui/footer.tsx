import { Link } from "react-router-dom";
import { Users } from "lucide-react";
import logo from "@/assets/logo.png";

export const Footer = () => {
  return (
    <footer className="border-t bg-card/50 backdrop-blur-sm py-10 px-4">
      <div className="container mx-auto">
        <div className="flex flex-col items-center gap-6">
          {/* Logo e Nome */}
          <div className="flex items-center gap-3">
            <img
              src={logo}
              alt="Vaquejada APP"
              className="h-10 w-10 object-contain"
            />
            <span className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Vaquejada APP
            </span>
          </div>

          {/* Descrição */}
          <p className="text-muted-foreground text-center max-w-md">
            Simplificando a experiência em vaquejadas para participantes e
            organizadores
          </p>

          {/* Links */}
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <Link
              to="/quem-somos"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Quem Somos
            </Link>
            <Link
              to="/como-contratar"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Como Contratar
            </Link>
            <Link
              to="/fale-conosco"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Fale Conosco
            </Link>
            <Link
              to="/politica-privacidade"
              className="text-muted-foreground hover:text-primary transition-colors font-medium"
            >
              Política de Privacidade
            </Link>
            <Link
              to="/politica-cancelamento"
              className="text-muted-foreground hover:text-primary transition-colors font-medium"
            >
              Cancelamento e Reembolso
            </Link>
            <Link
              to="/termos-uso"
              className="text-muted-foreground hover:text-primary transition-colors font-medium"
            >
              Termos de Uso
            </Link>
          </div>

          {/* Copyright */}
          <div className="text-center border-t pt-6 w-full">
            <p className="text-sm text-muted-foreground">
              © 2025 AMJ Group Softwares LTDA. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

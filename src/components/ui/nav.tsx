import { UserRoleEnum } from "@/types/enums/api-enums";
import { Link } from "react-router-dom";

interface NavigationProps {
  isAuthenticated: boolean;
  user: { role: UserRoleEnum };
}

export const Navigation = ({ isAuthenticated, user }: NavigationProps) => {
  return (
    <nav className="hidden md:flex items-center gap-8">
      <Link
        to="/"
        className="text-foreground/80 hover:text-primary font-medium transition-all duration-200 hover:scale-105"
      >
        Eventos
      </Link>

      {isAuthenticated &&
        user.role !== UserRoleEnum.JUDGE &&
        user.role !== UserRoleEnum.SPEAKER && (
          <Link
            to="/meus-ingressos"
            className="text-foreground/80 hover:text-primary font-medium transition-all duration-200 hover:scale-105"
          >
            Meus Ingressos
          </Link>
        )}

      {isAuthenticated && user.role === UserRoleEnum.JUDGE && (
        <Link
          to="/juiz"
          className="text-foreground/80 hover:text-primary font-medium transition-all duration-200 hover:scale-105"
        >
          Área do Juiz
        </Link>
      )}

      {isAuthenticated && user.role === UserRoleEnum.SPEAKER && (
        <Link
          to="/locutor"
          className="text-foreground/80 hover:text-primary font-medium transition-all duration-200 hover:scale-105"
        >
          Área do Locutor
        </Link>
      )}
    </nav>
  );
};

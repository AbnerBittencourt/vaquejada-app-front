import { Link, useLocation } from "react-router-dom";
import { Award, User, LogOut, ArrowRight, Settings, Bell } from "lucide-react";
import { UserRoleEnum } from "@/types/enums/api-enums";
import { Button } from "./button";
import { Badge } from "./badge";
import { roleMap } from "@/types/enums/enum-maps";
import { Navigation } from "./nav";

interface HeaderProps {
  user: {
    name: string;
    role: UserRoleEnum;
    email?: string;
    avatar?: string;
  };
  onLogout: () => void;
  isAuthenticated?: boolean;
  title?: string;
  showUserDropdown?: boolean;
  notificationsCount?: number;
  onSettingsClick?: () => void;
  customActions?: React.ReactNode;
}

export const Header = ({
  user,
  onLogout,
  title = `Área do ${roleMap[user.role]}`,
  isAuthenticated,
  showUserDropdown = true,
  notificationsCount = 0,
  onSettingsClick,
  customActions,
}: HeaderProps) => {
  const location = useLocation();
  const getTitleByPath = () => {
    const pathTitles: Record<string, string> = {
      "/juiz": "Área do Juiz",
      "/meus-ingressos": "Meus Ingressos",
      "/eventos": "Eventos",
      "/locutor": "Área do Locutor",
      "/admin": "Painel Administrativo",
    };
    return pathTitles[location.pathname] || title;
  };

  return (
    <header className="border-b bg-background/80 backdrop-blur-md sticky top-0 z-50 supports-backdrop-blur:bg-background/60">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 rounded-xl blur-sm group-hover:blur-md transition-all" />
            <Award className="h-8 w-8 text-primary relative z-10 group-hover:scale-110 transition-transform" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            {getTitleByPath()}
          </h1>
        </Link>

        {user.role !== UserRoleEnum.ADMIN &&
          user.role !== UserRoleEnum.ORGANIZER && (
            <Navigation isAuthenticated={isAuthenticated} user={user} />
          )}

        <div className="flex items-center gap-3">
          {customActions}

          {notificationsCount > 0 && isAuthenticated && (
            <Button
              variant="ghost"
              size="icon"
              className="relative rounded-full"
            >
              <Bell className="h-5 w-5" />
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
              >
                {notificationsCount}
              </Badge>
            </Button>
          )}

          {onSettingsClick && isAuthenticated && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onSettingsClick}
              className="rounded-full"
            >
              <Settings className="h-5 w-5" />
            </Button>
          )}

          {isAuthenticated ? (
            showUserDropdown && (
              <div className="relative group">
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-primary/10 transition-all duration-200 border border-transparent hover:border-primary/20"
                >
                  <div className="flex items-center gap-2">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-primary/70 flex items-center justify-center">
                        <User className="h-4 w-4 text-primary-foreground" />
                      </div>
                    )}
                    <span className="font-medium max-w-[120px] truncate hidden sm:block">
                      {user.name}
                    </span>
                  </div>
                </Button>

                <div className="absolute right-0 top-full mt-2 min-w-[200px] bg-card/95 backdrop-blur-md border rounded-2xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden">
                  <div className="p-2">
                    <div className="px-3 py-2 border-b border-border/50 mb-1">
                      <p className="text-sm font-medium text-foreground truncate">
                        {user.name}
                      </p>
                      {user.email && (
                        <p className="text-xs text-muted-foreground truncate mt-1">
                          {user.email}
                        </p>
                      )}
                    </div>

                    <Link
                      to={
                        user.role === UserRoleEnum.ADMIN
                          ? "/admin/perfil"
                          : "/perfil-corredor"
                      }
                      className="flex items-center gap-3 w-full px-3 py-2 text-sm text-foreground hover:bg-accent rounded-lg transition-all duration-200 group/item mb-1"
                    >
                      <User className="h-4 w-4 text-primary" />
                      <span>Meu Perfil</span>
                      <ArrowRight className="h-3 w-3 ml-auto opacity-0 group-hover/item:opacity-100 transition-opacity" />
                    </Link>

                    {onSettingsClick && (
                      <button
                        onClick={onSettingsClick}
                        className="flex items-center gap-3 w-full px-3 py-2 text-sm text-foreground hover:bg-accent rounded-lg transition-all duration-200 group/item mb-1"
                      >
                        <Settings className="h-4 w-4" />
                        <span>Configurações</span>
                        <ArrowRight className="h-3 w-3 ml-auto opacity-0 group-hover/item:opacity-100 transition-opacity" />
                      </button>
                    )}

                    <button
                      onClick={onLogout}
                      className="flex items-center gap-3 w-full px-3 py-2 text-sm text-foreground hover:bg-destructive/10 hover:text-destructive rounded-lg transition-all duration-200 group/item"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sair</span>
                      <ArrowRight className="h-3 w-3 ml-auto opacity-0 group-hover/item:opacity-100 transition-opacity" />
                    </button>
                  </div>
                </div>
              </div>
            )
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
  );
};

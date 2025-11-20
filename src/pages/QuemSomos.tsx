import { Header } from "@/components/ui/header";
import { useAuth } from "@/contexts/AuthContext";
import { UserRoleEnum } from "@/types/enums/api-enums";
import { Award, Target, Eye, Heart } from "lucide-react";

const QuemSomos = () => {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Header
        user={user || { name: "Usuário", role: UserRoleEnum.USER }}
        onLogout={logout}
        isAuthenticated={isAuthenticated}
        title="Vaquejada APP"
      />

      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Título Principal */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              QUEM SOMOS
            </h1>
          </div>

          {/* Conteúdo Principal */}
          <div className="space-y-8">
            {/* Introdução */}
            <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-8 border-2 border-border/50 hover:border-primary/30 transition-all duration-300">
              <p className="text-lg text-foreground/90 leading-relaxed mb-4">
                O <span className="font-semibold text-primary">AMJ Group Softwares LTDA</span>, fundado com amor, propósito e uma visão voltada para o futuro, nasceu como uma homenagem de um pai aos seus filhos. Um símbolo do que mais valorizamos: o legado, a família e os laços que atravessam gerações.
              </p>

              <p className="text-lg text-foreground/90 leading-relaxed mb-4">
                Mais do que um negócio, somos a materialização de um sonho: construir algo que inspire, cuide e prospere, assim como desejamos para aqueles que amamos. Cada decisão, cada passo e cada conquista têm como base os valores herdados e transmitidos com orgulho, ética, responsabilidade, união e respeito.
              </p>

              <p className="text-lg text-foreground/90 leading-relaxed">
                Acreditamos que o verdadeiro sucesso vai além dos resultados. Ele está em deixar uma marca positiva no mundo e preparar o caminho para as próximas gerações. Por isso, trabalhamos todos os dias com o coração voltado para o futuro, sem esquecer as raízes que nos sustentam.
              </p>
            </div>

            {/* Missão, Visão e Valores */}
            <div className="grid md:grid-cols-1 gap-6">
              {/* Missão */}
              <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-8 border-2 border-primary/20 hover:border-primary/40 transition-all duration-300 group">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Target className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">Missão</h2>
                </div>
                <p className="text-foreground/90 leading-relaxed">
                  Construir um legado sólido e duradouro, sendo pioneiro e referência do aplicativo esportivo de Vaquejada.
                </p>
              </div>

              {/* Visão */}
              <div className="bg-gradient-to-br from-secondary/5 to-secondary/10 rounded-2xl p-8 border-2 border-secondary/20 hover:border-secondary/40 transition-all duration-300 group">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Eye className="h-6 w-6 text-secondary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">Visão</h2>
                </div>
                <p className="text-foreground/90 leading-relaxed">
                  Informatizar a Vaquejada Brasileira, levando as informações do esporte Vaquejada em tempo real a todo o mundo e na palma da mão.
                </p>
              </div>

              {/* Valores */}
              <div className="bg-gradient-to-br from-accent/5 to-accent/10 rounded-2xl p-8 border-2 border-accent/20 hover:border-accent/40 transition-all duration-300 group">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Heart className="h-6 w-6 text-accent" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">Valores</h2>
                </div>
                <p className="text-foreground/90 leading-relaxed">
                  Baseados em princípios familiares, atuando com integridade, excelência e amor em tudo o que fazemos.
                </p>
              </div>
            </div>

            {/* Call to Action */}
            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-8 text-center border-2 border-primary/20">
              <Award className="h-16 w-16 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-3 text-foreground">
                Construindo o Futuro da Vaquejada
              </h3>
              <p className="text-foreground/80 max-w-2xl mx-auto">
                Junte-se a nós nessa jornada de inovação, tradição e paixão pelo esporte que amamos.
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t bg-card/50 backdrop-blur-sm py-10 px-4">
        <div className="container mx-auto">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              © 2025 AMJ Group Softwares LTDA. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default QuemSomos;

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Calendar, MapPin, Search, Users } from "lucide-react";
import { Link } from "react-router-dom";

const events = [
  {
    id: 1,
    name: "Vaquejada do Parque Santa Cruz",
    date: "15/04/2025",
    location: "Santa Cruz do Capibaribe - PE",
    image: "https://images.unsplash.com/photo-1553696590-4b3f68898333",
    price: "R$ 150,00",
    categories: ["Amador", "Profissional", "Aspirante"]
  },
  {
    id: 2,
    name: "Rodeio Campina Grande",
    date: "22/04/2025",
    location: "Campina Grande - PB",
    image: "https://images.unsplash.com/photo-1534293230397-c067fc201ab8",
    price: "R$ 200,00",
    categories: ["Profissional", "Mirim"]
  },
  {
    id: 3,
    name: "Vaquejada de Caruaru",
    date: "29/04/2025",
    location: "Caruaru - PE",
    image: "https://images.unsplash.com/photo-1516467508483-a7212febe31a",
    price: "R$ 180,00",
    categories: ["Amador", "Profissional", "Aspirante", "Mirim"]
  }
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-50 backdrop-blur-sm bg-card/95">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Vaquei Fácil</h1>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-foreground hover:text-primary transition-colors">
              Eventos
            </Link>
            <Link to="/meus-ingressos" className="text-foreground hover:text-primary transition-colors">
              Meus Ingressos
            </Link>
            <Link to="/perfil-corredor" className="text-foreground hover:text-primary transition-colors">
              Perfil do Corredor
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link to="/login">Entrar</Link>
            </Button>
            <Button asChild>
              <Link to="/cadastro">Cadastrar</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-10"></div>
        <div className="container mx-auto relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-5xl font-bold mb-6 text-foreground">
              Sua vaquejada começa aqui
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Compre suas senhas, gerencie suas inscrições e acompanhe os eventos de forma fácil e rápida
            </p>
            
            {/* Search Bar */}
            <div className="flex gap-3 max-w-2xl mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                  placeholder="Buscar eventos por cidade ou nome..." 
                  className="pl-10"
                />
              </div>
              <Button size="lg">Buscar</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-3xl font-bold text-foreground">Próximos Eventos</h3>
            <Button variant="outline">Ver todos</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={event.image} 
                    alt={event.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="text-xl">{event.name}</CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {event.location}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-muted-foreground mb-4">
                    <Calendar className="h-4 w-4" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {event.categories.map((cat) => (
                      <span 
                        key={cat} 
                        className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                  <p className="text-2xl font-bold text-primary">{event.price}</p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" asChild>
                    <Link to={`/evento/${event.id}`}>Ver detalhes</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Admin Login Link */}
      <section className="py-12 px-4 bg-muted/50">
        <div className="container mx-auto text-center">
          <p className="text-muted-foreground mb-4">É organizador de eventos?</p>
          <Button variant="outline" asChild>
            <Link to="/admin/login">Fazer login como administrador</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-4">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>© 2025 Vaquei Fácil. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;

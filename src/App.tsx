import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import EventoDetalhes from "./pages/EventoDetalhes";
import PerfilCorredor from "./pages/PerfilCorredor";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import PerfilAdmin from "./pages/PerfilAdmin";
import ComprarSenhas from "./pages/ComprarSenhas";
import MeusIngressos from "./pages/MeusIngressos";
import NotFound from "./pages/NotFound";
import JudgePage from "./pages/JudgePage";
import SpeakerPage from "./pages/SpeakerPage";
import QuemSomos from "./pages/QuemSomos";
import ComoContratar from "./pages/ComoContratar";
import FaleConosco from "./pages/FaleConosco";
import PoliticaPrivacidade from "./pages/PoliticaPrivacidade";
import PoliticaCancelamento from "./pages/PoliticaCancelamento";
import TermosUso from "./pages/TermosUso";
import CheckoutSuccess from "./pages/CheckoutSuccess";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/quem-somos" element={<QuemSomos />} />
            <Route path="/como-contratar" element={<ComoContratar />} />
            <Route path="/fale-conosco" element={<FaleConosco />} />
            <Route path="/politica-privacidade" element={<PoliticaPrivacidade />} />
            <Route path="/politica-cancelamento" element={<PoliticaCancelamento />} />
            <Route path="/termos-uso" element={<TermosUso />} />
            <Route path="/checkout/success" element={<CheckoutSuccess />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<Cadastro />} />
            <Route path="/evento/:id" element={<EventoDetalhes />} />
            <Route path="/perfil-corredor" element={<PerfilCorredor />} />
            <Route path="/comprar-senhas/:id" element={<ComprarSenhas />} />
            <Route path="/meus-ingressos" element={<MeusIngressos />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/perfil" element={<PerfilAdmin />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/juiz" element={<JudgePage />} />
            <Route path="/locutor" element={<SpeakerPage />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;


import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Customers from "./pages/Customers";
import Vehicles from "./pages/Vehicles";
import ServiceOrders from "./pages/ServiceOrders";
import Inventory from "./pages/Inventory";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import TeamManagement from "./pages/TeamManagement";
import Welcome from "./pages/Welcome";
import WorkshopSettings from "./pages/WorkshopSettings";
import WorkshopServices from "./pages/WorkshopServices";
import AIAssistant from "./pages/AIAssistant";
import WhatsAppAI from "./pages/WhatsAppAI";
import Purchases from "./pages/Purchases";
import Suppliers from "./pages/Suppliers";
import Assets from "./pages/Assets";
import AcceptInvitation from "./pages/AcceptInvitation";
import NotFound from "./pages/NotFound";

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
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/vehicles" element={<Vehicles />} />
            <Route path="/service-orders" element={<ServiceOrders />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/team-management" element={<TeamManagement />} />
            <Route path="/welcome" element={<Welcome />} />
            <Route path="/workshop-settings" element={<WorkshopSettings />} />
            <Route path="/workshop-services" element={<WorkshopServices />} />
            <Route path="/ai-assistant" element={<AIAssistant />} />
            <Route path="/whatsapp-ai" element={<WhatsAppAI />} />
            <Route path="/purchases" element={<Purchases />} />
            <Route path="/suppliers" element={<Suppliers />} />
            <Route path="/assets" element={<Assets />} />
            <Route path="/accept-invitation" element={<AcceptInvitation />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

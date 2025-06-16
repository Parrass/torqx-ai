
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
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
            {/* Rotas públicas */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/accept-invitation" element={<AcceptInvitation />} />
            
            {/* Rotas protegidas */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/customers" element={<ProtectedRoute><Customers /></ProtectedRoute>} />
            <Route path="/vehicles" element={<ProtectedRoute><Vehicles /></ProtectedRoute>} />
            <Route path="/service-orders" element={<ProtectedRoute><ServiceOrders /></ProtectedRoute>} />
            <Route path="/inventory" element={<ProtectedRoute><Inventory /></ProtectedRoute>} />
            <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="/team-management" element={<ProtectedRoute><TeamManagement /></ProtectedRoute>} />
            <Route path="/welcome" element={<ProtectedRoute><Welcome /></ProtectedRoute>} />
            <Route path="/workshop-settings" element={<ProtectedRoute><WorkshopSettings /></ProtectedRoute>} />
            <Route path="/workshop-services" element={<ProtectedRoute><WorkshopServices /></ProtectedRoute>} />
            <Route path="/ai-assistant" element={<ProtectedRoute><AIAssistant /></ProtectedRoute>} />
            <Route path="/whatsapp-ai" element={<ProtectedRoute><WhatsAppAI /></ProtectedRoute>} />
            <Route path="/purchases" element={<ProtectedRoute><Purchases /></ProtectedRoute>} />
            <Route path="/suppliers" element={<ProtectedRoute><Suppliers /></ProtectedRoute>} />
            <Route path="/assets" element={<ProtectedRoute><Assets /></ProtectedRoute>} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Index from '@/pages/Index';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import Dashboard from '@/pages/Dashboard';
import Customers from '@/pages/Customers';
import Vehicles from '@/pages/Vehicles';
import ServiceOrders from '@/pages/ServiceOrders';
import Inventory from '@/pages/Inventory';
import Purchases from '@/pages/Purchases';
import Suppliers from '@/pages/Suppliers';
import Appointments from '@/pages/Appointments';
import Reports from '@/pages/Reports';
import AIAssistant from '@/pages/AIAssistant';
import WhatsAppAI from '@/pages/WhatsAppAI';
import Settings from '@/pages/Settings';
import NotFound from '@/pages/NotFound';
import Assets from '@/pages/Assets';
import TeamManagement from './pages/TeamManagement';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/vehicles" element={<Vehicles />} />
        <Route path="/service-orders" element={<ServiceOrders />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/purchases" element={<Purchases />} />
        <Route path="/suppliers" element={<Suppliers />} />
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/ai-assistant" element={<AIAssistant />} />
        <Route path="/whatsapp-ai" element={<WhatsAppAI />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/team-management" element={<TeamManagement />} />
        <Route path="/assets" element={<Assets />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

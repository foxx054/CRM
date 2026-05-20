import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { DataProvider } from "./contexts/DataContext";
import Layout from "./components/Layout/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Clients";
import Empresas from "./pages/Empresas";
import Deals from "./pages/Deals";
import Pipeline from "./pages/Pipeline";
import Tarefas from "./pages/Tarefas";
import Relatorios from "./pages/Relatorios";
import Configuracoes from "./pages/Configuracoes";
import Vendas from "./pages/Vendas";
import EmptyPage from "./pages/EmptyPage";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/cliente" element={<Clients />} />
        <Route path="/empresas" element={<Empresas />} />
        <Route path="/negocios" element={<Deals />} />
        <Route path="/pipeline" element={<Pipeline />} />
        <Route path="/tarefas" element={<Tarefas />} />
        <Route path="/relatorios" element={<Relatorios />} />
        <Route path="/vendas" element={<Vendas />} />
        <Route path="/agenda" element={<EmptyPage title="Agenda" />} />
        <Route path="/configuracoes" element={<Configuracoes />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <DataProvider>
            <AppRoutes />
          </DataProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

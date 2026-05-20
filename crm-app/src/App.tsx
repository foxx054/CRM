import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Clients";
import Deals from "./pages/Deals";
import Tasks from "./pages/Tasks";
import Pipeline from "./pages/Pipeline";
import EmptyPage from "./pages/EmptyPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/contatos" element={<Clients />} />
          <Route path="/empresas" element={<EmptyPage title="Empresas" />} />
          <Route path="/negocios" element={<Deals />} />
          <Route path="/pipeline" element={<Pipeline />} />
          <Route path="/tarefas" element={<Tasks />} />
          <Route path="/agenda" element={<EmptyPage title="Agenda" />} />
          <Route path="/relatorios" element={<EmptyPage title="Relatórios" />} />
          <Route path="/configuracoes" element={<EmptyPage title="Configurações" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

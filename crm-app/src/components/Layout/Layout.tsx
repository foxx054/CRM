import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useAuth } from "../../contexts/AuthContext";
import { IconSearch, IconPlus, IconLogout } from "@tabler/icons-react";
import "./Layout.css";

const pageTitles: Record<string, string> = {
  "/": "Dashboard",
  "/cliente": "Cliente",
  "/empresas": "Empresas",
  "/negocios": "Negócios",
  "/pipeline": "Pipeline",
  "/tarefas": "Tarefas",
  "/agenda": "Agenda",
  "/relatorios": "Relatórios",
  "/configuracoes": "Configurações",
};

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const title = pageTitles[location.pathname] || "CRM";

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-area">
        <header className="topbar">
          <div className="topbar-title">{title}</div>
          <div className="topbar-actions">
            <div className="search-box">
              <IconSearch size={16} />
              Buscar...
            </div>
            <button className="btn btn-primary" onClick={() => navigate("/negocios", { state: { novoNegocio: true } })}>
              <IconPlus size={16} />
              Novo negócio
            </button>
            <button className="btn btn-logout" onClick={logout} title="Sair">
              <IconLogout size={16} />
              {user?.username}
            </button>
          </div>
        </header>
        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

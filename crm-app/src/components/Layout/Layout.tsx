import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import { IconSearch, IconPlus } from "@tabler/icons-react";
import "./Layout.css";

const pageTitles: Record<string, string> = {
  "/": "Dashboard",
  "/contatos": "Contatos",
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
            <button className="btn btn-primary">
              <IconPlus size={16} />
              Novo negócio
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

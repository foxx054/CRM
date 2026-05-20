import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import SearchModal from "../SearchModal";
import Notificacoes from "../Notificacoes";
import "../SearchModal.css";
import "../Notificacoes.css";
import { IconSearch, IconPlus, IconLogout, IconMoon, IconSun } from "@tabler/icons-react";
import "./Layout.css";

const pageTitles: Record<string, string> = {
  "/": "Dashboard",
  "/cliente": "Cliente",
  "/empresas": "Empresas",
  "/negocios": "Negócios",
  "/pipeline": "Pipeline",
  "/tarefas": "Tarefas",
  "/relatorios": "Relatórios",
  "/agenda": "Agenda",
  "/configuracoes": "Configurações",
};

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const { theme, toggle: toggleTheme } = useTheme();
  const title = pageTitles[location.pathname] || "CRM";
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-area">
        <header className="topbar">
          <div className="topbar-title">{title}</div>
          <div className="topbar-actions">
            <div className="search-box" onClick={() => setSearchOpen(true)}>
              <IconSearch size={16} />
              Buscar... <span className="search-hint">Ctrl+K</span>
            </div>
            <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
            <Notificacoes />
            <button className="btn btn-primary" onClick={() => navigate("/negocios", { state: { novoNegocio: true } })}>
              <IconPlus size={16} />
              Novo negócio
            </button>
            <button className="btn btn-icon-only" onClick={toggleTheme} title={theme === "light" ? "Modo escuro" : "Modo claro"}>
              {theme === "light" ? <IconMoon size={16} /> : <IconSun size={16} />}
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

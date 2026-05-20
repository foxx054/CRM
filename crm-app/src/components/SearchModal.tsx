import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { IconSearch, IconUsers, IconBuilding, IconBriefcase, IconLayoutDashboard, IconChartBar } from "@tabler/icons-react";

interface SearchResult {
  label: string;
  description: string;
  route: string;
  icon: typeof IconUsers;
}

const pages: SearchResult[] = [
  { label: "Dashboard", description: "Visão geral do CRM", route: "/", icon: IconLayoutDashboard },
  { label: "Cliente", description: "Gerenciar clientes cadastrados", route: "/cliente", icon: IconUsers },
  { label: "Empresas", description: "Gerenciar empresas", route: "/empresas", icon: IconBuilding },
  { label: "Negócios", description: "Kanban de vendas", route: "/negocios", icon: IconBriefcase },
  { label: "Pipeline", description: "Funil de vendas e métricas", route: "/pipeline", icon: IconChartBar },
];

const mockData = [
  ...pages,
  { label: "João Silva", description: "Cliente · joao@exemplo.com", route: "/cliente", icon: IconUsers },
  { label: "Maria Souza", description: "Cliente · maria@exemplo.com", route: "/cliente", icon: IconUsers },
  { label: "Carlos Pereira", description: "Cliente · carlos@exemplo.com", route: "/cliente", icon: IconUsers },
  { label: "Lojas Becker", description: "Empresa · Varejo", route: "/empresas", icon: IconBuilding },
  { label: "Tech Ltda", description: "Empresa", route: "/empresas", icon: IconBuilding },
  { label: "Site institucional", description: "Negócio · Tech Ltda", route: "/negocios", icon: IconBriefcase },
  { label: "App mobile", description: "Negócio · Digital Agency", route: "/negocios", icon: IconBriefcase },
  { label: "Sala de estar completa", description: "Negócio · Lojas Becker", route: "/negocios", icon: IconBriefcase },
  { label: "Smart TV 55\"", description: "Negócio · Lojas Becker", route: "/negocios", icon: IconBriefcase },
];

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function SearchModal({ open, onClose }: Props) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery("");
    }
  }, [open]);

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (e.key === "Escape" && open) onClose();
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        if (open) onClose(); else onClose(); // toggle
      }
    }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  const results = query.trim()
    ? mockData.filter((item) =>
        [item.label, item.description].some((f) =>
          f.toLowerCase().includes(query.toLowerCase())
        )
      )
    : pages;

  function handleClick(route: string) {
    navigate(route);
    onClose();
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="search-modal" onClick={(e) => e.stopPropagation()}>
        <div className="search-modal-input">
          <IconSearch size={18} />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar páginas, clientes, empresas, negócios..."
          />
        </div>
        <div className="search-modal-results">
          {results.length === 0 && (
            <div className="search-empty">Nenhum resultado encontrado</div>
          )}
          {results.map((r, i) => (
            <div key={i} className="search-result-item" onClick={() => handleClick(r.route)}>
              <r.icon size={16} />
              <div>
                <div className="search-result-label">{r.label}</div>
                <div className="search-result-desc">{r.description}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="search-modal-footer">
          <span>Navegue com <kbd>↑</kbd><kbd>↓</kbd> e <kbd>Enter</kbd></span>
          <span><kbd>Esc</kbd> fechar</span>
        </div>
      </div>
    </div>
  );
}

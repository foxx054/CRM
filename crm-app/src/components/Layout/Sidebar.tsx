import { NavLink } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  IconDashboard,
  IconUsers,
  IconBuilding,
  IconBriefcase,
  IconShoppingCart,
  IconChartBar,
  IconChecklist,
  IconCalendar,
  IconReportAnalytics,
  IconSettings,
  IconChartDots,
} from "@tabler/icons-react";

  const navSections = [
    {
      label: "Principal",
      items: [
        { to: "/", label: "Dashboard", icon: IconDashboard },
        { to: "/cliente", label: "Cliente", icon: IconUsers },
        { to: "/empresas", label: "Empresas", icon: IconBuilding },
        { to: "/negocios", label: "Negócios", icon: IconBriefcase },
        { to: "/vendas", label: "Vendas", icon: IconShoppingCart },
      ],
    },
    {
      label: "Vendas",
      items: [
        { to: "/pipeline", label: "Pipeline", icon: IconChartBar },
        { to: "/tarefas", label: "Tarefas", icon: IconChecklist },
        { to: "/agenda", label: "Agenda", icon: IconCalendar },
      ],
    },
    {
      label: "Análise",
      items: [
        { to: "/relatorios", label: "Relatórios", icon: IconReportAnalytics },
        { to: "/configuracoes", label: "Configurações", icon: IconSettings },
      ],
    },
  ];

export default function Sidebar() {
  const { user } = useAuth();
  const initials = user?.name
    ? user.name.substring(0, 2).toUpperCase()
    : user?.username.substring(0, 2).toUpperCase() ?? "??";

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">
          <IconChartDots size={16} />
        </div>
        NovaCRM
      </div>
      {navSections.map((section) => (
        <div key={section.label}>
          <div className="nav-section-label">{section.label}</div>
          {section.items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `nav-item${isActive ? " active" : ""}`
              }
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>
      ))}
      <div className="sidebar-bottom">
        <div className="user-chip">
          <div className="user-avatar">{initials}</div>
          <div className="user-info">
            <p>{user?.name}</p>
          <span>{user?.role}</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

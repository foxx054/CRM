import { useState, useEffect } from "react";
import { useData } from "../contexts/DataContext";
import { IconBell, IconX } from "@tabler/icons-react";
import "./Notificacoes.css";

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function Notificacoes() {
  const { deals, tasks } = useData();
  const [open, setOpen] = useState(false);
  const [staleDays, setStaleDays] = useState(14);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("crm_settings");
      if (stored) setStaleDays(JSON.parse(stored).staleDays ?? 14);
    } catch { /* ignore */ }
  }, []);

  const staleDeals = deals.filter((d) => {
    if (d.stage === "venda_concluida" || d.stage === "pos_venda") return false;
    const days = (Date.now() - new Date(d.createdAt).getTime()) / (1000 * 60 * 60 * 24);
    return days > staleDays;
  });

  const pendingTasks = tasks.filter((t) => !t.done);
  const notifications = [
    ...staleDeals.map((d) => ({
      id: d.id,
      type: "warning" as const,
      text: `Negócio parado: "${d.title}" — ${formatCurrency(d.value)}`,
      time: `${Math.round((Date.now() - new Date(d.createdAt).getTime()) / (1000 * 60 * 60 * 24))} dias sem avanço`,
    })),
    ...pendingTasks.map((t) => ({
      id: t.id,
      type: "info" as const,
      text: t.title,
      time: "Pendente",
    })),
  ];

  const totalCount = staleDeals.length + pendingTasks.length;

  return (
    <div className="notif-wrapper">
      <button className="btn btn-icon-only notif-btn" onClick={() => setOpen(!open)} title="Notificações">
        <IconBell size={16} />
        {totalCount > 0 && <span className="notif-badge">{totalCount}</span>}
      </button>

      {open && (
        <>
          <div className="notif-backdrop" onClick={() => setOpen(false)} />
          <div className="notif-dropdown">
            <div className="notif-header">
              <span>Notificações</span>
              <button className="btn-icon" onClick={() => setOpen(false)}><IconX size={14} /></button>
            </div>
            <div className="notif-list">
              {notifications.length === 0 && (
                <div className="notif-empty">Nenhuma notificação</div>
              )}
              {notifications.map((n) => (
                <div key={n.id} className={`notif-item notif-${n.type}`}>
                  <div className="notif-text">{n.text}</div>
                  <div className="notif-time">{n.time}</div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

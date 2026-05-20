import {
  IconTrendingUp,
  IconTrendingDown,
  IconMail,
  IconCheck,
  IconPhone,
  IconUserPlus,
} from "@tabler/icons-react";
import type { DealStage } from "../types/deal";
import { stageLabels, stageColors } from "../types/deal";
import { useData } from "../contexts/DataContext";
import "./Dashboard.css";

const closedStages: DealStage[] = ["venda_concluida", "pos_venda"];
const monthNames = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

const chartColors = ["#B5D4F4", "#85B7EB", "#B5D4F4", "#378ADD", "#378ADD", "#185FA5"];

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function initials(name: string) {
  return name.split(" ").slice(0, 2).map((p) => p[0]).join("").toUpperCase();
}

const badgeMap: Record<string, { badge: string; label: string; bg: string; color: string }> = {
  active: { badge: "hot", label: "Ativo", bg: "#E6F1FB", color: "#185FA5" },
  lead: { badge: "warm", label: "Lead", bg: "#FAEEDA", color: "#854F0B" },
  inactive: { badge: "cold", label: "Inativo", bg: "#EEEDFE", color: "#3C3489" },
};

export default function Dashboard() {
  const { deals, clients, tasks } = useData();

  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${now.getMonth()}`;
  const prevMonth = `${now.getFullYear()}-${now.getMonth() - 1}`;

  const closedDeals = deals.filter((d) => closedStages.includes(d.stage));
  const revenueThisMonth = closedDeals
    .filter((d) => {
      const xd = new Date(d.createdAt);
      return `${xd.getFullYear()}-${xd.getMonth()}` === currentMonth;
    })
    .reduce((s, d) => s + d.value, 0);
  const revenuePrevMonth = closedDeals
    .filter((d) => {
      const xd = new Date(d.createdAt);
      return `${xd.getFullYear()}-${xd.getMonth()}` === prevMonth;
    })
    .reduce((s, d) => s + d.value, 0);

  const activeCount = deals.filter((d) => !closedStages.includes(d.stage)).length;
  const conversionRate = deals.length ? Math.round((closedDeals.length / deals.length) * 100) : 0;
  const clientCount = clients.length;

  const revenueChange = revenuePrevMonth
    ? `${Math.round(((revenueThisMonth - revenuePrevMonth) / revenuePrevMonth) * 100)}% vs mês anterior`
    : "—";
  const revenueUp = revenueThisMonth >= revenuePrevMonth;

  const metrics = [
    { label: "Receita do mês", value: formatCurrency(revenueThisMonth), change: revenueChange, up: revenueUp },
    { label: "Negócios ativos", value: String(activeCount), change: `${deals.length} total no pipeline`, up: true },
    { label: "Taxa de conversão", value: `${conversionRate}%`, change: `${closedDeals.length} concluídos`, up: conversionRate > 30 },
    { label: "Novos clientes", value: String(clientCount), change: "clientes cadastrados", up: true },
  ];

  const stages: DealStage[] = ["atendimento", "orcamento", "negociacao", "venda_concluida", "pos_venda"];
  const stageData = stages.map((stage) => {
    const ds = deals.filter((d) => d.stage === stage);
    const total = ds.reduce((s, d) => s + d.value, 0);
    return { stage, count: ds.length, total };
  });
  const maxCount = Math.max(...stageData.map((s) => s.count), 1);
  const maxTotal = Math.max(...stageData.filter((s) => s.stage !== "atendimento").map((s) => s.total), 1);

  const pipeline = stageData.map((s) => ({
    stage: stageLabels[s.stage],
    value: s.stage === "atendimento" ? `${s.count} cliente${s.count !== 1 ? "s" : ""}` : formatCurrency(s.total),
    count: `${s.count} ${s.stage === "atendimento" ? "atend." : s.stage === "orcamento" ? "orç." : s.stage === "negociacao" ? "negoc." : s.stage === "venda_concluida" ? "vendas" : "atend."}`,
    pct: s.stage === "atendimento" ? Math.round((s.count / maxCount) * 100) : Math.round((s.total / maxTotal) * 100),
    color: stageColors[s.stage],
  }));

  const monthlyRevenue = (() => {
    const months: { label: string; pct: number; color: string }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      const label = monthNames[d.getMonth()];
      const value = closedDeals
        .filter((x) => {
          const xd = new Date(x.createdAt);
          return `${xd.getFullYear()}-${xd.getMonth()}` === key;
        })
        .reduce((s, x) => s + x.value, 0);
      months.push({ label, pct: value, color: chartColors[i] });
    }
    const maxVal = Math.max(...months.map((m) => m.pct), 1);
    return months.map((m) => ({ ...m, pct: Math.round((m.pct / maxVal) * 100) }));
  })();

  const recentClients = clients.slice(0, 5);
  const recentActivities: { icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>; bg: string; color: string; text: string; time: string }[] = [];

  deals.slice(0, 3).forEach((d) => {
    const days = Math.round((Date.now() - new Date(d.createdAt).getTime()) / (1000 * 60 * 60 * 24));
    const time = days === 0 ? "hoje" : days === 1 ? "ontem" : `há ${days} dias`;
    if (d.stage === "orcamento") {
      recentActivities.push({ icon: IconMail, bg: "#E6F1FB", color: "#185FA5", text: `<strong>${d.contactName}</strong> solicitou orçamento de ${d.title}`, time });
    } else if (d.stage === "venda_concluida") {
      recentActivities.push({ icon: IconCheck, bg: "#EAF3DE", color: "#3B6D11", text: `Venda <strong>${d.title}</strong> concluída com sucesso`, time });
    } else if (d.stage === "negociacao") {
      recentActivities.push({ icon: IconPhone, bg: "#FAEEDA", color: "#854F0B", text: `Ligação agendada com <strong>${d.contactName}</strong> para negociar`, time });
    }
  });

  tasks.filter((t) => !t.done).slice(0, 2).forEach((t) => {
    recentActivities.push({ icon: IconCheck, bg: "#EAF3DE", color: "#3B6D11", text: `<strong>Tarefa pendente:</strong> ${t.title}`, time: "Pendente" });
  });

  if (recentActivities.length === 0) {
    recentActivities.push({ icon: IconUserPlus, bg: "#FAECE7", color: "#993C1D", text: "Nenhuma atividade recente", time: "—" });
  }

  return (
    <>
      <div className="metrics">
        {metrics.map((m) => (
          <div key={m.label} className="metric-card">
            <div className="metric-label">{m.label}</div>
            <div className="metric-value">{m.value}</div>
            <div className={`metric-change ${m.up ? "up" : "down"}`}>
              {m.up ? <IconTrendingUp size={12} /> : <IconTrendingDown size={12} />}
              {" "}{m.change}
            </div>
          </div>
        ))}
      </div>

      <div className="two-col">
        <div className="card">
          <div className="card-header">
            <div className="card-title">Pipeline de vendas</div>
            <div className="card-link">Ver todos →</div>
          </div>
          {pipeline.map((p) => (
            <div key={p.stage} className="pipeline-stage">
              <div className="stage-header">
                <span className="stage-name">{p.stage}</span>
                <span className="stage-val">{p.value} · {p.count}</span>
              </div>
              <div className="bar-bg">
                <div className="bar-fill" style={{ width: `${p.pct}%`, background: p.color }} />
              </div>
            </div>
          ))}

          <div className="chart-section">
            <div className="card-title">Receita por mês</div>
            <div className="chart-bars">
              {monthlyRevenue.map((b) => (
                <div key={b.label} className="bar-col">
                  <div className="bar-col-fill" style={{ height: `${b.pct}%`, background: b.color }} />
                  <div className="bar-col-label">{b.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="right-col">
          <div className="card">
            <div className="card-header">
              <div className="card-title">Contatos recentes</div>
              <div className="card-link">Ver todos →</div>
            </div>
            {recentClients.map((c) => {
              const b = badgeMap[c.status] || badgeMap.lead;
              return (
                <div key={c.id} className="contact-row">
                  <div className="c-avatar" style={{ background: b.bg, color: b.color }}>
                    {initials(c.name)}
                  </div>
                  <div className="contact-info">
                    <div className="contact-name">{c.name}</div>
                    <div className="contact-company">{c.email}</div>
                  </div>
                  <span className={`badge badge-${b.badge}`}>{b.label}</span>
                </div>
              );
            })}
          </div>

          <div className="card">
            <div className="card-header">
              <div className="card-title">Atividade recente</div>
              <div className="card-link">Ver tudo →</div>
            </div>
            {recentActivities.map((a, i) => (
              <div key={i} className="activity-row">
                <div className="act-icon" style={{ background: a.bg }}>
                  <a.icon size={14} style={{ color: a.color }} />
                </div>
                <div>
                  <div className="act-text" dangerouslySetInnerHTML={{ __html: a.text }} />
                  <div className="act-time">{a.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
import {
  IconTrendingUp,
  IconTrendingDown,
  IconMail,
  IconCheck,
  IconPhone,
  IconUserPlus,
} from "@tabler/icons-react";
import "./Dashboard.css";

const metrics = [
  { label: "Receita do mês", value: "R$ 42k", change: "+18% vs mês anterior", up: true },
  { label: "Negócios ativos", value: "8", change: "+3 esta semana", up: true },
  { label: "Taxa de conversão", value: "42%", change: "+5% vs mês anterior", up: true },
  { label: "Novos clientes", value: "28", change: "+12% este mês", up: true },
];

const pipeline = [
  { stage: "Atendimento", value: "R$ 20,5k", count: "5 orç.", pct: 90, color: "#378ADD" },
  { stage: "Orçamento", value: "R$ 9,7k", count: "3 orç.", pct: 48, color: "#EF9F27" },
  { stage: "Negociação", value: "R$ 7k", count: "2 negoc.", pct: 30, color: "#D85A30" },
  { stage: "Venda Concluída", value: "R$ 7,3k", count: "2 vendas", pct: 35, color: "#1D9E75" },
  { stage: "Pós-Venda", value: "R$ 150", count: "1 atend.", pct: 8, color: "#3C3489" },
];

const chartBars = [
  { label: "Dez", pct: 28, color: "#B5D4F4" },
  { label: "Jan", pct: 35, color: "#85B7EB" },
  { label: "Fev", pct: 42, color: "#B5D4F4" },
  { label: "Mar", pct: 55, color: "#378ADD" },
  { label: "Abr", pct: 68, color: "#378ADD" },
  { label: "Mai", pct: 90, color: "#185FA5" },
];

const contacts = [
  { initials: "AM", name: "Ana Martins", company: "Lojas Becker", badge: "hot", badgeLabel: "Quente", color: "#E6F1FB", textColor: "#185FA5" },
  { initials: "CS", name: "Carlos Silva", company: "Lojas Becker", badge: "won", badgeLabel: "Ganho", color: "#EAF3DE", textColor: "#3B6D11" },
  { initials: "JP", name: "Julia Pereira", company: "Lojas Becker", badge: "warm", badgeLabel: "Morno", color: "#FAEEDA", textColor: "#854F0B" },
  { initials: "RO", name: "Rodrigo Oliveira", company: "Lojas Becker", badge: "cold", badgeLabel: "Frio", color: "#EEEDFE", textColor: "#3C3489" },
];

const activities = [
  { icon: IconMail, bg: "#E6F1FB", color: "#185FA5", text: "<strong>Ana Martins</strong> solicitou orçamento de sala completa", time: "há 12 min" },
  { icon: IconCheck, bg: "#EAF3DE", color: "#3B6D11", text: "Venda <strong>Smart TV 55\"</strong> concluída com sucesso", time: "há 1h" },
  { icon: IconPhone, bg: "#FAEEDA", color: "#854F0B", text: "Ligação agendada com <strong>Julia Pereira</strong> para negociar", time: "há 3h" },
  { icon: IconUserPlus, bg: "#FAECE7", color: "#993C1D", text: "Novo contato <strong>Pedro Lima</strong> cadastrado na loja", time: "hoje, 09:15" },
];

export default function Dashboard() {
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
              {chartBars.map((b) => (
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
            {contacts.map((c) => (
              <div key={c.name} className="contact-row">
                <div className="c-avatar" style={{ background: c.color, color: c.textColor }}>
                  {c.initials}
                </div>
                <div className="contact-info">
                  <div className="contact-name">{c.name}</div>
                  <div className="contact-company">{c.company}</div>
                </div>
                <span className={`badge badge-${c.badge}`}>{c.badgeLabel}</span>
              </div>
            ))}
          </div>

          <div className="card">
            <div className="card-header">
              <div className="card-title">Atividade recente</div>
              <div className="card-link">Ver tudo →</div>
            </div>
            {activities.map((a, i) => (
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

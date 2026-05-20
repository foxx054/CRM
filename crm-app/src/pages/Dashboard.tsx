import type { DealStage } from "../types/deal";
import type { SaleItem } from "../types/sale";
import { stageLabels, stageColors } from "../types/deal";
import { useData } from "../contexts/DataContext";
import {
  IconTrendingUp,
  IconMail,
  IconCheck,
  IconPhone,
  IconUserPlus,
  IconCurrencyDollar,
  IconPercentage,
  IconShoppingCart,
  IconUsers,
  IconRotate,
  IconAlertTriangle,
} from "@tabler/icons-react";
import "./Dashboard.css";

const closedStages: DealStage[] = ["venda_concluida", "pos_venda"];
const monthNames = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatShortCurrency(value: number) {
  if (value >= 1000000) return `R$ ${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `R$ ${(value / 1000).toFixed(1)}k`;
  return formatCurrency(value);
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
  const { deals, clients, tasks, sales } = useData();

  const now = new Date();
  const closedDeals = deals.filter((d) => closedStages.includes(d.stage));
  const conversionRate = deals.length ? Math.round((closedDeals.length / deals.length) * 100) : 0;

  const totalRevenue = sales.reduce((s, v) => s + v.total, 0);
  const totalSales = sales.length;
  const avgTicket = totalSales ? totalRevenue / totalSales : 0;
  const activeClients = clients.filter((c) => c.status === "active").length;
  const allItems: SaleItem[] = sales.flatMap((s) => s.items);

  const kpis = [
    { label: "Faturamento", value: formatShortCurrency(totalRevenue), sub: `${totalSales} vendas`, icon: IconCurrencyDollar, bg: "#E6F1FB", color: "#185FA5" },
    { label: "Margem", value: "32%", sub: "estimada", icon: IconPercentage, bg: "#EAF3DE", color: "#3B6D11" },
    { label: "Ticket Médio", value: formatCurrency(avgTicket), sub: "por venda", icon: IconShoppingCart, bg: "#FAEEDA", color: "#854F0B" },
    { label: "Conversão", value: `${conversionRate}%`, sub: `${closedDeals.length} concluídos`, icon: IconTrendingUp, bg: "#EEEDFE", color: "#3C3489" },
    { label: "Clientes Ativos", value: String(activeClients), sub: `${clients.length} cadastrados`, icon: IconUsers, bg: "#FDE8E8", color: "#C53030" },
    { label: "Giro Estoque", value: `${allItems.length} itens`, sub: `${new Set(allItems.map(i => i.sku)).size} SKUs`, icon: IconRotate, bg: "#E6F1FB", color: "#185FA5" },
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

  const salesMonthlyRevenue: { month: string; value: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    const label = monthNames[d.getMonth()];
    const value = sales
      .filter((s) => { const sd = new Date(s.date); return `${sd.getFullYear()}-${sd.getMonth()}` === key; })
      .reduce((s, v) => s + v.total, 0);
    salesMonthlyRevenue.push({ month: label, value });
  }
  const maxRevenue = Math.max(...salesMonthlyRevenue.map((m) => m.value), 1);

  const productSales: Record<string, { qty: number; revenue: number; lastSale: string }> = {};
  sales.forEach((s) => {
    s.items.forEach((item) => {
      if (!productSales[item.product]) productSales[item.product] = { qty: 0, revenue: 0, lastSale: "" };
      productSales[item.product].qty += item.quantity;
      productSales[item.product].revenue += item.unitPrice * item.quantity;
      if (s.date > productSales[item.product].lastSale) productSales[item.product].lastSale = s.date;
    });
  });

  const topProducts = Object.entries(productSales).sort((a, b) => b[1].revenue - a[1].revenue).slice(0, 10);

  const stoppedProducts = Object.entries(productSales)
    .filter(([, data]) => (Date.now() - new Date(data.lastSale).getTime()) / (1000 * 60 * 60 * 24) > 30)
    .sort((a, b) => a[1].lastSale.localeCompare(b[1].lastSale));

  const revenueByChannel: Record<string, number> = {};
  sales.forEach((s) => {
    const label = s.channel === "loja_fisica" ? "Loja Física" : s.channel === "ecommerce" ? "E-commerce" : s.channel === "marketplace" ? "Marketplace" : "WhatsApp";
    revenueByChannel[label] = (revenueByChannel[label] || 0) + s.total;
  });
  const maxChannel = Math.max(...Object.values(revenueByChannel), 1);
  const channelColors: Record<string, string> = {
    "Loja Física": "#378ADD", "E-commerce": "#1D9E75", Marketplace: "#EF9F27", WhatsApp: "#3C3489",
  };

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
      <div className="bi-kpis">
        {kpis.map((k) => (
          <div key={k.label} className="bi-kpi-card">
            <div className="bi-kpi-icon" style={{ background: k.bg, color: k.color }}>
              <k.icon size={20} />
            </div>
            <div className="bi-kpi-info">
              <span className="bi-kpi-label">{k.label}</span>
              <span className="bi-kpi-value">{k.value}</span>
              <span className="bi-kpi-sub">{k.sub}</span>
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
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title">Faturamento Mensal</div>
          </div>
          <div className="bi-chart">
            {salesMonthlyRevenue.map((m) => (
              <div key={m.month} className="bi-chart-col">
                <div className="bi-chart-val">{formatShortCurrency(m.value)}</div>
                <div className="bi-chart-bar" style={{ height: `${Math.max((m.value / maxRevenue) * 100, 4)}%`, background: "#378ADD" }} />
                <div className="bi-chart-label">{m.month}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="two-col">
        <div className="card">
          <div className="card-header">
            <div className="card-title">Receita por Canal</div>
          </div>
          <div className="bi-channel-list">
            {Object.entries(revenueByChannel).map(([channel, value]) => (
              <div key={channel} className="bi-channel-row">
                <div className="bi-channel-top">
                  <span>{channel}</span>
                  <span>{formatCurrency(value)}</span>
                </div>
                <div className="bar-bg">
                  <div className="bar-fill" style={{ width: `${(value / maxChannel) * 100}%`, background: channelColors[channel] }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title">Top 10 Produtos</div>
          </div>
          <div className="bi-rank-list">
            {topProducts.map(([product, data], i) => (
              <div key={product} className="bi-rank-item">
                <span className="bi-rank-pos">{i + 1}º</span>
                <div className="bi-rank-info">
                  <span className="bi-rank-name">{product}</span>
                  <span className="bi-rank-brand">{data.qty} unidades</span>
                </div>
                <span className="bi-rank-value">{formatCurrency(data.revenue)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="two-col">
        <div className="card">
          <div className="card-header">
            <div className="card-title">Contatos recentes</div>
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

      {stoppedProducts.length > 0 && (
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <IconAlertTriangle size={14} style={{ color: "#D85A30" }} />
              Produtos Parados (+30 dias)
            </div>
          </div>
          <div className="bi-rank-list">
            {stoppedProducts.slice(0, 8).map(([product, data]) => {
              const days = Math.round((Date.now() - new Date(data.lastSale).getTime()) / (1000 * 60 * 60 * 24));
              return (
                <div key={product} className="bi-rank-item">
                  <div className="bi-rank-info">
                    <span className="bi-rank-name">{product}</span>
                    <span className="bi-rank-brand">{data.qty} unidades · última venda há {days} dias</span>
                  </div>
                  <span className="bi-rank-value bi-stopped">{days}d</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}

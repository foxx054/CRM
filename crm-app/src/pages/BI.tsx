import { useData } from "../contexts/DataContext";
import type { SaleItem } from "../types/sale";
import {
  IconTrendingUp,
  IconCurrencyDollar,
  IconPercentage,
  IconShoppingCart,
  IconUsers,
  IconRotate,
  IconAlertTriangle,
} from "@tabler/icons-react";
import "./BI.css";

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatShortCurrency(value: number) {
  if (value >= 1000000) return `R$ ${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `R$ ${(value / 1000).toFixed(1)}k`;
  return formatCurrency(value);
}

export default function BI() {
  const { clients, deals, sales } = useData();

  const closedStages = ["venda_concluida", "pos_venda"];
  const closedDeals = deals.filter((d) => (closedStages as readonly string[]).includes(d.stage));
  const conversionRate = deals.length ? Math.round((closedDeals.length / deals.length) * 100) : 0;

  const totalRevenue = sales.reduce((s, v) => s + v.total, 0);
  const totalSales = sales.length;
  const avgTicket = totalSales ? totalRevenue / totalSales : 0;
  const activeClients = clients.filter((c) => c.status === "active").length;
  const allItems: SaleItem[] = sales.flatMap((s) => s.items);

  const kpis = [
    { label: "Faturamento Total", value: formatShortCurrency(totalRevenue), sub: `${totalSales} vendas`, icon: IconCurrencyDollar, bg: "#E6F1FB", color: "#185FA5" },
    { label: "Margem Média", value: "32%", sub: "estimada", icon: IconPercentage, bg: "#EAF3DE", color: "#3B6D11" },
    { label: "Ticket Médio", value: formatCurrency(avgTicket), sub: "por venda", icon: IconShoppingCart, bg: "#FAEEDA", color: "#854F0B" },
    { label: "Taxa de Conversão", value: `${conversionRate}%`, sub: `${closedDeals.length} concluídos`, icon: IconTrendingUp, bg: "#EEEDFE", color: "#3C3489" },
    { label: "Clientes Ativos", value: String(activeClients), sub: `${clients.length} cadastrados`, icon: IconUsers, bg: "#FDE8E8", color: "#C53030" },
    { label: "Giro de Estoque", value: `${allItems.length} itens`, sub: `${new Set(allItems.map(i => i.sku)).size} SKUs`, icon: IconRotate, bg: "#E6F1FB", color: "#185FA5" },
  ];

  const monthNames = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
  const now = new Date();
  const monthlyRevenue: { month: string; value: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    const month = monthNames[d.getMonth()];
    const value = sales
      .filter((s) => { const sd = new Date(s.date); return `${sd.getFullYear()}-${sd.getMonth()}` === key; })
      .reduce((s, v) => s + v.total, 0);
    monthlyRevenue.push({ month, value });
  }
  const maxRevenue = Math.max(...monthlyRevenue.map((m) => m.value), 1);

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

  return (
    <div className="bi-page">
      <h1>Dashboard</h1>
      <p className="subtitle">Indicadores principais do negócio</p>

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

      <div className="bi-two-col">
        <div className="bi-card">
          <div className="bi-card-header"><span className="bi-card-title">Faturamento Mensal</span></div>
          <div className="bi-chart">
            {monthlyRevenue.map((m) => (
              <div key={m.month} className="bi-chart-col">
                <div className="bi-chart-val">{formatShortCurrency(m.value)}</div>
                <div className="bi-chart-bar" style={{ height: `${Math.max((m.value / maxRevenue) * 100, 4)}%`, background: "#378ADD" }} />
                <div className="bi-chart-label">{m.month}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bi-card">
          <div className="bi-card-header"><span className="bi-card-title">Receita por Canal</span></div>
          <div className="bi-channel-list">
            {Object.entries(revenueByChannel).map(([channel, value]) => (
              <div key={channel} className="bi-channel-row">
                <div className="bi-channel-top">
                  <span>{channel}</span>
                  <span>{formatCurrency(value)}</span>
                </div>
                <div className="bi-bar-bg">
                  <div className="bi-bar-fill" style={{ width: `${(value / maxChannel) * 100}%`, background: channelColors[channel] }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bi-two-col">
        <div className="bi-card">
          <div className="bi-card-header"><span className="bi-card-title">Top 10 Produtos</span></div>
          <div className="bi-rank-list">
            {topProducts.map(([product, data], i) => (
              <div key={product} className="bi-rank-item">
                <span className="bi-rank-pos">{i + 1}º</span>
                <div className="bi-rank-info">
                  <span className="bi-rank-name">{product}</span>
                  <span className="bi-rank-brand">{data.qty} unidades vendidas</span>
                </div>
                <span className="bi-rank-value">{formatCurrency(data.revenue)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bi-card">
          <div className="bi-card-header">
            <span className="bi-card-title"><IconAlertTriangle size={14} /> Produtos Parados (+30 dias)</span>
          </div>
          {stoppedProducts.length === 0 ? (
            <p className="bi-empty">Nenhum produto parado</p>
          ) : (
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
          )}
        </div>
      </div>
    </div>
  );
}

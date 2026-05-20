import {
  IconTrendingUp,
  IconCurrencyDollar,
  IconPercentage,
  IconBriefcase,
} from "@tabler/icons-react";
import type { Deal, DealStage } from "../types/deal";
import { stageLabels, stageColors } from "../types/deal";
import "./Pipeline.css";

const mockDeals: Deal[] = [
  { id: "1", title: "Sala de estar completa", company: "Lojas Becker", value: 0, stage: "atendimento", contactName: "Ana Martins", createdAt: "2025-05-15" },
  { id: "2", title: "Kit cozinha industrial", company: "Lojas Becker", value: 0, stage: "atendimento", contactName: "Carlos Silva", createdAt: "2025-05-14" },
  { id: "3", title: "Home theater", company: "Lojas Becker", value: 4500, stage: "orcamento", contactName: "Julia Pereira", createdAt: "2025-05-10" },
  { id: "4", title: "Móveis quarto casal", company: "Lojas Becker", value: 3200, stage: "orcamento", contactName: "Rodrigo Oliveira", createdAt: "2025-05-08" },
  { id: "5", title: "Ar condicionado 12000 BTUs", company: "Lojas Becker", value: 2800, stage: "negociacao", contactName: "Maria Souza", createdAt: "2025-05-05" },
  { id: "6", title: "Máquina de lavar + secadora", company: "Lojas Becker", value: 4200, stage: "negociacao", contactName: "João Silva", createdAt: "2025-05-03" },
  { id: "7", title: "Smart TV 55\"", company: "Lojas Becker", value: 3500, stage: "venda_concluida", contactName: "Lucas Oliveira", createdAt: "2025-04-28" },
  { id: "8", title: "Geladeira frost free", company: "Lojas Becker", value: 3800, stage: "venda_concluida", contactName: "Ana Costa", createdAt: "2025-04-25" },
  { id: "9", title: "Suporte técnico TV", company: "Lojas Becker", value: 150, stage: "pos_venda", contactName: "Carlos Pereira", createdAt: "2025-04-20" },
  { id: "10", title: "Troca de produto", company: "Lojas Becker", value: 0, stage: "pos_venda", contactName: "Maria Souza", createdAt: "2025-04-18" },
  { id: "11", title: "Fogão 5 bocas", company: "Lojas Becker", value: 2200, stage: "orcamento", contactName: "Pedro Lima", createdAt: "2025-05-12" },
  { id: "12", title: "Cama box casal", company: "Lojas Becker", value: 0, stage: "atendimento", contactName: "Camila Rocha", createdAt: "2025-05-16" },
];

const stages: DealStage[] = ["atendimento", "orcamento", "negociacao", "venda_concluida", "pos_venda"];

const conversionRates = [
  { from: "Atendimento → Orçamento", rate: 75 },
  { from: "Orçamento → Negociação", rate: 55 },
  { from: "Negociação → Venda Concluída", rate: 42 },
];

const monthlyRevenue = [
  { month: "Dez", value: 12000 },
  { month: "Jan", value: 18000 },
  { month: "Fev", value: 27000 },
  { month: "Mar", value: 22000 },
  { month: "Abr", value: 35000 },
  { month: "Mai", value: 42000 },
];

const closedStages: DealStage[] = ["venda_concluida", "pos_venda"];

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function Pipeline() {
  const totalPipeline = mockDeals.reduce((s, d) => s + d.value, 0);
  const activeDeals = mockDeals.filter((d) => !closedStages.includes(d.stage)).length;
  const closedDeals = mockDeals.filter((d) => closedStages.includes(d.stage));
  const closedValue = closedDeals.reduce((s, d) => s + d.value, 0);
  const avgDeal = Math.round(totalPipeline / mockDeals.length);

  const stageData = stages.map((stage) => {
    const deals = mockDeals.filter((d) => d.stage === stage);
    const total = deals.reduce((s, d) => s + d.value, 0);
    const maxValue = 75000;
    return { stage, deals, total, pct: Math.round((total / maxValue) * 100) };
  });

  return (
    <div className="pipeline-page">
      <div className="pipeline-metrics">
        <div className="pl-metric">
          <div className="pl-metric-icon" style={{ background: "#E6F1FB", color: "#185FA5" }}>
            <IconCurrencyDollar size={18} />
          </div>
          <div>
            <div className="pl-metric-label">Valor total do pipeline</div>
            <div className="pl-metric-value">{formatCurrency(totalPipeline)}</div>
          </div>
        </div>
        <div className="pl-metric">
          <div className="pl-metric-icon" style={{ background: "#EAF3DE", color: "#3B6D11" }}>
            <IconBriefcase size={18} />
          </div>
          <div>
            <div className="pl-metric-label">Negócios ativos</div>
            <div className="pl-metric-value">{activeDeals}</div>
          </div>
        </div>
        <div className="pl-metric">
          <div className="pl-metric-icon" style={{ background: "#FAEEDA", color: "#854F0B" }}>
            <IconTrendingUp size={18} />
          </div>
          <div>
            <div className="pl-metric-label">Concluídos no período</div>
            <div className="pl-metric-value">{closedDeals.length} ({formatCurrency(closedValue)})</div>
          </div>
        </div>
        <div className="pl-metric">
          <div className="pl-metric-icon" style={{ background: "#EEEDFE", color: "#3C3489" }}>
            <IconPercentage size={18} />
          </div>
          <div>
            <div className="pl-metric-label">Ticket médio</div>
            <div className="pl-metric-value">{formatCurrency(avgDeal)}</div>
          </div>
        </div>
      </div>

      <div className="pipeline-two-col">
        <div className="pl-card">
          <div className="pl-card-header">
            <span className="pl-card-title">Funil por estágio</span>
          </div>
          {stageData.map((s) => (
            <div key={s.stage} className="pl-stage-row">
              <div className="pl-stage-top">
                <div className="pl-stage-name">
                  <span className="pl-stage-dot" style={{ background: stageColors[s.stage] }} />
                  {stageLabels[s.stage]}
                </div>
                <div className="pl-stage-total">{s.stage === "atendimento" ? "---" : formatCurrency(s.total)}</div>
              </div>
              <div className="pl-bar-bg">
                <div
                  className="pl-bar-fill"
                  style={{ width: `${s.pct}%`, background: stageColors[s.stage] }}
                />
              </div>
              <div className="pl-stage-deals">
                {s.deals.length} negócio{s.deals.length !== 1 ? "s" : ""}
              </div>
            </div>
          ))}
        </div>

        <div className="pl-card">
          <div className="pl-card-header">
            <span className="pl-card-title">Taxas de conversão</span>
          </div>
          <div className="pl-conversion-list">
            {conversionRates.map((c) => (
              <div key={c.from} className="pl-conv-item">
                <div className="pl-conv-header">
                  <span>{c.from}</span>
                  <span className="pl-conv-pct">{c.rate}%</span>
                </div>
                <div className="pl-bar-bg">
                  <div
                    className="pl-bar-fill"
                    style={{ width: `${c.rate}%`, background: "#378ADD" }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pl-chart-section">
            <span className="pl-card-title">Receita mensal</span>
            <div className="pl-chart">
              {monthlyRevenue.map((m) => {
                const maxVal = Math.max(...monthlyRevenue.map((r) => r.value));
                const pct = (m.value / maxVal) * 100;
                return (
                  <div key={m.month} className="pl-chart-col">
                    <div className="pl-chart-val">{formatCurrency(m.value)}</div>
                    <div className="pl-chart-bar" style={{ height: `${pct}%`, background: "#378ADD" }} />
                    <div className="pl-chart-label">{m.month}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="pl-card">
        <div className="pl-card-header">
          <span className="pl-card-title">Negócios por estágio</span>
        </div>
        {stageData.map((s) => (
          <details key={s.stage} className="pl-details">
            <summary className="pl-summary">
              <span className="pl-summary-left">
                <span className="pl-stage-dot" style={{ background: stageColors[s.stage] }} />
                {stageLabels[s.stage]}
              </span>
              <span>{s.deals.length} negócio{s.deals.length !== 1 ? "s" : ""} · {s.stage === "atendimento" ? "---" : formatCurrency(s.total)}</span>
            </summary>
            <div className="pl-details-body">
              {s.deals.map((deal) => (
                <div key={deal.id} className="pl-deal-row">
                  <div className="pl-deal-info">
                    <span className="pl-deal-title">{deal.title}</span>
                    <span className="pl-deal-company">{deal.company}</span>
                    <span className="pl-deal-contact">{deal.contactName}</span>
                  </div>
                  <span className="pl-deal-value">{deal.stage === "atendimento" ? "---" : formatCurrency(deal.value)}</span>
                </div>
              ))}
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}

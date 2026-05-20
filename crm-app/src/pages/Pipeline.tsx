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
  { id: "1", title: "Site institucional", company: "Tech Ltda", value: 15000, stage: "prospecting", contactName: "João Silva", createdAt: "2025-05-01" },
  { id: "2", title: "App mobile", company: "Digital Agency", value: 45000, stage: "prospecting", contactName: "Lucas Oliveira", createdAt: "2025-05-10" },
  { id: "3", title: "Rebranding", company: "Design Studio", value: 12000, stage: "qualification", contactName: "Maria Souza", createdAt: "2025-04-20" },
  { id: "4", title: "Consultoria SEO", company: "Construtora ABC", value: 8000, stage: "qualification", contactName: "Carlos Pereira", createdAt: "2025-04-15" },
  { id: "5", title: "Sistema de gestão", company: "Saúde Plus", value: 60000, stage: "proposal", contactName: "Ana Costa", createdAt: "2025-03-10" },
  { id: "6", title: "Suporte mensal", company: "Tech Ltda", value: 3000, stage: "closed", contactName: "João Silva", createdAt: "2025-02-01" },
  { id: "7", title: "Cloud migration", company: "DataBridge SA", value: 35000, stage: "prospecting", contactName: "Rodrigo Oliveira", createdAt: "2025-05-12" },
  { id: "8", title: "E-commerce B2B", company: "Grupo Nórdico", value: 52000, stage: "qualification", contactName: "Carlos Silva", createdAt: "2025-04-28" },
  { id: "9", title: "Treinamento equipe", company: "TechSul Ltda", value: 9000, stage: "proposal", contactName: "Ana Martins", createdAt: "2025-03-22" },
  { id: "10", title: "Suporte premium", company: "Inova Soluções", value: 18000, stage: "proposal", contactName: "Julia Pereira", createdAt: "2025-03-15" },
  { id: "11", title: "Hospedagem dedicada", company: "Construtora ABC", value: 24000, stage: "closed", contactName: "Carlos Pereira", createdAt: "2025-01-20" },
  { id: "12", title: "App mobile v2", company: "Digital Agency", value: 38000, stage: "closed", contactName: "Lucas Oliveira", createdAt: "2025-02-28" },
];

const stages: DealStage[] = ["prospecting", "qualification", "proposal", "closed"];

const conversionRates = [
  { from: "Prospecção → Qualificação", rate: 68 },
  { from: "Qualificação → Proposta", rate: 52 },
  { from: "Proposta → Fechado", rate: 38 },
];

const monthlyRevenue = [
  { month: "Dez", value: 12000 },
  { month: "Jan", value: 18000 },
  { month: "Fev", value: 27000 },
  { month: "Mar", value: 22000 },
  { month: "Abr", value: 35000 },
  { month: "Mai", value: 42000 },
];

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function Pipeline() {
  const totalPipeline = mockDeals.reduce((s, d) => s + d.value, 0);
  const activeDeals = mockDeals.filter((d) => d.stage !== "closed").length;
  const closedDeals = mockDeals.filter((d) => d.stage === "closed");
  const closedValue = closedDeals.reduce((s, d) => s + d.value, 0);
  const avgDeal = Math.round(totalPipeline / mockDeals.length);

  const stageData = stages.map((stage) => {
    const deals = mockDeals.filter((d) => d.stage === stage);
    const total = deals.reduce((s, d) => s + d.value, 0);
    const maxValue = 95000;
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
            <div className="pl-metric-label">Fechados no período</div>
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
                <div className="pl-stage-total">{formatCurrency(s.total)}</div>
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
              <span>{s.deals.length} negócio{s.deals.length !== 1 ? "s" : ""} · {formatCurrency(s.total)}</span>
            </summary>
            <div className="pl-details-body">
              {s.deals.map((deal) => (
                <div key={deal.id} className="pl-deal-row">
                  <div className="pl-deal-info">
                    <span className="pl-deal-title">{deal.title}</span>
                    <span className="pl-deal-company">{deal.company}</span>
                    <span className="pl-deal-contact">{deal.contactName}</span>
                  </div>
                  <span className="pl-deal-value">{formatCurrency(deal.value)}</span>
                </div>
              ))}
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}

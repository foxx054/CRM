import {
  IconTrendingUp,
  IconCurrencyDollar,
  IconPercentage,
  IconBriefcase,
} from "@tabler/icons-react";
import type { DealStage } from "../types/deal";
import { stageLabels, stageColors } from "../types/deal";
import { useData } from "../contexts/DataContext";
import "./Pipeline.css";

const stages: DealStage[] = ["atendimento", "orcamento", "negociacao", "venda_concluida", "pos_venda"];
const closedStages: DealStage[] = ["venda_concluida", "pos_venda"];

const monthNames = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function Pipeline() {
  const { deals } = useData();

  const totalPipeline = deals.reduce((s, d) => s + d.value, 0);
  const activeDeals = deals.filter((d) => !closedStages.includes(d.stage)).length;
  const closedDeals = deals.filter((d) => closedStages.includes(d.stage));
  const closedValue = closedDeals.reduce((s, d) => s + d.value, 0);
  const avgDeal = deals.length ? Math.round(totalPipeline / deals.length) : 0;

  const stageData = stages.map((stage) => {
    const ds = deals.filter((d) => d.stage === stage);
    const total = ds.reduce((s, d) => s + d.value, 0);
    return { stage, deals: ds, total, count: ds.length };
  });

  const maxCount = Math.max(...stageData.map((s) => s.count), 1);
  const maxTotal = Math.max(...stageData.filter((s) => s.stage !== "atendimento").map((s) => s.total), 1);

  const stageBars = stageData.map((s) => ({
    ...s,
    pct: s.stage === "atendimento" ? Math.round((s.count / maxCount) * 100) : Math.round((s.total / maxTotal) * 100),
  }));

  const atendimentoCount = stageData.find((s) => s.stage === "atendimento")?.count ?? 0;
  const orcamentoCount = stageData.find((s) => s.stage === "orcamento")?.count ?? 0;
  const negociacaoCount = stageData.find((s) => s.stage === "negociacao")?.count ?? 0;
  const vendaCount = stageData.find((s) => s.stage === "venda_concluida")?.count ?? 0;

  const conversionRates = [
    { from: "Atendimento → Orçamento", rate: atendimentoCount ? Math.round((orcamentoCount / atendimentoCount) * 100) : 0 },
    { from: "Orçamento → Negociação", rate: orcamentoCount ? Math.round((negociacaoCount / orcamentoCount) * 100) : 0 },
    { from: "Negociação → Venda Concluída", rate: negociacaoCount ? Math.round((vendaCount / negociacaoCount) * 100) : 0 },
  ];

  const monthlyRevenue = (() => {
    const now = new Date();
    const months: { month: string; value: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      const label = monthNames[d.getMonth()];
      const value = deals
        .filter((x) => closedStages.includes(x.stage))
        .filter((x) => {
          const xd = new Date(x.createdAt);
          return `${xd.getFullYear()}-${xd.getMonth()}` === key;
        })
        .reduce((s, x) => s + x.value, 0);
      months.push({ month: label, value });
    }
    return months;
  })();

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
          {stageBars.map((s) => (
            <div key={s.stage} className="pl-stage-row">
              <div className="pl-stage-top">
                <div className="pl-stage-name">
                  <span className="pl-stage-dot" style={{ background: stageColors[s.stage] }} />
                  {stageLabels[s.stage]}
                </div>
                <div className="pl-stage-total">{s.stage === "atendimento" ? `${s.count} cliente${s.count !== 1 ? "s" : ""}` : formatCurrency(s.total)}</div>
              </div>
              <div className="pl-bar-bg">
                <div
                  className="pl-bar-fill"
                  style={{ width: `${s.pct}%`, background: stageColors[s.stage] }}
                />
              </div>
              <div className="pl-stage-deals">
                {s.count} negócio{s.count !== 1 ? "s" : ""}
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
                const maxVal = Math.max(...monthlyRevenue.map((r) => r.value), 1);
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
        {stageBars.map((s) => (
          <details key={s.stage} className="pl-details">
            <summary className="pl-summary">
              <span className="pl-summary-left">
                <span className="pl-stage-dot" style={{ background: stageColors[s.stage] }} />
                {stageLabels[s.stage]}
              </span>
              <span>{s.count} negócio{s.count !== 1 ? "s" : ""} · {s.stage === "atendimento" ? `${s.count} cliente${s.count !== 1 ? "s" : ""}` : formatCurrency(s.total)}</span>
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
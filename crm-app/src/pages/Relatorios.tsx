import { useData } from "../contexts/DataContext";
import {
  IconTrendingUp,
  IconCurrencyDollar,
  IconTrophy,
  IconUsers,
} from "@tabler/icons-react";
import "./Relatorios.css";

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function Relatorios() {
  const { clients, deals, companies } = useData();

  const totalRevenue = deals.reduce((s, d) => s + d.value, 0);
  const closedDeals = deals.filter((d) => d.stage === "venda_concluida");
  const closedRevenue = closedDeals.reduce((s, d) => s + d.value, 0);
  const conversionRate = deals.length ? Math.round((closedDeals.length / deals.length) * 100) : 0;

  const clientRanking = [...clients]
    .sort((a, b) => b.totalSpent - a.totalSpent)
    .slice(0, 5);

  const stageData = ["atendimento", "orcamento", "negociacao", "venda_concluida", "pos_venda"].map((stage) => {
    const d = deals.filter((x) => x.stage === stage);
    return { stage, total: d.reduce((s, x) => s + x.value, 0), count: d.length };
  });
  const maxStage = Math.max(...stageData.map((s) => s.total), 1);

  const stageLabels: Record<string, string> = {
    atendimento: "Atendimento",
    orcamento: "Orçamento",
    negociacao: "Negociação",
    venda_concluida: "Venda Concluída",
    pos_venda: "Pós-Venda",
  };

  const stageColors: Record<string, string> = {
    atendimento: "#378ADD",
    orcamento: "#EF9F27",
    negociacao: "#D85A30",
    venda_concluida: "#1D9E75",
    pos_venda: "#3C3489",
  };

  return (
    <div className="relatorios-page">
      <h1>Relatórios</h1>
      <p className="subtitle">Métricas e indicadores do CRM</p>

      <div className="pipeline-metrics">
        <div className="pl-metric">
          <div className="pl-metric-icon" style={{ background: "#E6F1FB", color: "#185FA5" }}>
            <IconCurrencyDollar size={18} />
          </div>
          <div>
            <div className="pl-metric-label">Receita total</div>
            <div className="pl-metric-value">{formatCurrency(totalRevenue)}</div>
          </div>
        </div>
        <div className="pl-metric">
          <div className="pl-metric-icon" style={{ background: "#EAF3DE", color: "#3B6D11" }}>
            <IconTrendingUp size={18} />
          </div>
          <div>
            <div className="pl-metric-label">Vendas concluídas</div>
            <div className="pl-metric-value">{closedDeals.length} ({formatCurrency(closedRevenue)})</div>
          </div>
        </div>
        <div className="pl-metric">
          <div className="pl-metric-icon" style={{ background: "#FAEEDA", color: "#854F0B" }}>
            <IconTrophy size={18} />
          </div>
          <div>
            <div className="pl-metric-label">Taxa de conversão</div>
            <div className="pl-metric-value">{conversionRate}%</div>
          </div>
        </div>
        <div className="pl-metric">
          <div className="pl-metric-icon" style={{ background: "#EEEDFE", color: "#3C3489" }}>
            <IconUsers size={18} />
          </div>
          <div>
            <div className="pl-metric-label">Clientes / Empresas</div>
            <div className="pl-metric-value">{clients.length} / {companies.length}</div>
          </div>
        </div>
      </div>

      <div className="pipeline-two-col">
        <div className="pl-card">
          <div className="pl-card-header">
            <span className="pl-card-title">Receita por estágio</span>
          </div>
          {stageData.map((s) => (
            <div key={s.stage} className="pl-stage-row">
              <div className="pl-stage-top">
                <div className="pl-stage-name">
                  <span className="pl-stage-dot" style={{ background: stageColors[s.stage] }} />
                  {stageLabels[s.stage]}
                </div>
                <div className="pl-stage-total">{s.stage === "atendimento" ? `${s.count} contato${s.count !== 1 ? "s" : ""}` : formatCurrency(s.total)}</div>
              </div>
              <div className="pl-bar-bg">
                <div className="pl-bar-fill" style={{ width: `${(s.total / maxStage) * 100}%`, background: stageColors[s.stage] }} />
              </div>
              <div className="pl-stage-deals">{s.count} negócio{s.count !== 1 ? "s" : ""}</div>
            </div>
          ))}
        </div>

        <div className="pl-card">
          <div className="pl-card-header">
            <span className="pl-card-title">Ranking de Clientes</span>
          </div>
          <div className="ranking-list">
            {clientRanking.map((c, i) => (
              <div key={c.id} className="ranking-item">
                <div className="ranking-pos">{i + 1}º</div>
                <div className="ranking-info">
                  <span className="ranking-name">{c.name}</span>
                  <span className="ranking-status">{c.status === "active" ? "Ativo" : c.status === "lead" ? "Lead" : "Inativo"}</span>
                </div>
                <span className="ranking-value">{formatCurrency(c.totalSpent)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="pl-card">
        <div className="pl-card-header">
          <span className="pl-card-title">Distribuição de Negócios</span>
        </div>
        <div className="dist-list">
          {stageData.map((s) => (
            <div key={s.stage} className="dist-item">
              <div className="dist-header">
                <span>{stageLabels[s.stage]}</span>
                <span>{s.count} negócio{s.count !== 1 ? "s" : ""}</span>
              </div>
              <div className="pl-bar-bg">
                <div className="pl-bar-fill" style={{ width: `${(s.count / Math.max(...stageData.map((x) => x.count), 1)) * 100}%`, background: stageColors[s.stage] }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

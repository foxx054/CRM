import type { Client } from "../types/client";
import { useData } from "../contexts/DataContext";
import "./ClientDetailModal.css";

interface Props {
  client: Client | null;
  onClose: () => void;
}

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function ClientDetailModal({ client, onClose }: Props) {
  const { deals } = useData();

  if (!client) return null;

  const clientDeals = deals.filter(
    (d) => d.clientId === client.id || d.contactName === client.name
  );
  const totalDeals = clientDeals.reduce((s, d) => s + d.value, 0);

  const stageLabels: Record<string, string> = {
    atendimento: "Atendimento",
    orcamento: "Orçamento",
    negociacao: "Negociação",
    venda_concluida: "Venda Concluída",
    pos_venda: "Pós-Venda",
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal-wide" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{client.name}</h2>
          <button className="btn-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div className="detail-grid">
            <div className="detail-field">
              <span className="detail-label">CPF</span>
              <span>{client.cpf}</span>
            </div>
            <div className="detail-field">
              <span className="detail-label">Email</span>
              <span>{client.email}</span>
            </div>
            <div className="detail-field">
              <span className="detail-label">Telefone</span>
              <span>{client.phone}</span>
            </div>
            <div className="detail-field">
              <span className="detail-label">Total Gasto</span>
              <span className="detail-spent">{formatCurrency(client.totalSpent)}</span>
            </div>
            <div className="detail-field">
              <span className="detail-label">Status</span>
              <span className={`status status-${client.status}`}>
                {client.status === "active" ? "Ativo" : client.status === "inactive" ? "Inativo" : "Lead"}
              </span>
            </div>
          </div>

          <div className="detail-section">
            <h3>Histórico de Compras</h3>
            {clientDeals.length === 0 ? (
              <p className="detail-empty">Nenhuma compra encontrada</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Produto</th>
                    <th>Valor</th>
                    <th>Estágio</th>
                  </tr>
                </thead>
                <tbody>
                  {clientDeals.map((d) => (
                    <tr key={d.id}>
                      <td>{d.title}</td>
                      <td className="cell-spent">{d.stage === "atendimento" ? "---" : formatCurrency(d.value)}</td>
                      <td><span className="status">{stageLabels[d.stage] || d.stage}</span></td>
                    </tr>
                  ))}
                  <tr className="detail-total">
                    <td><strong>Total em negócios</strong></td>
                    <td className="cell-spent"><strong>{formatCurrency(totalDeals)}</strong></td>
                    <td>{clientDeals.length} negócio{clientDeals.length !== 1 ? "s" : ""}</td>
                  </tr>
                </tbody>
              </table>
            )}
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Fechar</button>
        </div>
      </div>
    </div>
  );
}

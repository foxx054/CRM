import { useState } from "react";
import type { Client } from "../types/client";
import type { Sale } from "../types/sale";
import { useData } from "../contexts/DataContext";
import { paymentStatusLabels, paymentStatusColors } from "../types/sale";
import SaleDetailModal from "./SaleDetailModal";
import {
  IconHeart,
  IconStar,
  IconCategory,
  IconCalendarStats,
  IconDeviceMobile,
} from "@tabler/icons-react";
import "./ClientDetailModal.css";

interface Props {
  client: Client | null;
  onClose: () => void;
}

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatDate(dateStr: string) {
  return new Date(dateStr + "T12:00:00").toLocaleDateString("pt-BR");
}

export default function ClientDetailModal({ client, onClose }: Props) {
  const { deals, sales } = useData();
  const [detailSale, setDetailSale] = useState<Sale | null>(null);

  if (!client) return null;

  const clientDeals = deals.filter(
    (d) => d.clientId === client.id || d.contactName === client.name
  );
  const totalDeals = clientDeals.reduce((s, d) => s + d.value, 0);

  const clientSales = sales.filter((s) => s.clientId === client.id);
  const totalSales = clientSales.reduce((s, v) => s + v.total, 0);

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
            <h3>Preferências</h3>
            <div className="prefs-grid">
              <div className="pref-item">
                <IconHeart size={14} />
                <div>
                  <span className="pref-label">Produtos favoritos</span>
                  <span className="pref-value">{client.favoriteProducts || "—"}</span>
                </div>
              </div>
              <div className="pref-item">
                <IconStar size={14} />
                <div>
                  <span className="pref-label">Marca favorita</span>
                  <span className="pref-value">{client.favoriteBrand || "—"}</span>
                </div>
              </div>
              <div className="pref-item">
                <IconCategory size={14} />
                <div>
                  <span className="pref-label">Categoria preferida</span>
                  <span className="pref-value">{client.preferredCategory || "—"}</span>
                </div>
              </div>
              <div className="pref-item">
                <IconCalendarStats size={14} />
                <div>
                  <span className="pref-label">Frequência de compra</span>
                  <span className="pref-value">{client.purchaseFrequency || "—"}</span>
                </div>
              </div>
              <div className="pref-item">
                <IconDeviceMobile size={14} />
                <div>
                  <span className="pref-label">Canal preferido</span>
                  <span className="pref-value">{client.preferredChannel || "—"}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="detail-section">
            <h3>Compras Realizadas ({clientSales.length})</h3>
            {clientSales.length === 0 ? (
              <p className="detail-empty">Nenhuma compra registrada</p>
            ) : (
              <>
                <table>
                  <thead>
                    <tr>
                      <th>Nº Venda</th>
                      <th>Data</th>
                      <th>Produtos</th>
                      <th>Total</th>
                      <th>Pagamento</th>
                      <th>Status</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {clientSales.map((s) => (
                      <tr key={s.id}>
                        <td className="cell-sale-num" style={{ cursor: "pointer", color: "var(--accent)", fontWeight: 600 }} onClick={() => setDetailSale(s)}>{s.saleNumber}</td>
                        <td className="cell-date">{formatDate(s.date)}</td>
                        <td>{s.items.map((i) => i.product).join(", ")}</td>
                        <td className="cell-spent">{formatCurrency(s.total)}</td>
                        <td>{s.installments > 1 ? `${s.installments}x ${s.cardBrand}` : s.paymentMethod === "pix" ? "PIX" : s.paymentMethod === "debit_card" ? "Débito" : "À vista"}</td>
                        <td>
                          <span className="status" style={{ background: `${paymentStatusColors[s.paymentStatus]}18`, color: paymentStatusColors[s.paymentStatus] }}>
                            {paymentStatusLabels[s.paymentStatus]}
                          </span>
                        </td>
                        <td>
                          <button className="btn-icon" onClick={() => setDetailSale(s)} title="Detalhes">📋</button>
                        </td>
                      </tr>
                    ))}
                    <tr className="detail-total">
                      <td><strong>Total</strong></td>
                      <td></td>
                      <td></td>
                      <td className="cell-spent"><strong>{formatCurrency(totalSales)}</strong></td>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                  </tbody>
                </table>
              </>
            )}
          </div>

          <div className="detail-section">
            <h3>Negócios no Pipeline</h3>
            {clientDeals.length === 0 ? (
              <p className="detail-empty">Nenhum negócio encontrado</p>
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
      <SaleDetailModal sale={detailSale} onClose={() => setDetailSale(null)} />
    </div>
  );
}

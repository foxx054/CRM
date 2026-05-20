import { useState } from "react";
import type { Sale } from "../types/sale";
import { channelLabels, paymentStatusLabels, paymentStatusColors } from "../types/sale";
import { useData } from "../contexts/DataContext";
import SaleDetailModal from "../components/SaleDetailModal";
import "./Vendas.css";

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatDate(dateStr: string) {
  return new Date(dateStr + "T12:00:00").toLocaleDateString("pt-BR");
}

export default function Vendas() {
  const { sales, setSales } = useData();
  const [search, setSearch] = useState("");
  const [detailSale, setDetailSale] = useState<Sale | null>(null);

  const filtered = sales.filter((s) =>
    [s.saleNumber, s.clientName, s.seller, s.store, s.paymentMethod, s.cardBrand].some((field) =>
      field.toLowerCase().includes(search.toLowerCase())
    )
  );

  function handleDelete(id: string) {
    if (confirm("Tem certeza que deseja excluir esta venda?")) {
      setSales((prev) => prev.filter((s) => s.id !== id));
    }
  }

  return (
    <div className="vendas-page">
      <div className="vendas-header">
        <div>
          <h1>Histórico de Compras</h1>
          <p className="subtitle">{sales.length} vendas registradas</p>
        </div>
      </div>

      <div className="search-bar">
        <input
          placeholder="Buscar por número, cliente, vendedor, loja..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Nº Venda</th>
              <th>Data</th>
              <th>Cliente</th>
              <th>Loja</th>
              <th>Vendedor</th>
              <th>Canal</th>
              <th>Total</th>
              <th>Pagamento</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => (
              <tr key={s.id}>
                <td className="cell-sale-num" style={{ cursor: "pointer" }} onClick={() => setDetailSale(s)}>{s.saleNumber}</td>
                <td className="cell-date">{formatDate(s.date)}</td>
                <td>{s.clientName}</td>
                <td>{s.store}</td>
                <td>{s.seller}</td>
                <td>{channelLabels[s.channel]}</td>
                <td className="cell-spent">{formatCurrency(s.total)}</td>
                <td>{s.installments > 1 ? `${s.installments}x ${s.cardBrand}` : s.paymentMethod === "pix" ? "PIX" : s.paymentMethod === "debit_card" ? "Débito" : "À vista"}</td>
                <td>
                  <span className="status" style={{ background: `${paymentStatusColors[s.paymentStatus]}18`, color: paymentStatusColors[s.paymentStatus] }}>
                    {paymentStatusLabels[s.paymentStatus]}
                  </span>
                </td>
                <td className="cell-actions">
                  <button className="btn-icon" onClick={() => setDetailSale(s)} title="Detalhes">📋</button>
                  <button className="btn-icon" onClick={() => handleDelete(s.id)} title="Excluir">🗑️</button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={10} className="empty">Nenhuma venda encontrada</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <SaleDetailModal
        sale={detailSale}
        onClose={() => setDetailSale(null)}
      />
    </div>
  );
}

import type { Sale } from "../types/sale";
import { channelLabels, paymentStatusLabels, paymentStatusColors } from "../types/sale";
import "./SaleDetailModal.css";

interface Props {
  sale: Sale | null;
  onClose: () => void;
}

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatDate(dateStr: string) {
  return new Date(dateStr + "T12:00:00").toLocaleDateString("pt-BR");
}

export default function SaleDetailModal({ sale, onClose }: Props) {
  if (!sale) return null;

  const itemsTotal = sale.items.reduce((s, i) => s + i.quantity * i.unitPrice, 0);
  const totalDiscount = sale.items.reduce((s, i) => s + i.discount, 0);
  const totalTaxes = sale.items.reduce((s, i) => s + i.taxes, 0);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal-sale" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Venda {sale.saleNumber}</h2>
          <button className="btn-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div className="sale-info-grid">
            <div className="sale-info-item">
              <span className="sale-info-label">Data</span>
              <span>{formatDate(sale.date)}</span>
            </div>
            <div className="sale-info-item">
              <span className="sale-info-label">Cliente</span>
              <span>{sale.clientName}</span>
            </div>
            <div className="sale-info-item">
              <span className="sale-info-label">Loja</span>
              <span>{sale.store}</span>
            </div>
            <div className="sale-info-item">
              <span className="sale-info-label">Vendedor</span>
              <span>{sale.seller}</span>
            </div>
            <div className="sale-info-item">
              <span className="sale-info-label">Caixa</span>
              <span>{sale.cashier}</span>
            </div>
            <div className="sale-info-item">
              <span className="sale-info-label">Canal de venda</span>
              <span>{channelLabels[sale.channel]}</span>
            </div>
          </div>

          <h3>Produtos</h3>
          <table className="sale-items-table">
            <thead>
              <tr>
                <th>SKU</th>
                <th>Cód. Barras</th>
                <th>Produto</th>
                <th>Marca</th>
                <th>Categoria</th>
                <th>Qtd</th>
                <th>Valor Unit.</th>
                <th>Desconto</th>
                <th>Impostos</th>
                <th>Garantia</th>
              </tr>
            </thead>
            <tbody>
              {sale.items.map((item, i) => (
                <tr key={i}>
                  <td className="cell-mono">{item.sku}</td>
                  <td className="cell-mono">{item.barcode}</td>
                  <td>{item.product}</td>
                  <td>{item.brand}</td>
                  <td>{item.category}</td>
                  <td className="cell-center">{item.quantity}</td>
                  <td className="cell-spent">{formatCurrency(item.unitPrice)}</td>
                  <td className="cell-spent">{item.discount > 0 ? formatCurrency(item.discount) : "—"}</td>
                  <td className="cell-spent">{formatCurrency(item.taxes)}</td>
                  <td>{item.warranty}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="sale-subtotals">
            <div className="sale-sub-row">
              <span>Subtotal</span>
              <span>{formatCurrency(itemsTotal)}</span>
            </div>
            <div className="sale-sub-row">
              <span>Descontos</span>
              <span className="sale-discount">-{formatCurrency(totalDiscount)}</span>
            </div>
            <div className="sale-sub-row">
              <span>Impostos</span>
              <span>{formatCurrency(totalTaxes)}</span>
            </div>
            <div className="sale-sub-row sale-total">
              <span>Total</span>
              <span>{formatCurrency(sale.total)}</span>
            </div>
          </div>

          <h3>Pagamento</h3>
          <div className="sale-payment-grid">
            <div className="sale-info-item">
              <span className="sale-info-label">Forma de pagamento</span>
              <span>{sale.paymentMethod === "credit_card" ? "Cartão de Crédito" : sale.paymentMethod === "debit_card" ? "Cartão de Débito" : sale.paymentMethod === "pix" ? "PIX" : sale.paymentMethod === "cash" ? "Dinheiro" : "Boleto"}</span>
            </div>
            <div className="sale-info-item">
              <span className="sale-info-label">Parcelas</span>
              <span>{sale.installments}x</span>
            </div>
            {sale.cardBrand && (
              <div className="sale-info-item">
                <span className="sale-info-label">Bandeira</span>
                <span>{sale.cardBrand}</span>
              </div>
            )}
            {sale.pixKey && (
              <div className="sale-info-item">
                <span className="sale-info-label">Chave PIX</span>
                <span>{sale.pixKey}</span>
              </div>
            )}
            <div className="sale-info-item">
              <span className="sale-info-label">Cashback</span>
              <span>{sale.cashback > 0 ? formatCurrency(sale.cashback) : "—"}</span>
            </div>
            <div className="sale-info-item">
              <span className="sale-info-label">Status</span>
              <span className="status" style={{ background: `${paymentStatusColors[sale.paymentStatus]}18`, color: paymentStatusColors[sale.paymentStatus] }}>
                {paymentStatusLabels[sale.paymentStatus]}
              </span>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Fechar</button>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import type { Client } from "../types/client";

interface Props {
  open: boolean;
  client: Client | null;
  onClose: () => void;
  onSave: (data: Omit<Client, "id" | "createdAt">) => void;
}

const emptyForm: Omit<Client, "id" | "createdAt"> = {
  name: "",
  cpf: "",
  email: "",
  phone: "",
  totalSpent: 0,
  status: "lead",
  favoriteProducts: "",
  favoriteBrand: "",
  preferredCategory: "",
  purchaseFrequency: "",
  preferredChannel: "",
};

export default function ClientFormModal({ open, client, onClose, onSave }: Props) {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (client) {
      setForm({
        name: client.name,
        cpf: client.cpf,
        email: client.email,
        phone: client.phone,
        totalSpent: client.totalSpent,
        status: client.status,
        favoriteProducts: client.favoriteProducts,
        favoriteBrand: client.favoriteBrand,
        preferredCategory: client.preferredCategory,
        purchaseFrequency: client.purchaseFrequency,
        preferredChannel: client.preferredChannel,
      });
    } else {
      setForm(emptyForm);
    }
  }, [client, open]);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
    onClose();
  };

  const isValid = form.name.trim() && form.email.trim();

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{client ? "Editar Cliente" : "Novo Cliente"}</h2>
          <button className="btn-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <label>
              Nome *
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Nome completo"
              />
            </label>
            <label>
              CPF
              <input
                value={form.cpf}
                onChange={(e) => setForm({ ...form, cpf: e.target.value })}
                placeholder="000.000.000-00"
              />
            </label>
            <label>
              Email *
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="email@exemplo.com"
              />
            </label>
            <label>
              Telefone
              <input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="(11) 99999-9999"
              />
            </label>
            <label>
              Total Gasto (R$)
              <input
                type="number"
                value={form.totalSpent || ""}
                onChange={(e) => setForm({ ...form, totalSpent: Number(e.target.value) })}
                placeholder="0,00"
              />
            </label>
            <label>
              Status
              <select
                value={form.status}
                onChange={(e) =>
                  setForm({ ...form, status: e.target.value as Client["status"] })
                }
              >
                <option value="lead">Lead</option>
                <option value="active">Ativo</option>
                <option value="inactive">Inativo</option>
              </select>
            </label>
            <hr className="divider" />
            <h3 className="section-title">Preferências</h3>
            <label>
              Produtos favoritos
              <input value={form.favoriteProducts} onChange={(e) => setForm({ ...form, favoriteProducts: e.target.value })} placeholder="Smart TVs, Geladeiras" />
            </label>
            <label>
              Marca favorita
              <input value={form.favoriteBrand} onChange={(e) => setForm({ ...form, favoriteBrand: e.target.value })} placeholder="Samsung" />
            </label>
            <label>
              Categoria preferida
              <select value={form.preferredCategory} onChange={(e) => setForm({ ...form, preferredCategory: e.target.value })}>
                <option value="">Selecione</option>
                <option value="Eletrodomésticos">Eletrodomésticos</option>
                <option value="Móveis">Móveis</option>
                <option value="Informática">Informática</option>
                <option value="Telefonia">Telefonia</option>
                <option value="Materiais de Construção">Materiais de Construção</option>
                <option value="Ferramentas">Ferramentas</option>
                <option value="Outro">Outro</option>
              </select>
            </label>
            <label>
              Frequência de compra
              <select value={form.purchaseFrequency} onChange={(e) => setForm({ ...form, purchaseFrequency: e.target.value })}>
                <option value="">Selecione</option>
                <option value="Semanal">Semanal</option>
                <option value="Quinzenal">Quinzenal</option>
                <option value="Mensal">Mensal</option>
                <option value="Trimestral">Trimestral</option>
                <option value="Semestral">Semestral</option>
                <option value="Anual">Anual</option>
              </select>
            </label>
            <label>
              Canal preferido
              <select value={form.preferredChannel} onChange={(e) => setForm({ ...form, preferredChannel: e.target.value })}>
                <option value="">Selecione</option>
                <option value="WhatsApp">WhatsApp</option>
                <option value="E-mail">E-mail</option>
                <option value="Ligação">Ligação</option>
                <option value="Presencial">Presencial</option>
              </select>
            </label>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={!isValid}>
              {client ? "Salvar" : "Criar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
